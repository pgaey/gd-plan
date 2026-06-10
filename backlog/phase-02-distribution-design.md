# phase-02 설계 초안 — gd-plan 배포·버전·업그레이드

> brainstorming(2026-06-09) 산출물. phase-02 활성화 시 `backlog/phase-02.md` + spec 으로 구체화.
> 목표: gd-plan 을 harness-kit 형태(curl|bash)로 외부 프로젝트에 설치/업그레이드 가능하게 만든다. dogfood 하며 "업그레이드 필요?"를 버전으로 판단.

## 배경

현재 설치기(`src/cli.ts` `installPlans`)는 스킬 9개만 `.claude/commands/` 로 복사한다. **구멍 2개**: (1) 스킬이 읽는 `templates/`·컬렉션 인덱스가 안 깔려 외부에서 못 돎, (2) `package.json` version 이 있으나 아무도 안 써 — 버전 스탬프·업그레이드 없음.

## 핵심 결정 (승인됨)

| # | 결정 | 선택 | 이유 |
|---|---|---|---|
| 배포 모델 | A npm / **B self-contained** / C 하이브리드 | **B** | harness-kit 동형, 런타임 npm 비의존 |
| 전달 | npx / **curl\|bash get.sh** | **curl\|bash** | `bash <(curl …get.sh) <dir>` — harness-kit 식 |
| 설치기 언어 | node / **bash** | **bash**(소비자) + node(개발) | node 비의존 전제. 인덱스 사전빌드라 설치=순수 복사 |
| 컬렉션 66개 | 전부 복사 / **인덱스만+픽시 fetch** | **인덱스만** | 66개 무겁고 대부분 미사용 |
| 버전 bump | **수동** / 자동 | **수동** | YAGNI — 자동 판정 과함 |
| manifest | JSON / **평문** | **평문**(VERSION+shasum) | bash 로 안전히 다룸 |

## footprint (소비자 프로젝트)

```
.claude/commands/gd-plan-*.md   스킬 9
.gd/
  bin/gd                        bash — status·upgrade·version
  templates/…                   prd·sitemap·pages·ui-rules·section-taxonomy·decisions
  design-index/_index.json      컬렉션 인덱스 (원본 .md 는 픽 시 fetch)
  VERSION                       설치 gd-plan semver (평문 한 줄)
  manifest                      설치 파일별 shasum (평문 — 충돌 감지)
docs/…                          사용자 산출물 — 설치/업그레이드 절대 미접촉
```

## 버전 스킴

- `package.json` version = 단일 진실(SoT). get.sh 가 설치 시 `.gd/VERSION` 으로 복사.
- semver bump (개발자 release 시 수동):
  - **MAJOR**: 스킬 동작·doc 모델·템플릿 구조 깨짐 (예: 평면→세로슬라이스)
  - **MINOR**: 신규 스킬·capability 추가 (예: `/gd-plan-critique`)
  - **PATCH**: 규칙 보강·문구·버그픽스

## 소비자 명령 (bash, node 불필요)

- `bash <(curl …get.sh) [--yes] <dir>` — 부트스트랩: 최신 fetch → 스킬·템플릿·인덱스·bin 복사 → VERSION·manifest 기록
- `.gd/bin/gd status` — 설치 VERSION vs 원격 최신 비교(`sort -V`) → "최신 / 업그레이드 가능(x→y)" + 사용자 수정 파일 표시
- `.gd/bin/gd upgrade` — 최신 fetch → 버전 비교 → 파일별 갱신(↓ 충돌정책) → VERSION·manifest 갱신
- `.gd/bin/gd version` — 설치 버전 출력
- (v1 범위: 위 4개. `uninstall`·`doctor` 는 제외 — YAGNI)

## 충돌 정책 (비가역 손실 금지 — phase-01 RC5 교훈)

- 스킬·템플릿 = "도구" → 기본 **덮어쓰기**.
- 단 사용자가 손댄 파일(shasum ≠ manifest)은 **덮지 않고 `<file>.new` 로 나란히 + 경고**(침묵 덮어쓰기=비가역 손실 금지).
- `docs/` 사용자 산출물은 **절대 미접촉**.

## dev / consumer 분리

- **소비자**: get.sh(bash) + `.gd/bin/gd`(bash). node 0.
- **개발자(이 repo)**: node `build-index`(인덱스 빌드) + vitest 유지. get.sh·bin 은 bats 등 셸 테스트.
- `src/cli.ts` 기존 설치기: get.sh 로 대체되며 dev/programmatic 보조로 축소(또는 deprecate).

## 미해결 (spec 에서 확정)

- get.sh fetch 방식: GitHub release tarball / `git archive` / raw 나열 — 구현 세부.
- 픽 시 컬렉션 원본 fetch 의 정확한 URL·캐시 위치.
- bash 테스트 도구(bats vs 간단 셸 어서션).

## e2e 연결 (phase-01 C1)

완성 시 `bash <(curl …) ~/dental-test` 로 새 프로젝트에 설치 → 거기서 스킬 실행 = **phase-01 의 미용실 e2e**. 설치 경로까지 한 번에 검증.

## 거버넌스

새 테마(배포)라 phase-02. 선행: phase-01 phase-ship(또는 사용자 결정). 이 프로젝트는 harness-kit spec 흐름 사용(superpowers writing-plans 아님).
