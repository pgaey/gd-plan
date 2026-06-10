#!/usr/bin/env bash
set -euo pipefail

# gd-plan installer — footprint 복사 + VERSION·manifest 기록 (get.sh 가 위임 호출)
#
# Usage: bash install.sh <target-dir> [--yes]
#
# footprint (spec-02-01 규약, ADR-016):
#   <dir>/.claude/commands/gd-plan-*.md      스킬 9
#   <dir>/.gd/templates/                     템플릿 전체
#   <dir>/.gd/design-md-collection/          컬렉션 전체 동봉 (66 + _index.json)
#   <dir>/.gd/bin/gd                         소비자 CLI (repo 에 존재 시 — spec-02-03)
#   <dir>/.gd/VERSION                        설치 버전 (package.json SoT)
#   <dir>/.gd/manifest                       sha256 평문 (shasum -c 호환)
#
# 불변 조건: <dir>/docs/ 절대 미접촉 (사용자 산출물).

SRC_ROOT="$(cd "$(dirname "$0")" && pwd)"
TARGET_DIR=""
YES=0

while [ $# -gt 0 ]; do
  case "$1" in
    --yes) YES=1; shift ;;
    -*)    printf '알 수 없는 옵션: %s\n' "$1" >&2; exit 1 ;;
    *)     TARGET_DIR="$1"; shift ;;
  esac
done

if [ -z "$TARGET_DIR" ]; then
  printf '✗ 사용법: bash install.sh <target-dir> [--yes]\n' >&2
  exit 1
fi

mkdir -p "$TARGET_DIR"
TARGET_DIR="$(cd "$TARGET_DIR" && pwd)"

# 기존 설치 확인 (--yes 면 생략)
if [ -d "$TARGET_DIR/.gd" ] && [ "$YES" -ne 1 ]; then
  printf '기존 .gd/ 설치가 있습니다: %s\n' "$TARGET_DIR/.gd"
  printf '덮어쓸까요? [y/N] '
  read -r answer
  case "$answer" in
    y|Y|yes|YES) : ;;
    *) printf '중단합니다. (업그레이드는 .gd/bin/gd upgrade 사용)\n'; exit 1 ;;
  esac
fi

# sha256 도구 감지 (macOS shasum / Linux sha256sum)
if command -v shasum >/dev/null 2>&1; then
  sha_file() { shasum -a 256 "$1"; }
elif command -v sha256sum >/dev/null 2>&1; then
  sha_file() { sha256sum "$1"; }
else
  printf '✗ shasum/sha256sum 둘 다 없음 — manifest 를 기록할 수 없습니다\n' >&2
  exit 1
fi

INSTALLED_FILES=""
copy_file() {
  # copy_file <src-abs> <dest-rel>  — 복사 + 설치 목록 누적
  local src="$1" rel="$2"
  mkdir -p "$TARGET_DIR/$(dirname "$rel")"
  cp "$src" "$TARGET_DIR/$rel"
  INSTALLED_FILES="$INSTALLED_FILES$rel
"
}

printf '[install] gd-plan → %s\n' "$TARGET_DIR"

# ① 스킬 9 → .claude/commands/
for f in "$SRC_ROOT"/plans/gd-plan-*.md; do
  [ -f "$f" ] || continue
  copy_file "$f" ".claude/commands/$(basename "$f")"
done

# ② templates/ 전체 → .gd/templates/ (하위 디렉토리 포함)
(cd "$SRC_ROOT/templates" && find . -type f) | while read -r rel; do
  rel="${rel#./}"
  mkdir -p "$TARGET_DIR/.gd/templates/$(dirname "$rel")"
  cp "$SRC_ROOT/templates/$rel" "$TARGET_DIR/.gd/templates/$rel"
done
TPL_FILES="$( (cd "$SRC_ROOT/templates" && find . -type f) | sed 's|^\./|.gd/templates/|')"
INSTALLED_FILES="$INSTALLED_FILES$TPL_FILES
"

# ③ design-md-collection/ 전체 동봉 → .gd/design-md-collection/
mkdir -p "$TARGET_DIR/.gd/design-md-collection"
for f in "$SRC_ROOT"/design-md-collection/*; do
  [ -f "$f" ] || continue
  cp "$f" "$TARGET_DIR/.gd/design-md-collection/$(basename "$f")"
  INSTALLED_FILES="$INSTALLED_FILES.gd/design-md-collection/$(basename "$f")
"
done

# ④ bin/gd (repo 에 존재 시 — spec-02-03 산출물)
if [ -f "$SRC_ROOT/bin/gd" ]; then
  copy_file "$SRC_ROOT/bin/gd" ".gd/bin/gd"
  chmod +x "$TARGET_DIR/.gd/bin/gd"
fi

# ⑤ VERSION — package.json 단일 SoT 를 node 없이 파싱
PKG_VERSION="$(grep '"version"' "$SRC_ROOT/package.json" | head -1 | sed 's/.*"version"[^"]*"\([^"]*\)".*/\1/')"
if [ -z "$PKG_VERSION" ]; then
  printf '✗ package.json 에서 version 을 읽지 못함\n' >&2
  exit 1
fi
printf '%s\n' "$PKG_VERSION" > "$TARGET_DIR/.gd/VERSION"

# ⑥ manifest — 설치 파일 전체 sha256 (VERSION·manifest 자신은 제외)
MANIFEST="$TARGET_DIR/.gd/manifest"
: > "$MANIFEST"
printf '%s' "$INSTALLED_FILES" | while read -r rel; do
  [ -n "$rel" ] || continue
  (cd "$TARGET_DIR" && sha_file "$rel") >> "$MANIFEST"
done

skill_count="$(ls "$TARGET_DIR/.claude/commands/" | grep -c '^gd-plan-.*\.md$')"
col_count="$(ls "$TARGET_DIR/.gd/design-md-collection/" | grep -c '\.md$')"
printf '[install] ✓ 완료 — 스킬 %s개, 컬렉션 %s개(+인덱스), VERSION %s\n' "$skill_count" "$col_count" "$PKG_VERSION"
printf '[install] → Claude Code 에서 /gd-plan-start 로 시작하세요.\n'
