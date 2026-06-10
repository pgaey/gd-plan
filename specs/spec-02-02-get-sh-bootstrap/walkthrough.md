# Walkthrough: spec-02-02

> 본 문서는 *작업 기록* 입니다. 결정 과정, 사용자 협의, 검증 결과를 미래의 자신과 리뷰어에게 남깁니다.

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| fetch 방식 (phase 미해결 ①) | release tarball / git archive / raw 나열 | **GitHub archive tar.gz** (`refs/heads/main` 또는 `refs/tags/v<ver>`) | 1요청에 컬렉션 포함 전체 수신 (ADR-016 "동봉 비용 0" 실현), `tar` 기본 탑재. harness-kit 실물(zip)과 동형이되 unzip 의존 회피 |
| bash 테스트 도구 (phase 미해결 ②) | bats / 셸 어서션 | **의존성 없는 셸 어서션** (`test/sh/run.sh`) | bats 는 설치 의존 발생. 러너 23줄로 충분 (YAGNI) |
| 설치기 구조 | get.sh 단일 / get.sh+install.sh 2층 | **2층 위임** (harness-kit 동형) | get.sh 는 curl 대상이라 안정 유지, 설치 로직은 archive 와 함께 버전됨 — spec-02-03 upgrade 가 install.sh 재사용 가능 |
| 소비자 CLAUDE.md fragment | 채택 / 비채택 | **v1 비채택** | `/gd-plan-start` 가 진입점 역할 충분 (YAGNI). 필요시 Icebox 승격 |
| `bin/gd` 부재 처리 | 스텁 생성 / 존재 시 복사 | **존재 시 복사** | spec-02-03 산출물 선점 방지 — gd 추가되면 install.sh 수정 없이 자동 포함 |

### ADR 승격 가이드

- [ ] ADR 승격 대상 있음
- [x] 없음 — 배포 모델은 ADR-016 기록 완료, 본 결정들은 그 구현 세부

## 💬 사용자 협의

- **주제**: Plan Accept 전 결정 3건 (fetch 방식·테스트 도구·fragment)
  - **합의**: plan.md User Review 3건 그대로 승인 (Plan Accept, 2026-06-10)
- **주제**: 수동 검증 시나리오 1 (/tmp 설치)
  - **사용자 의견**: 해당 명령 실행 거부
  - **합의**: 생략 — 동일 검증(설치 + `shasum -c`)을 자동 셸 테스트가 mktemp 격리 디렉토리에서 수행하므로 증거 충분

## 🧪 검증 결과

### 1. 자동화 테스트

#### 단위 테스트
- **명령**: `pnpm test` + `pnpm test:sh` + `pnpm typecheck`
- **결과**: ✅ vitest 67/67 PASS (회귀 0) + 셸 시나리오 4건 PASS + typecheck 클린
- **로그 요약**:
```text
[Red — fb61b2e 시점] ✗ test-get.sh (get.sh 미존재) — exit 1
[Green — b746445 시점]
  · 시나리오1: fresh 설치 (footprint·스킬9·컬렉션 66+인덱스·VERSION=0.1.0·manifest shasum -c)
  · 시나리오2: docs/ 미접촉
  · 시나리오3: 멱등 재실행
  · 시나리오4: node 비의존 (PATH=/usr/bin:/bin)
shell tests: 1 passed, 0 failed
```

### 2. 수동 검증

1. **Action**: harness-kit get.sh 실물 fetch·분석 (설계 전)
   - **Result**: archive 1요청 + mktemp/trap + repo 내 install.sh 위임 구조 확인 — 동형 적용
2. **Action**: plan.md 수동 시나리오 2 (네트워크 경로 curl 실행) — push 전이라 브랜치 raw URL 미존재
   - **Result**: 보류 — phase 통합 테스트 시나리오 1 (머지 후 main 기준) 에서 검증 예정

## 🔍 발견 사항

- `tar.gz` 해제 시 GitHub archive 의 루트 디렉토리명이 `gd-plan-<ref>` 형태라 `find -name "gd-plan-*"` 로 탐지 — 태그/브랜치 모두 동작.
- install.sh 의 manifest 는 `shasum -c` 표준 형식이라 spec-02-03 의 충돌 감지(`gd status`)가 추가 파서 없이 소비 가능.

## 🚧 이월 항목 (Optional)

- 네트워크 경로 실검증 (`bash <(curl …get.sh)`) → phase 통합 테스트 시나리오 1 (머지 후)
- README 설치 안내 + `src/cli.ts` 축소 → phase-FF (기등록)

## 🔗 관련 문서 (Related)

- 관련 wiki: [[patterns]]
- 관련 ADR: [[ADR-016]]
- 관련 RCA: 없음

## 📅 메타

| 항목 | 값 |
|---|---|
| **작성자** | Agent + evan |
| **작성 기간** | 2026-06-10 |
| **최종 commit** | `839ea58` (+ ship commit) |
