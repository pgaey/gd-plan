# docs(spec-x-readme-overhaul): README 재구성+증강 — 소비자 온보딩

## 📋 Summary

### 배경 및 목적
`README.md` 는 본문 대부분이 정확하나 **dev 중심으로 압축**돼 처음 보는 소비자가 "무엇·왜·언제·어떻게"를 잡기 어려웠다. 특히 gd-plan 이 *기획 앞단* 도구라는 적용 조건이 문서화돼 있지 않았다. harness-kit README 수준의 온보딩으로 재구성하되, alpha·e2e 미검증 단계라 레퍼런스 매뉴얼화는 경계했다(독립 Opus critique 반영).

### 주요 변경 사항
- [x] **재구성+증강** (전면 재작성 아님) — 정확본문 재사용 + 누락 온보딩 절 신규(이게 무엇/왜·언제 쓰나·시작하기 mermaid·FAQ) + 목차(ToC)
- [x] **"언제 쓰나/대상" 절 신규** — 적합 축 = 기획 앞단 ↔ 구현 뒷단. gd-plan(콘텐츠) ↔ harness-kit(프로세스) 대조
- [x] **stale 헤더 2건 소멸** — `5종 문서 + 검증 2종`, `ADR-001~015`. ADR 카운트 미열거로 회귀 유입 차단
- [x] **과투자 절 위임 링크 슬림화** — 배포 모델 → ADR-016/RELEASE.md (progressive disclosure)
- [x] phase-02 done queue 마커 동봉 (chore) — main 정합성 회복

### Phase 컨텍스트
- **Phase**: 없음 (spec-x, Phase 비소속)
- **본 SPEC 의 역할**: 소비자 온보딩 문서 정비. 후속 e2e dogfooding phase 의 진입 가독성 확보.

## 🎯 Key Review Points

1. **"언제 쓰나/대상" 프레이밍**: gd-plan 적용 조건을 "기획 앞단 ↔ 구현 뒷단"으로 정의. 이번 세션 사용자 협의 산물.
2. **재구성 vs 재작성**: 정확본문은 보존(재사용)하고 누락 절만 신규 — critique 의 "전면 재작성 = 새 stale 유입" 지적 반영.
3. **5종 문서 표기**: "9 스킬 → 5종 문서 + 검증 2층 + start" 가 현행 정확 프레이밍임을 확인(start 스킬 자체 용어).

## 🧪 Verification

### 자동 테스트 (회귀 — 코드 미변경)
```bash
pnpm test && pnpm typecheck && pnpm test:sh
```

**결과 요약**:
- ✅ `vitest`: 67/67 (6 files)
- ✅ `typecheck`: clean
- ✅ `test:sh`: test-gd(5) + test-get(4), 0 failed

### 수동 검증 시나리오
1. **9 슬래시 ↔ `plans/`**: 1:1 일치 (9/9) ✓
2. **실재 경로 링크**: 죽은 링크 0 ✓
3. **카운트·stale**: 스킬9·컬렉션66·버전 0.1.0 일치, 옛 stale 문자열 소멸 ✓
4. **"언제 쓰나" 절**: 존재 ✓

## 📦 Files Changed

### 🛠 Modified Files
- `README.md` (+146, -48): 재구성+증강 (온보딩 16절·ToC·mermaid·FAQ)
- `backlog/queue.md` (+1, -1): phase-02 done 마커

### 🆕 New Files
- `specs/spec-x-readme-overhaul/{spec,plan,task,walkthrough,pr_description,critique}.md`: spec 산출물

**Total**: 2 (소스/문서) + spec 산출물

## ✅ Definition of Done

- [x] README 온보딩 절 완성 + 명령/경로/카운트 stale 0 (교차검증)
- [x] 기존 테스트 회귀 PASS (코드 미변경)
- [x] `walkthrough.md` / `pr_description.md` ship commit
- [x] lint / type check 통과
- [ ] `spec-x-readme-overhaul` 브랜치 push
- [ ] 사용자 검토 요청 알림

## 🔗 관련 자료

- Walkthrough: `specs/spec-x-readme-overhaul/walkthrough.md`
- Critique: `specs/spec-x-readme-overhaul/critique.md`
- 관련 ADR: `docs/decisions/ADR-016-self-contained-distribution.md`
