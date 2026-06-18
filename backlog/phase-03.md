# phase-3: critique-hardening — 비평 레이어 2티어 강화

> 본 phase 의 모든 SPEC 을 한 파일에 요점/방향성으로 나열합니다.
> *구체적* 작업 내용은 `specs/spec-3-{seq}-{slug}/spec.md` 에서 다룹니다.

## 📋 메타

| 항목 | 값 |
|---|---|
| **Phase ID** | `phase-3` |
| **상태** | In Progress |
| **시작일** | 2026-06-18 |
| **목표 종료일** | 미정 |
| **소유자** | pgaey |
| **Base Branch** | 없음 (각 spec → main 직접 PR) |

## 🎯 배경 및 목표

### 현재 상황
`gd-plan-critique` 는 이미 독립 서브에이전트로 PRD 를 적대적으로 비평한다(§2 강제 디스패치). 그러나 흐름은 **단일 worker → 사람 triage** 로, worker 의 비평을 적대적으로 검증하는 단계가 없다. worker 가 놓친 발견·환각한 규제·잘못 매긴 severity 를 걸러줄 2차 관문이 부재하다. 또한 스킬 스스로 인정하듯(line 10), 검증자도 동일 모델이면 model-level self-bias 가 잔존한다(Panickssery et al., NeurIPS 2024).

PRD 는 모든 하류 산출물의 전제다. 전제가 틀리면 그 위의 sitemap·flows·UI 가 전부 틀린 방향으로 정합한다. 그래서 비평의 정확도/커버리지를 높이는 투자 ROI 가 가장 크다.

### 목표 (Goal)
비평 레이어를 **worker(1차 비평) → director(독립 2차 비평 + 병합) → 사람 triage** 2티어로 강화한다. 작업 중인 메인 에이전트는 오케스트레이션/relay 만 하고, 비평도 그 검증도 *별도 에이전트* 가 수행한다. 모델은 worker=sonnet / director=opus 로 분리해 깊이(director opus 독립 비평)와 다양성(교차 모델)을 동시에 얻는다.

### 성공 기준 (Success Criteria) — 정량 우선
1. `gd-plan-critique` 가 worker·director **두 개의 독립 에이전트**를 디스패치하고, 병합된 단일 `_critique.md` 를 산출한다 (메인 에이전트는 비평/검증을 직접 수행하지 않음).
2. 병합 규약이 명시적: 한쪽만 잡은 발견 = 커버리지 갭으로 표면화 / severity 불일치 = director 재정 / 양쪽 근거 없는 발견 = drop.
3. 비평 스킬의 2티어·병합·사람-주도 반영 불변식을 강제하는 구조 테스트가 `test/sh` 에 존재하고 PASS.
4. 통합 시나리오(샌드박스 설치 → 두 에이전트 디스패치 + 병합 보고서)가 문서화되고 검증된다.

## 🧩 작업 단위 (SPEC + phase-FF)

<!-- sdd:specs:start -->
| ID | 슬러그 | 우선순위 | 상태 | 디렉토리 |
|---|---|:---:|---|---|
| `spec-03-01` | critique-two-tier | P? | Merged | `specs/spec-03-01-critique-two-tier/` |
| `spec-03-02` | critique-dispatch-test | P? | Merged | `specs/spec-03-02-critique-dispatch-test/` |
<!-- sdd:specs:end -->

> 상태 허용값: `Backlog` / `In Progress` / `Merged`

### spec-3-01 — critique 2티어화 (worker→director→triage)

- **요점**: `gd-plan-critique` §2/§5 를 단일 worker → "worker(sonnet) 1차 비평 → director(opus) 독립 2차 비평 + 병합 → 사람 triage" 로 재작성.
- **방향성**: 두 서브에이전트 모두 `Agent` tool 로 독립 컨텍스트 디스패치. director 는 PRD 를 독립 재비평 후 worker 결과와 병합(커버리지 갭/severity 재정/환각 drop). 모델은 기본 worker=sonnet·director=opus, 둘 다 opus 로 전환 가능하게 명시. 폴백(디스패치 실패) 배너 규약 보존.
- **참조**: `plans/gd-plan-critique.md` §2·§4·§5, 도입부 self-bias 주석(line 10)
- **연관 모듈**: `plans/gd-plan-critique.md`

### ~~review 에 worker→director 검증 티어 적용~~ (DROP → Icebox)

- **상태**: §11.3 재검증(spec-3-01 완료 후)으로 **drop**. review 는 결정적 ID set-diff lint 라 의미적 2차 비평 이득이 낮고, review 의 의미적 WARN(persona↔톤 등)은 아직 v2 백로그 미구현이라 적용 대상 자체가 빈약. → `backlog/queue.md` Icebox 로 이동. review WARN(의미 체크) 구현이 생기면 그때 승격.

### spec-3-02 — 비평 디스패치 규약 구조 테스트

- **요점**: critique 의 2티어·병합·사람-주도 반영·메인 비평금지 불변식을 강제하는 `test/sh` 구조 테스트.
- **방향성**: greppable 규약(디스패치 마커/필수 섹션)을 정의하고, `gd-plan-critique.md` 가 worker·director 디스패치 + 2-페이즈 + 병합 규약 + "보고서만, prd 직접수정 금지" + "메인은 비평 안 함" 불변식을 갖췄는지 검증. 회귀 방지.
- **참조**: `test/sh/test-auto-advance.sh`(마커 테스트 선례), spec-3-01 산출물
- **연관 모듈**: `test/sh/`

