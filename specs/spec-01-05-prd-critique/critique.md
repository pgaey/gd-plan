# Spec Critique: spec-01-05-prd-critique

## 1. 유사 기법 조사

### 발견된 패턴/도구
- **LLM Evaluators Recognize and Favor Their Own Generations (Panickssery et al., NeurIPS 2024)**: LLM 평가자가 *자기 출력*을 인식하고 더 높게 평가하는 self-recognition→self-preference 편향을 실증. — 현재 spec과의 비교: spec 의 북극성("저작자/검증자 분리")을 직접 뒷받침한다. **단 핵심 함의가 빠졌다** — 이 편향은 *같은 모델*이면 컨텍스트를 분리해도 잔존한다. spec 은 저작도 검증도 동일 모델(Opus)을 쓰므로 "컨텍스트 분리 ≠ 모델 분리"다. spec 이 주장하는 "분리"는 confirmation bias(대화 누적) 제거에는 강하나 model-level self-bias 는 못 없앤다. 이 한계를 spec 이 명시하지 않는다.
- **Pride and Prejudice: LLM Amplifies Self-Bias in Self-Refinement (arXiv 2402.11436)**: 동일 컨텍스트 self-refine 가 자기편향을 *증폭*함을 보임. — 비교: spec 이 in-context self-review 를 금지(FR1/Q1 불변식)한 결정은 이 연구와 정합. 좋은 선택.
- **Constitutional AI critique (Anthropic)**: 무작위 선택된 "원칙(constitution)"으로 출력을 비판→재작성. — 비교: spec 의 3렌즈(L1/L2/L3)는 사실상 경량 constitution 이다. 그러나 CAI 는 원칙을 *명시적 리스트*로 두는데, spec 의 렌즈는 산문 한 줄씩이라 판정 재현성이 약하다. 렌즈를 체크 가능한 원칙 항목으로 분해할 여지.
- **LLM-as-a-Judge best practices (Patronus / Deepchecks / W&B)**: (a) per-criterion 0–5 + 별도 overall 점수의 **severity 루브릭**, (b) chain-of-thought 근거 강제, (c) 외부 도구(검색·DB)로 **grounding** 해 fluency 편향·환각 차단. — 비교: spec 의 critique 보고서는 **severity 체계도, 출력 스키마도, grounding 메커니즘도 없다**. 특히 L2(규제 적합)는 "PIPA 법정필수" 같은 *외부 사실*을 판정해야 하는데 근거 소스(웹검색/관할 입력)가 없어 환각 위험이 크다.
- **Self-Refine / Reflexion**: 동일 에이전트의 반복 자기피드백. — 비교: spec 이 별도 커맨드/별도 컨텍스트로 분리한 것은 이들과의 의도적 차별화. 정합.

### 시사점
연구는 spec 의 *방향*(분리 > 동일컨텍스트 self-refine)을 강하게 지지한다. 그러나 두 가지를 보강해야 best practice 수준이 된다: **(1) severity 루브릭 + 보고서 출력 스키마**(현재 완전 미정), **(2) L2 의 grounding 경로**(규제 판정의 사실 출처). 또한 "분리"의 한계(동일 모델 self-bias 잔존)를 spec 이 정직하게 명시해야 한다 — 과대주장은 review 가 빠진 바로 그 함정("유창함이 정확함을 가림")의 메타 버전이다.

## 2. 요구사항 비판

