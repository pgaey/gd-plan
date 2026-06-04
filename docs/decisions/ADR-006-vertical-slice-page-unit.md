---
id: ADR-006
type: convention
date: 2026-06-04
status: accepted
---

# ADR-006: 세로 슬라이스 단위 = PAGE (page dir ↔ spec dir 대응)

> spec-01-01. 평면 `structure.md` 한 파일 → 페이지별 디렉토리로 재편.

## 📚 Context

기존 `structure.md`(와이어프레임)는 한 파일에 전 페이지를 담는다. 큰 프로젝트(거시)를 담는 상위 단위가 없고, 페이지를 하나씩 증분 추가하는 작업 단위도 없다. harness-kit 는 작업을 `specs/spec-id/` 디렉토리 단위로 쪼개 통제한다 — 이 모델을 기획 산출에 이식한다.

## 🎯 Decision

기획 산출의 세로축 단위 = **PAGE**. 페이지 1개 = `docs/pages/[PAGE-slug]/` 디렉토리(`structure.md` · `decisions.md` 보유)로, harness-kit `specs/spec-id/` 와 동형. 페이지는 `/gd-plan-page <slug>` 로 하나씩 증분 추가하며, 추가 시 `sitemap.md` 로스터에 1행 등록된다.

**ADR-004 와의 관계 = 확장(폐기 아님)**: 섹션 = 통제된 어휘에서 고른 순서 있는 스택이라는 ADR-004 의 핵심은 그대로다. 바뀌는 것은 *컨테이너*뿐 — 평면 한 파일 → 페이지별 dir.

## 📊 Consequences

- **긍정**: 큰 프로젝트(거시)를 담고, 페이지 단위 증분 추가가 가능. 페이지-로컬 문서(structure/decisions)가 한 dir 에 모임.
- **부정**: 기존 평면 `structure.md` 흐름과 공존하는 마이그레이션 기간 필요(→ spec-1-02).
- **중립**: harness-kit phase/spec 모델 차용 — 검증된 구조.

## 🔀 Alternatives

- **평면 `structure.md` 유지**: 변경 없음 — 비채택: 거시 못 담고 증분 단위 부재.
- **capability 단위 dir**: CAP 별 디렉토리 — 비채택: 페이지가 더 구체적이고 하류 scene 단위와 정렬됨.

## 📌 Status

Accepted (2026-06-04, spec-01-01). 첫 사용자: `templates/pages/structure.md`, `templates/sitemap.md`. ADR-004 확장.

## 🔗 Related

- `docs/decisions/ADR-004-structure-as-section-stack.md` (확장 대상)
- spec-01-01, spec-1-02 (명령어 재편)
