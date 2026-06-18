# phase-4: design-tangibility — 디자인 시스템을 보이게, 외부 레퍼런스를 안전하게

> 본 phase 의 모든 SPEC 을 한 파일에 요점/방향성으로 나열합니다.
> *구체적* 작업 내용은 `specs/spec-4-{seq}-{slug}/spec.md` 에서 다룹니다.

## 📋 메타

| 항목 | 값 |
|---|---|
| **Phase ID** | `phase-4` |
| **상태** | In Progress |
| **시작일** | 2026-06-18 |
| **목표 종료일** | 미정 |
| **소유자** | pgaey |
| **Base Branch** | 없음 (각 spec → main 직접 PR) |

## 🎯 배경 및 목표

### 현재 상황
`/gd-plan-design` 은 66개 검증 시스템 중 후보 3개를 **글 한 줄**(`cal.md — monochrome, 신뢰감`)로만 제시한다. 사용자는 각 시스템의 *실제 톤*을 따로 찾아보지 않으면 알 수 없다. 또한 외부 레퍼런스를 가져오고 싶을 때 반영 경로가 없다 — 있으면 "검증 컬렉션 안에서만 픽"이라는 일관성 USP 와 충돌할 위험.

### 목표 (Goal)
(A) 후보의 톤을 **로컬 프리뷰로 보이게** 하고, (B) 외부 레퍼런스/사용자 변경을 **검증 베이스 + 오버라이드 델타** 로 안전하게 반영한다(베이스는 항상 66개 중 하나 = USP 보존).

### 성공 기준 (Success Criteria) — 정량 우선
1. `/gd-plan-design` 후보 제시 시 상위 3후보를 나란히 렌더한 `docs/_design-preview.html` 가 생성된다(팔레트·타이포·버튼/카드 + 폰트 폴백 정직 배너).
2. 외부 ref(주: 크롬 확장 추출본 붙여넣기 / 폴백: URL·스크린샷)가 (a) 가장 가까운 66개 베이스로 픽되고 (b) 델타가 provenance 붙어 `docs/design-overrides.md` 에 기록된다. 베이스 본문 9섹션은 복사 그대로(불변식).
3. 베이스는 *항상* 66개 중 하나 — 외부 ref 가 베이스를 대체하지 않음(USP 보존). ADR-018 로 결정 기록.
4. `rules` 단계가 `design-overrides.md` 를 읽어 정식 오버라이드로 보강한다(파이프라인 정합).

## 🧩 작업 단위 (SPEC + phase-FF)

<!-- sdd:specs:start -->
| ID | 슬러그 | 우선순위 | 상태 | 디렉토리 |
|---|---|:---:|---|---|
| `spec-04-01` | design-preview | P? | Active | `specs/spec-04-01-design-preview/` |
<!-- sdd:specs:end -->

> 상태 허용값: `Backlog` / `In Progress` / `Merged`

### spec-4-01 — 후보 무드 스와치 프리뷰 (Part A) — **빌드타임 fragment (대안 C)**

- **요점**: dev 빌드가 66개 스와치 HTML fragment 를 1회 생성·커밋, 런타임은 픽된 3개를 `docs/_design-preview.html` 로 결합(node-free).
- **방향성**(critique 반영): `src/build-swatches.ts` 가 §9 Quick Color Reference 파싱(팔레트) + 폰트명 라벨(균일 폴백 → 편향 0) + radius/shadow best-effort → `design-md-collection/_swatches/*.html`. `build-index` 선례. 런타임 결정적·node-free. ADR-019.
- **참조**: `plans/gd-plan-design.md` §2, `design-md-collection/*.md` §9, `src/build-index.ts`(빌드 선례)
- **연관 모듈**: `src/build-swatches.ts`, `plans/gd-plan-design.md`, `docs/decisions/ADR-019-*.md`

### spec-4-02 — 외부 ref = 베이스 + 오버라이드 (Part B)

- **요점**: 외부 ref/사용자 변경을 검증 베이스(66개 중 하나) + 오버라이드 델타로 반영. ADR-018 동반.
- **방향성**: 입력 주경로 = 크롬 확장 추출본 붙여넣기(gd-plan 정규화), 폴백 = URL/스크린샷(scanner 서브에이전트 추출). 시그니처로 가장 가까운 66개 베이스 픽 + 델타를 `docs/design-overrides.md` 에 provenance(`user-imported`) 붙여 design 단계에서 바로 기록. 베이스 본문 불변. `rules` 단계가 소비.
- **참조**: `plans/gd-plan-design.md`, `plans/gd-plan-rules.md`, ADR-002(design-md-picker-library 연장)
- **연관 모듈**: `plans/gd-plan-design.md`, `plans/gd-plan-rules.md`, `docs/decisions/ADR-018-*.md`

