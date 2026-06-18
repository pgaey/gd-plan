# Walkthrough: spec-03-02

> 결정 과정, 사용자 협의, 검증 결과 기록.

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| spec-03-02 정체 | review 적용 / 구조 테스트 | **구조 테스트로 교체** | §11.3 재검증: review 적용 drop(아래) → 표의 다음 seq를 구조 테스트가 차지 |
| review 적용(구 02) | 전체/축소/drop | **drop → Icebox** | review 는 결정적 lint, 의미적 2차 이득 낮음. WARN 미구현이라 적용 대상 빈약 |
| 테스트 방식 | 의미 테스트 / grep 구조 | **grep 구조** | `test-auto-advance.sh` 선례, 의존성 0, 회귀 가드 목적에 충분 |

## 💬 사용자 협의

- **주제**: phase-03 남은 spec(02 review, 03 test) §11.3 재검증
  - **합의**: review 적용은 **drop → Icebox**(review WARN 구현 시 승격). 구조 테스트만 진행 → spec-03-02로.

## 🧪 검증 결과

### 자동화 테스트
- **명령**: `bash test/sh/run.sh`
- **결과**: ✅ Passed (4 suites — test-critique-dispatch 추가)

### 가드 작동 증명
- `model: "opus"` 줄 임시 깨뜨림 → `test-critique-dispatch.sh` **FAIL(exit 1)**, 해당 불변식 특정 → 복구 → **PASS(exit 0)**. 회귀 가드가 실제로 작동함을 증명.

### 검증 대상 불변식 (9개)
worker=sonnet / director=opus / 페이즈1 독립 / 페이즈2 병합 / provenance / director단독 / 메인 비평금지 / 보고서만(prd 직접수정 금지) / 1차본 배너.

## 🔍 발견 사항

- `sdd ship` 후 "모든 spec merged → phase done" 메시지는 **오신호**일 수 있다 — 산문으로만 계획된 spec은 `sdd spec new` 전까지 표에 없어 카운트되지 않는다. §11.3 재검증으로 실제 잔여 작업을 판단해야 함.

## 🚧 이월 항목 (Optional)

- `/gd-plan-review` worker→director 적용 → `backlog/queue.md` Icebox (review WARN 의미 체크 구현 시 승격).
- 결함 PRD E2E (critique 두 에이전트 디스패치 + 병합) → phase-03 통합 테스트 시나리오 1 (phase ship 시 검증).
