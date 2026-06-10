# phase-02: distribution

> 본 phase 의 모든 SPEC 을 한 파일에 요점/방향성으로 나열합니다.
> *구체적* 작업 내용은 `specs/spec-02-{seq}-{slug}/spec.md` 에서 다룹니다.
>
> 본 문서는 "이번 phase 에서 무엇을 어디까지 할 것인가" 를 한 번에 보기 위한 *업무 지도* 입니다.
> 설계 원본: `backlog/phase-02-distribution-design.md` (brainstorming 2026-06-09, 핵심 결정 6건 승인됨).

## 📋 메타

| 항목 | 값 |
|---|---|
| **Phase ID** | `phase-02` |
| **상태** | Planning |
| **시작일** | 2026-06-10 |
| **목표 종료일** | TBD |
| **소유자** | evan |
| **Base Branch** | phase-02-distribution |

## 🎯 배경 및 목표

### 현재 상황

gd-plan 을 외부 프로젝트에 설치할 공식 경로가 없다. 현재 설치기(`src/cli.ts` `installPlans`)는 스킬 9개만 `.claude/commands/` 로 복사하며, **구멍 2개**가 있다: (1) 스킬이 읽는 `templates/`·컬렉션 인덱스가 함께 안 깔려 외부 프로젝트에서 스킬이 동작하지 않음, (2) `package.json` version 이 존재하나 어디에도 쓰이지 않아 버전 스탬프·업그레이드 판단이 불가능.

phase-01 의 잔여 과제(C1: 미용실 end-to-end 측정)도 "외부 프로젝트에 설치 후 실행"이 전제라, 설치 경로가 곧 e2e 검증 경로다.

### 목표 (Goal)

gd-plan 을 harness-kit 형태(`curl | bash`)로 외부 프로젝트에 **설치/업그레이드** 가능하게 만든다. 소비자는 node 없이 bash 만으로 설치·상태확인·업그레이드를 수행하고, 버전(`.gd/VERSION`)으로 "업그레이드 필요?"를 판단한다. dogfooding 으로 phase-01 의 미용실 e2e 까지 한 번에 검증한다.

### 성공 기준 (Success Criteria) — 정량 우선

1. `bash <(curl …get.sh) <dir>` 1회로 footprint 전체(스킬 9 + `.gd/` templates·컬렉션(전체+인덱스)·bin·VERSION·manifest)가 설치되고, **node 미설치 환경에서 성공**.
2. `gd status` 가 설치 버전 vs 원격 최신을 정확 판별 — 구버전 설치 후 신버전 release 시 "업그레이드 가능(x→y)" 출력.
3. `gd upgrade` 시 사용자 수정 파일 손실 **0건** — 수정 파일(shasum ≠ manifest)은 `<file>.new` 로 보존 + 경고, `docs/` 산출물 diff 0.
4. 설치 footprint 에 컬렉션 전체 동봉(`.gd/design-md-collection/` = 66개 + `_index.json`) — 픽 시 네트워크 요청 0회(오프라인 픽 가능).
5. 기존 vitest 회귀 PASS + 신규 bash 테스트(get.sh·gd) PASS.

## 🧩 작업 단위 (SPEC + phase-FF)

> 실질적/불확실 → **SPEC**(아래 표), 작고 가역적인 1–2 commit → **phase-FF**(맨 아래).
> sdd 가 `<!-- sdd:specs:start --> ~ <!-- sdd:specs:end -->` 사이를 자동 갱신하므로 마커는 그대로 두세요.

<!-- sdd:specs:start -->
| ID | 슬러그 | 우선순위 | 상태 | 디렉토리 |
|---|---|:---:|---|---|
| `spec-02-01` | dist-artifacts-index | P? | Merged | `specs/spec-02-01-dist-artifacts-index/` |
| `spec-02-02` | get-sh-bootstrap | P? | Merged | `specs/spec-02-02-get-sh-bootstrap/` |
| `spec-02-03` | gd-consumer-cli | P? | Merged | `specs/spec-02-03-gd-consumer-cli/` |
<!-- sdd:specs:end -->

> 상태 허용값: `Backlog` / `In Progress` / `Merged`

### spec-02-01 — design 스킬 소비자 모드 + 컬렉션 전체 동봉 규약 (토대)

