---
name: gd-plan-review
description: 5종 기획 문서의 일관성을 검증한다. 하이브리드 차단 — structural 불일치는 BLOCK(다음 단계 차단), style/vocabulary는 WARN. role->capability->page->flow 연결을 추적. docs/_review.md 출력. --force-continue로 우회.
---

# gd-plan-review — 일관성 검증 (하이브리드 차단)

> 본 스킬은 *검증자*입니다. 5종 문서가 **안정 ID 로 연결된 하나의 모델**(`role -> capability -> page -> flow -> scene`)인지 검사합니다.
> 끊긴 고리 중 **구조적(structural)** 인 것은 **BLOCK** (다음 단계 진입 차단), 스타일·어휘 불일치는 **WARN**.

---

## §1 자동 로딩 컨텍스트

5종 전체 + 섹션 어휘를 읽는다:

| 파일 | 검사 대상 |
|---|---|
| `docs/prd.md` | roles, capabilities `[CAP-..]` |
| `docs/structure.md` | pages `[PAGE-..]`, covers, roles |
| `docs/flows/*.md` | flow steps 의 `[PAGE-..]`, Actor |
| `docs/design.md` | 톤·수치 (style 비교) |
| `docs/ui-rules.md` | 확정 수치 (style 비교) |
| `templates/section-taxonomy.md` | 섹션 어휘 (vocabulary 비교) |

## §2 체크리스트 (재현 가능)

> v1: structural=BLOCK / style·vocabulary=WARN. wording·completeness 와 결정적 set-diff 는 **v2 연기**.
> v1 판정: LLM 이 ID 연결(`role->capability->page->flow`)을 읽어 판정. 근거로 **어느 파일/줄**인지 인용 (재현성).

| 체크 | 카테고리 | 발견 시 |
|---|---|---|
| PRD capability `[CAP-..]` 가 structure.md 의 어떤 page 로도 covers 안 됨 | **structural** | **BLOCK** |
| structure.md 의 page 가 어떤 flow 에도 등장 안 함 | **structural** | **BLOCK** |
| flow step 이 참조하는 `[PAGE-..]` 가 structure.md sitemap 에 없음 | **structural** | **BLOCK** |
| capability 의 주체 역할이 prd roles 에 없음 | **structural** | **BLOCK** |
| ui-rules.md 수치가 design.md 토큰/수치와 불일치 | **style** | WARN |
| flow/structure 의 섹션·컴포넌트가 section-taxonomy 어휘에 없음 | **vocabulary** | WARN |

## §3 `_review.md` 출력 포맷

```markdown
# Review Report — <날짜>

## BLOCK (해결 전 다음 단계 불가)
- [P1] PRD capability [CAP-04] "예약 확인/승인" 이 structure.md 의 어떤 page 로도 covers 안 됨 (prd.md:78)

## WARN (진행 가능, 검토 권장)
- [S1] ui-rules.md hover 180ms vs design.md 200ms 불일치 (ui-rules.md:8 / design.md:..)
- [V1] flow "booking" step 3 의 'Calendar' 섹션이 section-taxonomy 어휘에 없음

## 통과
- role->capability->page->flow 연결 N건 정상
```

> 멱등: `_review.md` 는 재실행 시 **overwrite** (날짜 헤더 1개, 누적 금지 — BLOCK 판정 소스 흐려짐 방지).

## §4 차단의 실효 (무엇을 막나)

- BLOCK 이 1건이라도 있으면: `/gd-chat <scene>` 진입 시 gd-chat 이 `_review.md` 를 읽고 **차단** (해당 명세는 gd-chat §5.10).
- 즉 review 의 BLOCK 은 "다음 단계(화면 생성)로 못 넘어가게" 하는 게이트.

## §5 강제 우회

`--force-continue` 플래그: BLOCK 도 우회 (사용자 책임). `_review.md` 에 `forceContinued: true` 기록.

## §6 consistency-critic 서브에이전트 (권장)

검사를 Opus 서브에이전트로 위임 가능 — 5종 문서 + 체크리스트(§2)를 주고 BLOCK/WARN 목록 + 근거 인용을 받는다.
> **non-normative**: 서브에이전트 없이 메인에서 직접 검사해도 된다 (권장 힌트, DoD 강제 아님).

## §7 v2 백로그 (여기 구현 안 함, 기록만)

- BLOCK 결정성: ID set-diff 로 결정화 (가능하면 `gd-cli lint` 종료코드 enforce).
- wording 체크 (persona ↔ design 톤), completeness 체크 (empty/loading/error 누락).
- 문서 staleness 전파 (상위 문서가 하위보다 newer 면 WARN).

## §8 종료

- `docs/_review.md` 작성 (BLOCK/WARN/통과).
- BLOCK 0 건이면: "기획 검증 통과. /gd-start → /gd-chat <scene> 로 화면을 만드세요."
- BLOCK 있으면: "BLOCK N건 — 해결 후 재실행하거나 --force-continue 로 우회."
- 출력: `docs/_review.md 작성 완료 (BLOCK N / WARN M). 전체 진행률: 검증 완료.`
