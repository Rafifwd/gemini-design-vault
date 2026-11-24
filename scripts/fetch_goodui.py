#!/usr/bin/env python3
"""Fetch all free public components, assets, charts, sounds, and AI blocks
from https://goodui.dev/r/registry.json into templates/goodui/, and promote
12 signature tactile items into templates/INDEX.json.
"""

from __future__ import annotations

import concurrent.futures
import json
import os
import re
import urllib.error
import urllib.request
from collections import Counter
from datetime import datetime
from pathlib import Path
from typing import Any

VAULT_ROOT = Path(__file__).resolve().parent.parent
TEMPLATES_DIR = VAULT_ROOT / "templates"
GOODUI_DIR = TEMPLATES_DIR / "goodui"
REGISTRY_URL = "https://goodui.dev/r/registry.json"
HEADERS = {"User-Agent": "gemini-design-vault/1.0"}

PROMOTED_SPECS = [
    {
        "id": "goodui-hold-to-confirm",
        "name": "hold-to-confirm.tsx",
        "category": "buttons",
        "registry_name": "hold-to-confirm",
        "use_case": "Destructive press-and-hold fill sweep button with early-release rewind & Space/Enter accessibility",
    },
    {
        "id": "goodui-liquid-glass-button",
        "name": "liquid-glass-button.tsx",
        "category": "buttons",
        "registry_name": "liquid-glass-button",
        "use_case": "Frosted translucent glass button & pill bar with pointer-tracking specular highlight & rim light",
    },
    {
        "id": "goodui-stateful-button",
        "name": "stateful-button.tsx",
        "category": "buttons",
        "registry_name": "stateful-button",
        "use_case": "Async button morphing idle -> spinner -> drawn check / shake error with spring width transition",
    },
    {
        "id": "goodui-rainbow-button",
        "name": "rainbow-button.tsx",
        "category": "buttons",
        "registry_name": "rainbow-button",
        "use_case": "Prismatic multi-hue focal CTA button with crisp dark/light inner core & animated spectrum border",
    },
    {
        "id": "goodui-ripple-button",
        "name": "ripple-button.tsx",
        "category": "buttons",
        "registry_name": "ripple-button",
        "use_case": "Tactile click-origin radial ripple feedback button respecting reduced motion",
    },
    {
        "id": "goodui-copy-button",
        "name": "copy-button.tsx",
        "category": "buttons",
        "registry_name": "copy-button",
        "use_case": "Inline copy button with animated clipboard-to-check morph & zero width shift",
    },
    {
        "id": "goodui-spotlight-card",
        "name": "spotlight-card.tsx",
        "category": "cards",
        "registry_name": "spotlight-card",
        "use_case": "Pointer-tracked radial spotlight surface reveal card for dark and moody stages",
    },
    {
        "id": "goodui-tilt-card",
        "name": "tilt-card.tsx",
        "category": "cards",
        "registry_name": "tilt-card",
        "use_case": "Perspective 3D tilt showcase card with subtle specular sheen on pointer move",
    },
    {
        "id": "goodui-aurora",
        "name": "aurora.tsx",
        "category": "assets",
        "registry_name": "aurora",
        "use_case": "Dynamic atmospheric aurora gradient backdrop layer for expressive hero stages",
    },
    {
        "id": "goodui-dock",
        "name": "dock.tsx",
        "category": "navigation",
        "registry_name": "dock",
        "use_case": "Interactive macOS-style proximity-magnified floating navigation dock",
    },
    {
        "id": "goodui-number-flow",
        "name": "number-flow.tsx",
        "category": "motion",
        "registry_name": "number-flow",
        "use_case": "Tabular rolling odometer number transition for live KPIs, pricing, and telemetry",
    },
    {
        "id": "goodui-sounds",
        "name": "sounds.ts",
        "category": "assets",
        "registry_name": "sounds",
        "use_case": "24 synthesized Web Audio UI micro-sounds (tap, toggle, success, error, celebrate) with zero audio files",
    },
]


def http_get_text(url: str) -> str:
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=25) as resp:
        return resp.read().decode("utf-8", errors="replace")


def derive_category(item: dict[str, Any]) -> str:
    files = item.get("files") or []
    if files:
        first_path = files[0].get("path", "")
        parts = [p for p in first_path.split("/") if p]
        if len(parts) >= 3 and parts[0] == "registry" and parts[1] == "components":
            return parts[2]
        if len(parts) >= 2 and parts[0] == "registry":
            return parts[1]
        if parts:
            if parts[0] in {"lib", "components", "hooks"}:
                return parts[0]
    name = item.get("name", "")
    if name.startswith("locale"):
        return "lib"
    return "other"


def fetch_item(item: dict[str, Any]) -> tuple[str, dict[str, Any] | None, str | None]:
    name = item["name"]
    url = f"https://goodui.dev/r/{name}.json"
    for attempt in range(3):
        try:
            text = http_get_text(url)
            return name, json.loads(text), None
        except Exception as exc:
            if attempt == 2:
                return name, None, str(exc)
    return name, None, "unknown"


def extract_deps_from_code(code: str) -> list[str]:
    deps = set()
    for match in re.findall(r"""from\s+['"]([^'"]+)['"]""", code):
        if not match.startswith(".") and not match.startswith("@/"):
            deps.add(match)
    return sorted(deps)


