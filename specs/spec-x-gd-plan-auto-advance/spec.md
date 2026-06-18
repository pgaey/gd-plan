# spec-x-gd-plan-auto-advance: gd-plan 단계 자동 진행(confirm-then-advance)

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-x-gd-plan-auto-advance` |
| **Phase** | `phase-x` |
| **Branch** | `spec-x-gd-plan-auto-advance` |
| **상태** | Planning |
| **타입** | Refactor (기존 스킬 동작 보강) |
| **작성일** | 2026-06-18 |
| **소유자** | pgaey |

## 배경 및 문제 정의

### 현재 상황
gd-plan 기획 파이프라인은 9개 슬래시 스킬(`/gd-plan-start` → prd → critique → design → sitemap → page → flows → rules → review)로 구성된다. 각 스킬은 `plans/gd-plan-*.md`에 정의되어 설치 시 `.claude/commands/`로 복사된다. 현재 각 스킬의 `§종료`는 `... 작성 완료. 다음 단계: /gd-plan-X. 전체 진행률: N/5` 한 줄을 출력하고 종료한다.

### 문제점
사용자는 매 단계가 끝날 때마다 다음 슬래시 커맨드를 **직접 타이핑**해야 한다. 9단계(+페이지 N회 반복)를 도는 동안 반복되는 마찰이며, 기획 흐름이 끊긴다.

### 해결 방안
각 단계 `§종료`를 **확인 후 자동 진행(confirm-then-advance)** 으로 바꾼다: 완료/진행률 출력 후 "다음 단계로 바로 진행할까요?"를 묻고, 사용자가 긍정 한 마디만 하면 슬래시 타이핑 없이 다음 단계 커맨드 파일을 읽어 같은 대화에서 이어 실행한다. 체크포인트(멈추고 검토할 기회)는 유지한다.

## 요구사항

1. 각 단계 종료 시 완료 메시지 + `전체 진행률: N/5` 출력은 **유지**한다.
2. 종료 직후 "다음 단계 `/gd-plan-X`로 바로 진행할까요?" 확인 질문을 출력한다.
3. 사용자 **긍정**(응/네/그래/ㅇㅇ/yes/y/진행 등) 시 → 다음 단계 커맨드 파일(`.claude/commands/gd-plan-X.md`)을 읽어 같은 대화에서 즉시 이어 실행한다(슬래시 불필요).
4. **부정/모호** 응답 시 → 정지하고 슬래시 커맨드만 남긴다(진행하지 않음).
5. 특수 전이 보존:
   - `prd → critique`: 예/아니오. 아니오면 정지 + "건너뛰려면 `/gd-plan-design`" 안내.
   - `sitemap → page`: 첫 페이지 slug로 진입 확인.
   - `page`: todo 페이지가 남으면 "다음 `<slug>` 이어서?", 모두 done이면 "모든 페이지 완료 — flows로 갈까요?".
   - `rules → review`: 검증 실행 확인.
   - `review`: **자동 진행 금지(게이트)**. BLOCK 있으면 정지 + 되돌릴 page 안내, 0건이면 "기획 완료" 메시지.
   - `start`: 읽기전용 유지하되 "지금 `<다음>`부터 시작할까요?"로 진입만 자동.
6. **안전장치**: 직전 단계가 실제 done일 때만 자동 진행 제안. `<!-- TODO -->` 등 미완 필드가 있으면 자동 진행 대신 보완을 먼저 안내.
7. 각 §종료에 greppable 마커 `<!-- gd:advance next=<skill|gate|loop> -->`를 넣어 구조 검증/일관성을 보장한다.

## Out of Scope

- 묻지 않는 완전 자동(autopilot) 모드.
- 별도 오케스트레이터 커맨드(`/gd-plan`) 신설.
- 템플릿(`templates/`), 디자인 컬렉션(`design-md-collection/`), CLI(`bin/`), 설치 스크립트(`install.sh`/`get.sh`) 변경.

## 🛑 사용자 검토 필요

> [!IMPORTANT]
> - [ ] harness-kit 설치 부산물 4건(`.harness-kit/`, `.claude/`)이 미커밋 상태다. spec 브랜치 생성 전 `main`에 chore 커밋이 필요(브랜치 깔끔도). `main` 직접 커밋은 거버넌스상 사용자 승인 대상 → Task 1에서 처리, Plan Accept 시 함께 승인.

> [!WARNING]
> - [ ] 동작 변경: 기존 "다음 단계 한 줄 출력 후 종료" → "확인 질문 후 조건부 자동 진행". 기존 사용자에게 흐름이 달라 보일 수 있으나, 긍정하지 않으면 종전과 동일하게 정지하므로 breaking 아님.

## 핵심 전략

각 스킬 §종료에 규약을 **인라인**한다(A안). 소비자에는 공유 CLAUDE fragment가 설치되지 않고 각 슬래시 커맨드는 호출 시 개별 로드되므로, 자족적 인라인이 정석이다.

| 컴포넌트 | 전략 | 이유 |
|:---:|:---|:---|
| **규약 위치** | 각 `plans/gd-plan-*.md` §종료에 인라인 | 슬래시 커맨드 개별 로드 특성과 일치, 새 파일 0 |
| **트리거** | 긍정 응답 시 다음 커맨드 파일 Read 후 이어 실행 | node 불필요·마크다운 자족 철학 |
| **특수 케이스** | prd(soft)·page(loop)·review(gate)는 해당 스킬에 국소화 | 전이 로직이 제 위치에 |
| **검증 훅** | `<!-- gd:advance next=... -->` 마커 | 9개 파일 일관성을 shell 테스트로 강제 |

### 전이표

| 끝 스킬 | next 마커 | 확인 동작 |
|---|---|---|
| start | (안내) | "지금 `<다음 미완>`부터 시작할까요?" |
| prd | critique | 예→critique / 아니오→정지(+design 안내) |
| critique | design | 표준 확인 |
| design | sitemap | 표준 확인 |
| sitemap | page | "첫 페이지 `<slug>` 시작할까요?" |
| page | loop | todo 남으면 다음 slug / 없으면 flows |
| flows | rules | 표준 확인 |
| rules | review | "검증 돌릴까요?" |
| review | gate | 자동 진행 안 함 (BLOCK 정지 / 0건 완료) |

## Proposed Changes

#### [MODIFY] `plans/gd-plan-start.md`
§4 다음 단계 결정 / §5 종료를 "안내 후 진입 확인"으로. `<!-- gd:advance next=<첫 미완> -->` 추가.

#### [MODIFY] `plans/gd-plan-prd.md`
§7 종료에 예/아니오 확인 + 아니오 시 design 안내. `<!-- gd:advance next=critique -->`.

#### [MODIFY] `plans/gd-plan-critique.md`
종료에 표준 확인. `<!-- gd:advance next=design -->`.

#### [MODIFY] `plans/gd-plan-design.md`
§6 종료에 표준 확인. `<!-- gd:advance next=sitemap -->`.

#### [MODIFY] `plans/gd-plan-sitemap.md`
§6 종료에 첫 페이지 진입 확인. `<!-- gd:advance next=page -->`.

#### [MODIFY] `plans/gd-plan-page.md`
종료에 페이지 루프(다음 slug / 소진 시 flows). `<!-- gd:advance next=loop -->`.

#### [MODIFY] `plans/gd-plan-flows.md`
§8 종료에 표준 확인. `<!-- gd:advance next=rules -->`.

#### [MODIFY] `plans/gd-plan-rules.md`
종료에 review 실행 확인. `<!-- gd:advance next=review -->`.

#### [MODIFY] `plans/gd-plan-review.md`
종료에 게이트 동작(자동 진행 금지). `<!-- gd:advance next=gate -->`.

#### [NEW] `test/sh/auto-advance.sh`
9개 `plans/gd-plan-*.md`가 각각 `<!-- gd:advance next=... -->` 마커를 정확히 하나씩 가지며, 기대하는 next 값(전이표)과 일치하는지 검증. review는 `gate`, page는 `loop`. `test/sh/run.sh`에 연결.

## 검증 계획

```bash
# 구조 테스트 (자동)
bash test/sh/auto-advance.sh

