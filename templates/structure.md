# <프로젝트명> — structure.md

> 페이지 구조 = **와이어프레임**. 각 페이지는 [섹션 어휘](section-taxonomy.md)에서 고른 **순서 있는 섹션 스택**.
> 규칙은 `> 규칙:`. design / 수치는 design.md · ui-rules.md 가 담당 — 여기선 *무엇이 어떤 순서로 · 누구에게* 만 정한다.
> 이 파일은 `/gd-plan-structure` 인터뷰로 채워진다.

---

## Sitemap

> 규칙: 페이지마다 `[PAGE-<slug>]` ID. `covers:` 에 담당 prd capability ID(`[CAP-..]`).
> 규칙: prd capability 가 어느 page 에도 안 잡히면 `/gd-plan-review` BLOCK.

- `[PAGE-<slug>]` <페이지명> (covers: CAP-..)

---

## Page `[PAGE-<slug>]`

> 규칙: `sections` 는 위 -> 아래 순서 = 화면 배치 순서. 각 섹션 `타입(슬롯=값)`, **타입은 어휘표에서만**.

- **roles**: 접근 가능 역할 (예: 전체 / `[User]` / `[Admin]`) — prd 의 roles 와 일치. 특정 역할 전용이면 권한별 화면 구분의 근거.
- **layout**: { lnb: 없음 | 좌측, sticky: 없음 | navbar | header, modal: 없음 | <설명> }
- **sections** (순서 = 와이어프레임):
  1. `Navbar(logo, links[], cta?)`
  2. `...`
- **responsive**: { mobile: <다른 점>, breakpoint: <기준> }
- **states**: { empty: <...>, loading: skeleton | spinner | 없음, error: toast | page }
- **flows**: 이 페이지가 등장하는 flow (`FLOW-.. step N`) — 없으면 review WARN

<!-- 페이지마다 위 블록 반복. 작성 예시는 drafts/structure.template.md 참조 -->
