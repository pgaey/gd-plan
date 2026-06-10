# feat(spec-02-01): design 스킬 dev/소비자 2모드 + 전체 동봉 규약

## 📋 Summary

### 배경 및 목적

phase-02(배포·버전·업그레이드)의 첫 spec. `plans/gd-plan-design.md` 가 컬렉션 경로를 repo 로컬로 하드코딩해 외부 설치본에서 동작하지 않던 것을, 소비자 footprint 규약(`.gd/design-md-collection/` 전체 동봉)과 2모드 자동 판별로 해결한다. brainstorm 승인안 "인덱스만+픽 시 fetch"는 실측(1.2MB)으로 전제가 반증되어 **전체 동봉으로 번복** — 픽 시 네트워크 0회, fetch·캐시·폴백 복잡도 클래스째 소멸.

### 주요 변경 사항
- [x] `gd-plan-design.md` §1: 인덱스 위치로 dev / 소비자 모드 자동 판별 (설정 파일 없음)
- [x] 기존 버그 2건 교정: `<file>.md` 중복 부착(`cal.md.md` 사고) · 사문 명령 `pnpm gd plan refresh-index` → `pnpm build-index`
- [x] 규약 테스트 5건 신설 (`design-consumer-mode.test.ts`) — 오프라인 보장(네트워크 지시 부재) 포함
- [x] ADR-016: self-contained bash 배포 + 컬렉션 전체 동봉 + public repo = 배포 서버 (번복 경위·탈락 대안 4건)
- [x] phase-02 활성화 산출물: `backlog/phase-02.md` (spec 3 + phase-FF 2 + 통합 시나리오 3 + 결정 기록 4건)

### Phase 컨텍스트
- **Phase**: `phase-02` (배포·버전·업그레이드)
- **본 SPEC 의 역할**: 토대 — 소비자 footprint 의 컬렉션 규약을 확정해 spec-02-02(get.sh 복사 대상)·spec-02-03(gd upgrade 갱신 대상)의 입력을 제공

## 🎯 Key Review Points

1. **전체 동봉 번복의 타당성**: 승인안 폐기 근거가 실측 1.2MB + critique 위험 분석 (`critique.md`·ADR-016 Alternatives). 번복 절차는 phase-02.md 결정 기록에 남김.
2. **dev 모드 회귀 0**: `gd-plan-design.md` 변경이 이 repo 안의 기존 픽킹 절차를 바꾸지 않는지 (§2 절차 비교).
3. **규약 테스트의 고정력**: 마크다운 스킬 특성상 문자열 규약 테스트가 회귀 방지의 전부 — 5건이 충분한지.

## 🧪 Verification

### 자동 테스트
```bash
pnpm test && pnpm typecheck
```

**결과 요약**:
- ✅ 67/67 PASS (기존 62 + 신규 5), typecheck 클린
- ✅ TDD: Red(3 failed — cd368fd) → Green(67 passed — f5fcd14)

### 수동 검증 시나리오
1. **public raw fetch**: `curl -w "%{http_code}" …/main/package.json` → 200
2. **dev 모드 불변**: 갱신된 §2 절차가 기존 흐름(로컬 풀로드)과 동일함을 본문 대조로 확인

## 📦 Files Changed

### 🆕 New Files
- `__tests__/design-consumer-mode.test.ts`: 소비자 모드 규약 테스트 5건
- `docs/decisions/ADR-016-self-contained-distribution.md`: 배포 모델 결정 기록
- `backlog/phase-02.md`: phase-02 업무 지도 (spec 3 + phase-FF 2 + 통합 시나리오 3)
- `specs/spec-02-01-dist-artifacts-index/{spec,plan,task,critique,walkthrough,pr_description}.md`: spec 산출물

### 🛠 Modified Files
- `plans/gd-plan-design.md` (+6, -2): 2모드 판별 + 버그 2건 교정
- `backlog/queue.md` (+2, -1): phase-02 active 등재

**Total**: 11 files changed

## ✅ Definition of Done

- [x] 모든 단위 테스트 통과 (67/67)
- [x] `walkthrough.md` ship commit 완료
- [x] `pr_description.md` ship commit 완료
- [x] lint / type check 통과
- [x] 사용자 검토 요청 알림 완료

## 🔗 관련 자료

- Phase: `backlog/phase-02.md`
- Walkthrough: `specs/spec-02-01-dist-artifacts-index/walkthrough.md`
- 관련 ADR: `docs/decisions/ADR-016-self-contained-distribution.md`
