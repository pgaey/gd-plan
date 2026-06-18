# Walkthrough: spec-x-critique-adr-cleanup

> 결정 과정, 사용자 협의, 검증 결과 기록.

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| 2티어 결정 기록 방식 | ADR-014 수정 / 신규 ADR | **신규 ADR-017(014 연장)** | 014 원칙 유효, 017은 메커니즘 진화 추가(supersede 아님) |
| ADR-017 type | convention / decision | **decision** | 위계·2-페이즈는 *결정* 성격 강함 |
| superpowers 문서 | 유지 / 제거 | **제거** | harness 규약 밖 잔재, auto-advance 설계는 spec-x-gd-plan-auto-advance에 정식 보존 |

## 💬 사용자 협의

- **주제**: 설계를 superpowers가 아닌 harness로, ADR을 남겼어야 함
  - **합의**: superpowers 경로 폐기 → harness SDD + ADR. 빠진 critique-two-tier ADR을 먼저 spec-x로 복구.

## 🧪 검증 결과

### 자동화 테스트
- **명령**: `bash test/sh/run.sh`
- **결과**: ✅ Passed (4 suites — docs 변경, 회귀 무영향)

### 수동 검증
1. **Action**: `sdd status` stale ADR 검사
   - **Result**: 9건 불변(기존 ADR-001/002/006 등) — ADR-017은 실존 경로만 참조해 신규 stale 0.
2. **Action**: `ls docs/superpowers/`
   - **Result**: 디렉토리 제거됨 ✓.

## 🔍 발견 사항

- gd-plan은 ADR-013/014로 critique 분리 원칙을 이미 갖고 있었고, spec-03-01의 2티어는 그 자연스러운 연장이었다. 계보가 명확해짐(013 분리 → 014 저작자≠검증자 → 017 2티어).

## 🚧 이월 항목 (Optional)

- 외부 ref base+override ADR(ADR-018) + 설계 구현 → phase-04 "design-tangibility".
