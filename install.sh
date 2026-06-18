#!/usr/bin/env bash
set -euo pipefail

# gd-plan installer — footprint 복사 + VERSION·manifest 기록 (get.sh / gd 가 위임 호출)
#
# Usage: bash install.sh <target-dir> [--yes] [--update]
#   기본(fresh): footprint 를 복사. 기존 .gd/ 있으면 확인.
#   --update   : 업그레이드 모드 — 사용자 수정 파일(현재 sha ≠ 기존 manifest)은
#                덮지 않고 <file>.new 로 신버전을 나란히 기록 + 경고 (비가역 손실 금지).
#
# footprint (spec-02-01 규약, ADR-016):
#   <dir>/.claude/commands/gd-plan-*.md      스킬 9
#   <dir>/.gd/templates/                     템플릿 전체
#   <dir>/.gd/design-md-collection/          컬렉션 전체 동봉 (66 + _index.json)
#   <dir>/.gd/bin/gd                         소비자 CLI (repo 에 존재 시)
#   <dir>/.gd/VERSION                        설치 버전 (package.json SoT)
#   <dir>/.gd/manifest                       상류 배포 내용의 sha256 평문 (shasum -c 호환)
#
# manifest 해석: 항상 *상류(소스)가 배포한 내용* 의 sha 를 기록한다. 따라서 사용자가
# 손댄 파일은 이후 gd status 에서 계속 "수정됨" 으로 표시된다 (의도된 동작).
#
# 불변 조건: <dir>/docs/ 절대 미접촉 (사용자 산출물).

SRC_ROOT="$(cd "$(dirname "$0")" && pwd)"
TARGET_DIR=""
YES=0
UPDATE=0

while [ $# -gt 0 ]; do
  case "$1" in
    --yes)    YES=1; shift ;;
    --update) UPDATE=1; shift ;;
    -*)       printf '알 수 없는 옵션: %s\n' "$1" >&2; exit 1 ;;
    *)        TARGET_DIR="$1"; shift ;;
  esac
done

if [ -z "$TARGET_DIR" ]; then
  printf '✗ 사용법: bash install.sh <target-dir> [--yes] [--update]\n' >&2
  exit 1
fi

mkdir -p "$TARGET_DIR"
TARGET_DIR="$(cd "$TARGET_DIR" && pwd)"

# fresh 모드에서 기존 .gd/ 존재 시 확인 (update 는 충돌 정책이 보호하므로 생략)
if [ "$UPDATE" -ne 1 ] && [ -d "$TARGET_DIR/.gd" ] && [ "$YES" -ne 1 ]; then
  printf '기존 .gd/ 설치가 있습니다: %s\n덮어쓸까요? [y/N] ' "$TARGET_DIR/.gd"
  read -r answer
  case "$answer" in
    y|Y|yes|YES) : ;;
    *) printf '중단합니다. (업그레이드는 .gd/bin/gd upgrade 사용)\n'; exit 1 ;;
  esac
fi

# sha256 도구 감지 (macOS shasum / Linux sha256sum)
if command -v shasum >/dev/null 2>&1; then
  sha_hash() { shasum -a 256 "$1" | awk '{print $1}'; }
elif command -v sha256sum >/dev/null 2>&1; then
  sha_hash() { sha256sum "$1" | awk '{print $1}'; }
else
  printf '✗ shasum/sha256sum 둘 다 없음 — manifest 를 기록할 수 없습니다\n' >&2
  exit 1
fi

# 기존 manifest (update 충돌 판정용 — 갱신 전 값 읽기)
OLD_MANIFEST="$TARGET_DIR/.gd/manifest"
old_sha() {
  [ -f "$OLD_MANIFEST" ] || return 0
  awk -v p="$1" '$2 == p { print $1; exit }' "$OLD_MANIFEST"
}

NEW_MANIFEST="$(mktemp)"
CONFLICT_COUNT=0

