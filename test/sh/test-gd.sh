#!/usr/bin/env bash
# spec-02-03 — gd 소비자 CLI (version·status·upgrade) 테스트
# 전부 --src 로컬 모드 + GD_RAW_BASE=file:// — 네트워크 0.
set -u

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
GET="$REPO_ROOT/get.sh"
RAW="file://$REPO_ROOT"   # gd status 가 $RAW/package.json 을 원격 최신으로 읽음
FAILED=0

fail() { printf '  ✗ %s\n' "$1" >&2; FAILED=1; }
ok()   { printf '  · %s\n' "$1"; }

PKG_VER="$(grep '"version"' "$REPO_ROOT/package.json" | head -1 | sed 's/.*"version"[^"]*"\([^"]*\)".*/\1/')"

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# 공용: 대상 디렉토리에 fresh 설치
install_to() { bash "$GET" --src "$REPO_ROOT" --yes "$1" >/dev/null 2>&1; }

# ── 시나리오 1: gd version = package.json version ──────────
T1="$TMP/version"; mkdir -p "$T1"; install_to "$T1"
GD1="$T1/.gd/bin/gd"
if [ ! -f "$GD1" ]; then
  fail "시나리오1: .gd/bin/gd 미설치 (bin/gd 미구현)"
else
  ver="$("$GD1" version 2>/dev/null)"
  [ "$ver" = "$PKG_VER" ] || fail "시나리오1: version 출력 불일치 (got=$ver want=$PKG_VER)"
  ok "시나리오1: gd version"
fi

# ── 시나리오 2: gd status 최신 + 사용자 수정 파일 표시 ──────
T2="$TMP/status-latest"; mkdir -p "$T2"; install_to "$T2"
GD2="$T2/.gd/bin/gd"
if [ ! -f "$GD2" ]; then
  fail "시나리오2: .gd/bin/gd 미설치"
else
  printf '\nUSER EDIT\n' >> "$T2/.gd/templates/prd.md"   # 사용자 수정
  out="$(GD_RAW_BASE="$RAW" "$GD2" status 2>&1)"
  printf '%s' "$out" | grep -q "최신" || fail "시나리오2: '최신' 미출력"
  printf '%s' "$out" | grep -q "prd.md" || fail "시나리오2: 수정 파일(prd.md) 미표시"
  ok "시나리오2: gd status 최신 + 수정 표시"
fi

# ── 시나리오 3: gd status 업그레이드 가능 판정 ─────────────
T3="$TMP/status-upgrade"; mkdir -p "$T3"; install_to "$T3"
GD3="$T3/.gd/bin/gd"
if [ ! -f "$GD3" ]; then
  fail "시나리오3: .gd/bin/gd 미설치"
else
  printf '0.0.1\n' > "$T3/.gd/VERSION"   # 설치 버전을 인위적으로 낮춤
  out="$(GD_RAW_BASE="$RAW" "$GD3" status 2>&1)"
  printf '%s' "$out" | grep -q "업그레이드 가능" || fail "시나리오3: '업그레이드 가능' 미출력"
  printf '%s' "$out" | grep -q "0.0.1" || fail "시나리오3: 현재 버전 미표시"
  ok "시나리오3: gd status 업그레이드 가능"
fi

# ── 시나리오 4: gd upgrade 충돌 보존 (통합 시나리오 2 로컬판) ──
T4="$TMP/upgrade"; mkdir -p "$T4"; install_to "$T4"
GD4="$T4/.gd/bin/gd"
if [ ! -f "$GD4" ]; then
  fail "시나리오4: .gd/bin/gd 미설치"
else
  mkdir -p "$T4/docs"; printf 'user artifact\n' > "$T4/docs/prd.md"
  printf '\nUSER EDIT\n' >> "$T4/.gd/templates/prd.md"   # 사용자 수정 파일
  modified_orig="$(cat "$T4/.gd/templates/prd.md")"
  unmod_sha_before="$( (cd "$T4" && { command -v shasum >/dev/null && shasum -a 256 .gd/templates/ui-rules.md || sha256sum .gd/templates/ui-rules.md; }) )"

  if ! GD_RAW_BASE="$RAW" "$GD4" upgrade --src "$REPO_ROOT" --yes >/dev/null 2>&1; then
    fail "시나리오4: gd upgrade 종료코드 비0"
  fi
  # 수정 파일 원본 보존
  [ "$(cat "$T4/.gd/templates/prd.md")" = "$modified_orig" ] || fail "시나리오4: 수정 파일이 덮어쓰여짐 (비가역 손실)"
  # .new 나란히 생성
  [ -f "$T4/.gd/templates/prd.md.new" ] || fail "시나리오4: <file>.new 미생성"
  # docs/ 미접촉
  [ "$(cat "$T4/docs/prd.md")" = "user artifact" ] || fail "시나리오4: docs/ 변경됨"
  # VERSION 재기록
  [ "$(cat "$T4/.gd/VERSION" 2>/dev/null)" = "$PKG_VER" ] || fail "시나리오4: VERSION 미재기록"
  ok "시나리오4: gd upgrade 충돌 보존"
fi

# ── 시나리오 5: VERSION 부재 복구 (critique #6a) ──────────
T5="$TMP/recover"; mkdir -p "$T5"; install_to "$T5"
GD5="$T5/.gd/bin/gd"
if [ ! -f "$GD5" ]; then
  fail "시나리오5: .gd/bin/gd 미설치"
else
  rm -f "$T5/.gd/VERSION"
  out="$(GD_RAW_BASE="$RAW" "$GD5" status 2>&1 || true)"
  printf '%s' "$out" | grep -qi "upgrade\|복구\|unknown" || fail "시나리오5: VERSION 부재 안내 미출력"
  GD_RAW_BASE="$RAW" "$GD5" upgrade --src "$REPO_ROOT" --yes >/dev/null 2>&1
  [ "$(cat "$T5/.gd/VERSION" 2>/dev/null)" = "$PKG_VER" ] || fail "시나리오5: upgrade 후 VERSION 미복구"
  ok "시나리오5: VERSION 부재 복구"
fi

exit "$FAILED"
