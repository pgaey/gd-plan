# Walkthrough: spec-x-readme-overhaul

> README 재구성+증강 (소비자 온보딩). docs-only spec-x.

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| 개편 강도 | 전면 재작성 / 외과적 패치 / 재구성+증강 | **재구성+증강** | critique 가 "본문 대부분 정확, 진짜 stale 은 헤더 2건"을 실측 지적 → 전면 재작성은 새 stale 유입 위험. 정확본문 재사용 + 누락 온보딩 절만 신규 |
| stale 카운트 재발 방지 | ADR 범위 열거 / 미열거 | **미열거** | "ADR-001~0NN" 처럼 카운트를 박으면 다음 ADR 추가 때 또 stale. 카운트 대신 ADR-016 링크만 → 회귀 유입 차단 |
| 과투자 절(배포·footprint) | 전체 절 / 위임 링크 | **위임 링크** | alpha·progressive disclosure — ADR-016/RELEASE.md 로 위임해 README 비대화 방지 |
| phase-02 done 마커 | main 직접 커밋 / spec-x 첫 커밋 동봉 | **첫 커밋(chore) 동봉** | §10.1 main 직접 커밋 금지. dangling 마커를 본 PR 로 main 에 정직 반영 |

### ADR 승격 가이드
- [ ] ADR 승격 대상 있음
- [x] 없음 — docs 정리, 새 아키텍처 결정 없음. "적용 대상" 통찰은 README 본문(설명형)에 보존(critique §4 동의).

## 💬 사용자 협의

- **주제**: README 작업 방향 (전면 재작성 vs 외과적 패치)
  - **사용자 의견**: harness-kit README 수준의 종합 온보딩을 원함. critique 결과를 듣고 "잘 모르겠으니 1번(재구성+증강)으로"
  - **합의**: 정확본문 재사용 + 누락 온보딩 절 신규 (방향 1)
- **주제**: gd-plan 적용 대상
  - **사용자 의견**: "기존 프로젝트엔 안 맞나? PRD 부터 시작을 중간부터 쓰는 건 이상한데"
  - **합의**: 적합 축 = 기획 앞단 ↔ 구현 뒷단 (신규/기존 repo 아님). gd-plan(콘텐츠)↔harness-kit(프로세스) 대조를 "언제 쓰나" 절 + FAQ 로 보존
- **주제**: critique 의 stale 3건 주장
  - **합의**: 검증 결과 진짜 stale 2건(5종 문서·ADR 카운트). spec-13-01 은 디렉토리 실재 → stale 아님(검토자 과다집계 교정)

## 🧪 검증 결과

### 1. 자동화 테스트 (회귀 — 코드 미변경 확인)

#### 단위 테스트
- **명령**: `pnpm test` / `pnpm typecheck` / `pnpm test:sh`
- **결과**: ✅ Passed
- **로그 요약**:
```text
vitest:    Test Files 6 passed (6) · Tests 67 passed (67)
typecheck: tsc --noEmit — clean (no errors)
test:sh:   test-gd.sh (5 시나리오) ✓ · test-get.sh (4 시나리오) ✓ — 2 passed, 0 failed
```

### 2. 수동 검증 (spec.md 수동검증 시나리오 1~4)

1. **Action**: 9 슬래시 커맨드명 README 표 ↔ `plans/gd-plan-*.md` 대조
   - **Result**: 9/9 ✓ (1:1 일치)
2. **Action**: 실재 경로 링크 점검 (`package.json`·`ADR-016`·`RELEASE.md`·`spec-13-01`·`design-md-collection`·`get.sh`)
   - **Result**: 전건 존재 (죽은 링크 0)
3. **Action**: 카운트 일치 (스킬 9·컬렉션 66·버전 `package.json` 0.1.0) + 옛 stale 문자열 잔존 점검
   - **Result**: 일치. `5종 문서 + 검증 2종`(헤더)·`ADR-001~015` 소멸. `:91 structure.md`(페이지별 신모델)·`:94 5종 문서`(review 스킬 표현)는 정당한 현행 — stale 아님
4. **Action**: "언제 쓰나/대상" 절 + "기획 앞단" 프레이밍 존재
   - **Result**: ✓ 존재

## 🔍 발견 사항

- **"5종 문서"는 stale 이 아니었다**: start 스킬 자신이 "5종 기획 문서(prd/design/구조[sitemap+pages]/flows/ui-rules)"라 부름. 옛 stale 은 그 구조를 `structure.md`(평면)로 셌던 부분. → README 를 "9 스킬 → 5종 문서 + 검증 2층 + start"로 정확히 프레이밍.
- **소비자 측 스킬 경로 ≠ 소스 경로**: 소스(이 repo)는 `plans/gd-plan-*.md`, 설치 후(소비자)는 `.claude/commands/gd-plan-*.md`. README footprint 는 설치 경로, 명령 검증은 소스 경로 — 둘 다 정확.
- critique 가 날카로웠으나 spec-13-01 을 과다집계 → 사실 주장은 매번 검증해야 함을 재확인.

## 🚧 이월 항목

- **산출물 예시/스크린샷**: gd-plan 은 문서 생성 도구라 예시가 이상적이나 e2e 미실행으로 실제 산출물 없음 → e2e phase 후로 연기 (Out of Scope 명시).

## 🔗 관련 문서 (Related)

- 관련 ADR: [[ADR-016]] (배포 모델 위임 출처)
- 관련 critique: `specs/spec-x-readme-overhaul/critique.md`

## 📅 메타

| 항목 | 값 |
|---|---|
| **작성자** | Agent + evan |
| **작성 기간** | 2026-06-11 |
| **최종 commit** | `4ca53bf` (ship 전) |