# place_file <src-abs> <rel> — 복사 + manifest 에 상류 sha 기록.
# update 모드에서 대상이 사용자 수정 상태면 덮지 않고 <rel>.new 로 보존.
place_file() {
  local src="$1" rel="$2"
  local dest="$TARGET_DIR/$rel" upstream_sha
  upstream_sha="$(sha_hash "$src")"
  mkdir -p "$(dirname "$dest")"
  if [ "$UPDATE" -eq 1 ] && [ -f "$dest" ]; then
    local cur expected
    cur="$(sha_hash "$dest")"
    expected="$(old_sha "$rel")"
    if [ -n "$expected" ] && [ "$cur" != "$expected" ]; then
      cp "$src" "$dest.new"
      printf '⚠ 사용자 수정 보존: %s → %s.new\n' "$rel" "$rel" >&2
      CONFLICT_COUNT=$((CONFLICT_COUNT + 1))
      printf '%s  %s\n' "$upstream_sha" "$rel" >> "$NEW_MANIFEST"
      return
    fi
  fi
  cp "$src" "$dest"
  printf '%s  %s\n' "$upstream_sha" "$rel" >> "$NEW_MANIFEST"
}

printf '[install] gd-plan → %s (%s)\n' "$TARGET_DIR" "$([ "$UPDATE" -eq 1 ] && echo update || echo fresh)"

# ① 스킬 9 → .claude/commands/
for f in "$SRC_ROOT"/plans/gd-plan-*.md; do
  [ -f "$f" ] || continue
  place_file "$f" ".claude/commands/$(basename "$f")"
done

# ② templates/ 전체 (하위 디렉토리 포함) → .gd/templates/
#    절대경로 find → 임시 파일 경유 (bash 3.2 + set -u 에서 프로세스 치환 회피)
TPL_LIST="$(mktemp)"
find "$SRC_ROOT/templates" -type f > "$TPL_LIST"
while IFS= read -r abs; do
  [ -n "$abs" ] || continue
  rel="${abs#"$SRC_ROOT"/templates/}"
  place_file "$abs" ".gd/templates/$rel"
done < "$TPL_LIST"
rm -f "$TPL_LIST"

# ③ design-md-collection/ 전체 동봉 (하위 디렉토리 _swatches/ 포함) → .gd/design-md-collection/
#    find -type f 로 _swatches/*.html 등 하위 파일까지 상대경로 보존 복사 (②와 동일 패턴)
COL_LIST="$(mktemp)"
find "$SRC_ROOT/design-md-collection" -type f > "$COL_LIST"
while IFS= read -r abs; do
  [ -n "$abs" ] || continue
  rel="${abs#"$SRC_ROOT"/design-md-collection/}"
  place_file "$abs" ".gd/design-md-collection/$rel"
done < "$COL_LIST"
rm -f "$COL_LIST"

# ④ bin/gd (repo 에 존재 시)
if [ -f "$SRC_ROOT/bin/gd" ]; then
  place_file "$SRC_ROOT/bin/gd" ".gd/bin/gd"
  chmod +x "$TARGET_DIR/.gd/bin/gd"
fi

# ⑤ VERSION — package.json 단일 SoT 를 node 없이 파싱
PKG_VERSION="$(grep '"version"' "$SRC_ROOT/package.json" | head -1 | sed 's/.*"version"[^"]*"\([^"]*\)".*/\1/')"
if [ -z "$PKG_VERSION" ]; then
  printf '✗ package.json 에서 version 을 읽지 못함\n' >&2
  exit 1
fi
mkdir -p "$TARGET_DIR/.gd"
printf '%s\n' "$PKG_VERSION" > "$TARGET_DIR/.gd/VERSION"

# ⑥ manifest 교체 (상류 sha 기록본)
mv "$NEW_MANIFEST" "$TARGET_DIR/.gd/manifest"

skill_count="$(ls "$TARGET_DIR/.claude/commands/" | grep -c '^gd-plan-.*\.md$')"
col_count="$(ls "$TARGET_DIR/.gd/design-md-collection/" | grep -c '\.md$')"
printf '[install] ✓ 완료 — 스킬 %s개, 컬렉션 %s개(+인덱스), VERSION %s\n' "$skill_count" "$col_count" "$PKG_VERSION"
if [ "$UPDATE" -eq 1 ] && [ "$CONFLICT_COUNT" -gt 0 ]; then
  printf '[install] ⚠ 사용자 수정 %s개 보존 — 신버전은 .new 로 배치됨 (직접 병합하세요)\n' "$CONFLICT_COUNT"
fi
printf '[install] → Claude Code 에서 /gd-plan-start 로 시작하세요.\n'
