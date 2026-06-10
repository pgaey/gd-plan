# Task List: spec-13-01 (gd-plan 패키지 코어)

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit). TDD task 는 test(red)+impl(green) 2 commit.
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성 (spec-13-01-gd-plan-package — sdd 채택)
- [x] spec.md 작성 (직전 세션, critique 완료)
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] 백로그 업데이트 (phase-13.md SPEC 표 — sdd 자동)
- [ ] 사용자 Plan Accept

---

## Task 1: gd-plan 패키지 스캐폴드 (TDD)

### 1-1. 브랜치 생성
- [x] `git checkout -b spec-13-01-gd-plan-package` (이주 시 생성됨)
- [x] Commit: 없음 (브랜치 생성만)

### 1-2. 테스트 작성 (TDD Red)
- [x] `packages/gd-plan/__tests__/cli.test.ts` — installPlans() 설치 메커니즘 검증 (fixture 기반, 실제 7스킬 검증은 Task 11)
- [x] 실행 → Fail (`4517209`)
- [x] Commit: `test(spec-13-01): add gd-plan package smoke test`

### 1-3. 구현 (TDD Green)
- [x] `packages/gd-plan/{package.json,tsup.config.ts,vitest.config.ts,src/cli.ts}` (gd-skills 미러)
- [x] `pnpm --filter @gen-design/plan test` → Pass (4/4)
- [x] Commit: `feat(spec-13-01): scaffold @gen-design/plan package` (`aef0329`)

---

## Task 2: 템플릿 + 섹션 어휘 (docs)

- [x] `packages/gd-plan/templates/{prd,structure,ui-rules}.md` + `templates/flows/_name.md` (design.md 은 collection 픽 — 템플릿 없음)
- [x] `packages/gd-plan/templates/section-taxonomy.md` (structure 가 쓰는 섹션 어휘)
- [x] `drafts/*.template.md` 기준 작성 (roles/access · 섹션 스택 · ui-rules 재정의 반영)
- [x] Commit: `feat(spec-13-01): add planning doc templates + section taxonomy` (`d8386fb`)

---

## Task 3: design-md-collection 인덱스 빌더 (TDD)

### 3-1. 테스트 (Red)
- [x] `packages/gd-plan/__tests__/build-index.test.ts` — entry/schema(domain/tone/color/typo/density) + 결정성 (`7c7b401`)
- [x] Commit: `test(spec-13-01): add _index.json builder test`

### 3-2. 구현 (Green)
- [x] `packages/gd-plan/src/build-index.ts` (결정적 휴리스틱) + 초기 `design-md-collection/_index.json` 66 entries 생성 (`f6bf9c7`)
- [x] Commit: `feat(spec-13-01): build design-md-collection index cache`

---

## Task 4: `gd plan refresh-index` CLI (TDD)

### 4-1. 테스트 (Red)
- [x] `packages/gd-cli/src/commands/__tests__/plan-index.test.ts` — parse + 명령 실행 → _index.json 재생성 (`941b61f`)
- [x] Commit: `test(spec-13-01): add gd plan refresh-index test`

### 4-2. 구현 (Green)
- [x] `packages/gd-cli/src/commands/plan.ts` + `cli.ts` 라우팅 (gd-plan writeIndex 재사용). 회귀 250/250 통과 (`0a88f92`)
- [x] Commit: `feat(spec-13-01): add gd plan refresh-index command`

---

## Task 5: gd-plan-start + gd-plan-prd 스킬 (docs)

- [x] `packages/gd-plan/plans/gd-plan-start.md` (진입점, idempotent, 진행률 안내)
- [x] `packages/gd-plan/plans/gd-plan-prd.md` (구조화 15문항 인터뷰 = `drafts/gd-plan-prd.interview.md`, 질문↔필드 완전커버 → docs/prd.md + project.md 동기화)
- [x] Commit: `feat(spec-13-01): add gd-plan-start and gd-plan-prd skills`

---

## Task 6: gd-plan-design 스킬 (collection-scanner) (docs)

- [x] `packages/gd-plan/plans/gd-plan-design.md` — _index.json 먼저 읽고 후보 3 좁힌 뒤 풀로드 (Sonnet 서브에이전트 명세, spec F5)
- [x] Commit: `feat(spec-13-01): add gd-plan-design skill with collection-scanner`

---

## Task 7: gd-plan-structure 스킬 (docs)

- [x] `packages/gd-plan/plans/gd-plan-structure.md` — sitemap/sticky/LNB/modal/responsive (≤600줄). layout-thinker 서브는 v2 보류.
- [x] Commit: `feat(spec-13-01): add gd-plan-structure skill`

---

## Task 8: gd-plan-flows 스킬 (docs)

- [x] `packages/gd-plan/plans/gd-plan-flows.md` — flow 별 steps 인터뷰 → docs/flows/<name>.md
- [x] Commit: `feat(spec-13-01): add gd-plan-flows skill`

---

## Task 9: gd-plan-rules 스킬 (docs)

- [x] `packages/gd-plan/plans/gd-plan-rules.md` — design.md 수치 자동 추출 + 인터뷰 보완 → docs/ui-rules.md
- [x] Commit: `feat(spec-13-01): add gd-plan-rules skill`

