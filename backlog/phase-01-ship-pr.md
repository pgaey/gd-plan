# Phase Ship: phase-01 — gd-plan 세로 슬라이스 재편 + 의미 정합 critique

## 📋 Overview

gd-plan 출력 모델을 **평면 5문서 → 지도(`sitemap.md`) + 페이지별 디렉토리(`pages/[PAGE]/`) + 2층 결정 로그**로 재편하고, ID 스파인(`role·[CAP]→[PAGE]→[FLOW]`)을 frontmatter 기계가독으로 만들어 검증 토대를 깔았다. 더불어 review(구조 정합)가 통과시키는 "정합적이지만 틀린" 기획을 잡는 **`/gd-plan-critique`(의미 정합)** 검증축을 추가했다.

## 📦 Scope: 계획 vs 실제

| 구분 | 항목 | 비고 |
|:---:|---|---|
| ✅ 완료 | spec-01-01: dir 모델·템플릿 (PR #1) | |
| ✅ 완료 | spec-01-02: sitemap/page 커맨드 (PR #2) | |
| ✅ 완료 | spec-01-03: 결정 로그 2층 자동 (PR #3) | |
| ✅ 완료 | spec-01-04: flows 역참조·review 신모델 (PR #4) | |
| ➕ 추가 | spec-01-05: PRD 전제 critique + 제약/규제 prevention (PR #5) | 건전한 진화 — review 맹점 보완 |
| ➕ 추가 | phase-FF: 회고 잔재정리(C2~C5) + 비가역 결정 마커 + MVP→Later 댕글링 | 회고 반영 |

## 📊 Spec Summary

| PR | Spec | 핵심 변경 |
|---|---|---|
| #1 | spec-01-01-dir-model-templates | sitemap/pages/decisions 템플릿 + ADR-006~008 |
| #2 | spec-01-02-vertical-slice-commands | `/gd-plan-sitemap`·`/gd-plan-page` + 평면 structure 대체 |
| #3 | spec-01-03-decision-log-auto | 결정 로그 6열 스키마 + ADR-011 정본 |
| #4 | spec-01-04-flows-autoref-review | flows full re-derive + review 신모델 ID 체인 + ADR-012 |
| #5 | spec-01-05-prd-critique | `/gd-plan-critique`(3렌즈·독립 서브에이전트) + 제약/규제 슬롯 + ADR-013~015 |

## ✅ Success Criteria Checklist

| # | 기준 | 결과 | 증거 |
|:---:|---|:---:|---|
| 1 | 미용실 e2e → sitemap+pages + review BLOCK 0 | ⏳ **사용자 별도세션** | 스킬·템플릿 구조 완비, end-to-end 실행은 phase-02 CLI 로 별도 검증(의식적 deferral) |
| 2 | 페이지 추가 1명령 멱등 | ✅ PASS | `gd-plan-page` §3·§6·§7 멱등 규약, 설치 9개 검증 |
| 3 | 결정 로그 2층 자동 기록 | ⏳ **사용자 별도세션** | 템플릿 6열·ADR-011·훅 문자열 완비, 실제 1행 생성은 e2e |
| 4 | frontmatter flows ↔ flow step 1:1 | ⏳ **사용자 별도세션** | full re-derive 지시·ADR-012 완비, 실제 도출은 e2e |
| 5 | 회귀 PASS + 설치 검증 | ✅ PASS | `pnpm test` 62 PASS · typecheck · build · build-index · 설치 9개 |

> **결정**: 사용자가 1·3·4 의 미용실 end-to-end 측정을 phase-02(배포 CLI) 완성 후 새 프로젝트에서 직접 수행하기로 함(phase-01-review.md C1, phase-01.md 검증란 기록).

## 🧪 Integration Test Results

| # | 시나리오 | 결과 | 증거 |
|:---:|---|:---:|---|
| 1 | 스킬 9개 설치 | ✅ PASS | `integration.test.ts` installPlans=9 |
| 2 | 컬렉션 인덱스 점수화 필드 | ✅ PASS | 66 collection, cal.md 톤 필드 |
| 3 | sitemap covers set-diff (CAP 누락=BLOCK 입력) | ✅ PASS | `integration.test.ts` 시나리오3 (신모델) |

## 🏗 Architecture Decisions

- **세로 슬라이스 단위**(ADR-006): 페이지=디렉토리(harness-kit spec 대응). 평면 structure.md 폐기.
- **검증 2층 분리**(ADR-013): critique(의미) / review(구조). "구조적 완성 ≠ 의미적 정합".
- **저작자≠검증자**(ADR-014): 독립 컨텍스트 우선 + 정직한 degrade(침묵 self-review 금지).
- **flows full re-derive**(ADR-012) · **prd version 파생 staleness**(ADR-015).

## ⚠️ Known Issues / Technical Debt

- **성공기준 1·3·4 e2e 미측정** — 사용자 별도세션(phase-02 CLI 로 설치 후). 회고 조건부 No-go 의 C1 을 의식적 우회.
- **stale ADR 8건**(`sdd status`) — 구 ADR-001/002/006… missing-path(gen-design 시절 경로). 이번 phase 무관한 선재 부채 → 다음 phase 후보.
- **W7 진행률 N/5** — 비이슈로 미수정(구조 슬롯=sitemap+pages 집계, 문서화됨).

## 📝 Follow-up Work

- **phase-02: 배포·버전·업그레이드** — `bash <(curl …) <dir>` self-contained 설치 + `.gd/bin/gd` + 버전 manifest. 설계: `backlog/phase-02-distribution-design.md`.
- **디자인층 critique** — design.md·ui-rules 대비비·금지 UI 검증(별도 spec).
- **가치-recall 자동 eval 하니스** — golden fixture 주기 실행.

## 📊 Stats

- **Files changed**: 111 (+6054 / -175)
- **Commits**: 76
- **Test suites**: 5개, 62 checks
- **Specs**: 5개 완료(Merged), 0개 이연
