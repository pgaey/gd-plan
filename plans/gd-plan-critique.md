---
name: gd-plan-critique
description: PRD 전제를 worker(sonnet)→director(opus) 2티어 독립 에이전트로 적대적 비판한다. worker 1차 비평 → director 독립 2차 비평 + 병합 → 사람 triage. review(구조 정합 lint)가 통과시키는 "정합적이지만 틀린" PRD의 의미적 결함(루프 미완결·규제 누락·측정불가)을 잡는다. 보고서(docs/_critique.md)만 산출하고 사람이 채택분만 prd 에 반영. 메인 에이전트는 비평을 직접 수행하지 않음. idempotent.
---

# gd-plan-critique — PRD 전제 적대 검증 (의미 정합)

> 본 스킬은 *비평자(critic)* 입니다. `/gd-plan-review`(구조 정합 lint)가 통과시키는 **"정합적이지만 틀린"** PRD 를, **저작자와 분리된 독립 컨텍스트**가 적대적으로 검증합니다.
> **북극성 — 구조적 완성 ≠ 의미적 정합.** ID 연결이 다 맞아도(review 통과) 제품으로 말이 안 될 수 있다. "예약 결과가 환자에게 닿는가?"는 연결 검사로 안 보인다.
> **정직한 한계**: 별도 컨텍스트는 *이 대화의 누적 편향*을 끊는다. 본 스킬은 **2티어**(worker=sonnet 1차 비평 → director=opus 독립 2차 비평 + 병합)로 모델을 분리해 self-preference bias(Panickssery et al., NeurIPS 2024)를 *교차 모델*로 완화한다. 그러나 (a) director 가 단일 최종 권위자인 **위계**라 director 의 model bias 는 잔존하고, (b) **둘 다 opus** 로 전환하면 동일 계열 self-bias·echo chamber 가 잔존한다. "분리 = 편향 0"으로 **과대주장 금지** — 과대주장은 review 가 빠진 함정("유창함이 정확함을 가림")의 메타 재발이다.
> **모델 설정**: 기본 `worker=sonnet` / `director=opus`. 깊이를 다양성보다 우선하면 둘 다 `opus` 로 바꿀 수 있다(위 (b) 한계 감수).

---

## §1 자동 로딩 컨텍스트 / 선행조건

| 파일 | 역할 |
|---|---|
| `docs/prd.md` | **비평 대상 단독** — 입력의 전부 |
| `docs/decisions.md` | (참조) 전제 결정의 근거 |
| `templates/prd.md` | (참조) 필드 구조 |

- **입력 범위(§A)**: critique 는 design/flows *이전*에 돈다 → `sitemap.md`·`flows/`·`pages/` 는 **아직 없으므로 보지 않는다**. PRD 전제만 본다.
- **선행조건**: `docs/prd.md` 없으면 멈추고 보고. prd 에 `<!-- TODO -->` 미완 마커가 있으면 "PRD 미완 — 채우고 재실행 권장" 경고 후 진행(차단 아님).

## §2 2티어 독립 디스패치 (강제) — 핵심

> **불변식**: 본 스킬을 실행하는 **메인 에이전트는 비평·검증·병합을 직접 수행하지 않는다.** 자기가 쓴/논의한 PRD 를 자기가 보면 confirmation bias 에 빠지므로, *분리가 곧 산출물*이다. 메인은 디스패치·relay·사람 triage(§5)만 한다.

두 개의 **독립 서브에이전트**를 `Agent` tool (`subagent_type: general-purpose`)로 디스패치한다.

### worker (1차 비평) — `model: "sonnet"`(기본)
- **전달**: `docs/prd.md`(+`decisions.md`) 경로 + §3 렌즈 + §4 출력 스키마.
- **반환 계약**: §4 스키마 보고서**만**(prd 직접 수정 금지). 다른 각도의 1차 비평.

### director (독립 2차 비평 + 병합) — `model: "opus"`(기본)
director 는 **2-페이즈 순서 강제**로 앵커링을 완화한다 (anchoring 은 연구로 확인된 실효 위험 — "독립적으로 보라"는 의도만으로는 막히지 않는다):

- **페이즈1 (독립)**: **worker 보고서를 제시받지 않은 상태**에서 `prd.md` 만 보고, §3 렌즈 + §4 스키마로 **자기 발견을 먼저 완결 출력(commit)** 한다. (디스패치 프롬프트는 페이즈1 산출을 먼저 받은 뒤에야 worker 보고서를 제시하도록 구성 — 순서가 곧 독립성 보증.)
- **페이즈2 (병합)**: 그 후 worker 보고서를 받아 병합한다.
  - **매칭(dedup)**: `prd.md:줄` + 렌즈(L1/L2/L3) 조합을 키로 두 발견을 동일 항목 판정. 같은 결함을 다른 문구로 썼으면 **공통**으로 합친다(오판정 방지).
  - **갭 표면화**: 한쪽만 잡은 발견은 **drop 하지 않고** provenance(`director단독`/`worker단독`)를 달아 보존.
  - **severity 재정**: 불일치 시 director 가 재정하되 **근거(`prd.md:줄` + §4 severity 루브릭)를 반드시 인용**.
  - **무근거 drop**: 양쪽 다 근거 없는 발견만 drop. 단 director 는 worker 표기를 신뢰하지 않고 **직접 `prd.md:줄` 을 열어 재검증**한 뒤 판정.
  - 병합된 **단일 `_critique.md`** 산출(§4 스키마, provenance·`prdVersion` 포함).