def main() -> int:
    GOODUI_DIR.mkdir(parents=True, exist_ok=True)
    now_iso = datetime.now().astimezone().isoformat(timespec="seconds")

    reg_raw = http_get_text(REGISTRY_URL)
    (GOODUI_DIR / "registry.json").write_text(reg_raw, encoding="utf-8")
    registry = json.loads(reg_raw)
    reg_items = registry.get("items", [])
    print(f"Fetched registry.json: {len(reg_items)} items")

    results: dict[str, dict[str, Any]] = {}
    errors: list[tuple[str, str]] = []

    with concurrent.futures.ThreadPoolExecutor(max_workers=12) as pool:
        futures = [pool.submit(fetch_item, item) for item in reg_items]
        for fut in concurrent.futures.as_completed(futures):
            name, payload, err = fut.result()
            if payload is not None:
                results[name] = payload
            else:
                errors.append((name, err or "error"))

    print(f"Fetched individual items: {len(results)} ok, {len(errors)} failed")
    for name, err in errors:
        print(f"  FAIL {name}: {err}")

    index_items: list[dict[str, Any]] = []
    cat_counts: Counter[str] = Counter()
    by_name_meta: dict[str, dict[str, Any]] = {}

    for reg_it in reg_items:
        name = reg_it["name"]
        payload = results.get(name)
        if not payload:
            continue
        category = derive_category(payload if payload.get("files") else reg_it)
        cat_counts[category] += 1

        item_dir = GOODUI_DIR / category / name
        item_dir.mkdir(parents=True, exist_ok=True)

        written_files: list[dict[str, Any]] = []
        for fobj in payload.get("files", []):
            content = fobj.get("content")
            if content is None:
                continue
            fpath = fobj.get("path", f"{name}.tsx")
            base = Path(fpath).name
            out_file = item_dir / base
            # Handle unlikely duplicate basenames inside same item
            if out_file.exists() and out_file.read_text(encoding="utf-8", errors="replace") != content:
                safe_name = fpath.replace("/", "__")
                out_file = item_dir / safe_name
            out_file.write_text(content, encoding="utf-8")
            rel_path = os.path.relpath(out_file, VAULT_ROOT).replace(os.sep, "/")
            written_files.append(
                {
                    "original_path": fpath,
                    "local_path": rel_path,
                    "lines": len(content.splitlines()),
                    "bytes": len(content.encode("utf-8")),
                }
            )

        entry = {
            "name": name,
            "title": payload.get("title") or reg_it.get("title") or name,
            "category": category,
            "type": payload.get("type") or reg_it.get("type") or "registry:component",
            "description": payload.get("description") or reg_it.get("description") or "",
            "dependencies": payload.get("dependencies") or [],
            "registryDependencies": payload.get("registryDependencies") or [],
            "raw_url": f"https://goodui.dev/r/{name}.json",
            "files": written_files,
        }
        index_items.append(entry)
        by_name_meta[name] = entry

    goodui_index = {
        "generated_at": now_iso,
        "source": REGISTRY_URL,
        "license": "Free Public Shadcn Registry (goodui.dev)",
        "count": len(index_items),
        "categories": dict(sorted(cat_counts.items())),
        "items": index_items,
    }
    (GOODUI_DIR / "INDEX.json").write_text(
        json.dumps(goodui_index, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Wrote templates/goodui/INDEX.json ({len(index_items)} items across {len(cat_counts)} categories)")

    # Promote 12 signature blocks into templates/INDEX.json (keep existing non-goodui items)
    tpl_idx_path = TEMPLATES_DIR / "INDEX.json"
    existing_data = json.loads(tpl_idx_path.read_text(encoding="utf-8"))
    existing_templates = [
        t for t in existing_data.get("templates", []) if not str(t.get("id", "")).startswith("goodui-")
    ]

    promoted_entries: list[dict[str, Any]] = []
    for spec in PROMOTED_SPECS:
        rname = spec["registry_name"]
        meta = by_name_meta.get(rname)
        if not meta or not meta.get("files"):
            print(f"WARN promoted item missing: {rname}")
            continue
        main_file = meta["files"][0]
        local_rel = main_file["local_path"]
        code_text = (VAULT_ROOT / local_rel).read_text(encoding="utf-8", errors="replace")
        deps = sorted(set((meta.get("dependencies") or []) + extract_deps_from_code(code_text)))
        comp_route_cat = meta["category"]
        if rname == "sounds":
            doc_url = "https://goodui.dev/docs/sounds"
        elif comp_route_cat in {"buttons", "cards", "backgrounds", "navigation", "numbers"}:
            doc_url = f"https://goodui.dev/components/{comp_route_cat}/{rname}"
        else:
            doc_url = f"https://goodui.dev/components"

        promoted_entries.append(
            {
                "id": spec["id"],
                "name": spec["name"],
                "category": spec["category"],
                "repo": "goodui.dev",
                "license": "Free Public Registry",
                "source_url": doc_url,
                "raw_url": meta["raw_url"],
                "fetched_at": now_iso,
                "local_path": local_rel,
                "lines": main_file["lines"],
                "bytes": main_file["bytes"],
                "dependencies": deps,
                "use_case": spec["use_case"],
            }
        )

    combined = existing_templates + promoted_entries
    tpl_idx_path.write_text(
        json.dumps(
            {
                "generated_at": now_iso,
                "count": len(combined),
                "templates": combined,
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    print(f"Updated templates/INDEX.json: {len(combined)} promoted templates ({len(promoted_entries)} from goodui.dev)")
    return 0 if not errors else 1


if __name__ == "__main__":
    raise SystemExit(main())
