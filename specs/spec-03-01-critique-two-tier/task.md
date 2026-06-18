# Task List: spec-03-01

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.
> 본 spec 은 스킬(마크다운 프롬프트) 변경 — 자동 단위 테스트는 spec-03-03 소관. 여기선 설치 전파 grep + 수동 검증.

---

## Task 1: 브랜치 생성 + phase/spec 기획 산출물 커밋

### 1-1. 브랜치 생성
- [x] `git checkout -b spec-03-01-critique-two-tier`

### 1-2. 기획 산출물 커밋
- [x] `backlog/phase-03.md` + `backlog/queue.md` + `specs/spec-03-01-critique-two-tier/{spec,task,critique}.md` 커밋
- [x] Commit: `docs(spec-03-01): add phase-03 plan and spec/task`

---

## Task 2: critique 2티어화 (gd-plan-critique.md 재작성)

### 2-1. 도입부 + §2 + §4 + §5 재작성
- [x] 도입부: self-bias 주석에 2티어 교차모델 완화(위계·둘다opus 잔존) + 모델 전환 가능 한 줄 + frontmatter description 갱신
- [x] §2: 단일 디스패치 → worker(sonnet)+director(opus) 2티어. director **2-페이즈 강제**(페이즈1 독립 commit → 페이즈2 병합). 병합 규약(매칭 키 prd:줄+렌즈 / 갭 표면화 / severity 재정 근거 강제 / director 직접 재검증 후 무근거 drop). 폴백 2→1(⚠️1차본 배너)→self-review. 대안 A(병렬 blind 3-디스패치) opt-in 단락
- [x] §4 스키마 확장: provenance(director단독/worker단독/공통) + director 단독발견 블록 + frontmatter prdVersion/modelTiers + severity 재정 근거
- [x] §5: 메인이 받는 것은 *병합된* `_critique.md` 임을 명시 + "메인은 비평·검증·병합 직접 수행 안 함" 불변식. triage/반영/version bump 유지
- [x] Commit: `refactor(spec-03-01): rewrite critique dispatch as worker→director two-tier`

---

## Task 3: 샌드박스 재설치 + 전파 검증

### 3-1. 재설치 후 grep 검증
- [x] `bash get.sh --yes --src "$PWD" <sandbox>` 재설치
- [x] 설치본 `.claude/commands/gd-plan-critique.md` 전파 확인: 2-페이즈/worker=sonnet/director=opus/provenance/1차본 배너/대안 A/메인 비평금지 불변식 모두 ✓
- [x] `bash test/sh/run.sh` → 기존 회귀 3 suites PASS
- [x] Commit: `test(spec-03-01): verify two-tier dispatch propagates to install`

---

## Task 4: Ship (필수)

### 🚦 Pre-Push Quality Gate
- [x] **전체 테스트 실행** → 모두 PASS (`bash test/sh/run.sh` — 3 suites)

### 📝 산출물 작성
- [x] **walkthrough.md 작성**
- [x] **pr_description.md 작성**
- [x] Commit: `docs(spec-03-01): ship walkthrough and pr description`

### 🚀 Push & PR
- [ ] `git push -u origin spec-03-01-critique-two-tier`
- [ ] PR 생성 (`/hk-pr-gh`)
