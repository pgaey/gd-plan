---
id: ADR-009
type: convention
date: 2026-06-04
status: accepted
---

# ADR-009: slug ↔ PAGE-id 정규화 규칙

> spec-01-02 critique 발견. slug = 디렉토리명 = 식별자 스파인.

## 📚 Context

`/gd-plan-page <slug>` 의 slug 는 곧 `docs/pages/[PAGE-<slug>]/` 디렉토리명이자 안정 식별자다. flow step 의 `@[PAGE-id]`, review 의 BLOCK 추적(role→CAP→PAGE→FLOW)이 모두 이 ID 로 연결된다(→ ADR-008). 정규화 규칙이 없으면 `Home` vs `home` 충돌, 한글/공백 slug, 중복 재호출 동작이 들쭉날쭉해 식별자 안정성이 깨진다.

## 🎯 Decision

slug 는 **소문자 kebab-case ASCII** 로 정규화한다. `[PAGE-<slug>]` 가 페이지 식별자.
- 대문자·공백·한글 입력 → 경고 후 ASCII kebab 으로 변환(또는 사용자 지정 slug 요청). 예: `예약 상세` → `booking-detail`.
- **중복 slug 재호출 = 기존 페이지로 간주**(신규 생성 아님). 멱등 진입점(→ gd-plan-page §7).

## 📊 Consequences

- **긍정**: 식별자 안정 — 디렉토리·flow 참조·review BLOCK 이 한 규칙에 수렴. 충돌·중복 제거.
- **부정**: 비ASCII 도메인은 음역/지정 한 단계 필요(의도된 마찰).
- **중립**: 파일시스템·URL 친화 컨벤션(kebab)과 정합.

## 🔀 Alternatives

- **자유 slug**: 입력 그대로 — 비채택: 충돌·대소문자 불안정.
- **자동 번호 ID(PAGE-01…)**: 안정하나 가독성·기억성 낮음 — 비채택: slug 가 의미를 담아야 인터뷰·리뷰가 읽힘.

## 📌 Status

Accepted (2026-06-04, spec-01-02). 첫 사용자: `plans/gd-plan-page.md`.

## 🔗 Related

- `docs/decisions/ADR-006-vertical-slice-page-unit.md`, `ADR-008-decision-log-two-tier.md`
