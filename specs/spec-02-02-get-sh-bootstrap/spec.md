# spec-02-02: get.sh 부트스트랩 설치기

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-02-02` |
| **Phase** | `phase-02` |
| **Branch** | `spec-02-02-get-sh-bootstrap` |
| **상태** | Planning |
| **타입** | Feature |
| **Integration Test Required** | no (phase-02 통합 시나리오 1·3 에서 e2e 검증) |
| **작성일** | 2026-06-10 |
| **소유자** | evan |

## 📋 배경 및 문제 정의

### 현재 상황

- spec-02-01 이 소비자 footprint 규약을 확정함: 스킬 9개(`.claude/commands/`) + `.gd/{templates, design-md-collection(전체+인덱스), bin/gd, VERSION, manifest}`. repo 는 public — 비인증 fetch 가능 (ADR-016).
- 그러나 그 footprint 를 외부 프로젝트에 **실제로 까는 수단이 없다**. 기존 `src/cli.ts` 는 node 필요 + 스킬 9개만 복사 (외부에서 스킬 동작 불가).
- harness-kit get.sh 실물 확인 결과 검증된 패턴: **archive 1요청 다운로드 → 임시 dir 해제 → repo 안의 install 스크립트에 위임** (get.sh 는 얇은 부트스트랩으로 유지).

### 문제점

1. 소비자(node 미설치)가 gd-plan 을 설치할 한 줄 명령이 없다 — phase-02 목표의 본체.
2. 버전 스탬프(`.gd/VERSION`)·파일 무결성 기록(`.gd/manifest`)이 없어 spec-02-03(status·upgrade·충돌 감지)의 입력이 존재하지 않는다.
3. 미해결 결정 2건이 본 spec 에 배정되어 있다: **fetch 방식**(tarball / git archive / raw 나열), **bash 테스트 도구**(bats / 셸 어서션).

### 해결 방안 (요약)

harness-kit 동형 2층 구조 — `get.sh`(부트스트랩: tar.gz archive 다운로드 + 해제 + 위임) + `install.sh`(repo 내: footprint 복사 + VERSION·manifest 기록). 테스트는 의존성 없는 셸 어서션 하네스(`test/sh/`)로, `--src` 로컬 모드 덕에 네트워크 없이 전 시나리오를 검증한다.

## 🎯 요구사항

### Functional Requirements

1. **get.sh (부트스트랩, repo 루트)**:
   - 사용: `bash <(curl -fsSL https://raw.githubusercontent.com/pgaey/gd-plan/main/get.sh) [--yes] [--version <semver>] [--src <local-dir>] <target-dir>`
   - fetch: `https://github.com/pgaey/gd-plan/archive/refs/heads/main.tar.gz` (기본) / `--version` 시 `refs/tags/v<semver>.tar.gz` — **1요청 + `tar` 기본 탑재** (미해결 "fetch 방식" 확정: tarball).
   - `curl -fsSL` + `mktemp -d` + `trap` 정리 (harness-kit 동형). 다운로드·해제 실패 시 명확한 에러 + 비0 종료.
   - `--src <dir>`: fetch 생략, 로컬 체크아웃에서 설치 (테스트·오프라인용).
   - 해제 후 archive 안의 `install.sh` 에 위임.
2. **install.sh (실제 설치, repo 루트)**:
   - 복사 맵: `plans/gd-plan-*.md` → `<dir>/.claude/commands/` · `templates/` → `<dir>/.gd/templates/` · `design-md-collection/`(전체+`_index.json`) → `<dir>/.gd/design-md-collection/` · `bin/gd` → `<dir>/.gd/bin/gd` (**존재 시** — spec-02-03 산출물이 추가되면 자동 포함).
   - `.gd/VERSION` 기록: `package.json` 의 `"version"` 을 grep/sed 로 파싱 (node 비사용).
   - `.gd/manifest` 기록: 설치한 전 파일의 `<sha256>  <상대경로>` 라인 (평문, `shasum -c` 호환). `shasum -a 256`(macOS) / `sha256sum`(Linux) 자동 감지.
   - 멱등: 기존 `.gd/` 존재 시 `--yes` 없으면 1회 확인 후 진행, 재실행 결과 동일.
   - **`docs/` 절대 미접촉** (사용자 산출물 — phase 불변 조건).
3. **bash 테스트 하네스 확정** (미해결 "테스트 도구" 확정: **의존성 없는 셸 어서션**, bats 비채택):
   - `test/sh/run.sh` — `test/sh/test-*.sh` 를 실행해 PASS/FAIL 집계, 실패 시 비0 종료.
   - `package.json` 에 `test:sh` 스크립트 등록.
4. **테스트 시나리오** (전부 `--src` 로컬 모드, 네트워크 0):
   - fresh 설치: footprint 전 파일 존재 + 스킬 9개 + VERSION = package.json version + `manifest` 가 `shasum -c` 통과.
   - `docs/` 미접촉: 사전 생성한 `docs/` 파일이 설치 후 그대로.
   - 멱등: `--yes` 재실행 종료코드 0 + 결과 동일.
   - node 비의존: node 가 보이지 않는 제한 PATH 서브셸에서 설치 성공.

### Non-Functional Requirements

1. **소비자 의존 최소**: bash + curl + tar + (shasum|sha256sum) 만 — node·unzip·bats 비의존.
2. **이식성**: macOS bash 3.2 호환 (배열·mapfile 등 4+ 전용 문법 금지), `set -euo pipefail`.
3. **기존 vitest 회귀 0**: `pnpm test` PASS 유지 (node 측 변경 없음).

## 🚫 Out of Scope

- `.gd/bin/gd` (status·upgrade·version) 구현 — spec-02-03 (install.sh 는 "존재 시 복사"로 대비만).
- 업그레이드 충돌 정책(`<file>.new`) — spec-02-03 (`gd upgrade` 영역. get.sh 는 fresh 설치 + 명시적 재실행만).
- `src/cli.ts` 축소·README 설치 안내 — phase-FF.
- release(git tag·semver bump) 절차 — phase-FF. `--version` 은 태그가 생기면 동작하는 형태로만 구현.
- 소비자 CLAUDE.md fragment import — **v1 비채택** (plan.md User Review 참조). 필요해지면 Icebox 승격.

## 📑 ADR 후보 (Architecture Decision Records)

- [ ] ADR 가치 있는 결정 있음
- [x] 없음 — 배포 모델은 ADR-016 에 기록 완료. fetch 방식(tarball)·테스트 도구(셸 어서션)는 구현 세부로 spec/walkthrough 기록이면 충분

## 🔗 관련 문서 (Related)

- 관련 wiki: [[patterns]]
- 관련 ADR: [[ADR-016]] (배포 모델 — 본 spec 이 그 구현)
- 관련 RCA: 없음

## ✅ Definition of Done

- [ ] 모든 단위 테스트 PASS (`pnpm test` + `pnpm test:sh`)
- [ ] `walkthrough.md` 와 `pr_description.md` 작성 및 ship commit
- [ ] `spec-02-02-get-sh-bootstrap` 브랜치 push 완료
- [ ] 사용자 검토 요청 알림 완료
