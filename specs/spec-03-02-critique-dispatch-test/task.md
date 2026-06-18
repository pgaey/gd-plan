# Task List: spec-03-02

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.

---

## Task 1: 브랜치 생성 + phase 정리/기획 산출물 커밋

### 1-1. 브랜치 생성
- [x] `git checkout -b spec-03-02-critique-dispatch-test`

### 1-2. phase 정리 + 기획 산출물 커밋
- [x] `backlog/phase-03.md`(review drop·구조테스트 spec-3-02 정리) + `backlog/queue.md`(Icebox) + `specs/spec-03-02-critique-dispatch-test/{spec,task}.md` 커밋
- [x] Commit: `docs(spec-03-02): drop review spec to icebox, add dispatch-test spec`

---

## Task 2: 구조 테스트 작성 + 가드 검증

### 2-1. 테스트 작성
- [ ] `test/sh/test-critique-dispatch.sh` 작성: 7개 불변식(worker=sonnet/director=opus/2-페이즈/provenance/메인 비평금지/보고서만/1차본 배너) grep 검증
- [ ] `bash test/sh/test-critique-dispatch.sh` → PASS (spec-03-01 구현 보유)
- [ ] `bash test/sh/run.sh` → 전체 PASS
- [ ] Commit: `test(spec-03-02): add critique two-tier dispatch invariant guard`

### 2-2. 가드 작동 증명 (임시 삭제 → FAIL → 복구)
- [ ] critique.md 불변식 한 줄 임시 삭제 → 테스트 FAIL 확인 → 복구 (커밋 없음, 검증만)

---

## Task 3: Ship (필수)

### 🚦 Pre-Push Quality Gate
- [ ] **전체 테스트 실행** → 모두 PASS (`bash test/sh/run.sh`)

### 📝 산출물 작성
- [ ] **walkthrough.md 작성**
- [ ] **pr_description.md 작성**
- [ ] Commit: `docs(spec-03-02): ship walkthrough and pr description`

### 🚀 Push & PR
- [ ] `git push -u origin spec-03-02-critique-dispatch-test`
- [ ] PR 생성 (`/hk-pr-gh`)
