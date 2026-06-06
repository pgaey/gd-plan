# feat(spec-01-04): flows 자동 역참조(full re-derive) + frontmatter ID 체인 + review 신모델 갱신

## 📋 Summary

### 배경 및 목적
spec-01-01~03 이 세로 슬라이스 모델(sitemap 로스터 + 페이지 dir + 2층 결정 로그)을 깔았으나, 파이프라인 끝 두 스킬(`flows`·`review`)이 구 평면 `docs/structure.md` 에 정체돼 있었다. page 템플릿은 `flows: []` 자동 도출을 약속만 하고 구현이 없었고, `design` 은 없어진 `/gd-plan-structure` 를 다음 단계로 안내해 파이프라인이 끊겨 있었다. 본 SPEC 은 이 마지막 연결을 잇고 ID 스파인을 실제로 흐르게 한다.

### 주요 변경 사항
- [x] **flows 자동 역참조(full re-derive)**: `/gd-plan-flows` 가 전체 flow 스캔 → 각 페이지 `flows:` 를 `sort({[FLOW] | page 참조})` 로 재계산·덮어쓰기(GC 포함, 손편집 금지). SoT=flow step.
- [x] **review 신모델 + ID 체인 소비**: sitemap+pages frontmatter(`covers/roles/flows/parent`)+결정 로그 로딩, structural 체크 2건 추가(역참조 drift / 결정 `연결` 누수).
- [x] **stale 참조 정상화**: flows/review/rules 의 `docs/structure.md`→신모델, design 다음 단계 `/gd-plan-structure`→`/gd-plan-sitemap`, flow 템플릿 정합.
- [x] **ADR-012(invariant)** 작성: 페이지 `flows:` 는 flow step 파생 + ADR-010 관계 명문화.

### Phase 컨텍스트
- **Phase**: `phase-01` (gd-plan-vertical-slice)
- **본 SPEC 의 역할**: 성공 기준 4번(frontmatter `flows` ↔ flow step 1:1, 손편집 0)의 토대 + review 누수 점검(성공 기준 1·3)의 기계가독 입력 확보. phase 의 마지막 spec.

## 🎯 Key Review Points

1. **full re-derive vs add-only** (`plans/gd-plan-flows.md` §5): critique 가 add-only 의 GC 모순을 지적 → "매번 재계산 덮어쓰기"로 전환. 이 한 결정이 누락·모순·모호를 동시 해소.
2. **ADR-012 ↔ ADR-010 관계**: 한 frontmatter 블록에 작성자가 둘(`flows`=flows 스킬, 나머지=page 스킬)이지만 필드별 SoT 분리로 충돌 회피.
3. **"무결성 점검" 정직성** (`plans/gd-plan-review.md` §2): 결정적 set-diff 가 아니라 LLM 순응 기반임을 명시 — 결정적 lint 는 v2.

## 🧪 Verification

### 자동 테스트
```bash
pnpm test
pnpm typecheck
```

**결과 요약**:
- ✅ 43 tests passed (5 files), typecheck 0 error
- ✅ TDD: Task2(5)·Task3(4)·Task4(2) 각 Red→Green

### 수동 검증 시나리오
1. `grep "docs/structure.md\|/gd-plan-structure" plans/ templates/` → 마이그레이션 대상 0건 (잔여 1건은 out-of-scope 죽은 `templates/structure.md`).
2. ADR-012 inline 경로 실재성 → stale drift 오탐 없음.

## 📦 Files Changed

### 🆕 New Files
- `docs/decisions/ADR-012-flows-reverse-derivation.md`: flows 역참조 invariant
- `specs/spec-01-04-flows-autoref-review/{spec,plan,task,critique,walkthrough,pr_description}.md`

### 🛠 Modified Files
- `plans/gd-plan-flows.md` (+): §1 신모델 + §5 full re-derive 단계
- `plans/gd-plan-review.md` (+): 신모델 로딩 + ID 체인 + structural 체크 2건
- `plans/gd-plan-design.md` · `plans/gd-plan-rules.md`: stale 참조 정정
- `templates/flows/_name.md` · `templates/pages/structure.md`: 정합/주석 정정
- `__tests__/skills.test.ts` (+70): 신규 11 assert
- `backlog/phase-01.md` · `backlog/queue.md`: sdd 마커

**Total**: 14 files changed

## ✅ Definition of Done

- [x] 모든 단위 테스트 통과 (43/43)
- [x] (Integration Test Required = no → 생략)
- [x] `walkthrough.md` ship commit 완료
- [x] `pr_description.md` ship commit 완료
- [x] type check 통과 (lint: eslint 미설치 — skip)
- [ ] 사용자 검토 요청 알림 완료 (PR 생성 후)

## 🔗 관련 자료

- Phase: `backlog/phase-01.md`
- Walkthrough: `specs/spec-01-04-flows-autoref-review/walkthrough.md`
- 관련 ADR: `docs/decisions/ADR-012-flows-reverse-derivation.md`