### 누락
- **서브에이전트 입력 컨텍스트 범위 미정의**: FR1/3 은 "PRD 전제"라고만 한다. L1(루프 완결)은 capabilities+우선순위만으로 PRD 층에서 판정 가능하나, critique 는 design/flows *이전*에 실행되므로 flows/sitemap 은 입력이 없다. "subagent 가 받는 입력 = `prd.md`(+ `decisions.md`?) 단독"임을 명시해야 구현 해석이 갈리지 않는다.
- **L2 규제 판정의 근거 소스 부재**: "PIPA 위반", "법정필수 누락"을 판정하려면 관할·도메인 규제 지식이 필요하다. 웹검색 허용 여부도, 제약슬롯에서 관할(jurisdiction)을 입력받는 연결도 없다 → 환각된 규제 또는 누락 위험.
- **critique 보고서 출력 스키마 + severity 분류 부재**: review 는 P/S/V(BLOCK/WARN)를 갖는데 critique 는 "보고서"만 있고 발견 항목의 심각도(예: 법적차단 vs 권고)·형식이 전무하다. 사람-주도 triage(FR4)가 우선순위 없이 동작 불가.
- **LLM 판단의 테스트 전략 부재**: NFR3 는 "스키마 검증(Red→Green)"만 말한다. 스키마(frontmatter 존재, 파일 작성)는 검증되나 *critique 가 실제로 #1~#4 를 잡는가*는 검증 안 된다. 결함이 박힌 golden PRD fixture + 기대 발견 목록으로 회귀 고정하는 전략이 필요(없으면 핵심 가치가 무검증).
- **version bump 멱등·부분채택 의미 미정의**: FR4 는 "채택분만 반영"인데, 두 세션에 걸쳐 일부씩 채택하면 version 이 매번 bump 되는지·monotonic 인지·부분반영 시 _critique.prdVersion 과의 대조가 어떻게 되는지 규칙이 없다.
- **critique 선행조건 미정의**: prd 에 `<!-- TODO -->` 미완 필드가 있을 때 critique 를 막을지/경고할지 없음.

### 모순
- **"서브에이전트 강제→못 띄우면 멈춤"(FR1) ↔ "harness-kit 비의존·사용자 환경 동작"(NFR1)**: Agent tool 을 못 띄우는 환경(예: plain 환경)에서 "멈춤"은 사용자 가치 0 을 전달한다. prevention 목표 자체가 무력화. 더 깊게는, critique 는 soft(비차단) 철학인데 그 *수단인 서브에이전트만 hard gate* 라 철학 자체가 어긋난다. degrade 정직성(NFR4)과 availability 가 정면충돌.
- **"분리" 주장 ↔ 동일 모델 사용**: FR1 은 Opus 서브에이전트 = 저작자와 동일 모델 계열. spec 은 이를 "만든 자/검증하는 자 분리"라 표현하나, 연구상 컨텍스트만 분리되고 모델 self-bias 는 잔존. 하드 모순은 아니나 주장이 근거보다 강하다.

### 과잉 설계
- **version frontmatter + derived staleness + design soft-gate 3종 machinery**: 한 쌍(prd↔critique) 관계에 정수 version·두 지점 bump·읽기시 파생·design 진입 경고까지 붙는다. OOS 가 이미 일반 staleness 전파와 콘텐츠 해시를 기각했는데, 그러면 남는 건 "critique 가 현재 prd 대상으로 실행됐나" 단일 비트에 가깝다. v1 은 version 없이 critique 만 출하하고, gate/version 은 후속에서 붙여도 된다(YAGNI 중간 강도).

### 모호함
- **3렌즈 경계**: 결함 #4(성공기준 분모 측정가능)는 L1(의미)인가 L3(측정가능)인가? #2(타인 예약 열람)는 L2(보안/규제)인가 L1(가치 자기모순)인가? 렌즈가 겹쳐 triage 가 구현마다 갈린다. **tie-break 규칙**(예: 규제 관련이면 L2 우선) 필요.
- **"트랜잭션 완결성" 판정 기준**: critique 시점엔 flows 가 없다. "루프가 닫혔다"를 capability 리스트+우선순위만으로 어떻게 operational 하게 판정하는지 미정.
- **soft gate "1회 경고"의 상태 추적**: derived staleness 는 *읽을 때 파생*(stateless)이 설계 원칙인데, "1회"는 "이미 경고함" 플래그라는 *영속 상태*를 요구한다. 상태 없이 1회를 어떻게 보장하나 — stateless 원칙과 자체모순. 저장 위치 미정.
- **`_critique.md` ↔ `_review.md` 인접**: 둘 다 `docs/_*.md`. review/start 의 auto-load 로스터가 _critique 를 어떻게 취급하는지(무시/표시) 미명시 → review 가 우발적으로 읽을 가능성.

## 3. 대안 제안

### 대안 A: review 의 한 모드로 통합 (`review --semantic`)
- **아이디어**: 별도 커맨드 대신 review 에 의미 정합 모드를 추가, 한 검증 표면에서 structural+semantic 을 분기.
- **장점**: 스킬 수 억제, 보고서 1곳, 진입점 단순.
- **단점**: 결정적(lint)·BLOCK 가능한 review 와 비결정적·soft 인 critique 를 한 커맨드에 섞어 "2층 분리"라는 북극성을 흐린다. spec 이 명시적으로 분리를 가치로 두므로 이 대안은 핵심을 훼손. **기각이 타당**.