### (opt-in) 대안 A — 병렬 blind 3-디스패치
완전 독립이 필요한 고위험(법·보안 핵심) 비평에선, worker·director 를 **동시·blind**(서로 못 봄)로 독립 비평시키고 3번째 가벼운 **merge 디스패치**가 set 연산으로 병합한다. anchoring 을 원천 차단하나 비용·복잡도가 높다 — 기본은 위 2-디스패치(페이즈 강제).

### 폴백(§F) — `Agent` tool 디스패치가 *실제로 실패*할 때만 (graceful degrade)
임의 판단으로 독립 검증을 건너뛰지 않는다.
- **2티어 → 1티어**: director 디스패치만 실패하면 worker 1차본을 주되 **`⚠️ 검증 안 된 1차본 — director 2차 검증 누락. 2티어 신뢰도로 오인 금지.`** 배너를 붙인다.
- **1티어 → self-review**: worker 까지 실패하면 **큰 배너**: `⚠️ 독립 검증 불가 — 인컨텍스트 자가점검(self-review)이라 편향이 남는다. 결과를 덜 신뢰하고, 이 결과만으로 중대한(법적·보안·핵심가치) 결정을 확정하지 말 것.` 그 아래 §3 렌즈를 체크리스트로 메인이 항목별 강제 답변.
- **침묵 self-review 절대 금지**(불변식). 자가점검이 독립 검증인 척하면 안 된다. 폴백을 *기본*으로 오용 금지 — Claude Code 에선 서브에이전트가 거의 항상 가능하다.

## §3 비평 렌즈 3종 + tie-break

| 렌즈 | 잡는 것 | 판정법 |
|---|---|---|
| **L1** 트랜잭션 완결성·의미 정합 | 핵심 가치별 루프가 실제로 닫히나 (review 의 연결 검사가 못 봄) | §E |
| **L2** 도메인 제약·규제 적합성 | *선언된* 제약을 기획이 지켰나 | §D |
| **L3** 검증가능 사실·측정가능성 | 손계산 가능한 건 계산해 검증, 성공기준이 시스템 내 측정가능한가 | §아래 |

- **tie-break**: 한 발견이 복수 렌즈에 걸리면 우선순위 **L2(규제) > L1(의미) > L3(측정)**. (규제는 법적 차단이라 최우선)
- **§E — L1 operational 판정**: flow 그림 없이, **핵심 가치마다 필요한 end-to-end 사슬을 capabilities + 우선순위(MVP/Later)로 추적**한다. 사슬의 한 고리가 누락/Later 면 "루프 미완결". 예) 가치=전화 없이 예약 → 사슬 [신청 → 관리자확인 → **결과전달**]. 결과전달(CAP)이 Later → 끊김.
- **§D — L2 grounding**: **1차 ground truth = PRD `## 제약/규제` 슬롯(선언분)**. L2 는 "*선언된* 제약을 지켰나"를 판정 — LLM 이 모든 법을 알 필요 없다(도메인 의존). **2차(best-effort) = 웹검색**으로 누락된 제약 surface(예: "병원인데 PIPA 미선언"). **환각 규제 금지** — 근거 없으면 "확인 필요"로 표기.
- **L3**: 대비비·임계치처럼 손계산되는 객관 수치는 *계산해서* 검증(말로 처방 금지). 성공기준은 분모/측정 수단이 시스템 범위 안인지 본다(예: 분모가 전화예약=시스템 밖이면 측정 불가).
- **비가역 결정 확신표기 점검 (cross-cutting)**: 보안·법·규제·데이터모델·제품행동 등 *되돌리기 어려운(비가역)* 결정이 `(사용자 확인 권장)` 등 확신 표기 없이 **단정**됐으면 발견으로 보고(severity 높음 — 비가역인데 표시가 없어 사람이 놓침). 가역 결정은 단정해도 됨. "위임이 단정의 면허는 아니다."

## §4 보고서 스키마 + severity 루브릭 (§B)

