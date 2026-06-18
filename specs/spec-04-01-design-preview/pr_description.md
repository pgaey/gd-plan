# feat(spec-04-01): 디자인 후보 무드 스와치 프리뷰 (빌드타임 fragment)

## 📋 Summary

### 배경 및 목적
`/gd-plan-design` 은 66개 검증 시스템 중 후보 3개를 글 한 줄로만 제시 — 사용자가 실제 톤을 못 봤다. 후보를 **로컬 무드 스와치 프리뷰**로 보이게 한다.

### 주요 변경 사항
- [x] `src/build-swatches.ts` — 각 .md → `_swatches/<name>.html` fragment (§9 Quick Color Reference 팔레트 파싱 + 폰트명 라벨 + radius/shadow best-effort). 66개 생성·커밋.
- [x] `gd-plan-design.md` §2.4 — 후보 3개 fragment 를 `docs/_design-preview.html` 로 결합(node-free, 정직 배너, 수동 열람).
- [x] `install.sh` — 컬렉션 하위 디렉토리(`_swatches/`) 복사 누락 버그 수정(`find -type f`).
- [x] ADR-019 (빌드타임 fragment tradeoff), 회귀 가드(vitest + `test/sh/test-design-preview.sh`).

### Critique 반영 (독립 Opus)
- **폰트 편향 제거**: 실제 폰트 렌더(CDN) 대신 이름 라벨 + 균일 폴백 — 독점/오픈소스 차등 렌더로 인한 픽 왜곡 방지.
- 런타임 LLM(A) → **빌드타임 fragment(C)**: 결정성 확보.
- §9 앵커링, HTML 이스케이프(안전), 부분 렌더, shadow 중첩 괄호 버그 수정.

### Phase 컨텍스트
- `phase-04` (design-tangibility) 첫 spec (Part A). 외부 ref(Part B)는 spec-04-02.

## 🎯 Key Review Points

1. **폰트 편향 제거**: 이름 라벨 정책이 공정성 위해 의도된 선택인지(타이포 느낌 약화 trade-off).
2. **install.sh 분배 수정**: 하위 디렉토리 복사가 `_swatches` 66개를 실제 동봉하는지.
3. **결정성**: 빌드 2회 동일 + shadow 균형 캡처(중첩 rgba).

## 🧪 Verification

```bash
pnpm test          # 76 PASS (build-swatches Red→Green)
pnpm typecheck     # 0
bash test/sh/run.sh # 5 suites PASS
pnpm build-swatches # 66 fragments (결정적)
```
- E2E: 재설치 → `_swatches` 66 동봉 / 3개 결합 프리뷰 팔레트 차이(cal·stripe·linear) / 빌드 2회 동일.

## 📦 Files Changed

### 🆕 New
- `src/build-swatches.ts`, `__tests__/build-swatches.test.ts`
- `design-md-collection/_swatches/*.html` (66)
- `test/sh/test-design-preview.sh`, `docs/decisions/ADR-019-design-preview-build-time.md`

### 🛠 Modified
- `plans/gd-plan-design.md` (§2.4 결합 규약), `package.json` (build-swatches), `install.sh` (하위 디렉토리 복사)

## ✅ Definition of Done

- [x] build-swatches + vitest PASS
- [x] 66 fragment 생성·커밋 + install 동봉
- [x] 스킬 결합 규약 + 구조 가드 PASS
- [x] ADR-019
- [x] 재설치 전파 + 결합 E2E + 결정성
- [ ] push + PR

## 🔗 관련 자료

- ADR: `docs/decisions/ADR-019-design-preview-build-time.md`
- Spec/Critique: `specs/spec-04-01-design-preview/`
- 후속: spec-04-02 (외부 ref = 베이스+오버라이드, ADR-018)
