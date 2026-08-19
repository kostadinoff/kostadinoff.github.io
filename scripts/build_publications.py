#!/usr/bin/env python3
"""Generate _publications.md from referencelist.bib.

Splits the bibliography into publication types, sorts reverse chronologically,
bolds the CV owner's name and renders every DOI as a clickable link.

Usage:  python scripts/build_publications.py
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BIB = ROOT / "referencelist.bib"
OUT = ROOT / "_publications.md"

# Surname (lower-case) whose entries get bolded, plus accepted given-name initials.
OWNER_SURNAME = "kostadinov"
OWNER_INITIAL = "k"

MONTHS = {
    "jan": 1, "feb": 2, "mar": 3, "apr": 4, "may": 5, "jun": 6,
    "jul": 7, "aug": 8, "sep": 9, "oct": 10, "nov": 11, "dec": 12,
}

# Venues that are conferences, not journals - abstracts here are proceedings only.
PROCEEDINGS_VENUES = ("aesop congress", "isee 20")


# --------------------------------------------------------------------------- parsing
def parse_bib(text: str) -> list[dict]:
    """Minimal brace-aware BibTeX parser: enough for a hand-maintained file."""
    entries = []
    for match in re.finditer(r"@(\w+)\s*\{", text):
        kind = match.group(1).lower()
        if kind in ("comment", "preamble", "string"):
            continue
        start = match.end()
        depth, i = 1, start
        while i < len(text) and depth:
            if text[i] == "{":
                depth += 1
            elif text[i] == "}":
                depth -= 1
            i += 1
        body = text[start : i - 1]
        key, _, fields_src = body.partition(",")
        entries.append({"type": kind, "key": key.strip(), **parse_fields(fields_src)})
    return entries


def parse_fields(src: str) -> dict:
    fields, i, n = {}, 0, len(src)
    while i < n:
        m = re.compile(r"([A-Za-z_][\w-]*)\s*=\s*").search(src, i)
        if not m:
            break
        name, i = m.group(1).lower(), m.end()
        if src[i] == "{":
            depth, j = 1, i + 1
            while j < n and depth:
                if src[j] == "{":
                    depth += 1
                elif src[j] == "}":
                    depth -= 1
                j += 1
            value, i = src[i + 1 : j - 1], j
        elif src[i] == '"':
            j = src.index('"', i + 1)
            value, i = src[i + 1 : j], j + 1
        else:  # bare word, e.g. month = apr
            j = i
            while j < n and src[j] not in ",\n":
                j += 1
            value, i = src[i:j].strip(), j
        fields[name] = clean(value)
        comma = src.find(",", i)
        i = n if comma == -1 else comma + 1
    return fields


def clean(value: str) -> str:
    value = re.sub(r"\s+", " ", value).strip()
    value = value.replace(r"\%", "%").replace(r"\&", "&").replace(r"\_", "_")
    value = value.replace("--", "–")
    return re.sub(r"[{}]", "", value)


# --------------------------------------------------------------------------- authors
def format_authors(raw: str) -> str:
    out = []
    for name in re.split(r"\s+and\s+", raw):
        name = name.strip()
        if not name:
            continue
        if "," in name:
            surname, _, given = name.partition(",")
        else:  # "Given Middle Surname"
            parts = name.split()
            surname, given = parts[-1], " ".join(parts[:-1])
        surname, given = surname.strip(), given.strip()
        initials = "".join(p[0].upper() for p in re.split(r"[\s.‐-]+", given) if p[:1].isalpha())
        rendered = f"{surname} {initials}".strip()
        if surname.lower() == OWNER_SURNAME and initials[:1].lower() == OWNER_INITIAL:
            rendered = f"**{rendered}**"
        out.append(rendered)
    return ", ".join(out)


# --------------------------------------------------------------------------- classify
def category(entry: dict) -> str:
    title = entry.get("title", "")
    journal = entry.get("journal", "").lower()
    if entry["type"] == "book":
        return "books"
    if re.search(r"\bcomment on\b", title, re.I):
        return "commentaries"
    if "(Abstract)" in title:
        if any(v in journal for v in PROCEEDINGS_VENUES):
            return "proceedings"
        return "abstracts"
    return "articles"


def sort_key(entry: dict):
    year = int(re.sub(r"\D", "", entry.get("year", "0")) or 0)
    month = MONTHS.get(entry.get("month", "")[:3].lower(), 0)
    if not month and entry.get("month", "").isdigit():
        month = int(entry["month"])
    return (-year, -month, entry.get("author", ""))


# --------------------------------------------------------------------------- render
def render(entry: dict, number: int) -> str:
    title = entry.get("title", "").replace(" (Abstract)", "")
    title = title.rstrip(".")
    end = "" if title.endswith(("?", "!")) else "."
    bits = [format_authors(entry.get("author", "")) + ".", f"{title}{end}"]

    venue = entry.get("journal") or entry.get("booktitle") or entry.get("publisher")
    if venue:
        bits.append(f"*{venue}*.")

    locator = entry.get("year", "")
    if entry.get("volume"):
        locator += f";{entry['volume']}"
        if entry.get("number"):
            locator += f"({entry['number']})"
    if entry.get("pages"):
        locator += f":{entry['pages']}"
    if locator:
        bits.append(locator.strip() + ".")

    if entry.get("doi"):
        doi = entry["doi"].replace("https://doi.org/", "")
        bits.append(f"[doi:{doi}](https://doi.org/{doi})")
    elif entry.get("url"):
        bits.append(f"[link]({entry['url']})")

    return f"{number}. " + " ".join(b for b in bits if b.strip(". "))


SECTIONS = [
    ("articles", "Peer-reviewed original research articles"),
    ("commentaries", "Commentaries and letters"),
    ("books", "Books and monographs"),
    ("abstracts", "Conference abstracts published in journals"),
    ("proceedings", "Other scholarly outputs (conference proceedings)"),
]


def main() -> int:
    entries = parse_bib(BIB.read_text(encoding="utf-8"))
    buckets: dict[str, list[dict]] = {slug: [] for slug, _ in SECTIONS}
    for entry in entries:
        buckets[category(entry)].append(entry)

    lines = [
        "<!-- GENERATED FILE - do not edit by hand.",
        "     Source: referencelist.bib | Rebuild: python scripts/build_publications.py -->",
        "",
    ]
    number = 0
    for slug, heading in SECTIONS:
        items = sorted(buckets[slug], key=sort_key)
        if not items:
            continue
        lines += [f"## {heading} ({len(items)})", ""]
        for entry in items:
            number += 1
            lines += [render(entry, number), ""]

    OUT.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")
    counts = ", ".join(f"{h}: {len(buckets[s])}" for s, h in SECTIONS if buckets[s])
    print(f"Wrote {OUT.name} - {number} outputs ({counts})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