### phase-FF 예정 항목 (spec 미생성)

없음.

## 📌 결정 기록 (Review)

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| 시각화 방식 | 로컬 프리뷰 HTML / 실사이트 링크 / 둘 다 | **로컬 프리뷰 HTML** | 오프라인·node 불필요(gd-plan 철학) + 3후보 한 화면 비교 |
| 프리뷰 범위 | 3후보 스와치 / 풀페이지 1개 / 둘 다 | **3후보 무드 스와치** | "전체 톤 비교"에 최적, 비용 절제 |
| 프리뷰 생성 방식 (spec-04-01 critique) | 런타임 LLM(A) / 빌드타임 fragment(C) | **C 빌드타임 fragment** | 결정성 + 폰트 편향 제거(critique), `build-index` 선례. ADR-019 |
| 프리뷰 폰트 | 실제 렌더(CDN) / 이름 라벨+균일 폴백 | **이름 라벨+균일 폴백** | 독점/오픈소스 차등 렌더가 픽 왜곡 → 공정성 택함 |
| 외부 ref 관계 | 베이스+오버라이드 / 최근접만 / 신규 엔트리 | **베이스+오버라이드** | 검증 베이스(66) 척추 유지 = USP 보존, 기존 override 패턴 재사용 |
| ref 입력 | gd-plan 직접 분석 / 크롬 확장 추출본 | **추출본 붙여넣기(주) + 직접 분석(폴백)** | 추출 전용 도구가 더 정확, gd-plan 부담↓ |
| 오버라이드 위치 | design 단계 기록 / rules 단계 작성 | **design 단계에서 바로 기록** | 시스템 보는 그 자리, 멱등·즉시성. rules 가 읽어 보강 |

## 🧪 통합 테스트 시나리오 (간결)

### 시나리오 1: 후보 프리뷰 생성
- **Given**: prd.md 가 있는 샌드박스(phase-04 반영본)
- **When**: `/gd-plan-design` 후보 제시 단계
- **Then**: `docs/_design-preview.html` 가 top-3 무드 스와치(실제 hex·radius·섄도우)로 생성되고 브라우저로 열림.
- **연관 SPEC**: spec-4-01

### 시나리오 2: 외부 ref 베이스+오버라이드
- **Given**: 크롬 확장 추출본(또는 URL)을 외부 ref 로 제시
- **When**: `/gd-plan-design` 실행
- **Then**: 66개 중 가장 가까운 베이스가 픽되고, 델타가 provenance 붙어 `docs/design-overrides.md` 에 기록(베이스 본문 9섹션 불변). `rules` 가 이를 읽음.
- **연관 SPEC**: spec-4-02

### 통합 테스트 실행
```bash
bash test/sh/run.sh
```

## 🔗 의존성

- **선행 phase**: 없음 (phase-03 머지 위에서 진행)
- **외부 시스템**: 브라우저(프리뷰 열람), 크롬 확장(외부 ref 추출 — 사용자 측). Claude Code `Agent` tool(폴백 scanner).
- **연관 ADR**: `docs/decisions/ADR-002-design-md-picker-library.md`(연장), 신규 `ADR-018`(외부 ref↔검증 컬렉션 관계).

## 📝 위험 요소 및 완화

| 위험 | 영향 | 완화책 |
|---|---|---|
| 독점 폰트 프리뷰 폴백 | 타이포 근사 | 정직 배너 명시, 색/섄도우/radius 충실 |
| 외부 ref 남용 → USP 회귀 | 일관성 훼손 | 베이스는 항상 66개, ref 는 델타 레이어(대체 금지, ADR-018) |
| 추출본 포맷 다양 | 정규화 실패 | LLM 정규화 + 실패 시 핵심 토큰만 수용 |
| 토큰 추출 부정확(.md 산문) | 프리뷰 왜곡 | 핵심 토큰 위주 추출, 불확실 시 생략 표기 |

## 🏁 Phase Done 조건

- [ ] 모든 SPEC 이 merge (각 spec → main)
- [ ] 통합 테스트 시나리오 1·2 PASS
- [ ] 성공 기준 1~4 측정 결과 기록
- [ ] 사용자 최종 승인 (`/hk-phase-ship`)

## 📊 검증 결과 (phase 완료 시 작성)

<!-- 통합 테스트 로그, 성공 기준 측정값, 회귀 점검 결과 등을 여기 첨부 -->
