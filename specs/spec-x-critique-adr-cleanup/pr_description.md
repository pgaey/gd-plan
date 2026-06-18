# docs(spec-x-critique-adr-cleanup): critique 2티어 ADR 복구 + superpowers 잔재 제거

## 📋 Summary

### 배경 및 목적
회고 정리: ① spec-03-01의 critique 2티어 결정이 ADR로 박히지 않았고(후보 식별만), ② spec-x-gd-plan-auto-advance가 harness 규약 밖(`docs/superpowers/`)에 설계 문서를 남겼다. 둘을 정리한다.

### 주요 변경 사항
- [x] `docs/decisions/ADR-017-critique-two-tier-dispatch.md` 신규 — worker→director 2티어 + 2-페이즈 + 교차모델 + 병합 규약 (ADR-014 연장, type decision)
- [x] `docs/superpowers/specs/2026-06-18-gd-plan-auto-advance-design.md` 제거 (auto-advance 설계는 spec-x-gd-plan-auto-advance에 정식 보존)

### Phase 컨텍스트
- spec-x (독립). phase-03 후속 회고 정리.

## 🎯 Key Review Points

1. **ADR-017이 ADR-014의 연장인지** (supersede 아님) — Related에 명시, 014 원칙 유지.
2. **type 어휘 준수** — `decision` (vocab closure).
3. **잔재 제거 안전성** — auto-advance 설계가 spec 디렉토리에 보존돼 있어 정보 손실 없음.

## 🧪 Verification

```bash
bash .harness-kit/bin/sdd status   # stale ADR 9건 불변(신규 0)
bash test/sh/run.sh                 # 4 suites PASS
```

## 📦 Files Changed

### 🆕 New Files
- `docs/decisions/ADR-017-critique-two-tier-dispatch.md`

### 🗑 Deleted Files
- `docs/superpowers/specs/2026-06-18-gd-plan-auto-advance-design.md`

## ✅ Definition of Done

- [x] ADR-017 작성(type decision, ADR-014 연장)
- [x] superpowers 잔재 제거
- [x] sdd status 신규 stale 없음
- [ ] push + PR

## 🔗 관련 자료

- ADR: `docs/decisions/ADR-017-critique-two-tier-dispatch.md` (← ADR-014 연장)
- 구현 spec: `specs/spec-03-01-critique-two-tier/`, 가드: `specs/spec-03-02-critique-dispatch-test/`
