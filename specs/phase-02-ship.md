# Phase Ship: phase-02 — 배포·버전·업그레이드 (distribution)

## 📋 Overview

gd-plan 을 harness-kit 형태(`curl | bash`)로 외부 프로젝트에 설치/업그레이드 가능하게 만든다. 소비자는 node 없이 bash 만으로 설치·상태확인·업그레이드를 수행하고, 버전(`.gd/VERSION`)으로 "업그레이드 필요?"를 판단한다. 비가역 손실 금지(RC5 교훈)를 업그레이드 충돌 정책으로 코드 보장.

## 📦 Scope: 계획 vs 실제

| 구분 | 항목 | 비고 |
|:---:|---|---|
| ✅ 완료 | spec-02-01: design 스킬 2모드 + 컬렉션 전체 동봉 규약 (PR #7) | brainstorm "인덱스만+픽 fetch" 번복 |
| ✅ 완료 | spec-02-02: get.sh 부트스트랩 + install.sh 설치기 (PR #8) | |
| ✅ 완료 | spec-02-03: gd 소비자 CLI + install.sh --update 충돌 정책 (PR #9) | |
| ✅ 완료 | phase-FF: README 설치 안내 + src/cli.ts deprecate | `9564d72` |
| ✅ 완료 | phase-FF: release 절차 문서 (`docs/RELEASE.md`) | `af5cc2c` |
| ⏭ 이연 | 미용실 e2e (통합 시나리오 3) | 인터랙티브 스킬 실행 — 사용자 별도 세션 (phase-01 C1 연속) |

## 📊 Spec Summary

| PR | Spec | 핵심 변경 |
|---|---|---|
| #7 | spec-02-01-dist-artifacts-index | design 스킬 dev/소비자 2모드, 컬렉션 전체 동봉, ADR-016, 버그 2건 교정 |
| #8 | spec-02-02-get-sh-bootstrap | get.sh(archive tar.gz 1요청+위임) + install.sh(footprint·VERSION·manifest), 셸 테스트 하네스 |
| #9 | spec-02-03-gd-consumer-cli | gd version·status·upgrade + install.sh --update 충돌 정책(`<file>.new`) |

## ✅ Success Criteria Checklist

| # | 기준 | 결과 | 증거 |
|:---:|---|:---:|---|
| 1 | curl\|bash 1회 footprint 전체 설치 + node 미설치 | ✅ PASS | `get.sh --src` → 스킬 9·컬렉션 66·VERSION 0.1.0, `shasum -c` OK / test-get 시나리오 4(node 비의존 PATH) |
| 2 | `gd status` 설치 vs 원격 최신 판별 | ✅ PASS | 실제 raw 네트워크 비교 → "✓ 최신 (0.1.0)" / test-gd 시나리오 3 업그레이드 가능 |
| 3 | `gd upgrade` 수정 파일 손실 0 | ✅ PASS | test-gd 시나리오 4 — 원본 보존 + `.new` + docs diff 0 + VERSION 재기록 |
| 4 | 컬렉션 전체 동봉 + 픽 네트워크 0 | ✅ PASS | footprint 66 동봉 + design 스킬 네트워크 지시 부재 테스트 |
| 5 | vitest 회귀 + bash 테스트 PASS | ✅ PASS | vitest 67/67 + 셸 9건 + build success |

## 🧪 Integration Test Results

| # | 시나리오 | 결과 | 증거 |
|:---:|---|:---:|---|
| 1 | fresh 설치 (node 없는 환경) | ✅ PASS | test-get.sh 4건 (footprint·docs 미접촉·멱등·node 비의존) |
| 2 | 업그레이드 + 충돌 보존 | ✅ PASS | test-gd.sh 5건 (status·upgrade 충돌·VERSION 복구) |
| 3 | 미용실 e2e (설치본 스킬 파이프라인) | ⏳ 이연 | Claude Code 인터랙티브 실행 필요 — 사용자 별도 세션 (phase-01 C1) |

## 🏗 Architecture Decisions

- **배포 모델 (ADR-016)**: self-contained bash 배포(npm 비채택) + 컬렉션 전체 동봉(인덱스만+픽 fetch 번복, 실측 1.2MB) + public GitHub repo = 배포 서버.
- **repo public 전환**: curl 한 줄 설치를 위해 private → public (raw 200 확인).
- **2층 설치 구조**: get.sh(얇은 부트스트랩) + install.sh(설치 로직) — upgrade 가 install.sh 재사용.
- **manifest = 상류 배포 sha**: status 수정 감지와 upgrade 충돌 판정을 동일 비교로 통일.
- **충돌 정책**: 사용자 수정 파일은 `<file>.new` 보존 + 경고, `docs/` 절대 미접촉 (비가역 손실 금지, RC5).

## ⚠️ Known Issues / Technical Debt

- **네트워크 tarball 전체 경로 미검증**: `get.sh` → `main.tar.gz` 는 install.sh 가 main 에 올라간 *후* 동작 — 본 PR 머지로 해소(첫 release 닭-달걀). raw fetch·`--src`·`gd status` 네트워크는 실증 완료. 머지 직후 재검증 예정.
- **upgrade ref = main 고정 (v1)**: 태그 핀 기반 업그레이드는 태그 운영 안정화 후 전환 (spec-02-03 결정 기록 / `docs/RELEASE.md`).
- **셸 lint 미적용**: shellcheck 미설치 환경 — 권장사항.

## 📝 Follow-up Work

- 미용실 e2e (통합 시나리오 3 / phase-01 C1) — 사용자 별도 세션에서 설치본 스킬 실행 측정
- `v0.1.0` 태그 생성 (release 절차) — 첫 release 시점에
- gd `uninstall`·`doctor` — YAGNI 로 v1 제외, 필요 시 Icebox 승격

## 📊 Stats

- **Files changed**: 31
- **Lines**: +2267, -9
- **Test suites**: vitest 67 + 셸 9 (test-get 4 + test-gd 5)
- **Specs**: 3개 완료 + phase-FF 2건, 0개 이연 (시나리오 3 측정만 이연)
