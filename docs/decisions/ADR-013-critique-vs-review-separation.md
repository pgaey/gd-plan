---
id: ADR-013
type: convention
date: 2026-06-09
status: accepted
---

# ADR-013: 검증 2층 분리 — critique(의미 정합) vs review(구조 정합)

## 📚 Context

gd-plan 의 검증 레이어는 본래 `/gd-plan-review` 하나였다. review 는 `role→capability→page→flow` 의 **연결(syntactic)** 만 추적한다 — "CAP-04 토큰이 어떤 page 의 covers 에 있나" 는 보지만 "예약 결과가 실제로 환자에게 닿는가" 는 못 본다. 별도 워크스페이스의 치과 dry-run 적대 검증에서, review 를 통과한 문서셋에 루프 미완결·규제 누락·측정불가 등 **의미적** 결함 4건이 발견됐다. "문서 다 채워지고 ID 연결 맞으니 잘된 기획" 이라는 착각이 모든 결함의 공통 뿌리였다.

## 🎯 Decision

검증을 **두 층으로 분리**한다. 한 커맨드에 섞지 않는다.

| 층 | 커맨드 | 질문 | 판정 |
|---|---|---|---|
| 구조 정합 | `/gd-plan-review` | "아귀가 맞나?" (연결 graph) | 결정적 — BLOCK/WARN |
| 의미 정합 | `/gd-plan-critique` | "말이 되나?" (전제 타당성) | 비결정적 — soft 경고 |

핵심 명제: **구조적 완성 ≠ 의미적 정합.** review 통과가 곧 제품 정합이 아니다. 흐름상 critique 는 review 보다 *앞*(PRD 직후)에 둬서, 틀린 전제 위에 정합적 하류를 쌓기 전에 친다.

## 📊 Consequences

- **긍정**: review 가 구조적으로 못 보는 의미 결함(트랜잭션 미완결·규제 누락)을 PRD 단계에서 잡는다. 두 커맨드의 역할이 명확히 갈려 사용자 혼선·중복이 없다.
- **부정**: 검증 표면이 둘로 늘어 사용자가 둘 다 돌려야 한다(critique 는 soft 라 강제 안 됨 → 건너뛸 여지).
- **중립**: 두 층이 같은 5종 문서를 보지 않게 위생 규약 필요 — review/start 는 `_critique.md` 를 모델로 읽지 않는다(무시).

## 🔀 Alternatives

- **review 의 한 모드로 통합(`review --semantic`)**: 비채택 — 결정적(lint)·BLOCK 가능한 review 와 비결정적·soft 인 critique 를 한 커맨드에 섞으면 2층 분리라는 핵심 명제가 흐려진다.
- **critique 없이 review 만 강화**: 비채택 — 의미 판정은 결정적 set-diff 로 환원 불가(틀림의 정도를 기계가 못 정함).

## 📌 Status

Accepted (2026-06-09, spec-01-05 머지 시점). 첫 사용자: `plans/gd-plan-critique.md`, `plans/gd-plan-review.md`.

## 🔗 Related

- 관련 spec: spec-01-05 (critique 도입), spec-01-04 (review 구조 검증)
- 관련 ADR: `docs/decisions/ADR-014-author-verifier-separation.md`(독립성 메커니즘), `docs/decisions/ADR-012-flows-reverse-derivation.md`(review 구조 토대)
