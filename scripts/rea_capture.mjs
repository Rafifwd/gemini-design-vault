#!/usr/bin/env node
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const VAULT_ROOT = path.resolve(__dirname, '..');
const REA_DIR = path.join(VAULT_ROOT, 'rea');
const ASSETS_DIR = path.join(VAULT_ROOT, 'references', 'assets');
const CHROME_BIN = '/home/rafif/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome';

const TARGETS = [
  { slug: 'apple', url: 'https://www.apple.com' },
  { slug: 'linear', url: 'https://linear.app' },
  { slug: 'vercel', url: 'https://vercel.com' },
  { slug: 'stripe', url: 'https://stripe.com' },
  { slug: 'raycast', url: 'https://www.raycast.com' },
  { slug: 'goodui', url: 'https://goodui.dev' },
];

fs.mkdirSync(REA_DIR, { recursive: true });
fs.mkdirSync(ASSETS_DIR, { recursive: true });

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function launchChrome(userDataDir) {
  return new Promise((resolve, reject) => {
    const proc = spawn(
      CHROME_BIN,
      [
        '--headless=new',
        '--no-sandbox',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--no-first-run',
        '--no-default-browser-check',
        '--window-size=1440,900',
        '--remote-debugging-port=0',
        `--user-data-dir=${userDataDir}`,
        'about:blank',
      ],
      { stdio: ['ignore', 'pipe', 'pipe'] }
    );

    let stderrBuf = '';
    const timer = setTimeout(() => {
      proc.kill('SIGKILL');
      reject(new Error(`Chrome launch timeout. stderr: ${stderrBuf}`));
    }, 15000);

    proc.stderr.on('data', (chunk) => {
      stderrBuf += chunk.toString();
      const match = stderrBuf.match(/DevTools listening on (ws:\/\/127\.0\.0\.1:(\d+)\/[^\s]+)/);
      if (match) {
        clearTimeout(timer);
        resolve({ proc, port: Number(match[2]), browserWs: match[1] });
      }
    });

    proc.on('exit', (code) => {
      clearTimeout(timer);
      reject(new Error(`Chrome exited early with code ${code}. stderr: ${stderrBuf}`));
    });
  });
}

class CdpClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.nextId = 1;
    this.pending = new Map();
    this.listeners = new Map();
  }

  async connect() {
    await new Promise((resolve, reject) => {
      const t = setTimeout(() => reject(new Error('WebSocket connect timeout')), 10000);
      this.ws.addEventListener('open', () => {
        clearTimeout(t);
        resolve();
      });
      this.ws.addEventListener('error', (err) => {
        clearTimeout(t);
        reject(new Error(err?.message || 'WebSocket error'));
      });
    });

    this.ws.addEventListener('message', (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject, timer } = this.pending.get(msg.id);
        clearTimeout(timer);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message || JSON.stringify(msg.error)));
        else resolve(msg.result);
      } else if (msg.method && this.listeners.has(msg.method)) {
        for (const fn of this.listeners.get(msg.method)) fn(msg.params);
      }
    });
  }

  send(method, params = {}, timeoutMs = 20000) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`CDP timeout on ${method}`));
      }, timeoutMs);
      this.pending.set(id, { resolve, reject, timer });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  once(method, timeoutMs = 20000) {
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        off();
        resolve(false);
      }, timeoutMs);
      const handler = () => {
        clearTimeout(timer);
        off();
        resolve(true);
      };
      const off = () => {
        const set = this.listeners.get(method);
        if (set) set.delete(handler);
      };
      if (!this.listeners.has(method)) this.listeners.set(method, new Set());
      this.listeners.get(method).add(handler);
    });
  }

  close() {
    try {
      this.ws.close();
    } catch (_) {}
  }
}

