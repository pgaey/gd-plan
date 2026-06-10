---
id: ADR-014
type: invariant
date: 2026-06-09
status: accepted
---

# ADR-014: 저작자 ≠ 검증자 — 독립 컨텍스트 우선 + 정직한 degrade

## 📚 Context

gd-plan 의 문서는 인터뷰로 **한 에이전트가 저작**한다. 같은 컨텍스트에서 자기가 쓴 것을 자기가 검토하면 confirmation bias 에 빠진다 — 그렇게 만든 문서는 서로 정합적이라 review 를 그대로 통과한다("유창함이 정확함을 가림"). gd-plan 의 다른 서브에이전트(prd-extractor·collection-scanner)는 *편의*(메인이 해도 결과 동일)라 `non-normative` 이지만, critique 서브에이전트는 **독립성 자체가 산출물**이라 범주가 다르다.

연구 단서: 동일 컨텍스트 self-refine 는 자기편향을 증폭한다(arXiv 2402.11436). 한편 LLM 은 컨텍스트를 분리해도 *자기 출력을 편애*한다(Panickssery et al., NeurIPS 2024) — 즉 분리는 만능이 아니다.

## 🎯 Decision

critique 는 **저작자와 분리된 독립 컨텍스트**(별도 서브에이전트)로 수행한다 — 우선순위가 강제다.

1. **독립 컨텍스트 우선**: `Agent` tool 로 별도 서브에이전트(Opus)를 띄울 수 있으면 반드시 사용.
2. **정직한 degrade**: 디스패치가 *실제로 실패*할 때만 폴백. 단 **침묵 self-review 절대 금지** — 큰 경고 배너("독립 검증 불가, 자가점검이라 신뢰 낮춤, 중대결정 확정 금지")를 달고 체크리스트 자가점검을 명시적 폴백으로 수행. 멈추지 않는다(가용성 보존).
3. **정직한 한계 명시**: "분리 = 컨텍스트 분리이지 모델 분리 아님" — 동일 모델 self-bias 는 잔존한다. "분리 = 편향 0" 으로 과대주장하지 않는다(과대주장은 막으려던 함정의 메타 재발).

## 📊 Consequences

- **긍정**: 만든 자와 검증자가 분리돼 *이 대화의* 누적 편향이 끊긴다. 폴백이 있어 서브에이전트 불가 환경에서도 가치 0 이 아니며, 배너로 자가점검을 독립검증으로 착각하지 않는다.
- **부정**: 모델 수준 self-bias 는 남는다(동일 Opus). 폴백을 기본으로 오용할 여지(배너·"실제 실패 시만" 규약으로 방어).
- **중립**: 강제는 LLM 순응에 의존(결정적 enforce 아님).

## 🔀 Alternatives

- **서브에이전트 강제 + 못 띄우면 멈춤**: 비채택 — "어디서나 동작" 과 모순, soft 철학에 hard gate 한 곳만 박혀 일관성 깨짐. 진짜 의도는 "침묵 self-review 차단" 이지 멈춤이 아님.
- **체크리스트 self-critique 를 기본으로**: 비채택 — 동일 컨텍스트 self-critique 는 분리보다 약함(연구). 폴백 티어로만 허용.
- **다중 페르소나 패널**: 보류(후속) — v1 엔 오케스트레이션·토큰 과함.

## 📌 Status

Accepted (2026-06-09, spec-01-05 머지 시점). 첫 사용자: `plans/gd-plan-critique.md` §2·§F.

## 🔗 Related

- 관련 spec: spec-01-05
- 관련 ADR: `docs/decisions/ADR-013-critique-vs-review-separation.md`(검증 2층)
