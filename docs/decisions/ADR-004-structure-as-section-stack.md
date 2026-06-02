---
id: ADR-004
type: convention
date: 2026-06-01
status: accepted
---

# ADR-004: structure.md = 통제된 섹션 스택 (relume 모델, shadcn 토대)

> spec-13-01 ADR-D. 페이지를 자유 박스가 아니라 고정 섹션 어휘로 조립.

## 📚 Context

`structure.md`(와이어프레임)에서 페이지를 자유롭게 그리게 하면 어휘가 발산하고 하류 컴파일(chat.md→React)과 정합이 깨진다. relume 은 페이지를 통제된 섹션 모델로 조립하며, gen-design 의 shadcn 토대와 동일한 기반이다.

## 🎯 Decision

페이지 = **통제된 섹션 어휘에서 고른 순서 있는 섹션 스택**으로 정의한다:
- 섹션 어휘 = `section-taxonomy.md` (마케팅 11 + 앱 10). 이 목록 안에서만 선택.
- 새 섹션은 임의 생성 금지 — taxonomy 에 먼저 추가(매핑할 catalog 컴포넌트 있어야 함).
- 오버레이(Modal/Sheet/Drawer)는 섹션이 아니라 `layout.modal` 동작.

## 📊 Consequences

- **긍정**: 어휘 발산 차단 → 하류 컴파일 정합. 페이지 배치는 자유(어휘만 공통)라 재사용성 유지.
- **부정**: taxonomy 에 없는 신규 패턴은 어휘 추가 단계를 거쳐야 함 (의도된 마찰).
- **중립**: relume/shadcn 모델 차용 — 업계 검증된 구조.

## 🔀 Alternatives

- **자유 박스 레이아웃**: 무제한 자유도 — 비채택: 어휘 발산, 하류 정합 붕괴.
- **페이지별 고정 템플릿**: 페이지 유형마다 완성 틀 — 비채택: 프로젝트별 배치 차이를 못 담음.

## 📌 Status

Accepted (2026-06-01, gd-plan 초안 (gen-design 에서 분리)). 첫 사용자: `templates/section-taxonomy.md`, `gd-plan-structure.md`.
