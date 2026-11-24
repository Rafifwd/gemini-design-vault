#!/usr/bin/env python3
"""Fetch real DESIGN.md brand systems (VoltAgent/awesome-design-md) and
high-star frontend design skill references (pbakaus/impeccable, anthropics/skills).
"""

from __future__ import annotations

import json
import re
import sys
import urllib.request
from datetime import datetime
from pathlib import Path

VAULT_ROOT = Path(__file__).resolve().parent.parent
DESIGN_DIR = VAULT_ROOT / "design-systems"
SOURCE_DIR = VAULT_ROOT / "source"
IMPECCABLE_DIR = SOURCE_DIR / "impeccable"
HEADERS = {"User-Agent": "gemini-design-vault/1.0"}

RESEARCH_REPOS = [
    "VoltAgent/awesome-design-md",
    "pbakaus/impeccable",
    "anthropics/skills",
]

PREFERRED_BRANDS = [
    ("apple", "Consumer Hardware & Clinical Minimal"),
    ("stripe", "Fintech & B2B Payments"),
    ("linear.app", "DevTools & Product Issue Tracker"),
    ("vercel", "Cloud Infrastructure & Monochrome"),
    ("notion", "Workspace & Editorial Knowledge"),
    ("supabase", "Database & Developer Platform"),
    ("airbnb", "Hospitality & Warm Marketplace"),
    ("spotify", "Consumer Media & Expressive Dark"),
    ("figma", "Creative Multiplayer Tooling"),
    ("claude", "AI Assistant & Warm Editorial"),
    ("wise", "Global Fintech & Electric Forest Volt"),
    ("miro", "Multiplayer Canvas & Sunny Vivid Board"),
    ("mistral.ai", "Frontier AI & Flame Orange Heat Ladder"),
    ("theverge", "Editorial Media & Acid Cyber Neon"),
    ("wired", "Editorial Print & High-Contrast Monolith"),
    ("ferrari", "Luxury Motorsport & Rosso Corsa Drama"),
    ("lamborghini", "Supercar Atelier & Carbon Volt Contrast"),
    ("raycast", "Desktop Productivity & Tactile Dark"),
    ("framer", "Interactive Web Studio & Kinetic Electric"),
    ("webflow", "Visual Web Builder & Crisp Electric Blue"),
    ("posthog", "Product Analytics & Warm Quirky Craft"),
    ("zapier", "Automation Platform & Safety Orange"),
    ("revolut", "Neo-Bank & Crisp Contrast Bento"),
    ("nike", "Athletic Storytelling & Monochrome Kinetic"),
]

TARGET_COUNT = len(PREFERRED_BRANDS)


def http_get_json(url: str) -> dict:
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=25) as resp:
        return json.loads(resp.read().decode("utf-8"))


def http_get_text(url: str) -> str:
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=25) as resp:
        return resp.read().decode("utf-8", errors="replace")


def extract_hexes(text: str, limit: int = 8) -> list[str]:
    seen = set()
    out = []
    for m in re.findall(r"#[0-9a-fA-F]{6}\b", text):
        upper = m.upper()
        if upper not in seen:
            seen.add(upper)
            out.append(upper)
            if len(out) >= limit:
                break
    return out


SUMMARY_MAX = 220
BLOCK_SCALAR_MARKERS = {"|", ">", "|-", ">-", "|+", ">+"}


def _finish_summary(raw: str) -> str:
    s = re.sub(r"\s+", " ", raw).strip()
    if len(s) >= 2 and s[0] == s[-1] and s[0] in "\"'":
        s = s[1:-1].strip()
    s = s.replace('\\"', '"')
    if len(s) > SUMMARY_MAX:
        s = s[: SUMMARY_MAX - 1].rsplit(" ", 1)[0].rstrip(",;:") + "…"
    return s


