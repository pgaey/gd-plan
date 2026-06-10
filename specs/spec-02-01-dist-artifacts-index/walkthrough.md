# Walkthrough: spec-02-01

> 본 문서는 *작업 기록* 입니다. 결정 과정, 사용자 협의, 검증 결과를 미래의 자신과 리뷰어에게 남깁니다.

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| repo 가시성 (curl 설치·fetch 차단) | public 전환 / private+gh / 공개 dist repo | **public 전환** (실행 완료, raw 200 확인) | curl 한 줄 설치(harness-kit 동형) + 소비자 의존 0. 공개 대상은 도구 소스뿐 |
| 컬렉션 배포 방식 | 인덱스만+픽 시 fetch(brainstorm 승인안) / 전체 동봉 | **전체 동봉 (승인안 번복)** | 전제 "66개 무겁다"가 실측 **1.2MB** 로 반증. critique 가 지적한 fetch 위험 5건(curl 404 위장·폴백·stale 캐시 등) 클래스째 소멸 + 오프라인 픽 |
| spec-02-01 범위 | 인덱스 사전빌드 포함 / 제외 | **제외** | `src/build-index.ts`·`_index.json` 이미 존재 (테스트 포함) — 스킬 2모드 적응 + 규약 + ADR 로 축소 |
| CDN(jsDelivr) | 채택 / 비채택 | **비채택 (GitHub 단일)** | 픽 fetch 소멸로 요청량이 설치·업그레이드 1회 수준 — 불필요 (사용자 결정) |

### ADR 승격 가이드

- [x] ADR 승격 대상 있음 → 작성됨: `docs/decisions/ADR-016-self-contained-distribution.md` (type: decision)

## 💬 사용자 협의

- **주제**: repo private 차단 해소
  - **사용자 의견**: "harness-kit처럼 명령어 한 줄 설치가 목적이면 public이어야 하는 것" 확인 후 공개 전환 선택
  - **합의**: public 전환 (2026-06-10 실행, `gh repo edit --visibility public`)
- **주제**: critique 7건 처리 + 캐시 설계 의문
  - **사용자 의견**: "버전을 한 번 다운로드 받으면 다 해결되는 것 아닌가" — 픽 시 fetch 복잡도 자체에 의문
  - **합의**: 컬렉션 실측(1.2MB) 후 **전체 동봉으로 설계 전환** — critique #1·2·3·6b·6c 소멸, #4·5(기존 버그)만 반영, #6a 는 spec-02-03 이관
- **주제**: harness-kit 구조 차용
  - **합의**: `cache.json` 패턴(버전 확인 캐시) → spec-02-03, `CLAUDE.fragment.md` 패턴 → spec-02-02 에서 결정. hooks·config 는 YAGNI 비채택. phase-02.md 에 반영

## 🧪 검증 결과

### 1. 자동화 테스트

#### 단위 테스트
- **명령**: `pnpm test` + `pnpm typecheck`
- **결과**: ✅ Passed (67 tests, 6 files) / typecheck 클린
- **로그 요약**:
```text
[Red — cd368fd 시점] Tests  3 failed | 64 passed (67)
  ✗ 소비자 경로(.gd/design-md-collection/) 안내
  ✗ 사문 명령 부재 + pnpm build-index 안내
  ✗ .md 중복 부착 패턴 부재
[Green — f5fcd14 시점] Tests  67 passed (67)
```

### 2. 수동 검증

1. **Action**: `gh repo view pgaey/gd-plan --json visibility` → `curl -w "%{http_code}" https://raw.githubusercontent.com/pgaey/gd-plan/main/package.json`
   - **Result**: PUBLIC / 200 — 비인증 raw fetch 동작 확인
2. **Action**: `du -sh design-md-collection/`
   - **Result**: 1.2MB (67파일) — "무겁다" 전제 반증, 전체 동봉 결정 근거
3. **Action**: 갱신된 `plans/gd-plan-design.md` §1·§2 본문 검토
   - **Result**: dev 모드 절차는 기존과 동일 (회귀 0), 소비자 모드는 같은 디렉토리 로드로 네트워크 0

## 🔍 발견 사항

- `src/build-index.ts` + `_index.json` 이 이미 완성 상태였음 — phase 설계 초안의 "인덱스 사전빌드" 항목은 착수 전 재검증(§11.3)에서 기완료로 판명. 초안은 draft 라는 원칙 재확인.
- 기존 스킬 버그 2건이 critique 에서 발견됨: `<file>.md` 중복 부착(`cal.md.md` 사고), 사문 명령 `pnpm gd plan refresh-index` 안내. 지금까지 인덱스가 항상 존재해 노출되지 않았던 것.

## 🚧 이월 항목

- critique #6a (`.gd/VERSION` 부재 시 처리 — `gd upgrade` 재기록 복구) → spec-02-03 (phase-02.md 방향성에 반영됨)
- 소비자 CLAUDE.md fragment import 채택 여부 → spec-02-02 (phase-02.md 방향성에 반영됨)

## 🔗 관련 문서 (Related)

- 관련 wiki: [[patterns]]
- 관련 ADR: [[ADR-016]], [[ADR-002]]
- 관련 RCA: 없음

## 📅 메타

| 항목 | 값 |
|---|---|
| **작성자** | Agent + evan |
| **작성 기간** | 2026-06-10 |
| **최종 commit** | `322e949` (+ ship commit) |
