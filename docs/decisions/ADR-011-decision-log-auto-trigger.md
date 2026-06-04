---
id: ADR-011
type: convention
date: 2026-06-04
status: accepted
---

# ADR-011: 결정 로그 자동 트리거 + typed 6열 스키마 (정본)

> spec-01-03. ADR-008(결정 로그 2층·형식)의 *채우는 법*을 확정하는 정본. 트리거·스키마·supersede·멱등 규칙은 이 문서와 `templates/decisions.md` 규칙 블록 **2곳에만** 있고, 인터뷰 스킬 5종은 짧은 참조만 둔다(DRY).

## 📚 Context

ADR-008 이 결정 로그 2층(전역 `docs/decisions.md` + 페이지 `docs/pages/[PAGE]/decisions.md`)과 typed 표 *형식*을 확정했으나, **무엇이 한 행이 되는지**(트리거), **행이 어떤 모양인지**(ID·연결 열), 결정이 *바뀔* 때 처리(supersede)가 비어 있었다. 그 결과 (1) 결정 이유가 휘발되고, (2) 4열 표(`결정|선택지|탈락|이유`)에는 결정이 어느 `[CAP]`/`[PAGE]` 에 매이는 키가 없어 spec-1-04 set-diff(누수 B 전파 검증)가 파싱할 대상이 없었다. 초안(안 A)은 규칙을 5개 스킬에 중복 삽입해 DRY 를 깨뜨렸다.

## 🎯 Decision

결정 로그의 **정본 규칙**을 다음 6항으로 확정한다. 정본 소재는 이 ADR + `templates/decisions.md`·`templates/pages/decisions.md` 의 규칙 블록뿐이며, 인터뷰 스킬은 이를 *참조*만 한다.

**(1) 트리거** — 인터뷰가 복수선택(fork)을 제시하고 사용자가 하나를 고른 순간 = 자동 1행 append. fork 밖 중요한 일회성 결정은 **`gd-plan-page`·`gd-plan-prd` 에서만** 에이전트가 "남길까요?" 제안 후 기록(수동 보강, 강제 아님).

**(2) typed 6열 스키마** — `| ID | 결정 | 선택지 | 탈락 | 이유 | 연결 |`
- `ID`: `D-01` 부터 **파일별** 순차(전역 `decisions.md` 와 각 페이지 `decisions.md` 가 독립 카운터). 부여 후 불변.
- `결정`: 무엇을 정했나(멱등 키).
- `선택지`: 제시된 fork 후보. `탈락`: 안 고른 후보. `이유`: 왜.
- `연결`: 매이는 대상 — 전역 결정은 `[CAP-..]`, 페이지 결정은 `[PAGE-..]`/섹션명. 없으면 `-`. **이 열이 set-diff 의 조인 키**(ADR-008 ID 스파인).
- 대화 트랜스크립트 금지 — *결정 + 탈락지 + 이유*만.

**(3) supersede(재방문)** — 이미 적힌 결정이 *뒤집히면* (재픽·재계산) 행을 **고치거나 지우지 않는다**(불변). 새 행을 append(새 ID)하고, 옛 행의 `ID` 셀을 `~~D-01~~` 로 긋고 `연결` 셀 끝에 `→D-05` 를 덧붙인다(append + inline status). 이력 보존.

**(4) 동일키 멱등** — 멱등 키 = `결정` 열 텍스트. 동일 결정이 이미 있으면 재기록 안 함. (값이 바뀐 경우만 (3) supersede.)

**(5) 이유 미입력 처리** — fork 만 고르고 이유를 안 주면 에이전트가 **1회 되묻는다**. 그래도 없으면 `이유` 셀에 `<!-- TODO: 이유 -->` 를 넣고 **행은 남긴다**(행 누락 금지 — 빈 이유라도 결정·탈락은 기록 가치).

**(6) 정본 위치** — 본 ADR + 두 템플릿 규칙 블록이 SSOT. 스킬 5종(prd·design·sitemap·page·rules)은 "fork 선택 시 `<위치>/decisions.md` 1행 — 규칙은 헤더/ADR-011 참조" 한 줄 + 자기 fork 목록만 갖는다.

## 📊 Consequences

- **긍정**: 결정이 `[CAP]`/`[PAGE]` 에 기계가독으로 매여 spec-1-04 set-diff 토대 확보. 규칙 1곳 수정(5곳 drift 제거). 재방문 이력 보존.
- **부정**: 6열로 표가 넓어져 작성 부담 소폭 증가. supersede 표기가 markdown 수기 규칙이라 지시문 순응에 의존(결정적 강제는 spec-1-04).
- **중립**: ADR-008 형식의 *확장*이므로 별도 ADR 가 아니라 011 에 흡수(형식과 채우는 법은 불가분).

## 🔀 Alternatives

- **안 A — 5개 스킬에 규칙 중복**: 자기완결 ✓ 이나 DRY 위반, 한 곳 수정 시 5곳 drift — 비채택.
- **status 7번째 열로 supersede**: 명시적이나 표가 더 넓어지고 대부분 행에서 빈칸 — 비채택. inline status(ID 취소선)로 충분.
- **덮어쓰기 supersede**: 이력 소실 — 비채택(ADR 불변 원칙).
- **이유 없으면 행 누락**: 결정·탈락 정보까지 버림 — 비채택(TODO 마커로 보존).

## 📌 Status

Accepted (2026-06-04, spec-01-03). 첫 사용자: `templates/decisions.md`, `templates/pages/decisions.md`, 인터뷰 스킬 5종(`plans/gd-plan-*.md`).

## 🔗 Related

- ADR-008 (결정 로그 2층·ID 스파인 — 본 ADR 이 채우는 법을 확정)
- spec-01-03 (본 결정), spec-1-04 (set-diff — `연결` 열 소비자)
- `specs/spec-01-03-decision-log-auto/critique.md` (B+C 권장 근거)
