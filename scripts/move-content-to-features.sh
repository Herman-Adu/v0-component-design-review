#!/bin/bash
# Session 14: Move content components from components/ to features/dashboard/content-library/
# Run from project root: bash scripts/move-content-to-features.sh
# Uses git mv to preserve history. Safe to re-run (skips already-moved files).

set -e

echo "=== Moving content components to features/dashboard/content-library/ ==="

# Create target directories
mkdir -p features/dashboard/content-library/articles
mkdir -p features/dashboard/content-library/tutorials
mkdir -p features/dashboard/content-library/case-studies
mkdir -p features/dashboard/content-library/guides

# --- ARTICLES (26 files, ssg-article already moved by v0) ---
echo ""
echo "[1/4] Moving articles..."
for f in components/articles/*.tsx; do
  [ -f "$f" ] || continue
  filename=$(basename "$f")
  if [ -f "features/dashboard/content-library/articles/$filename" ]; then
    echo "  SKIP (already exists): $filename"
  else
    git mv "$f" "features/dashboard/content-library/articles/$filename"
    echo "  MOVED: $filename"
  fi
done

# --- TUTORIALS (16 files) ---
echo ""
echo "[2/4] Moving tutorials..."
for f in components/tutorials/*.tsx; do
  [ -f "$f" ] || continue
  filename=$(basename "$f")
  if [ -f "features/dashboard/content-library/tutorials/$filename" ]; then
    echo "  SKIP (already exists): $filename"
  else
    git mv "$f" "features/dashboard/content-library/tutorials/$filename"
    echo "  MOVED: $filename"
  fi
done

# --- CASE STUDIES (17 files) ---
echo ""
echo "[3/4] Moving case studies..."
for f in components/case-studies/*.tsx; do
  [ -f "$f" ] || continue
  filename=$(basename "$f")
  if [ -f "features/dashboard/content-library/case-studies/$filename" ]; then
    echo "  SKIP (already exists): $filename"
  else
    git mv "$f" "features/dashboard/content-library/case-studies/$filename"
    echo "  MOVED: $filename"
  fi
done

# --- GUIDES (3 files) ---
echo ""
echo "[4/4] Moving guides..."
for f in components/guides/*.tsx; do
  [ -f "$f" ] || continue
  filename=$(basename "$f")
  if [ -f "features/dashboard/content-library/guides/$filename" ]; then
    echo "  SKIP (already exists): $filename"
  else
    git mv "$f" "features/dashboard/content-library/guides/$filename"
    echo "  MOVED: $filename"
  fi
done

# --- CLEANUP: Remove empty source directories ---
echo ""
echo "=== Cleanup ==="
rmdir components/articles 2>/dev/null && echo "Removed empty: components/articles/" || echo "components/articles/ not empty or already gone"
rmdir components/tutorials 2>/dev/null && echo "Removed empty: components/tutorials/" || echo "components/tutorials/ not empty or already gone"
rmdir components/case-studies 2>/dev/null && echo "Removed empty: components/case-studies/" || echo "components/case-studies/ not empty or already gone"
rmdir components/guides 2>/dev/null && echo "Removed empty: components/guides/" || echo "components/guides/ not empty or already gone"

echo ""
echo "=== Done! ==="
echo "Route files already updated by v0 to import from @/features/dashboard/content-library/"
echo ""
echo "Next steps:"
echo "  1. Run: npm run build (or next build) to verify"
echo "  2. If clean, commit: git add -A && git commit -m 'refactor: move content components to features/dashboard/content-library'"
echo "  3. Note: ssg-article.tsx was already moved by v0 and should be at the new location"
