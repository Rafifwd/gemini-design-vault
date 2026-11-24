/* Studio-grade interactive previews for 16 MIT Lego templates & 5 REA benchmarks */
(function () {
  'use strict';

  var DARK_DEFAULT_IDS = {
    'magicui-shimmer-button': true,
    'magicui-border-beam': true,
    'magicui-shiny-button': true,
    'goodui-liquid-glass-button': true,
    'goodui-rainbow-button': true,
    'goodui-spotlight-card': true,
    'goodui-aurora': true,
  };

  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function defaultStageTheme(templateId) {
    return DARK_DEFAULT_IDS[templateId] ? 'dark' : 'light';
  }

  function injectStyles() {
    if (document.getElementById('lego-preview-styles')) return;
    var style = document.createElement('style');
    style.id = 'lego-preview-styles';
    style.textContent = [
      /* Scoped Studio Stage Tokens (supports light & dark stage independently of outer app) */
      '.lego-studio-stage {',
      '  --st-bg: #F6F5F1;',
      '  --st-surface: #FCFBF9;',
      '  --st-subtle: #ECEAE3;',
      '  --st-ink: #1A1816;',
      '  --st-muted: #66615B;',
      '  --st-border: rgba(26, 24, 22, 0.11);',
      '  --st-border-strong: rgba(26, 24, 22, 0.20);',
      '  --st-accent: #0F6E66;',
      '  --st-accent-ink: #FAF9F6;',
      '  --st-accent-tint: rgba(15, 110, 102, 0.10);',
      '  --st-dot: rgba(26, 24, 22, 0.11);',
      '  position: relative;',
      '  min-height: 360px;',
      '  padding: 28px 24px;',
      '  border-radius: 9px;',
      '  border: 1px solid var(--border-strong);',
      '  background-color: var(--st-bg);',
      '  background-image: radial-gradient(var(--st-dot) 1px, transparent 1px);',
      '  background-size: 16px 16px;',
      '  color: var(--st-ink);',
      '  display: flex;',
      '  flex-direction: column;',
      '  align-items: center;',
      '  justify-content: center;',
      '  gap: 16px;',
      '  overflow: hidden;',
      '  transition: background-color 160ms ease-out, color 160ms ease-out;',
      '}',
      '.lego-studio-stage[data-stage-theme="dark"] {',
      '  --st-bg: #0B0C0E;',
      '  --st-surface: #131519;',
      '  --st-subtle: #1B1E24;',
      '  --st-ink: #F2F1EC;',
      '  --st-muted: #93918A;',
      '  --st-border: rgba(242, 241, 236, 0.10);',
      '  --st-border-strong: rgba(242, 241, 236, 0.20);',
      '  --st-accent: #34B399;',
      '  --st-accent-ink: #081512;',
      '  --st-accent-tint: rgba(52, 179, 153, 0.14);',
      '  --st-dot: rgba(242, 241, 236, 0.12);',
      '}',
      '.lp-panel-card { width: 100%; max-width: 520px; background: var(--st-surface); border: 1px solid var(--st-border); border-radius: 10px; padding: 18px 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); }',
      '.lp-row { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }',
      '.lp-note { font-family: var(--font-mono); font-size: 11.5px; color: var(--st-muted); font-variant-numeric: tabular-nums; }',
      '.lp-pill { border: 1px solid var(--st-border); background: var(--st-surface); color: var(--st-muted); padding: 4px 10px; border-radius: 6px; font-size: 11.5px; font-family: var(--font-mono); cursor: pointer; transition: background-color 140ms ease-out, color 140ms ease-out, transform 120ms ease-out; }',
      '.lp-pill:hover { color: var(--st-ink); background: var(--st-subtle); }',
      '.lp-pill:active { transform: scale(0.98); }',
      '.lp-pill[aria-pressed="true"] { background: var(--st-accent-tint); border-color: var(--st-accent); color: var(--st-accent); font-weight: 600; }',
      /* REA Reconstructed Specimen */
      '.lp-rea-stage { border: 1px solid var(--border-strong); border-radius: 10px; overflow: hidden; display: flex; flex-direction: column; }',
      '.lp-rea-nav { display: flex; align-items: center; justify-content: space-between; padding: 0 18px; min-height: 44px; font-size: 12.5px; }',
      '.lp-rea-hero { padding: 26px 22px 28px; display: flex; flex-direction: column; gap: 14px; }',
      '.lp-rea-btn { display: inline-flex; align-items: center; justify-content: center; cursor: pointer; text-decoration: none; font-family: inherit; transition: transform 120ms ease-out, opacity 140ms ease-out, filter 140ms ease-out; }',
      '.lp-rea-btn:hover { filter: brightness(1.06); }',
      '.lp-rea-btn:active { transform: scale(0.97); }',
      '.lp-rea-btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }',
      '.lp-token-table { width: 100%; border-collapse: collapse; font-size: 12px; }',
      '.lp-token-table th, .lp-token-table td { text-align: left; padding: 7px 10px; border-bottom: 1px solid var(--border-hairline); vertical-align: top; }',
      '.lp-token-table th { width: 120px; color: var(--text-secondary); font-weight: 500; }',
      '.lp-token-table tr:last-child th, .lp-token-table tr:last-child td { border-bottom: none; }',
      /* 1. shadcn-button */
      '.lp-sh-btn { position: relative; display: inline-flex; align-items: center; justify-content: center; gap: 7px; border-radius: 6px; font-weight: 500; font-family: inherit; cursor: pointer; border: 1px solid transparent; transition: background-color 140ms ease-out, border-color 140ms ease-out, transform 120ms ease-out, opacity 140ms ease-out; }',
      '.lp-sh-btn[data-size="sm"] { height: 32px; padding: 0 12px; font-size: 12px; }',
      '.lp-sh-btn[data-size="default"] { height: 36px; padding: 0 16px; font-size: 13px; }',
      '.lp-sh-btn[data-size="lg"] { height: 42px; padding: 0 22px; font-size: 14px; }',
      '.lp-sh-btn[data-size="icon"] { height: 36px; width: 36px; padding: 0; font-size: 13px; }',
      '.lp-sh-btn:active:not(:disabled) { transform: scale(0.98); }',
      '.lp-sh-btn:focus-visible { outline: 2px solid var(--st-accent); outline-offset: 2px; }',
      '.lp-sh-btn:disabled { opacity: 0.45; cursor: not-allowed; }',
      '.lp-sh-btn[data-variant="default"] { background: var(--st-ink); color: var(--st-surface); box-shadow: inset 0 1px 0 rgba(255,255,255,0.16); }',
      '.lp-sh-btn[data-variant="default"]:hover:not(:disabled) { opacity: 0.90; }',
      '.lp-sh-btn[data-variant="secondary"] { background: var(--st-subtle); color: var(--st-ink); border-color: var(--st-border); }',
      '.lp-sh-btn[data-variant="secondary"]:hover:not(:disabled) { border-color: var(--st-border-strong); }',
      '.lp-sh-btn[data-variant="outline"] { background: transparent; color: var(--st-ink); border-color: var(--st-border-strong); }',
      '.lp-sh-btn[data-variant="outline"]:hover:not(:disabled) { background: var(--st-subtle); }',
      '.lp-sh-btn[data-variant="ghost"] { background: transparent; color: var(--st-muted); }',
      '.lp-sh-btn[data-variant="ghost"]:hover:not(:disabled) { background: var(--st-subtle); color: var(--st-ink); }',
      '.lp-sh-btn[data-variant="destructive"] { background: #B91C1C; color: #FFFFFF; box-shadow: inset 0 1px 0 rgba(255,255,255,0.16); }',
      '.lp-sh-btn[data-variant="destructive"]:hover:not(:disabled) { background: #991B1B; }',
      '.lp-sh-btn[data-variant="link"] { background: transparent; color: var(--st-accent); text-decoration: underline; text-underline-offset: 4px; }',
      '.lp-sh-btn.is-loading .lp-btn-lbl { opacity: 0; }',
      '.lp-sh-btn .lp-spin { position: absolute; inset: 0; margin: auto; width: 14px; height: 14px; opacity: 0; pointer-events: none; }',
      '.lp-sh-btn.is-loading .lp-spin { opacity: 1; animation: lp-rot 650ms linear infinite; }',
      '@keyframes lp-rot { to { transform: rotate(360deg); } }',
      /* 2. magicui-shimmer-button */
      '.lp-shimmer-btn { position: relative; overflow: hidden; display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 26px; border-radius: 9999px; background: #0E1013; color: #F5F4EF; border: 1px solid rgba(255,255,255,0.14); font-size: 14px; font-weight: 500; cursor: pointer; box-shadow: 0 8px 24px rgba(0,0,0,0.28); transition: transform 150ms ease-out; }',
      '.lp-shimmer-btn::before { content: ""; position: absolute; inset: -160%; background: conic-gradient(from 0deg, transparent 0 300deg, rgba(255,255,255,0.85) 330deg, transparent 360deg); animation: lp-rot 3s linear infinite; pointer-events: none; }',
      '.lp-shimmer-btn::after { content: ""; position: absolute; inset: 1.5px; border-radius: 9999px; background: #0E1013; box-shadow: inset 0 -7px 14px rgba(255,255,255,0.16); pointer-events: none; }',
      '.lp-shimmer-btn > span { position: relative; z-index: 1; display: inline-flex; align-items: center; gap: 8px; }',
      '.lp-shimmer-btn:hover { transform: translateY(-1px); }',
      '.lp-shimmer-btn:active { transform: translateY(1px) scale(0.98); }',
      /* 3. magicui-shiny-button */
      '@keyframes lp-sweep { 0% { background-position: 130% 0; } 100% { background-position: -130% 0; } }',
      '.lp-shiny-btn { position: relative; overflow: hidden; padding: 10px 22px; border-radius: 8px; border: 1px solid var(--st-border-strong); background: var(--st-surface); color: var(--st-ink); font-size: 13.5px; font-weight: 500; cursor: pointer; box-shadow: inset 0 1px 0 rgba(255,255,255,0.14), 0 2px 6px rgba(0,0,0,0.08); transition: transform 140ms ease-out, box-shadow 140ms ease-out; }',
      '.lp-shiny-btn::after { content: ""; position: absolute; inset: 0; background: linear-gradient(112deg, transparent 34%, rgba(255,255,255,0.34) 50%, transparent 66%); background-size: 230% 100%; animation: lp-sweep 2.6s ease-in-out infinite; pointer-events: none; }',
      '.lp-shiny-btn:active { transform: scale(0.97); }',
      /* 4. mp-magnetic */
      '.lp-mag-arena { width: 100%; max-width: 460px; height: 196px; border: 1px dashed var(--st-border-strong); border-radius: 10px; background: var(--st-surface); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; }',
      '.lp-mag-btn { padding: 11px 24px; border-radius: 9999px; border: 1px solid var(--st-border-strong); background: var(--st-accent); color: var(--st-accent-ink); font-size: 13.5px; font-weight: 600; cursor: pointer; will-change: transform; box-shadow: inset 0 1px 0 rgba(255,255,255,0.22); }',
      /* 5. mp-animated-background */
      '.lp-anim-nav { position: relative; display: inline-flex; padding: 4px; border-radius: 9px; background: var(--st-subtle); border: 1px solid var(--st-border); gap: 2px; }',
      '.lp-anim-pill { position: absolute; top: 4px; left: 4px; height: calc(100% - 8px); border-radius: 6px; background: var(--st-surface); border: 1px solid var(--st-border); box-shadow: 0 1px 2px rgba(0,0,0,0.08); transition: transform 180ms cubic-bezier(0.2, 0, 0, 1), width 180ms cubic-bezier(0.2, 0, 0, 1); pointer-events: none; }',
      '.lp-anim-item { position: relative; z-index: 1; border: none; background: transparent; padding: 6px 14px; font-size: 13px; font-weight: 500; color: var(--st-muted); cursor: pointer; border-radius: 6px; }',
      '.lp-anim-item[aria-selected="true"] { color: var(--st-ink); font-weight: 600; }',
      '.lp-tile-grid { position: relative; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; width: 100%; max-width: 460px; padding: 6px; border-radius: 10px; background: var(--st-surface); border: 1px solid var(--st-border); }',
      '.lp-tile-hl { position: absolute; top: 0; left: 0; border-radius: 7px; background: var(--st-accent-tint); border: 1px solid var(--st-accent); opacity: 0; pointer-events: none; transition: transform 200ms cubic-bezier(0.2, 0, 0, 1), width 200ms cubic-bezier(0.2, 0, 0, 1), height 200ms cubic-bezier(0.2, 0, 0, 1), opacity 140ms ease-out; }',
      '.lp-tile { position: relative; z-index: 1; padding: 12px 14px; border-radius: 7px; cursor: pointer; }',
      /* 6. shadcn-tabs */
      '.lp-tabs-list { display: inline-flex; padding: 3px; border-radius: 8px; background: var(--st-subtle); border: 1px solid var(--st-border); gap: 2px; }',
      '.lp-tab-trig { border: none; background: transparent; color: var(--st-muted); padding: 6px 14px; border-radius: 6px; font-size: 12.5px; font-weight: 500; cursor: pointer; }',
      '.lp-tab-trig[aria-selected="true"] { background: var(--st-surface); color: var(--st-ink); font-weight: 600; box-shadow: 0 1px 2px rgba(0,0,0,0.08); }',
      /* 7. shadcn-command */
      '.lp-cmd-box { width: 100%; max-width: 480px; border: 1px solid var(--st-border-strong); border-radius: 10px; background: var(--st-surface); box-shadow: 0 12px 30px rgba(0,0,0,0.12); overflow: hidden; }',
      '.lp-cmd-head { display: flex; align-items: center; gap: 8px; padding: 10px 14px; border-bottom: 1px solid var(--st-border); }',
      '.lp-cmd-input { flex: 1; border: none; background: transparent; color: var(--st-ink); font-size: 13px; font-family: inherit; outline: none; }',
      '.lp-cmd-list { display: flex; flex-direction: column; padding: 6px; gap: 2px; max-height: 200px; overflow-y: auto; }',
      '.lp-cmd-grp { font-family: var(--font-mono); font-size: 10.5px; color: var(--st-muted); padding: 6px 8px 2px; text-transform: uppercase; letter-spacing: 0.04em; }',
      '.lp-cmd-item { display: flex; justify-content: space-between; align-items: center; border: none; background: transparent; width: 100%; text-align: left; padding: 7px 10px; border-radius: 6px; font-size: 12.5px; color: var(--st-ink); cursor: pointer; }',
      '.lp-cmd-item[data-active="true"], .lp-cmd-item:hover { background: var(--st-accent-tint); color: var(--st-accent); }',
      /* 8. magicui-bento-grid */
      '.lp-bento { width: 100%; max-width: 560px; display: grid; grid-template-columns: 1.4fr 1fr; gap: 10px; }',
      '.lp-bento-card { position: relative; overflow: hidden; border: 1px solid var(--st-border); border-radius: 10px; padding: 16px; background: var(--st-surface); min-height: 136px; display: flex; flex-direction: column; justify-content: space-between; }',
      '.lp-bento-inner { transition: transform 200ms cubic-bezier(0.2, 0, 0, 1); }',
      '.lp-bento-cta { font-size: 12px; font-weight: 600; color: var(--st-accent); opacity: 0; transform: translateY(8px); transition: opacity 180ms ease-out, transform 180ms ease-out; }',
      '.lp-bento-card:hover .lp-bento-inner { transform: translateY(-8px); }',
      '.lp-bento-card:hover .lp-bento-cta { opacity: 1; transform: translateY(0); }',
      /* 9. magicui-border-beam */
      '.lp-beam-wrap { position: relative; width: 100%; max-width: 440px; border-radius: 11px; padding: 1.5px; overflow: hidden; background: var(--st-border); }',
      '.lp-beam-spin { position: absolute; inset: -140%; background: conic-gradient(from 0deg, transparent 0 290deg, var(--beam-color, #34B399) 335deg, transparent 360deg); animation: lp-rot 3.4s linear infinite; pointer-events: none; }',
      '.lp-beam-card { position: relative; z-index: 1; background: var(--st-surface); border-radius: 9.5px; padding: 18px 20px; display: flex; flex-direction: column; gap: 10px; }',
      /* 12 & 16 modal overlay inside stage */
      '.lp-stage-overlay { position: absolute; inset: 0; z-index: 10; background: rgba(11, 12, 14, 0.45); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; padding: 18px; }',
      '.lp-stage-dialog { width: 100%; max-width: 390px; background: var(--st-surface); border: 1px solid var(--st-border-strong); border-radius: 10px; padding: 18px 20px; box-shadow: 0 18px 40px rgba(0,0,0,0.22); display: flex; flex-direction: column; gap: 12px; transition: transform 180ms cubic-bezier(0.16, 1, 0.3, 1), opacity 160ms ease-out; }',
      /* 13. mp-disclosure */
      '.lp-disc-item { border-bottom: 1px solid var(--st-border); padding: 10px 0; }',
      '.lp-disc-item:last-child { border-bottom: none; }',
      '.lp-disc-body { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 200ms cubic-bezier(0.2, 0, 0, 1); }',
      '.lp-disc-body[data-open="true"] { grid-template-rows: 1fr; }',
      '.lp-disc-inner { overflow: hidden; font-size: 12.5px; color: var(--st-muted); }',
      /* 14. sonner-styles */
      '.lp-sonner-deck { position: relative; width: 100%; max-width: 420px; height: 180px; display: flex; align-items: flex-end; justify-content: flex-end; }',
      '.lp-sonner-item { position: absolute; right: 0; bottom: 0; width: 100%; padding: 11px 14px; border-radius: 8px; border: 1px solid var(--st-border-strong); background: var(--st-surface); box-shadow: 0 6px 18px rgba(0,0,0,0.12); display: flex; align-items: center; justify-content: space-between; gap: 10px; font-size: 12.5px; transition: transform 320ms cubic-bezier(0.16, 1, 0.3, 1), opacity 240ms ease-out; }',
      /* 15. shadcn-input */
      '.lp-input { width: 100%; height: 36px; padding: 0 11px; border-radius: 6px; border: 1px solid var(--st-border-strong); background: var(--st-bg); color: var(--st-ink); font-family: inherit; font-size: 13px; transition: border-color 140ms ease-out, box-shadow 140ms ease-out; }',
      '.lp-input:focus-visible { outline: none; border-color: var(--st-accent); box-shadow: 0 0 0 3px var(--st-accent-tint); }',
      '.lp-input[aria-invalid="true"] { border-color: #B91C1C; box-shadow: 0 0 0 3px rgba(185,28,28,0.16); }',
      '.lp-input:disabled { opacity: 0.45; cursor: not-allowed; }',
      /* 17-28 goodui.dev interactive demos */
      '.lp-hold-btn { position: relative; overflow: hidden; height: 42px; padding: 0 22px; border-radius: 10px; border: 1px solid rgba(220,38,38,0.35); background: rgba(220,38,38,0.10); color: #B91C1C; font-size: 13.5px; font-weight: 600; cursor: pointer; user-select: none; display: inline-flex; align-items: center; gap: 8px; }',
      '.lego-studio-stage[data-stage-theme="dark"] .lp-hold-btn { color: #FCA5A5; background: rgba(220,38,38,0.18); border-color: rgba(248,113,113,0.40); }',
      '.lp-hold-fill { position: absolute; inset: 0; width: 0%; background: #DC2626; pointer-events: none; transition: none; }',
      '.lp-hold-lbl { position: relative; z-index: 1; transition: color 120ms ease; }',
      '.lp-hold-btn[data-holding="true"] .lp-hold-lbl, .lp-hold-btn[data-done="true"] .lp-hold-lbl { color: #FFFFFF; }',
      '.lp-glass-backdrop { width: 100%; max-width: 480px; padding: 28px 20px; border-radius: 12px; background: radial-gradient(circle at 18% 22%, #FA520F, transparent 48%), radial-gradient(circle at 82% 72%, #5200FF, transparent 52%), linear-gradient(135deg, #13091F, #06242B); display: flex; flex-direction: column; align-items: center; gap: 14px; border: 1px solid rgba(255,255,255,0.14); }',
      '.lp-lglass-btn { position: relative; isolation: isolate; height: 42px; padding: 0 22px; border-radius: 9999px; border: 1px solid rgba(255,255,255,0.32); color: #FFFFFF; font-size: 13.5px; font-weight: 600; cursor: pointer; background: linear-gradient(180deg, rgba(255,255,255,0.26), rgba(255,255,255,0.08)); backdrop-filter: blur(14px) saturate(170%); -webkit-backdrop-filter: blur(14px) saturate(170%); box-shadow: inset 0 1px 0 rgba(255,255,255,0.5), 0 10px 26px rgba(0,0,0,0.34); transition: transform 160ms ease; }',
      '.lp-lglass-btn::before { content: ""; position: absolute; inset: 0; border-radius: inherit; z-index: -1; pointer-events: none; background: radial-gradient(100px circle at var(--gx, 50%) var(--gy, -20%), rgba(255,255,255,0.55), transparent 70%); opacity: 0.45; transition: opacity 220ms ease; }',
      '.lp-lglass-btn:hover::before { opacity: 1; }',
      '.lp-lglass-btn:hover { transform: scale(1.03); }',
      '.lp-lglass-btn:active { transform: scale(0.96); }',
      '@keyframes lp-rb-flow { to { transform: translateX(-50%); } }',
      '.lp-rainbow-btn { position: relative; isolation: isolate; height: 44px; padding: 0 26px; border-radius: 12px; border: none; background: transparent; color: #FFFFFF; font-size: 14px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; }',
      '.lp-rainbow-border { position: absolute; inset: 0; border-radius: inherit; overflow: hidden; z-index: -2; }',
      '.lp-rainbow-strip { position: absolute; top: 0; left: 0; height: 100%; width: 200%; background: linear-gradient(90deg, #FF3B30, #8B5CF6, #3B82F6, #10B981, #D2FF00, #FF3B30) 0 0 / 50% 100% repeat-x; animation: lp-rb-flow 3s linear infinite; }',
      '.lp-rainbow-face { position: absolute; inset: 2px; border-radius: 10px; background: #111214; z-index: -1; box-shadow: inset 0 1px 0 rgba(255,255,255,0.16); }',
      '@keyframes lp-ripple-go { to { transform: scale(2.8); opacity: 0; } }',
      '.lp-ripple-btn { position: relative; overflow: hidden; height: 40px; padding: 0 20px; border-radius: 8px; border: 1px solid var(--st-border-strong); background: var(--st-accent); color: var(--st-accent-ink); font-size: 13.5px; font-weight: 600; cursor: pointer; }',
      '.lp-ripple-dot { position: absolute; border-radius: 9999px; background: rgba(255,255,255,0.45); transform: scale(0); animation: lp-ripple-go 520ms ease-out forwards; pointer-events: none; }',
      '.lp-spot-card { position: relative; overflow: hidden; width: 100%; max-width: 420px; border-radius: 12px; border: 1px solid var(--st-border-strong); background: var(--st-surface); padding: 20px; }',
      '.lp-spot-glow { position: absolute; inset: 0; pointer-events: none; opacity: 0; transition: opacity 220ms ease; background: radial-gradient(220px circle at var(--sx, 50%) var(--sy, 50%), rgba(60, 255, 208, 0.22), transparent 72%); }',
      '.lp-spot-card:hover .lp-spot-glow { opacity: 1; }',
      '.lp-tilt-stage { perspective: 900px; }',
      '.lp-tilt-card { width: 320px; border-radius: 14px; padding: 20px; background: linear-gradient(145deg, #163300, #0A1702); color: #F4F7F0; border: 1px solid rgba(159, 232, 112, 0.35); box-shadow: 0 18px 38px rgba(0,0,0,0.28); transition: transform 140ms ease-out; transform-style: preserve-3d; }',
      '@keyframes lp-aur-drift { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(18px, -12px) scale(1.12); } }',
      '.lp-aurora-box { position: relative; overflow: hidden; width: 100%; max-width: 480px; height: 210px; border-radius: 12px; background: #09090F; border: 1px solid rgba(255,255,255,0.12); display: flex; flex-direction: column; justify-content: flex-end; padding: 20px; color: #FFFFFF; }',
      '.lp-aur-blob { position: absolute; border-radius: 9999px; filter: blur(42px); opacity: 0.72; animation: lp-aur-drift 7s ease-in-out infinite; pointer-events: none; }',
      '.lp-dock-bar { display: inline-flex; align-items: flex-end; gap: 8px; padding: 8px 12px; border-radius: 14px; background: var(--st-surface); border: 1px solid var(--st-border-strong); box-shadow: 0 10px 26px rgba(0,0,0,0.12); }',
      '.lp-dock-btn { width: 38px; height: 38px; border-radius: 10px; border: 1px solid var(--st-border); background: var(--st-subtle); color: var(--st-ink); display: inline-flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 140ms ease-out, background-color 140ms ease; transform-origin: bottom center; }',
      '@media (prefers-reduced-motion: reduce) {',
      '  .lp-shimmer-btn::before, .lp-shiny-btn::after, .lp-beam-spin, .lp-sh-btn.is-loading .lp-spin, .lp-rainbow-strip, .lp-aur-blob, .lp-ripple-dot { animation: none !important; }',
      '  .lp-anim-pill, .lp-tile-hl, .lp-bento-inner, .lp-bento-cta, .lp-disc-body, .lp-sonner-item, .lp-stage-dialog, .lp-tilt-card, .lp-dock-btn { transition: none !important; }',
      '}',
    ].join('\n');
    document.head.appendChild(style);
  }

  function renderReaSpecimen(dossier) {
    injectStyles();
    if (!dossier || dossier.error) return '';
    var bg = (dossier.body && dossier.body.backgroundColor) || '#FFFFFF';
    var fg = (dossier.body && dossier.body.color) || '#1B1917';
    if (bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') bg = '#FFFFFF';
    if (fg === 'rgb(0, 0, 0)' && bg === '#FFFFFF') fg = '#0A2540';
    var hdr = dossier.header || {};
    var hdrBg = hdr.backgroundColor && hdr.backgroundColor !== 'rgba(0, 0, 0, 0)' ? hdr.backgroundColor : 'transparent';
    var hdrBorder = hdr.borderBottom && !hdr.borderBottom.startsWith('0px') ? hdr.borderBottom : '1px solid rgba(128,128,128,0.16)';
    var h1 = dossier.h1 || {};
    var h2 = dossier.h2 || {};
    var btns = (dossier.buttons || []).slice(0, 3);
    var radii = (dossier.top_radii || []).map(function (x) { return x.value + ' (' + x.count + 'x)'; }).join(', ') || '–';
    var fonts = (dossier.top_fonts || []).map(function (x) { return x.value; }).join(', ') || '–';

    var btnsHtml = btns.map(function (b) {
      var st = [
        'height:' + esc(b.height),
        'padding:' + esc(b.padding),
        'border-radius:' + esc(b.borderRadius),
        'background-color:' + esc(b.backgroundColor),
        'color:' + esc(b.color),
        'border:' + esc(b.border),
        'box-shadow:' + esc(b.boxShadow),
        'font-size:' + esc(b.fontSize),
        'font-weight:' + esc(b.fontWeight),
      ].join(';');
      return '<button type="button" class="lp-rea-btn" data-rea-tap style="' + st + '">' + esc(b.text) + '</button>';
    }).join('');

    return (
      '<div style="display:flex;flex-direction:column;gap:12px;">' +
        '<div class="lp-rea-stage" style="background:' + esc(bg) + ';color:' + esc(fg) + ';font-family:' + esc((dossier.body && dossier.body.fontFamily) || 'inherit') + ';">' +
          '<div class="lp-rea-nav" style="height:' + esc(hdr.height || '52px') + ';background:' + esc(hdrBg) + ';backdrop-filter:' + esc(hdr.backdropFilter || 'none') + ';border-bottom:' + esc(hdrBorder) + ';">' +
            '<strong style="font-size:13px;letter-spacing:-0.01em;">' + esc(dossier.slug.toUpperCase()) + '</strong>' +
            '<span class="lp-note" style="color:inherit;opacity:0.68;" data-rea-feedback>Rekonstruksi Live · Klik CTA</span>' +
          '</div>' +
          '<div class="lp-rea-hero">' +
            '<div style="font-size:clamp(22px, 3vw, 32px);font-weight:' + esc(h1.fontWeight || '600') + ';letter-spacing:' + esc(h1.letterSpacing || '-0.02em') + ';line-height:1.15;color:' + esc(h1.color || fg) + ';">' + esc((h1.text || dossier.title || '').slice(0, 68)) + '</div>' +
            (h2.text ? '<div style="font-size:14px;opacity:0.78;max-width:52ch;">' + esc(h2.text.slice(0, 80)) + '</div>' : '') +
            '<div class="lp-row" style="margin-top:4px;">' + (btnsHtml || '<span class="lp-note">Tidak ada tombol CTA terukur</span>') + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="sub-surface" style="padding:10px 12px;">' +
          '<table class="lp-token-table mono">' +
            '<tr><th>Fonts</th><td>' + esc(fonts) + '</td></tr>' +
            '<tr><th>Canvas / Ink</th><td>' + esc(bg + ' / ' + fg) + '</td></tr>' +
            '<tr><th>Header</th><td>' + esc((hdr.height || 'none') + ' · blur: ' + (hdr.backdropFilter || 'none')) + '</td></tr>' +
            '<tr><th>H1 Scale</th><td>' + esc((h1.fontSize || '–') + ' / w' + (h1.fontWeight || '–') + ' · track ' + (h1.letterSpacing || '–')) + '</td></tr>' +
            '<tr><th>Top Radii</th><td>' + esc(radii) + '</td></tr>' +
          '</table>' +
        '</div>' +
      '</div>'
    );
  }

  function mountTemplatePreview(el, id) {
    injectStyles();
    if (!el) return;

    if (id === 'shadcn-button') {
      var variants = ['default', 'secondary', 'outline', 'ghost', 'destructive', 'link'];
      var sizes = ['sm', 'default', 'lg', 'icon'];
      var curV = 'default', curS = 'default', withIcon = true;
      el.innerHTML =
        '<div class="lp-panel-card" style="display:flex;flex-direction:column;gap:14px;">' +
          '<div class="lp-row">' +
            variants.map(function (v) { return '<button type="button" class="lp-pill" data-v="' + v + '" aria-pressed="' + (v === curV) + '">' + v + '</button>'; }).join('') +
          '</div>' +
          '<div class="lp-row">' +
            sizes.map(function (s) { return '<button type="button" class="lp-pill" data-sz="' + s + '" aria-pressed="' + (s === curS) + '">' + s + '</button>'; }).join('') +
            '<label class="lp-note" style="margin-left:auto;display:inline-flex;align-items:center;gap:5px;cursor:pointer;"><input type="checkbox" data-ico checked /> Ikon</label>' +
            '<label class="lp-note" style="display:inline-flex;align-items:center;gap:5px;cursor:pointer;"><input type="checkbox" data-dis /> Disabled</label>' +
          '</div>' +
          '<div style="padding:20px;border-radius:8px;background:var(--st-bg);border:1px solid var(--st-border);display:flex;align-items:center;justify-content:space-between;gap:12px;">' +
            '<button type="button" class="lp-sh-btn" data-variant="default" data-size="default" data-target>' +
              '<span class="lp-btn-lbl"></span>' +
              '<svg class="lp-spin" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="8" cy="8" r="6" stroke-opacity="0.28"/><path d="M14 8a6 6 0 0 0-6-6" stroke-linecap="round"/></svg>' +
            '</button>' +
            '<span class="lp-note" data-status>Klik untuk uji zero-shift loading</span>' +
          '</div>' +
        '</div>';
      var target = el.querySelector('[data-target]'), lbl = target.querySelector('.lp-btn-lbl'), status = el.querySelector('[data-status]');
      var iconSvg = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5l3.5 3.5L13 4.5"/></svg>';
      function syncBtn() {
        target.setAttribute('data-variant', curV);
        target.setAttribute('data-size', curS);
        lbl.innerHTML = curS === 'icon' ? iconSvg : (withIcon ? iconSvg + '<span>Simpan Perubahan</span>' : '<span>Simpan Perubahan</span>');
        status.textContent = 'variant="' + curV + '" size="' + curS + '"';
      }
      el.querySelectorAll('[data-v]').forEach(function (b) {
        b.onclick = function () { curV = b.dataset.v; el.querySelectorAll('[data-v]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); syncBtn(); };
      });
      el.querySelectorAll('[data-sz]').forEach(function (b) {
        b.onclick = function () { curS = b.dataset.sz; el.querySelectorAll('[data-sz]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); syncBtn(); };
      });
      el.querySelector('[data-ico]').onchange = function (e) { withIcon = e.target.checked; syncBtn(); };
      el.querySelector('[data-dis]').onchange = function (e) { target.disabled = e.target.checked; };
      target.onclick = function () {
        if (target.classList.contains('is-loading')) return;
        target.classList.add('is-loading');
        status.textContent = 'Loading (lebar tombol tetap 0px shift)';
        setTimeout(function () { target.classList.remove('is-loading'); syncBtn(); }, 800);
      };
      syncBtn();
      return;
    }

    if (id === 'magicui-shimmer-button') {
      el.innerHTML =
        '<button type="button" class="lp-shimmer-btn"><span>Mulai Bangun Produk <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3.5 8h9M9 4.5L12.5 8 9 11.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span></button>' +
        '<span class="lp-note" data-s>Conic beam berputar sepanjang tepi pill 1.5px · Klik CTA</span>';
      el.querySelector('button').onclick = function () { el.querySelector('[data-s]').textContent = 'Shimmer CTA terpicu'; };
      return;
    }

    if (id === 'magicui-shiny-button') {
      el.innerHTML =
        '<button type="button" class="lp-shiny-btn">Deploy Versi Produksi</button>' +
        '<span class="lp-note" data-s>Specular mask sweep + scale(0.97) saat ditekan</span>';
      el.querySelector('button').onclick = function () { el.querySelector('[data-s]').textContent = 'Shiny CTA ditekan'; };
      return;
    }

    if (id === 'mp-magnetic') {
      el.innerHTML =
        '<div class="lp-mag-arena" data-zone>' +
          '<button type="button" class="lp-mag-btn" data-mag>Arahkan Kursor ke Arena</button>' +
          '<span class="lp-note" data-tel>offset: dx=0.0px dy=0.0px (damped spring)</span>' +
        '</div>';
      var zone = el.querySelector('[data-zone]'), btn = el.querySelector('[data-mag]'), tel = el.querySelector('[data-tel]');
      var tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
      function tick() {
        cx += (tx - cx) * 0.2;
        cy += (ty - cy) * 0.2;
        btn.style.transform = 'translate3d(' + cx.toFixed(2) + 'px,' + cy.toFixed(2) + 'px,0)';
        tel.textContent = 'offset: dx=' + cx.toFixed(1) + 'px dy=' + cy.toFixed(1) + 'px';
        if (Math.abs(tx - cx) > 0.08 || Math.abs(ty - cy) > 0.08) raf = requestAnimationFrame(tick);
        else raf = 0;
      }
      zone.onmousemove = function (e) {
        var r = btn.getBoundingClientRect();
        tx = Math.max(-22, Math.min(22, (e.clientX - (r.left + r.width / 2)) * 0.30));
        ty = Math.max(-14, Math.min(14, (e.clientY - (r.top + r.height / 2)) * 0.30));
        if (!raf) raf = requestAnimationFrame(tick);
      };
      zone.onmouseleave = function () { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(tick); };
      return;
    }

    if (id === 'mp-animated-background') {
      var tabs = ['Overview', 'Tokens', 'Components', 'Audit'];
      var tiles = [
        { t: 'Tactile Controls', d: '1px hairline + inner top highlight' },
        { t: 'Shared Layout', d: 'Pill mengikuti item aktif secara fisik' },
        { t: 'Tinted Neutrals', d: 'Canvas hangat tanpa abu-abu mentah' },
        { t: 'Zero Layout Shift', d: 'Dimensi tombol stabil di semua state' },
      ];
      el.innerHTML =
        '<div class="lp-anim-nav" data-nav><div class="lp-anim-pill" data-pill></div>' +
          tabs.map(function (t, i) { return '<button type="button" class="lp-anim-item" aria-selected="' + (i === 0) + '">' + t + '</button>'; }).join('') +
        '</div>' +
        '<div class="lp-tile-grid" data-grid><div class="lp-tile-hl" data-hl></div>' +
          tiles.map(function (x) { return '<div class="lp-tile"><strong style="font-size:12.5px;">' + esc(x.t) + '</strong><div class="lp-note" style="margin-top:2px;">' + esc(x.d) + '</div></div>'; }).join('') +
        '</div>';
      var nav = el.querySelector('[data-nav]'), pill = el.querySelector('[data-pill]');
      function syncPill() {
        var act = nav.querySelector('[aria-selected="true"]');
        if (!act) return;
        var nr = nav.getBoundingClientRect(), ar = act.getBoundingClientRect();
        pill.style.width = ar.width + 'px';
        pill.style.transform = 'translateX(' + (ar.left - nr.left - 4) + 'px)';
      }
      nav.querySelectorAll('.lp-anim-item').forEach(function (b) {
        b.onclick = function () { nav.querySelectorAll('.lp-anim-item').forEach(function (x) { x.setAttribute('aria-selected', String(x === b)); }); syncPill(); };
      });
      var grid = el.querySelector('[data-grid]'), hl = el.querySelector('[data-hl]');
      grid.querySelectorAll('.lp-tile').forEach(function (tile) {
        tile.onmouseenter = function () {
          var gr = grid.getBoundingClientRect(), tr = tile.getBoundingClientRect();
          hl.style.opacity = '1';
          hl.style.width = tr.width + 'px';
          hl.style.height = tr.height + 'px';
          hl.style.transform = 'translate(' + (tr.left - gr.left) + 'px,' + (tr.top - gr.top) + 'px)';
        };
      });
      grid.onmouseleave = function () { hl.style.opacity = '0'; };
      requestAnimationFrame(syncPill);
      return;
    }

    if (id === 'shadcn-tabs') {
      var panes = {
        Akun: '<div class="lp-note" style="margin-bottom:6px;">Organisasi Aktif</div><input class="lp-input" value="Klinik Gigi Senyum Nusantara" readonly />',
        Tagihan: '<div style="display:flex;justify-content:space-between;align-items:baseline;"><strong>Paket Pro Multi-Kursi</strong><span class="lp-note" style="font-size:15px;color:var(--st-ink);font-weight:700;">Rp 2.450.000/bln</span></div><div class="lp-note" style="margin-top:4px;">Siklus berikutnya 01 Des 2026 · Auto-debit BCA</div>',
        Keamanan: '<div style="display:flex;justify-content:space-between;align-items:center;"><span>Two-Factor Auth (TOTP)</span><span class="badge badge-ok">Aktif</span></div>',
      };
      var keys = Object.keys(panes);
      el.innerHTML =
        '<div class="lp-panel-card" style="display:flex;flex-direction:column;gap:12px;">' +
          '<div class="lp-tabs-list" role="tablist">' +
            keys.map(function (k, i) { return '<button type="button" class="lp-tab-trig" role="tab" aria-selected="' + (i === 0) + '" data-k="' + k + '">' + k + '</button>'; }).join('') +
          '</div>' +
          '<div style="padding:12px;border-radius:7px;background:var(--st-bg);border:1px solid var(--st-border);" data-body>' + panes.Akun + '</div>' +
        '</div>';
      var body = el.querySelector('[data-body]');
      el.querySelectorAll('.lp-tab-trig').forEach(function (b) {
        b.onclick = function () {
          el.querySelectorAll('.lp-tab-trig').forEach(function (x) { x.setAttribute('aria-selected', String(x === b)); });
          body.innerHTML = panes[b.dataset.k];
        };
      });
      return;
    }

    if (id === 'shadcn-command') {
      var groups = [
        { g: 'Aksi Cepat', items: [{ name: 'Tambah Stok Bahan Baku', sc: 'N' }, { name: 'Audit Anti-Slop Halaman Ini', sc: 'Cmd+Shift+A' }] },
        { g: 'Navigasi Vault', items: [{ name: 'Buka Pengaturan Tagihan', sc: 'G B' }, { name: 'Salin Token Tinted Neutrals', sc: 'G T' }, { name: 'Sinkronkan ke Skill Global', sc: 'G S' }] },
      ];
      el.innerHTML =
        '<div class="lp-cmd-box">' +
          '<div class="lp-cmd-head">' +
            '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5L14 14" stroke-linecap="round"/></svg>' +
            '<input type="text" class="lp-cmd-input" placeholder="Ketik perintah atau cari vault..." data-q />' +
            '<span class="badge badge-neutral">ESC</span>' +
          '</div>' +
          '<div class="lp-cmd-list" data-list></div>' +
        '</div><span class="lp-note" data-s>Gunakan panah Atas/Bawah + Enter atau ketik filter</span>';
      var qEl = el.querySelector('[data-q]'), listEl = el.querySelector('[data-list]'), stEl = el.querySelector('[data-s]'), idx = 0;
      function draw() {
        var q = qEl.value.trim().toLowerCase();
        var flat = [];
        var html = '';
        groups.forEach(function (grp) {
          var matches = grp.items.filter(function (it) { return it.name.toLowerCase().indexOf(q) !== -1; });
          if (!matches.length) return;
          html += '<div class="lp-cmd-grp">' + esc(grp.g) + '</div>';
          matches.forEach(function (it) {
            var cur = flat.length;
            flat.push(it);
            html += '<button type="button" class="lp-cmd-item" data-idx="' + cur + '" data-active="' + (cur === idx) + '"><span>' + esc(it.name) + '</span><span class="lp-note">' + esc(it.sc) + '</span></button>';
          });
        });
        if (!flat.length) html = '<div class="lp-note" style="padding:12px;">Tidak ada perintah yang cocok.</div>';
        listEl.innerHTML = html;
        listEl.querySelectorAll('.lp-cmd-item').forEach(function (b) {
          b.onclick = function () { idx = Number(b.dataset.idx); stEl.textContent = 'Dieksekusi: ' + flat[idx].name; draw(); };
        });
      }
      qEl.oninput = function () { idx = 0; draw(); };
      qEl.onkeydown = function (e) {
        var items = listEl.querySelectorAll('.lp-cmd-item');
        if (!items.length) return;
        if (e.key === 'ArrowDown') { e.preventDefault(); idx = (idx + 1) % items.length; draw(); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); idx = (idx - 1 + items.length) % items.length; draw(); }
        else if (e.key === 'Enter') { e.preventDefault(); items[idx].click(); }
      };
      draw();
      return;
    }

    if (id === 'magicui-bento-grid') {
      el.innerHTML =
        '<div class="lp-bento">' +
          '<div class="lp-bento-card"><div style="display:flex;gap:4px;align-items:flex-end;height:38px;margin-bottom:8px;">' +
            '<span style="width:12px;height:40%;background:var(--st-subtle);border-radius:3px;"></span>' +
            '<span style="width:12px;height:68%;background:var(--st-subtle);border-radius:3px;"></span>' +
            '<span style="width:12px;height:95%;background:var(--st-accent);border-radius:3px;"></span>' +
            '<span style="width:12px;height:55%;background:var(--st-subtle);border-radius:3px;"></span>' +
          '</div><div class="lp-bento-inner"><strong style="font-size:13.5px;">Telemetry Audit Biner</strong><div class="lp-note" style="margin-top:2px;">17 cek otomatis per halaman</div></div><span class="lp-bento-cta">Lihat Laporan -></span></div>' +
          '<div class="lp-bento-card"><div class="lp-row" style="margin-bottom:10px;"><span class="badge badge-accent">Cmd+K</span><span class="badge badge-neutral">MIT</span></div><div class="lp-bento-inner"><strong style="font-size:13.5px;">Lego Export</strong><div class="lp-note" style="margin-top:2px;">Salin kode verbatim</div></div><span class="lp-bento-cta">Salin TSX -></span></div>' +
        '</div>';
      return;
    }

    if (id === 'magicui-border-beam') {
      el.innerHTML =
        '<div class="lp-row"><button type="button" class="lp-pill" data-c="#34B399" aria-pressed="true">Teal</button><button type="button" class="lp-pill" data-c="#F59E0B" aria-pressed="false">Amber</button><button type="button" class="lp-pill" data-c="#E5E5E6" aria-pressed="false">Mono</button></div>' +
        '<div class="lp-beam-wrap" style="--beam-color:#34B399;"><div class="lp-beam-spin"></div><div class="lp-beam-card">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;"><strong style="font-size:14px;">Production Deployment Pipeline</strong><span class="badge badge-ok">Healthy</span></div>' +
          '<div class="lp-note">Sorotan perimeter 1.5px · Maksimal 1 focal card per viewport agar tidak jadi AI slop.</div>' +
        '</div></div>';
      var wrap = el.querySelector('.lp-beam-wrap');
      el.querySelectorAll('[data-c]').forEach(function (b) {
        b.onclick = function () {
          wrap.style.setProperty('--beam-color', b.dataset.c);
          el.querySelectorAll('[data-c]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        };
      });
      return;
    }

    if (id === 'shadcn-card') {
      el.innerHTML =
        '<div class="lp-panel-card" style="max-width:400px;display:flex;flex-direction:column;gap:12px;">' +
          '<div style="display:flex;justify-content:space-between;align-items:flex-start;"><div><strong style="font-size:14px;">Buat Proyek Baru</strong><div class="lp-note" style="margin-top:2px;">Terapkan token workspace secara otomatis.</div></div><span class="badge badge-neutral" data-st>Siap</span></div>' +
          '<div><label class="lp-note" style="display:block;margin-bottom:4px;">Nama Proyek</label><input class="lp-input" value="kopiku-pos-admin" /></div>' +
          '<div style="display:flex;justify-content:flex-end;gap:8px;padding-top:4px;">' +
            '<button type="button" class="lp-sh-btn" data-variant="outline" data-size="sm" data-rst>Reset</button>' +
            '<button type="button" class="lp-sh-btn" data-variant="default" data-size="sm" data-dep>Deploy</button>' +
          '</div>' +
        '</div>';
      var st = el.querySelector('[data-st]');
      el.querySelector('[data-dep]').onclick = function () { st.textContent = 'Deployed'; st.className = 'badge badge-ok'; };
      el.querySelector('[data-rst]').onclick = function () { st.textContent = 'Siap'; st.className = 'badge badge-neutral'; };
      return;
    }

    if (id === 'shadcn-badge') {
      el.innerHTML =
        '<div class="lp-panel-card" style="display:flex;flex-direction:column;gap:10px;">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;"><span style="font-weight:600;font-size:13px;">Release v2.4.0 · Core UI</span><span class="badge badge-ok">Production</span></div>' +
          '<div style="display:flex;justify-content:space-between;align-items:center;"><span style="font-size:12.5px;color:var(--st-muted);">Buttons &amp; Navigation REA</span><span class="badge badge-accent">Ready</span></div>' +
          '<div style="display:flex;justify-content:space-between;align-items:center;"><span style="font-size:12.5px;color:var(--st-muted);">Cards &amp; Forms Templates</span><span class="badge badge-warn">Seeded</span></div>' +
          '<div style="display:flex;justify-content:space-between;align-items:center;"><span style="font-size:12.5px;color:var(--st-muted);">Legacy Neon Gradients</span><span class="badge badge-danger">Banned</span></div>' +
        '</div>';
      return;
    }

    if (id === 'mp-morphing-dialog') {
      el.innerHTML =
        '<div class="lp-panel-card" style="max-width:340px;cursor:pointer;display:flex;flex-direction:column;gap:6px;" data-src>' +
          '<div style="display:flex;justify-content:space-between;align-items:center;"><strong style="font-size:14px;">Linear Obsidian Card</strong><span class="badge badge-accent">Klik Morph</span></div>' +
          '<span class="lp-note">Kartu ini memakai FLIP layoutId transform menuju modal detail.</span>' +
        '</div>';
      var src = el.querySelector('[data-src]');
      src.onclick = function () {
        if (el.querySelector('.lp-stage-overlay')) return;
        var sr = src.getBoundingClientRect();
        var ov = document.createElement('div');
        ov.className = 'lp-stage-overlay';
        ov.innerHTML =
          '<div class="lp-stage-dialog">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;"><strong>Linear Obsidian Card — Detail</strong><span class="badge badge-ok">Expanded</span></div>' +
            '<div style="font-size:12.5px;color:var(--st-muted);">Transisi shared-element menghitung selisih koordinat kartu asal ke pusat panggung secara mulus.</div>' +
            '<div class="lp-row" style="justify-content:flex-end;"><button type="button" class="lp-sh-btn" data-variant="secondary" data-size="sm" data-close>Tutup</button></div>' +
          '</div>';
        el.appendChild(ov);
        var dlg = ov.querySelector('.lp-stage-dialog'), dr = dlg.getBoundingClientRect();
        var dx = (sr.left + sr.width / 2) - (dr.left + dr.width / 2);
        var dy = (sr.top + sr.height / 2) - (dr.top + dr.height / 2);
        dlg.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(' + (sr.width / dr.width).toFixed(2) + ')';
        dlg.style.opacity = '0.6';
        requestAnimationFrame(function () { dlg.style.transform = 'translate(0,0) scale(1)'; dlg.style.opacity = '1'; });
        function close() { ov.remove(); }
        ov.querySelector('[data-close]').onclick = close;
        ov.onclick = function (e) { if (e.target === ov) close(); };
      };
      return;
    }

    if (id === 'mp-disclosure') {
      var rows = [
        { q: 'Kenapa memakai kode produksi verbatim?', a: 'Menghindari bug ARIA, focus ring, dan timing animasi yang sering gagal saat digenerate ulang dari nol.' },
        { q: 'Bagaimana aturan modifikasi Lego blocks?', a: 'Pertahankan struktur aksesibilitas komponen, lalu skin ulang warnanya dengan Tinted Neutrals proyek.' },
      ];
      el.innerHTML = '<div class="lp-panel-card">' + rows.map(function (r, i) {
        return '<div class="lp-disc-item">' +
          '<button type="button" style="border:none;background:transparent;padding:0;width:100%;display:flex;justify-content:space-between;align-items:center;color:var(--st-ink);font-weight:600;font-size:13px;cursor:pointer;text-align:left;" data-t="' + i + '">' +
            '<span>' + esc(r.q) + '</span><span class="lp-note" data-ic>' + (i === 0 ? '−' : '+') + '</span>' +
          '</button>' +
          '<div class="lp-disc-body" data-open="' + (i === 0) + '"><div class="lp-disc-inner" style="padding-top:6px;">' + esc(r.a) + '</div></div>' +
        '</div>';
      }).join('') + '</div>';
      el.querySelectorAll('[data-t]').forEach(function (b) {
        b.onclick = function () {
          var body = b.nextElementSibling, open = body.getAttribute('data-open') === 'true';
          body.setAttribute('data-open', String(!open));
          b.querySelector('[data-ic]').textContent = open ? '+' : '−';
        };
      });
      return;
    }

    if (id === 'sonner-styles') {
      el.innerHTML =
        '<div class="lp-panel-card" style="display:flex;flex-direction:column;gap:12px;">' +
          '<div class="lp-row">' +
            '<button type="button" class="lp-pill" data-k="default">Default</button>' +
            '<button type="button" class="lp-pill" data-k="ok">Success</button>' +
            '<button type="button" class="lp-pill" data-k="err">Error</button>' +
            '<button type="button" class="lp-pill" data-k="promise">Promise</button>' +
            '<span class="lp-note" style="margin-left:auto;">Hover stack untuk expand</span>' +
          '</div>' +
          '<div class="lp-sonner-deck" data-deck></div>' +
        '</div>';
      var deck = el.querySelector('[data-deck]'), toasts = [], expanded = false;
      function layout() {
        deck.innerHTML = '';
        toasts.forEach(function (t, i) {
          var depth = toasts.length - 1 - i;
          var node = document.createElement('div');
          node.className = 'lp-sonner-item';
          var ty = expanded ? -(depth * 48) : -(depth * 11);
          var sc = expanded ? 1 : (1 - depth * 0.05);
          node.style.transform = 'translateY(' + ty + 'px) scale(' + sc + ')';
          node.style.zIndex = String(10 - depth);
          node.style.opacity = depth > 2 ? '0' : '1';
          node.innerHTML = '<div style="display:flex;align-items:center;gap:8px;"><span class="badge ' + t.cls + '">' + esc(t.tag) + '</span><span>' + esc(t.msg) + '</span></div>' +
            '<button type="button" class="lp-pill" style="padding:2px 7px;">Tutup</button>';
          node.querySelector('button').onclick = function () { toasts = toasts.filter(function (x) { return x.uid !== t.uid; }); layout(); };
          deck.appendChild(node);
        });
      }
      function push(tag, cls, msg) {
        var uid = Date.now() + Math.random();
        toasts.push({ uid: uid, tag: tag, cls: cls, msg: msg });
        if (toasts.length > 3) toasts.shift();
        layout();
        return uid;
      }
      deck.onmouseenter = function () { expanded = true; layout(); };
      deck.onmouseleave = function () { expanded = false; layout(); };
      el.querySelectorAll('[data-k]').forEach(function (b) {
        b.onclick = function () {
          var k = b.dataset.k;
          if (k === 'ok') push('Sukses', 'badge-ok', 'Vault disinkronkan ke global');
          else if (k === 'err') push('Error', 'badge-danger', 'Gagal membaca path target');
          else if (k === 'promise') {
            var uid = push('Memuat', 'badge-warn', 'Menyalin template Lego...');
            setTimeout(function () {
              toasts = toasts.map(function (x) { return x.uid === uid ? { uid: uid, tag: 'Selesai', cls: 'badge-ok', msg: '16 template siap dipakai' } : x; });
              layout();
            }, 900);
          } else push('Info', 'badge-accent', 'Snapshot lokal diperbarui');
        };
      });
      push('Siap', 'badge-accent', 'Klik tombol di atas untuk uji Sonner stack');
      return;
    }

    if (id === 'shadcn-input') {
      el.innerHTML =
        '<div class="lp-panel-card" style="max-width:420px;display:flex;flex-direction:column;gap:12px;">' +
          '<div><label class="lp-note" style="display:block;margin-bottom:5px;">Email Admin Klinik</label><input type="email" class="lp-input" placeholder="admin@klinik.id (ketik tanpa @ untuk uji error)" data-in /><div class="lp-note" style="margin-top:5px;" data-msg>Fokus untuk melihat focus-visible ring tanpa layout shift</div></div>' +
          '<div><label class="lp-note" style="display:block;margin-bottom:5px;">Workspace Read-Only</label><input type="text" class="lp-input" value="gemini-design-vault" disabled /></div>' +
        '</div>';
      var inp = el.querySelector('[data-in]'), msg = el.querySelector('[data-msg]');
      inp.oninput = function () {
        var v = inp.value.trim(), bad = v.length > 0 && v.indexOf('@') === -1;
        inp.setAttribute('aria-invalid', String(bad));
        msg.textContent = bad ? 'aria-invalid="true" — Format email belum valid' : (v ? 'Email valid' : 'Fokus untuk melihat focus-visible ring');
        msg.style.color = bad ? '#B91C1C' : 'var(--st-muted)';
      };
      return;
    }

    if (id === 'shadcn-dialog') {
      el.innerHTML =
        '<div class="lp-row">' +
          '<button type="button" class="lp-sh-btn" data-variant="default" data-size="default" data-open>Buka Modal Dialog</button>' +
          '<span class="lp-note" data-s>Accessible Radix Dialog · Backdrop blur + Esc close</span>' +
        '</div>';
      var st = el.querySelector('[data-s]');
      el.querySelector('[data-open]').onclick = function () {
        if (el.querySelector('.lp-stage-overlay')) return;
        var ov = document.createElement('div');
        ov.className = 'lp-stage-overlay';
        ov.innerHTML =
          '<div class="lp-stage-dialog">' +
            '<div><strong style="font-size:14.5px;">Sinkronisasi Skill Global</strong><div class="lp-note" style="margin-top:4px;">Backup lama disimpan aman di ~/.agents/skill-backups/.</div></div>' +
            '<div class="lp-row" style="justify-content:flex-end;">' +
              '<button type="button" class="lp-sh-btn" data-variant="ghost" data-size="sm" data-c>Batal</button>' +
              '<button type="button" class="lp-sh-btn" data-variant="default" data-size="sm" data-ok>Konfirmasi</button>' +
            '</div>' +
          '</div>';
        ov.querySelector('[data-c]').onclick = function () { ov.remove(); st.textContent = 'Dialog dibatalkan'; };
        ov.querySelector('[data-ok]').onclick = function () { ov.remove(); st.textContent = 'Dikonfirmasi'; };
        ov.onclick = function (e) { if (e.target === ov) { ov.remove(); st.textContent = 'Dialog ditutup'; } };
        el.appendChild(ov);
      };
      return;
    }

    if (id === 'goodui-hold-to-confirm') {
      el.innerHTML =
        '<div class="lp-panel-card" style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;">' +
          '<button type="button" class="lp-hold-btn" data-hold><span class="lp-hold-fill" data-fill></span><span class="lp-hold-lbl" data-lbl>Tahan 1.2s untuk Hapus Cache</span></button>' +
          '<span class="lp-note" data-s>Tahan mouse/touch atau tekan Spasi/Enter · Lepas cepat untuk uji rewind</span>' +
        '</div>';
      var btn = el.querySelector('[data-hold]'), fill = el.querySelector('[data-fill]'), lbl = el.querySelector('[data-lbl]'), st = el.querySelector('[data-s]');
      var timer = 0, prog = 0, done = false, holding = false, dur = 1200, startTs = 0;
      function frame(ts) {
        if (!holding) return;
        prog = Math.min(1, (ts - startTs) / dur);
        fill.style.width = (prog * 100).toFixed(1) + '%';
        if (prog >= 1) {
          holding = false; done = true;
          btn.setAttribute('data-holding', 'false'); btn.setAttribute('data-done', 'true');
          lbl.textContent = 'Terkonfirmasi'; st.textContent = 'Aksi destruktif dijalankan (auto-reset 1.8s)';
          setTimeout(function () {
            done = false; prog = 0; fill.style.width = '0%';
            btn.setAttribute('data-done', 'false'); lbl.textContent = 'Tahan 1.2s untuk Hapus Cache';
          }, 1800);
          return;
        }
        timer = requestAnimationFrame(frame);
      }
      function begin() {
        if (done || holding) return;
        holding = true; startTs = performance.now();
        btn.setAttribute('data-holding', 'true');
        lbl.textContent = 'Menahan...';
        timer = requestAnimationFrame(frame);
      }
      function abort() {
        if (!holding) return;
        holding = false; cancelAnimationFrame(timer);
        btn.setAttribute('data-holding', 'false');
        fill.style.transition = 'width 180ms ease-out';
        fill.style.width = '0%';
        setTimeout(function () { fill.style.transition = 'none'; }, 190);
        if (prog < 0.15) st.textContent = 'Ketuk singkat — tahan 1.2 detik untuk konfirmasi';
        else st.textContent = 'Dilepas lebih awal — sapuan di-rewind';
        lbl.textContent = 'Tahan 1.2s untuk Hapus Cache';
      }
      btn.onpointerdown = begin; btn.onpointerup = abort; btn.onpointerleave = abort;
      btn.onkeydown = function (e) { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); begin(); } };
      btn.onkeyup = function (e) { if (e.key === ' ' || e.key === 'Enter') abort(); };
      return;
    }

    if (id === 'goodui-liquid-glass-button') {
      el.innerHTML =
        '<div class="lp-glass-backdrop">' +
          '<button type="button" class="lp-lglass-btn" data-lg>Liquid Glass Specular</button>' +
          '<span class="lp-note" style="color:rgba(255,255,255,0.78);" data-s>Gerakkan kursor di atas tombol · Sorot cahaya mengikuti pointer</span>' +
        '</div>';
      var lg = el.querySelector('[data-lg]'), st = el.querySelector('[data-s]');
      lg.onpointermove = function (e) {
        var r = lg.getBoundingClientRect();
        var x = Math.round(e.clientX - r.left), y = Math.round(e.clientY - r.top);
        lg.style.setProperty('--gx', x + 'px');
        lg.style.setProperty('--gy', y + 'px');
        st.textContent = '--pc-lg-x: ' + x + 'px · --pc-lg-y: ' + y + 'px';
      };
      return;
    }

    if (id === 'goodui-stateful-button') {
      var mode = 'success';
      el.innerHTML =
        '<div class="lp-panel-card" style="display:flex;flex-direction:column;gap:12px;">' +
          '<div class="lp-row"><button type="button" class="lp-pill" data-m="success" aria-pressed="true">Simulasi Sukses</button><button type="button" class="lp-pill" data-m="error" aria-pressed="false">Simulasi Error</button></div>' +
          '<div class="lp-row"><button type="button" class="lp-sh-btn" data-variant="default" data-size="default" data-sb>Kirim Transaksi</button><span class="lp-note" data-s>State: idle</span></div>' +
        '</div>';
      var sb = el.querySelector('[data-sb]'), st = el.querySelector('[data-s]'), busy = false;
      el.querySelectorAll('[data-m]').forEach(function (b) {
        b.onclick = function () { mode = b.dataset.m; el.querySelectorAll('[data-m]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); };
      });
      sb.onclick = function () {
        if (busy) return; busy = true;
        sb.textContent = 'Memproses...'; st.textContent = 'State: loading';
        setTimeout(function () {
          if (mode === 'success') {
            sb.style.background = '#059669'; sb.style.color = '#FFFFFF';
            sb.textContent = 'Terkirim'; st.textContent = 'State: success (drawn check)';
          } else {
            sb.style.background = '#B91C1C'; sb.style.color = '#FFFFFF';
            sb.textContent = 'Coba Lagi'; st.textContent = 'State: error';
          }
          setTimeout(function () {
            sb.style.background = ''; sb.style.color = ''; sb.textContent = 'Kirim Transaksi';
            st.textContent = 'State: idle'; busy = false;
          }, 1400);
        }, 700);
      };
      return;
    }

    if (id === 'goodui-rainbow-button') {
      el.innerHTML =
        '<button type="button" class="lp-rainbow-btn" data-rb><span class="lp-rainbow-border"><span class="lp-rainbow-strip"></span></span><span class="lp-rainbow-face"></span><span>Generate Design System</span></button>' +
        '<span class="lp-note" data-s>Wajah solid high-contrast · Spektrum warna hanya di perimeter 2px</span>';
      el.querySelector('[data-rb]').onclick = function () { el.querySelector('[data-s]').textContent = 'Prismatic CTA diklik'; };
      return;
    }

    if (id === 'goodui-ripple-button') {
      el.innerHTML =
        '<button type="button" class="lp-ripple-btn" data-rp>Klik di Titik Mana Saja</button>' +
        '<span class="lp-note" data-s>Gelombang radial muncul tepat dari koordinat klik</span>';
      var rp = el.querySelector('[data-rp]');
      rp.onclick = function (e) {
        var r = rp.getBoundingClientRect(), d = Math.max(r.width, r.height);
        var dot = document.createElement('span');
        dot.className = 'lp-ripple-dot';
        dot.style.width = dot.style.height = d + 'px';
        dot.style.left = (e.clientX - r.left - d / 2) + 'px';
        dot.style.top = (e.clientY - r.top - d / 2) + 'px';
        rp.appendChild(dot);
        setTimeout(function () { dot.remove(); }, 540);
        el.querySelector('[data-s]').textContent = 'Ripple origin (' + Math.round(e.clientX - r.left) + ', ' + Math.round(e.clientY - r.top) + ')';
      };
      return;
    }

    if (id === 'goodui-copy-button') {
      el.innerHTML =
        '<div class="lp-panel-card" style="display:flex;justify-content:space-between;align-items:center;gap:12px;">' +
          '<code class="lp-note" style="color:var(--st-ink);">npx shadcn@latest add https://goodui.dev/r/sounds.json</code>' +
          '<button type="button" class="lp-sh-btn" data-variant="outline" data-size="sm" data-cp>Salin</button>' +
        '</div>';
      var cp = el.querySelector('[data-cp]');
      cp.onclick = function () {
        cp.textContent = 'Tersalin'; cp.setAttribute('data-variant', 'default');
        setTimeout(function () { cp.textContent = 'Salin'; cp.setAttribute('data-variant', 'outline'); }, 1400);
      };
      return;
    }

    if (id === 'goodui-spotlight-card') {
      el.innerHTML =
        '<div class="lp-spot-card" data-sc><div class="lp-spot-glow"></div>' +
          '<div style="position:relative;z-index:1;display:flex;flex-direction:column;gap:6px;">' +
            '<span class="badge badge-accent" style="align-self:flex-start;">Pointer Spotlight</span>' +
            '<strong style="font-size:15px;">Radial Cursor Reveal Surface</strong>' +
            '<div class="lp-note">Gerakkan kursor di dalam kartu untuk menerangi border & tekstur permukaan.</div>' +
          '</div>' +
        '</div>';
      var sc = el.querySelector('[data-sc]');
      sc.onpointermove = function (e) {
        var r = sc.getBoundingClientRect();
        sc.style.setProperty('--sx', (e.clientX - r.left) + 'px');
        sc.style.setProperty('--sy', (e.clientY - r.top) + 'px');
      };
      return;
    }

    if (id === 'goodui-tilt-card') {
      el.innerHTML =
        '<div class="lp-tilt-stage">' +
          '<div class="lp-tilt-card" data-tc>' +
            '<div class="lp-note" style="color:#9FE870;margin-bottom:8px;">WISE // FOREST VOLT</div>' +
            '<strong style="font-size:17px;">Perspective 3D Tilt Card</strong>' +
            '<div class="lp-note" style="color:rgba(244,247,240,0.72);margin-top:6px;">Arahkan kursor untuk rotasi sumbu X/Y halus tanpa distorsi teks.</div>' +
          '</div>' +
        '</div>';
      var tc = el.querySelector('[data-tc]');
      tc.onpointermove = function (e) {
        var r = tc.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        tc.style.transform = 'rotateX(' + (-py * 14).toFixed(2) + 'deg) rotateY(' + (px * 16).toFixed(2) + 'deg)';
      };
      tc.onpointerleave = function () { tc.style.transform = 'rotateX(0deg) rotateY(0deg)'; };
      return;
    }

    if (id === 'goodui-aurora') {
      el.innerHTML =
        '<div class="lp-aurora-box">' +
          '<div class="lp-aur-blob" style="width:200px;height:200px;top:-40px;left:-20px;background:#3CFFD0;"></div>' +
          '<div class="lp-aur-blob" style="width:220px;height:220px;top:10px;right:-30px;background:#FA520F;animation-delay:-3s;"></div>' +
          '<div style="position:relative;z-index:1;"><strong style="font-size:16px;">Aurora Atmospheric Mesh</strong><div class="lp-note" style="color:rgba(255,255,255,0.76);margin-top:4px;">Lapisan cahaya multi-hue lembut · Berhenti otomatis bila prefers-reduced-motion aktif</div></div>' +
        '</div>';
      return;
    }

    if (id === 'goodui-dock') {
      var labels = ['Canvas', 'Tokens', 'Icons', 'Audio', 'Export'];
      el.innerHTML =
        '<div class="lp-dock-bar" data-dk>' +
          labels.map(function (l, i) { return '<button type="button" class="lp-dock-btn" data-idx="' + i + '" title="' + l + '">' + l.slice(0, 2).toUpperCase() + '</button>'; }).join('') +
        '</div><span class="lp-note" data-s>Sorot bar dock untuk magnifikasi berbasis jarak kursor</span>';
      var dk = el.querySelector('[data-dk]'), btns = dk.querySelectorAll('.lp-dock-btn'), st = el.querySelector('[data-s]');
      dk.onmousemove = function (e) {
        btns.forEach(function (b) {
          var r = b.getBoundingClientRect(), dist = Math.abs(e.clientX - (r.left + r.width / 2));
          var sc = Math.max(1, 1.48 - dist / 95);
          b.style.transform = 'scale(' + sc.toFixed(2) + ') translateY(' + (-Math.max(0, (sc - 1) * 16)).toFixed(1) + 'px)';
        });
      };
      dk.onmouseleave = function () { btns.forEach(function (b) { b.style.transform = 'scale(1)'; }); };
      btns.forEach(function (b, i) { b.onclick = function () { st.textContent = 'Item dock aktif: ' + labels[i]; }; });
      return;
    }

    if (id === 'goodui-number-flow') {
      var vals = [1284, 4892, 9640];
      el.innerHTML =
        '<div class="lp-panel-card" style="display:flex;flex-direction:column;gap:12px;">' +
          '<div class="lp-row">' + vals.map(function (v) { return '<button type="button" class="lp-pill" data-val="' + v + '">' + v + ' req/s</button>'; }).join('') + '</div>' +
          '<div style="font-size:34px;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:-0.03em;" data-nf>1,284</div>' +
          '<span class="lp-note">Tabular rolling counter (tanpa geser lebar kolom)</span>' +
        '</div>';
      var nf = el.querySelector('[data-nf]'), cur = 1284;
      el.querySelectorAll('[data-val]').forEach(function (b) {
        b.onclick = function () {
          var target = Number(b.dataset.val), start = cur, t0 = performance.now();
          function step(ts) {
            var p = Math.min(1, (ts - t0) / 380);
            var eased = 1 - Math.pow(1 - p, 3);
            cur = Math.round(start + (target - start) * eased);
            nf.textContent = cur.toLocaleString('en-US');
            if (p < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
        };
      });
      return;
    }

    if (id === 'goodui-sounds') {
      var recipes = [
        { k: 'tap', f: 440, to: 520, d: 0.05 },
        { k: 'success', f: 523.25, to: 783.99, d: 0.14 },
        { k: 'confirm', f: 659.25, to: 987.77, d: 0.16 },
        { k: 'error', f: 240, to: 160, d: 0.16 },
        { k: 'celebrate', f: 587.33, to: 1046.5, d: 0.22 },
      ];
      el.innerHTML =
        '<div class="lp-panel-card" style="display:flex;flex-direction:column;gap:12px;">' +
          '<div class="lp-row">' + recipes.map(function (r) { return '<button type="button" class="lp-pill" data-sn="' + r.k + '">' + r.k + '</button>'; }).join('') + '</div>' +
          '<span class="lp-note" data-s>Web Audio API sintetis murni (-14 dBFS, 0 file audio eksternal) · Klik tombol untuk dengar</span>' +
        '</div>';
      var ctx = null, st = el.querySelector('[data-s]');
      el.querySelectorAll('[data-sn]').forEach(function (b, idx) {
        b.onclick = function () {
          var rec = recipes[idx];
          try {
            ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
            if (ctx.state === 'suspended') ctx.resume();
            var now = ctx.currentTime, osc = ctx.createOscillator(), gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(rec.f, now);
            osc.frequency.exponentialRampToValueAtTime(rec.to, now + rec.d);
            gain.gain.setValueAtTime(0.14, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + rec.d);
            osc.connect(gain); gain.connect(ctx.destination);
            osc.start(now); osc.stop(now + rec.d + 0.02);
            st.textContent = 'Memainkan resep Web Audio: "' + rec.k + '" (' + rec.f + 'Hz -> ' + rec.to + 'Hz)';
          } catch (err) {
            st.textContent = 'Web Audio tidak tersedia di browser ini';
          }
        };
      });
    }
  }

  window.LegoPreviews = {
    defaultStageTheme: defaultStageTheme,
    renderReaSpecimen: renderReaSpecimen,
    mountTemplatePreview: mountTemplatePreview,
  };
})();
