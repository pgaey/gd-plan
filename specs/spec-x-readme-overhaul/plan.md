# Implementation Plan: spec-x-readme-overhaul

## 📋 Branch Strategy

- 신규 브랜치: `spec-x-readme-overhaul` (브랜치 이름 = spec 디렉토리 이름, `feature/` prefix 없음)
- 시작 지점: `main` (현재 origin/main 44f2044 동기화 완료)
- 첫 task 가 브랜치 생성을 수행함
- **떠 있는 phase-02 done 마커 처리**: main 작업트리의 `backlog/queue.md` 미커밋 변경(phase-02 → done)을 본 브랜치 첫 커밋(chore)에 실어 해소한다. §10.1(main 직접 커밋 금지) 준수 — 마커가 이 spec-x PR 로 main 에 정직하게 반영됨.

## 🛑 사용자 검토 필요 (User Review Required)

> [!IMPORTANT]
> - [ ] README 16절 구조 + "언제 쓰나/대상" 프레이밍 (gd-plan=콘텐츠 ↔ harness-kit=프로세스) 확정
> - [ ] phase-02 done 마커를 본 spec-x 첫 커밋(chore)에 동봉하는 처리 방식 확정

## 🎯 핵심 전략 (Core Strategy)

### 주요 결정 (critique 반영)

| 컴포넌트 | 전략 | 이유 |
|:---:|:---|:---|
| **개편 방식** | **재구성+증강** (전면 재작성 아님) | 본문 대부분 정확 → 재사용. 누락 온보딩 절만 신규. 정확본문 재작성은 새 stale 유입 위험(critique 모순 지적) |
| **구조 모델** | harness-kit 거울을 *출발 가이드*로, 절 채택은 gd-plan 도메인 판단 | n=1 모방 맹종 회피. "16절" 숫자 목표 아님. 과투자 절은 위임 |
| **정확성 보증** | 실제 소스 1회 수동 교차검증 | 명령=`plans/`, 버전 SoT=`package.json`. 항구 lint 게이트는 범위 밖 |
| **적용 조건** | "언제 쓰나/대상" 절 + FAQ | 통찰 본문 보존, ADR 불요 |
| **비대화 방지** | 배포·전체 footprint → ADR-016/RELEASE.md 위임 링크 | progressive disclosure |
| **queue 마커** | 첫 커밋(chore)에 동봉 | dangling 해소 + main 정합성 회복 |

### 📑 ADR 후보

- [ ] ADR 가치 있는 결정 있음
- [x] 없음 — 문서 작업, 새 아키텍처 결정 없음.

## 📂 Proposed Changes

### 문서

#### [MODIFY] `README.md`
재구성+증강(spec.md FR1). 정확본문 재사용 + 누락 온보딩 절 신규 + stale 2건 교정. 교차검증 소스(정정):
- 슬래시 9: **`plans/gd-plan-*.md`** (`.claude/commands/` 엔 `hk-*` 만 — 오기 정정)
- gd CLI: 설치 footprint `.gd/bin/gd` (`status·upgrade·version`)
- get.sh 옵션: `get.sh` usage 헤더 (핵심만 게재, 전체는 `--help` 위임)
- 카운트: 스킬 9, ADR `docs/decisions/` 실제 수(016까지), 컬렉션 66, 버전 **`package.json`(0.1.0)=SoT** (`.gd/VERSION` 은 설치 산출물 — 혼동 금지)
- stale 교정: `:7` "5종 문서"→9 스킬, `:33` "ADR-001~015"→016. `:34` spec-13-01 은 실재 → 배경 절로 정리(삭제 아님)

#### [MODIFY] `backlog/queue.md`
phase-02 done 마커(이미 작업트리에 존재). 첫 커밋(chore)에 포함.

> 코드/스킬/템플릿/`src`/`get.sh`/`gd` **변경 없음** (Out of Scope).

## 🧪 검증 계획 (Verification Plan)

### 단위 테스트 (회귀 — 코드 미변경 확인)
```bash
pnpm test        # vitest 회귀 (README 무관 — 그대로 PASS 확인)
pnpm test:sh     # get.sh·gd 셸 테스트
pnpm typecheck
```
> 코드를 건드리지 않으므로 결과는 변동 없어야 한다. README 콘텐츠를 직접 단언하는 테스트가 있으면(예: 명령 카운트 grep) 재작성이 이를 만족해야 한다 — 실행 단계에서 확인.

### 수동 검증 시나리오
1. 9 슬래시 커맨드명이 README 표 ↔ **`plans/gd-plan-*.md`** 와 1:1 일치 — 기대: 누락/오타 0.
2. README 내 모든 백틱 파일경로가 실재하거나 명시적 placeholder(`[PAGE]` 등)임 — 기대: 죽은 링크 0.
3. 카운트(스킬 9·ADR 16·컬렉션 66·버전 `package.json` 0.1.0)가 실제와 일치 — 기대: stale 0.
4. "언제 쓰나/대상" 절이 적합 축(기획 앞단 ↔ 구현 뒷단)과 gd-plan↔harness-kit 대조를 담음 — 기대: 존재.

## 🔁 Rollback Plan
- 문서 단일 파일 변경 → 문제 시 `git revert` 또는 PR 미머지로 무영향.
- 런타임/상태 영향 없음.

## 📦 Deliverables 체크
- [x] task.md 작성 (다음 단계)
- [ ] 사용자 Plan Accept 받음
- [ ] (실행 후) 모든 task 완료
- [ ] (실행 후) walkthrough.md / pr_description.md ship
