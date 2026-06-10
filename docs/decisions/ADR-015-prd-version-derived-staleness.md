---
id: ADR-015
type: convention
date: 2026-06-09
status: accepted
---

# ADR-015: prd version ↔ critique prdVersion — stale 은 읽을 때 파생(stateless)

## 📚 Context

`/gd-plan-critique` 는 PRD 전제를 비판한다. PRD 가 critique 이후 바뀌면 critique 결과는 stale 해진다. 하류(`/gd-plan-design`)가 "전제 검증을 먼저 권장" 하는 soft-gate 를 걸려면, "critique 가 *현재* PRD 를 봤나" 를 판정할 기준이 필요하다. 단, gd-plan 은 일반 staleness 전파(상위>하위 전체)를 v2 로 미뤄둔 상태라 — 넓은 메커니즘이 아니라 **prd↔critique 한 쌍만** 보는 좁은 규약이 필요하다.

## 🎯 Decision

PRD frontmatter 에 **monotonic 정수 `version`** 을 둔다. 규칙 정본은 `templates/prd.md`:

- 신규 prd = `version: 1`(신설 — bump 아님). 이후 prd 본문이 갱신될 때마다(인터뷰 추가 답변 또는 critique 반영) **+1**, 한 세션의 다건 반영도 **+1**.
- critique 보고서(`_critique.md`) frontmatter 는 비평한 prd 의 version 을 `prdVersion` 으로 **불변 기록**한다.
- **stale 은 저장하지 않고 읽을 때 파생**: 읽는 쪽이 `prd.version > _critique.prdVersion` 을 그 자리서 비교. 참이면 stale.

진실원이 하나(`version`)라 desync 불가능하다. soft-gate 경고는 "1회" 같은 영속 플래그 없이 stale 인 동안 매 진입마다 표시한다(stateless 보존).

## 📊 Consequences

- **긍정**: soft-gate 판정과 staleness 판정이 같은 비교 하나로 처리된다(별도 장치 0). 진실원 단일.
- **부정**: 사용자가 스킬 밖에서 prd 를 손편집하면 version 이 안 올라가 거짓-신선이 될 수 있다(감수 — soft-gate 라 치명 아님).
- **중립**: 내용 해시(손편집까지 포착)는 비채택 — 사용자가 "v2 vs v3" 를 눈으로 못 읽어 가독성 손해. version 정수가 사용자 가시성에 유리.

## 🔀 Alternatives

- **stale 플래그를 `_critique.md` 에 저장**: 비채택 — prd 수정 시 누군가 플래그를 갱신해야 하고, version 과 desync 위험(진실원 둘).
- **일반 staleness 전파(상위>하위 전체)**: 비채택(범위) — gd-plan v2 백로그. 본 ADR 은 prd↔critique 한 쌍만.
- **내용 해시**: 비채택 — 손편집 포착엔 견고하나 사용자 가독성("버전 보고 파악") 상실.

## 📌 Status

Accepted (2026-06-09, spec-01-05 머지 시점). 첫 사용자: `templates/prd.md`(정본), `plans/gd-plan-critique.md`, `plans/gd-plan-design.md`(soft-gate).

## 🔗 Related

- 관련 spec: spec-01-05
- 관련 ADR: `docs/decisions/ADR-010-sitemap-pages-single-source.md`("파생은 읽을 때 계산" 동류 원리), `docs/decisions/ADR-013-critique-vs-review-separation.md`
