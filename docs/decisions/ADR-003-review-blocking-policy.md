---
id: ADR-003
type: tradeoff
date: 2026-06-01
status: accepted
---

# ADR-003: /gd-plan-review 하이브리드 차단 정책 (structural=BLOCK / style·vocabulary=WARN)

> spec-13-01 ADR-C. 일관성 검증의 차단 강도와 그 대가.

## 📚 Context

5종 기획 문서는 안정 ID 로 연결된 하나의 모델(`role->capability->page->flow`)이다. 끊긴 고리를 검증해야 일관성이 강제되지만, 모든 불일치를 BLOCK 하면 마찰이 크고, LLM 주관 판정(wording 등)은 오탐이 많다.

## 🎯 Decision

차단을 **카테고리별로 차등**한다 (v1):
- **structural** (capability 미covers / page 미등장 flow / flow step PAGE 부재 / 주체역할 부재) = **BLOCK** — `/gd-chat` 진입 차단.
- **style · vocabulary** = **WARN** — 진행 가능.
- `--force-continue` 로 BLOCK 우회 가능 (사용자 책임).
- wording·completeness 체크와 결정적 set-diff 는 **v2 연기**.

## 📊 Consequences

- **긍정**: 핵심 구조 결함만 막아 마찰 최소화. USP(일관성 강제)를 structural 에 집중.
- **부정**: v1 BLOCK 판정이 LLM 기반이라 재현성이 결정적이지 않음 (근거 인용으로 완화, set-diff 는 v2).
- **중립**: `_review.md` 는 overwrite(누적 금지)로 판정 소스 명확.

## 🔀 Alternatives

- **모두 BLOCK**: 강한 강제 — 비채택: 마찰 과다, 오탐으로 `--force-continue` 남발 → 차단 가치 소실.
- **모두 WARN(권고만)**: spec-kit 식 — 비채택: USP(강제)가 약해짐.

## 📌 Status

Accepted (2026-06-01, gd-plan 초안 (gen-design 에서 분리)). 첫 사용자: `plans/gd-plan-review.md`, `gd-chat.md` §5.10.
