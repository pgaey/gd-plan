# Code Review: spec-01-05-prd-critique

## 요약
- 전체 평가: **Comment** (병합 가능, 단 Major 2건 보강 권장)
- Critical: 0 / Major: 2 / Minor: 5

전반적으로 spec 요구사항 충실도가 높다. FR1-8·NFR1-5·§A-H 가 `gd-plan-critique.md` 에 거의 빠짐없이 매핑됐고, critique.md(사전 비평)가 요구한 5개 보강(severity 루브릭·L2 grounding·정직한 폴백·"분리≠모델분리"·stateless soft-gate)이 모두 반영됐다. Out-of-Scope(디자인층·하드BLOCK·시장렌즈·일반staleness)도 새어들지 않았다. 가장 큰 약점은 **테스트가 핵심 가치(critique 가 결함을 잡는가)를 실제로 검증하지 않는데 표기가 불충분**하다는 점(Major)과 **prd/critique 양쪽 version bump 규칙의 미묘한 비대칭**(Major)이다.

## 상세 리뷰

### 1. Spec 대비 구현 검증
- [충실] FR1-8 전부 반영. FR1→§2 폴백 배너, FR2→§3 3렌즈, FR3→§4 스키마+멱등, FR4→§5 severity triage, FR5→version bump, FR6→design soft-gate, FR7→start/review 위생, FR8→prd 제약슬롯. §A-H 인라인 매핑.
- [충실] critique.md 보강 4건 반영: severity 4단, L2 grounding=선언 제약, 폴백=침묵 self-review 금지, "분리≠모델분리" 정직성(Panickssery 인용), stateless soft-gate.
- [Minor] `gd-plan-critique.md:96` 종료가 "전체 진행률: 전제 검증 완료", prd 종료는 "1/5" — 진행률 어휘 혼재. 의미 모순은 아님.

### 2. 코드 품질
- [Major] **version 초기값+bump 비대칭** — `gd-plan-prd.md:75-76`("갱신됐으면 +1"), `gd-plan-critique.md:76`("반영했으면 +1, 다건=+1"), `templates/prd.md:6`("완료·반영 시 +1") 세 곳 표현이 미묘하게 다름. 특히 첫 prd 생성 시 version 이 1 인지 2 인지 불명확(템플릿 `version:1` 시작 ↔ "신설/bump" 겹침) → 첫 critique 의 `prdVersion` 대조 기준이 구현마다 갈릴 여지. 초기값 규칙 1곳 정본화 필요.
- [Minor] design soft-gate 비교가 "frontmatter prdVersion 만 읽음"임을 design.md 에 미명시(start.md 엔 있음) — 위생 일관 권장.
- [Minor] 폴백 진입 조건(Agent tool 실패 감지법) 운영적으로 미정 — 임의 폴백 남용 여지(불변식은 배너로 보호).
- [충실] Dead code/네이밍/설치기 무영향. `installPlans` 9개 고정.

### 3. 테스트 커버리지
- [Major] **"가치-recall" 테스트가 critique 를 실행하지 않음 — 검증하는 척 위험** — `skills.test.ts:186-211` 는 (1)fixture 존재 (2)expected.json 형식 (3)fixture 가 결함 문자열 담는지만 봄. recall(critique 가 must-catch 잡는가)은 LLM 비결정성상 CI 불가 → 수동 eval 이 올바른 한계. 그러나 이 한계가 describe 명("가치-recall")·코드에 정직히 표기 안 됨. NFR3 의 "스키마 통과만으론 무검증" 경고가 테스트 네이밍에서 역설적 재발.
- [Minor] 정규식 단언 일부 느슨 — `:165` `/근거/` 는 일반어라 거짓 통과 여지. `/L2.*L1.*L3/` tie-break·version bump 매칭은 양호.
- [충실] 엣지 커버: 빈 prd 멈춤·TODO 경고·stale stateless 정의됨. 신규 스킬·템플릿·통합표면·fixture 모두 최소 1 테스트. 59 PASS.

## 권고사항
1. **(Major)** version 초기값+bump 규칙 정본화: "신규=`version:1`, 이후 prd 갱신·critique 반영마다 +1(한 세션 다건=+1)".
2. **(Major)** golden fixture describe 명을 "자산 고정(수동 eval 입력)"으로 변경 + fixture 에 "CI 는 형식만, recall 은 수동 eval" 한 줄.
3. **(Minor)** `skills.test.ts:165` L2 grounding 단언을 `/1차 ground|선언된 제약/` 로 좁힘.
4. **(Minor)** `gd-plan-design.md:22` 에 "frontmatter prdVersion 만 읽음" 단서 추가(start 와 일관).
5. **(Minor)** 진행률 어휘("1/5" vs "전제 검증 완료") 통일 또는 critique=검증단계 명시.
6. **(Minor)** 폴백 진입 조건(디스패치 실패 감지) 한 줄 보강.
