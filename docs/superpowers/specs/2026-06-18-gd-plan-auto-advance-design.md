# gd-plan 자동 진행(confirm-then-advance) 설계

- 날짜: 2026-06-18
- 대상: gd-plan 기획 파이프라인 9개 스킬
- 상태: 설계 승인 대기

## 1. 문제

`/gd-plan-*` 파이프라인은 각 단계 끝에서 `다음 단계: /gd-plan-X` 한 줄만 출력하고 종료한다.
사용자는 매 단계마다 다음 슬래시 커맨드를 **직접 타이핑**해야 한다. 9단계(+페이지 N회)를 도는 동안
반복되는 마찰이며, 흐름이 끊긴다.

## 2. 목표 / 비목표

**목표**
- 한 단계가 끝나면 "다음으로 바로 진행할까요?"를 묻고, 사용자가 **긍정 한 마디**만 하면
  슬래시 타이핑 없이 다음 단계를 같은 대화에서 이어 실행한다.
- 체크포인트(사용자가 멈추고 검토할 기회)는 유지한다.

**비목표**
- 묻지 않는 완전 자동(autopilot)은 하지 않는다.
- 별도 오케스트레이터 커맨드(`/gd-plan`)는 만들지 않는다.
- 템플릿·디자인 컬렉션·검증 로직·CLI 변경 없음.

## 3. 결정된 제어 모델

**확인 후 자동 진행(confirm-then-advance).** 각 단계 종료 시:
1. 기존대로 완료 메시지 + `전체 진행률: N/5` 출력
2. 확인 질문: "다음 단계 `/gd-plan-X`(설명)로 바로 진행할까요?"
3. 사용자 **긍정**(응/네/그래/ㅇㅇ/yes/진행 등) → `.claude/commands/gd-plan-X.md`를 읽어
   같은 대화에서 즉시 이어 실행. **부정/기타** → 정지, 슬래시 커맨드만 남김.

## 4. 메커니즘 (A안 — 각 스킬 §종료에 인라인)

- 소비자에는 공유 CLAUDE fragment가 설치되지 않고, 각 슬래시 커맨드는 호출 시 개별 로드된다.
  따라서 자동 진행 규약은 각 스킬의 `§종료` 섹션에 인라인한다(자족적 — 슬래시 커맨드 특성과 일치).
- SoT는 `plans/gd-plan-*.md`. 설치 시 `.claude/commands/`로 복사된다. 편집은 `plans/`에서만.
- 새 파일·새 커맨드 없음. 규약 3~4줄이 9개 파일에 반복되지만, 각 커맨드가 독립적으로
  로드되어야 하므로 이는 중복이 아니라 자족성이다.

## 5. 단계별 전이표

| 끝 스킬 | 다음 | 종류 | 확인 동작 |
|---|---|---|---|
| start    | 첫 미완 단계 | 안내      | 읽기전용 유지 + "지금 `<다음>`부터 시작할까요?"로 진입만 자동 |
| prd      | critique     | soft      | "전제 검증(critique) 권장 — 바로 진행할까요?" 예→critique / 아니오→정지(+"건너뛰려면 `/gd-plan-design`") |
| critique | design       | linear    | 표준 확인 |
| design   | sitemap      | linear    | 표준 확인 |
| sitemap  | page `<첫 slug>` | enter-loop | "첫 페이지 `<slug>` 구조 바로 시작할까요?" |
| page     | 다음 todo page / 없으면 flows | loop·exit | todo 남으면 "다음 `<slug>` 이어서?"; 모두 done이면 "모든 페이지 완료 — flows로 갈까요?" |
| flows    | rules        | linear    | 표준 확인 |
| rules    | review       | linear    | "일관성 검증(review) 돌릴까요?" |
| review   | —            | **gate**  | 자동 진행 안 함. BLOCK 있으면 정지+되돌릴 page 안내 / 0건이면 "기획 완료" 메시지 |

## 6. 안전장치

- **done일 때만 제안**: 직전 단계가 실제로 완료 상태일 때만 자동 진행을 제안한다.
- **미완 보완 우선**: `<!-- TODO -->` 마커 등 미완 필드가 있으면 자동 진행 대신 보완을 먼저 안내한다.
- **review는 게이트**: 절대 자동 통과시키지 않는다. BLOCK의 의미를 보존한다.
- **부정/모호 → 정지**: 긍정이 아니면 진행하지 않는다(오작동 시 멈추는 쪽으로 편향).

## 7. 적용 범위 (편집 대상)

`plans/` 9개 파일의 `§종료`(start는 §4 다음 단계 결정 / §5 종료)만 수정:
- gd-plan-start, gd-plan-prd, gd-plan-critique, gd-plan-design,
  gd-plan-sitemap, gd-plan-page, gd-plan-flows, gd-plan-rules, gd-plan-review

그 외(템플릿, design-md-collection, bin, install) 무변경.

## 8. 검증 방법

- `plans/` 수정 후 샌드박스(`gd-plan-sandbox`)에 재설치(`get.sh --src`)하여
  `.claude/commands/`에 반영 확인.
- 새 Claude Code 세션에서 `/gd-plan-start` → 긍정 응답으로 prd 자동 진입되는지,
  prd→critique 예/아니오 분기, page 루프, review 게이트 정지가 의도대로 동작하는지 확인.