---

## Task 10: gd-plan-review 스킬 (하이브리드 차단 F6) (docs)

- [x] `packages/gd-plan/plans/gd-plan-review.md` — consistency-critic(Opus 권장) 체크리스트, v1: structural=BLOCK / style·vocabulary=WARN (wording·completeness=v2), `--force-continue`, `_review.md` 포맷 (≤600줄)
- [x] Commit: `feat(spec-13-01): add gd-plan-review skill with hybrid blocking`

---

## Task 11: 스킬 포맷 검증 테스트 (TDD)

- [ ] `packages/gd-plan/__tests__/skills.test.ts` — 7스킬 존재 + 출력포맷 라인 + 길이 cap(400/600) 검증
- [ ] `pnpm --filter @gen-design/plan test` → Pass
- [ ] Commit: `test(spec-13-01): validate gd-plan skill format and length caps`

---

## Task 12: `/gd-chat` 주입 (F9) — 핵심

- [ ] `packages/create-gd-react/presets-bundled/default/.claude/commands/gd-chat.md` (canonical) 편집:
  - §1 컨텍스트 로드에 docs 5종 추가 / 신규 §5.10 Sitemap 사전검증(차단) / §6·§7·§8 생성 규칙표 / §12 종료 일관성 검증
- [ ] `pnpm --filter @gen-design/skills sync-skills` → `gd-skills/skills/gd-chat.md` 전파 확인
- [ ] `pnpm -r test` 회귀 통과
- [ ] Commit: `feat(spec-13-01): inject planning docs (prd/structure/flows/ui-rules/design) into gd-chat`

---

## Task 13: create-gd-react 스캐폴드 (F7) (TDD)

### 13-1. 테스트 (Red)
- [x] `packages/create-gd-react/__tests__/scaffold-docs.test.ts` — 스캐폴드가 docs/ + gd-plan 스킬 7개 생성
- [x] Commit: `test(spec-13-01): assert scaffold creates docs/ and gd-plan skills`

### 13-2. 구현 (Green)
- [x] preset 에 `docs/{prd,design,structure,ui-rules}.md` + `docs/flows/.gitkeep` + `.claude/commands/gd-plan-*.md`(7)
- [x] `src/cli.ts`/`postprocess.ts` docs/ 보장, `README.md` 9단계 흐름
- [x] Commit: `feat(spec-13-01): scaffold docs/ folder and gd-plan skills in create-gd-react`

---

## Task 14: 버전 bump + 번들 (F8) (chore)

- [x] `create-gd-react` 0.2.2→0.3.0, `gd-skills` 0.2.2→0.3.0, `@gen-design/plan` 0.1.0
- [x] gd-skills `sync-skills` 글롭이 gd-plan-*.md 포함 확인
- [x] Commit: `chore(spec-13-01): bump to 0.3.0 and bundle gd-plan skills`

---

## Task 15: 문서 (F10) (docs)

- [x] `README.md`(TL;DR gd-plan 흐름) + `docs/handbook.md`(상·하류 도식 ASCII) + `docs/vision.md`(picker 차별점)
- [x] Commit: `docs(spec-13-01): document upstream planning layer`

---

## Task 16: ADR 5개 (F10) (docs)

- [x] `docs/decisions/ADR-13-01-{A,B,C,D,E}.md` — A=레이어별 SSOT(invariant) / B=design.md picker(decision) / C=review 차단(tradeoff) / D=structure 섹션스택(convention) / E=role+접근모델(decision)
- [x] Commit: `docs(spec-13-01): add ADR-13-01-A..E`

---

## Task 17: 통합 시나리오 검증 (Integration Test Required = yes)

- [x] 시나리오 1/2/3 자동화 부분 `integration.test.ts` 4 케이스 PASS. 대화 완주는 walkthrough 수동검증 절차 기재 (`91cf109`)
- [x] 증거를 walkthrough.md 에 첨부
- [x] Commit: `test(spec-13-01): integration scenarios 1-3 evidence`

---

## Task N: Ship (필수)

- [x] typecheck — gd-plan 코드 에러 0 (`eb957c5`). studio 선재 에러 63건 범위 외 (walkthrough findings)
- [x] 테스트 PASS — plan 22 + cli 250 + create 28 = 300 (패키지별). gd-skills 테스트 파일 부재는 선재
- [x] 통합 시나리오 1/2/3 자동화 부분 → PASS (증거 walkthrough)
- [x] **walkthrough.md 작성**
- [x] **pr_description.md 작성**
- [x] **Ship Commit**: `docs(spec-13-01): ship walkthrough and pr description`
- [x] **Push**: `git push origin spec-13-01-gd-plan-package` (08835d7)
- [x] **PR 생성**: https://github.com/pgaey/gen-design/pull/1
- [x] **사용자 알림**: PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 17 (+ Ship) |
| **예상 commit 수** | ~24 |
| **현재 단계** | Planning (Plan Accept 대기) |
| **마지막 업데이트** | 2026-05-29 |
| **규모 주의** | critique 로 v1 범위 축소(4·5-8·12→v2, ADR 6→3). 단일 PR 유지 |
