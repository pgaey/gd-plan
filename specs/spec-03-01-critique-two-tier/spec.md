# spec-03-01: critique 2티어화 (worker→director→사람 triage)

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-03-01` |
| **Phase** | `phase-03` |
| **Branch** | `spec-03-01-critique-two-tier` |
| **상태** | Planning |
| **타입** | Refactor (critique 스킬 동작 강화) |
| **작성일** | 2026-06-18 |
| **소유자** | pgaey |

## 배경 및 문제 정의

### 현재 상황
`plans/gd-plan-critique.md` §2 는 이미 독립 서브에이전트(`Agent` tool, `model: opus`) **1개**로 PRD 를 비평한다(강제). §5 에서 메인 에이전트가 그 보고서를 읽어 사람에게 triage 제시한다.

### 문제점
- worker 1개의 비평을 **적대적으로 검증하는 2차 관문이 없다.** worker 가 놓친 발견·환각한 규제·과대/과소 severity 가 그대로 사람에게 전달된다.
- 검증자도 동일 모델이면 model-level self-bias 가 잔존한다(도입부 line 10 이 인정).

### 해결 방안
critique 를 **worker(sonnet) 1차 비평 → director(opus) 독립 2차 비평 + 병합 → 사람 triage** 2티어로 재작성한다. 작업 중인 메인 에이전트는 오케스트레이션/relay 만 하고 비평·검증을 직접 수행하지 않는다. director 가 PRD 를 *독립적으로* 재비평하므로 비평 깊이가 worker(sonnet)에 갇히지 않고, 모델 분리로 self-bias 를 완화한다.

## 요구사항

1. **2개의 독립 서브에이전트 디스패치** — worker 와 director 모두 `Agent` tool 로 별도 컨텍스트에서 실행. 메인 에이전트는 비평/검증/병합을 직접 수행하지 않는다.
2. **worker(1차)**: `model: sonnet`(기본). §3 렌즈 3종 + §4 스키마로 PRD 를 비평, `_critique` 스키마 보고서만 반환(prd 직접 수정 금지).
3. **director(2차+병합)**: `model: opus`(기본). **2-페이즈 순서 강제로 앵커링 완화** (anchoring 은 연구로 확인된 실효 위험 — 의도만으로는 불충분):
   - **페이즈1 (독립)**: worker 보고서를 *제시받지 않은 상태*에서 PRD 만 보고 자기 발견을 §3 렌즈 + §4 스키마로 **먼저 완결 출력(commit)** 한다.
   - **페이즈2 (병합)**: 그 후 worker 보고서를 받아 병합:
     - **매칭 키**: `prd.md:줄` + 렌즈(L1/L2/L3) 조합으로 두 발견을 동일 항목 판정(dedup). 같은 결함을 다른 문구로 쓴 경우 "공통"으로 합쳐 오판정 방지.
     - 한쪽만 잡은 발견 → 커버리지 갭으로 **표면화**(provenance 표기, drop 안 함).
     - severity 불일치 → **director 재정**(재정 근거로 `prd.md:줄` + §4 severity 루브릭 인용 강제).
     - 양쪽 다 근거 없는 발견 → **drop**. 단 drop 판정은 director 가 worker 표기를 신뢰하지 않고 **직접 `prd.md:줄` 을 열어 재검증**한다.
     - 병합된 단일 `_critique.md` 산출.
4. **provenance 스키마(§4)**: 병합 `_critique.md` 발견마다 출처를 표기 — `director단독` / `worker단독` / `공통`. director 단독 발견 블록을 별도로 둬 페이즈1 독립 비평의 추적성을 보장.
5. **모델 전환 가능**: 기본 worker=sonnet / director=opus. 스킬 상단에 "둘 다 opus 로 전환 가능(깊이↑·다양성↓·동일계열 self-bias·echo chamber 잔존)" 한 줄 명시.
6. **폴백 보존 + 1차본 배너**: `Agent` tool 디스패치가 *실제로 실패*할 때만 기존 §F 배너 폴백(침묵 self-review 금지) 유지. 2티어 → 1티어(worker만) → self-review 배너 순으로 graceful degrade. **worker 성공 + director 실패** 시 1차본을 줄 때 `⚠️ 검증 안 된 1차본 (director 2차 검증 누락)` 배너를 붙여 2티어 신뢰도로 오인하지 않게 한다.
7. **prdVersion 일관성**: worker·director 가 동일 prd `version` 을 봤음을 병합 보고서 frontmatter `prdVersion` 에 표기(폴백·재실행 시 어긋남 감지).
8. **사람-주도 반영 보존**: 병합 보고서를 메인이 severity 내림차순 Y/n triage 로 제시, 채택분만 prd 반영 + version bump (§5 기존 규약 유지).
9. **정직한 한계 유지**: "분리 = 편향 0" 과대주장 금지 원칙(도입부)을 2티어에도 적용 — 위계(director 단일 최종 권위자)와 둘 다 opus 시 self-bias 잔존을 명시.

## Out of Scope

- `/gd-plan-review` 에 동일 패턴 적용 (→ spec-03-02 에서 재검증 후 판단).
- 구조 테스트 (→ spec-03-03).
- 비평 렌즈(§3) 내용 자체의 변경 — 디스패치/병합 구조만 바꾼다.

## 🛑 사용자 검토 필요

> [!IMPORTANT]
> - [ ] director 독립성 vs 앵커링: 2-디스패치 + **페이즈 분리 강제**(요구사항 3)로 anchoring 을 구조적으로 완화하나, 단일 컨텍스트라 완전 blind 는 아니다(잔존 가능). **대안 A — 병렬 blind 비평 + 별도 merge(3-디스패치)** 를 완전 독립이 필요한 고위험 사용자용 **opt-in 모드**로 스킬에 병기한다(기본은 2-디스패치 대안 B). 비용·복잡도 trade-off 는 critique.md §3 참조.

> [!WARNING]
> - [ ] 비용: 디스패치 1 → 2개로 증가(opus 1 + sonnet 1). 단, worker=sonnet 으로 일부 상쇄.

## 핵심 전략

| 컴포넌트 | 전략 | 이유 |
|:---:|:---|:---|
| **worker** | sonnet, §3+§4 로 1차 비평, 보고서만 | 비용↓ + 다른 각도(교차 모델 다양성) |
| **director** | opus, 독립 재비평 후 병합 | opus 깊이 천장 확보 + 판정/병합 judgment |
| **병합 규약** | 갭 표면화 / severity 재정 / 무근거 drop | 커버리지↑ + 환각 차단 |
| **메인** | 디스패치·relay·사람 triage 만 | "작업 중 에이전트는 비평 안 함" 불변식 |

### 흐름

```
메인(오케스트레이터)
  ├─ dispatch worker (sonnet) ── prd + §3 렌즈 + §4 스키마 → 1차 _critique 보고서
  └─ dispatch director (opus) ──
       페이즈1(독립): prd 만 → 자기 발견 먼저 완결 commit
       페이즈2(병합): + worker 보고서 → 매칭(prd:줄+렌즈) / 갭 표면화(provenance)
                       / severity 재정(근거 강제) / 직접 재검증 후 무근거 drop
       → 병합 _critique.md (provenance: director단독·worker단독·공통)
  → 메인: 병합 보고서 severity 내림차순 Y/n triage → 채택분 prd 반영 + version bump