### phase-FF 예정 항목 (spec 미생성)

없음.

## 📌 결정 기록 (Review)

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| director 역할 | audit / 독립 2차 비평 / 다수결 | **독립 2차 비평 + 병합** | director(opus)가 독립 비평하면 깊이 천장이 worker(sonnet)에 갇히지 않음 |
| 모델 | sonnet+opus / 둘 다 opus | **worker=sonnet, director=opus (전환 가능)** | 독립 2차라 opus 깊이 확보 + 교차 모델로 self-bias 완화 |
| review 적용(02) | 처음부터 / 재검증 후 | **phase 포함하되 01 후 재검증** | review 는 결정적 lint — 의미적 2차 이득 불확실 |
| review 적용 §11.3 재검증 | 전체/축소/drop | **drop → Icebox** (01 완료 후) | review 의미 검증 대상(WARN) 미구현, 결정적 lint 에 2티어 이득 낮음 |

## 🧪 통합 테스트 시나리오 (간결)

### 시나리오 1: 두 에이전트 디스패치 + 병합 보고서
- **Given**: 샌드박스에 phase-03 반영본 gd-plan 설치 + 결함 있는 `docs/prd.md`
- **When**: `/gd-plan-critique` 실행
- **Then**: worker·director 두 독립 에이전트가 디스패치되고, 병합된 단일 `_critique.md` 가 산출된다(메인 에이전트가 직접 비평하지 않음). 한쪽만 잡은 발견이 병합에 표면화된다.
- **연관 SPEC**: spec-3-01, spec-3-02

### 통합 테스트 실행
```bash
bash test/sh/run.sh   # 구조 테스트 + 샌드박스 설치 검증
```

## 🔗 의존성

- **선행 phase**: 없음 (spec-x-gd-plan-auto-advance 머지 완료 위에서 진행)
- **외부 시스템**: 없음 (Claude Code `Agent` tool 가용성에 의존 — 폴백 규약 보존)
- **연관 ADR**: 없음 (기존 critique 스킬 강화 — 새 아키텍처 결정은 spec 진행 중 ADR 후보 판단)

## 📝 위험 요소 및 완화

| 위험 | 영향 | 완화책 |
|---|---|---|
| 2티어로 토큰/시간 비용 2배+ | 비용 증가 | worker=sonnet 으로 1차 비용 절감, director 만 opus |
| `Agent` tool 미가용(폴백) | 독립 검증 불가 | 기존 §F 배너 폴백 규약 보존 — 침묵 self-review 금지 |
| review 적용(02) 과잉 설계 | 불필요한 복잡도 | 01 후 §11.3 재검증으로 drop 가능 |
| 둘 다 opus 시 model self-bias 잔존 | 검증 신뢰도 과대평가 | skill 에 한계 명시(과대주장 금지 원칙 유지) |

## 🏁 Phase Done 조건

- [ ] 모든 SPEC 이 merge (각 spec → main)
- [ ] 통합 테스트 시나리오 1 PASS
- [ ] 성공 기준 1~4 정량 측정 결과 기록
- [ ] 사용자 최종 승인 (`/hk-phase-ship`)

## 📊 검증 결과 (phase 완료)

### 성공 기준
1. ✅ PASS — 통합 테스트에서 worker(sonnet)+director(opus) 두 독립 에이전트 디스패치, 병합 `_critique.md` 산출. 메인 에이전트는 비평/검증/병합 직접 수행 안 함(오케스트레이션만).
2. ✅ PASS — 병합 규약 작동 관찰: 갭 표면화(director단독 2건 보존), severity 재정(결과알림 높음→중간, 근거 인용), 무근거 drop 0건(환각 규제는 "확인 필요" 보류).
3. ✅ PASS — `test/sh/test-critique-dispatch.sh` 존재 + PASS(9 불변식). 가드 작동 증명(깨뜨림→FAIL→복구→PASS).
4. ✅ PASS — 통합 시나리오 1 문서화 + 실행 검증 완료(아래).

### 통합 테스트 — 시나리오 1 (두 에이전트 디스패치 + 병합)
- **방법**: 결함 PRD(`/tmp/phase03-itest/docs/prd.md` — 동네의원 예약, PIPA 동의 누락·노쇼 리마인더 누락·결과알림 Later·측정불가 성공기준 심음)로 worker→director 2티어 실제 디스패치.
- **결과**: ✅ PASS
  - worker(sonnet) 1차: 치명1·높음2·중간4·낮음2 포착(PIPA 동의 누락 등).
  - director(opus): 페이즈1 독립 비평 commit 후 병합 → provenance(공통8/director단독2/worker단독1).
  - **커버리지 갭 입증**: director가 worker 미포착 2건(Admin 가용슬롯 설정 부재, 예약 변경/취소 부재)을 단독 발견으로 표면화.
  - severity 재정 1건(근거 인용), 무근거 drop 0(직접 재검증), 환각 규제 "확인 필요" 처리.
