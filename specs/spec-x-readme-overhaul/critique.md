# Spec Critique: spec-x-readme-overhaul

## 1. 유사 기법 조사

### 발견된 패턴/도구

- **표준 README 골격 (15-section 컨벤션)**: 거의 모든 가이드가 수렴하는 핵심 순서는 `제목 → 한줄설명 → (데모) → 무엇/왜 → 설치 → 사용법 → 명령 레퍼런스 → 기여 → 라이선스` 다. — 현재 spec과의 비교: spec 의 16절은 이 골격을 **모두 포함**하면서 "언제 쓰나/대상", "검증 2층", "배포 footprint", "gen-design 배경" 같은 도메인 특화 절을 더한 superset 이다. 표준 대비 누락은 없고 오히려 풍부한 쪽. 단 표준이 권하는 **데모/스크린샷(또는 asciinema)**, **목차(ToC)**, **기여 가이드(CONTRIBUTING)** 가 16절 목록에 명시되지 않았다.
- **Progressive disclosure (점진적 공개)**: README 는 "문서가 아니라 진입점" — 처음엔 단순하게, 깊이는 링크로 위임하라는 원칙. — 현재 spec과의 비교: spec 의 "stale 0" + 16절 자기완결 목표는 README 를 **레퍼런스 매뉴얼화**하는 방향(명령 전수 표·footprint 전수)으로 기울 위험이 있다. 명령 9개 + gd 3개 + get.sh 3옵션을 한 README 안에 다 넣는 것은 progressive disclosure 와 약한 긴장 관계.
- **Diátaxis 4분면 (tutorial/how-to/reference/explanation)**: 문서를 4종으로 분리하되 **섞지 말라**(mixing 이 혼란의 1위 원인). — 현재 spec과의 비교: spec 의 단일 README 16절은 4종을 한 파일에 **의도적으로 혼합**한다(시작하기=tutorial, 명령요약=reference, 핵심개념·배경=explanation). 단일 README 단계에서는 정상이나, README 가 16절로 비대해지면 Diátaxis 관점에서 "분할 신호"로 읽어야 한다.
- **harness-kit README 16절 거울 (현재 채택안)**: 검증된 형제 프로젝트 구조를 그대로 차용. — 비교: 외부 표준이 아니라 **단일 사례(n=1) 모방**이다. harness-kit 은 "프로세스 레이어" 도구라 절 구성이 거기에 최적화돼 있어, "콘텐츠 레이어"인 gd-plan 에 1:1 거울이 항상 맞는다는 보장은 없다(예: harness-kit 에 의미 있는 절이 gd-plan 엔 공허할 수 있음).

### 시사점
spec 의 16절은 업계 표준의 superset 이라 **구조적 결함은 없다**. 진짜 리스크는 구조가 아니라 (a) progressive disclosure 와의 긴장 — 전수 표를 README 에 다 담아 비대해지는 것, (b) "16절"이라는 숫자 자체를 목표로 삼아 도메인에 공허한 절까지 채우는 것이다. "harness-kit 거울"은 출발 템플릿으로만 쓰고, 절 채택 여부는 gd-plan 도메인 기준으로 재판단해야 한다.

## 2. 요구사항 비판

