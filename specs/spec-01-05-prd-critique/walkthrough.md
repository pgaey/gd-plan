# Walkthrough: spec-01-05

> PRD 전제 critique(의미 정합 적대 검증) + 제약/규제 prevention 의 작업 기록.

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| 독립성 강제 수준 | 멈춤 / 정직한 폴백 / non-normative | **정직한 폴백** | 진짜 의도는 "침묵 self-review 차단"이지 멈춤이 아님 — 폴백+배너로 가용성·의도 둘 다 (코드리뷰 전엔 "멈춤"이었으나 dogfood critique 의 NFR1 모순 지적으로 수정) |
| 비평 대상 범위 | PRD만(A) / 5종 전체(B) / 둘다 | **A (PRD 전제)** | 최고심각도(루프 미완결)가 PRD층이고 가장 싸게 잡힘. 디자인층은 별도 후속 |
| 게이트 강도 | soft / 하드 BLOCK | **soft (경고)** | critique 판정은 결정적이지 않음 → review 식 BLOCK 부적절 |
| staleness | 저장(flag) / 읽을때 파생 | **읽을때 파생(stateless)** | 진실원 1개(`version`), desync 불가. "1회 경고"의 영속플래그 모순 회피 |
| 렌즈 구성 | 시장대조 포함 / 제외 | **시장 제외, L1·L2·L3** | 목적은 "퍼블리싱 기초 적합성"이지 시장검증 아님(실증 결함 기반) |
| 비평 모델 | Opus / Sonnet | **Opus** | critique 는 "유창하지만 얕은 답"을 잡는 게 목적 — 약한 모델이 그 함정에 더 빠짐. PRD당 1회라 비용 무관 |
| version 초기값 규칙 | 분산 / 정본화 | **templates/prd.md 정본** | 코드리뷰 Major — 신규=1, 갱신마다 +1 1곳 고정 |

### ADR 승격 가이드
- [x] ADR 승격 대상 있음 → phase-ship/머지 시 작성 예정:
  - `critique-vs-review-separation` (convention) · `author-verifier-separation` (invariant) · `prd-version-derived-staleness` (convention)

## 💬 사용자 협의

- **주제**: critique 역할의 존재 여부와 필요성 (gd-plan 을 harness-kit 없이 쓸 때)
  - **합의**: gd-plan 자체에 `/gd-plan-critique` 신설 — Claude Code 기본 Agent tool 만 사용(harness-kit 비의존)
- **주제**: `/grill-me` 설계 인터뷰 (독립성·대상·게이트·버전·렌즈·prevention 슬롯)
  - **합의**: 위 결정 기록 7건. 특히 "구조적 완성 ≠ 의미적 정합" 북극성 확정
- **주제**: dogfood — `/hk-spec-critique` 로 본 spec 자체 검증
  - **합의**: 발견 13건 전건 반영(severity 스키마·L2 grounding·정직한 폴백·"분리≠모델분리"·stateless gate 등)
- **주제**: 렌즈 3종·폴백·Opus/Sonnet 재설명 후 스킬 검토
  - **합의**: 렌즈 유지 / Opus 유지 / 폴백 배너에 "중대결정 확정 금지" 추가
- **주제**: 실증 근거 — 별도 워크스페이스(cmux Test) 치과 dry-run 의 적대 critique 4결함
  - **합의**: 이 결함 taxonomy 를 렌즈·golden fixture 설계의 실증 근거로 사용

## 🧪 검증 결과

### 1. 자동화 테스트
#### 단위 테스트
- **명령**: `pnpm test` (vitest)
- **결과**: ✅ Passed (59 tests, 5 files) — 시작 46 → +13 신규
- **로그 요약**:
```text
Test Files  5 passed (5)
     Tests  59 passed (59)
```
- 추가: `pnpm typecheck` OK · `pnpm build` OK · `pnpm build-index` OK (설치기 무손상)

### 2. 수동 검증
1. **Action**: 결함 fixture(`golden-prd-dental.md`)로 critique recall eval — **수동/오프라인**(CI 아님, LLM 비결정성)
   - **Result**: 기대 must-catch 4건(`expected.json`)을 잡는지는 수동 측정 대상으로 명문화(NFR3 정직성)
2. **Action**: 독립 코드리뷰(`/hk-code-review`, Opus 서브에이전트)
   - **Result**: Comment / Critical 0·Major 2·Minor 5 → Major 2 + Minor 3 반영(`7dae97f`)

## 🔍 발견 사항

- gd-plan 의 기존 서브에이전트는 전부 "non-normative(편의)" 인데, critique 서브에이전트는 "본질(독립성 자체가 산출물)" — 범주가 달라 강제가 정당.
- prd 인터뷰가 기능 중심이라 '제약/규제' 슬롯이 없던 게 규제 누락(#2·#3)의 뿌리 → prevention 슬롯 추가로 한 단계 위에서 차단.
- "분리 = 컨텍스트 분리이지 모델 분리 아님"(동일 Opus self-bias 잔존) — 비평 도구가 자기 한계를 숨기면 안 됨(정직성 NFR5).

## 🚧 이월 항목

- **디자인층 critique** (design.md·ui-rules 대비비·금지 UI) → design 완료 후 별도 spec. 추후 본 critique 와 병합 가능.
- **가치-recall 자동 eval 하니스** (golden fixture 를 주기 실행) → 별도 검토.
- gd-plan PRD 출력에 Acceptance Criteria·Edge Case 섹션 추가(GPT 제안) → 별도 개선 후보.

## 🔗 관련 문서 (Related)
- 관련 ADR: `[[ADR-012]]` (review 구조 검증 토대) · 신규 후보 3종(머지 시)
- 사전 비평: `critique.md` · 코드리뷰: `code-review.md`

## 📅 메타

| 항목 | 값 |
|---|---|
| **작성자** | Agent + evan |
| **작성 기간** | 2026-06-08 ~ 2026-06-09 |
| **최종 commit** | `7dae97f` |
