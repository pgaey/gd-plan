# spec-03-02: 비평 디스패치 규약 구조 테스트

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-03-02` |
| **Phase** | `phase-03` |
| **Branch** | `spec-03-02-critique-dispatch-test` |
| **상태** | Planning |
| **타입** | Test (회귀 가드) |
| **작성일** | 2026-06-18 |
| **소유자** | pgaey |

## 배경 및 문제 정의

### 현재 상황
spec-03-01 이 `gd-plan-critique.md` 를 worker→director 2티어 + 병합으로 재작성했다. 이 불변식들은 산문(프롬프트)이라, 추후 편집으로 **조용히 회귀**(예: director 디스패치 누락, 메인이 직접 비평, "보고서만" 규약 삭제)해도 잡히지 않는다.

### 문제점
2티어 규약을 강제하는 자동 검증이 없다. spec-x-gd-plan-auto-advance 가 마커 구조 테스트(`test-auto-advance.sh`)로 9개 스킬 일관성을 강제한 선례가 있으나, critique 의 2티어 불변식은 미보호.

### 해결 방안
`test/sh/test-critique-dispatch.sh` 로 `gd-plan-critique.md` 가 핵심 불변식 문자열을 보유하는지 검증한다(회귀 가드). spec-03-01 이 이미 구현했으므로 생성 시 PASS — 이후 회귀를 막는다.

## 요구사항

1. `test/sh/test-critique-dispatch.sh` 신규 — `plans/gd-plan-critique.md` 가 다음을 모두 보유하는지 검증:
   - worker 디스패치 + `model: "sonnet"` 기본
   - director 디스패치 + `model: "opus"` 기본
   - 2-페이즈 순서 강제 (페이즈1 독립 / 페이즈2 병합)
   - provenance 스키마 (`director단독`/`worker단독`/`공통`)
   - 메인 비평금지 불변식 ("메인 에이전트는 비평·검증·병합을 직접 수행하지 않는다")
   - "보고서만" prd 직접수정 금지 규약
   - 폴백 1차본 배너 ("검증 안 된 1차본")
2. `test/sh/run.sh` 자동 수집(`test-*.sh` glob) — run.sh 수정 불필요.
3. 실패 메시지는 어느 불변식이 빠졌는지 특정.

## Out of Scope

- review 적용 (drop → Icebox).
- critique 동작 자체 변경 (spec-03-01 소관).
- 의미적/LLM 기반 테스트 — 문자열 구조 검증만.

## 🛑 사용자 검토 필요

> [!IMPORTANT]
> - [ ] 본 테스트는 **문자열 매칭** 가드라, 불변식의 *의미*가 아닌 *문구 존재*만 검증한다. 문구를 바꾸되 의미를 유지하는 리팩터가 false-fail 날 수 있다(허용 — 회귀 가드의 의도된 보수성). grep 패턴은 너무 좁지 않게 핵심 토큰 위주로.

## 핵심 전략

| 컴포넌트 | 전략 | 이유 |
|:---:|:---|:---|
| 테스트 | grep 기반 불변식 존재 검증 | `test-auto-advance.sh` 선례와 동일 패턴, 의존성 0 |
| 패턴 | 핵심 토큰(모델/페이즈/불변식 문구) | 과도하게 좁은 매칭 회피(리팩터 내성) |

## Proposed Changes

#### [NEW] `test/sh/test-critique-dispatch.sh`
요구사항 1의 7개 불변식을 각각 grep 으로 검증, 누락 시 어느 항목인지 fail 메시지. `set -u` + `fail()/ok()` + 최종 `[ "$FAILED" -eq 0 ]` (기존 테스트 스타일).

## 검증 계획

```bash
bash test/sh/test-critique-dispatch.sh   # PASS (spec-03-01 구현 보유)
bash test/sh/run.sh                       # 전체 PASS
```

수동: critique.md 에서 불변식 한 줄을 임시 삭제 → 테스트 FAIL 확인(가드 작동) → 복구.

## ADR 후보

- [ ] 없음 — 테스트 추가. (2티어 규약 자체의 ADR 후보는 spec-03-01 에서 식별됨: `critique-two-tier-worker-director-merge`)

## ✅ Definition of Done

- [ ] `test/sh/test-critique-dispatch.sh` PASS + 임시 삭제 시 FAIL 확인(가드 작동 증명)
- [ ] `bash test/sh/run.sh` 전체 PASS
- [ ] `walkthrough.md` 와 `pr_description.md` 작성 및 ship commit
- [ ] `spec-03-02-critique-dispatch-test` 브랜치 push 완료