### 누락
- **버전 SoT 오기**: NFR1 이 "버전 `VERSION`/`version` 출처"라 적었으나 **루트에 `VERSION` 파일은 존재하지 않는다**. 실측 SoT 는 `package.json`(`0.1.0`) 단일이며, `.gd/VERSION` 은 `install.sh:131`이 설치 시점에 생성한다. 교차검증 대상을 "package.json = SoT, `.gd/VERSION` = 설치 산출물"로 정정해야 한다. 이대로 두면 stale 0 검증 자체가 잘못된 소스를 가리킨다.
- **명령 소스 경로 오기 (치명)**: FR3·plan·task 가 9 슬래시 커맨드 교차검증 소스를 `.claude/commands/gd-plan-*.md` 로 지정했으나, 실제 9개는 **`plans/gd-plan-*.md`** 에 있다. `.claude/commands/` 에는 harness-kit 의 `hk-*` 만 있다(현재 README 는 `plans/` 로 올바르게 적시). 수동검증 시나리오 1(`README 표 ↔ .claude/commands/` 1:1)은 **빈 디렉토리와 대조하게 되어 0건 매칭**으로 통과해버리는 false-negative 다.
- **배지 부재 → 신규 추가 암묵 요구**: 현재 README 엔 배지가 0개(curl URL 만)다. FR1 ①"헤더/배지"는 사실상 신규 배지 추가를 요구하나, 어떤 배지(version/license/CI)를 어디서 끌어올지 미명시. alpha·CI 미검증 단계에서 깨진 배지는 역효과.
- **목차(ToC) 부재**: 16절짜리 긴 문서엔 ToC 가 표준 권장이나 FR 에 없음.
- **스크린샷/예시 산출물 부재**: 업계 표준이 강하게 권하는 데모(`docs/prd.md` 등 실제 생성물 예시 1개)가 Out of Scope 로도, FR 로도 다뤄지지 않음. gd-plan 은 "문서를 생성하는 도구"라 산출물 예시 1개가 온보딩에 결정적인데 비어 있다.

### 모순
- **"전면 재작성" ↔ "stale 0"의 긴장**: 현재 README 는 본문 내용이 대부분 정확하다(컬렉션 66 ✅, 설치 footprint ✅, plans/ 경로 ✅, gd 서브커맨드 ✅). 실제 stale 은 **헤더의 "5종 문서"(본문은 9커맨드), "ADR-001~015"(실제 016까지)** 정도의 국소 결함이다. "전면 재작성"은 정확한 본문까지 새로 쓰며 **새 stale 을 유입할 위험**을 만든다 — 문제 규모(국소 3건)와 처방(전면)의 비대칭.

### 과잉 설계
- **16절 × alpha 성숙도**: 프로젝트는 `0.1.0`, e2e 미검증(Out of Scope 가 "미용실 실증" 별도 phase 로 명시), CI 배지도 없는 단계다. 이 성숙도에서 16절 자기완결 온보딩 문서는 **문서가 코드보다 앞서가는** 전형적 과투자다. 특히 ⑨"설치 footprint", ⑪"대상 환경/의존성", ⑫"배포 모델"은 ADR-016 / `docs/RELEASE.md` 로 위임 링크 1줄이면 충분한데 별도 절로 승격하면 README 가 레퍼런스 매뉴얼화된다.
- **명령 전수 표 3종 합본**: 슬래시 9 + gd 3 + get.sh 3옵션을 한 README 표에 모두 담으라는 FR3 는 progressive disclosure 역행. get.sh 옵션은 `get.sh --help` 가 이미 출력하므로 README 중복.

### 모호함
- **"stale 0"의 검증 방법**: "교차검증해 일치"라고만 하고 **자동/수동 여부, 합격 게이트**가 불명확. 수동 grep 이면 재발 방지력이 없다. plan 의 수동검증 시나리오 4개는 1회성 점검이지 회귀 방지가 아니다(다음 패치에서 또 stale 발생). "lint 스크립트로 카운트 assert" 같은 항구적 게이트인지, 1회 점검인지 spec 이 답하지 않는다.
- **"mermaid 흐름도 범위"**: FR4 가 9단계 파이프라인 mermaid 를 요구하나, 단순 선형(`start→prd→…→review`)인지, critique/review 의 BLOCK 분기·반복 루프까지 그리는지 미명시 → 구현자 해석 갈림.
- **"16절 거울"의 충실도**: harness-kit 절을 어디까지 1:1 따르고 어디서 도메인 치환하는지 기준 부재 — "거울"이 강제인지 가이드인지 모호.

## 3. 대안 제안

### 대안 A: 외과적 패치 (Surgical Patch)
- **아이디어**: 전면 재작성 대신 실측된 국소 stale 3건(헤더 "5종 문서"→"9 스킬", "ADR-001~015"→"016", spec-13-01 잔재 참조)만 수정하고, 누락된 "언제 쓰나/대상" 절 1개만 신규 삽입한다.
- **장점**: 정확한 본문 보존(새 stale 유입 0), 최소 diff 로 리뷰 쉬움, 문제 규모에 정확히 비례, alpha 단계에 적정.
- **단점**: 온보딩 흐름의 구조적 재편(개념→대상→설치 순서 최적화) 효과는 못 얻음. "기획 앞단 적용 조건"이 FAQ 형태로만 들어가 덜 두드러질 수 있음.

