# Walkthrough: spec-01-04

> flows 자동 역참조(full re-derive) + frontmatter ID 체인 + review 신모델 갱신. critique 5건 반영본.

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| flows 역참조 방식 | add-only merge / full re-derive | **full re-derive** | GC·정렬·멱등·"손편집 금지↔수정주체" 모순 동시 해소 (critique #1) |
| 누수 판정 깊이 | LLM 무결성 점검 / 결정적 코드 set-diff | **LLM 무결성 점검** | markdown 지시문 도구 — 결정적 lint 는 review §7 v2 |
| ADR-012 분류 | decision / invariant | **invariant** | cross-spec·long-lived SoT 방향 불변. ADR-010 의 두 번째 인스턴스 |
| 죽은 평면 `templates/structure.md` | 제거 / 유지 | **유지(out of scope)** | `skills.test.ts:74` 가 존재 강제 — 제거는 테스트 동반 별도 작업 |

### ADR 승격 가이드
- [x] ADR 승격 대상 있음 → 작성됨: `docs/decisions/ADR-012-flows-reverse-derivation.md`
- [ ] 없음

> ADR-012 는 cross-spec(성공기준4·FR4 가 의존) + long-lived → invariant. ADR-010("디렉토리=진실, 인덱스=파생")의 두 번째 인스턴스이며, ADR-010 의 "page frontmatter 단일 작성자(`/gd-plan-page`)" 가정을 `flows` 필드에 한해 `/gd-plan-flows` SoT 로 좁히는 예외임을 본문에 명문화.

## 💬 사용자 협의

- **주제**: critique 반영 범위
  - **사용자 의견**: "5개 다 반영해줘"
  - **합의**: 5건 전부 반영 — ①FR1 full re-derive ②ADR-012↔ADR-010 관계 ③`templates/pages/structure.md` 주석 ADR-009→012 ④FLOW slug 정규화 ⑤review "set-diff"→"무결성 점검"+재현성.
- **주제**: § 기호 의미 + 설명 단순화
  - **합의**: § = section sign(절 번호). 이후 설명은 짧게·비유 우선.
- **주제**: stale ADR drift (선행 점검)
  - **합의**: 8건은 드리프트 휴리스틱 거짓 양성(제품 산출물/플레이스홀더 경로) — 깨진 참조 아님. benign 판정 후 진행.

## 🧪 검증 결과

### 1. 자동화 테스트

#### 단위 테스트
- **명령**: `pnpm test` + `pnpm typecheck`
- **결과**: ✅ Passed (43 tests in ~0.3s), typecheck 0 error
- **로그 요약**:
```text
Test Files  5 passed (5)
     Tests  43 passed (43)
```
- TDD 추이: Task2 Red 5fail→Green, Task3 Red 4fail→Green, Task4 Red 2fail→Green.

#### 통합 테스트
- Integration Test Required = no → 생략. end-to-end(미용실 예약 실제 실행)는 phase 통합 테스트 소관.

### 2. 수동 검증

1. **Action**: `grep -rn "docs/structure.md\|/gd-plan-structure" plans/ templates/`
   - **Result**: 마이그레이션 대상(flows/review/rules/design + flow 템플릿) 0건. 유일 잔여 = out-of-scope 죽은 `templates/structure.md:5`.
2. **Action**: ADR-012 inline backtick 경로 실재성 점검
   - **Result**: ✅ ADR-008/009/010 + gd-plan-flows/review 전부 실재 — stale drift 오탐 없음(개념 경로는 fence/문구로 회피).

## 🔍 발견 사항

- **flows·review 가 구 평면 모델에 정체돼 있었다**: spec-01-01/02 가 신모델을 깔고 page 스킬까지 옮겼으나 파이프라인 끝 두 스킬이 미이전. design 은 없어진 `/gd-plan-structure` 를 "다음 단계"로 안내해 파이프라인이 끊겨 있었음(stale 버그).
- **page 템플릿이 약속만 하고 구현이 없던 gap**: `flows: []` 주석이 "자동 도출(spec-1-04)" 을 선언했으나 flows 스킬에 back-fill 단계가 없었음 — 본 spec 이 그 구현.
- **단위 테스트의 한계(명시)**: 스킬/템플릿 본문 문자열·구조만 검증. 실제 frontmatter 1행 생성·누수 판정의 정확성은 phase 통합 테스트(수동) 의존.

## 🚧 이월 항목

- 죽은 평면 `templates/structure.md` 제거(+`skills.test.ts:74` 동반 수정) → phase-FF 또는 별도 spec 후보.
- 결정적 set-diff lint 엔진(`gd-cli lint` 종료코드) → review §7 v2.
- end-to-end 파이프라인 실행(미용실 예약, 성공기준 1·3·4 정량 측정) → `/hk-phase-ship`.

## 🔗 관련 문서 (Related)

- 관련 ADR: `docs/decisions/ADR-012-flows-reverse-derivation.md`, `docs/decisions/ADR-010-sitemap-pages-single-source.md`, `docs/decisions/ADR-008-decision-log-two-tier.md`
- 관련 spec: spec-01-01(템플릿), spec-01-02(sitemap/page), spec-01-03(결정 로그 6열)
- critique: `specs/spec-01-04-flows-autoref-review/critique.md`

## 📅 메타

| 항목 | 값 |
|---|---|
| **작성자** | Agent + evan |
| **작성 기간** | 2026-06-06 |
| **최종 commit** | (ship commit 후 기입) |
