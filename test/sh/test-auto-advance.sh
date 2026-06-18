#!/usr/bin/env bash
# spec-x-gd-plan-auto-advance — 자동 진행(confirm-then-advance) 마커 구조 검증
# 9개 plans/gd-plan-*.md 가 각각 `<!-- gd:advance next=X -->` 마커를 정확히 1개씩
# 보유하고, 기대 next 값(전이표)과 일치하는지 확인. 네트워크 0.
set -u

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
PLANS="$REPO_ROOT/plans"
FAILED=0

fail() { printf '  ✗ %s\n' "$1" >&2; FAILED=1; }
ok()   { printf '  · %s\n' "$1"; }

# 전이표: 스킬 → 기대 next 값
#   start  = auto  (동적 진입 — 첫 미완 단계로)
#   page   = loop  (페이지 소진까지 반복 후 flows 제안)
#   review = gate  (자동 진행 금지)
expected() {
  case "$1" in
    gd-plan-start)    echo "auto" ;;
    gd-plan-prd)      echo "critique" ;;
    gd-plan-critique) echo "design" ;;
    gd-plan-design)   echo "sitemap" ;;
    gd-plan-sitemap)  echo "page" ;;
    gd-plan-page)     echo "loop" ;;
    gd-plan-flows)    echo "rules" ;;
    gd-plan-rules)    echo "review" ;;
    gd-plan-review)   echo "gate" ;;
    *)                echo "" ;;
  esac
}

for skill in gd-plan-start gd-plan-prd gd-plan-critique gd-plan-design \
             gd-plan-sitemap gd-plan-page gd-plan-flows gd-plan-rules gd-plan-review; do
  f="$PLANS/$skill.md"
  if [ ! -f "$f" ]; then
    fail "$skill: 파일 없음 ($f)"
    continue
  fi

  count="$(grep -c 'gd:advance' "$f")"
  if [ "$count" -ne 1 ]; then
    fail "$skill: gd:advance 마커 개수 $count (기대 1)"
    continue
  fi

  got="$(grep -o 'gd:advance next=[a-z]*' "$f" | head -1 | sed 's/.*next=//')"
  want="$(expected "$skill")"
  if [ "$got" != "$want" ]; then
    fail "$skill: next 불일치 (got=$got want=$want)"
    continue
  fi

  ok "$skill: next=$got"
done

[ "$FAILED" -eq 0 ]
