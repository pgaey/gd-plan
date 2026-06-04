# feat(spec-01-03): 결정 로그 자동 기록 (fork 트리거 + 6열 ID 스키마 정본화)

## 📋 Summary

### 배경 및 목적
spec-01-01 이 결정 로그 2층 템플릿을, spec-01-02 가 페이지 `decisions.md` 골격을 깔았으나 **무엇이 한 행이 되는지(트리거)**, **행이 어떤 모양인지(ID·연결)** 가 없어 로그가 비어 있고 spec-1-04 set-diff 가 파싱할 키도 없었다. critique 권장(B+C)에 따라 규칙을 정본화하고 표 스키마를 확정한다.

### 주요 변경 사항
- [x] **C — 6열 스키마**: typed 표 `결정\|선택지\|탈락\|이유` → `ID \| 결정 \| 선택지 \| 탈락 \| 이유 \| 연결`. 순차 ID(D-NN) + 연결(`[CAP]`/`[PAGE]`) = set-diff 조인 키
- [x] **B — 정본화(DRY)**: 트리거·스키마·supersede·멱등 규칙을 ADR-011 + 템플릿 규칙 블록 1곳에. 인터뷰 스킬 5종은 짧은 참조만(5곳 중복 제거)
- [x] supersede(append+inline status, 불변) + 이유 미입력 처리(되묻기→TODO) + 동일키 멱등 정의
- [x] 경로 `pages/[PAGE]/decisions.md` → `docs/pages/[PAGE]/decisions.md` 통일
- [x] FR3 수동 보강을 page·prd 2종으로 축소

### Phase 컨텍스트
- **Phase**: `phase-01`
- **본 SPEC 의 역할**: 결정 기록축(누수 A 해소)의 *채우는 법* 확정 + spec-1-04 set-diff(누수 B)의 파싱 토대(`연결` 열) 제공.

## 🎯 Key Review Points

1. **ADR-011 정본 6항**: 트리거/6열 스키마/supersede/멱등/이유처리/정본위치 — 결정 로그 SSOT.
2. **DRY 검증**: 스킬 5종에 규칙 *본문*이 없고 참조 1줄 + fork 목록만 있는지.
3. **테스트 한계**: 단위 테스트는 문자열/헤더 존재만 검증 — 실제 행 생성은 지시문 신뢰(spec-1-04 set-diff 소관). walkthrough 발견사항 참조.

## 🧪 Verification

### 자동 테스트
```bash
pnpm test
pnpm typecheck
```

**결과 요약**:
- ✅ templates-v2: decisions 6열 헤더(ID·연결) + 정본 규칙(ADR-011·D-NN) + ADR-011 존재
- ✅ skills: 인터뷰 5종 결정 기록 참조 + page·prd 수동 보강
- ✅ 32 tests passed, typecheck 0 error

### 수동 검증 시나리오
1. **6열 스키마**: 템플릿 헤더가 ID·연결 포함 → ✅
2. **정본 단일화**: 스킬 본문에 규칙 중복 없음, ADR-011 참조만 → ✅

## 📦 Files Changed

### 🆕 New Files
- `docs/decisions/ADR-011-decision-log-auto-trigger.md`: 결정 로그 정본(트리거+6열+supersede)

### 🛠 Modified Files
- `templates/decisions.md` (+18, -7): 6열 헤더 + 규칙 블록 + 경로 통일
- `templates/pages/decisions.md` (+14, -6): 6열 헤더 + 규칙 블록
- `plans/gd-plan-prd.md` (+1): 결정 기록 참조 + 수동 보강
- `plans/gd-plan-design.md` (+2): 결정 기록 참조
- `plans/gd-plan-sitemap.md` (+2): 결정 기록 참조
- `plans/gd-plan-page.md` (+3, -1): §5 골격→fork 자동 기록 + 수동 보강
- `plans/gd-plan-rules.md` (+2): 결정 기록 참조
- `__tests__/templates-v2.test.ts` (+18, -3): 6열·정본 규칙·ADR-011 검증
- `__tests__/skills.test.ts` (+15): 결정 기록 참조·수동 보강 검증

**Total**: 10 files changed

## ✅ Definition of Done

- [x] 모든 단위 테스트 통과 (32)
- [x] 통합 테스트 — 해당 없음(Required=no)
- [x] `walkthrough.md` ship commit 완료
- [x] `pr_description.md` ship commit 완료
- [x] typecheck 통과
- [ ] 사용자 검토 요청 알림 (ship 직후)

## 🔗 관련 자료

- Phase: `backlog/phase-01.md`
- Walkthrough: `specs/spec-01-03-decision-log-auto/walkthrough.md`
- 관련 ADR: `docs/decisions/ADR-008-decision-log-two-tier.md`, `docs/decisions/ADR-011-decision-log-auto-trigger.md`