- **요점**: 소비자 footprint 에 컬렉션 전체(`.gd/design-md-collection/` = 66개 + `_index.json`) 동봉 규약 확정 + `plans/gd-plan-design.md` 가 dev repo / 소비자 프로젝트 양쪽에서 동작하도록 경로 2모드 적응 + 기존 스킬 버그 2건(확장자 중복·사문 명령) 교정. 배포 모델 ADR-016 명문화. (인덱스 사전빌드는 기완료 — `src/build-index.ts` 존재)
- **방향성**: 픽 시 네트워크 0 — fetch·캐시 규약 없음 (결정 기록 "컬렉션 배포 방식" 번복 참조). 실제 복사는 spec-02-02 get.sh 가 수행, 본 spec 은 규약 + 스킬 적응.
- **참조**: `backlog/phase-02-distribution-design.md` §핵심 결정·§footprint, 결정 기록 "배포 fetch 경로"·"컬렉션 배포 방식"
- **연관 모듈**: `plans/gd-plan-design.md`, `docs/decisions/`, `__tests__/`

### spec-02-02 — get.sh 부트스트랩 설치기

- **요점**: `bash <(curl …get.sh) [--yes] <dir>` — 최신 fetch → 스킬 9·템플릿·인덱스·`bin/gd` 복사 → `.gd/VERSION`·manifest 기록. fetch 방식(release tarball / git archive / raw 나열)과 bash 테스트 도구(bats vs 셸 어서션) 를 본 spec 에서 확정.
- **방향성**: harness-kit get.sh 동형. 소비자 측 node 의존 0. 멱등(재실행 안전). 복사 대상에 컬렉션 전체(`.gd/design-md-collection/`) 포함 (→ 결정 기록). 소비자 CLAUDE.md 에 gd-plan fragment 1줄 import(harness-kit `CLAUDE.fragment.md` 패턴) 채택 여부를 본 spec 에서 결정.
- **참조**: `backlog/phase-02-distribution-design.md` §소비자 명령, harness-kit 의 get.sh 패턴
- **연관 모듈**: `get.sh`(신규), `scripts/`, bash 테스트(신규)

### spec-02-03 — `.gd/bin/gd` 소비자 CLI (status·upgrade·version) + 충돌 정책

