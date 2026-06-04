---
id: ADR-008
type: convention
date: 2026-06-04
status: accepted
---

# ADR-008: 결정 로그 2층 + frontmatter ID 스파인

> spec-01-01. 결정 이유 휘발 방지 + ID 연결 기계가독화.

## 📚 Context

인터뷰/픽의 *결정 이유*(왜 이 디자인을 골랐나, 왜 이 capability 를 뺐나)가 어디에도 안 남아 "프로젝트 목적 표류"를 대조할 원본이 없다. 또한 `role→capability→page→flow` 연결이 산문이라 기계 검증(set-diff)이 불가능하다.

## 🎯 Decision

**(1) 결정 로그 2층** — 전역 `docs/decisions.md`(prd/design/rules 단계 결정) + 페이지 `docs/pages/[PAGE]/decisions.md`(페이지 단계 결정). harness-kit 의 ADR(전역)↔walkthrough(단위) 분리와 동형. 형식은 typed 표(`결정 | 선택지 | 탈락 | 이유`) — 대화 트랜스크립트 금지.

**(2) frontmatter ID 스파인** — 페이지 `structure.md` 가 `covers`(담당 `[CAP-..]`) · `roles` · `flows`(등장 flow) · `parent`(상위 `[PAGE-..]`) 를 frontmatter 로 선언한다. `role→[CAP]→[PAGE]→[FLOW]` 연결이 기계가독이 되어 향후 set-diff hook(누수 B: 전파 무결성)의 토대가 된다.

## 📊 Consequences

- **긍정**: 표류를 대조할 결정 원본 확보. ID 연결 기계가독 → 결정적 검증 토대.
- **부정**: 결정 *자동 기록* 동작과 *flows 자동 도출* 은 별도 구현 필요(→ spec-1-03 / spec-1-04). 본 ADR 은 *형식*만 확정.
- **중립**: 2층 분리 — 전역/페이지 결정의 소재가 명확.

## 🔀 Alternatives

- **단층 결정 로그**: 전역·페이지 결정을 한 파일에 — 비채택: 페이지별 dir 응집이 깨지고 소재 혼재.
- **산문 ID 연결**: 현행 — 비채택: 기계 검증 불가, LLM 판정만 가능.

## 📌 Status

Accepted (2026-06-04, spec-01-01). 첫 사용자: `templates/decisions.md`, `templates/pages/decisions.md`, `templates/pages/structure.md`.

## 🔗 Related

- spec-1-03 (결정 로그 자동 기록), spec-1-04 (flows 자동 역참조 + review set-diff)
