# Task List: spec-01-02

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] 백로그 업데이트 (phase-01.md SPEC 표 sdd 자동 갱신)
- [x] 사용자 Plan Accept (critique 12건 반영 후)

---

## Task 1: 스킬 셋 교체 (sitemap + page 추가, structure 제거, cli + test 갱신)

### 1-1. 브랜치 생성
- [x] `git checkout -b spec-01-02-vertical-slice-commands` (base: `phase-01-gd-plan-vertical-slice`)
- [x] Commit: 없음 (브랜치 생성만)

### 1-2. 테스트 작성 (TDD Red)
- [x] `__tests__/skills.test.ts` `EXPECTED_SKILLS` 갱신(structure 제거 → sitemap·page, 8개) + 예외/다음단계 목록
- [x] `pnpm test` → Fail 확인 (6 fail)
- [x] Commit: `test(spec-01-02): 스킬 셋 교체 검증 테스트 갱신 (Red)`

### 1-3. 구현 (TDD Green)
- [x] `plans/gd-plan-sitemap.md` 작성 (CAP→로스터 인터뷰 + 커버리지/정합성 점검)
- [x] `plans/gd-plan-page.md` 작성 (slug 정규화·인자/선행 차단·structure 완성·decisions 헤더만·covers 진실·멱등 보존)
- [x] `plans/gd-plan-structure.md` 삭제
- [x] `plans/gd-plan-flows.md` 차단 안내 1줄 갱신 (structure→sitemap)
- [x] `src/cli.ts` main() 안내 목록 갱신 (installPlans 는 glob 기반이라 자동) + `integration.test.ts` 8개
- [x] `pnpm test`(28) + `pnpm typecheck` → Pass
- [x] Commit: `feat(spec-01-02): /gd-plan-sitemap·/gd-plan-page 추가 + structure 대체 (Green)`

---

## Task 2: start 대시보드 새 구조 인식

### 2-1. start 갱신
- [ ] `plans/gd-plan-start.md` 수정 — `sitemap.md` 존재 + `pages/[PAGE-*]/` 상태 집계 진행률, 다음 단계 sitemap→page 흐름
- [ ] `__tests__/skills.test.ts` 에 start 가 sitemap/page 안내를 포함하는지 검증 추가, `pnpm test` Pass
- [ ] Commit: `feat(spec-01-02): gd-plan-start 대시보드 새 구조(sitemap+pages) 인식`

---

## Task 3: ADR 2종 (009 slug 정규화 / 010 단일 진실)

### 3-1. ADR 작성
- [ ] `docs/decisions/ADR-009-slug-page-id-normalization.md` (type: convention)
- [ ] `docs/decisions/ADR-010-sitemap-pages-single-source.md` (type: invariant)
- [ ] `__tests__/templates-v2.test.ts` ADR 목록에 009/010 추가(존재+type closure), `pnpm test` Pass
- [ ] Commit: `docs(spec-01-02): ADR-009 slug 정규화 + ADR-010 단일 진실`

---

## Task 4: Ship (필수)

### 🚦 Pre-Push Quality Gate
- [ ] `pnpm typecheck` PASS
- [ ] `pnpm test` 전체 PASS
- [ ] (Integration Test Required = no → 생략)

### 📝 산출물 작성
- [ ] `walkthrough.md` 작성
- [ ] `pr_description.md` 작성
- [ ] Ship Commit: `docs(spec-01-02): ship walkthrough and pr description`

### 🚀 Push & PR
- [ ] Push: `git push -u origin spec-01-02-vertical-slice-commands`
- [ ] PR 생성: base = `phase-01-gd-plan-vertical-slice` (사용자 승인 후)
- [ ] 사용자 알림: PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 4 (작업 3 + Ship) |
| **예상 commit 수** | 6 (test, feat, feat-start, docs-ADR, docs-ship, +task 마킹) |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-06-04 |
