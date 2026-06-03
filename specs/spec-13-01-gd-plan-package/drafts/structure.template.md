# <프로젝트명> — structure.md (DRAFT 템플릿)

> 페이지 구조 = **와이어프레임**. 각 페이지는 [섹션 어휘](section-taxonomy.md)에서 고른 **순서 있는 섹션 스택**.
> 규칙은 `> 규칙:`. design / 수치는 design.md · ui-rules.md 가 담당 — 여기선 *무엇이 어떤 순서로 · 누구에게* 만 정한다.

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

<!-- 페이지마다 위 블록 반복 -->

---
---

## 예시 (동네 미용실 예약 사이트)

## Sitemap

- `[PAGE-home]` 홈/랜딩 (covers: CAP-01)
- `[PAGE-booking]` 예약 (covers: CAP-02)
- `[PAGE-mypage]` 마이페이지 (covers: CAP-02, CAP-03)
- `[PAGE-admin-bookings]` 예약 관리(관리자) (covers: CAP-04)

## Page `[PAGE-home]`
- **roles**: 전체 (비로그인 포함)
- **layout**: { lnb: 없음, sticky: navbar, modal: 없음 }
- **sections**: 1. `Navbar(...)` 2. `Hero(...)` 3. `Feature(items[3])` 4. `CTA(...)` 5. `Footer(...)`
- **responsive**: { mobile: Hero 1단 + 이미지 하단, breakpoint: 768px }
- **states**: { empty: -, loading: -, error: - }
- **flows**: FLOW-booking step 1

## Page `[PAGE-booking]`
- **roles**: `[User]`
- **layout**: { lnb: 없음, sticky: 없음, modal: 시술 선택 상세 }
- **sections**: 1. `PageHeader(title=예약)` 2. `Form(fields=[날짜,시간,시술,디자이너,요청])`
- **responsive**: { mobile: Form 1단, breakpoint: 768px }
- **states**: { empty: 가능 시간 없음 안내, loading: skeleton, error: toast }
- **flows**: FLOW-booking step 2

## Page `[PAGE-mypage]`
- **roles**: `[User]`
- **layout**: { lnb: 좌측, sticky: 없음, modal: 예약 취소 확인 }
- **sections**: 1. `PageHeader(title=내 예약)` 2. `Tabs([다가오는, 지난])` 3. `DataTable(columns=[날짜,시술,상태], rowActions=[취소])` 4. `EmptyState(...)`
- **responsive**: { mobile: DataTable -> List 카드 }
- **states**: { empty: EmptyState, loading: skeleton, error: toast }
- **flows**: FLOW-booking step 4, FLOW-cancel step 1

## Page `[PAGE-admin-bookings]`
- **roles**: `[Admin]`
- **layout**: { lnb: 좌측(관리자), sticky: 없음, modal: 예약 승인/거절 확인 }
- **sections**: 1. `PageHeader(title=예약 관리)` 2. `Toolbar(filters=[날짜,상태])` 3. `DataTable(columns=[환자,시술,시간,상태], rowActions=[승인,거절])`
- **responsive**: { mobile: DataTable -> List 카드 }
- **states**: { empty: 신규 예약 없음, loading: skeleton, error: toast }
- **flows**: FLOW-approve step 1
