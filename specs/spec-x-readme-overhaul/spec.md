# spec-x-readme-overhaul: README 재구성+증강 (소비자 온보딩 문서)

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-x-readme-overhaul` |
| **Phase** | `phase-x` |
| **Branch** | `spec-x-readme-overhaul` |
| **상태** | Planning |
| **타입** | Docs |
| **Integration Test Required** | no |
| **작성일** | 2026-06-11 |
| **소유자** | evan |

## 📋 배경 및 문제 정의

### 현재 상황
`README.md` 는 phase-01/02 를 거치며 부분 패치됐다. **본문 내용은 대부분 정확**하나(컬렉션 66·설치 footprint·`plans/` 경로·`gd` 서브커맨드 ✅), **dev 기여자 중심으로 압축**돼 처음 보는 소비자가 "무엇·왜·언제·어떻게"를 잡기 어렵다.

### 문제점
- **온보딩 공백(주된 문제)**: "이게 무엇/왜", "언제 쓰나/대상", "시작하기 흐름" 절이 없다. 특히 gd-plan 이 *기획 앞단(greenfield·신규 기능)* 도구라는 적용 조건이 문서화돼 있지 않아, 사용자가 직접 물어 확인해야 했다(이번 세션).
- **국소 stale 2건(검증 완료)**: `:7` 헤더 "5종 문서"(실제 9 스킬), `:33` "ADR-001~015"(실제 016까지). `:34` spec-13-01 참조는 **디렉토리 실재 → stale 아님**(정리 판단 대상).
- 비교 기준: harness-kit README 수준의 온보딩(정체성→대상→개념→설치→시작→명령→FAQ). 단 alpha·e2e 미검증 단계라 **레퍼런스 매뉴얼화는 경계**한다(critique 반영).

### 해결 방안 (요약)
**전면 재작성이 아니라 재구성+증강.** 정확한 기존 본문은 *재사용*하고, 누락된 온보딩 절(이게 무엇/왜·언제 쓰나/대상·시작하기 흐름)만 신규 추가한다. stale 2건과 spec 작성 중 발견된 소스 참조 오류를 정정한다. 무거운 레퍼런스(배포 모델·전체 footprint)는 기존 문서(ADR-016·`docs/RELEASE.md`)로 위임 링크해 README 비대화를 막는다(progressive disclosure).

## 🎯 요구사항

### Functional Requirements
1. README 가 다음 온보딩 절을 포함한다(도메인 기준 취사, "16절" 같은 숫자 목표 아님):
   - 헤더 + 한 줄 정체성 + 배지(version·license만, CI 배지 제외 — alpha) + **목차(ToC)**
   - 💡 이게 무엇인가/왜 (66 검증 디자인 시스템 일관성 강제, v0/Lovable 대비)
   - 🎯 **언제 쓰나/대상** (신규·핵심)
   - 📖 핵심 개념 (연결모델 `role→capability→page→flow` + 검증 2층 critique↔review)
   - 🧩 무엇을 만드나 (9 스킬 파이프라인 표)
   - 📦 설치(소비자) + footprint 간략 블록
   - 🚀 시작하기 (파이프라인 흐름 + mermaid)
   - 🔄 업그레이드/상태 (`gd` CLI)
   - ⌨ 명령 요약 (9 슬래시 + `gd`)
   - 🛠 개발(기여자), 🗄 배포 모델(**ADR-016/RELEASE.md 위임 링크**), 📜 배경(gen-design, 축약), ❓ FAQ, License
2. **"언제 쓰나/대상"** 절이 적용 조건을 명시한다: 적합 축 = "기획 앞단이냐 구현 뒷단이냐"(신규/기존 repo 가 아님). gd-plan(콘텐츠) ↔ harness-kit(프로세스) 대조 포함.
3. 명령 요약 표가 **9 슬래시 커맨드 전부** + `gd` CLI(`status·upgrade·version`)를 담는다. 교차검증 소스: **`plans/gd-plan-*.md`**(9개 실재 위치). get.sh 옵션은 설치 절에서 핵심만(`--yes·--version·--src`), 전체는 `get.sh --help` 위임.
4. 시작하기 절이 `/gd-plan-start → prd → critique → design → sitemap → page → flows → rules → review` 파이프라인을 안내하고 mermaid 를 포함한다. **mermaid 범위**: 기본 선형 흐름 + critique/review 의 검증 노드(BLOCK 의미)를 분기로 표기(과도한 루프 묘사는 생략).

### Non-Functional Requirements
1. **stale 0(국소 교정 + 회귀 무유입)**: 명령명·경로·카운트를 실제 소스와 1회 수동 교차검증한다. 버전 SoT = **`package.json`(0.1.0)**, `.gd/VERSION` 은 설치 산출물(혼동 금지). 스킬 9·ADR `docs/decisions/` 실제 수·컬렉션 66. *항구적 lint 게이트는 본 spec 범위 밖*(docs 1회 점검으로 수용).
2. **회귀 무영향**: 코드/스킬/템플릿/`src`/`get.sh`/`gd` 미변경 → 기존 테스트 그대로 통과. 정확한 본문은 재사용(재작성 아님)해 새 stale 유입을 막는다.

## 🚫 Out of Scope
- **e2e dogfooding**(미용실 실증) — 별도 phase, 본 spec 이후.
- **산출물 예시/스크린샷** — gd-plan 은 문서 생성 도구라 예시가 이상적이나 **아직 e2e 미실행으로 실제 산출물이 없음** → e2e 후로 연기.
- 코드/스킬/템플릿/`get.sh`/`gd` 변경, 새 디자인 시스템·컬렉션 변경.
- stale ADR 9건 체커 false-positive(이번 세션 "넘김" 결정), 항구적 README-lint 게이트.
- README 분할(별도 `docs/` 문서로 reference 떼어내기) — 위임 링크까지만, 신규 문서 생성은 안 함.

## 📑 ADR 후보 (Architecture Decision Records)
- [ ] ADR 가치 있는 결정 있음
- [x] 없음 — docs 정리, 새 아키텍처 결정 없음(critique §4 동의). "적용 대상" 통찰은 README 본문(설명형)에 보존.

## 🔗 관련 문서 (Related)
- 관련 ADR: `ADR-016-self-contained-distribution`(배포 모델 위임 출처)
- 관련 backlog: `backlog/phase-01-review.md`(W4 README stale 선례), `backlog/phase-02.md`(footprint)
- critique: `specs/spec-x-readme-overhaul/critique.md`

## 🔍 Critique 결과 (반영 요약)
독립 Opus 검토 반영: ①소스경로 오류(`.claude/commands/`→`plans/`)·②버전 SoT 오류(`VERSION`→`package.json`) 정정, ③"전면 재작성"→"재구성+증강"으로 처방 축소(국소 stale 만 교정·정확본문 재사용), ④과투자 절(배포/footprint) 위임링크 슬림화, ⑤산출물 예시 e2e 후로 명시, ⑥mermaid 범위·검증 방식 모호함 해소. spec-13-01 은 실재 확인 → stale 에서 제외(검토자 과다집계 교정).

## ✅ Definition of Done
- [ ] README 온보딩 절 완성(FR1) + 명령/경로/카운트 stale 0(교차검증) + "언제 쓰나" 절 존재
- [ ] 기존 테스트 스위트 회귀 PASS(코드 미변경 확인)
- [ ] `walkthrough.md` 와 `pr_description.md` 작성 및 ship commit
- [ ] `spec-x-readme-overhaul` 브랜치 push 완료
- [ ] 사용자 검토 요청 알림 완료
