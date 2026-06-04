# Walkthrough: spec-01-02

> 세로 슬라이스 명령어 — 토대(spec-01-01)를 실제 동작으로. critique 12건 반영 후 구현.

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| structure 처리 | 완전 제거 / orchestrator 잔존 / 단계적 deprecation | **완전 제거** | 미출시·소비자0 → deprecation 의식 YAGNI (critique 외부사례 Terraform) |
| interim 막다른 길 | 무시 / flows 안내+start 본 spec 흡수 | **흡수(1~2줄)** | 죽은 명령 가리킴 방지, 비용 작고 피해 큼 |
| covers 진실 방향 | frontmatter / 로스터 / 양방향 | **frontmatter=진실** | drift 단일 방향 (→ ADR-010) |
| slug 규칙 | 자유 / kebab 정규화 | **소문자 kebab** | 식별자 안정 (→ ADR-009) |
| installPlans 갱신 | 목록 하드코딩 / glob | glob 유지 | 이미 glob 기반 → 스킬 추가/삭제 자동 반영 (코드 변경 불필요, main() 안내문만 갱신) |

### ADR 승격 가이드
- [x] ADR 승격 대상 있음 → `docs/decisions/ADR-009-slug-page-id-normalization.md`(convention), `ADR-010-sitemap-pages-single-source.md`(invariant)

## 💬 사용자 협의

- **주제**: spec-01-02 비판(Critique) 반영
  - **합의**: critique 12건(누락 5·모순 2·모호 3·ADR 2) **전부 반영** 후 Plan Accept.
- **주제**: 작업 전 인프라 정리
  - **합의**: harness-kit footprint(.claude 설정/명령어·gitignore·notify 런처·CLAUDE.md)를 먼저 커밋해 깔끔히 시작. `.harness-kit/` 자체는 gitignore 의도라 제외.

## 🧪 검증 결과

### 자동화 테스트 (단위)
- **명령**: `pnpm test` · `pnpm typecheck`
- **결과**: ✅ 29 tests PASS / typecheck clean
- **로그 요약**:
```text
Test Files  5 passed (5)
     Tests  29 passed (29)
```
- TDD: skills.test EXPECTED_SKILLS 갱신(8개) Red(6 fail) → 스킬셋 교체 Green → start 인식 테스트 → ADR 009/010 검증.

### 수동 검증
1. **Action**: `installPlans` glob 동작 — **Result**: structure 제거·sitemap/page 추가가 자동 반영(integration.test 8개 PASS).
2. **Action**: flows 차단 메시지 — **Result**: `/gd-plan-structure`(죽은) → `/gd-plan-sitemap`(live) 갱신 확인.

## 🔍 발견 사항

- `installPlans` 가 glob 기반이라 스킬 추가/삭제가 코드 변경 없이 반영 — FR5의 "목록 갱신"은 실제론 `main()` 안내문 1곳뿐이었음.
- structure 제거로 `rules`/`review` 가 `structure.md` 를 가리키는 부분은 여전히 깨짐(interim) — spec-1-04에서 정상화. flows 는 안내 1줄만 본 spec에서 흡수.

## 🚧 이월 항목

- 결정 로그 자동 기록(fork 훅) → **spec-1-03**
- flows 자동 역참조 + frontmatter 도출 + `rules`/`review` 경로·BLOCK 갱신 → **spec-1-04**

## 🔗 관련 문서 (Related)

- 관련 ADR: ADR-006/007/008(토대), ADR-009/010(본 spec)
- Critique: `specs/spec-01-02-vertical-slice-commands/critique.md`

## 📅 메타

| 항목 | 값 |
|---|---|
| **작성자** | Agent + evan |
| **작성 기간** | 2026-06-04 |
| **최종 commit** | (ship 시점 기입) |
