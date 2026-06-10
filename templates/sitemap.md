# <프로젝트명> — sitemap.md

> 골격/지도. 전체 페이지 로스터 + capability 커버 + 상태. harness-kit `phase.md` 대응(→ ADR-007).
> `/gd-plan-sitemap` 인터뷰가 prd capability 를 페이지로 묶어 로스터를 깐다. `/gd-plan-page` 가 상태 칸을 갱신.
> 규칙은 `> 규칙:`. 여정 흐름도(mermaid)는 여기 그리지 않는다 — `flows/_overview.md` 담당(중복 금지).

## 목표 한 줄
<이 사이트가 다루는 전체 범위 1줄>

## 페이지 로스터

> 규칙: 행 = 페이지 1개. `[PAGE-<slug>]` ID + `covers`(담당 `[CAP-..]`) + `roles` + 상태 + 등장 flow.
> 규칙: 아래 마커 영역은 `/gd-plan-sitemap` · `/gd-plan-page` 가 자동 갱신 — 손으로 편집하지 말 것.
> 규칙: 상태 허용값 `todo`(미착수) / `draft`(작성 중) / `done`(완료).

<!-- gd:pages:start -->
| Page | covers (CAP) | roles | 상태 | flows |
|---|---|---|---|---|
| `[PAGE-<slug>]` | CAP-.. | 전체 | todo | — |
<!-- gd:pages:end -->

## 커버리지 점검

> 규칙: 모든 prd capability 가 ≥1 page 에 covers 돼야 한다. 미배정 CAP 은 `/gd-plan-review` BLOCK 예고.

- 미배정 capability: <없음 / `[CAP-..]`>
