#!/usr/bin/env bash
# spec-02-02 — get.sh 설치 시나리오 테스트 (전부 --src 로컬 모드, 네트워크 0)
set -u

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
GET="$REPO_ROOT/get.sh"
FAILED=0

fail() { printf '  ✗ %s\n' "$1" >&2; FAILED=1; }
ok()   { printf '  · %s\n' "$1"; }

# sha256 도구 감지 (macOS shasum / Linux sha256sum)
if command -v shasum >/dev/null 2>&1; then
  SHA_CHECK() { (cd "$1" && shasum -a 256 -c .gd/manifest --status); }
else
  SHA_CHECK() { (cd "$1" && sha256sum -c .gd/manifest --status); }
fi

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

[ -f "$GET" ] || { fail "get.sh 가 repo 루트에 없음"; exit 1; }

# ── 시나리오 1: fresh 설치 ──────────────────────────────
T1="$TMP/fresh"
mkdir -p "$T1"
if ! bash "$GET" --src "$REPO_ROOT" --yes "$T1" >/dev/null 2>&1; then
  fail "시나리오1: get.sh 실행 실패"
else
  skill_count=$(ls "$T1/.claude/commands/" 2>/dev/null | grep -c '^gd-plan-.*\.md$')
  [ "$skill_count" -eq 9 ] || fail "시나리오1: 스킬 9개 아님 (실제: $skill_count)"

  [ -f "$T1/.gd/design-md-collection/_index.json" ] || fail "시나리오1: 컬렉션 인덱스 없음"
  col_count=$(ls "$T1/.gd/design-md-collection/" 2>/dev/null | grep -c '\.md$')
  [ "$col_count" -ge 60 ] || fail "시나리오1: 컬렉션 원본 동봉 안 됨 (실제: $col_count)"

  [ -d "$T1/.gd/templates" ] || fail "시나리오1: templates 없음"

  pkg_ver=$(grep '"version"' "$REPO_ROOT/package.json" | head -1 | sed 's/.*"version"[^"]*"\([^"]*\)".*/\1/')
  inst_ver=$(cat "$T1/.gd/VERSION" 2>/dev/null)
  [ "$pkg_ver" = "$inst_ver" ] || fail "시나리오1: VERSION 불일치 (pkg=$pkg_ver inst=$inst_ver)"

  [ -s "$T1/.gd/manifest" ] || fail "시나리오1: manifest 없음/비어 있음"
  SHA_CHECK "$T1" || fail "시나리오1: manifest shasum 검증 실패"
  ok "시나리오1: fresh 설치"
fi

# ── 시나리오 2: docs/ 미접촉 ────────────────────────────
T2="$TMP/docs"
mkdir -p "$T2/docs"
printf 'user artifact\n' > "$T2/docs/prd.md"
bash "$GET" --src "$REPO_ROOT" --yes "$T2" >/dev/null 2>&1
if [ "$(cat "$T2/docs/prd.md" 2>/dev/null)" != "user artifact" ]; then
  fail "시나리오2: docs/prd.md 가 변경됨 (비가역 손실)"
else
  ok "시나리오2: docs/ 미접촉"
fi

# ── 시나리오 3: 멱등 재실행 ────────────────────────────
if ! bash "$GET" --src "$REPO_ROOT" --yes "$T1" >/dev/null 2>&1; then
  fail "시나리오3: 재실행 종료코드 비0"
else
  SHA_CHECK "$T1" || fail "시나리오3: 재실행 후 manifest 검증 실패"
  ok "시나리오3: 멱등 재실행"
fi

# ── 시나리오 4: node 비의존 (제한 PATH) ─────────────────
T4="$TMP/nonode"
mkdir -p "$T4"
if ! env PATH="/usr/bin:/bin" bash "$GET" --src "$REPO_ROOT" --yes "$T4" >/dev/null 2>&1; then
  fail "시나리오4: node 없는 PATH 에서 설치 실패"
else
  [ -f "$T4/.gd/VERSION" ] || fail "시나리오4: VERSION 미기록"
  ok "시나리오4: node 비의존"
fi

exit "$FAILED"
