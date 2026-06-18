# refactor(spec-x-gd-plan-auto-advance): gd-plan 단계 자동 진행(confirm-then-advance)

## 📋 Summary

### 배경 및 목적
gd-plan 기획 파이프라인(9개 슬래시 스킬)은 각 단계 종료 시 `다음 단계: /gd-plan-X` 한 줄만 출력하고 멈춰, 사용자가 매번 다음 슬래시 커맨드를 직접 타이핑해야 했다. 9단계(+페이지 N회) 동안 반복되는 마찰을 제거한다.

### 주요 변경 사항
- [x] 각 단계 §종료를 **확인 후 자동 진행(confirm-then-advance)** 으로 보강 — 긍정 응답 시 다음 커맨드 파일을 읽어 같은 대화에서 이어 실행, 부정/모호면 정지
- [x] 특수 전이 보존: prd→critique(예/아니오), sitemap→page(첫 slug 진입), page(페이지 루프→flows), review(게이트, 자동 진행 금지), start(읽기전용+진입 확인)
- [x] greppable 마커 `<!-- gd:advance next=X -->` 9개 + 구조 테스트 `test/sh/test-auto-advance.sh`

### Phase 컨텍스트
- **Phase**: 없음 (spec-x — 독립 PR)
- **본 SPEC 의 역할**: 기존 스킬 동작의 국소적 UX 보강. 새 커맨드·아키텍처 없음.

## 🎯 Key Review Points

1. **전이표 정합성**: 각 `plans/gd-plan-*.md` 마커 next 값이 전이표와 일치하는가 (start=auto, prd=critique, …, page=loop, review=gate).
2. **review 게이트**: review 가 자동 진행하지 않고 BLOCK 정지/0건 완료 안내만 하는가 (검증 게이트 의미 보존).
3. **부트스트랩 커밋**: harness-kit 설치 부산물(`.claude/`)을 `main` 에 chore 커밋 후 브랜치 생성 — Plan Accept 시 승인된 항목.

## 🧪 Verification

### 자동 테스트
```bash
bash test/sh/run.sh
```

**결과 요약**:
- ✅ `test-auto-advance.sh`: 9개 마커 전이표 일치
- ✅ `test-gd.sh`: 통과
- ✅ `test-get.sh`: 통과

### 수동 검증 시나리오
1. **설치 전파**: `get.sh --src` 재설치 → `.claude/commands/gd-plan-*.md` 9개 전부 마커 전파 확인.
2. **분기/게이트**: prd 예/아니오 분기, review 게이트 텍스트 설치본 grep 확인.
3. **한계**: 대화형 "응→자동실행" E2E 는 별도 세션 필요 — 구조/텍스트 수준 검증.

## 📦 Files Changed

### 🆕 New Files
- `test/sh/test-auto-advance.sh`: 9개 스킬 마커 일관성 구조 테스트
- `specs/spec-x-gd-plan-auto-advance/*`: spec/task/walkthrough/pr_description
- `docs/superpowers/specs/2026-06-18-gd-plan-auto-advance-design.md`: 설계 문서

### 🛠 Modified Files
- `plans/gd-plan-{start,prd,critique,design,sitemap,page,flows,rules,review}.md`: §종료에 confirm-then-advance + 마커
- `.claude/settings.json` 외 install 부산물 (별도 chore 커밋, main)

**Total**: 9 plans + 1 test + 5 artifacts

## ✅ Definition of Done

- [x] 모든 셸 테스트 통과 (3 suites)
- [x] `walkthrough.md` / `pr_description.md` ship commit
- [x] `spec-x-gd-plan-auto-advance` 브랜치 push
- [x] 사용자 검토 요청 (PR)

## 🔗 관련 자료

- Spec: `specs/spec-x-gd-plan-auto-advance/spec.md`
- Walkthrough: `specs/spec-x-gd-plan-auto-advance/walkthrough.md`
- 설계: `docs/superpowers/specs/2026-06-18-gd-plan-auto-advance-design.md`
