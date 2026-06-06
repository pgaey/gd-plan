---
id: ADR-012
type: invariant
date: 2026-06-06
status: accepted
---

# ADR-012: 페이지 flows 는 flow step 에서 재계산 파생된다 (손편집 금지)

> **Note — 경로 표기와 stale ADR 검사 대상**: 본 ADR 의 inline backtick 경로는 `sdd status` 의 stale ADR 검사 대상입니다(inline backtick + 슬래시 + 확장자). 그래서 placeholder/glob 경로(예: 페이지별 structure.md, flow glob)는 backtick-확장자 표기 대신 코드펜스/문구로 둡니다.

## 📚 Context

gd-plan 세로 슬라이스 모델에서 페이지는 자신이 등장하는 flow 를 frontmatter `flows:` 로 노출한다(ID 스파인 — ADR-008). 그런데 flow ↔ page 관계는 양쪽에서 표현 가능하다: flow step 의 `@[PAGE-id]` 와 페이지의 `flows:`. 둘을 사람이 양쪽에서 유지하면 drift 가 불가피하고, review 의 누수(빠진 연결) 검증이 신뢰할 조인 키를 잃는다. 성공 기준 4번("frontmatter `flows` ↔ flow step `@[PAGE-id]` 1:1, 손편집 0")은 이 한쪽-원천 보장을 요구한다.

## 🎯 Decision

페이지 `flows:` 는 **flow step 에서 재계산 파생**되는 값이며, 단일 원천(SoT)은 flow step `@[PAGE-id]` 다. `/gd-plan-flows` 가 매 실행마다 전체 flow 를 스캔해 각 페이지 `flows:` 를 정렬된 정규형으로 **통째 덮어쓴다**(add-only 가 아니라 full re-derive). 페이지 `flows:` 손편집은 금지한다.

```text
flows(page) = sort({ [FLOW-slug] | page ∈ FLOW.steps(@[PAGE-id]) })
```

- 정렬: `[FLOW-slug]` ID 사전순 고정 → 재실행 시 텍스트 무변화(멱등).
- FLOW slug 정규화: 소문자 kebab (ADR-009 와 동일 규칙) — 케이스 변이가 조인을 깨지 않게.

## 📊 Consequences

- **긍정**: drift 0(매 실행이 정규형으로 수렴). 빠진 참조의 옛 `[FLOW-..]` 항목 자동 제거(GC). 멱등이 집합·텍스트 양쪽에서 성립. review 가 페이지 `flows:` 를 신뢰하고 역참조 drift·누수를 점검 가능.
- **부정**: 페이지 `flows:` 의 사용자 손편집은 다음 flows 실행에서 덮인다(단 손편집 금지가 규약이라 실질 손해 없음). 부분 flow 작업에도 전체 페이지를 재계산하므로 git diff 범위가 넓어질 수 있다.
- **중립**: 본 불변의 강제는 LLM 순응에 의존한다. 결정적 enforce(lint 종료코드)는 review v2 백로그로 둔다.

## 🔗 ADR-010 과의 관계 (필수 명문화)

본 불변은 `docs/decisions/ADR-010-sitemap-pages-single-source.md`("디렉토리=진실, 인덱스=파생")의 **두 번째 인스턴스**다(첫째는 sitemap 로스터 ↔ 페이지). 다만 ADR-010 은 "페이지 frontmatter 의 단일 작성자 = `/gd-plan-page`" 를 전제하는데, 본 ADR 은 그 전제를 **`flows` 필드에 한해** 좁힌다:

- `flows:` 의 SoT 작성자는 `/gd-plan-page` 가 아니라 `/gd-plan-flows` 다.
- 나머지 필드(`covers`/`roles`/`parent`)는 ADR-010 대로 page 스킬이 SoT 작성자다.

즉 한 frontmatter 블록에 작성자가 둘이지만, **필드별로 SoT 가 분리**되어 충돌하지 않는다.

## 🔀 Alternatives

- **add-only merge**: flow 참조를 추가만 하고 삭제는 미반영 — 비채택: stale 누적 + "손편집 금지 ↔ 수정 주체 부재" 모순(critique #1).
- **backref 비저장(동적 도출, Obsidian 식)**: 페이지 `flows:` 필드를 없애고 review/sitemap 이 그때그때 계산 — 비채택: ADR-008 ID 스파인·set-diff 조인 키 전제가 무너지고 기존 spec 결정을 번복.
- **결정적 코드 도출(`src/` 빌드 스텝)**: flow 파싱→재계산을 코드로 — 비채택(이번 범위): markdown 지시문 도구 정체성·범위. review v2 의 정당한 진화 경로로 보류.

## 📌 Status

Accepted (2026-06-06, spec-01-04 머지 시점). 첫 사용자: `plans/gd-plan-flows.md` §5(재계산), `plans/gd-plan-review.md` §2(역참조 drift 점검).

## 🔗 Related

- 관련 spec: spec-01-04 (본 불변 도입), spec-01-01 (frontmatter 스키마), spec-01-03 (결정 로그 `연결`)
- 관련 ADR: `docs/decisions/ADR-010-sitemap-pages-single-source.md`(상위 원리), `docs/decisions/ADR-008-decision-log-two-tier.md`(ID 스파인), `docs/decisions/ADR-009-slug-page-id-normalization.md`(slug 정규화)
