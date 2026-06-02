---
name: gd-plan-start
description: 상류 기획 진입점. docs/ 폴더를 스캔해 5종 기획 문서(prd/design/structure/flows/ui-rules)의 진행률을 보고하고 다음 명령을 안내한다. idempotent — 언제 호출해도 안전.
---

# gd-plan-start — 상류 기획 진입점

> 본 스킬은 *안내자*입니다. 아무것도 생성하지 않고, `docs/` 를 스캔해 **지금 어디까지 했고 다음에 뭘 할지** 한 화면으로 보여줍니다.

---

## §1 자동 로딩 컨텍스트

호출 즉시 읽기 (없으면 "미작성"으로 간주):

| 파일 | 단계 | 담당 스킬 |
|---|---|---|
| `docs/prd.md` | 1 PRD | `/gd-plan-prd` |
| `docs/design.md` | 2 디자인 시스템 | `/gd-plan-design` |
| `docs/structure.md` | 3 구조/와이어프레임 | `/gd-plan-structure` |
| `docs/flows/*.md` | 4 사용자 여정 | `/gd-plan-flows` |
| `docs/ui-rules.md` | 5 UI 규칙 | `/gd-plan-rules` |
| `docs/_review.md` | 6 검증 | `/gd-plan-review` |
| `.gd/memory/project.md` | (참고) 세션 메모리 | — |

## §2 진행률 판정 규칙

각 문서의 상태를 다음 3단계로 판정한다 (idempotent — 파일 내용 기준):

- **미작성**: 파일이 없음
- **초안**: 파일은 있으나 `<...>` 플레이스홀더가 남아 있거나 템플릿 헤딩만 있음
- **완료**: 플레이스홀더 없이 실제 내용으로 채워짐

> 진행률 `N/5` 의 N = "완료" 상태인 5종 문서 수 (design.md 는 collection 픽 여부로 판정 — frontmatter `pickedFrom` 존재 시 완료).
> `_review.md` 는 5종에 포함하지 않는다 (검증 단계).

## §3 보고 포맷

```
gd-plan 진행 상황 (N/5 완료)

  [✓] 1. PRD          docs/prd.md
  [~] 2. 디자인 시스템  docs/design.md      (초안 — reason 미작성)
  [ ] 3. 구조          docs/structure.md   (미작성)
  [ ] 4. 플로우        docs/flows/         (미작성)
  [ ] 5. UI 규칙       docs/ui-rules.md    (미작성)
  ─────────────────────────────────────
  다음 단계: /gd-plan-design
```

> 기호: `✓` 완료 · `~` 초안 · ` ` 미작성. ASCII 만 사용 (박스/트리 유니코드 금지).

## §4 다음 단계 결정

- 5종 중 첫 "미작성/초안" 단계의 스킬을 "다음 단계"로 제시.
- 모두 완료면 → `다음 단계: /gd-plan-review` (일관성 검증).
- `_review.md` 에 BLOCK 0 건이면 → "기획 완료. 이제 /gd-start → /gd-chat <scene> 로 화면을 만드세요."

## §5 종료

- 본 스킬은 **읽기 전용**. 파일을 생성·수정하지 않는다.
- 사용자가 "처음부터 시작"이라 하면 → `/gd-plan-prd` 호출 안내.
- 출력 마지막 줄: `전체 진행률: N/5`
