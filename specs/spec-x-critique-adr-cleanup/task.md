# Task List: spec-x-critique-adr-cleanup

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.
> 본 spec 은 docs 전용 — 자동 테스트 없음. 검증은 sdd status + 파일 존재 확인.

---

## Task 1: 브랜치 생성 + 기획 산출물 커밋

### 1-1. 브랜치 생성
- [x] `git checkout -b spec-x-critique-adr-cleanup`

### 1-2. 기획 산출물 커밋
- [x] `backlog/queue.md`(specx active) + `specs/spec-x-critique-adr-cleanup/{spec,task}.md` 커밋
- [x] Commit: `docs(spec-x-critique-adr-cleanup): add spec and task`

---

## Task 2: ADR-017 작성 (critique 2티어, ADR-014 연장)

### 2-1. ADR 작성
- [x] `docs/decisions/ADR-017-critique-two-tier-dispatch.md` 작성 — type decision / status accepted / Context(014 의 단일 독립컨텍스트 한계) / Decision(worker→director 2티어 + 2-페이즈 + 교차모델 + 병합 규약) / Consequences / Alternatives(A·B채택·C) / Related(ADR-013, ADR-014 연장)
- [x] `bash .harness-kit/bin/sdd status` → 신규 stale ADR 없음(9건 불변)
- [x] Commit: `docs(spec-x-critique-adr-cleanup): add ADR-017 critique two-tier dispatch`

---

## Task 3: superpowers 잔재 제거

### 3-1. 문서 삭제
- [x] `git rm docs/superpowers/specs/2026-06-18-gd-plan-auto-advance-design.md` + 빈 `docs/superpowers/` 정리
- [x] Commit: `chore(spec-x-critique-adr-cleanup): remove out-of-convention superpowers design doc`

---

## Task 4: Ship (필수)

### 🚦 Pre-Push Quality Gate
- [ ] `bash test/sh/run.sh` → 전체 PASS (회귀 무영향 확인)

### 📝 산출물 작성
- [ ] **walkthrough.md 작성**
- [ ] **pr_description.md 작성**
- [ ] Commit: `docs(spec-x-critique-adr-cleanup): ship walkthrough and pr description`

### 🚀 Push & PR
- [ ] `git push -u origin spec-x-critique-adr-cleanup`
- [ ] PR 생성 (`/hk-pr-gh`)
