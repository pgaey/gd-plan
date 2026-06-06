# Spec Critique: spec-01-04

> Opus 독립 서브에이전트 비판 (2026-06-06). Plan Accept 전 검증.

## 1. 유사 기법 조사

### 발견된 패턴/도구
- **Derived/computed field (SSOT + 단방향 파생)**: 한 원천에서 다른 필드를 계산해 채우는 패턴. DB generated column, 스프레드시트 수식 셀이 전형. — 비교: FR1 의 "flow steps = 단일 원천 → page `flows:` = 파생" 이 정확히 이 패턴. 다만 DB generated column 은 *읽을 때마다* 재계산되어 drift 가 원천적으로 불가능한 반면, 본 spec 은 LLM 이 *쓰기 시점에 merge* 하는 materialized 방식이라 재실행 사이 drift 가 가능 → review drift 체크(FR4)로 사후 탐지. 즉 "파생 강제"가 아니라 "파생 후 어긋남을 잡는" 보정 루프.
- **Bidirectional link / backlink (Obsidian, Roam, Docusaurus)**: A→B 링크 시 B 에 backlink 자동 표시. — 비교: FR1 이 이 backref. 단 Obsidian 은 *인덱스 시 동적 도출*(원본 미수정)인데, 본 spec 은 backref 를 *대상 frontmatter 에 물리 기록* → grep/set-diff 검증 가능하나 원천 삭제 시 stale GC 문제를 떠안음.
- **Referential integrity / FK (set-diff 검증)**: 자식 FK 가 부모에 실재하나 검사. — 비교: FR5(결정 `연결`=`[CAP]/[PAGE]` 실재) + FR4(page `flows:` ↔ flow step) = FK 무결성. 차이: DB 는 결정적 엔진인데 본 spec 은 "LLM 수준 set-diff" — 재현성 미보장.
- **docs-as-code link checking (remark-lint, markdown-link-check, lychee)**: 빌드 스텝에서 참조 깨짐 결정적 검사. — 비교: 본 spec 을 *코드로* 하면 이것. 의도적으로 v2 연기(review §7). "set-diff 는 본질적으로 결정적 코드 문제"라는 업계 신호(→ 대안 B).
- **Astro content collections / Docusaurus sidebar autogen**: ADR-010 이 이미 인용한 선례("디렉토리=진실, 인덱스=파생"). — 비교: ADR-010 은 sitemap↔pages 축, FR1 은 *같은 원리를 flows 축에 적용*. 새 발명이 아니라 기존 invariant 의 두 번째 인스턴스(→ ADR 후보 핵심).

### 시사점
4개 FR 모두 정립된 패턴(SSOT 파생, backlink, FK 무결성, link-check)의 변형 — 방향은 건전. 단 셋 다 *결정적 엔진*이 정석인 영역을 *LLM 지시문*으로 근사. markdown 도구 전제에선 v1 으로 합리적이나, "drift 0"·"멱등"·"set-diff" 단어가 결정적 보장을 암시하는데 실제론 LLM 순응 의존이라는 간극이 잠재.

## 2. 요구사항 비판

### 누락
- **원천 삭제/변경 시 파생 GC**: flow step 에서 `@[PAGE-A]` 제거 또는 flow 삭제 시 page-A `flows:` 의 stale `[FLOW-x]` 를 누가 지우나? FR1 은 merge(추가)만 정의, 철회(retract) 미정의 → add-only 면 단조 증가. FR4 가 BLOCK 으로 잡지만 "잡기"≠"고치기", 손수정은 ADR-012 "손편집 금지"와 충돌.
- **ADR-010 과 `flows` 필드 SoT 충돌 미명시**: ADR-010="page frontmatter=진실, `/gd-plan-page` 가 씀". FR1 은 `/gd-plan-flows` 가 *같은 frontmatter 의 `flows:`* 를 씀 → 한 블록에 작성자 둘. ADR-012 가 이 예외를 명문화해야 함.
- **FLOW slug 정규화 부재**: FR4 drift 체크는 `[FLOW-slug]` ↔ `@[PAGE-slug]` 문자열 비교. ADR-009 는 PAGE 만 정규화. `[FLOW-Booking]` vs `[FLOW-booking]` 변이가 set-diff 를 깸.
- **정렬/순서 규칙 부재**: 멱등 merge 시 `flows:` 배열 순서 미정 → LLM 이 순서를 바꾸면 git diff 매번 발생, 텍스트 수준 멱등 깨짐. "ID 사전순" 같은 규칙 필요.
- **review 재현성 메커니즘 부재**: §2 "재현 가능" 표방하나 FR5 가 LLM 수준이라 동일입력 동일출력 미보장. "출력=정렬된 ID 리스트 고정, 근거 파일:줄 인용 강제" 보강 필요.

### 모순
- **"손편집 금지" ↔ drift 수정 주체 부재**: ADR-012 가 손편집 금지하는데 FR1 이 retract 안 하면 stale 고칠 합법 경로 없음. → FR1 을 full re-derive(전수 스캔 재계산 덮어쓰기)로 정의하면 merge+retract 동시 해결, 모순 소멸(→ 대안 A).
- **템플릿 주석 ADR 번호 불일치**: `templates/pages/structure.md:5` 주석 "(→ **ADR-009** 예정)" 인데 본 spec 은 **ADR-012**. ADR-009 는 이미 slug 정규화 점유. 이 주석 수정이 plan Proposed Changes/Task 어디에도 **없음** → 약속-구현 drift 채로 출고.

