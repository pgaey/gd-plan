---
id: ADR-002
type: decision
date: 2026-06-01
status: accepted
---

# ADR-002: design.md = design-md-collection picker library (사람 미작성)

> spec-13-01 ADR-B. 디자인 시스템을 "작성"이 아니라 "선택"으로 다루는 결정.

## 📚 Context

디자이너 없이 일관된 디자인을 생성하는 것이 gen-design 의 USP 다. 매번 디자인 시스템을 자유 작성하면 v0/Lovable/Bolt 처럼 들쭉날쭉해진다. `design-md-collection/` 의 66개 검증된 회사 디자인 시스템 파일이 이미 존재한다.

## 🎯 Decision

`docs/design.md` 는 사람이 **작성하지 않는다**. `/gd-plan-design` 이 collection 에서 한 파일을 **전체 복사**하고, frontmatter 의 `reason` 필드만 사용자가 편집한다. 본문 9섹션은 collection 원본 그대로 (수정은 ui-rules.md 오버라이드로).

## 📊 Consequences

- **긍정**: 검증된 시스템 위에서만 생성 → 일관성 강제 (USP). 디자이너 불필요.
- **부정**: collection 업데이트가 기존 프로젝트에 자동 전파 안 됨 (복사본 drift). `pickedFrom`/`sourceHash` 로 *감지*는 v2.
- **중립**: 픽킹은 `_index.json` 으로 후보 3 좁힌 뒤 풀로드 (토큰 절약).

## 🔀 Alternatives

- **사람이 design.md 작성**: 자유도 높음 — 비채택: 일관성 붕괴(USP 상실).
- **참조 모델(복사 대신 포인터+fetch)**: shadcn registry 식 — 비채택(v1): "한 파일 열면 디자인 전부" 직관 상실. 전면 참조전환은 spec-13-03 재논의.

## 📌 Status

Accepted (2026-06-01, gd-plan 초안 (gen-design 에서 분리)). 첫 사용자: `plans/gd-plan-design.md`, `design-md-collection/_index.json`.
