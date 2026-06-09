# Phase-01 비판적 회고

> **✅ 해소 현황 (2026-06-09)** — Critical 4 + Warning 6 정리 완료:
> C2·C3·C5·W5 → `704d38b` / C4·W2·W3 → `0817639` / W1(ADR 3종) → `7971573` / W4 → `83a3939` / W6 → `3b3ea98`.
> **잔여**: **C1(e2e 측정)** = 사용자가 별도 세션에서 미용실 end-to-end 직접 수행 예정(의식적 우회). **W7(진행률 N/5)** = 비이슈로 미수정(구조 슬롯 = sitemap+pages 집계, `gd-plan-start §2` 에 이미 문서화).

> 감사 범위: `backlog/phase-01.md`, spec-01-01~05 (spec.md·walkthrough.md), 9개 스킬, 템플릿 전체, `src/{cli,build-index}.ts`, `__tests__/*` (전건 59 PASS / typecheck clean / 66 collection 확인), ADR-001~012. 근거는 `파일:라인`.
> 독립 Opus 서브에이전트(/hk-phase-review) 수행. 2026-06-09.

## 🔴 Critical (phase-ship 전 반드시 수정)

| # | 문제 | 위치 | 영향 |
|---|------|------|------|
| C1 | **성공기준 1·3·4의 end-to-end 증거가 repo에 없음.** `docs/`에 `decisions/` ADR 폴더만 존재 — sitemap·pages·flows·prd 등 미용실 시나리오 산출물 0. 각 walkthrough가 "end-to-end는 phase-ship 소관"으로 연기. `phase-01.md:150` 검증 섹션 빈칸. | `docs/` 전체, `phase-01.md:150` | 성공기준 1(BLOCK 0)·3(2층 자동)·4(frontmatter↔flow 1:1)이 **선언만**. phase Done 조건 미충족 |
| C2 | **`templates/prd.md:45`가 죽은 `structure.md`를 가리킴** — "모든 CAP은 structure.md의 page로 covers". 신모델은 sitemap/pages. 살아남은 핵심 템플릿 내부 오참조. | `templates/prd.md:45` | prd 템플릿이 인터뷰마다 로드되는 SoT인데 없는 파일 지시 → 오작동 |
| C3 | **`gd-plan-start.md:1` description이 구 평면 모델 명시** — "5종 문서(prd/design/**structure**/flows/ui-rules)". structure는 제거된 단계. description은 Claude Code 1급 노출 텍스트. | `gd-plan-start.md:1` | 진입점이 폐기 단계명 광고. `skills.test.ts:102` grep이 정확매치만 봐서 무탐지 |
| C4 | **`cli.ts main()` 출력이 9개 중 `/gd-plan-critique` 누락**(8개만, lines 91-98). 설치는 glob이라 9개 다 되지만 안내 화면에 critique 미표시. | `src/cli.ts:91-98` | spec-05 핵심 산출물 발견성 0. 설치기↔스킬셋 불일치 |
| C5 | **죽은 `templates/structure.md`가 테스트에 의해 살아있게 강제됨.** spec-04가 "부채"로 인지하고 미처리. `skills.test.ts:74-77`이 구 structure.md 존재 강제, 신 템플릿 존재검사 누락. 파일 내부 `:5` 죽은 `/gd-plan-structure`. | `templates/structure.md`, `skills.test.ts:75` | 폐기 모델 잔존 + 테스트가 보호 → "재편 완료" 결론과 모순 |

## 🟡 Warning (다음 phase 권장)

| # | 문제 | 위치 | 영향 |
|---|------|------|------|
| W1 | spec-05 ADR 3종(critique-vs-review-separation·author-verifier-separation·prd-version-derived-staleness) "phase-ship 시 작성 예정"이나 **미작성**(012까지만). | `docs/decisions/` | 결정 근거 휘발 — "기록축" 자기적용 실패 |
| W2 | 테스트 카운트/명칭 stale: `skills.test.ts:32` "7개"(실제 9), `:66` "structure/review 600"(실제 review/critique), `cli.test.ts:9` "7개", `integration.test.ts:12` "5종". | 각 위치 | 가독성·신뢰 저하 |
| W3 | `integration.test.ts:47-65` "시나리오 3"이 구 평면 `docs/structure.md` regex 매칭 — 신 pages frontmatter 미테스트. | `integration.test.ts:52-64` | 통합 테스트가 폐기 모델 검증 |
| W4 | README stale: `:7` "5종", `:29` `templates/structure`, `:32` "ADR-001~005". | `README.md` | 문서-실제 불일치 |
| W5 | `gd-plan-flows.md:3` description("PAGE-id는 structure.md에 존재")이 본문(§1·§3 "sitemap.md 로스터가 진실")과 모순. | `gd-plan-flows.md:3` | 검증 기준 혼선 |
| W6 | `templates/prd.md:76` `@gen-design/plan`, `structure.md:31`·`flows/_name.md:39` `drafts/*` dead link. | 각 위치 | 작성 예시 깨짐 |
| W7 | "5종/N/5" 진행률이 신모델(6 doc type + critique) 못 담음. | `gd-plan-start.md:37` | 진행률 산식 부정확 |

## 📊 목표 달성도

| # | 성공 기준 | 결과 | 증거 |
|---|----------|:---:|------|
| 1 | 미용실 파이프라인 → sitemap+pages + review BLOCK 0 | ❌ 미측정 | `docs/`에 산출물 없음. phase-ship로 연기 |
| 2 | 페이지 추가 1명령 멱등 | 🟡 부분 | 스킬 지시문 존재, 실제 동작 미실행 검증 |
| 3 | 결정 로그 2층 자동 fork | 🟡 부분 | 템플릿·ADR-011·훅 문자열 존재, 1행 생성 미검증 |
| 4 | frontmatter flows ↔ flow step 1:1 | 🟡 부분 | full re-derive 지시·ADR-012 존재, 실제 도출 미실행 |
| 5 | 회귀 PASS + 설치 검증 | ✅ | 59 PASS, typecheck clean, 설치 9개 검증 |

**spec-05(critique) scope creep 판정 — 건전한 진화 ✅ (부분 일탈).** critique는 review의 맹점("구조 완성 ≠ 의미 정합")을 메우는 검증축 확장이라 phase 정합. 단 ① 제약/규제 슬롯은 prd 재설계라 세로슬라이스와 직접 무관, ② end-to-end 미측정 상태에서 6번째 spec 추가 = 마무리보다 확장 우선 징후.

## 👤 사용자 피드백 반영도
거의 100% 산출물 반영(선언만 한 것 없음) — 이 phase 강점. (대화 한정 #5 제외)

## 🧭 에이전트 소견 (go/no-go)
**조건부 No-go.** 토대(템플릿·ADR·스킬 9종·설치기)는 견고, 피드백 반영·결정 기록·테스트 정직성은 모범적. 그러나 (1) 성공기준 1·3·4 정량 측정 0건(C1), (2) 구 모델 잔재가 활성 산출물에 잔존(C2·C3·C5 — grep 한 번이면 닫힘), (3) C4 critique 설치 안내 누락(1줄 버그).
**권고 순서**: (a) C2/C3/C4/C5 + W stale을 phase-FF 1~2 commit 일괄 정리, (b) 미용실 end-to-end 1회 실행해 성공기준 1·3·4 측정값을 `phase-01.md:150` 기입, (c) phase-ship. 대부분 "마무리 누락"이지 설계 결함 아님 → 빠른 Go 전환 가능.
