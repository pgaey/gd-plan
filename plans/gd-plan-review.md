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
| `docs/sitemap.md` | 페이지 로스터 `[PAGE-..]`, covers/roles (파생 표시) |
| `docs/pages/[PAGE]/structure.md` | frontmatter ID 스파인 `covers`/`roles`/`flows`/`parent` (기계가독) |
| `docs/flows/*.md` | flow steps 의 `[PAGE-..]`, Actor |
| `docs/decisions.md` · `docs/pages/[PAGE]/decisions.md` | 결정 로그 6열 — `연결`=`[CAP]`/`[PAGE]` (누수 점검) |
| `docs/design.md` | 톤·수치 (style 비교) |
| `docs/ui-rules.md` | 확정 수치 (style 비교) |
| `templates/section-taxonomy.md` | 섹션 어휘 (vocabulary 비교) |

> **위생**: `docs/_critique.md` 는 로딩하지 않는다(**무시**). critique 는 의미 정합 비평이고 review 는 구조 정합 검사 — 비판 텍스트를 5종 모델 일부로 읽으면 거짓 불일치를 낳는다. review 는 _critique 본문을 모델에서 **제외**한다.

## §2 체크리스트 (재현 가능)

> v1: structural=BLOCK / style·vocabulary=WARN. wording·completeness 와 **결정적** set-diff(`gd-cli lint` 종료코드)는 **v2 연기**.
> v1 판정: LLM 이 페이지 frontmatter ID 스파인(`covers`/`roles`/`flows`/`parent`)을 읽어 `role->capability->page->flow` 연결을 추적·판정 — 결정적 보장이 아닌 **LLM 무결성 점검**. 출력은 **정렬된 ID 리스트** + 근거로 **어느 파일/줄**인지 인용 (재현성).

| 체크 | 카테고리 | 발견 시 |
|---|---|---|
| PRD capability `[CAP-..]` 가 페이지 frontmatter `covers` 어디에도 없음 | **structural** | **BLOCK** |
| 페이지(sitemap 로스터)가 어떤 flow step `@[PAGE-..]` 에도 안 등장 | **structural** | **BLOCK** |
| flow step 이 참조하는 `[PAGE-..]` 가 sitemap.md 로스터에 없음 | **structural** | **BLOCK** |
| 페이지 frontmatter `flows:` ↔ flow step `@[PAGE-id]` 역참조 불일치(drift) | **structural** | **BLOCK** |
| 결정 로그 `연결`=`[CAP]`/`[PAGE]` 가 모델에 부재(누수) | **structural** | **BLOCK** |
| capability 의 주체 역할이 prd roles 에 없음 | **structural** | **BLOCK** |
| ui-rules.md 수치가 design.md 토큰/수치와 불일치 | **style** | WARN |
| flow/페이지 의 섹션·컴포넌트가 section-taxonomy 어휘에 없음 | **vocabulary** | WARN |
| **MVP 페이지가 Later 페이지로 링크/flow-step** (우선순위 댕글링 — MVP 만 출시하면 빈 링크) | **priority** | WARN |

## §3 `_review.md` 출력 포맷

```markdown
# Review Report — <날짜>

## BLOCK (해결 전 다음 단계 불가)
- [P1] PRD capability [CAP-04] "예약 확인/승인" 이 페이지 frontmatter covers 어디에도 없음 (prd.md:78)
- [P2] [PAGE-booking] flows: [FLOW-reserve] 인데 flows/reserve.md step 에 @[PAGE-booking] 없음 — 역참조 drift (pages/booking/structure.md:4)
- [P3] decisions 결정 D-03 연결=[PAGE-cancel] 인데 sitemap 로스터에 부재 — 누수 (pages/booking/decisions.md:7)

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
