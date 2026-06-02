---
id: ADR-001
type: invariant
date: 2026-06-01
status: accepted
---

# ADR-001: 레이어별 SSOT — 상류=prd.md / 하류=chat.md (단방향 docs→chat)

> spec-13-01 ADR-A. 기획 레이어(gd-plan) 도입에 따른 SSOT 경계 정의.

## 📚 Context

gd-plan 상류 기획 레이어(prd/design/structure/flows/ui-rules)를 도입하면서, 기존 하류 SSOT(`chat.md`)와 새 상류 문서 사이의 권위 관계가 모호해졌다. "prd.md 가 SSOT"와 "chat.md 가 SSOT"가 충돌하는 것처럼 보였다 (critique 지적). 두 문서는 서로 다른 레이어를 다루므로 단일 SSOT 로 묶으면 안 된다.

## 🎯 Decision

SSOT 를 **레이어별로 분리**한다:
- **상류(기획) SSOT = `docs/prd.md`** — 무엇을·누구를·어떤 capability.
- **하류(화면) SSOT = `chat.md`** — 화면 구조·컴포넌트.
- 5종 기획 문서는 chat.md 생성 시 **단방향 입력**(docs → chat). chat.md 가 docs 를 거꾸로 수정하지 않는다 (패턴 A).

## 📊 Consequences

- **긍정**: SSOT 충돌 해소. 각 레이어가 독립적으로 진화. `/gd-chat` 주입(F9)이 "docs 우선" 규칙으로 명확.
- **부정**: 상류 변경 시 하류 staleness 전파가 자동이 아님 (수동 재생성 필요 — v2 백로그).
- **중립**: 양방향 자동 sync 는 영구 backlog (Figma/Webflow 도 미해결).

## 🔀 Alternatives

- **단일 SSOT (chat.md 만)**: 기획을 chat 에 흡수 — 비채택: 프로젝트 전체 틀이 scene 단위에 안 담김.
- **양방향 자동 sync**: docs ↔ chat 양방향 — 비채택: 난제(scope 폭발), 업계 미해결.

## 📌 Status

Accepted (2026-06-01, gd-plan 초안 (gen-design 에서 분리)). 첫 사용자: ``, `gd-chat.md` §1 주입.
