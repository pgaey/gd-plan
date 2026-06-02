---
id: ADR-005
type: decision
date: 2026-06-01
status: accepted
---

# ADR-005: 역할 + 접근 모델을 디자인 레이어에서 포착 (RBAC 수준)

> spec-13-01 ADR-E. 권한을 디자인 입력으로 다루되 정책 엔진은 백엔드로 분리.

## 📚 Context

화면은 역할에 따라 달라진다 (Admin 전용 화면, 소유자만 보이는 버튼 등). 이 역할 정보가 기획에 없으면 structure/flows 가 권한별 화면 분기를 표현하지 못한다. 그러나 완전한 정책 엔진(ABAC 조건 평가 등)은 백엔드 책임이지 디자인 범위가 아니다.

## 🎯 Decision

**RBAC 수준의 역할 정보를 디자인 레이어에서 포착**한다:
- prd.md 에 `roles` enum + `access model`(RBAC/ABAC/ReBAC) + 디자인 함의 1줄.
- capability 마다 `(주체: 역할)`. structure page 마다 `roles:`.
- 연결: `role -> capability -> page -> flow`. review 가 주체 역할 부재를 추적.
- 정책 엔진 자체(조건 평가, 토큰 검증)는 **백엔드 — 범위 밖**.

## 📊 Consequences

- **긍정**: 권한별 화면 분기를 기획 단계에서 결정 → 하류가 일관되게 반영.
- **부정**: ABAC/ReBAC 의 세밀한 조건은 디자인에서 "함의 1줄"로만 — 정밀 표현 한계.
- **중립**: RBAC 가 대부분 케이스 커버. 복잡 정책은 백엔드 spec 으로.

## 🔀 Alternatives

- **권한 무시(단일 역할 가정)**: 단순 — 비채택: 멀티 역할 앱(Admin/User)의 화면 분기 표현 불가.
- **완전 정책 모델을 디자인에 포함**: 정밀 — 비채택: 백엔드 책임 침범, 기획 과부하.

## 📌 Status

Accepted (2026-06-01, gd-plan 초안 (gen-design 에서 분리)). 첫 사용자: `templates/prd.md`, `structure.md`, `gd-plan-review.md`.
