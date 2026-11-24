#!/usr/bin/env python3
"""Token-efficient query tool for the Gemini Design Vault (and the synced `gemini-design` skill).

Use it BEFORE opening large JSON/Markdown files so only 2-4 relevant files enter the context.
Stdlib only. Paths resolve from this file's location, so it works from any working directory,
both in the vault (`<vault>/scripts/`) and in the global skill (`<skill_dir>/scripts/`).

Subcommands:
  themes  [--domain Q] [--mood M] [--limit N]   brands (design-systems/), color worlds, style packs
  lego    [--category C] [--q Q] [--no-motion] [--max-deps N] [--source S] [--exclude-blocks] [--limit N]
  rea     [--site SLUG]                          measured production tokens from rea/*.json
  stats                                          asset counts and reference statuses

Add --json to any subcommand for machine-readable output.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HEX_RE = re.compile(r"#[0-9A-Fa-f]{6}\b")
MOTION_LIBS = {"motion", "motion/react", "framer-motion"}
HEAVY_LIBS = MOTION_LIBS | {"radix-ui", "cmdk"}
IMPLICIT_DEPS = {"react", "react-dom", "cn"}
BLOCK_WARNING = "[LAYOUT-INSPIRATION-ONLY: do not copy wholesale]"

DOMAIN_SYNONYMS = {
    "fintech": ["fintech", "payment", "bank", "money", "finance", "b2b"],
    "bank": ["fintech", "bank", "payment", "money"],
    "devtools": ["developer", "devtools", "dev", "database", "cloud", "infrastructure"],
    "developer": ["developer", "devtools", "database", "cloud", "infrastructure"],
    "saas": ["saas", "workspace", "productivity", "b2b", "tooling"],
    "ai": ["ai", "frontier", "assistant"],
    "editorial": ["editorial", "media", "magazine", "print"],
    "media": ["media", "editorial", "music", "magazine"],
    "ecommerce": ["commerce", "retail", "marketplace", "store"],
    "commerce": ["commerce", "retail", "marketplace", "store"],
    "luxury": ["luxury", "supercar", "atelier", "motorsport"],
    "automotive": ["motorsport", "supercar", "luxury", "automotive"],
    "health": ["clinical", "health", "consumer"],
    "clinic": ["clinical", "health", "consumer"],
    "hospitality": ["hospitality", "marketplace", "warm"],
    "creative": ["creative", "canvas", "studio", "design"],
    "portfolio": ["creative", "studio", "gallery", "portfolio"],
    "dashboard": ["dashboard", "analytics", "workspace", "operate"],
    "analytics": ["analytics", "dashboard", "data"],
}

MOOD_KEYWORDS = {
    "dark": ["dark", "near-black", "obsidian", "black", "carbon", "cinematic"],
    "light": ["light", "white", "cream", "paper", "bright", "clean", "ivory"],
    "vivid": ["vivid", "electric", "neon", "acid", "volt", "orange", "expressive", "saturated", "bold", "lime", "yellow", "gradient"],
    "minimal": ["minimal", "clinical", "monochrome", "hairline", "restrained", "calm", "crisp"],
    "editorial": ["editorial", "magazine", "serif", "print", "media", "atelier"],
    "brutal": ["brutal", "offset", "hard shadow", "bold", "stepped"],
    "glass": ["glass", "frosted", "translucent", "blur", "aurora"],
}


def read_text(rel: str) -> str:
    path = ROOT / rel
    return path.read_text(encoding="utf-8") if path.is_file() else ""


def read_json(rel: str) -> dict:
    path = ROOT / rel
    if not path.is_file():
        return {}
    return json.loads(path.read_text(encoding="utf-8"))


def clean_md(s: str) -> str:
    s = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", s)
    return re.sub(r"[`*]", "", s).strip()


def uniq_hexes(text: str, limit: int = 5) -> list[str]:
    seen: list[str] = []
    for h in HEX_RE.findall(text):
        h = h.upper()
        if h not in seen:
            seen.append(h)
    return seen[:limit]


def section(text: str, number: int) -> str:
    m = re.search(rf"^## {number}\..*?$(.*?)(?=^## |\Z)", text, re.S | re.M)
    return m.group(1) if m else ""


# --------------------------------------------------------------------------- themes


def load_brands() -> list[dict]:
    out = []
    for s in read_json("design-systems/INDEX.json").get("systems", []):
        out.append(
            {
                "kind": "brand",
                "slug": s["slug"],
                "name": s["name"],
                "domain": s.get("domain", ""),
                "hexes": [h.upper() for h in s.get("palette_hex", [])[:5]],
                "summary": s.get("summary", ""),
                "path": s["local_path"],
            }
        )
    return out


def load_worlds() -> list[dict]:
    out = []
    for line in section(read_text("references/DESIGN-GRAMMAR.md"), 4).splitlines():
        if not line.startswith("|") or line.startswith("| ---") or line.startswith("| Dunia"):
            continue
        cols = [clean_md(c) for c in line.strip().strip("|").split("|")]
        if len(cols) < 6:
            continue
        out.append(
            {
                "kind": "world",
                "slug": cols[0],
                "name": cols[0],
                "domain": cols[5],
                "hexes": uniq_hexes(" ".join(cols[2:5])),
                "summary": f"Ref {cols[1]}. Canvas {cols[2]}. Ink {cols[3]}. Accent {cols[4]}."[:230],
                "path": "references/DESIGN-GRAMMAR.md (section 4)",
            }
        )
    return out


def load_packs() -> list[dict]:
    out = []
    text = section(read_text("references/STYLE-PACKS.md"), 2)
    for block in re.split(r"^### ", text, flags=re.M)[1:]:
        head = block.splitlines()[0]
        m = re.match(r"\d+\)\s*`([^`]+)`\s*—\s*(.*)", head)
        if not m:
            continue
        karakter = re.search(r"\*\*Karakter:\*\*\s*(.*)", block)
        cocok = re.search(r"\*\*Cocok untuk:\*\*\s*(.*)", block)
        out.append(
            {
                "kind": "pack",
                "slug": m.group(1),
                "name": f"{m.group(1)} ({m.group(2).strip()})",
                "domain": clean_md(cocok.group(1)) if cocok else "",
                "hexes": uniq_hexes(block),
                "summary": clean_md(karakter.group(1))[:230] if karakter else "",
                "path": "references/STYLE-PACKS.md (section 2)",
            }
        )
    return out


def expand_terms(domain: str | None) -> list[str]:
    if not domain:
        return []
    terms: list[str] = []
    for tok in re.split(r"[\s,/]+", domain.lower()):
        if not tok:
            continue
        terms.append(tok)
        terms.extend(DOMAIN_SYNONYMS.get(tok, []))
    return list(dict.fromkeys(terms))


def theme_score(item: dict, terms: list[str], mood: str | None) -> int:
    hay = " ".join([item["slug"], item["name"], item["domain"], item["summary"]]).lower()
    score = sum(1 for t in terms if t in hay)
    if mood:
        score += sum(1 for k in MOOD_KEYWORDS.get(mood, [mood]) if k in hay)
    return score


def cmd_themes(args: argparse.Namespace) -> dict:
    terms = expand_terms(args.domain)
    groups = {"brand": load_brands(), "world": load_worlds(), "pack": load_packs()}
    ranked: dict[str, list[dict]] = {}
    for kind, items in groups.items():
        scored = [(theme_score(i, terms, args.mood), idx, i) for idx, i in enumerate(items)]
        if terms or args.mood:
            scored = [t for t in scored if t[0] > 0]
        scored.sort(key=lambda t: (-t[0], t[1]))
        ranked[kind] = [dict(i, score=s) for s, _, i in scored]
    merged: list[dict] = []
    pos = 0
    while len(merged) < args.limit and any(pos < len(v) for v in ranked.values()):
        for kind in ("brand", "world", "pack"):
            if pos < len(ranked[kind]) and len(merged) < args.limit:
                merged.append(ranked[kind][pos])
        pos += 1
    return {"query": {"domain": args.domain, "mood": args.mood, "limit": args.limit}, "results": merged}


def render_themes(data: dict) -> str:
    lines = [f"themes domain={data['query']['domain']} mood={data['query']['mood']} -> {len(data['results'])} hit(s)"]
    if not data["results"]:
        lines.append("  (no match: loosen --domain/--mood or run without filters)")
    for r in data["results"]:
        lines.append(f"[{r['kind']}] {r['slug']} | {r['domain']}")
        if r["hexes"]:
            lines.append(f"  hex: {' '.join(r['hexes'])}")
        lines.append(f"  {r['summary']}")
        lines.append(f"  -> {r['path']}")
    return "\n".join(lines)


# --------------------------------------------------------------------------- lego


def load_lego() -> list[dict]:
    items: list[dict] = []
    featured_paths: set[str] = set()
    for t in read_json("templates/INDEX.json").get("templates", []):
        featured_paths.add(t["local_path"])
        items.append(
            {
                "source": "featured",
                "id": t["id"],
                "title": t["id"],
                "category": t["category"],
                "description": t.get("use_case", ""),
                "deps": t.get("dependencies", []),
                "rdeps": [],
                "paths": [t["local_path"]],
            }
        )
    for it in read_json("templates/goodui/INDEX.json").get("items", []):
        paths = [f["local_path"] for f in it.get("files", [])]
        if any(p in featured_paths for p in paths):
            continue
        rdeps = [r.rsplit("/", 1)[-1].removesuffix(".json") for r in it.get("registryDependencies", [])]
        items.append(
            {
                "source": "goodui",
                "id": it["name"],
                "title": it.get("title", it["name"]),
                "category": it["category"],
                "description": it.get("description", ""),
                "deps": it.get("dependencies", []),
                "rdeps": rdeps,
                "paths": paths,
            }
        )
    for it in items:
        it["tier"] = lego_tier(it)
        it["uses_motion"] = bool(set(it["deps"]) & MOTION_LIBS)
        it["warning"] = BLOCK_WARNING if it["category"] == "blocks" else ""
    return items


def lego_tier(it: dict) -> str:
    if it["paths"] and all(p.endswith(".css") for p in it["paths"]):
        return "css-token-only"
    if set(it["deps"]) & HEAVY_LIBS or "goodui-motion" in it["rdeps"]:
        return "blueprint-translate"
    return "light-behavior"


def lego_score(it: dict, tokens: list[str]) -> int:
    score = 0
    for t in tokens:
        if t in it["id"].lower():
            score += 3
        if t in it["title"].lower():
            score += 2
        if t in it["description"].lower() or t in it["category"].lower():
            score += 1
    return score


def cmd_lego(args: argparse.Namespace) -> dict:
    items = load_lego()
    if args.source != "all":
        items = [i for i in items if i["source"] == args.source]
    if args.category:
        items = [i for i in items if i["category"].lower() == args.category.lower()]
    if args.no_motion:
        items = [i for i in items if not i["uses_motion"]]
    if args.max_deps is not None:
        items = [i for i in items if len(set(i["deps"]) - IMPLICIT_DEPS) <= args.max_deps]
    if args.exclude_blocks:
        items = [i for i in items if i["category"] != "blocks"]
    tokens = [t for t in re.split(r"\s+", (args.q or "").lower()) if t]
    scored = [(lego_score(i, tokens), idx, i) for idx, i in enumerate(items)]
    if tokens:
        scored = [t for t in scored if t[0] > 0]
    scored.sort(key=lambda t: (-t[0], t[2]["category"], t[2]["id"]))
    total = len(scored)
    return {
        "query": {
            "category": args.category, "q": args.q, "no_motion": args.no_motion, "max_deps": args.max_deps,
            "source": args.source, "exclude_blocks": args.exclude_blocks, "limit": args.limit,
        },
        "total_matches": total,
        "results": [i for _, _, i in scored[: args.limit]],
    }


def render_lego(data: dict) -> str:
    res = data["results"]
    lines = [f"lego -> showing {len(res)} of {data['total_matches']} match(es)  (tiers: css-token-only < light-behavior < blueprint-translate)"]
    if not res:
        lines.append("  (no match: loosen filters)")
    for i in res:
        deps = ", ".join(sorted(set(i["deps"]) - IMPLICIT_DEPS)) or "none"
        extra = f" (+{len(i['paths']) - 1} files)" if len(i["paths"]) > 1 else ""
        warn = f" {i['warning']}" if i["warning"] else ""
        lines.append(f"- [{i['category']}] {i['id']} ({i['tier']}, {i['source']}) deps: {deps}{warn}")
        lines.append(f"    {i['description'][:110]}")
        lines.append(f"    -> {i['paths'][0] if i['paths'] else '-'}{extra}")
    return "\n".join(lines)


# --------------------------------------------------------------------------- rea


def cmd_rea(args: argparse.Namespace) -> dict:
    sites = []
    for p in sorted((ROOT / "rea").glob("*.json")):
        d = json.loads(p.read_text(encoding="utf-8"))
        if args.site and d.get("slug", p.stem) != args.site and p.stem != args.site:
            continue
        sites.append(d)
    return {"query": {"site": args.site}, "available": sorted(p.stem for p in (ROOT / "rea").glob("*.json")), "sites": sites}


def render_rea(data: dict) -> str:
    if not data["sites"]:
        return f"rea: no site '{data['query']['site']}'. available: {', '.join(data['available'])}"
    if not data["query"]["site"]:
        return "rea available: " + ", ".join(data["available"]) + "  (use --site <slug> for tokens)"
    out = []
    for d in data["sites"]:
        body, hdr = d.get("body", {}), d.get("header", {})
        vp = d.get("viewport", {})
        out.append(f"rea {d.get('slug')} {d.get('url')} viewport {vp.get('width')}x{vp.get('height')}")
        out.append(f"  body: bg {body.get('backgroundColor')} ink {body.get('color')} font {str(body.get('fontFamily', ''))[:48]} {body.get('fontSize')}/{body.get('lineHeight')}")
        out.append(f"  header: h {hdr.get('height')} bg {hdr.get('backgroundColor')} blur {hdr.get('backdropFilter')} border-b {hdr.get('borderBottom')} links {hdr.get('linkCount')}")
        for k in ("h1", "h2"):
            h = d.get(k) or {}
            if h:
                out.append(f"  {k}: {h.get('fontSize')}/{h.get('lineHeight')} w{h.get('fontWeight')} ls {h.get('letterSpacing')} ink {h.get('color')}")
        radii = ", ".join(f"{r['value']}({r['count']})" for r in d.get("top_radii", [])[:4])
        out.append(f"  top radii: {radii}")
        for b in d.get("buttons", [])[:2]:
            out.append(f"  btn '{b.get('text')}': h {b.get('height')} pad {b.get('padding')} r {b.get('borderRadius')} bg {b.get('backgroundColor')} ink {b.get('color')} t {b.get('transitionDuration')}")
        out.append(f"  dossier: rea/{d.get('slug')}.json  screenshot: {d.get('screenshot')}")
    return "\n".join(out)


# --------------------------------------------------------------------------- stats


def cmd_stats(_: argparse.Namespace) -> dict:
    statuses: dict[str, list[str]] = {}
    for line in read_text("references/INDEX.md").splitlines():
        if not line.startswith("|"):
            continue
        cols = [c.strip() for c in line.strip().strip("|").split("|")]
        if len(cols) >= 3 and cols[2].strip("`") in {"ready", "seeded", "template"}:
            statuses.setdefault(cols[2].strip("`"), []).append(clean_md(cols[1]))
    good = read_json("templates/goodui/INDEX.json")
    return {
        "root": str(ROOT),
        "design_systems": read_json("design-systems/INDEX.json").get("count", 0),
        "rea_dossiers": len(list((ROOT / "rea").glob("*.json"))),
        "templates_featured": read_json("templates/INDEX.json").get("count", 0),
        "templates_goodui": good.get("count", 0),
        "goodui_categories": good.get("categories", {}),
        "references_by_status": statuses,
    }


def render_stats(d: dict) -> str:
    lines = [
        f"vault root: {d['root']}",
        f"design-systems: {d['design_systems']} | rea dossiers: {d['rea_dossiers']} | templates featured: {d['templates_featured']} | goodui items: {d['templates_goodui']}",
        "goodui categories: " + ", ".join(f"{k}={v}" for k, v in d["goodui_categories"].items()),
    ]
    for status in ("ready", "seeded", "template"):
        files = d["references_by_status"].get(status, [])
        lines.append(f"references {status} ({len(files)}): {', '.join(files)}")
    return "\n".join(lines)


# --------------------------------------------------------------------------- main


def build_parser() -> argparse.ArgumentParser:
    common = argparse.ArgumentParser(add_help=False)
    common.add_argument("--json", action="store_true", help="machine-readable JSON output")
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="cmd", required=True)

    t = sub.add_parser("themes", parents=[common], help="search brands, color worlds and style packs")
    t.add_argument("--domain", help="product domain, e.g. fintech, devtools, editorial, luxury, health")
    t.add_argument("--mood", choices=sorted(MOOD_KEYWORDS), help="visual mood filter")
    t.add_argument("--limit", type=int, default=8)

    lg = sub.add_parser("lego", parents=[common], help="search 28 featured + 195 goodui components")
    lg.add_argument("--category", help="e.g. buttons, charts, numbers, navigation, cards, inputs, overlays, blocks")
    lg.add_argument("--q", help="keywords (all searched in id/title/description/category)")
    lg.add_argument("--no-motion", action="store_true", help="exclude items that depend on the motion npm library")
    lg.add_argument("--max-deps", type=int, help="max npm dependencies (react/cn excluded)")
    lg.add_argument("--source", choices=["featured", "goodui", "all"], default="all")
    lg.add_argument("--exclude-blocks", action="store_true", help="hide full-section 'blocks' items")
    lg.add_argument("--limit", type=int, default=12)

    r = sub.add_parser("rea", parents=[common], help="measured production tokens from rea/*.json")
    r.add_argument("--site", help="apple, linear, vercel, stripe, raycast, goodui")

    sub.add_parser("stats", parents=[common], help="asset counts and reference statuses")
    return p


def main(argv: list[str] | None = None) -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    args = build_parser().parse_args(argv)
    handlers = {
        "themes": (cmd_themes, render_themes),
        "lego": (cmd_lego, render_lego),
        "rea": (cmd_rea, render_rea),
        "stats": (cmd_stats, render_stats),
    }
    run, render = handlers[args.cmd]
    data = run(args)
    print(json.dumps(data, ensure_ascii=False, indent=2) if args.json else render(data))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