### 과잉 설계
- 해당 없음. Out of Scope(결정적 lint·wording·staleness·죽은 템플릿·src 전부 v2/제외)가 적절히 좁음. 범위를 안 늘린 절제가 강점.

### 모호함
- **"merge" 시맨틱**: add-only 인지 re-derive 인지 불명(spec/plan/task 표현 모두 양쪽으로 읽힘).
- **"drift 0"**: (a)실행 내 전파 완전성 (b)재실행 간 불변 (c)집합 항등 — 셋이 다른 보장.
- **"LLM 수준 set-diff"**: 무엇을 "통과"로 볼지(거짓음/양성 허용) 미정. 단위 테스트는 지시문 문자열만 검증 → 판정 정확성은 phase 통합(수동) 의존. "set-diff" 대신 "LLM 무결성 점검" 이 기대치 정직.

## 3. 대안 제안

### 대안 A: full re-derive (merge → 재계산 덮어쓰기)
- **아이디어**: `/gd-plan-flows` 종료 시 전체 flow 스캔해 각 page `flows:` 를 `sort({ FLOW | page ∈ FLOW.steps })` 로 통째 재계산·덮어쓰기. 부분 merge 가 아닌 멱등 함수.
- **장점**: GC/stale·retract·정렬·"손편집 금지↔수정주체" 모순을 한 번에 제거. "drift 0" 이 정의대로 성립(정규형 수렴), 멱등이 집합·텍스트 양쪽 성립.
- **단점**: 사용자 임시 손편집도 무조건 덮음(단 ADR-012 가 이미 금지 → 실질 무해). 전수 스캔으로 지시문 약간 길어짐. 부분 실행 시 git diff 범위 넓어질 여지.

### 대안 B: 결정적 도출/검증을 코드로 (build step / `src/`)
- **아이디어**: flow 파싱→page `flows:` 재계산 + FR4/FR5 set-diff 를 `src/` 결정적 스크립트(`gd-cli sync-flows`/`lint`)로. 스킬은 호출만 지시.
- **장점**: drift 0·멱등·set-diff 진짜 결정적 보장, 재현성 100%, 도출/판정 로직 자체를 단위 테스트.
- **단점**: 본 spec Out of Scope(src 미변경)와 정면 충돌, 범위·일정 대폭↑. markdown 도구 정체성 이탈. → v1 과함, v2 정당한 진화.

### 대안 C: backref 를 frontmatter 에 안 쓰고 인덱스로 도출 (Obsidian 식)
- **아이디어**: page `flows:` 필드 제거, review/sitemap 이 flow 스캔해 동적 계산.
- **장점**: drift 원천 불가, GC/정렬/멱등 소멸, FR1 불필요.
- **단점**: spec-01-01/03 이 frontmatter `flows:` 를 ID 스파인(ADR-008)으로 박음 — 되돌리면 4개 spec 결정 뒤집는 대공사, set-diff 조인키 전제 붕괴. 비현실적.

## 권장안
**현재 spec 유지 + 대안 A 흡수.** 방향(LLM 지시문 레이어, set-diff v2 연기)은 옳다. 단 FR1 "merge" → **full re-derive(정렬된 재계산 덮어쓰기)** 로 재정의. 이 한 수정이 누락(GC·정렬)·모순(손편집↔수정주체)·모호함("merge"·"drift 0"·멱등)을 동시 해소하며 범위도 안 침범. 대안 B 는 v2 목적지로 review §7 유지. "set-diff" 가 결정적 보장 아님을 표현에 정직 반영. 추가로 **`templates/pages/structure.md:5` 주석 "ADR-009 예정"→"ADR-012"** 수정 task 필수(현 약속-구현 drift).

## 4. ADR 후보 추출
- [x] **후보 타당 (관계 명시 필요)**: `flows-reverse-derivation` — type: **invariant** (ADR-012) — cross-spec(성공기준4·FR4)·long-lived SoT 불변이라 invariant 정확. 단 ADR-010(invariant, "디렉토리=진실, 인덱스=파생")의 *두 번째 인스턴스*이자 ADR-010 "page frontmatter 단일 작성자" 가정을 **flows 필드에 한해 flows 스킬로 좁히는** 관계. ADR-012 본문에 (a)ADR-010 인스턴스임 (b)`flows` 필드만 flows 스킬 SoT 예외임을 명문화해야 SoT 충돌 회피.
- [ ] **추가 후보 — 채택 안 함**: 대안 A 의 "재계산=정규형" 은 ADR-012 invariant 에 흡수 가능. FR5 의 v2 연기는 ADR-003·review §7 에 이미 귀속 → 신규 ADR 불요.
- [ ] **반-ADR 메모**: "merge add-only" 유지 시 retract/GC 정책이 별도 ADR 후보가 되지만, 대안 A 채택 시 그 결정 자체가 소멸 → ADR 수 안 늘림.
