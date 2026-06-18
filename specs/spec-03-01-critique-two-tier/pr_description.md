# refactor(spec-03-01): critique 2티어화 (worker→director→사람 triage)

## 📋 Summary

### 배경 및 목적
`gd-plan-critique` 는 이미 독립 서브에이전트 **1개**로 PRD 를 비평하지만, 그 비평을 적대적으로 검증하는 2차 관문이 없었다(worker 가 놓친 발견·환각 규제·잘못된 severity 가 그대로 전달). 또한 동일 모델 검증 시 self-bias 잔존. 비평 레이어를 **worker(sonnet) 1차 → director(opus) 독립 2차 + 병합 → 사람 triage** 2티어로 강화한다. 작업 중인 메인 에이전트는 비평·검증·병합을 직접 하지 않는다.

### 주요 변경 사항
- [x] §2 재작성: 단일 디스패치 → worker+director **2티어 독립 디스패치**. director **2-페이즈 순서 강제**(페이즈1 독립 commit → 페이즈2 병합)로 anchoring 완화
- [x] 병합 규약: 매칭 키(`prd.md:줄`+렌즈) / 갭 provenance 표면화 / severity 재정 근거 강제 / director 직접 재검증 후 무근거 drop
- [x] §4 스키마 확장: provenance(`director단독`/`worker단독`/`공통`) + director 단독발견 블록 + `prdVersion`/`modelTiers`
- [x] 폴백 graceful degrade(2→1 ⚠️1차본 배너→self-review) + 대안 A(병렬 blind 3-디스패치) opt-in
- [x] 모델 기본값 worker=sonnet/director=opus(둘 다 opus 전환 가능 명시)

### Phase 컨텍스트
- **Phase**: `phase-03` (critique-hardening) — 첫 spec
- **역할**: 비평 레이어 2티어 강화의 핵심. spec-03-02(review 적용)·03-03(구조 테스트) 의 패턴 기준.

## 🎯 Key Review Points

1. **메인 비평금지 불변식**: 메인 에이전트가 비평·검증·병합을 직접 하지 않고 디스패치·relay·triage 만 하는지.
2. **anchoring 완화**: director 2-페이즈 순서 강제가 명확한지(독립 비평 commit이 worker 보고서 제시보다 선행).
3. **요구사항 3 ↔ §4 스키마 정합**: provenance 를 담을 스키마 필드가 실제로 추가됐는지(critique 모순 해소 반영).

## 🧪 Verification

```bash
bash test/sh/run.sh
```
- ✅ 회귀 3 suites PASS (본 spec 전용 구조 테스트는 spec-03-03)
- ✅ 설치본 전파 grep: 2-페이즈/모델 기본값/provenance/1차본 배너/대안 A/불변식 모두 ✓
- ✅ Spec Critique(independent Opus) 9건 반영

### 수동 검증 한계
- 결함 PRD 로 두 에이전트 디스패치 + 병합 E2E 는 별도 소비자 세션 필요 → phase-03 통합 테스트 시나리오 1 로 이월.

## 📦 Files Changed

### 🆕 New Files
- `backlog/phase-03.md`: phase 정의
- `specs/spec-03-01-critique-two-tier/{spec,task,critique,walkthrough,pr_description}.md`

### 🛠 Modified Files
- `plans/gd-plan-critique.md`: 도입부 + §2 + §4 + §5 2티어 재작성
- `backlog/queue.md`: phase-03 active

## ✅ Definition of Done

- [x] `gd-plan-critique.md` 2티어·2-페이즈·병합·§4 스키마·폴백·대안 A 포함
- [x] 샌드박스 재설치 전파 grep 확인
- [x] 회귀 테스트 PASS
- [x] walkthrough/pr_description ship commit
- [ ] 브랜치 push + PR

## 🔗 관련 자료

- Spec: `specs/spec-03-01-critique-two-tier/spec.md`
- Critique: `specs/spec-03-01-critique-two-tier/critique.md`
- Phase: `backlog/phase-03.md`
- ADR 후보: `critique-two-tier-worker-director-merge` (convention)
