# <프로젝트명> — ui-rules.md (DRAFT 템플릿)

> **역할 (collection 분석 후 재정의):** design.md(picked) + tokens.json 가 주는 *시각 토큰*(radius · typography · spacing 스케일 · 색)은 **여기서 재서술하지 않는다.** ui-rules 는 그것들이 *안 다루는* **인터랙션 · 폼 동작 · a11y 규칙** + collection 의 추정값("estimated/approximately")을 **enforce 가능한 확정 수치**로 못박는 곳.
> 규칙은 `> 규칙:`. 확정값은 가능하면 tokens.json 토큰과 1:1.

## Motion  (collection 거의 안 줌 -> ui-rules 핵심)
> 규칙: 인터랙션 타이밍을 전 화면 일관되게.
- hover transition: 180ms ease-out  (예시)
- modal enter 220ms · overlay fade 160ms  (예시)
- prefers-reduced-motion: 모션 제거/축소  (필수 룰)
- destructive 표현에 빨강 과용 금지  (예시 룰)

## Form 동작  (collection 안 줌 — 시각 스타일만 줌)
> 규칙: 검증 시점·에러 표기를 전 화면 일관되게. (입력 시각 스타일은 design.md)
- label: 상단 정렬  (예시)
- error: 인라인(필드 하단)  (예시)
- 검증 시점: onBlur + onSubmit  (예시)

## CTA 위계  (collection 은 색만 줌)
> 규칙: 개수·형태 위계. (색 매핑은 design.md)
- 한 화면에 primary CTA 1개 원칙  (예시)
- primary = solid / secondary = outline / tertiary = ghost  (예시)

## Header / Nav 치수  (collection 극소수만 줌)
- height 64px desktop / 56px mobile · sticky  (예시)

## Accessibility 최소선  (collection 일부만 줌)
> 규칙: 프로젝트 최소 보장선.
- 본문 대비 >= 4.5:1 (대형 텍스트 3:1)  (예시)
- focus ring 항상 표시  (예시)
- touch target >= 44px  (예시)
- prefers-reduced-motion 존중 (위 Motion 참조)

## 확정 / 오버라이드  (design.md 추정값을 확정 수치로)
> 규칙: collection/design.md 가 "estimated / approximately / 80px+" 로 둔 값을 *단일 확정 수치*로. + 프로젝트 델타.
- section 세로 간격: 120px desktop / 72px mobile  (예시 — design.md "80-120px" 를 확정)
- container max-width: 1200px  (예시)
- breakpoint 기준점: 768px  (예시 — design.md 다구간 중 1차 기준)

## 참조 (여기 재서술 안 함)
- Radius · Typography 스케일 · spacing 스케일 · 색 팔레트 -> **design.md(picked) + tokens.json**. ui-rules 는 위 항목들만 담당.

---
> `/gd-plan-rules` 가 design.md 의 추정값을 "확정/오버라이드" 섹션으로 끌어올리고(도출), collection 이 비운 Motion/Form/CTA/a11y 는 인터뷰로 채운다. 확정값은 가능한 한 tokens.json 토큰과 맞춘다.
