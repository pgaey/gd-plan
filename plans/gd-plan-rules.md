---
name: gd-plan-rules
description: UI 규칙 확정. design.md(picked)의 추정값을 확정 수치로 끌어올리고, collection이 안 주는 Motion/Form동작/CTA위계/a11y를 인터뷰로 채워 docs/ui-rules.md를 만든다. 시각 토큰은 재서술하지 않음. idempotent.
---

# gd-plan-rules — UI 규칙 확정

> 본 스킬은 *규칙 확정자*입니다. design.md + tokens.json 가 주는 **시각 토큰(radius/typography/spacing/색)은 재서술하지 않습니다.**
> ui-rules 는 그것들이 *안 다루는* **인터랙션 · 폼 동작 · a11y** + collection 의 추정값("estimated/approximately")을 **enforce 가능한 확정 수치**로 못박는 곳입니다.

---

## §1 자동 로딩 컨텍스트

| 파일 | 역할 |
|---|---|
| `docs/design.md` | picked 시스템의 추정값·수치 (추출 원천) |
| `docs/structure.md` | 화면 종류 (어떤 인터랙션이 필요한지) |
| `templates/ui-rules.md` (패키지) | 채울 필드 구조 |

> design.md 가 없으면 차단: "먼저 /gd-plan-design 으로 시스템을 고르세요."

## §2 두 가지 작업 (추출 + 인터뷰)

### 2-A. design.md 추정값 → 확정 수치 (추출)
design.md 산문에서 "estimated / approximately / 80–120px / 80px+" 같은 **범위·추정 표현**을 찾아 단일 확정 수치로 끌어올린다:
- 예: design.md "section spacing estimated 80–120px" → ui-rules "section 세로 간격: 120px desktop / 72px mobile"
- 추출한 수치는 가능하면 tokens.json 토큰과 1:1.

### 2-B. collection 이 안 주는 것 (인터뷰)
collection 파일은 시각 스타일만 주고 아래는 거의 안 준다 — 인터뷰로 확정:
- **Motion**: hover/modal transition ms, easing, prefers-reduced-motion (필수)
- **Form 동작**: 검증 시점(onBlur/onSubmit), 에러 위치(인라인/요약)
- **CTA 위계**: 한 화면 primary 개수, solid/outline/ghost 매핑
- **Header/Nav 치수**: height desktop/mobile, sticky 여부
- **a11y 최소선**: 대비비, focus ring, touch target

## §3 재서술 금지 (경계)

다음은 **여기 쓰지 않는다** — design.md(picked) + tokens.json 이 SoT:
- Radius 스케일 · Typography 스케일 · spacing 스케일 · 색 팔레트

> ui-rules 가 이들을 바꿔야 하면 "오버라이드" 섹션에 *델타만* 명시 (전체 재서술 금지).

> **결정 기록**: 수치·인터랙션 fork 선택 시 `docs/decisions.md` 에 typed 1행. 형식·ID·supersede 는 헤더 / `ADR-011` 정본 참조.

## §4 idempotent

- 기존 ui-rules.md 가 있으면 채워진 값 보존, 빈 항목만 인터뷰.
- design.md 가 재픽됐으면 추출값 재계산 제안.

## §5 종료

- Motion / Form / CTA / Header / a11y / 확정·오버라이드 섹션이 채워졌는지 점검.
- 시각 토큰(radius/typo/spacing/색)을 재서술하지 않았는지 자가 점검 (경계 준수).
- 출력: `docs/ui-rules.md 작성 완료. 다음 단계: /gd-plan-review. 전체 진행률: 5/5`
