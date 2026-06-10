# Walkthrough: spec-02-03

> 본 문서는 *작업 기록* 입니다. 결정 과정, 사용자 협의, 검증 결과를 미래의 자신과 리뷰어에게 남깁니다.

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| 버전 비교 | `sort -V` (설계 초안) / 자체 semver 함수 | **자체 semver 함수** | macOS(BSD sort)에 `-V` 없음 — 이식성. x.y.z 숫자 필드 비교 10줄 |
| upgrade 대상 ref | main 고정 / v태그 핀 | **main 고정 (v1)** | release 태그 운영(phase-FF 문서화)이 아직 없음. 태그 시작 후 전환 |
| 원격 확인 캐시 | 매번 fetch / TTL 캐시 | **`.gd/cache` 평문 + TTL 1h** | harness-kit `cache.json` 패턴의 평문 번안 (jq 의존 회피). status 반복 실행에도 네트워크 1회/시간 |
| manifest 해석 | 설치본 sha / 상류 배포 sha | **상류 배포 sha** | 수정 감지·충돌 판정을 단일 기준으로 통일. 사용자 수정 파일이 upgrade 후에도 status 에서 "수정됨"으로 일관 표시 |
| 충돌 처리 | 덮어쓰기 / `<file>.new` 보존 | **`<file>.new` + 경고** | phase 불변 조건(비가역 손실 금지, RC5 교훈). 원본 유지 + 신버전 나란히 |

### ADR 승격 가이드

- [ ] ADR 승격 대상 있음
- [x] 없음 — 배포 모델은 ADR-016, 충돌 정책은 phase 불변 조건으로 기록 완료. 본 결정들은 구현 세부

## 💬 사용자 협의

- **주제**: Plan Accept 전 결정 3건 (semver 비교·upgrade ref·캐시 TTL)
  - **합의**: plan.md User Review 그대로 승인 (Plan Accept, 2026-06-10)
- **주제**: 수동 검증 (사용자가 직접 명령 실행)
  - **사용자 의견**: 일부 `rm -rf /tmp/...` 명령 실행 거부
  - **합의**: 동일 검증을 셸 테스트가 mktemp 격리 디렉토리에서 자동 수행 — 별도 수동 실행 생략

## 🧪 검증 결과

### 1. 자동화 테스트

#### 단위 테스트
- **명령**: `pnpm test` + `pnpm test:sh` + `pnpm typecheck`
- **결과**: ✅ vitest 67/67 (회귀 0) + 셸 9건(test-get 4 + test-gd 5) PASS + typecheck 클린
- **로그 요약**:
```text
[Red — 9cdabda] test-gd 5건 fail (bin/gd 미구현), test-get 4건 PASS
[Green — 1094695]
  test-gd:  · version · status 최신+수정표시 · status 업그레이드가능 · upgrade 충돌보존 · VERSION 부재복구
  test-get: · fresh · docs 미접촉 · 멱등 · node 비의존
  shell tests: 2 passed, 0 failed
```

### 2. 수동 검증

1. **Action**: `install.sh` 직접 실행 디버그 (`get.sh --src . --yes <tmp>`)
   - **Result**: 초기 `set -u` unbound 에러 → place_file 의 `local src=$1 rel=$2 dest=$TARGET/$rel` 한 줄 내 self-참조가 원인. bash 는 `local` 전체 인자를 *할당 전* 확장하므로 `$rel` 이 아직 unbound. `local` 을 2줄로 분리해 해결.
2. **Action**: `gd upgrade --src` 로컬 모드로 충돌 시나리오 재연 (테스트 시나리오 4)
   - **Result**: 수정 파일 원본 보존 + `<file>.new` 생성 + `docs/` diff 0 + VERSION 재기록 확인

## 🔍 발견 사항

- **bash 3.2 함정 (RCA 후보 아님 — 1회성)**: `local a="$1" b="$2" c="$X$b"` 형태에서 `c` 의 `$b` 는 같은 문 내 `b` 할당 *전* 값으로 확장됨. `set -u` 와 만나면 unbound. → 같은 문에서 직전 변수 참조 금지.
- manifest 가 "상류 sha" 라는 단일 해석 덕에 `gd status` 수정 감지와 `install.sh --update` 충돌 판정이 같은 비교(현재 파일 sha ≠ manifest)로 통일됨 — 별도 상태 메타 불필요.
- `GD_RAW_BASE` 오버라이드(`file://`)로 `gd status` 의 원격 비교까지 네트워크 0 테스트 — curl 의 file:// 지원 활용.

## 🚧 이월 항목 (Optional)

- 실제 네트워크 경로(`gd upgrade` tar.gz fetch, `gd status` raw fetch) 실검증 → phase 통합 테스트 (시나리오 2, 머지 후 phase-ship)
- release 절차(git tag·semver bump)·`src/cli.ts` 축소·README → phase-FF (기등록)

## 🔗 관련 문서 (Related)

- 관련 wiki: [[patterns]]
- 관련 ADR: [[ADR-016]]
- 관련 RCA: 없음

## 📅 메타

| 항목 | 값 |
|---|---|
| **작성자** | Agent + evan |
| **작성 기간** | 2026-06-10 |
| **최종 commit** | `1094695` (+ ship commit) |
