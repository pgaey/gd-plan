# Task List: spec-01-04

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit). TDD task 는 Red(test) / Green(impl) 2 commit.
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] 백로그 업데이트 (phase-01.md SPEC 표 — sdd 자동 갱신)
- [ ] 사용자 Plan Accept

---

## Task 1: 브랜치 생성

### 1-1. 브랜치 생성
- [x] `git checkout -b spec-01-04-flows-autoref-review` (phase base 에서 분기)
- [x] Commit: 없음 (브랜치 생성만) — 계획 산출물은 `d82f502` 로 커밋

---

## Task 2: flows 자동 역참조 + 신모델 참조 (FR1, FR2)

### 2-1. 테스트 작성 (TDD Red)
- [x] `__tests__/skills.test.ts` 에 assert 추가: `gd-plan-flows` 가 `docs/structure.md` 미포함 + `sitemap.md`/`pages/` 포함 + **full re-derive** 지시문(`flows:` + 재계산/덮어쓰기/정렬 + `ADR-012`) 포함. `templates/flows/_name.md` 의 "structure.md sitemap" 미포함. `templates/pages/structure.md` 가 "ADR-009" 미포함 + "ADR-012" 포함(주석 정정).
- [x] `pnpm test` → Fail 확인 (5 fail / 32 pass)
- [x] Commit: `test(spec-01-04): add failing tests for flows full re-derive + 신모델 참조` (`fe8b1ea`)

### 2-2. 구현 (TDD Green)
- [x] `plans/gd-plan-flows.md` §1 로딩 신모델화 + **full re-derive 단계(§5)** 추가(전수 스캔 재계산 덮어쓰기, ID 사전순 정렬, FLOW slug ADR-009 정규화, SoT=flow steps, ADR-012 참조) + "structure.md sitemap"→"sitemap.md".
- [x] `templates/flows/_name.md` Steps 규칙 "structure.md sitemap"→"sitemap.md 로스터".
- [x] `templates/pages/structure.md` line 5 주석 "(→ ADR-009 예정)"→"(→ ADR-012)".
- [x] `pnpm test` → Pass 확인 (37/37)
- [x] Commit: `feat(spec-01-04): flows full re-derive 역참조 + 신모델 참조 + 주석 정정 (Green)`

---

## Task 3: review frontmatter ID 체인 + 연결 열 set-diff (FR2, FR4, FR5)

### 3-1. 테스트 작성 (TDD Red)
- [x] `skills.test.ts` 에 assert 추가: `gd-plan-review` 가 `docs/structure.md` 미포함 + `sitemap.md`/`pages/` 포함 + frontmatter ID(`covers`/`flows`/`parent`) + 결정 로그 `decisions.md`+`연결` 소비 지시문 포함.
- [x] `pnpm test` → Fail 확인 (4 fail)
- [x] Commit: `test(spec-01-04): add failing tests for review 신모델 + ID 체인 소비` (`6062913`)

### 3-2. 구현 (TDD Green)
- [x] `plans/gd-plan-review.md` §1 로딩 신모델화(sitemap+pages frontmatter+decisions) + §2 ID 체인 추적 + structural 체크 2건(flows drift / 결정 연결 누수) 추가 + §3 예시 정합. 누수 점검 출력=정렬 ID 리스트+근거 인용, "무결성 점검"(결정적 set-diff 아님) 표기. 89줄 < 600 cap.
- [x] `pnpm test` → Pass 확인 (41/41)
- [x] Commit: `feat(spec-01-04): review 신모델 로딩 + frontmatter ID 체인·연결 열 무결성 점검 (Green)`

---

## Task 4: design·rules stale 참조 정상화 (FR2, FR3)

### 4-1. 테스트 작성 (TDD Red)
- [x] `skills.test.ts` 에 assert 추가: `gd-plan-design` 이 "다음 단계: /gd-plan-sitemap" 포함 + "/gd-plan-structure" 미포함. `gd-plan-rules` 가 `docs/structure.md` 미포함 + `pages/` 포함.
- [x] `pnpm test` → Fail 확인 (2 fail)
- [x] Commit: `test(spec-01-04): add failing tests for design/rules stale 참조` (`7cefb25`)

### 4-2. 구현 (TDD Green)
- [x] `plans/gd-plan-design.md` 종료 출력 "/gd-plan-structure"→"/gd-plan-sitemap".
- [x] `plans/gd-plan-rules.md` §1 `docs/structure.md`→`docs/pages/[PAGE]/structure.md`.
- [x] `pnpm test` → Pass 확인 (43/43)
- [x] Commit: `fix(spec-01-04): design 다음단계 복구 + rules 신모델 참조 (Green)`

---

## Task 5: ADR-012 flows-reverse-derivation 작성

### 5-1. ADR 작성 (docs)
- [ ] `.harness-kit/agent/templates/adr.md` 읽고 따라 `docs/decisions/ADR-012-flows-reverse-derivation.md` 작성 (type: invariant). 본문에 **ADR-010 관계 명문화**(두 번째 인스턴스 + `flows` 필드 SoT 예외, critique #2). 백틱 경로는 실제 존재 파일만 — 개념/플레이스홀더 경로는 백틱-확장자 표기 회피(drift 휴리스틱 오탐 방지).
- [ ] `pnpm test` → 회귀 PASS 확인
- [ ] Commit: `docs(spec-01-04): ADR-012 flows-reverse-derivation (invariant)`

---

## Task 6: Ship (필수)

### 🚦 Pre-Push Quality Gate (push 전 필수)
- [ ] `pnpm typecheck` → 0 error
- [ ] `pnpm test` → 모두 PASS
- [ ] `grep -rn "docs/structure.md\|/gd-plan-structure" plans/ templates/` → 0건 확인

### 📝 산출물 작성
- [ ] **walkthrough.md 작성** (증거 로그)
- [ ] **pr_description.md 작성** (템플릿 준수)
- [ ] **Ship Commit**: `docs(spec-01-04): ship walkthrough and pr description`

### 🚀 Push & PR
- [ ] **Push**: `git push -u origin spec-01-04-flows-autoref-review`
- [ ] **PR 생성**: `gh pr create` (base = `phase-01-gd-plan-vertical-slice`)
- [ ] **사용자 알림**: 푸시 완료 + PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 6 (작업 5 + Ship) |
| **예상 commit 수** | 9 (Task2~4 각 Red+Green=6, Task5 1, Ship 2) |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-06-06 |
