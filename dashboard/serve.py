#!/usr/bin/env python3
"""Local catalog & monitoring server for Gemini Design Vault.

Provides a live JSON API (/api/vault), static file serving restricted to the
vault root, and a snapshot generator (dashboard/vault-snapshot.js) so
dashboard/index.html also works when opened directly via file://.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import mimetypes
import os
import re
import threading
import webbrowser
from datetime import datetime
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any
from urllib.parse import unquote, urlparse

IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif", ".avif"}


def _file_meta(path: Path) -> dict[str, Any]:
    data = path.read_bytes()
    stat = path.stat()
    mtime = datetime.fromtimestamp(stat.st_mtime).astimezone().isoformat(timespec="seconds")
    text = data.decode("utf-8", errors="replace")
    return {
        "bytes": len(data),
        "lines": len(text.splitlines()),
        "sha256": hashlib.sha256(data).hexdigest()[:12],
        "sha256_full": hashlib.sha256(data).hexdigest(),
        "modified_at": mtime,
        "text": text,
    }


def _slugify(title: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")
    return slug or "section"


def parse_skill(vault_root: Path) -> dict[str, Any]:
    skill_path = vault_root / "SKILL.md"
    if not skill_path.exists():
        return {"exists": False, "path": "SKILL.md", "sections": [], "checklist": []}

    meta = _file_meta(skill_path)
    text = meta["text"]
    frontmatter: dict[str, Any] = {}
    body = text
    fm_match = re.match(r"^---\n(.*?)\n---\n?(.*)$", text, re.DOTALL)
    if fm_match:
        for line in fm_match.group(1).splitlines():
            if ":" in line:
                k, v = line.split(":", 1)
                key = k.strip().replace("-", "_")
                val = v.strip()
                if val.lower() in {"true", "false"}:
                    frontmatter[key] = val.lower() == "true"
                else:
                    frontmatter[key] = val
        body = fm_match.group(2)

    sections: list[dict[str, Any]] = []
    current_title: str | None = None
    current_lines: list[str] = []

    for line in body.splitlines():
        if line.startswith("## "):
            if current_title is not None:
                sec_body = "\n".join(current_lines).strip()
                subheadings = [l[4:].strip() for l in current_lines if l.startswith("### ")]
                sections.append(
                    {
                        "title": current_title,
                        "anchor": _slugify(current_title),
                        "lines": len(current_lines),
                        "subheadings": subheadings,
                        "body": sec_body,
                    }
                )
            current_title = line[3:].strip()
            current_lines = []
        elif current_title is not None:
            current_lines.append(line)

    if current_title is not None:
        sec_body = "\n".join(current_lines).strip()
        subheadings = [l[4:].strip() for l in current_lines if l.startswith("### ")]
        sections.append(
            {
                "title": current_title,
                "anchor": _slugify(current_title),
                "lines": len(current_lines),
                "subheadings": subheadings,
                "body": sec_body,
            }
        )

    checklist: list[dict[str, Any]] = []
    for sec in sections:
        if sec["title"].startswith("Anti-Slop Audit Checklist"):
            current_group: dict[str, Any] | None = None
            for line in sec["body"].splitlines():
                grp_match = re.match(r"^-\s+\*\*(.+?):?\*\*\s*$", line)
                if grp_match:
                    current_group = {"group": grp_match.group(1).rstrip(":"), "items": []}
                    checklist.append(current_group)
                    continue
                item_match = re.match(r"^\s{2,}-\s+(.+?)\s*$", line)
                if item_match and current_group is not None:
                    item_text = re.sub(r"\s*\(Ya/Tidak\)\s*$", "", item_match.group(1)).strip()
                    current_group["items"].append(item_text)

    return {
        "exists": True,
        "path": "SKILL.md",
        "url_path": "/SKILL.md",
        "lines": meta["lines"],
        "bytes": meta["bytes"],
        "sha256": meta["sha256"],
        "modified_at": meta["modified_at"],
        "frontmatter": frontmatter,
        "sections": sections,
        "checklist": checklist,
        "raw": text,
    }


def parse_taste(vault_root: Path) -> dict[str, Any]:
    taste_path = vault_root / "references" / "TASTE-PROFILE.md"
    if not taste_path.exists():
        return {"exists": False, "path": "references/TASTE-PROFILE.md", "sections": [], "ban_list": []}

    meta = _file_meta(taste_path)
    text = meta["text"]
    status_match = re.search(r"\*\*Status:\*\*\s*`([^`]+)`", text)
    status = status_match.group(1) if status_match else "unknown"

    three_words: list[str] = []
    for line in text.splitlines():
        if "3 kata" in line:
            three_words = re.findall(r"`([^`]+)`", line)
            break

    sections: list[dict[str, Any]] = []
    current_title: str | None = None
    current_lines: list[str] = []
    for line in text.splitlines():
        if line.startswith("## "):
            if current_title is not None:
                sections.append({"title": current_title, "body": "\n".join(current_lines).strip()})
            current_title = line[3:].strip()
            current_lines = []
        elif current_title is not None:
            current_lines.append(line)
    if current_title is not None:
        sections.append({"title": current_title, "body": "\n".join(current_lines).strip()})

    ban_list: list[dict[str, Any]] = []
    in_ban = False
    for line in text.splitlines():
        if line.startswith("## 6.") and "Ban List" in line:
            in_ban = True
            continue
        if in_ban and line.startswith("## "):
            break
        if in_ban:
            m = re.match(r"^-\s+\[([ xX])\]\s+(.+)$", line)
            if m:
                ban_list.append({"checked": m.group(1).lower() == "x", "text": m.group(2).strip()})

    return {
        "exists": True,
        "path": "references/TASTE-PROFILE.md",
        "url_path": "/references/TASTE-PROFILE.md",
        "status": status,
        "lines": meta["lines"],
        "bytes": meta["bytes"],
        "sha256": meta["sha256"],
        "modified_at": meta["modified_at"],
        "three_words": three_words,
        "sections": sections,
        "ban_list": ban_list,
        "raw": text,
    }


def _parse_reference_entries(text: str) -> tuple[list[str], list[dict[str, Any]]]:
    principles: list[str] = []
    entries: list[dict[str, Any]] = []

    in_principles = False
    in_collection = False
    current_entry: dict[str, Any] | None = None
    in_rules = False
    current_rule: dict[str, str] | None = None

    for line in text.splitlines():
        if line.startswith("## Prinsip Dasar") or line.startswith("## Aturan Anti-Slop"):
            in_principles = True
            in_collection = False
            continue
        if line.startswith("## Koleksi Referensi"):
            in_principles = False
            in_collection = True
            continue
        if line.startswith("## ") and not line.startswith("### "):
            in_principles = False
            in_collection = False
            continue

        if in_principles and line.startswith("- "):
            principles.append(line[2:].strip())
            continue

        if not in_collection:
            continue

        if line.startswith("### "):
            if current_entry is not None and not current_entry["name"].startswith("[Contoh Template"):
                entries.append(current_entry)
            current_entry = {
                "name": line[4:].strip(),
                "sumber": "",
                "tags": [],
                "why_good": "",
                "rules": [],
                "good_for": "",
                "avoid_when": "",
            }
            in_rules = False
            current_rule = None
            continue

        if current_entry is None:
            continue

        if line.startswith("- **Sumber:**"):
            in_rules = False
            current_entry["sumber"] = line.split(":**", 1)[1].strip()
        elif line.startswith("- **Tag:**"):
            in_rules = False
            current_entry["tags"] = re.findall(r"`([^`]+)`", line)
        elif line.startswith("- **Kenapa bagus:**"):
            in_rules = False
            current_entry["why_good"] = line.split(":**", 1)[1].strip()
        elif line.startswith("- **Aturan konkret:**"):
            in_rules = True
            current_rule = None
        elif line.startswith("- **Cocok untuk:**"):
            in_rules = False
            current_entry["good_for"] = line.split(":**", 1)[1].strip()
        elif line.startswith("- **Hindari saat:**"):
            in_rules = False
            current_entry["avoid_when"] = line.split(":**", 1)[1].strip()
        elif in_rules:
            rule_match = re.match(r"^\s{2}-\s+\*\*(.+?):?\*\*\s*(.*)$", line)
            if rule_match:
                label = rule_match.group(1).rstrip(":").strip()
                body = rule_match.group(2).strip()
                current_rule = {"label": label, "text": body}
                current_entry["rules"].append(current_rule)
            else:
                sub_match = re.match(r"^\s{4,}-\s+(.+)$", line)
                if sub_match and current_rule is not None:
                    extra = sub_match.group(1).strip()
                    current_rule["text"] = f"{current_rule['text']} • {extra}" if current_rule["text"] else extra

    if current_entry is not None and not current_entry["name"].startswith("[Contoh Template"):
        entries.append(current_entry)

    return principles, entries


def parse_references(vault_root: Path) -> tuple[list[dict[str, Any]], dict[str, Any], list[dict[str, Any]]]:
    refs_dir = vault_root / "references"
    index_path = refs_dir / "INDEX.md"
    index_meta = _file_meta(index_path) if index_path.exists() else {"text": "", "lines": 0, "sha256": "", "modified_at": ""}

    items: list[dict[str, Any]] = []
    if index_path.exists():
        in_table = False
        for line in index_meta["text"].splitlines():
            if line.startswith("| Kategori |"):
                in_table = True
                continue
            if in_table and line.startswith("| ---"):
                continue
            if in_table:
                if not line.startswith("|"):
                    break
                cols = [c.strip() for c in line.strip("|").split("|")]
                if len(cols) < 4:
                    continue
                category, file_col, status_col, summary = cols[0], cols[1], cols[2], cols[3]
                link_match = re.search(r"\[([^\]]+)\]\(([^)]+)\)", file_col)
                file_label = link_match.group(1) if link_match else file_col
                target_rel = link_match.group(2) if link_match else ""
                status = status_col.strip("`").strip()

                resolved = (refs_dir / target_rel).resolve() if target_rel else refs_dir
                is_dir = resolved.is_dir()
                rel_from_vault = os.path.relpath(resolved, vault_root).replace(os.sep, "/")

                record: dict[str, Any] = {
                    "category": category,
                    "file_label": file_label,
                    "rel_path": rel_from_vault,
                    "url_path": f"/{rel_from_vault}",
                    "status": status,
                    "summary": summary,
                    "is_dir": is_dir,
                    "principles": [],
                    "entries": [],
                    "entry_count": 0,
                }
                if not is_dir and resolved.is_file():
                    fmeta = _file_meta(resolved)
                    principles, entries = _parse_reference_entries(fmeta["text"])
                    record.update(
                        {
                            "lines": fmeta["lines"],
                            "bytes": fmeta["bytes"],
                            "sha256": fmeta["sha256"],
                            "modified_at": fmeta["modified_at"],
                            "principles": principles,
                            "entries": entries,
                            "entry_count": len(entries),
                            "raw": fmeta["text"],
                        }
                    )
                items.append(record)

    layer2 = [
        {
            "name": "better-ui",
            "role": "59 dossier analisis situs lengkap (Commerce, Agency, SaaS, Editorial, Experimental)",
            "path": "~/.agents/skills/better-ui/REFERENCE-INDEX.md",
            "command": None,
        },
        {
            "name": "ui-ux-pro-max",
            "role": "Generator aturan & token design system terkalibrasi",
            "path": "~/.agents/skills/ui-ux-pro-max/scripts/search.py",
            "command": 'python3 ~/.agents/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system -p "<Product>"',
        },
        {
            "name": "ui-craft",
            "role": "Gate produksi UI web (WCAG AA, persistensi MASTER.md, verifikasi browser multi-viewport)",
            "path": "~/.agents/skills/ui-craft/SKILL.md",
            "command": None,
        },
    ]

    assets: list[dict[str, Any]] = []
    assets_dir = refs_dir / "assets"
    if assets_dir.is_dir():
        for p in sorted(assets_dir.rglob("*")):
            if p.is_file() and p.suffix.lower() in IMAGE_EXTS:
                rel_from_vault = os.path.relpath(p, vault_root).replace(os.sep, "/")
                stat = p.stat()
                assets.append(
                    {
                        "name": p.name,
                        "rel_path": rel_from_vault,
                        "url_path": f"/{rel_from_vault}",
                        "size_bytes": stat.st_size,
                        "modified_at": datetime.fromtimestamp(stat.st_mtime).astimezone().isoformat(timespec="seconds"),
                    }
                )

    index_info = {
        "path": "references/INDEX.md",
        "url_path": "/references/INDEX.md",
        "lines": index_meta["lines"],
        "sha256": index_meta["sha256"],
        "modified_at": index_meta["modified_at"],
        "raw": index_meta["text"],
    }
    return items, index_info, layer2, assets


def parse_eval(vault_root: Path) -> dict[str, Any]:
    eval_dir = vault_root / "eval"
    results_path = eval_dir / "RESULTS.md"
    results_meta = _file_meta(results_path) if results_path.exists() else None

    fixture_path = eval_dir / "slop-fixture.html"
    fixture_info: dict[str, Any] | None = None
    if fixture_path.exists():
        fmeta = _file_meta(fixture_path)
        fixture_info = {
            "name": fixture_path.name,
            "rel_path": "eval/slop-fixture.html",
            "url_path": "/eval/slop-fixture.html",
            "lines": fmeta["lines"],
            "size_bytes": fmeta["bytes"],
            "sha256": fmeta["sha256"],
            "modified_at": fmeta["modified_at"],
        }

    cases: list[dict[str, Any]] = []
    seen_html: set[str] = {"slop-fixture.html"}

    if results_meta is not None:
        in_summary = False
        for line in results_meta["text"].splitlines():
            if line.startswith("| Kasus | Prompt"):
                in_summary = True
                continue
            if in_summary and line.startswith("| ---"):
                continue
            if in_summary:
                if not line.startswith("|"):
                    break
                cols = [c.strip() for c in line.strip("|").split("|")]
                if len(cols) < 5:
                    continue
                case_id = cols[0].strip("*").strip()
                title = cols[1]
                jalur = cols[2]
                status = cols[3].strip("*").strip()
                output_col = cols[4]

                links = re.findall(r"\[`?([^`\]]+)`?\]\(([^)]+)\)", output_col)
                html_rel = None
                audit_rel = None
                for _, href in links:
                    clean = href.lstrip("./")
                    if clean.endswith(".html"):
                        html_rel = f"eval/{clean}"
                        seen_html.add(clean)
                    elif clean.endswith(".md"):
                        audit_rel = f"eval/{clean}"

                html_file = (vault_root / html_rel) if html_rel else None
                html_meta = _file_meta(html_file) if (html_file and html_file.exists()) else None
                audit_file = (vault_root / audit_rel) if audit_rel else None
                audit_meta = _file_meta(audit_file) if (audit_file and audit_file.exists()) else None

                cases.append(
                    {
                        "id": case_id,
                        "title": title,
                        "jalur": jalur,
                        "status": status,
                        "html_path": html_rel,
                        "html_url": f"/{html_rel}" if html_rel else None,
                        "lines": html_meta["lines"] if html_meta else 0,
                        "size_bytes": html_meta["bytes"] if html_meta else 0,
                        "sha256": html_meta["sha256"] if html_meta else "",
                        "audit_path": audit_rel,
                        "audit_url": f"/{audit_rel}" if audit_rel else None,
                        "audit_raw": audit_meta["text"] if audit_meta else None,
                    }
                )

    if eval_dir.is_dir():
        for p in sorted(eval_dir.glob("*.html")):
            if p.name in seen_html:
                continue
            fmeta = _file_meta(p)
            cases.append(
                {
                    "id": p.stem.upper(),
                    "title": p.stem,
                    "jalur": "Ad-hoc",
                    "status": "Belum dinilai",
                    "html_path": f"eval/{p.name}",
                    "html_url": f"/eval/{p.name}",
                    "lines": fmeta["lines"],
                    "size_bytes": fmeta["bytes"],
                    "sha256": fmeta["sha256"],
                    "audit_path": None,
                    "audit_url": None,
                    "audit_raw": None,
                }
            )

    return {
        "results_path": "eval/RESULTS.md",
        "results_url": "/eval/RESULTS.md",
        "results_lines": results_meta["lines"] if results_meta else 0,
        "results_sha256": results_meta["sha256"] if results_meta else "",
        "results_raw": results_meta["text"] if results_meta else "",
        "fixture": fixture_info,
        "cases": cases,
    }


def parse_handoff(vault_root: Path) -> dict[str, Any]:
    handoff_path = vault_root / "HANDOFF.md"
    if not handoff_path.exists():
        return {"exists": False, "stages": [], "prompts": [], "raw": ""}

    meta = _file_meta(handoff_path)
    text = meta["text"]
    stages: list[dict[str, Any]] = []
    prompts: list[dict[str, Any]] = []

    current_stage: dict[str, Any] | None = None
    in_section_3 = False
    in_section_4 = False
    current_prompt_title: str | None = None
    current_prompt_lines: list[str] = []

    for line in text.splitlines():
        if line.startswith("## 3."):
            in_section_3 = True
            in_section_4 = False
            continue
        if line.startswith("## 4."):
            in_section_3 = False
            in_section_4 = True
            continue
        if line.startswith("## "):
            in_section_3 = False
            in_section_4 = False
            continue

        if in_section_3:
            m = re.match(r"^###\s+(.+?)\s+—\s+`\[(.+?)\]`\s*$", line)
            if m:
                current_stage = {"title": m.group(1).strip(), "status": m.group(2).strip(), "bullets": []}
                stages.append(current_stage)
            elif current_stage is not None and line.startswith("- "):
                current_stage["bullets"].append(line[2:].strip())

        if in_section_4:
            op_match = re.match(r"^\*\*(Opsi\s+\d+[^*]*)\*\*\s*$", line)
            if op_match:
                if current_prompt_title and current_prompt_lines:
                    prompts.append({"title": current_prompt_title, "prompt": "\n".join(current_prompt_lines).strip()})
                current_prompt_title = op_match.group(1).strip()
                current_prompt_lines = []
            elif current_prompt_title and line.startswith(">"):
                current_prompt_lines.append(line.lstrip("> ").strip())

    if current_prompt_title and current_prompt_lines:
        prompts.append({"title": current_prompt_title, "prompt": "\n".join(current_prompt_lines).strip()})

    return {
        "exists": True,
        "path": "HANDOFF.md",
        "url_path": "/HANDOFF.md",
        "lines": meta["lines"],
        "sha256": meta["sha256"],
        "modified_at": meta["modified_at"],
        "stages": stages,
        "prompts": prompts,
        "raw": text,
    }


def check_sync(vault_root: Path) -> dict[str, Any]:
    skills_root = Path.home() / ".agents" / "skills"
    global_skill = skills_root / "gemini-design"
    backup_root = Path.home() / ".agents" / "skill-backups"

    if not skills_root.exists():
        return {
            "accessible": False,
            "in_sync": None,
            "global_path": str(global_skill),
            "backup_dir": str(backup_root),
            "backups": [],
            "shadowing_warnings": [],
            "diffs": [],
            "note": (
                "Folder ~/.agents tidak terlihat di environment ini (sandbox). "
                "Jalankan `python3 dashboard/serve.py` di terminal lokal untuk cek status sync global secara live."
            ),
        }

    diffs: list[dict[str, str]] = []
    vault_skill = vault_root / "SKILL.md"
    global_skill_md = global_skill / "SKILL.md"

    if not global_skill_md.exists():
        diffs.append({"file": "SKILL.md", "state": "missing_in_global"})
    elif vault_skill.exists():
        v_hash = hashlib.sha256(vault_skill.read_bytes()).hexdigest()
        g_hash = hashlib.sha256(global_skill_md.read_bytes()).hexdigest()
        if v_hash != g_hash:
            diffs.append({"file": "SKILL.md", "state": "modified"})

    vault_refs_dir = vault_root / "references"
    global_refs_dir = global_skill / "references"

    vault_files: dict[str, Path] = {}
    if vault_refs_dir.is_dir():
        for p in sorted(vault_refs_dir.rglob("*")):
            if p.is_file():
                rel = os.path.relpath(p, vault_refs_dir).replace(os.sep, "/")
                vault_files[rel] = p

    global_files: dict[str, Path] = {}
    if global_refs_dir.is_dir():
        for p in sorted(global_refs_dir.rglob("*")):
            if p.is_file():
                rel = os.path.relpath(p, global_refs_dir).replace(os.sep, "/")
                global_files[rel] = p

    for rel in sorted(set(vault_files) | set(global_files)):
        if rel not in global_files:
            diffs.append({"file": f"references/{rel}", "state": "missing_in_global"})
        elif rel not in vault_files:
            diffs.append({"file": f"references/{rel}", "state": "extra_in_global"})
        else:
            vh = hashlib.sha256(vault_files[rel].read_bytes()).hexdigest()
            gh = hashlib.sha256(global_files[rel].read_bytes()).hexdigest()
            if vh != gh:
                diffs.append({"file": f"references/{rel}", "state": "modified"})

    for extra_rel in ("scripts/query_vault.py", "design-systems/INDEX.json"):
        vault_extra = vault_root / extra_rel
        global_extra = global_skill / extra_rel
        if not vault_extra.is_file():
            continue
        if not global_extra.is_file():
            diffs.append({"file": extra_rel, "state": "missing_in_global"})
        elif hashlib.sha256(vault_extra.read_bytes()).hexdigest() != hashlib.sha256(global_extra.read_bytes()).hexdigest():
            diffs.append({"file": extra_rel, "state": "modified"})

    backups = sorted([p.name for p in backup_root.iterdir()]) if backup_root.is_dir() else []
    shadowing_warnings = sorted([p.name for p in skills_root.iterdir() if ".bak" in p.name])

    return {
        "accessible": True,
        "in_sync": len(diffs) == 0,
        "global_path": str(global_skill),
        "backup_dir": str(backup_root),
        "backups": backups,
        "shadowing_warnings": shadowing_warnings,
        "diffs": diffs,
        "note": None,
    }


def parse_rea_dossiers(vault_root: Path) -> list[dict[str, Any]]:
    rea_dir = vault_root / "rea"
    dossiers: list[dict[str, Any]] = []
    if not rea_dir.is_dir():
        return dossiers
    for p in sorted(rea_dir.glob("*.json")):
        try:
            raw = p.read_text(encoding="utf-8")
            obj = json.loads(raw)
        except Exception:
            continue
        obj["rel_path"] = f"rea/{p.name}"
        obj["url_path"] = f"/rea/{p.name}"
        obj["raw"] = raw
        dossiers.append(obj)
    return dossiers


def parse_templates(vault_root: Path) -> dict[str, Any]:
    idx_path = vault_root / "templates" / "INDEX.json"
    if not idx_path.is_file():
        return {"exists": False, "count": 0, "templates": [], "raw": ""}
    raw_idx = idx_path.read_text(encoding="utf-8")
    try:
        data = json.loads(raw_idx)
    except Exception:
        return {"exists": False, "count": 0, "templates": [], "raw": raw_idx}

    items = []
    for t in data.get("templates", []):
        item = dict(t)
        local_rel = item.get("local_path", "")
        local_file = (vault_root / local_rel) if local_rel else None
        if local_file and local_file.is_file():
            item["raw"] = local_file.read_text(encoding="utf-8", errors="replace")
        else:
            item["raw"] = ""
        items.append(item)

    return {
        "exists": True,
        "path": "templates/INDEX.json",
        "count": len(items),
        "generated_at": data.get("generated_at"),
        "templates": items,
        "raw": raw_idx,
    }


def parse_design_systems(vault_root: Path) -> dict[str, Any]:
    idx_path = vault_root / "design-systems" / "INDEX.json"
    if not idx_path.is_file():
        return {"exists": False, "count": 0, "systems": [], "raw": ""}
    raw_idx = idx_path.read_text(encoding="utf-8")
    try:
        data = json.loads(raw_idx)
    except Exception:
        return {"exists": False, "count": 0, "systems": [], "raw": raw_idx}

    items = []
    for s in data.get("systems", []):
        item = dict(s)
        local_rel = item.get("local_path", "")
        local_file = (vault_root / local_rel) if local_rel else None
        if local_file and local_file.is_file():
            item["raw"] = local_file.read_text(encoding="utf-8", errors="replace")
        else:
            item["raw"] = ""
        items.append(item)

    return {
        "exists": True,
        "path": "design-systems/INDEX.json",
        "count": len(items),
        "generated_at": data.get("generated_at"),
        "systems": items,
        "raw": raw_idx,
    }


def parse_goodui_registry(vault_root: Path) -> dict[str, Any]:
    idx_path = vault_root / "templates" / "goodui" / "INDEX.json"
    if not idx_path.is_file():
        return {"exists": False, "count": 0, "categories": {}, "items": []}
    try:
        data = json.loads(idx_path.read_text(encoding="utf-8"))
    except Exception:
        return {"exists": False, "count": 0, "categories": {}, "items": []}

    items = data.get("items", [])
    return {
        "exists": True,
        "path": "templates/goodui/INDEX.json",
        "source": data.get("source"),
        "license": data.get("license"),
        "count": len(items),
        "categories": data.get("categories", {}),
        "items": items,
    }


def build_vault_payload(vault_root: Path) -> dict[str, Any]:
    skill = parse_skill(vault_root)
    taste = parse_taste(vault_root)
    references, index_info, layer2, assets = parse_references(vault_root)
    eval_data = parse_eval(vault_root)
    handoff = parse_handoff(vault_root)
    sync = check_sync(vault_root)
    rea_dossiers = parse_rea_dossiers(vault_root)
    templates_data = parse_templates(vault_root)
    design_systems_data = parse_design_systems(vault_root)
    goodui_data = parse_goodui_registry(vault_root)

    md_refs = [r for r in references if not r.get("is_dir")]
    ready_count = sum(1 for r in md_refs if r["status"] == "ready")
    seeded_count = sum(1 for r in md_refs if r["status"] == "seeded")
    template_count = sum(1 for r in md_refs if r["status"] == "template")
    total_entries = sum(r.get("entry_count", 0) for r in md_refs)
    checklist_count = sum(len(g["items"]) for g in skill.get("checklist", []))
    ban_count = len(taste.get("ban_list", []))
    eval_passed = sum(1 for c in eval_data["cases"] if "lolos" in c["status"].lower())

    return {
        "generated_at": datetime.now().astimezone().isoformat(timespec="seconds"),
        "vault_root": str(vault_root),
        "skill": skill,
        "taste": taste,
        "references_index": index_info,
        "references": references,
        "layer2": layer2,
        "assets": assets,
        "rea_dossiers": rea_dossiers,
        "templates": templates_data,
        "design_systems": design_systems_data,
        "goodui_registry": goodui_data,
        "eval": eval_data,
        "handoff": handoff,
        "sync": sync,
        "stats": {
            "ready_count": ready_count,
            "seeded_count": seeded_count,
            "template_count": template_count,
            "total_ref_files": len(md_refs),
            "total_entries": total_entries,
            "checklist_count": checklist_count,
            "ban_count": ban_count,
            "eval_passed": eval_passed,
            "eval_total": len(eval_data["cases"]),
            "asset_count": len(assets),
            "rea_count": len(rea_dossiers),
            "templates_count": templates_data["count"],
            "design_systems_count": design_systems_data["count"],
            "goodui_count": goodui_data["count"],
        },
    }


def write_snapshot(vault_root: Path, payload: dict[str, Any] | None = None) -> Path:
    data = payload if payload is not None else build_vault_payload(vault_root)
    snap_path = vault_root / "dashboard" / "vault-snapshot.js"
    js_content = "// Auto-generated by dashboard/serve.py — fallback for file:// usage\nwindow.__VAULT_SNAPSHOT__ = "
    js_content += json.dumps(data, ensure_ascii=False, indent=2)
    js_content += ";\n"
    snap_path.write_text(js_content, encoding="utf-8")
    return snap_path


def make_handler(vault_root: Path):
    vault_resolved = vault_root.resolve()

    class VaultRequestHandler(BaseHTTPRequestHandler):
        def log_message(self, format: str, *args: Any) -> None:  # noqa: A002
            return

        def _send_bytes(
            self,
            status: int,
            body: bytes,
            content_type: str,
            cache_control: str = "no-cache",
        ) -> None:
            self.send_response(status)
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Cache-Control", cache_control)
            self.end_headers()
            self.wfile.write(body)

        def do_GET(self) -> None:  # noqa: N802
            parsed = urlparse(self.path)
            req_path = unquote(parsed.path)

            if req_path in {"/", "/index.html"}:
                index_file = vault_resolved / "dashboard" / "index.html"
                if not index_file.is_file():
                    self._send_bytes(HTTPStatus.NOT_FOUND, b"dashboard/index.html not found", "text/plain; charset=utf-8")
                    return
                self._send_bytes(HTTPStatus.OK, index_file.read_bytes(), "text/html; charset=utf-8", "no-cache")
                return

            if req_path == "/vault-snapshot.js":
                snap_file = vault_resolved / "dashboard" / "vault-snapshot.js"
                if snap_file.is_file():
                    self._send_bytes(HTTPStatus.OK, snap_file.read_bytes(), "application/javascript; charset=utf-8", "no-cache")
                    return
                payload = build_vault_payload(vault_resolved)
                js = ("window.__VAULT_SNAPSHOT__ = " + json.dumps(payload, ensure_ascii=False) + ";\n").encode("utf-8")
                self._send_bytes(HTTPStatus.OK, js, "application/javascript; charset=utf-8", "no-store")
                return

            if req_path == "/lego-previews.js":
                lp_file = vault_resolved / "dashboard" / "lego-previews.js"
                if not lp_file.is_file():
                    self._send_bytes(HTTPStatus.NOT_FOUND, b"Not Found", "text/plain; charset=utf-8")
                    return
                self._send_bytes(HTTPStatus.OK, lp_file.read_bytes(), "application/javascript; charset=utf-8", "no-cache")
                return

            if req_path == "/api/vault":
                payload = build_vault_payload(vault_resolved)
                try:
                    write_snapshot(vault_resolved, payload)
                except OSError:
                    pass
                body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
                self._send_bytes(HTTPStatus.OK, body, "application/json; charset=utf-8", "no-store")
                return

            rel = req_path.lstrip("/")
            allowed_prefixes = ("eval/", "references/", "skill/", "dashboard/", "templates/", "rea/", "design-systems/", "HANDOFF.md", "AGENTS.md")
            if not rel or not any(rel == p or rel.startswith(p) for p in allowed_prefixes):
                self._send_bytes(HTTPStatus.FORBIDDEN, b"Forbidden", "text/plain; charset=utf-8")
                return

            target = (vault_resolved / rel).resolve()
            if not target.is_relative_to(vault_resolved):
                self._send_bytes(HTTPStatus.FORBIDDEN, b"Forbidden", "text/plain; charset=utf-8")
                return
            if not target.is_file():
                self._send_bytes(HTTPStatus.NOT_FOUND, b"Not Found", "text/plain; charset=utf-8")
                return

            mime, _ = mimetypes.guess_type(str(target))
            if target.suffix == ".md":
                mime = "text/markdown; charset=utf-8"
            elif mime and mime.startswith("text/"):
                mime = f"{mime}; charset=utf-8"
            elif not mime:
                mime = "application/octet-stream"
            self._send_bytes(HTTPStatus.OK, target.read_bytes(), mime, "no-cache")

    return VaultRequestHandler


def main() -> int:
    parser = argparse.ArgumentParser(description="Gemini Design Vault Catalog Dashboard Server")
    parser.add_argument("--host", default="127.0.0.1", help="Bind host (default: 127.0.0.1)")
    parser.add_argument("--port", type=int, default=4173, help="Bind port (default: 4173)")
    parser.add_argument("--open", action="store_true", help="Open dashboard URL in default browser")
    parser.add_argument("--snapshot", action="store_true", help="Generate dashboard/vault-snapshot.js and exit")
    parser.add_argument("--check", action="store_true", help="Validate vault parsing and print compact JSON summary")
    args = parser.parse_args()

    vault_root = Path(__file__).resolve().parent.parent

    if args.snapshot:
        snap = write_snapshot(vault_root)
        print(f"Snapshot written: {snap}")
        return 0

    if args.check:
        payload = build_vault_payload(vault_root)
        summary = {
            "generated_at": payload["generated_at"],
            "skill_lines": payload["skill"].get("lines", 0),
            "taste_status": payload["taste"].get("status"),
            "sync_accessible": payload["sync"]["accessible"],
            "sync_in_sync": payload["sync"]["in_sync"],
            "stats": payload["stats"],
        }
        print(json.dumps(summary, ensure_ascii=False, indent=2))
        return 0

    payload = build_vault_payload(vault_root)
    try:
        write_snapshot(vault_root, payload)
    except OSError:
        pass

    handler = make_handler(vault_root)
    server = ThreadingHTTPServer((args.host, args.port), handler)
    url = f"http://{args.host}:{args.port}/"

    sync = payload["sync"]
    if not sync["accessible"]:
        sync_label = "sandbox (jalankan di terminal lokal untuk live sync check)"
    elif sync["in_sync"]:
        sync_label = "IN SYNC dengan ~/.agents/skills/gemini-design/"
    else:
        sync_label = f"DRIFT ({len(sync['diffs'])} file berbeda)"

    print("Gemini Design Vault — Katalog & Monitoring Lokal")
    print(f"  URL   : {url}")
    print(f"  Vault : {vault_root}")
    print(f"  Sync  : {sync_label}")
    print("  Stop  : Tekan Ctrl+C")

    if args.open:
        threading.Timer(0.4, lambda: webbrowser.open(url)).start()

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer dihentikan.")
    finally:
        server.server_close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
