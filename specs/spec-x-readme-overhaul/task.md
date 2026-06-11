# Task List: spec-x-readme-overhaul

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.
> docs-only spec — TDD red/green 대신 "교차검증 + 회귀"로 검증.

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [-] 백로그 phase.md 갱신 — 해당 없음(spec-x 는 phase 비소속, queue.md specx 섹션은 sdd 관리)
- [x] 사용자 Plan Accept

---

## Task 1: 브랜치 생성 + phase-02 done 마커 반영

### 1-1. 브랜치 생성
- [x] `git checkout -b spec-x-readme-overhaul` (main 에서, 작업트리의 queue.md 변경 carry-over)
- [x] Commit: 없음 (브랜치 생성만)

### 1-2. phase-02 done 마커 커밋 (chore)
- [x] `backlog/queue.md` 의 phase-02 done 마커(이미 존재) 스테이징
- [x] Commit: `chore(spec-x-readme-overhaul): phase-02 done queue 마커 반영` (bde58fd)

### 1-3. spec 산출물 커밋 (docs)
- [x] spec.md / plan.md / task.md / critique.md 스테이징
- [x] Commit: `docs(spec-x-readme-overhaul): spec/plan/task/critique 작성` (c3cb099)

---

## Task 2: README 재구성+증강

### 2-1. 교차검증 자료 수집
- [x] 슬래시 9 (**`plans/gd-plan-*.md`**), gd CLI(`.gd/bin/gd`), get.sh 옵션, 카운트(스킬9/ADR16/컬렉션66/버전 `package.json` 0.1.0) 실제값 확인

### 2-2. README 재구성+증강
- [x] `README.md` 개편 — 정확본문 재사용 + 누락 온보딩 절 신규(이게무엇/왜·언제쓰나·시작하기 mermaid) + stale 2건 교정 + ToC. spec.md FR1 절 구성
- [x] 수동 검증 시나리오 1~4 (명령 1:1·죽은링크 0·카운트 일치·적용조건 존재) 확인 — 전건 PASS (ADR 카운트는 미열거로 회귀유입 차단)
- [x] Commit: `docs(spec-x-readme-overhaul): README 재구성+증강 — 소비자 온보딩`

---

## Task N: Ship (필수)

### 🚦 Pre-Push Quality Gate (push 전 필수)

- [x] **회귀 테스트**: `pnpm test`(67/67) + `pnpm test:sh`(2 passed) + `pnpm typecheck`(clean) → 모두 PASS (코드 미변경 확인)
- [-] 통합 테스트 — Integration Test Required = no

### 📝 산출물 작성

- [x] **walkthrough.md 작성** (증거 로그 — 교차검증 결과, 발견사항)
- [x] **pr_description.md 작성** (템플릿 준수)
- [ ] **Ship Commit**: `docs(spec-x-readme-overhaul): ship walkthrough and pr description`

### 🚀 Push & PR

- [ ] **Push**: `git push -u origin spec-x-readme-overhaul`
- [ ] **PR 생성**: `/hk-pr-gh` (사용자 승인 후, base=main)
- [ ] **사용자 알림**: 푸시 완료 + PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 2 (+ Ship) |
| **예상 commit 수** | 3 (chore 마커 + README + ship) |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-06-11 |
