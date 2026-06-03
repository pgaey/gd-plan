# Spec Critique: spec-13-01

> 독립 시니어 아키텍트 검토. 작성일 2026-05-29. 코드 교차검증 + 웹 리서치 기반.
> 코드 교차검증 결과(ground-truth): `design-md-collection/` = **66 파일**(spec 본문 "60+" 표기, plan 은 66 으로 정정됨), `gd-chat.md` = **598 줄**(spec F9 의 "~400, ≤500" 예산 stale, plan 이 ≤700 으로 재합의 제안), `_index.json` **미존재**(신규), collection 파일은 **frontmatter 없는 순수 마크다운**(`# Design System Inspired by X` 로 시작, 평균 ~268 줄, 최대 linear.app.md 367 줄), `domain/tone/density` 키워드는 이미 **본문 산문에 인라인**으로 존재.

## 1. 유사 기법 조사

### 발견된 패턴/도구

- **GitHub spec-kit `/speckit.analyze` + `/speckit.clarify`**: spec-driven 워크플로우(constitution → specify → clarify → checklist → plan → analyze → tasks → implement)에서 `analyze` 가 **여러 산출물(spec/plan/tasks) 간 cross-document 일관성·중복·충돌·커버리지 갭**을 정적 검사하고, `clarify` 는 underspecified 영역을 구조적 질문으로 메운다. — 현재 spec 과의 비교: gd-plan-review(F6) 가 사실상 `analyze`(structural BLOCK = 커버리지 갭/충돌)이고, gd-plan-prd/flows 인터뷰가 `clarify` 다. **차이점**: spec-kit 은 BLOCK 을 강제 게이트로 두지 않고 "treat as quality gate" 정도의 권고이며, 사용자가 skip 의사를 명시하면 통과시킨다. 또한 traceability 를 "requirement number ↔ task" 식 ID 로 명시적으로 박는다. 현재 spec 의 BLOCK 은 더 강한 차단인데 **추적 ID 체계(capability에 안정적 식별자)가 없어 재현성/회귀가 약함**.

- **shadcn registry (flat JSON) + `llms.txt` + `shadcn info --json` 컨텍스트 주입**: 디자인 시스템(컴포넌트+토큰)을 **머신 리더블 JSON 1 파일**로 배포하고, v0/Cursor/Windsurf 가 이 registry 를 컨텍스트로 받아 "design system 위에서만" 코드 생성. `llms.txt` 는 LLM 전용 인덱스, `shadcn info --json` 은 프로젝트 설정을 어시스턴트 컨텍스트에 주입. — 현재 spec 과의 비교: `_index.json`(F3) = registry 인덱스, design.md "전체 복사" = registry payload 를 프로젝트에 인라인하는 행위, F9 주입 = `shadcn info --json` 주입과 동형. **차이점**: shadcn 은 design system 을 **참조(포인터+CLI fetch)** 로 다루고 코드 생성 시점에 끌어온다. 현재 spec 은 `docs/design.md` 에 **367 줄 전체를 복사**(스냅샷)한다 → 업스트림 collection 개선이 기존 프로젝트에 전파 안 되는 drift 발생(아래 3-A 대안 근거).

- **Lovable "Knowledge Base" / v0 Project design system / ChatPRD**: 프로젝트별 디자인 가이드라인·기능 정의를 KB 에 넣어 생성 일관성 확보. ChatPRD 는 PRD 를 milestone 단위로 쪼개 v0/Lovable/Bolt 로 단계적 프로토타이핑(한 번에 전체 생성 회피). — 현재 spec 과의 비교: 5 종 문서 = 구조화된 KB. **차이점**: 업계 도구는 PRD→프로토타입을 **느슨하게 연결**(주입은 하되 차단은 안 함). 현재 spec 의 강점은 **차단(F6/F9 sitemap 검증)** 으로 일관성을 강제하는 점이며, 이게 USP 인 동시에 마찰 리스크.

- **Typeform RnD: 프로토타이핑 도구에 design system 강제 적용 사례**: v0/Bolt 결과가 들쭉날쭉한 문제를 design system 토큰/컴포넌트 주입으로 production-align 시킨 실무 후기. — 현재 spec 과의 비교: spec §배경의 "v0/Lovable 대비 일관성 강제" USP 가 업계에서도 동일하게 식별된 실제 통점임을 뒷받침(가설 검증됨).

