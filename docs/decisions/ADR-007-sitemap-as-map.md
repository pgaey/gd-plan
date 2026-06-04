---
id: ADR-007
type: convention
date: 2026-06-04
status: accepted
---

# ADR-007: sitemap.md = phase.md 대응 지도 (마커 자동관리 평면 로스터)

> spec-01-01. 페이지 dir 들의 골격/상태를 한눈에 보는 지도.

## 📚 Context

페이지가 `pages/[PAGE]/` 디렉토리로 흩어지면 전체 골격(어떤 페이지가 있고 각 capability 가 어디에 covers 되는가)을 한눈에 볼 지도가 필요하다. harness-kit `phase.md` 가 spec 표로 정확히 그 역할을 하며, 마커(`<!-- sdd:specs -->`)로 자동 갱신된다.

## 🎯 Decision

`docs/sitemap.md` = 지도. **평면 로스터 표**(`Page | covers(CAP) | roles | 상태 | flows`)를 `<!-- gd:pages:start/end -->` 마커로 감싸 `/gd-plan-sitemap`·`/gd-plan-page` 가 자동 갱신한다(phase.md 동형). 상태 칸(`todo/draft/done`)이 라이브 대시보드 역할. **계층은 페이지 frontmatter `parent` 로 표현**해 표 자체는 평면으로 단순 유지. 여정 흐름도(mermaid)는 `flows/_overview.md` 가 담당(중복 금지).

## 📊 Consequences

- **긍정**: 전체 골격 + 진행 상태를 한 표로. 마커 행이 기계가독이라 향후 set-diff 토대.
- **부정**: 계층 nav 트리(부모-자식 시각화)는 `parent` frontmatter 에서 합성해야 하며 당장은 미구현(필요 시 후속).
- **중립**: phase.md 패턴 차용.

## 🔀 Alternatives

- **계층 nav 트리 직접 표기**: 부모-자식 중첩 — 비채택: 표 복잡, 증분 갱신 어려움. 필요해지면 `parent` 에서 합성.
- **mermaid 지도**: 다이어그램 — 비채택: flows/_overview 와 중복, 기계가독 약함.

## 📌 Status

Accepted (2026-06-04, spec-01-01). 첫 사용자: `templates/sitemap.md`.

## 🔗 Related

- `docs/decisions/ADR-006-vertical-slice-page-unit.md`
- spec-1-02 (`/gd-plan-sitemap` 구현)
