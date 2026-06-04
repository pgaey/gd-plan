docs(spec-01-01): 세로 슬라이스 토대 — 디렉토리 모델 + 템플릿 + ADR

## 📋 Summary

### 배경 및 목적
gd-plan 출력을 평면 5문서 → **지도(sitemap) + 페이지별 디렉토리 + 결정 로그 2층**으로 재편하는 phase-1 의 **토대**. 본 SPEC 은 출력 *스키마(템플릿)* 와 *ADR* 만 확정하고 스킬 행동은 건드리지 않는다(→ spec-1-02).

### 주요 변경 사항
- [x] 신규 템플릿 4종: `sitemap.md`(마커 자동관리 로스터) · `pages/structure.md`(ID 스파인 frontmatter) · `pages/decisions.md` · `decisions.md`(결정 로그 2층)
- [x] ADR-006(세로축 단위=PAGE, ADR-004 확장) · ADR-007(sitemap=phase.md 지도) · ADR-008(결정 로그 2층 + frontmatter ID 스파인)
- [x] 검증 테스트 `__tests__/templates-v2.test.ts` (TDD) — 기존 회귀 유지
- [x] *추가만* — 기존 평면 템플릿·7스킬 불변 (backward compatible)

### Phase 컨텍스트
- **Phase**: `phase-01`
- **본 SPEC 의 역할**: 스키마/ADR 토대 — spec-1-02~04 전부의 전제.

## 🎯 Key Review Points

1. **ADR-006 의 ADR-004 관계**: 확장(폐기 아님) — 섹션스택 어휘 통제는 유지, 컨테이너만 평면→페이지 dir.
2. **frontmatter ID 스파인**(`covers/roles/flows/parent`): 향후 set-diff hook(누수 B)의 기계가독 토대 — 키 이름/의미가 적절한지.
3. **backward compat**: 기존 평면 `structure.md` 등 유지 — 구·신 정리는 spec-1-02.

## 🧪 Verification

### 자동 테스트
```bash
pnpm test
pnpm typecheck
```
**결과 요약**:
- ✅ `templates-v2`: 신규 템플릿 4종 + ADR 3종 검증 통과
- ✅ `skills`(회귀): 7스킬·기존 템플릿 불변 통과
- ✅ 전체 28 tests / typecheck clean

## 📦 Files Changed

### 🆕 New Files
- `templates/sitemap.md`, `templates/pages/structure.md`, `templates/pages/decisions.md`, `templates/decisions.md`
- `docs/decisions/ADR-006-vertical-slice-page-unit.md`, `ADR-007-sitemap-as-map.md`, `ADR-008-decision-log-two-tier.md`
- `__tests__/templates-v2.test.ts`
- `specs/spec-01-01-dir-model-templates/{spec,plan,task,walkthrough,pr_description}.md`

**Total**: 12 files (+ 백로그 spec 표 갱신)

## ✅ Definition of Done

- [x] 모든 단위 테스트 통과 (28)
- [x] `walkthrough.md` / `pr_description.md` ship commit
- [x] type check 통과 (lint: eslint 미설치로 skip)
- [ ] 사용자 검토 요청 알림 (push 후)

## 🔗 관련 자료

- Phase: `backlog/phase-01.md`
- Walkthrough: `specs/spec-01-01-dir-model-templates/walkthrough.md`
- 관련 ADR: `docs/decisions/ADR-006~008`, `ADR-004`(확장)
