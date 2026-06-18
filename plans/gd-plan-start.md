---
name: gd-plan-start
description: 상류 기획 진입점. docs/ 폴더를 스캔해 5종 기획 문서(prd/design/구조[sitemap+pages]/flows/ui-rules)의 진행률을 보고하고 다음 명령을 안내한다. idempotent — 언제 호출해도 안전.
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
| `docs/sitemap.md` + `docs/pages/[PAGE-*]/` | 3 구조 (지도 + 페이지별) | `/gd-plan-sitemap` → `/gd-plan-page` |
| `docs/flows/*.md` | 4 사용자 여정 | `/gd-plan-flows` |
| `docs/ui-rules.md` | 5 UI 규칙 | `/gd-plan-rules` |
| `docs/_critique.md` (있으면) | (참고) PRD 전제 검증 상태 | `/gd-plan-critique` |
| `docs/_review.md` | 6 검증 | `/gd-plan-review` |
| `.gd/memory/project.md` | (참고) 세션 메모리 | — |

> **`_critique.md` 위생**: 본문(비판 내용)은 **무시**(모델로 읽지 않음), frontmatter `prdVersion` 만 본다. critique 상태 = **미실행**(_critique 없음) / **stale**(`prd.version > prdVersion`) / **완료**(같음). 진행률 보고에 한 줄로 표시(5종 카운트엔 미포함 — review 처럼 검증 단계).

## §2 진행률 판정 규칙

각 문서의 상태를 다음 3단계로 판정한다 (idempotent — 파일 내용 기준):

- **미작성**: 파일이 없음
- **초안**: 파일은 있으나 `<...>` 플레이스홀더가 남아 있거나 템플릿 헤딩만 있음
- **완료**: 플레이스홀더 없이 실제 내용으로 채워짐

> 진행률 `N/5` 의 N = "완료" 상태인 5종 문서 수 (design.md 는 collection 픽 여부로 판정 — frontmatter `pickedFrom` 존재 시 완료).
> **3번 슬롯(구조)**은 `sitemap.md` + `pages/` 집계로 판정: `sitemap.md` 없음=미작성 / sitemap 있고 일부 페이지 draft=초안 / 로스터 모든 page 상태=done=완료.
> `_review.md` 는 5종에 포함하지 않는다 (검증 단계).

## §3 보고 포맷

```
gd-plan 진행 상황 (N/5 완료)

  [✓] 1. PRD          docs/prd.md
  [~] 2. 디자인 시스템  docs/design.md      (초안 — reason 미작성)
  [ ] 3. 구조          docs/sitemap.md + pages/   (미작성)
  [ ] 4. 플로우        docs/flows/         (미작성)
  [ ] 5. UI 규칙       docs/ui-rules.md    (미작성)
  ─────────────────────────────────────
  다음 단계: /gd-plan-design
```

> 기호: `✓` 완료 · `~` 초안 · ` ` 미작성. ASCII 만 사용 (박스/트리 유니코드 금지).

## §4 다음 단계 결정

- 5종 중 첫 "미작성/초안" 단계의 스킬을 "다음 단계"로 제시.
- **PRD 완료 + critique 미실행/stale** 이면 → 다음 단계로 `/gd-plan-critique` (전제 검증, 권장)도 함께 안내. (soft — 건너뛰어도 design 진입 시 다시 경고)
- 모두 완료면 → `다음 단계: /gd-plan-review` (일관성 검증).
- `_review.md` 에 BLOCK 0 건이면 → "기획 완료. 이제 /gd-start → /gd-chat <scene> 로 화면을 만드세요."

## §5 종료

- 본 스킬은 **읽기 전용**. 파일을 생성·수정하지 않는다.
- 사용자가 "처음부터 시작"이라 하면 → `/gd-plan-prd` 호출 안내.
- 출력 마지막 줄: `전체 진행률: N/5`
- **자동 진입 (confirm-then-advance)**: 진행률 출력 직후 §4 가 정한 "다음 단계"를 가리키며 "지금 `/gd-plan-<다음>`부터 바로 시작할까요?"라고 묻는다.
  - 사용자가 **긍정**(응/네/그래/ㅇㅇ/yes/y/시작 등)하면 → `.claude/commands/gd-plan-<다음>.md` 를 읽어 같은 대화에서 즉시 이어 실행(슬래시 불필요). 읽기 전용 원칙은 start 자신에만 적용 — 다음 단계는 정상 생성 스킬이다.
  - **부정/모호**하면 → 정지. 슬래시 커맨드만 남긴다.
  - 모두 완료(`_review.md` BLOCK 0)면 자동 진입 대신 화면 생성 안내(`/gd-start`)만 출력한다.

<!-- gd:advance next=auto -->
