# spec-04-01: 후보 무드 스와치 프리뷰 — 빌드타임 fragment (Part A)

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-04-01` |
| **Phase** | `phase-04` |
| **Branch** | `spec-04-01-design-preview` |
| **상태** | Planning |
| **타입** | Feature (build + design 스킬 보강) |
| **작성일** | 2026-06-18 |
| **소유자** | pgaey |

## 배경 및 문제 정의

### 현재 상황
`/gd-plan-design` §2.4 는 상위 3후보를 글 한 줄로만 제시 — 사용자가 실제 톤을 못 본다.

### 문제점
글만 보고 픽해야 한다.

### 해결 방안 (critique 반영 — 대안 C)
**dev 빌드**가 66개 시스템 각각의 무드 스와치 HTML fragment 를 1회 생성·커밋(`build-index` 선례와 동일: dev 빌드 → 소비자 node-free). 런타임엔 픽된 3개 fragment 를 읽어 `docs/_design-preview.html` 로 **결합만**(node 불필요). 빌드타임 생성이라 **결정적**이고, 폰트는 **균일 폴백 + 폰트명 라벨**이라 독점/오픈소스 차등 렌더로 인한 **픽 편향이 없다**.

## 요구사항

1. **빌드 스크립트** `src/build-swatches.ts` (dev-side, node): 각 `design-md-collection/*.md` 에서:
   - **팔레트**: §9 `Quick Color Reference` 블록을 정본으로 파싱(`- <라벨>: <이름> (\`#hex\`)` 규칙) → primary/text/surface/accent 칩.
   - **폰트명**: `_index.json` `typography_summary` 또는 §3 → 라벨로만 표기(실제 폰트 로드 안 함 — 편향 0, 오프라인 완전).
   - **radius·shadow**: §9 Example Component Prompts / §4·§6 에서 best-effort 추출(없으면 생략).
   - → `design-md-collection/_swatches/<name>.html` fragment 생성(팔레트 칩 + 타이포 specimen[시스템 폰트 + "<폰트명>" 라벨] + 버튼 1개[radius·shadow·CTA색]).
2. **66개 fragment 커밋** + `package.json` 에 `build-swatches` 스크립트. `files`/배포에 `_swatches/` 포함(소비자 동봉).
3. **런타임 결합**: `gd-plan-design.md` §2.4 — top-3 좁힌 뒤 `_swatches/<file>.html` 3개를 읽어 `docs/_design-preview.html`(grid 3열 + 정직 배너[타이포는 폰트명 라벨, 실제 폰트 아님] + 후보명/근거 캡션)로 **결합**(node-free, LLM 파일 읽기+병합). 텍스트 후보 목록 유지 + "프리뷰 열기: `docs/_design-preview.html`(수동, 더블클릭)" 안내.
4. **부분 렌더 규약**: 팔레트 hex 미발견 시 해당 칩 생략 + 라벨 표기(왜곡보다 공백). 카드 최소 토큰 = 팔레트 1색 + 폰트명. radius 없으면 0, shadow 없으면 none.
5. **안전**: 추출값은 CSS 값/텍스트로만 취급(임의 마크업 주입 금지). 스와치 자체 가독성 확보(surface↔text 대비 보장).
6. **위생·라이프사이클**: `docs/_design-preview.html` 은 `_`-prefix(auto-load 무시) + 소비자 `.gitignore` 권고 항목(산출물, 커밋 불필요). `_swatches/` 는 동봉 자산(커밋됨).
7. **멱등**: 재실행 시 `_design-preview.html` 덮어쓰기.
8. **결정성**: 빌드타임 생성이라 동일 .md → 동일 fragment(런타임 LLM 변동 제거).

## Out of Scope

- 외부 ref / 오버라이드 (→ spec-04-02).
- 실제 독점 폰트 렌더(라이선스·편향) — 폰트명 라벨로 대체.
- 풀 샘플 페이지(nav+hero) — 무드 스와치만.
- 실사이트 스크린샷/라이브 링크.

## 🛑 사용자 검토 필요

> [!IMPORTANT]
> - [ ] 폰트는 **실제 렌더 안 하고 이름 라벨**로만 보여준다(SF Pro·Cal Sans 등 모두 동일 시스템 폰트로 표시 + 라벨). 이유: 독점/오픈소스 차등 렌더가 픽을 왜곡하기 때문(critique). 타이포 "느낌"은 약화되지만 *공정성*을 택함.
> - [ ] `_swatches/` 66개 fragment 가 컬렉션에 추가되어 배포 용량이 늘어난다(텍스트 HTML이라 경량).

## 핵심 전략

| 컴포넌트 | 전략 | 이유 |
|:---:|:---|:---|
| 생성 시점 | 빌드타임(dev) 1회 → 커밋 | 결정적, 런타임 node-free·비용 0 (`build-index` 선례) |
| 팔레트 추출 | §9 Quick Color Reference 파싱 | 모든 .md 보유, 규칙적 → 결정적 |
| 폰트 | 이름 라벨 + 균일 폴백 | 차등 렌더 편향 제거, 오프라인 완전 |
| 런타임 | 3 fragment 읽어 결합 | node 불필요(LLM 파일 병합) |

## Proposed Changes

#### [NEW] `src/build-swatches.ts`
66개 .md → `_swatches/*.html` fragment 생성(팔레트 §9 파싱 + 폰트명 라벨 + radius/shadow best-effort).

#### [NEW] `design-md-collection/_swatches/*.html` (66, 빌드 산출·커밋)

#### [MODIFY] `package.json`
`build-swatches` 스크립트 + `build` 에 연결(또는 별도), `files` 에 `_swatches` 포함.

#### [MODIFY] `plans/gd-plan-design.md`
§2.4 fragment 결합 규약 + `_design-preview.html` 구조·정직 배너·수동 열람·git 권고. §5 멱등.

#### [NEW] `docs/decisions/ADR-019-design-preview-build-time.md`
프리뷰 생성 = 빌드타임 fragment, node-free 런타임 — 결정성/공정성 ↔ 단순성 tradeoff (type: tradeoff).

## 검증 계획

```bash
pnpm build-swatches               # 66 fragment 생성
pnpm test                         # build-swatches 단위 테스트(vitest)
bash test/sh/test-design-preview.sh  # 스킬 결합 규약 가드
bash test/sh/run.sh
```
수동: 샌드박스 재설치 후 후보 3개 결합 프리뷰 생성 → 시스템별 팔레트·radius·shadow 차이 확인(통합 시나리오 1). 동일 후보 재생성 시 동일 출력(결정성) 확인.

## ADR 후보

- [x] ADR-019: 프리뷰 = 빌드타임 fragment(node-free 런타임) tradeoff (type tradeoff). phase-04 결정표 보강.

## ✅ Definition of Done

- [ ] `src/build-swatches.ts` + vitest 단위 테스트(팔레트 §9 파싱·부분 렌더·안전) PASS
- [ ] 66 `_swatches/*.html` 생성·커밋 + `package.json`/`files` 반영
- [ ] `gd-plan-design.md` fragment 결합 규약 + `test/sh/test-design-preview.sh` 가드 PASS
- [ ] `ADR-019` 작성
- [ ] 샌드박스 재설치 전파 + 샘플 결합 프리뷰 + 결정성 확인
- [ ] walkthrough/pr_description ship + push + PR
