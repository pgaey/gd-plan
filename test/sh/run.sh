#!/usr/bin/env bash
# gd-plan 셸 테스트 러너 — test/sh/test-*.sh 전부 실행, 실패 시 비0 종료.
# 의존성 없는 어서션 하네스 (bats 비채택 — spec-02-02 plan 결정).
set -u

SH_DIR="$(cd "$(dirname "$0")" && pwd)"
PASS=0
FAIL=0

for t in "$SH_DIR"/test-*.sh; do
  [ -f "$t" ] || continue
  name="$(basename "$t")"
  if bash "$t"; then
    printf '✓ %s\n' "$name"
    PASS=$((PASS + 1))
  else
    printf '✗ %s\n' "$name" >&2
    FAIL=$((FAIL + 1))
  fi
done

printf '\nshell tests: %d passed, %d failed\n' "$PASS" "$FAIL"
[ "$FAIL" -eq 0 ]
