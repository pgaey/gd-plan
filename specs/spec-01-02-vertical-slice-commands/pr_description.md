feat(spec-01-02): 세로 슬라이스 명령어 (sitemap + page) — 토대를 동작으로

## 📋 Summary

### 배경 및 목적
spec-01-01 이 깐 세로 슬라이스 템플릿을 *사용해* 실제 구조를 만드는 명령어가 없었다. 본 SPEC 은 `/gd-plan-sitemap`(골격/지도) + `/gd-plan-page <slug>`(페이지 1개 dir)를 추가하고 평면 `/gd-plan-structure` 를 대체한다. (독립 Opus critique 12건 반영 후 구현.)

### 주요 변경 사항
- [x] `/gd-plan-sitemap` 신규 — prd CAP → 페이지 로스터 + 커버리지/정합성 점검
- [x] `/gd-plan-page <slug>` 신규 — slug 정규화·선행 차단·structure 완성·decisions 골격·멱등 보존
- [x] `/gd-plan-structure` 제거 (sitemap+page 대체) + `gd-plan-start` 대시보드 새 구조 인식
- [x] flows 차단 안내 1줄 갱신(죽은 명령 방지) + cli main() 안내 + 테스트(8 스킬)
- [x] ADR-009(slug 정규화) · ADR-010(sitemap↔pages 단일 진실)

### Phase 컨텍스트
- **Phase**: `phase-01` — keystone: 토대를 실제 흐름으로 연결.

## 🎯 Key Review Points

1. **structure 완전 제거 + interim**: `rules`/`review` 는 spec-1-04 까지 `structure.md` 참조가 깨짐(미보증). flows 안내·start 진행률만 본 spec 흡수.
2. **ADR-010 단일 진실**: page frontmatter=진실 / sitemap 로스터=파생 — drift 방향.
3. **slug 정규화(ADR-009)**: 소문자 kebab, 중복 재호출=기존 페이지.

## 🧪 Verification
```bash
pnpm test       # 29 passed
pnpm typecheck  # clean
```
- ✅ skills(8 스킬, start 인식) · templates-v2(ADR 006~010) · integration(8 설치) PASS

## 📦 Files Changed

### 🆕 New
- `plans/gd-plan-sitemap.md`, `plans/gd-plan-page.md`
- `docs/decisions/ADR-009-slug-page-id-normalization.md`, `ADR-010-sitemap-pages-single-source.md`
- `specs/spec-01-02-vertical-slice-commands/{spec,plan,task,critique,walkthrough,pr_description}.md`

### 🛠 Modified
- `plans/gd-plan-start.md`(대시보드), `plans/gd-plan-flows.md`(안내 1줄), `src/cli.ts`(안내), `__tests__/{skills,templates-v2,integration}.test.ts`

### 🗑 Deleted
- `plans/gd-plan-structure.md` (sitemap+page 대체)

## ✅ Definition of Done
- [x] 단위 테스트 29 PASS / typecheck clean
- [x] ADR-009/010 작성
- [x] walkthrough / pr_description ship commit
- [ ] 사용자 검토 요청 (push 후)

## 🔗 관련 자료
- Phase: `backlog/phase-01.md` · Critique: `specs/spec-01-02-vertical-slice-commands/critique.md`
- ADR: 006/007/008(토대), 009/010(본 spec)
