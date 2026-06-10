# Spec Critique: spec-01-03

> 독립 Opus 서브에이전트 비판 (2026-06-04). Plan Accept 전 검증.

## 1. 유사 기법 조사
- **Nygard/lightweight ADR**: 순차 번호 + README 인덱스 + 불변(append, status만 변경). → 결정 로그에 ID·supersede 차용 가능.
- **log4brains / adr-tools**: docs-as-code, 스크립트로 번호 자동부여·supersede 링크를 **결정론적**으로 보장 — markdown 지시문은 이걸 LLM 순응에 의존.
- **AI-native logging (TianPan)**: "I/O 말고 결정+기각대안+근거를 로깅" → 본 spec의 typed 표(결정|선택지|탈락|이유)와 정합.
- **대화→구조화 추출 연구**: LLM은 *명시적* 결정은 잘 뽑고 암묵적은 놓침 → "fork만 자동, 나머지 수동"은 합리적.

### 시사점
markdown 지시문은 결정론이 없다(긴 세션 후반 누락·중복). 모범사례 = (a) 지시문을 짧은 단일 행동으로, (b) 검증가능 형식(typed 표)으로 강제, (c) 결정론 검증은 별도 단계(spec-1-04 set-diff). 본 spec은 (b)는 잘함, (a)에서 **5개 스킬에 규칙 분산**이 일관성 리스크.

## 2. 요구사항 비판

### 누락 (★ = 치명적)
- **★ 결정 행에 ID·CAP/PAGE 연결 열 없음**: ADR-008 목표가 "role→CAP→PAGE→FLOW 기계가독"인데 결정 1행이 어느 `[CAP]`/`[PAGE]`에 매이는 열이 없다 → spec-1-04 set-diff(누수 B 전파)가 파싱 불가. **가장 치명적**.
- **결정 ID/번호 부재**: 참조·supersede 지목·set-diff 식별 키 없음.
- **supersede(재방문) 미정의**: design 재픽·rules 재계산·page 재호출 시 결정이 *바뀌면*? 무시=박제, 덮어쓰기=이력 소실. ADR 불변(append+status) 따를지 결정 필요.
- **"이유" 미입력 처리 없음**: fork만 고르고 이유 안 주면 빈칸/추론/되묻기? 이유 비면 로그 존재이유 소멸.
- **"동일 결정 키" 정의 없음**: 멱등 핵심인데 무엇이 같은 결정인지 미정 → 멱등이 LLM 기분에 좌우.
- **수동 보강 트리거 기준 없음**: 언제 "남길까요?" 제안하나 → 과잉/사문화.
- decisions.md 정렬·중복 정책 미정.

### 모순 (실재 버그)
- **경로 불일치**: spec/plan은 `docs/pages/[PAGE]/decisions.md`, ADR-008·템플릿 주석은 `pages/[PAGE]/decisions.md`. 실제 출력은 `docs/pages/`(gd-plan-page §1 기준)가 맞음 → **ADR-008·템플릿 주석의 `pages/` 표기를 `docs/pages/`로 통일** 필요.
- ADR 번호 표기 혼용(slug vs ADR-011) — 통일.

### 과잉 설계
- 오히려 under-spec. 굳이 꼽으면 FR3 수동보강을 5개 스킬 전부에 = 실효 낮고 일관성만 깨짐(축소 권장).

### 모호함
- typed 4열이 항상 차나(이유 의존). "중요한 일회성" 기준 없음.
- **테스트 신뢰 한계**: plan 테스트는 스킬 본문에 문자열 존재만 검증 → *실제 1행 생성*은 검증 불가(markdown 지시문 본질). DoD에 명시 필요.

## 3. 대안 제안
- **A (현 spec)**: 5개 스킬 중복 삽입 — 자기완결 ✓ / DRY 위반·5곳 drift ✗. **비권장**.
- **B (권장)**: 규칙 정본 1곳(ADR-011 또는 템플릿 규칙 블록 SSOT) + 5개 스킬은 짧은 참조 + 자기 fork 목록만. 변경 시 1곳, cap 유리. gd-plan은 항상 패키지 템플릿 로드라 참조 OK.
- **C**: 이번 spec 핵심을 "ID+연결 열 + 이유처리 + supersede" 스키마 확정으로 재정의(트리거는 부차).

## 권장안
**B + C 결합**:
1. typed 표를 **`ID | 결정 | 선택지 | 탈락 | 이유 | 연결([CAP]/[PAGE])`** 로 확장 + 순차 ID(D-01…) + 이유 미입력 처리(1회 되묻기→`<!-- TODO -->`) + supersede(append+status, 불변).
2. 규칙을 **단일 정본**(ADR-011 + 템플릿 규칙 블록)에 두고 5개 스킬은 짧은 참조 + fork 목록.
3. **경로 `docs/pages/`로 통일**(ADR-008·템플릿 주석 정정).
4. FR3 수동보강 → **page·prd 2개로 축소**.
5. DoD에 "테스트=문자열 존재만, 실제 행 생성은 지시문 신뢰" 한계 명시. 가능하면 정본 규칙 블록 형식(열 개수/ID 패턴)을 templates-v2 정규식 검증.

현 spec(A) 유지는 비권장.

## 4. ADR 후보
- **ADR-011 `decision-log-auto-trigger` (convention)** — 유지하되 (a)트리거 (b)typed 스키마+ID+연결 열 (c)supersede 정책 (d)동일키 정의 (e)이유 미입력 처리 (f)정본 위치를 모두 포함. 정본 역할.
- typed 표에 ID/연결 열 추가 = ADR-008 형식 *변경* → 별도 ADR보다 **ADR-011에 흡수** 권장(형식과 채우는 법은 불가분).

## 출처
- adr.github.io / log4brains / Nygard ADR / AI-native logging(TianPan) / LLM 대화 추출 연구(arXiv)
