---
id: ADR-017
type: decision
date: 2026-06-18
status: accepted
---

# ADR-017: critique 2티어 디스패치 — worker→director 독립 2차 + 병합 (ADR-014 연장)

## 📚 Context

ADR-014 는 critique 를 **저작자와 분리된 독립 컨텍스트**(단일 Opus 서브에이전트)로 수행하도록 정했다. 그러나 단일 worker 의 비평을 *적대적으로 검증*하는 2차 관문이 없어, worker 가 놓친 발견·환각한 규제·과대/과소 severity 가 그대로 사람에게 전달됐다. ADR-014 가 스스로 인정한 한계 — 검증자도 동일 모델이면 **model-level self-bias 잔존**(Panickssery et al., NeurIPS 2024) — 도 미해결로 남았다. 또한 단일 컨텍스트 순차 검토는 **anchoring**(첫 리뷰어 편향 고착, arXiv 2503.13879 등 정량 확인)에 노출된다.

## 🎯 Decision

critique 를 **2티어**로 수행한다 — ADR-014 의 "저작자≠검증자, 독립 컨텍스트 우선, 정직한 degrade" 원칙은 유지하고(supersede 아님), 그 위에 다음을 더한다:

1. **worker(1차) → director(2차+병합) 2티어**: 두 독립 서브에이전트를 `Agent` tool 로 디스패치. 메인 에이전트는 비평·검증·병합을 직접 수행하지 않고 오케스트레이션·relay·사람 triage 만 한다.
2. **교차 모델**: 기본 worker=`sonnet` / director=`opus`. ADR-014 가 인정한 동일모델 self-bias 를 교차 모델로 완화(둘 다 opus 전환 가능 — 깊이↑·다양성↓, 한계 명시).
3. **director 2-페이즈 순서 강제**: 페이즈1 = worker 보고서 미제시 상태에서 자기 발견 먼저 완결(commit) → 페이즈2 = worker 보고서 받아 병합. anchoring 의 구조적 완화.
4. **병합 규약**: 매칭(`prd.md:줄`+렌즈) / 한쪽만 잡은 발견은 provenance 달아 갭 표면화(drop 안 함) / severity 불일치는 director 가 근거 인용해 재정 / 양쪽 무근거는 director 가 직접 재검증 후 drop.
5. **정직한 degrade 보존**(ADR-014): 2티어 → 1티어(⚠️ 검증 안 된 1차본 배너) → self-review 배너. 침묵 self-review 금지.

## 📊 Consequences

- **긍정**: 2차 독립 비평이 worker 커버리지 갭을 메운다(통합 테스트에서 director 가 worker 미포착 2건 표면화). 교차 모델로 self-bias 완화. 2-페이즈로 anchoring 완화. provenance 로 병합 추적성 확보.
- **부정**: 디스패치 1→2 로 토큰/시간 비용 증가(worker=sonnet 으로 일부 상쇄). 위계(director 단일 최종 권위자)라 director model bias 는 잔존(둘 다 opus 시 echo chamber). 단일 컨텍스트 2-페이즈라 완전 blind 는 아님(연성 독립).
- **중립**: 강제는 LLM 순응 의존(결정적 enforce 아님). `test/sh/test-critique-dispatch.sh` 가 규약 회귀를 가드.

## 🔀 Alternatives

- **대안 A — 병렬 blind 3-디스패치**: worker·director 동시 blind 비평 + 별도 merge. anchoring 원천 차단·진짜 독립이나 비용·복잡도↑, 협업 이득 상실. → 고위험용 **opt-in** 으로만 병기.
- **대안 B — 2-디스패치 + 순서 강제 (채택)**: 비용 불변으로 anchoring 구조 완화 + director judgment 보존.
- **대안 C — 비위계 패널 + 규칙 집계**: director 재정 권한 없이 동급, 메인이 결정적 규칙 집계. 패널 bias-분산 유지하나 opus judgment 천장 미활용·over-flag↑. 비채택.

## 📌 Status

Accepted (2026-06-18, spec-03-01 머지 시점). 첫 사용자: `plans/gd-plan-critique.md` §2·§4·§5. 회귀 가드: `test/sh/test-critique-dispatch.sh` (spec-03-02).

## 🔗 Related

- 관련 spec: spec-03-01(구현), spec-03-02(회귀 가드)
- 관련 ADR: `docs/decisions/ADR-014-author-verifier-separation.md` (연장 — 014 의 단일 독립 컨텍스트를 2티어로 확장), `docs/decisions/ADR-013-critique-vs-review-separation.md`
