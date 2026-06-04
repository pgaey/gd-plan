---
page: "[PAGE-<slug>]"
covers: [CAP-..]
roles: [User]
flows: []        # /gd-plan-flows 가 flow step @[PAGE-id] 에서 자동 도출 — 손편집 금지 (→ ADR-009 예정)
parent: ""        # 상위 페이지 [PAGE-..] (최상위면 빈값)
---

# [PAGE-<slug>] <페이지명> — structure.md

> 페이지 1개 = 와이어프레임 1개. 섹션은 [섹션 어휘](../../section-taxonomy.md)에서 고른 **순서 있는 섹션 스택**(→ ADR-004).
> 규칙은 `> 규칙:`. 시각/수치는 design.md · ui-rules.md 담당 — 여기선 *무엇이 어떤 순서로 · 누구에게*.
> frontmatter = ID 스파인(→ ADR-008): `covers`=담당 `[CAP-..]`, `roles`=접근 역할, `flows`=등장 flow(자동 도출), `parent`=상위 `[PAGE-..]`.

## sections (순서 = 와이어프레임)

> 규칙: 위→아래 = 화면 배치 순서. 각 `타입(슬롯=값)`, **타입은 section-taxonomy 어휘에서만**.
1. `Navbar(logo, links[], cta?)`
2. `...`

## layout
- { lnb: 없음 | 좌측, sticky: 없음 | navbar | header, modal: 없음 | <설명> }

## responsive
- { mobile: <다른 점>, breakpoint: <기준> }

## states
- { empty: <...>, loading: skeleton | spinner | 없음, error: toast | page }
