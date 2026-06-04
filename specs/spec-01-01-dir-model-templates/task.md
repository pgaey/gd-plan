# Task List: spec-01-01

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] 백로그 업데이트 (phase-01.md SPEC 표 sdd 자동 갱신)
- [ ] 사용자 Plan Accept

---

## Task 1: 신규 템플릿 4종 (sitemap / pages/structure / pages/decisions / decisions)

### 1-1. 브랜치 생성
- [ ] `git checkout -b spec-01-01-dir-model-templates` (base: `phase-1-gd-plan-vertical-slice`)
- [ ] Commit: 없음 (브랜치 생성만)

### 1-2. 테스트 작성 (TDD Red)
- [ ] `__tests__/templates-v2.test.ts` 작성 — 신규 템플릿 4종 존재 + 필수 마커(`gd:pages:start/end`) + frontmatter 키(`page/covers/roles/flows/parent`) 포함 검증
- [ ] `pnpm test` → 신규 테스트 Fail 확인 (파일 부재)
- [ ] Commit: `test(spec-01-01): 신규 템플릿 v2 스키마 검증 테스트 추가 (Red)`

### 1-3. 구현 (TDD Green)
- [ ] `templates/sitemap.md` 생성 (마커 로스터 + 목표 + 커버리지 점검)
- [ ] `templates/pages/structure.md` 생성 (frontmatter + 섹션스택 + layout + states)
- [ ] `templates/pages/decisions.md` 생성 (typed 결정 표)
- [ ] `templates/decisions.md` 생성 (전역 typed 결정 표)
- [ ] `pnpm test` → 신규 + 기존 회귀 모두 Pass 확인
- [ ] Commit: `feat(spec-01-01): sitemap/page/decisions 템플릿 추가 (Green)`

---

## Task 2: ADR 3종 (006 세로축 단위 / 007 sitemap=map / 008 결정로그 2층)

### 2-1. ADR 작성
- [ ] `docs/decisions/ADR-006-vertical-slice-page-unit.md` (type: convention, ADR-004 확장 명시)
- [ ] `docs/decisions/ADR-007-sitemap-as-map.md` (type: convention)
- [ ] `docs/decisions/ADR-008-decision-log-two-tier.md` (type: convention)
- [ ] `__tests__/templates-v2.test.ts` 에 ADR-006~008 존재 + frontmatter `type` closure 검증 추가, `pnpm test` Pass
- [ ] Commit: `docs(spec-01-01): ADR-006~008 (세로축 단위·sitemap 지도·결정로그 2층)`

---

## Task 3: Ship (필수)

### 🚦 Pre-Push Quality Gate (push 전 필수)
- [ ] `pnpm typecheck` PASS
- [ ] `pnpm test` 전체 PASS
- [ ] (Integration Test Required = no → 통합 테스트 생략)

### 📝 산출물 작성
- [ ] `walkthrough.md` 작성 (증거 로그)
- [ ] `pr_description.md` 작성 (템플릿 준수)
- [ ] Ship Commit: `docs(spec-01-01): ship walkthrough and pr description`

### 🚀 Push & PR
- [ ] Push: `git push -u origin spec-01-01-dir-model-templates`
- [ ] PR 생성: `gh pr create` 또는 `/hk-pr-gh` (base = `phase-1-gd-plan-vertical-slice`, 사용자 승인 후)
- [ ] 사용자 알림: 푸시 완료 + PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 3 (작업 2 + Ship) |
| **예상 commit 수** | 4 (test, feat, docs-ADR, docs-ship) |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-06-03 |