- **요구사항 추적 / Term Extraction (arXiv 1506.08789)**: 자연어 요구사항 간 추적성을 용어 추출로 자동화. — 현재 spec 과의 비교: F6 의 "capability ↔ page ↔ flow" 매핑이 정확히 이 추적 문제. 현재 spec 은 매핑을 LLM(consistency-critic)에 맡기는데, **용어 정규화(동의어/표기흔들림) 처리 부재** → BLOCK 오탐/누락 가능.

### 시사점

- **추적 ID 도입**: PRD capability 에 안정적 ID(`CAP-1` 등)를 부여하고 structure.md page/flow 가 이를 역참조하면, F6 BLOCK 이 **LLM 의미판단 → 결정적 set-diff** 로 바뀌어 재현성·회귀테스트가 가능해진다(spec-kit traceability + arXiv term-extraction 의 합).
- **design.md = 복사 vs 참조 재검토**: shadcn registry 의 "포인터 + 빌드시 fetch" 모델이 drift 를 구조적으로 막는다. 현재의 "367 줄 전체 복사"는 단순하지만 collection 업데이트 전파 불가. 최소한 `pickedFrom` + `sourceHash`(또는 version)를 frontmatter 에 박아 stale 감지 훅을 남길 것.
- **차단 강도 캘리브레이션**: spec-kit 도 cross-doc 분석을 강제 게이트로 두지 않고 skip 의사 명시로 우회시킨다. 현재의 `--force-continue` 는 있으나 "왜 BLOCK 됐는지/어떻게 고치는지"가 결정적이지 않으면 사용자가 그냥 항상 force 하게 됨 → 차단의 가치 소실.

## 2. 요구사항 비판

### 누락

- **추적 ID 부재(최중요)**: F6 의 3 개 structural BLOCK 은 모두 "X 가 Y 에 매핑되는가"인데, 매핑 키가 자연어 텍스트(capability 문구, page 이름)뿐이다. 표기 흔들림("관리자 통계" vs "통계 대시보드")에 BLOCK 이 흔들린다. → capability/page/flow 에 안정적 식별자와 명시적 역참조 필드 필요.
- **`_index.json` stale 감지 메커니즘 부재**: NFR8 은 "파일 추가/수정 시 재생성"을 *요구*하지만, 누가 어떻게 stale 을 *감지*하는지 없다(빌드 시 mtime/hash 비교? gd-plan-design 진입 시 검증?). collection 66 파일이 인덱스보다 새로우면 잘못된 후보 3 을 추천. → 인덱스에 `collectionHash`/파일 mtime 저장 + gd-plan-design 진입 시 mismatch 경고.
- **인터뷰 중단·재개 상태 모델 부재**: gd-plan-prd/flows 는 멀티턴 인터뷰인데, 세션 끊김 후 어디부터 재개하는지 없다. F1 "idempotent"는 "재실행 안전"만 보장하지 "부분 진행 복원"은 아니다. → prd.md/flows 에 미완 섹션 마커(`<!-- TODO: 성공기준 -->`) 또는 진행 상태를 project.md 에 기록.
- **5 종 문서 간 버전/동기화 충돌 처리 부재**: prd.md 를 나중에 고치면 이미 만든 structure/flows/ui-rules 가 stale 이 된다. NFR2 는 prd↔project.md 동기화만 다루고, **prd→하위 4 문서 stale 전파**는 미정의. design.md(복사본)도 마찬가지. → gd-plan-review 에 "상위 문서가 하위보다 newer" staleness 체크 추가(WARN), 또는 문서별 `dependsOn` + mtime.
- **에러/실패 경로 미명세**: collection 파일 파싱 실패, `_index.json` 손상/스키마 불일치, docs/ 일부 누락, FRONT.md 부재 시 동작 정의 없음. 특히 F9 주입은 5 종 문서 중 일부만 존재하는 부분 상태가 흔할 텐데(start→prd 만 하고 chat) fallback 미정의.
- **F9 "해당 scene 섹션만 grep" 의 검색 계약 부재**: scene 이름 ↔ structure.md 페이지 헤딩 매칭 규칙(정확일치/부분/슬러그 정규화)이 없다. landing scene 이 structure.md 에 "랜딩"/"메인"/"Home" 중 무엇으로 있어도 잡히는가? → 매칭 규칙 명문화 또는 scene↔page 명시 매핑 필드.
- **다국어**: NFR3 "한국어 우선"만. collection 66 파일은 영어, FRONT.md 어휘는 영어 식별자. 인터뷰는 한국어. design.md 톤 키워드(영어)와 prd persona 톤(한국어) 불일치를 F6 wording WARN 이 어떻게 비교하는지 불명(언어 경계). 다국어 프로젝트(영문 사이트) 시나리오는 명시적 out-of-scope 처리 권장.
- **`_review.md` 의 멱등/재실행 시 처리**: review 재실행 시 append 인가 overwrite 인가(다른 산출물은 멱등 규칙 있으나 _review.md 만 모호). 날짜 헤더가 누적되면 BLOCK 판정 소스가 흐려짐.