def extract_summary(text: str) -> str:
    """Return a clean human-readable description.

    Handles YAML frontmatter (`description: ...` single-line or block scalar `|` / `>`)
    and plain Markdown files without frontmatter (first body paragraph).
    """
    lines = text.splitlines()
    body_start = 0
    if lines and lines[0].strip() == "---":
        end = next((i for i in range(1, len(lines)) if lines[i].strip() == "---"), None)
        if end is not None:
            fm = lines[1:end]
            body_start = end + 1
            for i, line in enumerate(fm):
                m = re.match(r"^description:\s*(.*)$", line)
                if not m:
                    continue
                val = m.group(1).strip()
                if val in BLOCK_SCALAR_MARKERS or val == "":
                    collected: list[str] = []
                    for nxt in fm[i + 1 :]:
                        if not nxt.strip():
                            continue
                        if nxt.startswith((" ", "\t")):
                            collected.append(nxt.strip())
                        else:
                            break
                    val = " ".join(collected)
                if val:
                    return _finish_summary(val)
    para: list[str] = []
    for line in lines[body_start:]:
        s = line.strip()
        if not s:
            if para:
                break
            continue
        if s.startswith(("#", ">", "---", "|", "```")):
            if para:
                break
            continue
        para.append(s)
    return _finish_summary(" ".join(para))