### 대안 B: 분할 (README 슬림 + 위임 링크, Diátaxis-lite)
- **아이디어**: README 는 ①~⑧(정체성·대상·개념·설치·시작하기)까지만 슬림하게 두고, ⑨footprint·⑩명령전수·⑫배포·⑭배경은 `docs/` 하위 문서(또는 기존 ADR-016·RELEASE.md)로 링크 위임한다.
- **장점**: progressive disclosure 준수, README 비대화 방지, Diátaxis(reference 분리) 정렬, 명령 레퍼런스는 `get.sh --help`·`gd --help` 와 단일 출처화.
- **단점**: "자기완결 README" 목표는 일부 포기, 신규 `docs/` 파일 생성 작업 추가.

### 대안 C: 현행 16절 전면 재작성 (spec 그대로)
- **아이디어**: spec 명세대로 harness-kit 16절 거울로 전면 재작성.
- **장점**: 형제 프로젝트와 구조 통일, 한 파일 자기완결, "언제 쓰나" 등 통찰 영구 보존이 가장 강하게 박힘.
- **단점**: 과투자(alpha 대비), 정확한 본문 재작성 중 새 stale 유입 위험, progressive disclosure 역행, 소스경로·VERSION 오기를 그대로 안고 가면 검증이 헛돈다.

## 권장안
**대안 A(외과적 패치)를 기본으로, "언제 쓰나/대상" 절 + 흐름 mermaid 만 대안 B 식으로 신규 추가** 하는 혼합안을 권장한다.

근거: (1) 실측 결과 현재 README 의 stale 은 본문이 아니라 **헤더 3건 국소**다 — 전면 재작성은 처방 과잉이자 새 stale 유입 위험. (2) spec 이 진짜로 메우려는 가치 공백은 "언제 쓰나/대상"(기획 앞단 적용 조건) 단 하나이고, 이건 절 1개 추가로 해결된다. (3) alpha·e2e 미검증 단계에서 16절 레퍼런스 매뉴얼은 문서가 코드를 앞서는 과투자다. **단, spec 을 그대로 진행하기로 한다면 최소한 두 사실 오류(`.claude/commands/`→`plans/`, `VERSION 파일`→`package.json`)를 NFR1·FR3·plan·task 에서 먼저 정정**해야 stale 0 검증이 유효해진다 — 이는 권장안과 무관하게 **필수 수정**이다.

## 4. ADR 후보 추출
- [x] 후보 없음 — constitution §6.4 기준 `decision`/`invariant`/`convention`/`tradeoff` 어디에도 해당하는 **장기 자산 결정이 없다**. docs-only 정리이며 새 아키텍처 선택이 없다. "기획 앞단 적용 조건" 통찰은 본질적으로 README 본문(설명형)에 보존하는 것이 옳고 ADR 승격 불요 — spec 의 판단(§6.3 routine decision 은 본문 보존)에 동의. (참고: 만약 권장안과 달리 "README 를 harness-kit 거울 16절로 유지한다"를 **항구적 컨벤션**으로 못박는다면 `convention` 타입 ADR 후보가 될 수 있으나, n=1 모방을 컨벤션화하는 것은 시기상조라 비권장.)

---
출처: [15 Essential README Sections (dev.to)](https://dev.to/georgekobaidze/15-essential-sections-every-readme-needs-give-your-project-what-it-deserves-fie) · [How to Structure Your README (freeCodeCamp)](https://www.freecodecamp.org/news/how-to-structure-your-readme-file/) · [How to Structure a Valuable README (Atomic Spin)](https://spin.atomicobject.com/valuable-readme/) · [Effective Onboarding Documentation (OneUptime)](https://oneuptime.com/blog/post/2026-01-25-effective-onboarding-documentation/view) · [Diátaxis — Start here](https://diataxis.fr/start-here/) · [What is Diátaxis (I'd Rather Be Writing)](https://idratherbewriting.com/blog/what-is-diataxis-documentation-framework)