[opt-in 대안 A] worker·director 병렬 blind 비평 → 별도 merge(3-디스패치) — 완전 독립
[폴백] 2티어 → 1티어(⚠️ 검증 안 된 1차본 배너) → self-review 배너
```

## Proposed Changes

#### [MODIFY] `plans/gd-plan-critique.md`
- **도입부**: self-bias 주석에 "2티어(worker sonnet / director opus)로 교차 모델 완화하되, 위계·둘 다 opus 시 잔존" 한 줄 보강 + 모델 전환 가능 명시.
- **§2 재작성**: 단일 디스패치 → worker+director 2티어 디스패치 규약(모델 기본값, 전달 입력, 반환 계약). director 는 **2-페이즈 순서 강제**(페이즈1 독립 commit → 페이즈2 병합). 병합 규약(매칭 키 `prd.md:줄`+렌즈 / 갭 표면화 / severity 재정 근거 강제 / director 직접 재검증 후 무근거 drop). 폴백을 2→1(⚠️ 1차본 배너)→self-review graceful degrade 로 확장. **대안 A(병렬 blind 3-디스패치) opt-in 모드** 한 단락.
- **§4 스키마 확장**: 발견 라인에 provenance(`director단독`/`worker단독`/`공통`) 표기 + director 단독발견 블록 + frontmatter `prdVersion`(worker·director 동일 version 표기). severity 재정 시 근거(`prd.md:줄`+루브릭) 필드.
- **§5 보강**: 메인이 받는 것은 *병합된* `_critique.md` 임을 명시. triage/반영/version bump 규약은 유지.
- **불변식 문구**: "메인 에이전트는 비평·검증·병합을 직접 수행하지 않는다" 명시.

## 검증 계획

```bash
bash test/sh/run.sh   # 기존 회귀 (구조 테스트는 spec-03-03)
```

수동 검증 시나리오:
1. 샌드박스 재설치 후 설치본 `gd-plan-critique.md` 가 worker+director 2티어 디스패치 규약·병합 규약·모델 기본값을 포함하는지 grep — 기대: 포함.
2. (가능 시) 결함 PRD 로 `/gd-plan-critique` 실행 → 두 에이전트 디스패치 + 병합 보고서 산출, 한쪽만 잡은 발견이 갭으로 표면화 — 별도 세션 필요(구조/텍스트 수준까지 본 spec 에서 검증).

> 본 spec 은 스킬(마크다운 프롬프트) 변경이라 자동 단위 테스트가 직접 적용되지 않는다(구조 테스트는 spec-03-03). 검증은 설치 전파 grep + 수동 시나리오.

## ADR 후보

- [x] 후보 발견: `critique-two-tier-worker-director-merge` — **type: convention** — "worker(생성/1차)→director(검증+병합)→사람 triage" 디스패치·병합 규약 + "메인은 비평 안 함" 불변식은 spec-03-02(review)·03-03(구조 테스트)에서 재사용·강제될 cross-spec·장기(6개월+) 관례. spec-03-02 재검증 시 convention vs decision(위계 채택 결정) 확정 권장. (critique.md §4)

## ✅ Definition of Done

- [ ] `plans/gd-plan-critique.md` 가 worker+director 2티어 디스패치·director 2-페이즈 순서 강제·병합 규약(매칭/provenance/severity 근거/직접 재검증 drop)·§4 스키마 확장(provenance+prdVersion)·모델 기본값·폴백 graceful degrade(1차본 배너 포함)·대안 A opt-in 을 포함
- [ ] 샌드박스 재설치 → 설치본 전파 grep 확인
- [ ] `walkthrough.md` 와 `pr_description.md` 작성 및 ship commit
- [ ] `spec-03-01-critique-two-tier` 브랜치 push 완료
