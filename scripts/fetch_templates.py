#!/usr/bin/env python3
"""Fetch verbatim MIT-licensed production UI component templates from GitHub."""

from __future__ import annotations

import json
import re
import urllib.request
from datetime import datetime
from pathlib import Path

VAULT_ROOT = Path(__file__).resolve().parent.parent
TEMPLATES_DIR = VAULT_ROOT / "templates"
HEADERS = {"User-Agent": "gemini-design-vault/1.0"}

REPOS = {
    "shadcn-ui/ui": {
        "short": "shadcn",
        "license": "MIT",
        "prefer_prefix": "apps/v4/registry/new-york-v4/ui/",
        "fallback_prefix": "apps/www/registry/new-york/ui/",
    },
    "magicuidesign/magicui": {
        "short": "magicui",
        "license": "MIT",
        "prefer_prefix": "registry/magicui/",
        "fallback_prefix": "",
    },
    "ibelick/motion-primitives": {
        "short": "motion-primitives",
        "license": "MIT",
        "prefer_prefix": "components/core/",
        "fallback_prefix": "components/",
    },
    "emilkowalski/sonner": {
        "short": "sonner",
        "license": "MIT",
        "prefer_prefix": "src/",
        "fallback_prefix": "",
    },
}

WANTED = [
    {"id": "shadcn-button", "category": "buttons", "repo": "shadcn-ui/ui", "filename": "button.tsx", "use_case": "Production CVA button hierarchy (default/destructive/outline/secondary/ghost/link)"},
    {"id": "magicui-shimmer-button", "category": "buttons", "repo": "magicuidesign/magicui", "filename": "shimmer-button.tsx", "use_case": "Focal hero CTA button with subtle CSS conic shimmer"},
    {"id": "magicui-shiny-button", "category": "buttons", "repo": "magicuidesign/magicui", "filename": "shiny-button.tsx", "use_case": "Tactile glossy mask-sweep button"},
    {"id": "mp-magnetic", "category": "buttons", "repo": "ibelick/motion-primitives", "filename": "magnetic.tsx", "use_case": "Spring-physics tactile magnetic cursor attraction wrapper"},
    {"id": "mp-animated-background", "category": "navigation", "repo": "ibelick/motion-primitives", "filename": "animated-background.tsx", "use_case": "Shared-layout sliding pill/tab background indicator"},
    {"id": "shadcn-tabs", "category": "navigation", "repo": "shadcn-ui/ui", "filename": "tabs.tsx", "use_case": "Accessible Radix tabs primitive"},
    {"id": "shadcn-command", "category": "navigation", "repo": "shadcn-ui/ui", "filename": "command.tsx", "use_case": "Cmd+K command palette primitive (Raycast/Linear pattern)"},
    {"id": "magicui-bento-grid", "category": "cards", "repo": "magicuidesign/magicui", "filename": "bento-grid.tsx", "use_case": "Asymmetric 3-column bento showcase grid with hover reveal CTA"},
    {"id": "magicui-border-beam", "category": "cards", "repo": "magicuidesign/magicui", "filename": "border-beam.tsx", "use_case": "Subtle animated perimeter highlight for a single focal showcase card"},
    {"id": "shadcn-card", "category": "cards", "repo": "shadcn-ui/ui", "filename": "card.tsx", "use_case": "Clean composable Card/Header/Content/Footer primitive"},
    {"id": "shadcn-badge", "category": "cards", "repo": "shadcn-ui/ui", "filename": "badge.tsx", "use_case": "Semantic badge variants"},
    {"id": "mp-morphing-dialog", "category": "motion", "repo": "ibelick/motion-primitives", "filename": "morphing-dialog.tsx", "use_case": "Shared-element layoutId morphing card-to-dialog transition"},
    {"id": "mp-disclosure", "category": "motion", "repo": "ibelick/motion-primitives", "filename": "disclosure.tsx", "use_case": "Smooth height/opacity disclosure accordion"},
    {"id": "sonner-styles", "category": "motion", "repo": "emilkowalski/sonner", "filename": "styles.css", "use_case": "Emil Kowalski production toast CSS (easing, stacking transforms, shadows)"},
    {"id": "shadcn-input", "category": "forms", "repo": "shadcn-ui/ui", "filename": "input.tsx", "use_case": "Accessible form input with focus-visible ring tokens"},
    {"id": "shadcn-dialog", "category": "forms", "repo": "shadcn-ui/ui", "filename": "dialog.tsx", "use_case": "Accessible Radix modal dialog primitive"},
]


