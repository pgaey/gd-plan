# spec-x-critique-adr-cleanup: critique 2티어 ADR 복구 + superpowers 잔재 제거

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-x-critique-adr-cleanup` |
| **Phase** | `phase-x` |
| **Branch** | `spec-x-critique-adr-cleanup` |
| **상태** | Planning |
| **타입** | docs (회고 정리) |
| **작성일** | 2026-06-18 |
| **소유자** | pgaey |

## 배경 및 문제 정의

### 현재 상황
- `spec-03-01` 이 critique 를 worker(sonnet)→director(opus) 2티어 + 병합으로 강화하며 `critique-two-tier-worker-director-merge` 를 **ADR 후보로 식별만 하고 실제 ADR 파일을 남기지 않았다.**
- `spec-x-gd-plan-auto-advance` 가 harness 규약 밖 경로(`docs/superpowers/specs/2026-06-18-gd-plan-auto-advance-design.md`)에 설계 문서를 남겼다. gd-plan 은 harness-kit SDD(spec/walkthrough/ADR)로 결정을 기록하므로 superpowers 산출물은 잔재다.

### 문제점
아키텍처 결정(2티어 critique)이 ADR 로 박히지 않아 장기 자산화/추적이 안 되고, 규약 밖 문서가 남아 혼선을 준다.

### 해결 방안
2티어 critique 결정을 **ADR-017**(ADR-014 의 연장)로 작성하고, superpowers 잔재 문서를 제거한다.

## 요구사항

1. `docs/decisions/ADR-017-critique-two-tier-dispatch.md` 작성:
   - type: `decision` (vocab closure 준수), status: accepted, 첫 사용자 `plans/gd-plan-critique.md` §2.
   - ADR-014(저작자≠검증자) 의 **연장**임을 Related 에 명시 — 014 의 단일 독립 컨텍스트에 (a) worker→director **2티어**, (b) director **2-페이즈 독립→병합**(anchoring 완화), (c) **교차 모델**(sonnet/director-opus)로 014 가 인정한 동일모델 self-bias 완화를 더한다.
   - Alternatives: 대안 A(병렬 blind 3-디스패치)/B(2-디스패치 순서강제, 채택)/C(비위계 규칙집계) — spec-03-01 critique.md 근거.
2. superpowers 잔재 제거: `docs/superpowers/specs/2026-06-18-gd-plan-auto-advance-design.md` 삭제. 빈 디렉토리면 `docs/superpowers/` 도 정리.
3. ADR inline 경로가 `sdd status` stale 검사를 통과(실존 경로만 backtick).

## Out of Scope

- 외부 ref base+override ADR(ADR-018) — phase-04 소관.
- critique 스킬 동작 변경 — 이미 spec-03-01 에서 완료. 본 spec 은 *기록*만.
- 기존 ADR-014 수정 — 014 는 유지, 017 이 연장(supersede 아님).

## 🛑 사용자 검토 필요

> [!IMPORTANT]
> - [ ] ADR-017 type 을 `decision`(2티어 아키텍처 선택)으로 둔다. spec-03-01 critique 는 `convention`(재사용 패턴) 도 제안했으나, 위계·2-페이즈는 *결정* 성격이 강해 decision 채택. 이견 시 조정.

## 핵심 전략

| 컴포넌트 | 전략 | 이유 |
|:---:|:---|:---|
| ADR-017 | ADR-014 연장으로 작성(supersede 아님) | 014 의 원칙은 유효, 017 은 메커니즘 진화 추가 |
| superpowers 제거 | git rm | harness 규약 단일화 |

## Proposed Changes

#### [NEW] `docs/decisions/ADR-017-critique-two-tier-dispatch.md`
2티어 worker→director+병합+교차모델 결정 기록 (템플릿 준수, type decision).

#### [DELETE] `docs/superpowers/specs/2026-06-18-gd-plan-auto-advance-design.md`
harness 규약 밖 잔재. auto-advance 설계는 이미 `specs/spec-x-gd-plan-auto-advance/` 에 정식 보존됨.

## 검증 계획

```bash
bash .harness-kit/bin/sdd status   # stale ADR 신규 없음 확인
ls docs/superpowers/specs/ 2>&1    # 잔재 제거 확인
```
수동: ADR-017 frontmatter type 이 vocab(decision) 이고 Related 가 ADR-014 를 가리키는지 확인.

## ADR 후보

- [x] 본 spec 이 ADR-017 을 *생성*하는 작업이다.

## ✅ Definition of Done

- [ ] `ADR-017-critique-two-tier-dispatch.md` 작성(type decision, ADR-014 연장 명시)
- [ ] superpowers auto-advance 문서 제거
- [ ] `sdd status` 신규 stale ADR 없음
- [ ] `walkthrough.md`/`pr_description.md` ship + push + PR
