---
name: gd-plan-structure
description: 사이트 구조 = 와이어프레임. 각 페이지를 통제된 섹션 어휘(section-taxonomy)에서 고른 순서 있는 섹션 스택으로 정의한다. PRD capability를 page로 covers. sitemap/layout/responsive/states. idempotent.
---

# gd-plan-structure — 구조/와이어프레임

> 본 스킬은 *와이어프레이머*입니다. 페이지를 자유 박스가 아니라 **통제된 섹션 어휘에서 고른 순서 있는 섹션 스택**으로 조립합니다 (relume 모델, shadcn 토대).
> 여기선 *무엇이 어떤 순서로 · 누구에게* 만 정합니다. 시각/수치는 design.md · ui-rules.md 담당.

---

## §1 자동 로딩 컨텍스트

| 파일 | 역할 |
|---|---|
| `docs/prd.md` | capabilities `[CAP-..]` + roles (페이지가 covers 할 대상) |
| `docs/design.md` | 톤·레이아웃 밀도 (섹션 선택 힌트) |
| `templates/section-taxonomy.md` (패키지) | **통제된 섹션 어휘** — 페이지 조립은 이 목록 안에서만 |

> prd.md 가 없으면 차단: "먼저 /gd-plan-prd 로 capabilities 를 정하세요."

## §2 섹션 어휘 (조립 재료)

section-taxonomy.md 의 어휘만 사용한다. 마케팅 11종 + 앱 10종:

- **마케팅**: Navbar, Hero, Feature, Logos, Stats, Gallery, Testimonial, Pricing, FAQ, CTA, Footer
- **앱**: Sidebar(LNB), PageHeader, Toolbar, StatGrid, DataTable, List, Form, DetailPanel, Tabs, EmptyState

> 어휘에 없는 섹션이 필요하면 임의로 만들지 말고 **section-taxonomy.md 에 먼저 추가** (매핑할 catalog 컴포넌트가 있어야 함). 추가는 사용자 확인 후.
> 오버레이(Modal/Sheet/Drawer)는 섹션이 아니라 **동작** — `layout.modal` 에 기술.

## §3 인터뷰 절차

### 3-1. Sitemap (페이지 목록)
- prd 의 각 capability 를 어느 페이지가 담당할지 묻는다.
- 페이지마다 `[PAGE-<slug>]` ID + `covers: [CAP-..]`.
- **모든 capability 가 최소 1개 page 에 covers 돼야 한다** (안 되면 /gd-plan-review BLOCK 예고).

### 3-2. 페이지별 섹션 스택 (와이어프레임)
각 페이지에 대해 순서대로:
- **roles**: 접근 가능 역할 (prd roles 와 일치). 특정 역할 전용이면 권한 화면 분리 근거.
- **layout**: { lnb, sticky, modal }
- **sections**: 위→아래 순서 = 화면 배치. 각 `타입(슬롯=값)`, 타입은 §2 어휘에서만.
- **responsive**: { mobile, breakpoint }
- **states**: { empty, loading, error }
- **flows**: (나중에 /gd-plan-flows 가 채움 — 일단 비워둠)

## §4 페이지 유형별 기본 섹션 가이드 (제안만, 강제 아님)

- **랜딩**: Navbar → Hero → Feature → (Stats/Testimonial/Pricing/FAQ) → CTA → Footer
- **목록/대시보드**: (Sidebar) → PageHeader → Toolbar → (StatGrid) → DataTable|List
- **상세/폼**: PageHeader → Form|DetailPanel → (Tabs)
- **빈 상태**: PageHeader → EmptyState

> 제안은 출발점일 뿐. 프로젝트마다 배치는 다르다 (어휘만 공통).

## §5 idempotent

- 기존 structure.md 가 있으면 페이지를 보존하고 누락 페이지만 인터뷰.
- capability 가 추가됐는데 담당 page 가 없으면 그 capability 부터 질문.

## §6 종료

- 모든 capability 가 page 에 covers 됐는지 자가 점검 (안 되면 경고 + 어느 CAP 인지 명시).
- 각 page 의 sections 가 §2 어휘만 쓰는지 점검.
- 출력: `docs/structure.md 작성 완료 (N pages). 다음 단계: /gd-plan-flows. 전체 진행률: 3/5`