### 모순

- **F9 §번호 vs 실제 gd-chat.md 구조(확인됨)**: spec F9 는 "§2 컨텍스트 로드 / §7.8 / §8 chat.md 생성"을 전제하나, 실제는 컨텍스트 로드=**§1**, §7.8 없음, §8=History walkthrough(생성 아님). plan 이 재매핑(§1/신규§5.10/§6~8/§12)으로 정정했으나 **spec 본문은 여전히 틀린 번호** → spec DoD 의 "§7.8 신규" 항목이 현실과 모순. spec 본문 갱신 필요.
- **본문 길이 예산 모순(확인됨)**: F9/NFR5 "gd-chat 현 ~400, +80→≤500". 실제 598 줄 + 80 = ~680. plan 은 ≤700 으로 재합의 제안. spec 의 500 cap 은 시작부터 위반 상태.
- **NFR1(chat.md SSOT) vs NFR2(prd.md SSOT)**: NFR1 은 "chat.md SSOT, docs 는 input", NFR2/ADR-C 는 "prd.md 가 SSOT". 두 SSOT 가 공존. 의도상 "레이어별 SSOT"(prd=기획 SSOT, chat=scene SSOT)지만 용어가 충돌 → "SSOT" 대신 "상류 SSOT / 하류 SSOT" 또는 "authoritative source per layer"로 정리 필요.
- **"idempotent" vs 멀티턴 인터뷰**: 인터뷰 스킬은 본질적으로 대화 상태에 의존 → 같은 입력에 같은 출력이라는 좁은 의미의 idempotent 와 긴장. "재실행 시 기존 docs 를 덮지 않고 병합/확인"이라는 운영적 정의로 좁혀야 모순 해소.

### 과잉 설계 (YAGNI)

- **7 스킬 분할 입도**: start/prd/design/structure/flows/rules/review 7 개. design 의 산출물은 사실상 "collection 1 개 복사 + frontmatter"(인터뷰 거의 없음), rules 는 "design.md 수치 추출 + 약간의 인터뷰"로 structure/design 과 강결합. **start(안내)·review(검증)는 인터뷰 아님** → 인터뷰 스킬은 실질 3 개(prd/structure/flows). 7 개 슬래시 명령은 사용자 기억 부담·설치 표면·테스트 매트릭스를 키운다. design+rules 병합, start 를 gd-plan(인자 라우팅)으로 축소 가능. (단, 단계별 진행률 UX 가 의도면 유지 정당.)
- **스킬 내부 Sonnet/Opus 서브에이전트 오케스트레이션(F5 Layer1)의 현실성**: 슬래시 스킬은 마크다운 가이드다. "스킬 내부에서 Sonnet 서브 / Opus 서브를 호출"이 **런타임에 실제로 모델 스위칭을 보장하는가**는 실행 환경 의존(에이전트가 Task/서브에이전트를 띄울 수 있어야 함). 보장 불가하면 이는 "권장 톤"에 불과 → spec 이 모델 예산을 *요구사항*으로 박으면 검증 불가능한 DoD 가 된다. layout-thinker(Opus, "복잡 페이지에서만")는 특히 트리거 기준이 모호하고 가치 대비 복잡. → F5 Layer1 을 "권장 모델 힌트(non-normative)"로 강등하거나, 실제로 서브에이전트 스폰이 보장되는 항목(design-scanner, review-critic)만 normative 로.
- **F5 Layer2(메타 비판) 를 spec 요구사항에 포함**: "본 spec 자체가 Opus critic 으로 검토되었음"은 *프로세스 회고*지 *제품 요구사항*이 아니다. spec 본문/DoD 에 들어갈 항목이 아니라 plan/워크플로우 메모. ADR-E 도 이 Layer2 를 결정으로 묶는데, 제품 invariant 와 작성 프로세스를 섞음.
- **하이브리드 차단 7 체크 전부 v1 필수?**: structural 3 개(BLOCK)는 핵심. 그러나 wording(persona 톤 vs design 톤), completeness(empty/loading/error 누락)는 LLM 주관 판정이라 오탐 많고 가치 불확실 → v1 은 structural BLOCK + style WARN 만, wording/completeness 는 v2. 6 개 ADR 도 과다(아래 §4).
- **design.md "전체 복사" 자체**: 367 줄 복사본을 프로젝트마다 박는 것 = registry 안티패턴. F9 주입 시 "design.md 전체"를 매번 컨텍스트에 넣으면 토큰 비용↑. 인덱스 요약 + 필요 섹션만 주입으로 충분할 수 있음(YAGNI 경계의 반대편: over-copy).

