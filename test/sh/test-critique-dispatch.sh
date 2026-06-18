#!/usr/bin/env bash
# spec-03-02 — critique 2티어 디스패치 규약 회귀 가드
# plans/gd-plan-critique.md 가 worker→director 2티어 + 병합 불변식 문자열을
# 보유하는지 검증. 프롬프트 편집으로 조용히 회귀하는 것을 막는다. 네트워크 0.
set -u

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
C="$REPO_ROOT/plans/gd-plan-critique.md"
FAILED=0

fail() { printf '  ✗ %s\n' "$1" >&2; FAILED=1; }
ok()   { printf '  · %s\n' "$1"; }

if [ ! -f "$C" ]; then
  printf '  ✗ critique 스킬 없음 (%s)\n' "$C" >&2
  exit 1
fi

# 불변식: "표시명|검증 문자열"
check() {
  local name="$1" needle="$2"
  if grep -qF "$needle" "$C"; then
    ok "$name"
  else
    fail "$name — 누락: '$needle'"
  fi
}

check "worker=sonnet 기본"          'model: "sonnet"'
check "director=opus 기본"          'model: "opus"'
check "2-페이즈: 페이즈1 독립"        '페이즈1 (독립)'
check "2-페이즈: 페이즈2 병합"        '페이즈2 (병합)'
check "provenance 스키마"            'provenance'
check "provenance: director단독"     'director단독'
check "메인 비평금지 불변식"          '메인 에이전트는 비평·검증·병합을 직접 수행하지 않는다'
check "보고서만 (prd 직접수정 금지)"  'prd 를 직접 수정하지 않는다'
check "폴백 1차본 배너"              '검증 안 된 1차본'

[ "$FAILED" -eq 0 ]
