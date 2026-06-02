# <프로젝트명> — ui-rules.md

> **역할 (collection 분석 후 재정의):** design.md(picked) + tokens.json 가 주는 *시각 토큰*(radius · typography · spacing 스케일 · 색)은 **여기서 재서술하지 않는다.** ui-rules 는 그것들이 *안 다루는* **인터랙션 · 폼 동작 · a11y 규칙** + collection 의 추정값("estimated/approximately")을 **enforce 가능한 확정 수치**로 못박는 곳.
> 규칙은 `> 규칙:`. 확정값은 가능하면 tokens.json 토큰과 1:1.
> 이 파일은 `/gd-plan-rules` 가 design.md 추정값 도출 + 인터뷰로 채운다. 아래 수치는 sample (프로젝트에 맞게 확정).

## Motion  (collection 거의 안 줌 -> ui-rules 핵심)
> 규칙: 인터랙션 타이밍을 전 화면 일관되게.
- hover transition: 180ms ease-out  (sample)
- modal enter 220ms · overlay fade 160ms  (sample)
- prefers-reduced-motion: 모션 제거/축소  (필수 룰)
- destructive 표현에 빨강 과용 금지  (sample 룰)

## Form 동작  (collection 안 줌 — 시각 스타일만 줌)
> 규칙: 검증 시점·에러 표기를 전 화면 일관되게. (입력 시각 스타일은 design.md)
- label: 상단 정렬  (sample)
- error: 인라인(필드 하단)  (sample)
- 검증 시점: onBlur + onSubmit  (sample)

## CTA 위계  (collection 은 색만 줌)
> 규칙: 개수·형태 위계. (색 매핑은 design.md)
- 한 화면에 primary CTA 1개 원칙  (sample)
- primary = solid / secondary = outline / tertiary = ghost  (sample)

## Header / Nav 치수  (collection 극소수만 줌)
- height 64px desktop / 56px mobile · sticky  (sample)

## Accessibility 최소선  (collection 일부만 줌)
> 규칙: 프로젝트 최소 보장선.
- 본문 대비 >= 4.5:1 (대형 텍스트 3:1)  (sample)
- focus ring 항상 표시  (sample)
- touch target >= 44px  (sample)
- prefers-reduced-motion 존중 (위 Motion 참조)

## 확정 / 오버라이드  (design.md 추정값을 확정 수치로)
> 규칙: collection/design.md 가 "estimated / approximately / 80px+" 로 둔 값을 *단일 확정 수치*로. + 프로젝트 델타.
- section 세로 간격: 120px desktop / 72px mobile  (sample — design.md "80-120px" 를 확정)
- container max-width: 1200px  (sample)
- breakpoint 기준점: 768px  (sample — design.md 다구간 중 1차 기준)

## 참조 (여기 재서술 안 함)
- Radius · Typography 스케일 · spacing 스케일 · 색 팔레트 -> **design.md(picked) + tokens.json**. ui-rules 는 위 항목들만 담당.