### 모호함

- **F9 "해당 scene 섹션만 grep"**: 위 누락과 동일 — grep 패턴/매칭 규칙 미정. "섹션만"의 경계(헤딩~다음 동급 헤딩?)도 불명. 재현 불가.
- **F6 BLOCK 판정의 재현성**: consistency-critic(LLM)이 "capability 가 어떤 페이지로도 매핑 안 됨"을 판정. 같은 입력에 매번 같은 BLOCK 이 나오는가? 온도/문맥에 흔들리면 시나리오3(차단 검증) 테스트가 flaky. → 결정적 규칙(ID set-diff)으로 내리거나, critic 출력에 "근거 인용(어느 줄)"을 강제해 검증 가능화.
- **design.md "전체 내용 복사"**: 무엇을 기준으로 "전체"인가(파일 통째? 특정 섹션 제외?). frontmatter 와 본문 H1("# Design System Inspired by X")이 중복/충돌하는지, 사용자가 복사본을 편집하면 재픽 시 덮어쓰는지(멱등 충돌) 불명.
- **"수치 자동 추출"(gd-plan-rules, F9)**: design.md 산문에서 "120px / 180ms / radius 24px"를 추출 — 정규식? LLM? collection 파일은 산문+코드블록 혼재(airbnb.md 확인: "8px–32px", "180ms" 등 자연어 서술). 추출 정확도/충돌(여러 수치 등장) 처리 미정.
- **진행률 "N/7"의 정의**: 파일 존재 기준? 내용 완성도 기준?(prd.md 가 빈 템플릿이면 1/7 인가 0/7 인가) gd-plan-start 의 진행률 산정 규칙 불명 → idempotent 안내 일관성 저해.
- **"차단"의 실효 범위**: F9 사전검증 "structure.md 에 scene 없으면 차단"은 gd-chat *스킬 가이드*가 차단하라는 지시인데, 사용자가 무시하고 chat.md 를 손으로 쓰면? 차단은 권고이지 enforce 아님 → "차단"이 실제로 무엇을 막는지(파일 생성? 컴파일? 안내만?) 명시 필요. (cf. gd-cli lint 는 실제 종료코드로 enforce — 차단을 lint 단으로 내릴 여지.)

## 3. 대안 제안

### 대안 A: 참조 모델 design.md (복사 → 포인터 + 빌드시 주입)
- **아이디어**: `docs/design.md` 에 collection 367 줄을 복사하지 않고, frontmatter(`pickedFrom`, `sourceHash`, `reason`)만 둔다. F9 주입/렌더 시점에 `_index.json`(요약)을 기본 컨텍스트로, 필요하면 원본 파일을 fetch. shadcn registry + `shadcn info --json` 모델.
- **장점**: collection 업데이트 자동 전파(drift 제거), 프로젝트 repo 경량, F9 토큰 비용↓(요약만 주입), stale 감지가 sourceHash 비교로 결정적.
- **단점**: 프로젝트가 collection 패키지에 런타임 의존(오프라인/버전핀 필요), "한 파일 열면 디자인 전부 보임"의 직관 상실, 사용자 편집 지점이 frontmatter 로 제한.

### 대안 B: 추적 ID 기반 결정적 review (LLM critic → set-diff lint)
- **아이디어**: PRD capability 에 `CAP-n` ID, structure.md page 에 `serves: [CAP-1, CAP-3]`, flow step 에 `page: <id>`. gd-plan-review 의 structural BLOCK 3 개를 LLM 판정이 아닌 **결정적 set-diff**(gd-cli lint 서브명령)로 구현. style/wording 등 주관 항목만 LLM(WARN).
- **장점**: BLOCK 재현 100%(시나리오3 flaky 제거), 회귀테스트 가능, lint 종료코드로 실제 enforce(권고→강제), spec-kit traceability 모범사례 정합.
- **단점**: 문서에 ID 메타 작성 부담(인터뷰가 ID 채우기까지 해야 함), 자유 산문 기획의 가벼움 일부 상실, 초기 구현량↑(set-diff 검증기).

