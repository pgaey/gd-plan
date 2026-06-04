---
id: ADR-010
type: invariant
date: 2026-06-04
status: accepted
---

# ADR-010: sitemap 로스터 ↔ pages 단일 진실 방향

> spec-01-02 critique 발견. drift 정책의 근거 불변.

## 📚 Context

같은 정보(`covers`·`roles`·상태)가 두 곳에 존재한다 — 페이지 `pages/[PAGE]/structure.md` 의 frontmatter, 그리고 `sitemap.md` 의 로스터 행. 어느 쪽이 진실인지 정하지 않으면 둘이 갈라진다(drift). 업계 합의(Astro content collections, Docusaurus sidebar autogen)는 **"디렉토리가 진실, 인덱스는 파생"** 이다.

## 🎯 Decision

**페이지 frontmatter = 진실(SSOT). `sitemap.md` 로스터 = 파생/표시.**
- `/gd-plan-page` 가 frontmatter(`covers`/`roles`)를 쓰고, 같은 실행에서 로스터 행을 그 값으로 **갱신**한다(로스터가 따라옴).
- 충돌 시 frontmatter 우선. 로스터 단독 수정은 다음 page 실행에서 덮어쓰일 수 있다.
- 정합성(유령 행/고아 dir)은 경고로 표면화하고, 결정적 set-diff 는 review(spec-1-04)가 담당.

## 📊 Consequences

- **긍정**: drift 방향이 단일 → 어느 쪽을 믿을지 모호함 제거. frontmatter 기계가독이 set-diff 토대(누수 B).
- **부정**: 로스터를 최신으로 유지하려면 page 실행이 갱신 책임을 진다(로스터 손편집은 비권장).
- **중립**: 외부 도구의 "디렉토리=진실" 합의와 정합.

## 🔀 Alternatives

- **로스터 = 진실, page 가 따라감**: 인덱스 우선 — 비채택: 페이지를 하나씩 증분 작성(세로 슬라이스)하는 흐름과 안 맞음.
- **양방향 동기**: 둘 다 진실 — 비채택: 동기 충돌·구현 복잡, drift 영구 미해결(Figma/Webflow 도 미해결 영역).

## 📌 Status

Accepted (2026-06-04, spec-01-02). 첫 사용자: `plans/gd-plan-page.md`, `plans/gd-plan-sitemap.md`.

## 🔗 Related

- `docs/decisions/ADR-007-sitemap-as-map.md`, `ADR-008-decision-log-two-tier.md`
- spec-1-04 (review set-diff)
