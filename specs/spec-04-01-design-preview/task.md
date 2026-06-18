# Task List: spec-04-01

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.

---

## Task 1: 브랜치 생성 + phase/기획 산출물 커밋

### 1-1. 브랜치 생성
- [x] `git checkout -b spec-04-01-design-preview`

### 1-2. 기획 산출물 커밋
- [x] `backlog/phase-04.md` + `backlog/queue.md` + `specs/spec-04-01-design-preview/{spec,task,critique}.md` 커밋
- [x] Commit: `docs(spec-04-01): add phase-04 plan and spec/task`

---

## Task 2: build-swatches 단위 테스트 (TDD Red)

### 2-1. 테스트 작성
- [x] `__tests__/build-swatches.test.ts`(vitest, `__tests__/**` 컨벤션): §9 Quick Color Reference 팔레트 파싱 / 부분 렌더(hex 미발견 시 칩 생략) / 안전(HTML 이스케이프) / 폰트명 라벨 출력
- [x] `pnpm test` → Fail 확인 (build-swatches 미구현, 나머지 67 PASS)
- [x] Commit: `test(spec-04-01): add build-swatches unit tests (red)`

---

## Task 3: build-swatches 구현 + fragment 생성 (TDD Green)

### 3-1. 구현
- [x] `src/build-swatches.ts`: .md → `_swatches/<name>.html` fragment(팔레트 칩 + 폰트명 라벨 specimen + 버튼[radius·shadow·CTA]). 부분 렌더·안전 규약 반영
- [x] `package.json`: `build-swatches` 스크립트 + `files` 에 `_swatches` 포함
- [x] `pnpm test` → PASS (76)
- [x] `pnpm build-swatches` → 66개 생성
- [x] Commit: `feat(spec-04-01): build-swatches generates 66 mood-swatch fragments`

---

## Task 4: design 스킬 결합 규약 + 구조 가드

### 4-1. 스킬 + 테스트
- [x] `plans/gd-plan-design.md` §2.4: top-3 `_swatches` fragment 읽어 `docs/_design-preview.html` 결합(grid·정직 배너·수동 열람·git 권고) + §5 멱등
- [x] `test/sh/test-design-preview.sh`: 결합 규약 불변식 grep(`_swatches`/`_design-preview.html`/정직 배너/grid)
- [x] `bash test/sh/run.sh` → PASS (5 suites)
- [x] Commit: `feat(spec-04-01): assemble preview from swatch fragments in design step`

---

## Task 5: ADR-019

### 5-1. ADR 작성
- [x] `docs/decisions/ADR-019-design-preview-build-time.md`(type tradeoff): 빌드타임 fragment vs 런타임 LLM, node-free, 결정성/공정성↔단순성. Related: ADR-002, ADR-016(self-contained distribution)
- [x] sdd status → 신규 stale ADR 없음
- [x] Commit: `docs(spec-04-01): add ADR-019 design preview build-time`

---

## Task 6: 샌드박스 재설치 + 샘플 + 결정성 검증

### 6-1. E2E
- [ ] `bash get.sh --yes --src "$PWD" <sandbox>` 재설치 → `_swatches/` 동봉 + 스킬 전파 grep
- [ ] 후보 3개 결합 프리뷰 1회 생성 → 시스템별 팔레트·radius·shadow 차이 + 동일 후보 재생성 동일 출력(결정성) 확인
- [ ] Commit: `test(spec-04-01): verify swatch distribution and deterministic assembly`

---

## Task 7: Ship (필수)

### 🚦 Pre-Push Quality Gate
- [ ] `pnpm test` + `bash test/sh/run.sh` → 모두 PASS

### 📝 산출물 작성
- [ ] **walkthrough.md 작성**
- [ ] **pr_description.md 작성**
- [ ] Commit: `docs(spec-04-01): ship walkthrough and pr description`

### 🚀 Push & PR
- [ ] `git push -u origin spec-04-01-design-preview`
- [ ] PR 생성 (`/hk-pr-gh`)
