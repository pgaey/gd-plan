# spec-02-01: design 스킬 소비자 모드 + 컬렉션 전체 동봉 규약

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-02-01` |
| **Phase** | `phase-02` |
| **Branch** | `spec-02-01-dist-artifacts-index` |
| **상태** | Planning |
| **타입** | Feature |
| **Integration Test Required** | no (phase-02 통합 시나리오 3 에서 e2e 검증) |
| **작성일** | 2026-06-10 |
| **소유자** | evan |

## 📋 배경 및 문제 정의

### 현재 상황

- 컬렉션 인덱스 빌더는 **이미 완료** 상태: `src/build-index.ts` 가 66개 컬렉션 → `design-md-collection/_index.json` 을 결정적 휴리스틱으로 사전빌드 (테스트 + `pnpm build-index` 스크립트 존재).
- `plans/gd-plan-design.md` 스킬은 인덱스·원본을 **repo 로컬 경로로 하드코딩** — 이 repo 안에서만 동작.
- brainstorm 승인안 "인덱스만 설치 + 픽 시 fetch" 는 **번복됨** (phase-02.md 결정 기록 2026-06-10): 전제 "66개 무겁다"가 실측 **1.2MB** 로 반증. critique 가 드러낸 픽 fetch 설계의 위험(404 본문 캐시 오염, 폴백 구분, stale 캐시 등)은 **컬렉션 전체 동봉**으로 클래스째 소멸.
- repo 는 public 전환 완료 (2026-06-10) — 설치·업그레이드 fetch(spec-02-02/03)는 비인증 가능.

### 문제점

1. 소비자 프로젝트(외부 설치본)에서 `/gd-plan-design` 실행 시 인덱스·원본 경로가 repo 기준이라 **동작 불가**.
2. 소비자 footprint 의 컬렉션 위치·구성 **규약이 없다** — get.sh(spec-02-02)가 무엇을 어디로 복사할지의 토대.
3. 기존 스킬 버그 2건 (critique 발견):
   - §2-4 가 "`design-md-collection/<file>.md` 풀로드"라고 지시 — 인덱스 `file` 필드가 이미 확장자 포함(`cal.md`)이라 그대로 따르면 `cal.md.md` 사고.
   - §2-1 의 인덱스 부재 안내가 사문 명령 `pnpm gd plan refresh-index` (실존 명령은 `pnpm build-index`).

### 해결 방안 (요약)

소비자 컬렉션 경로를 `.gd/design-md-collection/`(66개 + `_index.json` 전체 동봉)로 규약화하고, `gd-plan-design.md` 가 인덱스 경로 존재로 dev/소비자를 자동 판별해 양쪽에서 동작하도록 갱신한다(픽 시 네트워크 0). 기존 버그 2건을 함께 교정하고, 배포 모델을 ADR-016 으로 명문화한다.

## 🎯 요구사항

### Functional Requirements

1. **소비자 컬렉션 footprint 규약 확정**: `.gd/design-md-collection/` = 컬렉션 66개 + `_index.json` 전체 동봉 (repo 디렉토리명 그대로 — 스킬 분기 최소화). 실제 복사 구현은 spec-02-02 get.sh 범위, 본 spec 은 규약을 스킬 본문·ADR 에 명문화.
2. **모드 자동 판별** — `gd-plan-design.md` §1·§2 갱신:
   - dev 모드: `design-md-collection/_index.json` 존재 → 현행 동작 그대로.
   - 소비자 모드: `.gd/design-md-collection/_index.json` 존재 → 인덱스·원본 모두 같은 디렉토리에서 로드. **픽 시 네트워크 요청 0** (오프라인 동작).
   - 둘 다 없음: dev → `pnpm build-index` 안내 / 소비자 → 재설치 또는 `gd upgrade` 안내 후 중단.
3. **기존 버그 교정 2건**:
   - §2-4: 원본 로드를 "인덱스 `file` 필드 그대로" 로 교정 (`.md` 중복 부착 금지 — `cal.md.md` 차단).
   - §2-1: 사문 명령 `pnpm gd plan refresh-index` → 실존 명령 `pnpm build-index` (dev 모드 안내).
4. **ADR-016 작성** (`type: decision`): 배포 모델 — ① self-contained bash 배포(npm 비채택) ② 컬렉션 **전체 동봉** (인덱스만+픽 fetch 승인안의 번복 경위·실측 근거 1.2MB 포함) ③ public repo = 배포 서버(설치·업그레이드 fetch, GitHub 단일 — CDN 비채택).

### Non-Functional Requirements

1. **dev 모드 회귀 0**: 이 repo 안에서의 현행 픽킹 흐름·출력 변경 없음 (`pnpm test` 기존 스위트 PASS).
2. **스킬 길이 cap 준수**: `gd-plan-design.md` ≤ 400줄.
3. **픽 시 네트워크 0**: 픽 절차에 fetch/curl 지시가 등장하지 않음 (오프라인 보장 — 규약 테스트로 회귀 방지).

## 🚫 Out of Scope

- `get.sh` 부트스트랩 설치기 (컬렉션 실제 복사·`.gitignore` 처리 포함) — spec-02-02.
- `.gd/bin/gd` (status·upgrade·version)·manifest·`.gd/VERSION` 운영 — spec-02-03.
- `src/cli.ts` 축소/deprecate, release 절차 문서 — phase-FF.
- 인덱스 빌더 변경 (`src/build-index.ts`) — 기완료, 본 spec 미접촉.

## 📑 ADR 후보 (Architecture Decision Records)

- [x] ADR 가치 있는 결정 있음 → 후보 한 줄 요약: `ADR-016-self-contained-distribution` (type: decision) — self-contained bash 배포 + 컬렉션 전체 동봉(번복 경위 포함) + public repo = 배포 서버

## 🔍 Critique 결과

> /hk-spec-critique (Opus 독립 검토, 2026-06-10) — 전체: `specs/spec-02-01-dist-artifacts-index/critique.md`
> critique 는 픽 시 fetch 설계 기준 7건을 지적 → 사용자 검토에서 **컬렉션 전체 동봉으로 설계 전환** (실측 1.2MB), 처리 결과:

- **반영 (기존 버그)**: #4 확장자 중복(`cal.md.md`) 교정, #5 사문 명령 교정 → FR3.
- **설계 전환으로 소멸**: #1 curl -f·원자적 쓰기, #2 폴백 HTTP 코드 구분, #3 버전 키 캐시, #6b·6c 캐시 gitignore·격리 — 픽 시 fetch 자체가 없어짐.
- **타 spec 이관**: #6a `.gd/VERSION` 부재 처리 → spec-02-03 (gd status·upgrade 영역).
- **간소화**: #7 jsDelivr CDN — 사용자 결정으로 비채택(GitHub 단일), ADR-016 에는 전체 동봉 번복 경위를 대신 기록.

## 🔗 관련 문서 (Related)

- 관련 wiki: [[patterns]]
- 관련 ADR: [[ADR-002]] (design-md 픽커 라이브러리), 신규 [[ADR-016]]
- 관련 RCA: 없음

## ✅ Definition of Done

- [ ] 모든 단위 테스트 PASS (`pnpm test` — 기존 회귀 + 신규 규약 테스트)
- [ ] `walkthrough.md` 와 `pr_description.md` 작성 및 ship commit
- [ ] `spec-02-01-dist-artifacts-index` 브랜치 push 완료
- [ ] 사용자 검토 요청 알림 완료