def http_get(url: str) -> bytes:
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=25) as resp:
        return resp.read()


def fetch_repo_tree(repo: str) -> list[str]:
    url = f"https://api.github.com/repos/{repo}/git/trees/HEAD?recursive=1"
    data = json.loads(http_get(url).decode("utf-8"))
    return [item["path"] for item in data.get("tree", []) if item.get("type") == "blob"]


def resolve_path(paths: list[str], filename: str, prefer_prefix: str, fallback_prefix: str) -> str | None:
    exact = [p for p in paths if p == filename or p.endswith("/" + filename)]
    if not exact:
        return None
    for prefix in (prefer_prefix, fallback_prefix):
        if prefix:
            for p in exact:
                if p.startswith(prefix):
                    return p
    return sorted(exact, key=len)[0]


def extract_dependencies(code: str) -> list[str]:
    deps = set()
    for match in re.findall(r"""from\s+['"]([^'"]+)['"]""", code):
        if not match.startswith(".") and not match.startswith("@/"):
            deps.add(match)
    return sorted(deps)


def main() -> int:
    TEMPLATES_DIR.mkdir(parents=True, exist_ok=True)
    trees: dict[str, list[str]] = {}
    for repo in REPOS:
        try:
            trees[repo] = fetch_repo_tree(repo)
            print(f"Tree {repo}: {len(trees[repo])} files")
        except Exception as exc:
            print(f"WARN tree {repo}: {exc}")
            trees[repo] = []

    index_entries = []
    now_iso = datetime.now().astimezone().isoformat(timespec="seconds")

    for spec in WANTED:
        repo = spec["repo"]
        meta = REPOS[repo]
        tree = trees.get(repo, [])
        repo_path = resolve_path(tree, spec["filename"], meta["prefer_prefix"], meta["fallback_prefix"])
        if not repo_path:
            print(f"SKIP {spec['id']}: {spec['filename']} not found in {repo}")
            continue

        raw_url = f"https://raw.githubusercontent.com/{repo}/HEAD/{repo_path}"
        try:
            raw_bytes = http_get(raw_url)
            code = raw_bytes.decode("utf-8")
        except Exception as exc:
            print(f"FAIL {spec['id']} ({raw_url}): {exc}")
            continue

        if not code.strip() or code.lstrip().startswith("<!DOCTYPE html"):
            print(f"FAIL {spec['id']}: invalid response body")
            continue

        cat_dir = TEMPLATES_DIR / spec["category"]
        cat_dir.mkdir(parents=True, exist_ok=True)
        out_name = f"{meta['short']}-{spec['filename']}"
        out_file = cat_dir / out_name
        out_file.write_text(code, encoding="utf-8")

        rel_local = f"templates/{spec['category']}/{out_name}"
        entry = {
            "id": spec["id"],
            "name": spec["filename"],
            "category": spec["category"],
            "repo": repo,
            "license": meta["license"],
            "source_url": f"https://github.com/{repo}/blob/HEAD/{repo_path}",
            "raw_url": raw_url,
            "fetched_at": now_iso,
            "local_path": rel_local,
            "lines": len(code.splitlines()),
            "bytes": len(raw_bytes),
            "dependencies": extract_dependencies(code),
            "use_case": spec["use_case"],
        }
        index_entries.append(entry)
        print(f"OK {spec['id']} -> {rel_local} ({entry['lines']} lines)")

    index_payload = {
        "generated_at": now_iso,
        "count": len(index_entries),
        "templates": index_entries,
    }
    (TEMPLATES_DIR / "INDEX.json").write_text(
        json.dumps(index_payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"INDEX.json written with {len(index_entries)} templates")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