### 대안 C: 스킬 통합 + 모델힌트 비규범화 (7→4 스킬, F5 Layer1 강등)
- **아이디어**: start 를 `gd-plan`(서브명령 라우팅)으로, design+rules 를 `gd-plan-design`(픽킹+수치추출 일괄)로 병합 → 인터뷰3(prd/structure/flows)+design+review = 5 슬래시, 또는 더 공격적으로 4. F5 Layer1 모델 지정은 normative 요구에서 빼고 "권장 힌트"로. 메타비판(Layer2)은 spec 에서 제거(plan 메모로).
- **장점**: 설치/기억/테스트 표면↓, 검증 가능한 DoD(모델 스위칭 미보장 항목 제거), 단계 흐름은 진행률 안내로 유지.
- **단점**: 단계별 "다음: /gd-plan-X" UX 의 명료함 약화, design+rules 결합으로 한 스킬 책임 증가, 사용자가 이미 7 단계 README 에 익숙해졌다면 변경 비용.

## 권장안

**대안 B(추적 ID 기반 결정적 review)를 코어로 채택 + 대안 A 의 `sourceHash` 만 부분 수용(복사 자체는 유지) + 대안 C 는 보류**.

이유:
- 본 spec 의 *존재 이유*와 USP 는 "일관성 강제"(F6/F9 차단)다. 그런데 차단이 LLM 주관 판정이면 재현 불가→사용자가 신뢰 못 하고 `--force-continue` 남발→USP 붕괴. **차단의 결정성(대안 B)이 가치의 핵심 의존성**이다. 이게 가장 큰 레버.
- design.md "전체 복사"는 직관적 UX 자산이라 v1 에서 굳이 깨지 않되(대안 A 전면 채택 보류), `sourceHash`/`pickedVersion` 한 줄만 frontmatter 에 추가하면 drift 를 *감지*는 할 수 있다(저비용 고효용). 전면 참조 전환은 spec-13-02/03(resync) 와 함께 재논의.
- 대안 C(7→4 통합)는 매력적이나 단계별 진행률이 의도된 핵심 UX 라 v1 파괴 비용이 크다. **단, F5 Layer1 모델 지정의 비규범화와 Layer2 제거는 즉시 반영 권장**(검증 불가 DoD 정리).
- 즉, "현재 골격 유지 + 차단을 결정적으로 + stale 감지 한 줄 + 검증불가 요구 정리"가 최소 변경·최대 효과.

## 4. ADR 후보 추출

> spec 은 이미 6 개 ADR 후보를 박았다. cross-spec/6 개월+/`type:` 어휘 기준으로 재평가하면 **6 개는 과다**. 아래는 통폐합·추가 의견.

- [x] **유지(invariant)**: `prd-is-upstream-ssot-chat-is-downstream-ssot` — type: **invariant** — 이유: 레이어별 authoritative source 경계는 6 개월+ 불변, NFR1/2 모순을 해소하는 핵심 규약(기존 ADR-C 를 invariant 로 격상·명칭 정리).
- [x] **유지(decision)**: `design-md-as-picker-library-not-reference-doc` — type: **decision** — 이유: collection 을 "선택 카드 라이브러리"로 본다는 결정 = 제품 정체성, cross-spec(13-02/03 전제). 기존 ADR-A+B 통합.
- [x] **유지(tradeoff)**: `review-blocking-determinism` — type: **tradeoff** — 이유: structural=결정적BLOCK / style·wording=LLM WARN 의 경계와 그 대가(작성 부담 vs 재현성). 권장안 대안 B 의 핵심 → 기존 ADR-D 를 tradeoff 로 재서술(단순 "하이브리드 정책"보다 "왜 결정성을 BLOCK 에만 거나"가 ADR 가치).
- [ ] **통폐합 권고**: ADR-13-01-F(_index.json 사전빌드)는 build 캐시 구현 디테일에 가까워 ADR(6 개월+ 결정) 보다 **convention** 수준. 굳이면 위 picker-library ADR 에 흡수. 단독 ADR 보류.
- [ ] **격하 권고**: ADR-13-01-E(멀티에이전트 2-layer) — Layer2(메타비판)는 제품 결정 아님(프로세스), Layer1 은 실행환경 의존이라 invariant 로 박기엔 불안정. ADR 보류 또는 "model-budget convention"(type: convention, 가변)으로 약하게.
- [ ] **신규 후보**: `traceability-id-scheme`(capability/page/flow ID 역참조) — type: **convention** — 이유: 대안 B 채택 시 문서 작성 규약으로 cross-spec 고정. (권장안 채택 시에만)

**요약**: 6 개 → **3 ADR**(invariant 1 + decision 1 + tradeoff 1)로 압축 권고. F/E 는 ADR 미달(구현/프로세스). 추적 ID 채택 시 convention 1 추가.
