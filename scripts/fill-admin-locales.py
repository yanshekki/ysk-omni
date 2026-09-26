#!/usr/bin/env python3
"""Apply unique.jsonl onto en.json to build hi/es/ar/fr/bn/pt/ru/id locales."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LOCALE_DIR = ROOT / "admin/src/i18n/locales"
JSONL = LOCALE_DIR / "unique.jsonl"
LANGS = ["hi", "es", "ar", "fr", "bn", "pt", "ru", "id"]


def deep_map(obj, table: dict[str, str]):
    if isinstance(obj, dict):
        return {k: deep_map(v, table) for k, v in obj.items()}
    s = str(obj)
    return table.get(s, s)


def load_maps() -> dict[str, dict[str, str]]:
    maps = {lang: {} for lang in LANGS}
    for line in JSONL.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line:
            continue
        row = json.loads(line)
        en = row["en"]
        for lang in LANGS:
            maps[lang][en] = row[lang]
    return maps


def main() -> None:
    en = json.loads((LOCALE_DIR / "en.json").read_text(encoding="utf-8"))
    maps = load_maps()
    unique: list[str] = []

    def walk(o):
        if isinstance(o, dict):
            for v in o.values():
                walk(v)
        else:
            unique.append(str(o))

    walk(en)
    for lang in LANGS:
        missing = [s for s in unique if s not in maps[lang]]
        if missing:
            raise SystemExit(f"{lang}: {len(missing)} missing e.g. {missing[:5]!r}")
        out = deep_map(en, maps[lang])
        dest = LOCALE_DIR / f"{lang}.json"
        dest.write_text(
            json.dumps(out, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        print("wrote", dest)


if __name__ == "__main__":
    main()

