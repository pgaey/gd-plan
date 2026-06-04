# Walkthrough: spec-01-03

> 결정 로그 자동 기록 규칙 확정. critique(B+C) 반영본.

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| 규칙 배치 | A(5스킬 중복) / B(정본1곳+참조) | **B** | DRY — 한 곳 수정, 5곳 drift 제거. gd-plan 은 항상 패키지 템플릿 로드라 참조 가능 |
| 표 스키마 | 4열 유지 / 6열(ID·연결) | **6열(C)** | set-diff 조인 키 확보 — ★ critique 가장 치명 항목 |
| supersede 표기 | status 7열 / inline(ID 취소선) | **inline** | 대부분 행 빈칸 방지, 6열 유지. append+불변 |
| 이유 미입력 | 행 누락 / TODO 마커 | **TODO 마커** | 빈 이유라도 결정·탈락은 기록 가치 |
| 수동 보강 범위 | 5스킬 전부 / page·prd | **page·prd** | 5곳 전부는 실효 낮고 일관성만 깨짐(critique #4) |

### ADR 승격 가이드
- [x] ADR 승격 대상 있음 → 작성됨: `docs/decisions/ADR-011-decision-log-auto-trigger.md`
- [ ] 없음

> ADR-011 은 cross-spec(spec-1-04 set-diff 가 의존) + long-lived(모든 인터뷰 스킬의 컨벤션) → convention 으로 승격. ADR-008 형식의 확장이라 별도 ADR 대신 흡수.

## 💬 사용자 협의

- **주제**: critique 권장안 반영 범위
  - **사용자 의견**: "B+C 반영해줘"
  - **합의**: 안 A(현 spec) 폐기, B(정본화)+C(스키마 확정) 결합. 구체 변경 1~5(ID·연결 열 / 정본화 / 경로 통일 / FR3 축소 / 테스트 한계) 전부 반영.
- **주제**: harness-kit 업데이트 처리
  - **합의**: phase-FF 로 별도 커밋(`277bc86`) — 본 spec 과 무관, state 영향 없음.

## 🧪 검증 결과

### 1. 자동화 테스트

#### 단위 테스트
- **명령**: `pnpm test` + `pnpm typecheck`
- **결과**: ✅ Passed (32 tests in ~0.2s), typecheck 0 error
- **로그 요약**:
```text
Test Files  5 passed (5)
     Tests  32 passed (32)
```

#### 통합 테스트
- Integration Test Required = no → 생략.

### 2. 수동 검증

1. **Action**: templates-v2 — decisions 템플릿 2종 6열 헤더(ID·연결) + ADR-011 참조 검증
   - **Result**: ✅ Red(4열/ADR-011 부재)→Green
2. **Action**: skills — 인터뷰 5종 결정 기록 참조 + page·prd 수동 보강 검증
   - **Result**: ✅ Red→Green

## 🔍 발견 사항

- **테스트 신뢰 한계(명시)**: 단위 테스트는 *스킬 본문 참조 문자열 + 템플릿 6열 헤더* 만 검증. gd-plan 은 markdown 지시문이라 **실제 1행 생성은 단위 테스트로 검증 불가** — 결정적 검증은 spec-1-04 review set-diff 소관.
- **interim stale 참조**: `gd-plan-design`/`gd-plan-rules` 가 `/gd-plan-structure`·`docs/structure.md` 를 참조(structure→sitemap/page 재편 잔재). 본 spec 범위 밖 → spec-1-04 에서 rules/review 경로 정상화 시 해소.
- **정본 규칙 정규식 강제**: 열 개수/ID 패턴(`D-\d{1,2}`)을 templates-v2 에서 검증함(가능 범위 반영). 행 단위 강제는 spec-1-04.

## 🚧 이월 항목

- flows 자동 역참조 + `rules`/`review` 경로·BLOCK 정상화 → spec-1-04 (memory 노트 기재)
- 결정 로그 set-diff 검증기(`연결` 열 소비) → spec-1-04

## 🔗 관련 문서 (Related)

- 관련 ADR: `docs/decisions/ADR-008-decision-log-two-tier.md`, `docs/decisions/ADR-011-decision-log-auto-trigger.md`
- 관련 spec: spec-01-01(템플릿), spec-01-02(page 골격), spec-1-04(set-diff)
- critique: `specs/spec-01-03-decision-log-auto/critique.md`

## 📅 메타

| 항목 | 값 |
|---|---|
| **작성자** | Agent + evan |
| **작성 기간** | 2026-06-04 |
| **최종 commit** | (ship 직후 기입) |
