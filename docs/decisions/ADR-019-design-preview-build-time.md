---
id: ADR-019
type: tradeoff
date: 2026-06-18
status: accepted
---

# ADR-019: 디자인 후보 프리뷰 = 빌드타임 fragment (node-free 런타임)

## 📚 Context

`/gd-plan-design` 은 66개 검증 시스템 중 후보 3개를 글로만 제시해 사용자가 *실제 톤*을 못 본다(spec-04-01). 후보를 시각화하려면 각 시스템의 토큰(팔레트·폰트·radius·shadow)을 HTML 로 렌더해야 한다. 두 갈래가 있었다: 픽 시점에 **런타임 LLM** 이 .md→HTML 을 생성하거나, **빌드타임**에 미리 생성해 동봉하거나. 런타임 생성은 LLM 비결정성(같은 후보도 매번 다른 출력)과, 폰트 차등 렌더(오픈소스는 CDN 진짜 폰트, 독점은 폴백 → 오픈소스 시스템이 더 완성도 있어 보여 **픽 편향**)라는 두 약점을 갖는다.

## 🎯 Decision

디자인 후보 프리뷰는 **빌드타임에 fragment 로 생성·커밋**하고(`src/build-swatches.ts` → `design-md-collection/_swatches/` 아래 `<name>.html`), 런타임(`gd-plan-design`)은 픽된 3개를 **읽어 결합만** 한다(node 불필요). 폰트는 **이름 라벨 + 균일 폴백**으로 표시(실제 폰트 로드 안 함). 팔레트는 §9 Quick Color Reference 를 정본으로 결정적 파싱.

## 📊 Consequences

- **긍정**: 결정적(같은 .md→같은 fragment, 회귀 가능). 폰트 차등 렌더 편향 제거(공정). 런타임 node-free·per-pick 비용 0·완전 오프라인. `build-index`(ADR-016 self-contained distribution)와 동일 패턴 — dev 빌드 → 소비자 동봉.
- **부정**: 타이포 "느낌" 약화(이름 라벨만 — 공정성과 교환). `.md` 변경 시 `_swatches` 재빌드 필요. 컬렉션에 66개 fragment 추가(경량 HTML). radius/shadow 는 best-effort 추출(불완전 가능).
- **중립**: 빌드 단계 1개 추가(dev-side, 소비자 무영향). 회귀 가드 `test/sh/test-design-preview.sh` + `__tests__/build-swatches.test.ts`.

## 🔀 Alternatives

- **런타임 LLM HTML 생성**: node-free·무한 적응이나 비결정성 + 폰트 편향 + per-pick 비용. 비채택(두 약점이 픽 품질 훼손).
- **실제 폰트 CDN 렌더**: 타이포 충실하나 독점/오픈소스 차등 → 픽 편향. 비채택(공정성 우선).
- **실사이트 스크린샷/링크**: 고충실이나 네트워크 의존·사이트 변동·라이선스. 비채택(오프라인 철학과 충돌).

## 📌 Status

Accepted (2026-06-18, spec-04-01 머지 시점). 첫 사용자: `src/build-swatches.ts`, `plans/gd-plan-design.md` §2.4.

## 🔗 Related

- 관련 spec: spec-04-01
- 관련 ADR: `docs/decisions/ADR-002-design-md-picker-library.md`(컬렉션 픽 — 프리뷰가 픽을 보조), `docs/decisions/ADR-016-self-contained-distribution.md`(dev 빌드→소비자 동봉 패턴)
