# Task List: spec-02-03

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] 백로그 업데이트 (phase-02.md SPEC 표 — sdd 자동 갱신)
- [x] 사용자 Plan Accept

---

## Task 1: 브랜치 생성 + planning 산출물 커밋

### 1-1. 브랜치 생성
- [x] `git checkout -b spec-02-03-gd-consumer-cli` (base: `phase-02-distribution`)
- [x] Commit: 없음 (브랜치 생성만)

### 1-2. planning 산출물 커밋
- [x] `backlog/phase-02.md`(spec 표), `backlog/queue.md`, `specs/spec-02-03-gd-consumer-cli/{spec,plan,task}.md` 스테이징
- [x] Commit: `docs(spec-02-03): spec/plan/task 작성`

---

## Task 2: gd CLI 실패 테스트 (TDD Red)

### 2-1. 테스트 작성
- [x] `test/sh/test-gd.sh` — 시나리오 5건 (version·status 최신/수정 표시·status 업그레이드 가능·upgrade 충돌 보존·VERSION 부재 복구), 전부 `--src`+`GD_RAW_BASE` 네트워크 0
- [x] `pnpm test:sh` 실행 → test-gd 5건 Fail 확인 (bin/gd 미존재), test-get 기존 4건 PASS 유지
- [x] Commit: `test(spec-02-03): add failing shell tests for gd status·upgrade·version`

---

## Task 3: bin/gd + install.sh --update 구현 (TDD Green)

### 3-1. 구현
- [x] `bin/gd` (version·status·upgrade, semver 비교, `.gd/cache` TTL 1h, manifest 대조), `install.sh` `--update` 충돌 정책 (`<file>.new` + 경고, fresh 경로 불변)
- [x] `pnpm test:sh` → 9건(4+5) 전체 PASS / `pnpm test` 67 회귀 PASS
- [x] Commit: `feat(spec-02-03): gd 소비자 CLI + install.sh --update 충돌 정책`
- [x] (수정) install.sh place_file `local` 한 줄 내 self-참조 → unbound 버그 분리 (bash 3.2)

---

## Task 4: Ship (필수)

> 모든 작업 task 완료 후 `/hk-ship` 절차를 따릅니다.

### 🚦 Pre-Push Quality Gate (push 전 필수)

- [x] **코드 품질 점검**: `pnpm typecheck` → PASS
- [x] **전체 테스트 실행**: `pnpm test` 67/67 + `pnpm test:sh` 9건 → 모두 PASS

### 📝 산출물 작성

- [x] **walkthrough.md 작성** (증거 로그)
- [x] **pr_description.md 작성** (템플릿 준수)
- [x] **Ship Commit**: `docs(spec-02-03): ship walkthrough and pr description`

### 🚀 Push & PR

- [ ] **Push**: `git push -u origin spec-02-03-gd-consumer-cli`
- [ ] **PR 생성**: base = `phase-02-distribution`
- [ ] **사용자 알림**: 푸시 완료 + PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 4 |
| **예상 commit 수** | 4 |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-06-10 |
