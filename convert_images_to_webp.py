from __future__ import annotations

import argparse
import sys
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:
    print("Pillow is not installed.")
    print("Run: python -m pip install Pillow")
    sys.exit(1)

ROOT = Path.cwd()
PUBLIC_IMAGES = ROOT / "public" / "images"

SOURCE_EXTENSIONS = {
    ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".json", ".css", ".scss", ".md"
}
IMAGE_EXTENSIONS = {".jpg", ".jpeg"}

MAX_SIZE = 1800
WEBP_QUALITY = 82
WEBP_METHOD = 6


def browser_path(path: Path) -> str:
    rel = path.relative_to(ROOT / "public").as_posix()
    return "/" + rel


def image_files():
    if not PUBLIC_IMAGES.exists():
        raise FileNotFoundError(
            f"{PUBLIC_IMAGES} was not found. Run this script from the Next.js project root."
        )

    yield from sorted(
        p for p in PUBLIC_IMAGES.rglob("*")
        if p.is_file() and p.suffix.lower() in IMAGE_EXTENSIONS
    )


def convert_image(source: Path, dry_run: bool):
    dest = source.with_suffix(".webp")

    if dest.exists() and dest.stat().st_mtime >= source.stat().st_mtime:
        return dest, source.stat().st_size, dest.stat().st_size

    if dry_run:
        return dest, source.stat().st_size, 0

    with Image.open(source) as im:
        im = ImageOps.exif_transpose(im)

        if im.mode not in ("RGB", "RGBA"):
            im = im.convert("RGBA" if "A" in im.getbands() else "RGB")

        if max(im.size) > MAX_SIZE:
            im.thumbnail((MAX_SIZE, MAX_SIZE), Image.Resampling.LANCZOS)

        im.save(
            dest,
            "WEBP",
            quality=WEBP_QUALITY,
            method=WEBP_METHOD,
            optimize=True,
        )

    return dest, source.stat().st_size, dest.stat().st_size


def source_files():
    for p in ROOT.rglob("*"):
        if not p.is_file():
            continue
        if any(part in {".git", ".next", "node_modules", "dist", "build"} for part in p.parts):
            continue
        if p.suffix.lower() in SOURCE_EXTENSIONS:
            yield p


def update_references(mapping, dry_run: bool):
    changed = 0

    for p in source_files():
        try:
            old = p.read_text(encoding="utf-8")
        except (UnicodeDecodeError, OSError):
            continue

        new = old
        for a, b in mapping.items():
            new = new.replace(a, b)

        if new != old:
            changed += 1
            print(f"{'[DRY RUN] ' if dry_run else ''}Updated {p}")
            if not dry_run:
                p.write_text(new, encoding="utf-8")

    return changed


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument(
        "--delete-originals",
        action="store_true",
        help="Delete JPG/JPEG files only after successful WebP conversion.",
    )
    args = ap.parse_args()

    print("Shrinik JPG/JPEG -> WebP optimizer")
    print(f"Project: {ROOT}")
    print(f"Images:  {PUBLIC_IMAGES}")
    print(f"Max size: {MAX_SIZE}px")
    print(f"Quality:  {WEBP_QUALITY}")
    print()

    try:
        files = list(image_files())
    except FileNotFoundError as e:
        print(e)
        sys.exit(1)

    if not files:
        print("No JPG/JPEG files found.")
        return

    mapping = {}
    successful = []
    total_before = 0
    total_after = 0

    for source in files:
        try:
            dest, before, after = convert_image(source, args.dry_run)
        except Exception as e:
            print(f"FAILED {source}: {e}")
            continue

        total_before += before

        if args.dry_run:
            print(f"[DRY RUN] {source} -> {dest}")
            continue

        total_after += after
        successful.append((source, dest))

        mapping[browser_path(source)] = browser_path(dest)

        pct = (1 - after / before) * 100 if before else 0
        print(
            f"OK {source.relative_to(ROOT)} -> {dest.relative_to(ROOT)}"
            f" | {before/1024:.0f} KB -> {after/1024:.0f} KB"
            f" | saved {pct:.1f}%"
        )

    changed = update_references(mapping, args.dry_run)

    if args.dry_run:
        print(f"\nDry run complete. Would update {changed} source files.")
        return

    print("\nDone.")
    print(f"Converted: {len(successful)}")
    print(f"Source files updated: {changed}")
    print(f"Original JPG/JPEG size: {total_before/(1024**2):.2f} MB")
    print(f"WebP size:              {total_after/(1024**2):.2f} MB")

    if total_before:
        print(f"Overall reduction: {(1-total_after/total_before)*100:.1f}%")

    if args.delete_originals:
        deleted = 0
        for src, dst in successful:
            if dst.exists():
                try:
                    src.unlink()
                    deleted += 1
                except OSError as e:
                    print(f"Could not delete {src}: {e}")
        print(f"Deleted originals: {deleted}")
    else:
        print("\nOriginal JPG/JPEG files were kept.")
        print("After checking localhost/Vercel, run:")
        print("  python convert_images_to_webp.py --delete-originals")


if __name__ == "__main__":
    main()