const EXTRACT_EXPR = `(() => {
  const isVisible = (el) => {
    if (!el) return false;
    const st = getComputedStyle(el);
    if (st.display === 'none' || st.visibility === 'hidden' || parseFloat(st.opacity) === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  const pickType = (el) => {
    if (!el) return null;
    const st = getComputedStyle(el);
    return {
      text: (el.innerText || el.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 80),
      fontFamily: st.fontFamily,
      fontSize: st.fontSize,
      fontWeight: st.fontWeight,
      letterSpacing: st.letterSpacing,
      lineHeight: st.lineHeight,
      color: st.color
    };
  };

  const bodySt = getComputedStyle(document.body);
  const headerEl = Array.from(document.querySelectorAll('header, nav')).find((el) => {
    const r = el.getBoundingClientRect();
    return isVisible(el) && r.height >= 32 && r.height <= 160 && r.top <= 120;
  });
  let headerInfo = null;
  if (headerEl) {
    const hs = getComputedStyle(headerEl);
    headerInfo = {
      tag: headerEl.tagName.toLowerCase(),
      height: Math.round(headerEl.getBoundingClientRect().height) + 'px',
      backgroundColor: hs.backgroundColor,
      backdropFilter: hs.backdropFilter || hs.webkitBackdropFilter || 'none',
      borderBottom: hs.borderBottom,
      linkCount: headerEl.querySelectorAll('a, button').length
    };
  }

  const h1El = Array.from(document.querySelectorAll('h1')).find(isVisible) || Array.from(document.querySelectorAll('h2')).find(isVisible);
  const h2El = Array.from(document.querySelectorAll('h2')).find((el) => isVisible(el) && el !== h1El);

  const btnCandidates = Array.from(document.querySelectorAll('a, button')).filter((el) => {
    if (!isVisible(el)) return false;
    const r = el.getBoundingClientRect();
    if (r.width < 44 || r.height < 26 || r.height > 84 || r.top < 0 || r.top > 900) return false;
    const txt = (el.innerText || '').trim();
    if (!txt || txt.length > 40) return false;
    const st = getComputedStyle(el);
    const hasBg = st.backgroundColor && st.backgroundColor !== 'rgba(0, 0, 0, 0)' && st.backgroundColor !== 'transparent';
    const hasBorder = parseFloat(st.borderTopWidth) > 0 && st.borderTopColor !== 'rgba(0, 0, 0, 0)';
    return hasBg || hasBorder;
  });

  const seenBtn = new Set();
  const buttons = [];
  for (const el of btnCandidates) {
    const st = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const txt = (el.innerText || '').trim().replace(/\\s+/g, ' ');
    const sig = txt + '|' + st.backgroundColor + '|' + st.borderRadius;
    if (seenBtn.has(sig)) continue;
    seenBtn.add(sig);
    buttons.push({
      text: txt,
      tag: el.tagName.toLowerCase(),
      height: Math.round(r.height) + 'px',
      width: Math.round(r.width) + 'px',
      padding: st.padding,
      borderRadius: st.borderRadius,
      backgroundColor: st.backgroundColor,
      color: st.color,
      border: st.border,
      boxShadow: st.boxShadow,
      fontSize: st.fontSize,
      fontWeight: st.fontWeight,
      transitionDuration: st.transitionDuration
    });
    if (buttons.length >= 6) break;
  }

  const fontCounts = new Map();
  const bgCounts = new Map();
  const radiusCounts = new Map();
  const allEls = Array.from(document.querySelectorAll('body, header, nav, main, section, h1, h2, p, a, button')).slice(0, 150);
  for (const el of allEls) {
    if (!isVisible(el)) continue;
    const st = getComputedStyle(el);
    const ff = st.fontFamily.split(',')[0].replace(/["']/g, '').trim();
    if (ff) fontCounts.set(ff, (fontCounts.get(ff) || 0) + 1);
    const bg = st.backgroundColor;
    if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
      bgCounts.set(bg, (bgCounts.get(bg) || 0) + 1);
    }
    const br = st.borderRadius;
    if (br && br !== '0px') radiusCounts.set(br, (radiusCounts.get(br) || 0) + 1);
  }
  const topN = (map, n = 6) => Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, n).map(([k, count]) => ({ value: k, count }));

  return {
    title: document.title,
    finalUrl: location.href,
    viewport: { width: window.innerWidth, height: window.innerHeight },
    body: {
      backgroundColor: bodySt.backgroundColor,
      color: bodySt.color,
      fontFamily: bodySt.fontFamily,
      fontSize: bodySt.fontSize,
      lineHeight: bodySt.lineHeight
    },
    header: headerInfo,
    h1: pickType(h1El),
    h2: pickType(h2El),
    buttons,
    top_fonts: topN(fontCounts, 5),
    top_backgrounds: topN(bgCounts, 6),
    top_radii: topN(radiusCounts, 6)
  };
})()`;

async function captureSite(port, target) {
  const listRes = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' });
  const tab = await listRes.json();
  const client = new CdpClient(tab.webSocketDebuggerUrl);
  await client.connect();

  try {
    await client.send('Page.enable');
    await client.send('Runtime.enable');
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    const loaded = client.once('Page.loadEventFired', 25000);
    await client.send('Page.navigate', { url: target.url });
    await loaded;
    await client.send('Runtime.evaluate', { expression: 'document.fonts.ready', awaitPromise: true }, 10000).catch(() => {});
    await sleep(1600);

    const shot = await client.send('Page.captureScreenshot', { format: 'png' }, 20000);
    const pngPath = path.join(ASSETS_DIR, `rea-${target.slug}.png`);
    fs.writeFileSync(pngPath, Buffer.from(shot.data, 'base64'));

    const evalRes = await client.send('Runtime.evaluate', { expression: EXTRACT_EXPR, returnByValue: true }, 15000);
    const data = evalRes?.result?.value || {};
    const dossier = {
      slug: target.slug,
      url: target.url,
      captured_at: new Date().toISOString(),
      screenshot: `references/assets/rea-${target.slug}.png`,
      screenshot_bytes: fs.statSync(pngPath).size,
      ...data,
    };
    const jsonPath = path.join(REA_DIR, `${target.slug}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(dossier, null, 2) + '\n', 'utf-8');
    console.log(`OK ${target.slug}: ${dossier.screenshot_bytes} bytes | h1=${dossier.h1?.fontSize || 'none'} | btns=${dossier.buttons?.length || 0}`);
  } catch (err) {
    const errDossier = {
      slug: target.slug,
      url: target.url,
      captured_at: new Date().toISOString(),
      error: err.message,
    };
    fs.writeFileSync(path.join(REA_DIR, `${target.slug}.json`), JSON.stringify(errDossier, null, 2) + '\n', 'utf-8');
    console.error(`FAIL ${target.slug}: ${err.message}`);
  } finally {
    client.close();
    await fetch(`http://127.0.0.1:${port}/json/close/${tab.id}`).catch(() => {});
  }
}

async function main() {
  const filter = process.argv.slice(2).map((s) => s.toLowerCase());
  const selectedTargets = filter.length ? TARGETS.filter((t) => filter.includes(t.slug)) : TARGETS;
  if (!selectedTargets.length) {
    console.error(`No matching REA targets for args: ${filter.join(', ')}`);
    process.exit(1);
  }
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gdv-rea-'));
  let chrome = null;
  try {
    chrome = await launchChrome(tmpDir);
    for (const target of selectedTargets) {
      await captureSite(chrome.port, target);
    }
  } finally {
    if (chrome?.proc) {
      chrome.proc.kill('SIGTERM');
    }
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
