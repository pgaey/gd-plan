# test(spec-03-02): critique 2티어 디스패치 규약 회귀 가드

## 📋 Summary

### 배경 및 목적
spec-03-01 이 `gd-plan-critique.md` 를 worker→director 2티어로 재작성했다. 이 불변식은 산문(프롬프트)이라 추후 편집으로 조용히 회귀할 수 있다. 회귀를 막는 구조 테스트를 추가한다.

### 주요 변경 사항
- [x] `test/sh/test-critique-dispatch.sh` 신규 — critique.md 의 9개 2티어 불변식 grep 검증
- [x] 가드 작동 증명: 불변식 깨뜨림 → FAIL → 복구 → PASS
- [x] phase-03 §11.3 재검증 반영: review 적용 spec **drop → Icebox** (review 는 결정적 lint, 의미적 2차 이득 낮음)

### Phase 컨텍스트
- **Phase**: `phase-03` (critique-hardening) — 2번째이자 마지막 spec
- **역할**: spec-03-01 이 만든 2티어 규약을 회귀로부터 보호. 이 spec 머지 후 phase-03 는 done 후보.

## 🎯 Key Review Points

1. **회귀 가드 작동**: 임시 깨뜨림 → FAIL 증명(walkthrough). grep 패턴이 너무 좁지 않은지.
2. **§11.3 결정**: review 적용 drop → Icebox 가 phase-03.md 결정 로그 + queue.md Icebox 에 기록됐는지.

## 🧪 Verification

```bash
bash test/sh/run.sh
```
- ✅ 4 suites PASS (test-critique-dispatch 추가)
- ✅ 가드 증명: `model: "opus"` 임시 깨뜨림 → exit 1 → 복구 → exit 0

## 📦 Files Changed

### 🆕 New Files
- `test/sh/test-critique-dispatch.sh`: 2티어 불변식 회귀 가드
- `specs/spec-03-02-critique-dispatch-test/*`

### 🛠 Modified Files
- `backlog/phase-03.md`: review spec drop, 구조 테스트를 spec-3-02 로, 결정 로그
- `backlog/queue.md`: review 적용 → Icebox

## ✅ Definition of Done

- [x] `test-critique-dispatch.sh` PASS + 가드 작동 증명
- [x] `bash test/sh/run.sh` 전체 PASS
- [x] walkthrough/pr_description ship commit
- [ ] 브랜치 push + PR

## 🔗 관련 자료

- Spec: `specs/spec-03-02-critique-dispatch-test/spec.md`
- Phase: `backlog/phase-03.md`
- 선행: `specs/spec-03-01-critique-two-tier/` (보호 대상)
