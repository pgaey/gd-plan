# spec-02-03: `.gd/bin/gd` 소비자 CLI + 업그레이드 충돌 정책

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-02-03` |
| **Phase** | `phase-02` |
| **Branch** | `spec-02-03-gd-consumer-cli` |
| **상태** | Planning |
| **타입** | Feature |
| **Integration Test Required** | no (phase-02 통합 시나리오 2 가 본 spec 의 e2e) |
| **작성일** | 2026-06-10 |
| **소유자** | evan |

## 📋 배경 및 문제 정의

### 현재 상황

- spec-02-02 가 설치 경로를 완성: `get.sh` → `install.sh` 가 footprint 복사 + `.gd/VERSION`(설치 버전) + `.gd/manifest`(`<sha256>  <path>` 평문, `shasum -c` 호환) 기록. `install.sh` 는 `bin/gd` 를 "존재 시 복사"로 이미 대비해 둠.
- 그러나 설치 후의 수명주기 도구가 없다 — 소비자는 "내 설치가 최신인가", "업그레이드하면 내 수정이 날아가나"에 답할 수 없다.

### 문제점

1. **버전 판단 불가**: `.gd/VERSION` 은 기록만 될 뿐 원격 최신과 비교하는 수단이 없다 (phase 목표: "업그레이드 필요?를 버전으로 판단").
2. **업그레이드 수단 없음**: 재설치(`get.sh`)뿐인데, 이는 사용자 수정 파일을 침묵 덮어쓰기한다 — phase 불변 조건(비가역 손실 금지, RC5 교훈) 위반 경로.
3. 이관 항목 2건 미해결: `.gd/VERSION` 부재 시 복구(critique #6a), 원격 버전 확인 결과 캐시(harness-kit `cache.json` 패턴).

### 해결 방안 (요약)

`bin/gd`(bash, 배포물)에 v1 명령 3개(`status`·`upgrade`·`version`)를 구현하고, `install.sh` 에 `--update` 모드를 추가해 충돌 정책(사용자 수정 파일 = `<file>.new` 보존 + 경고)을 적용한다. manifest 가 "상류가 배포한 내용의 sha" 라는 단일 해석으로 수정 감지·충돌 판정을 통일한다.

## 🎯 요구사항

### Functional Requirements

1. **`gd version`**: `.gd/VERSION` 출력. 부재 시 "unknown — `gd upgrade` 로 복구" 안내 + 비0 종료.
2. **`gd status`**:
   - 설치 버전(`.gd/VERSION`) vs 원격 최신(raw `package.json` 의 version 파싱) 비교 → `최신` / `업그레이드 가능 (x → y)` 출력.
   - 버전 비교는 **자체 semver 비교 함수** (BSD `sort` 에 `-V` 가 없어 `sort -V` 비채택 — 설계 초안 교정).
   - 원격 확인 결과를 `.gd/cache` 평문(`lastCheck=<epoch>` / `latest=<ver>`)에 기록, TTL 1시간 내 재확인 생략. 네트워크 실패 시 캐시 폴백 + 경고 (침묵 실패 금지).
   - 사용자 수정 파일 표시: manifest 와 현재 파일 sha 비교 → 불일치 목록 출력.
   - `.gd/VERSION` 부재 시: 경고 + `gd upgrade` 복구 안내 (임의 재생성 금지 — spec-02-01 합의).
3. **`gd upgrade`**:
   - 최신 tar.gz(main) 다운로드 → 동봉된 `install.sh --update --yes` 위임 (spec-02-02 의 2층 구조 재사용). `--src <dir>` 로컬 모드 지원 (테스트).
   - 완료 시 `.gd/VERSION`·manifest 재기록 — VERSION 부재 상태도 이걸로 복구(critique #6a).
4. **`install.sh --update` 모드** (충돌 정책 — phase 불변 조건):
   - 각 복사 대상에 대해: 기존 파일의 sha ≠ 기존 manifest 항목(= 사용자 수정) 이면 **덮지 않고** `<file>.new` 로 새 버전을 나란히 기록 + 경고 출력.
   - 미수정 파일은 기본 덮어쓰기. `docs/` 절대 미접촉 (기존 보장 유지).
   - 새 manifest 는 **상류 배포 내용의 sha** 를 기록 (사용자 수정 파일은 이후 status 에서 계속 "수정됨"으로 표시 — 의도된 해석).
5. **테스트 환경 격리**: 원격 raw 접근 URL 을 `GD_RAW_BASE` 환경변수로 오버라이드 가능 (`file://` 포함) — 셸 테스트가 네트워크 0 으로 status 원격 비교까지 검증.

### Non-Functional Requirements

1. **소비자 의존 동일**: bash + curl + tar + (shasum|sha256sum) — spec-02-02 와 같은 집합, 추가 없음.
2. **이식성**: macOS bash 3.2 + BSD 도구 호환 (`sort -V`·배열·mapfile 금지).
3. **기존 테스트 회귀 0**: `pnpm test` 67 + `pnpm test:sh` 기존 시나리오 PASS 유지.

## 🚫 Out of Scope

- `uninstall`·`doctor` 명령 — 설계 초안 v1 범위 제외 (YAGNI).
- release 절차(git tag·semver bump 기준 문서) — phase-FF. upgrade 대상은 v1 에서 `main` 고정 (태그 핀은 release 운영 시작 후).
- `src/cli.ts` 축소·README 설치 안내 — phase-FF.
- 컬렉션·스킬 내용 변경 — 없음.

## 📑 ADR 후보 (Architecture Decision Records)

- [ ] ADR 가치 있는 결정 있음
- [x] 없음 — 충돌 정책·배포 모델은 phase 불변 조건 + ADR-016 으로 기록 완료. manifest 해석("상류 sha")은 walkthrough 기록이면 충분

## 🔗 관련 문서 (Related)

- 관련 wiki: [[patterns]]
- 관련 ADR: [[ADR-016]]
- 관련 RCA: 없음 (RC5 교훈은 phase 불변 조건으로 반영)

## ✅ Definition of Done

- [ ] 모든 단위 테스트 PASS (`pnpm test` + `pnpm test:sh`)
- [ ] `walkthrough.md` 와 `pr_description.md` 작성 및 ship commit
- [ ] `spec-02-03-gd-consumer-cli` 브랜치 push 완료
- [ ] 사용자 검토 요청 알림 완료
