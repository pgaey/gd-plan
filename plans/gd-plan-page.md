---
name: gd-plan-page
description: 페이지 1개 세로 슬라이스. docs/pages/[PAGE-slug]/ 디렉토리에 structure.md(섹션스택+frontmatter ID) + decisions.md(골격)를 만든다. sitemap 로스터 상태를 갱신. slug 정규화·sitemap 선행 차단. idempotent.
---

# gd-plan-page — 페이지 세로 슬라이스

> 본 스킬은 *페이지 작성자*입니다. 페이지 **1개**를 받아 `docs/pages/[PAGE-<slug>]/` 디렉토리 전체를 만듭니다 (harness-kit `specs/spec-id/` 대응 → ADR-006).
> 섹션은 [section-taxonomy](../templates/section-taxonomy.md) 어휘에서만 (→ ADR-004). 시각/수치는 design.md · ui-rules.md.

---

## §1 자동 로딩 컨텍스트

| 파일 | 역할 |
|---|---|
| `docs/sitemap.md` | 로스터 — 이 페이지의 covers/roles/상태 (선행 필수) |
| `docs/prd.md` | capabilities/roles 검증 |
| `templates/pages/structure.md` · `templates/pages/decisions.md` (패키지) | 페이지 골격 |
| `templates/section-taxonomy.md` (패키지) | 통제된 섹션 어휘 |
| `docs/pages/[PAGE-<slug>]/` (있으면) | 기존 페이지 — 보존하며 보강 (idempotent) |

## §2 인자 검증 · 차단

- **인자 누락** → 사용법 안내 후 중단: `/gd-plan-page <slug>`.
- **`docs/sitemap.md` 부재** → 차단: "먼저 `/gd-plan-sitemap` 으로 골격을 까세요."
- **로스터에 없는 slug** → "sitemap 로스터에 `[PAGE-<slug>]` 가 없습니다. 추가할까요?" 확인 후 진행(추가 시 로스터에도 행 append).

## §3 slug 정규화 (→ ADR-009)

- 소문자 **kebab-case** 강제. `Home`·`예약 상세` → 경고 후 `home`·사용자 지정 ASCII slug.
- `[PAGE-<slug>]` 가 식별자 — flows step·review BLOCK 이 이 ID 로 참조.
- **중복 slug 재호출 = 기존 페이지로 간주**(신규 생성 아님, §7 멱등).

## §4 인터뷰 — structure.md

`templates/pages/structure.md` 를 복사해 채운다:
- **frontmatter**: `page: [PAGE-<slug>]` / `covers: [CAP-..]`(이 페이지가 담당) / `roles:`(접근 역할) / `flows: []`(빈 배열 — flows 가 자동 도출, spec-1-04) / `parent:`(상위 `[PAGE-..]`, 최상위면 빈값).
  - **`covers` 가 진실 (→ ADR-010)** — sitemap 로스터는 이 값을 따라간다.
- **sections** (위→아래 = 배치 순서): 각 `타입(슬롯=값)`, **타입은 section-taxonomy 어휘에서만**. 어휘에 없으면 taxonomy 에 먼저 추가(사용자 확인).
- **layout** { lnb, sticky, modal } · **responsive** { mobile, breakpoint } · **states** { empty, loading, error }.

## §5 decisions.md (fork → 자동 기록 + 수동 보강)

`templates/pages/decisions.md` 복사(없으면 — 헤더 + 6열 표). 인터뷰 fork(섹션·layout·modal 선택)에서 하나를 고르면 `docs/pages/[PAGE-<slug>]/decisions.md` 에 typed 1행 append (연결=섹션명/`[PAGE-..]`). 형식·ID·supersede·멱등 은 헤더 / `ADR-011` 정본 참조. fork 밖 중요한 일회성 결정은 "남길까요?" 제안 후 기록(수동 보강).

## §6 sitemap 로스터 갱신

- 이 페이지의 로스터 행 `covers`/`roles` 를 frontmatter 와 동기화(frontmatter=진실).
- 상태 칸: 섹션이 채워지면 `todo`→`draft`, structure 완료면 `done`.

## §7 idempotent

- 같은 slug 재호출 → 기존 `structure.md` frontmatter·사용자 편집 sections **보존**, 누락 섹션만 보강 + 로스터 상태 갱신. `decisions.md` 는 덮어쓰지 않음.

## §8 종료

- frontmatter ID(`covers`/`roles`)가 prd 와 일치하는지, sections 가 어휘만 쓰는지 자가 점검.
- 출력: `docs/pages/[PAGE-<slug>]/ 작성 완료. 다음 단계: /gd-plan-page <다음 페이지> 또는 /gd-plan-flows. 전체 진행률: 3/5 (페이지 M/N)`
