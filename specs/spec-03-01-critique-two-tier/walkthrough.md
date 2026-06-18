# Walkthrough: spec-03-01

> 결정 과정, 사용자 협의, 검증 결과 기록.

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| director 역할 | audit / 독립 2차 비평 / 다수결 | **독립 2차 비평 + 병합** | director(opus) 독립 비평 시 깊이 천장이 worker(sonnet)에 안 갇힘 |
| 모델 | sonnet+opus / 둘 다 opus | **worker=sonnet, director=opus (전환 가능)** | 독립 2차라 opus 깊이 + 교차 모델 다양성 |
| anchoring 완화 | 의도만 / 페이즈 강제 / 병렬 blind | **2-페이즈 순서 강제(기본) + 병렬 blind opt-in** | critique 결과: anchoring은 연구로 확인된 실효 위험(첫 리뷰어 0.255), 의도만으론 부족 |
| 병합 권위 | director 재정 / 규칙 집계 | **director 재정 + 근거 강제** | judgment 활용하되 self-correct 위험은 prd:줄 근거 강제로 통제 |

## 💬 사용자 협의

- **주제**: critique를 작업 중 에이전트가 아닌 별도 에이전트가 수행
  - **합의**: 이미 §2가 독립 디스패치(강제)임을 확인. 진짜 갭은 worker 비평을 검증하는 **director 티어 부재** → 2티어로 강화.
- **주제**: worker 모델을 sonnet으로 하면 비평이 sonnet에 갇히지 않나
  - **합의**: director가 *독립* 재비평(opt B)하면 깊이는 director(opus)가 확보 → sonnet worker는 교차 다양성 역할. worker=sonnet/director=opus 채택.
- **주제**: spec 자체 critique (메타)
  - **합의**: `/hk-spec-critique` 독립 Opus 비판 → 9건 전부 반영(아래 검증).

## 🧪 검증 결과

### 자동화 테스트
- **명령**: `bash test/sh/run.sh`
- **결과**: ✅ Passed (3 suites — 회귀 무영향. 본 spec 전용 구조 테스트는 spec-03-03 소관)

### Spec Critique 반영 (independent Opus)
- `critique.md` 9건 전부 반영. 핵심:
  - **모순 해소**: 요구사항 3(provenance) ↔ Proposed Changes(§4 스키마 미변경) → §4 스키마에 provenance·prdVersion·director 단독발견 블록 추가.
  - **anchoring**: director 2-페이즈 순서 강제(페이즈1 독립 commit → 페이즈2 병합).
  - **대안 A 병기**: 병렬 blind 3-디스패치 opt-in.

### 수동 검증
1. **Action**: 샌드박스 재설치 후 설치본 `gd-plan-critique.md` grep
   - **Result**: 2-페이즈/worker=sonnet/director=opus/provenance/1차본 배너/대안 A/메인 비평금지 불변식 모두 전파 ✓
2. **한계**: 결함 PRD로 실제 두 에이전트 디스패치 + 병합 E2E는 별도 소비자 세션 필요 — phase 통합 테스트(시나리오 1)로 이월.

## 🔍 발견 사항

- critique 스킬은 이미 독립 단일 서브에이전트를 강제하고 있었다(§2). 본 spec은 그 위에 **검증 티어(director)** 와 **anchoring 완화**를 더한 것.
- ADR 후보 `critique-two-tier-worker-director-merge` (type: convention) — spec-03-02 재검증 시 승격 판단.

## 🚧 이월 항목 (Optional)

- 결함 PRD E2E (두 에이전트 디스패치 + 병합 보고서) → phase-03 통합 테스트 시나리오 1.
- 2티어 디스패치/병합 불변식 구조 테스트 → spec-03-03.
