#!/usr/bin/env bash
# spec-04-01 — design 프리뷰 결합 규약 회귀 가드
# gd-plan-design.md 가 빌드타임 스와치 fragment 결합 규약을 보유하는지 + 66 fragment
# 가 빌드돼 있는지 검증. 네트워크 0.
set -u

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
D="$REPO_ROOT/plans/gd-plan-design.md"
SW="$REPO_ROOT/design-md-collection/_swatches"
FAILED=0

fail() { printf '  ✗ %s\n' "$1" >&2; FAILED=1; }
ok()   { printf '  · %s\n' "$1"; }

[ -f "$D" ] || { printf '  ✗ design 스킬 없음 (%s)\n' "$D" >&2; exit 1; }

check() {
  local name="$1" needle="$2"
  if grep -qF "$needle" "$D"; then ok "$name"; else fail "$name — 누락: '$needle'"; fi
}

check "스와치 결합 규약"        '_swatches/'
check "프리뷰 산출물 경로"       'docs/_design-preview.html'
check "정직 배너(폰트 라벨)"     '폰트명 라벨'
check "읽어 붙이기(재생성 금지)" '읽어 붙이기'
check "ADR-019 참조"            'ADR-019'

# 66 fragment 가 빌드돼 있는지(누락 시 빌드 안내)
if [ -d "$SW" ]; then
  n=$(find "$SW" -maxdepth 1 -name '*.html' | wc -l | tr -d ' ')
  if [ "${n:-0}" -ge 60 ]; then
    ok "스와치 fragment ${n}개 빌드됨"
  else
    fail "스와치 fragment 부족: ${n} (pnpm build-swatches?)"
  fi
else
  fail "_swatches/ 디렉토리 없음 (pnpm build-swatches 미실행)"
fi

[ "$FAILED" -eq 0 ]