### 대안 B: 체크리스트 self-critique 를 degrade 티어로 (강제 대신 폴백)
- **아이디어**: 서브에이전트를 못 띄우면 "멈춤" 대신, 명시적 정직성 배너("독립 검증 불가 — in-context 점검이라 self-bias 잔존") 하에 constitution 식 체크리스트를 메인이 항목별로 강제 답변.
- **장점**: NFR1 모순 해소(어디서나 동작), 가치 0 회피, degrade 정직성 충족.
- **단점**: 연구상 동일컨텍스트 self-critique 는 분리보다 약하다 — 폴백을 *기본*으로 오용하면 spec 의 의미가 사라짐. 폴백임을 강하게 표지해야.

### 대안 C: 다중 페르소나 패널 (규제담당/보안/실사용자)
- **아이디어**: 단일 서브에이전트 3렌즈 대신, L2 를 "DPO/법무" 페르소나, L1 을 "실사용자" 페르소나 등 역할별 서브-크리틱으로 분리.
- **장점**: role prompting 이 도메인 결함(특히 #2·#3 규제) 발굴을 높임. L2 grounding 을 "법무" 페르소나에 자연스럽게 귀속.
- **단점**: 오케스트레이션·토큰 증가, 발견 중복 dedupe 필요. v1 엔 과할 수 있음.

## 권장안
**현재 spec 유지 + 3개 보강** (대안 B 를 *폴백 티어*로 흡수, C 는 후속). 분리-커맨드+서브에이전트 골격은 연구가 지지하는 핵심 자산이므로 유지하되: **(1) "멈춤"을 대안 B(정직성 배너+체크리스트 폴백)로 교체**해 NFR1 모순 해소, **(2) critique 보고서에 severity 루브릭+출력 스키마 명문화**(review 의 P/S/V 대응), **(3) L2 grounding 경로 + 입력 컨텍스트 범위 명시**. 부차적으로 version/soft-gate machinery 는 YAGNI 재검토(v1 축소 후 후속 확장 가능). "분리=컨텍스트 분리이지 모델 분리 아님"을 spec 에 정직히 기재.

## 4. ADR 후보 추출
- [x] **후보 발견**: `critique-vs-review-separation` — type: convention — 이유: cross-spec·long-lived 검증 아키텍처 정의("구조적 완성 ≠ 의미적 정합", 의미층/구조층 2분리)로 6개월+ 유지 확실.
- [x] **후보 발견**: `author-verifier-separation` — type: invariant — 이유: 저작자≠검증자 원칙. 단 spec 의 `independent-subagent-mandatory`(강제·멈춤)는 NFR1 모순으로 재프레이밍 필요 → "독립 컨텍스트 우선 + 정직한 degrade" 불변식으로 박는 게 장기 자산성이 높다.
- [ ] **후보 조건부**: `prd-version-derived-staleness` — type: convention — 이유: YAGNI 재검토 대상이라 6개월 생존 불확실. version machinery 를 v1 에 확정하면 ADR화, 축소하면 보류 권장.

---

## Sources
- [LLM Evaluators Recognize and Favor Their Own Generations (NeurIPS 2024)](https://proceedings.neurips.cc/paper_files/paper/2024/file/7f1f0218e45f5414c79c0679633e47bc-Paper-Conference.pdf)
- [Pride and Prejudice: LLM Amplifies Self-Bias in Self-Refinement](https://arxiv.org/pdf/2402.11436)
- [Constitutional AI (overview)](https://www.gigaspaces.com/data-terms/constitutional-ai)
- [LLM-as-a-Judge Best Practices (Patronus)](https://www.patronus.ai/llm-testing/llm-as-a-judge)
- [What Is LLM As A Judge (Deepchecks)](https://www.deepchecks.com/what-is-llm-as-a-judge-strategies-impact-and-best-practices/)
- [When Can LLMs Actually Correct Their Own Mistakes? (TACL)](https://direct.mit.edu/tacl/article/doi/10.1162/tacl_a_00713/125177/)
