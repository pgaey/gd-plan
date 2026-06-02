# Walkthrough: spec-13-01

> gd-plan 상류 기획 레이어 — 신규 패키지 `@gen-design/plan` + 7 스킬 + 5종 문서 템플릿 + `/gd-chat` 주입(F9) + create-gd-react 스캐폴드.

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| Task 1 smoke 테스트 결합도 | 실제 7스킬 검증 / 설치 메커니즘만 | 메커니즘만 (fixture) | 스킬 본문은 Task 5-10 소관. Task 1 은 installPlans() 만 검증해야 TDD 정합 |
| build-index 추출 방식 | LLM 추출 / 결정적 휴리스틱 | 결정적 휴리스틱 | 같은 입력→같은 출력 (테스트 안정성 + 회귀). critique 도 "키워드 산문 인라인" 확인 |
| gd plan refresh-index 결합 | 빌드 산출 import / 소스 import | 소스 import (`../../../gd-plan/src/build-index`) | 개인 monorepo, publish 안 함. 빌드 의존 없이 테스트 안정 |
| ADR 번호 체계 | spec 의 `ADR-13-01-A..E` / 기존 일련번호 | 011~015 | 기존 ADR 가 010 까지 `ADR-NNN` 패턴. constitution §6.3 형식 준수 |
| Task 17 통합 검증 범위 | 인터뷰 완주 자동화 / 인프라만 자동 + 대화 수동 | 인프라만 자동 | 스킬=LLM 대화 가이드라 완주는 자동화 불가. plan.md 도 "반자동" 명시 |
| design.md 템플릿 | 빈 템플릿 둠 / 안 둠 | 안 둠 (4+1) | collection 픽킹이라 사람 미작성 (ADR-012). 빈 design.md 두면 혼선 |

### ADR 승격 가이드

- [x] ADR 승격 대상 있음 → 작성됨: `docs/decisions/ADR-011..015`
  - ADR-011 레이어별 SSOT (invariant) / ADR-012 design.md picker (decision) / ADR-013 review 차단 (tradeoff) / ADR-014 structure 섹션스택 (convention) / ADR-015 role+접근모델 (decision)
  - spec 의 A~E ↔ 파일 011~015 매핑.

## 💬 사용자 협의

- **주제**: repo 이동 (Changsik00 공유 → pgaey 개인 private)
  - **사용자 의견**: "개인 프로젝트로 가져가고 싶다. 올리면 공유되잖아."
  - **합의**: 베이스라인 main(정리분 8커밋)만 새 private repo 에 push, Changsik00 remote 완전 제거. gd-plan 작업물은 spec 브랜치로 커밋 후 push.
- **주제**: 패키지 publish 여부
  - **사용자 의견**: "개인에서만 쓸거라 publish 안 할거고"
  - **합의**: `@gen-design/plan` 은 `private: true`. 버전(0.3.0)은 정합성 위해 bump 하되 npm publish 안 함.
- **주제**: 패키지 범위
  - **합의**: 상류 기획층(5문서 + 스킬 7)만. 하류(chat.md→React)는 기존 그대로 소비.

## 🧪 검증 결과

### 1. 자동화 테스트

#### 단위 테스트 (패키지별 — gd-skills 는 테스트 파일 없음, 선재 상태)
- `@gen-design/plan`: ✅ 22 passed (cli 4 + build-index 7 + skills 7 + integration 4)
- `@gd/cli`: ✅ 250 passed (회귀 — plan 라우팅 추가 후에도 무파손)
- `create-gd-react`: ✅ 28 passed (scaffold-docs 3 추가 포함)
- **합계: 300 passed**

> `pnpm -r test` 는 gd-skills 의 "No test files found"(베이스라인부터 존재하던 상태 — test 스크립트는 있으나 테스트 파일 없음)로 전체가 빨갛게 끝나지만, 이는 본 spec 변경과 무관. 패키지별 개별 실행으로 실결과 확인.

#### 통합 테스트 (Integration Test Required = yes)
- **자동화 가능 부분**: `integration.test.ts` 4 케이스 — 스킬 7 설치 / 실 collection 66 인덱스 후보필드 / 미용실 픽스처 review BLOCK 입력구조 / 재빌드 결정성. ✅ Passed.
- **대화 흐름 부분 (수동 검증 대상)**: 아래 §수동 검증 참조.

### 2. 수동 검증 시나리오 (별도 Claude Code 세션 필요)

> 스킬은 LLM 대화 가이드라 인터뷰 완주는 자동 단위테스트 불가. 빈 프로젝트에서 다음을 사람이 실행해 확인:

1. **시나리오 1 (인터뷰)**: 빈 프로젝트 → `/gd-plan-start → prd → design → structure → flows → rules → review` → docs/ 5종 생성 + `_review.md` BLOCK 0.
   - 인프라 검증 완료: 스킬 7개 설치 가능 + 템플릿 4+taxonomy 존재.
2. **시나리오 2 (주입, Top Risk)**: 시나리오 1 산출 + `/gd-chat <landing>` → chat.md 톤이 design.md(예: cal) 일치 + Structure 순서가 structure.md 일치 + history 에 출처 명시.
   - 인프라 검증 완료: gd-chat §1 에 docs 5종 로드, §6/§7 주입 규칙, §12 일관성 검증 항목 존재.
3. **시나리오 3 (차단)**: PRD capability 하나를 structure 에서 누락 → `/gd-plan-review` BLOCK → `--force-continue` 없이 `/gd-chat` 차단.
   - 인프라 검증 완료: review §2 structural=BLOCK, gd-chat §5.10 `_review.md` BLOCK 확인 차단 로직.

## 🔎 Carry-over / Findings

- **gd-skills 테스트 부재**: test 스크립트는 있으나 테스트 파일 없음 → `pnpm -r test` 항상 실패. spec-x 로 "gd-skills smoke test 추가" 또는 test 스크립트 제거 검토.
- **pnpm-workspace.yaml stale**: `poc/app-a`, `poc/app-b` 글롭이 삭제된 디렉토리 가리킴 (베이스라인 청소 잔재). install 무해하나 정리 후보.
- **v2 백로그** (spec 기록): review BLOCK 결정성(ID set-diff), _index.json stale 감지, 문서 staleness 전파, 인터뷰 중단·재개, design.md drift(sourceHash). spec-13-02/03 또는 별도 spec.
- **node 버전 경고**: `.node-version` 24 권장이나 현재 22로 동작 (무해).