- **요점**: bash CLI 3개 명령 — `status`(설치 vs 원격 `sort -V` 비교 + 사용자 수정 파일 표시), `upgrade`(파일별 갱신 + 충돌 정책), `version`. v1 범위는 이 3개로 한정(uninstall·doctor 제외 — YAGNI).
- **방향성**: 충돌 정책 = 비가역 손실 금지(phase-01 RC5 교훈): 도구 파일 기본 덮어쓰기, 사용자 수정 파일은 `<file>.new` 나란히 + 경고, `docs/` 절대 미접촉. 원격 최신 버전 확인 결과는 평문 캐시(harness-kit `cache.json` 패턴 차용 — 매 status 마다 네트워크 비탑승). `.gd/VERSION` 부재 시 복구(`gd upgrade` 재기록) 처리 포함 (critique #6a 이관).
- **참조**: `backlog/phase-02-distribution-design.md` §충돌 정책·§버전 스킴
- **연관 모듈**: `.gd/bin/gd`(신규, 배포물), bash 테스트

### phase-FF 예정 항목 (spec 미생성)

> 작고 가역적인 1–2 commit. spec 산출물 없이 phase base 브랜치에 직접 커밋(phase-FF).

| 항목 | 요점 | 예상 commit |
|---|---|:---:|
| `src/cli.ts` 설치기 축소 | get.sh 대체 후 dev/programmatic 보조로 축소 또는 deprecate 표기 + README 설치 안내 갱신 | 1 |
| release 절차 문서화 | 수동 semver bump 기준(MAJOR/MINOR/PATCH)·체크리스트 1문서 — version 은 `package.json` 단일 SoT | 1 |

## 📌 결정 기록 (Review)

> brainstorming(2026-06-09) 승인 결정 6건은 설계 원본 §핵심 결정 표 참조. 아래는 phase 진행 중 추가 결정 누적.

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| 배포 fetch 경로 (repo 가시성) | public 전환 / private+gh CLI / 공개 dist repo 분리 | **public 전환** (2026-06-10 실행, raw 200 확인) | curl 한 줄 설치(harness-kit 동형) 유지 + 소비자 의존 0. 공개 대상은 도구 소스뿐(`docs/` 산출물은 소비자 로컬) |
| spec-02-01 범위 보정 | 인덱스 사전빌드 포함 / 제외 | **제외** — `src/build-index.ts`·`_index.json` 이미 존재(테스트 포함) | phase 설계 초안의 "인덱스 사전빌드"는 기완료. spec-02-01 은 픽 fetch 규약 + design 스킬 소비자 모드 적응 + ADR 로 축소 |
| 컬렉션 배포 방식 (brainstorm 번복) | 인덱스만+픽 시 fetch(승인안) / 전체 동봉 | **전체 동봉으로 번복** (2026-06-10) | 승인안의 전제 "66개 무겁다"가 실측 **1.2MB** 로 반증. 전환 시 픽 fetch·캐시·폴백 복잡도(critique #1·2·3·6b·6c) 클래스째 소멸 + 오프라인 픽 가능 + tarball 설치면 추가 비용 0. `_index.json` 은 토큰 절약용으로 유지. jsDelivr 등 CDN 논의 소멸(GitHub 단일) |

## 🧪 통합 테스트 시나리오 (간결)

### 시나리오 1: fresh 설치 (node 없는 환경)
- **Given**: gd-plan 미설치 빈 프로젝트 dir, node 미설치(또는 PATH 차단) 셸
- **When**: `bash <(curl …get.sh) <dir>`
- **Then**: footprint 전 파일 존재(스킬 9 + `.gd/{bin/gd,templates,design-md-collection(66+_index.json),VERSION,manifest}`), VERSION = `package.json` version, manifest shasum 전건 일치
- **연관 SPEC**: spec-02-01, spec-02-02

### 시나리오 2: 업그레이드 + 충돌 보존
- **Given**: 구버전 설치 + 사용자가 템플릿 1개 수정 + `docs/` 산출물 존재
- **When**: `gd status` → `gd upgrade`
- **Then**: status 가 "업그레이드 가능(x→y)" + 수정 파일 표시, upgrade 후 수정 파일은 원본 유지 + `<file>.new` 생성 + 경고, `docs/` diff 0, VERSION·manifest 갱신
- **연관 SPEC**: spec-02-03

### 시나리오 3: 미용실 e2e (phase-01 C1 연결)
- **Given**: 시나리오 1 로 설치된 새 프로젝트 (예: `~/dental-test`)
- **When**: 설치된 스킬로 prd → sitemap → page → flows → review 파이프라인 실행
- **Then**: `docs/sitemap.md` + `docs/pages/[PAGE-*]/` 생성, review BLOCK 0 — 설치 경로 + phase-01 성공 기준 1·3·4 동시 검증
- **연관 SPEC**: spec-02-01 ~ 02-03 전체

### 통합 테스트 실행
```bash
pnpm test          # 기존 vitest 회귀
bash test/sh/run.sh  # bash 테스트 (도구는 spec-02-02 에서 확정 — 경로 추후 갱신)
```

## 🔗 의존성

- **선행 phase**: phase-01 (완료 — 2026-06-10 merge)
- **외부 시스템**: GitHub (get.sh fetch·픽 시 컬렉션 fetch — repo 공개 여부에 따라 fetch 방식 결정 영향)
- **연관 ADR**:
  - 배포 모델(self-contained·인덱스만 설치) ADR 신규 작성 — spec-02-01 범위

## 📝 위험 요소 및 완화

| 위험 | 영향 | 완화책 |
|---|---|---|
| ~~repo 가 private 이면 curl raw/tarball fetch 불가~~ | ~~설치 경로 전체 막힘~~ | **해소(2026-06-10)** — public 전환 완료, 비인증 raw fetch 200 확인 (→ 결정 기록) |
| bash 이식성 (macOS bash 3.2 vs Linux, `shasum` vs `sha256sum`) | 소비자 환경별 설치 실패 | POSIX 호환 작성 + 도구 감지 폴백, bash 테스트를 양 플랫폼 기준으로 작성 |
| ~~픽 시 fetch 네트워크 의존~~ | ~~오프라인에서 픽 불가~~ | **소멸(2026-06-10)** — 컬렉션 전체 동봉 전환으로 픽 시 fetch 자체가 없음 (→ 결정 기록) |
| 침묵 덮어쓰기로 사용자 수정 손실 | 비가역 손실 (RC5 재발) | 충돌 정책 고정: shasum 비교 → `<file>.new` + 경고, `docs/` 절대 미접촉 — 시나리오 2 로 검증 |

## 🏁 Phase Done 조건

- [ ] 모든 SPEC 이 merge (base 모드: `phase-02-distribution` → main)
- [ ] 통합 테스트 3 시나리오 PASS
- [ ] 성공 기준 1~5 정량 측정 결과 (본 문서 하단 "검증 결과" 섹션에 기록)
- [ ] 사용자 최종 승인

## 📊 검증 결과 (phase 완료 시 작성)

<!-- 통합 테스트 로그, 성공 기준 측정값, 회귀 점검 결과 등을 여기 첨부 -->