def rebuild_index() -> int:
    """Rebuild design-systems/INDEX.json offline from local design-systems/*.md files."""
    idx_path = DESIGN_DIR / "INDEX.json"
    existing: dict[str, dict] = {}
    if idx_path.is_file():
        for entry in json.loads(idx_path.read_text(encoding="utf-8")).get("systems", []):
            existing[entry["slug"]] = entry
    domains = dict(PREFERRED_BRANDS)
    now_iso = datetime.now().astimezone().isoformat(timespec="seconds")
    entries = []
    for slug in list(existing) + [s for s, _ in PREFERRED_BRANDS if s not in existing]:
        path = DESIGN_DIR / f"{slug}.md"
        if not path.is_file():
            print(f"SKIP {slug}: missing {path.name}")
            continue
        content = path.read_text(encoding="utf-8")
        old = existing.get(slug, {})
        title_match = re.search(r"^#\s+(.+)$", content, re.MULTILINE)
        entries.append(
            {
                "slug": slug,
                "name": old.get("name") or (title_match.group(1).strip() if title_match else slug.title()),
                "domain": old.get("domain") or domains.get(slug, "Production Brand System"),
                "source_url": old.get("source_url")
                or f"https://github.com/VoltAgent/awesome-design-md/blob/HEAD/design-md/{slug}/DESIGN.md",
                "local_path": f"design-systems/{slug}.md",
                "lines": len(content.splitlines()),
                "bytes": len(content.encode("utf-8")),
                "palette_hex": extract_hexes(content, 8),
                "summary": extract_summary(content),
            }
        )
        print(f"OK {slug}: {entries[-1]['summary'][:80]}")
    idx_path.write_text(
        json.dumps({"generated_at": now_iso, "count": len(entries), "systems": entries}, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    return 0


def main() -> int:
    if "--rebuild-index" in sys.argv[1:]:
        return rebuild_index()
    DESIGN_DIR.mkdir(parents=True, exist_ok=True)
    SOURCE_DIR.mkdir(parents=True, exist_ok=True)
    IMPECCABLE_DIR.mkdir(parents=True, exist_ok=True)

    now_iso = datetime.now().astimezone().isoformat(timespec="seconds")

    # 1. Repo metadata
    repo_meta = []
    for repo in RESEARCH_REPOS:
        try:
            info = http_get_json(f"https://api.github.com/repos/{repo}")
            repo_meta.append(
                {
                    "repo": repo,
                    "stars": info.get("stargazers_count"),
                    "forks": info.get("forks_count"),
                    "license": (info.get("license") or {}).get("spdx_id"),
                    "description": info.get("description"),
                    "html_url": info.get("html_url"),
                    "default_branch": info.get("default_branch"),
                }
            )
            print(f"Repo {repo}: stars={info.get('stargazers_count')} license={(info.get('license') or {}).get('spdx_id')}")
        except Exception as exc:
            print(f"WARN repo {repo}: {exc}")
            repo_meta.append({"repo": repo, "error": str(exc)})

    (SOURCE_DIR / "github-design-skills-research.json").write_text(
        json.dumps({"fetched_at": now_iso, "repos": repo_meta}, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    # 2. Fetch DESIGN.md systems from VoltAgent/awesome-design-md
    awesome_tree = http_get_json("https://api.github.com/repos/VoltAgent/awesome-design-md/git/trees/HEAD?recursive=1")
    design_paths = [
        item["path"]
        for item in awesome_tree.get("tree", [])
        if item.get("type") == "blob" and item["path"].lower().endswith("design.md") and "/" in item["path"]
    ]
    print(f"Found {len(design_paths)} DESIGN.md files in VoltAgent/awesome-design-md")

    by_slug: dict[str, str] = {}
    for p in design_paths:
        parts = [x.lower() for x in p.split("/")]
        slug = parts[-2]
        if slug not in by_slug:
            by_slug[slug] = p

    selected: list[tuple[str, str, str]] = []
    used_paths = set()
    for slug, domain in PREFERRED_BRANDS:
        if len(selected) >= TARGET_COUNT:
            break
        match_path = by_slug.get(slug)
        if not match_path:
            base = slug.split(".")[0]
            for k, v in by_slug.items():
                if (slug in k or base == k or base in k) and v not in used_paths:
                    match_path = v
                    slug = k
                    break
        if match_path and match_path not in used_paths:
            selected.append((slug, domain, match_path))
            used_paths.add(match_path)

    for slug, path in sorted(by_slug.items()):
        if len(selected) >= TARGET_COUNT:
            break
        if path not in used_paths:
            selected.append((slug, "Production Brand System", path))
            used_paths.add(path)

    ds_entries = []
    for slug, domain, repo_path in selected:
        raw_url = f"https://raw.githubusercontent.com/VoltAgent/awesome-design-md/HEAD/{repo_path}"
        try:
            content = http_get_text(raw_url)
        except Exception as exc:
            print(f"FAIL DESIGN.md {slug}: {exc}")
            continue
        if len(content.strip()) < 200:
            continue
        out_file = DESIGN_DIR / f"{slug}.md"
        out_file.write_text(content, encoding="utf-8")
        title_match = re.search(r"^#\s+(.+)$", content, re.MULTILINE)
        title = title_match.group(1).strip() if title_match else slug.title()
        entry = {
            "slug": slug,
            "name": title,
            "domain": domain,
            "source_url": f"https://github.com/VoltAgent/awesome-design-md/blob/HEAD/{repo_path}",
            "local_path": f"design-systems/{slug}.md",
            "lines": len(content.splitlines()),
            "bytes": len(content.encode("utf-8")),
            "palette_hex": extract_hexes(content, 8),
            "summary": extract_summary(content),
        }
        ds_entries.append(entry)
        print(f"OK DESIGN.md {slug} ({entry['lines']} lines, hexes={len(entry['palette_hex'])})")

    (DESIGN_DIR / "INDEX.json").write_text(
        json.dumps({"generated_at": now_iso, "count": len(ds_entries), "systems": ds_entries}, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    # 3. Fetch core pbakaus/impeccable docs (skip if already cached)
    if not any(IMPECCABLE_DIR.glob("*.md")):
        try:
            imp_tree = http_get_json("https://api.github.com/repos/pbakaus/impeccable/git/trees/HEAD?recursive=1")
            imp_blobs = [item["path"] for item in imp_tree.get("tree", []) if item.get("type") == "blob" and item["path"].endswith(".md")]
            wanted_imp = []
            for p in imp_blobs:
                low = p.lower()
                if low.endswith("skill.md") or any(k in low for k in ("color", "typography", "spatial", "layout", "critique", "polish")):
                    if p not in wanted_imp:
                        wanted_imp.append(p)
            wanted_imp.sort(key=lambda x: (0 if x.lower().endswith("skill.md") else 1, len(x)))
            for p in wanted_imp[:5]:
                raw_url = f"https://raw.githubusercontent.com/pbakaus/impeccable/HEAD/{p}"
                txt = http_get_text(raw_url)
                safe_name = p.replace("/", "__")
                (IMPECCABLE_DIR / safe_name).write_text(txt, encoding="utf-8")
                print(f"OK impeccable: {p} -> source/impeccable/{safe_name} ({len(txt.splitlines())} lines)")
        except Exception as exc:
            print(f"WARN impeccable: {exc}")
    else:
        print("OK impeccable: using existing cached docs in source/impeccable/")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