# 샌드박스 재설치 후 수동 확인
bash get.sh --yes --src "$PWD" /Users/leeyeachan/Desktop/side-project/gd-plan-sandbox
```

수동 검증 시나리오 (샌드박스 새 세션):
1. `/gd-plan-start` → "PRD부터 시작할까요?" → 긍정 → prd 인터뷰 자동 진입 — 기대: 슬래시 없이 진입.
2. prd 종료 → critique 예/아니오 → "아니오" → 정지 + design 안내 — 기대: 자동 진행 안 함.
3. page 단계 → 한 페이지 완료 → "다음 `<slug>`?" → 모든 page done → "flows로 갈까요?" — 기대: 루프 후 자동 전이 제안.
4. review 종료 → BLOCK 존재 시 자동 진행 안 하고 정지 — 기대: 게이트 보존.

## ADR 후보

- [x] 없음 — 기존 스킬 동작의 국소적 보강. 새 아키텍처 결정 없음.

## ✅ Definition of Done

- [ ] `test/sh/auto-advance.sh` PASS (9개 파일 마커 일관성)
- [ ] 샌드박스 재설치 후 수동 시나리오 1~4 확인
- [ ] `walkthrough.md` 와 `pr_description.md` 작성 및 ship commit
- [ ] `spec-x-gd-plan-auto-advance` 브랜치 push 완료
