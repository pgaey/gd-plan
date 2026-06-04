---
name: gd-plan-sitemap
description: 사이트 골격/지도. prd capabilities를 페이지 로스터로 묶어 docs/sitemap.md(마커 자동관리 표)를 만든다. 모든 CAP이 ≥1 page에 covers되는지 + sitemap↔pages 정합성을 점검. 이후 /gd-plan-page가 페이지를 하나씩 채운다. idempotent.
---

# gd-plan-sitemap — 사이트 골격/지도

> 본 스킬은 *지도 제작자*입니다. prd 의 capability 를 **페이지 로스터**로 묶어 `docs/sitemap.md` 를 깝니다 (harness-kit `phase.md` 대응 → ADR-007).
> 페이지 *내용*은 채우지 않습니다 — 그건 `/gd-plan-page <slug>` 의 일. 여기선 **무엇이 페이지가 되고, 어느 CAP 을 담당하나** 만 정합니다.

---

## §1 자동 로딩 컨텍스트

| 파일 | 역할 |
|---|---|
| `docs/prd.md` | `capabilities` `[CAP-..]` + `roles` (로스터의 covers/roles 원천) |
| `templates/sitemap.md` (패키지) | 로스터 구조 = source of truth |
| `docs/sitemap.md` (있으면) | 기존 로스터 — 이어서 갱신 (idempotent) |
| `docs/pages/` (있으면) | 페이지 dir 목록 — 정합성 점검용 |

> `docs/prd.md` 가 없으면 차단: "먼저 `/gd-plan-prd` 로 capabilities 를 정하세요."

## §2 인터뷰 — CAP 을 페이지로 묶기

- prd 의 각 capability 를 **어느 페이지가 담당할지** 묻는다 (한 페이지가 여러 CAP covers 가능).
- 페이지마다 `[PAGE-<slug>]` ID 부여 — slug 는 소문자 kebab (→ ADR-009).
- 각 행: `Page | covers (CAP) | roles | 상태 | flows`.
  - `roles` = 접근 가능 역할 (prd roles 중). `상태` = 신규는 `todo`. `flows` = 비움(나중에 flows 가 채움).
- 추상적이면 페이지 유형 후보를 복수선택 제시 (랜딩 / 목록 / 상세 / 폼 / 대시보드 / 설정 …).

## §3 docs/sitemap.md 생성

`templates/sitemap.md` 골격을 복사하고 `<!-- gd:pages:start --> ~ <!-- gd:pages:end -->` 안에 로스터 표를 채운다. 목표 한 줄도 작성.

> **진실 방향 (→ ADR-010)**: 로스터의 `covers`/`상태` 칸은 페이지 frontmatter 를 따라가는 **파생/표시**다. 페이지가 진실. sitemap 은 한눈 지도일 뿐.

> **결정 기록**: 페이지 묶기 fork 선택 시 `docs/decisions.md` 에 typed 1행 (연결=`[CAP-..]`). 형식·ID·supersede 는 헤더 / `ADR-011` 정본 참조.

## §4 점검 (경고 — 차단은 review 소관)

1. **커버리지**: prd 의 모든 capability 가 ≥1 page 에 covers 되는가? 미배정 CAP → 경고 (해소 안 하면 `/gd-plan-review` BLOCK 예고).
2. **정합성**: 로스터 행에 있으나 `docs/pages/[PAGE-x]/` 가 없음(유령 행) / dir 있으나 행 없음(고아 dir) → 경고. 결정적 set-diff 는 review(spec-1-04) 소관.

## §5 idempotent

- 기존 `docs/sitemap.md` 가 있으면 행을 보존하고, 새 CAP/페이지만 추가 질문.
- 페이지 상태 칸은 손대지 않는다 (`/gd-plan-page` 가 갱신).

## §6 종료

- `docs/sitemap.md` 의 로스터가 모든 CAP 을 덮는지 자가 점검.
- 출력: `docs/sitemap.md 작성 완료 (N pages). 다음 단계: /gd-plan-page <첫 페이지 slug>. 전체 진행률: 3/5`