- **severity 4단**: **치명**(법적/보안 차단) · **높음**(핵심가치 훼손) · **중간**(보강) · **낮음**(권고).
- 산출 = `docs/_critique.md` (**멱등 overwrite**, 누적 금지). frontmatter 에 `prdVersion: <N>` (비평한 prd 의 `version`).
- **prdVersion 일관성**: worker·director 가 **같은 prd `version`** 을 봤음을 frontmatter 에 표기. 폴백·재실행으로 어긋나면 보고서에 경고.
- 발견 1줄 = `[severity][렌즈][provenance] 요약 — 근거(prd.md:줄) — 제안`.
  - **provenance** ∈ `공통`(worker·director 둘 다) / `director단독` / `worker단독`. 단독 발견은 커버리지 갭 신호 — drop 하지 않는다.
  - severity 가 worker↔director 간 재정된 항목은 `(재정: <worker>→<director>, 근거 prd.md:줄)` 를 꼬리에 단다.

병합 보고서 출력 형식(director 산출, 한국어, 마크다운 본문만):

```markdown
---
prdVersion: <비평한 prd.md 의 version>
modelTiers: worker=<sonnet|opus>, director=<opus>
---
# PRD Critique (병합) — <프로젝트명>

## 치명 / 높음 / 중간 / 낮음 (severity 내림차순)
- [치명][L2][공통] 개인정보처리방침 누락 — 근거(prd.md:..) — PIPA 법정필수, `## 제약/규제` 에 선언·반영
- [높음][L1][director단독] 결과 알림이 Later — 근거(prd.md:..) — 예약 루프 미완결('전화 없이' 자기모순), MVP 승격 검토
- [중간][L3][worker단독] 성공기준 분모가 시스템 밖 — 근거(prd.md:..) — 측정 수단을 범위에 포함 (재정: 낮음→중간, 근거 prd.md:..)

## director 페이즈1 단독 발견 (병합 전, 추적성)
- worker 보고서를 보기 전 director 가 먼저 commit 한 발견 목록 (병합 후 어느 것이 공통/단독이 됐는지 대조용)

## 렌즈별 통과
- L1/L2/L3 각 점검 결과 요약

## 병합 메모
- 매칭으로 합쳐진 항목, drop 된 무근거 항목(직접 재검증 결과), severity 재정 내역
```

> worker·director 는 **보고서만** 쓴다 — prd 를 직접 수정하지 않는다(§5 가 사람-주도 반영).

## §5 사람-주도 반영 (저작권 보존)

1. 메인 에이전트는 director 가 산출한 **병합된** `_critique.md`(§2 2티어 결과)를 읽고 발견 항목을 **severity 내림차순**으로 사용자에게 제시(Y/n triage). 메인은 비평·검증·병합을 직접 하지 않고 relay 만 한다. critique 는 *판단*이라 자동 적용 금지. provenance(`director단독`/`worker단독`)는 커버리지 갭 참고용으로 함께 표시.
2. **채택분만** `docs/prd.md` 에 반영한다. 반영했으면 prd frontmatter `version` **+1**(한 세션 다건 반영 = +1; 초기값·규칙 정본은 `templates/prd.md`).
3. prd 가 바뀌는 fork → `docs/decisions.md` 에 typed 1행(연결=`[CAP-..]`). 형식·ID·supersede 는 `ADR-011` / `docs/decisions.md` 헤더 정본 참조.

```
📋 Critique 완료 — 치명 N · 높음 M · 중간 K · 낮음 L

반영할 항목 (Y/n): 번호 입력 / "all" / "none"
[ ] 1. [치명][L2] ...
[ ] 2. [높음][L1] ...
```

## §6 위생 (§H)

- `_critique.md` 는 critique 전용 산출물 — `/gd-plan-start`·`/gd-plan-review` 의 auto-load 로스터는 이를 **무시**한다(비판 텍스트를 모델 일부로 오독 방지).
- stale 판정은 저장하지 않는다 — `prd.version` vs `_critique.prdVersion` 를 **읽을 때 비교**(stateless). prd 가 더 높으면 "critique 가 prd 보다 뒤처짐(stale)".

## §7 종료

- `docs/_critique.md` 작성(치명/높음/중간/낮음 카운트 포함). 채택 항목 반영 + version bump.
- 발견 0 건이면: "전제 검증 통과 — 결함 없음."
- 출력: `docs/_critique.md 작성 완료 (치명 N · 높음 M). 채택분 반영 후 다음 단계: /gd-plan-design. 전체 진행률: 전제 검증 완료.`
- **자동 진행 (confirm-then-advance)**: 위 출력 직후 "다음 단계 `/gd-plan-design`(디자인 시스템 픽)으로 바로 진행할까요?"라고 묻는다.
  - 사용자가 **긍정**(응/네/그래/ㅇㅇ/yes/y/진행 등)하면 → `.claude/commands/gd-plan-design.md` 를 읽어 같은 대화에서 즉시 이어 실행(슬래시 불필요).
  - **부정/모호**하면 → 정지. 슬래시 커맨드만 남긴다.
  - 직전 단계가 실제 done 일 때만 제안. `<!-- TODO -->` 등 미완 필드가 있으면 자동 진행 대신 보완을 먼저 안내.

<!-- gd:advance next=design -->
