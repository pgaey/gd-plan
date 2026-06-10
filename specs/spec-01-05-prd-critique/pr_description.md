# feat(spec-01-05): PRD 전제 critique (의미 정합 적대 검증) + 제약/규제 prevention

## 📋 Summary

### 배경 및 목적
gd-plan 의 검증 레이어는 `/gd-plan-review`(구조 정합 lint) 하나뿐이었다. review 는 `role→capability→page→flow` **연결**만 보므로, 한 에이전트가 저작한 **정합적이지만 틀린** PRD(루프 미완결·규제 누락·측정불가)를 그대로 통과시킨다. 별도 워크스페이스의 치과 dry-run 적대 critique 가 review 통과 문서셋에서 4개 결함을 실증했다.

→ review 앞에 **`/gd-plan-critique`** 를 둔다: PRD 전제를 **저작자와 분리된 독립 Opus 서브에이전트**가 적대적으로 비판한다. 동시에 PRD 인터뷰에 **제약/규제 슬롯**을 추가해 같은 결함을 prevention 으로 줄인다. **북극성: 구조적 완성 ≠ 의미적 정합.**

### 주요 변경 사항
- [x] 신규 `/gd-plan-critique` 스킬 — 독립 컨텍스트 강제 + 정직한 폴백(침묵 self-review 금지)
- [x] 3 렌즈(L1 트랜잭션완결·L2 도메인규제·L3 검증가능사실) + tie-break + severity 4단
- [x] `_critique.md` 보고서(보고서만) → 사람 severity순 채택 → prd 반영 + `version` bump + decisions 기록
- [x] prd `version` frontmatter + `## 제약/규제` 섹션(Capabilities 앞) + 인터뷰 Q10 제약 슬롯
- [x] 통합: design soft-gate(stale 매진입 경고) · start critique 상태 · review/start `_critique` 무시
- [x] 가치-recall golden fixture(치과 4결함) + 기대 발견 — 수동 eval 입력
- [x] dogfood(`/hk-spec-critique` 13건) + 독립 코드리뷰(Major 2건) 반영

### Phase 컨텍스트
- **Phase**: `phase-01` (gd-plan 세로 슬라이스)
- **본 SPEC 의 역할**: 기획 산출에 **의미 정합 검증축**을 추가 — 구조축(review)에 이어 "정합적이지만 틀린" 통과를 막는 2층 검증 완성.

## 🎯 Key Review Points

1. **독립성 강제 vs 가용성**: 서브에이전트 강제하되 못 띄우면 멈춤 대신 정직한 폴백(배너+체크리스트). 침묵 self-review 절대 금지(NFR4 불변식).
2. **L2 grounding**: 규제 판정을 LLM 기억이 아니라 **선언된 제약슬롯**(prevention)에 묶음 — prevention↔detection 결합.
3. **정직성**: "분리=컨텍스트 분리이지 모델 분리 아님" 명시(NFR5). 가치-recall 테스트가 형식만 검증함을 정직히 표기(NFR3).
4. **stateless soft-gate**: `prd.version` vs `_critique.prdVersion` 읽을때 비교 — "1회 경고" 영속플래그 모순 회피.

## 🧪 Verification

### 자동 테스트
```bash
pnpm test && pnpm typecheck && pnpm build
```
**결과 요약**: ✅ 59 tests passed (5 files) · typecheck OK · build OK · build-index OK

### 수동 검증 시나리오
1. **가치-recall**: golden fixture → critique must-catch 4건 → 수동/오프라인 eval(CI 아님, 명문화)
2. **독립 코드리뷰**: `/hk-code-review` → Comment(Critical 0) → Major 2 반영

## 📦 Files Changed

### 🆕 New Files
- `plans/gd-plan-critique.md`: critique 스킬(독립 서브에이전트·3렌즈·severity·폴백)
- `__tests__/fixtures/golden-prd-dental.md` · `golden-prd-dental.expected.json`: 가치-recall 자산

### 🛠 Modified Files
- `templates/prd.md` (+): `version` frontmatter + `## 제약/규제` 섹션
- `plans/gd-plan-prd.md` (+): Q10 제약 슬롯 + version bump + critique 지목
- `plans/gd-plan-design.md` · `gd-plan-start.md` · `gd-plan-review.md` (+): soft-gate · 상태 · `_critique` 위생
- `__tests__/skills.test.ts` · `templates-v2.test.ts` · `integration.test.ts` (+): 스키마·통합·fixture 검증
- `README.md` (+): `/gd-plan-critique` + 검증 2층 + stale 정정

## ✅ Definition of Done
- [x] 모든 단위 테스트 통과 (59)
- [x] (Integration Test Required = no) 해당 없음
- [x] `walkthrough.md` ship commit 완료
- [x] `pr_description.md` ship commit 완료
- [x] lint(eslint 미설치 skip) / type check 통과
- [x] 사용자 검토 요청 알림 완료

## 🔗 관련 자료
- Walkthrough: `specs/spec-01-05-prd-critique/walkthrough.md`
- 사전 비평: `specs/spec-01-05-prd-critique/critique.md` · 코드리뷰: `code-review.md`
- ADR 후보(머지 시): `critique-vs-review-separation` · `author-verifier-separation` · `prd-version-derived-staleness`
