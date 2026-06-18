# Task List: spec-x-gd-plan-auto-advance

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.

---

## Task 1: 부트스트랩 — install 부산물 커밋 + 브랜치 생성

### 1-1. harness-kit 설치 부산물 커밋 (main)
- [x] `git add` 설치 부산물 (`.claude/settings.json` + 명령 3개 — `.harness-kit`는 이미 추적됨)
- [x] Commit: `chore: install harness-kit 0.18.0` (main, ccb6293)

### 1-2. 브랜치 생성
- [x] `git checkout -b spec-x-gd-plan-auto-advance`

---

## Task 2: 구조 테스트 작성 (TDD Red)

### 2-1. 테스트 작성
- [x] `test/sh/test-auto-advance.sh` 작성: 9개 `plans/gd-plan-*.md`가 `<!-- gd:advance next=... -->` 마커를 정확히 1개씩 보유 + 전이표 기대값 일치(start=auto, prd=critique, critique=design, design=sitemap, sitemap=page, page=loop, flows=rules, rules=review, review=gate)
- [x] `test/sh/run.sh`에 연결 (`test-*.sh` glob 자동 수집 — run.sh 수정 불필요)
- [x] 테스트 실행 → Fail 확인 (9개 모두 마커 0개)
- [x] Commit: `test(spec-x-gd-plan-auto-advance): add auto-advance marker structural test`

---

## Task 3: 선형 단계 §종료 보강 (critique·design·flows)

### 3-1. 표준 confirm-then-advance 적용
- [x] `plans/gd-plan-critique.md` (next=design), `plans/gd-plan-design.md` (next=sitemap), `plans/gd-plan-flows.md` (next=rules) §종료 재작성 + 마커
- [x] Commit: `refactor(spec-x-gd-plan-auto-advance): add confirm-then-advance to linear steps`

---

## Task 4: 특수 전이 §종료 보강 (start·prd·sitemap·page·rules·review)

### 4-1. soft/loop/gate 전이 적용
- [x] `plans/gd-plan-start.md` (진입 확인, next=auto), `plans/gd-plan-prd.md` (next=critique, 예/아니오+design 안내), `plans/gd-plan-sitemap.md` (next=page, 첫 slug 진입), `plans/gd-plan-page.md` (next=loop), `plans/gd-plan-rules.md` (next=review), `plans/gd-plan-review.md` (next=gate, 자동 진행 금지)
- [x] Commit: `refactor(spec-x-gd-plan-auto-advance): add branch/loop/gate transitions to special steps`

---

## Task 5: 테스트 Green + 샌드박스 검증

### 5-1. 구조 테스트 통과
- [x] `bash test/sh/test-auto-advance.sh` → PASS (9개 마커 일치)
- [x] `bash test/sh/run.sh` → 전체 PASS (3 suites)

### 5-2. 샌드박스 재설치 수동 검증
- [x] `bash get.sh --yes --src "$PWD" <sandbox>` 재설치 → 설치본 9개 모두 `gd:advance` 마커 전파
- [x] prd 예/아니오 분기·review 게이트 텍스트 설치본 grep 확인 (대화형 "응→자동실행"은 별도 세션 필요 — 구조/텍스트 수준 검증)
- [x] Commit: `test(spec-x-gd-plan-auto-advance): verify auto-advance markers and sandbox walkthrough`

---

## Task 6: Ship (필수)

### 🚦 Pre-Push Quality Gate
- [ ] **전체 테스트 실행** → 모두 PASS (`bash test/sh/run.sh`)

### 📝 산출물 작성
- [ ] **walkthrough.md 작성**
- [ ] **pr_description.md 작성**
- [ ] Commit: `docs(spec-x-gd-plan-auto-advance): ship walkthrough and pr description`

### 🚀 Push & PR
- [ ] `git push -u origin spec-x-gd-plan-auto-advance`
- [ ] PR 생성 (`/hk-pr-gh`)
