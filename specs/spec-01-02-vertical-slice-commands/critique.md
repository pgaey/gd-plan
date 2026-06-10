# Spec Critique: spec-01-02

> 독립 Opus 서브에이전트 비판 (2026-06-04). Plan Accept 전 검증.

## 1. 유사 기법 조사

### 발견된 패턴/도구
- **Astro Content Collections (entry-per-folder)**: 자산 많은 엔트리는 폴더+`index.md`. — 비교: `pages/[PAGE-slug]/structure.md`와 동형. 단 Astro는 인덱스를 **자동 합성**(디렉토리=진실), gd-plan은 `sitemap.md`를 마커로 **명시 동기화** → drift 여지가 구조적으로 존재.
- **Docusaurus `_category_.json` + sidebar autogen**: 폴더=노드, 메타는 폴더 로컬. — `parent` frontmatter(ADR-007)와 같은 철학. gd-plan은 아직 합성 단계 없음.
- **Terraform deprecation (warn→remove, MAJOR-only)**: 소비자가 있을 때만 정당. — gd-plan 미출시·소비자0 → 단계적 deprecation 근거 없음 → "완전 제거" 판단은 정합.
- **monorepo per-package + 루트 매니페스트**: 매니페스트↔디렉토리 불일치를 lint로 잡음 → "sitemap 행 ↔ page dir" 정합성 점검 필요 시사.

### 시사점
업계 합의 = **"디렉토리가 진실, 인덱스는 파생"**. gd-plan은 sitemap을 손동기화 → drift 위험 내재. 최소한 **sitemap↔pages 정합성 자가점검**(고아 dir/유령 행)은 빠지면 안 됨. 미출시 그린필드의 완전제거는 외부 사례로 뒷받침됨(옳음).

## 2. 요구사항 비판

### 누락
- **sitemap↔pages 정합성 점검**: FR1은 CAP 커버리지만 봄. 유령 행/고아 dir을 누가 잡는지 미정의 (손동기화 핵심 실패 모드).
- **slug ↔ PAGE-id 매핑 규칙**: 정규화(대소문자/한글/공백/복합어/중복 재호출) 미정의. `/gd-plan-page Home` vs `home`?
- **인자 검증/잘못된 호출**: 인자 누락, 로스터에 없는 slug, sitemap 없이 page 호출 차단 여부 미정의.
- **start N/5 진행률 붕괴**: structure.md 사라지면 3번 슬롯 판정·분모 재정의 필요(페이지 0=미작성, 일부=초안, 전부 done=완료).
- **flows의 dangling 차단 메시지**: (검증됨) `gd-plan-flows.md:22`가 "먼저 /gd-plan-structure" 로 하드 차단 → 죽은 명령 가리킴. 1줄 갱신은 본 spec에 흡수 타당.

### 모순
- **cap 예외 page 선등록**: NFR2 "structure/review와 동일(600)" vs plan "(필요 시)" → 확정/조건부 충돌. 근거 없는 선예외.
- **covers 중복 진실**: structure.md frontmatter `covers` vs sitemap 로스터 `covers` — 누가 진실인지 미정의(drift 2번째 소스).

### 과잉 설계
- 해당 없음(오히려 적게 함). 단 page 길이예외 선등록은 YAGNI.

### 모호함
- **"interim 깨짐" 범위**: 깨지는 지점 = ①flows 자동로딩 structure.md ②flows 하드 차단 메시지 ③rules 컨텍스트표 ④review BLOCK 3규칙. "경고"인지 "실행 실패"인지, interim에 flows/review 돌려도 되는지 DoD 경계 필요.
- **decisions.md "골격만"**: 템플릿 복사인지/표 빈 채인지/일부 채움인지 불명 → "헤더만, 행0"으로 1-03 경계 명시.
- **멱등 "기존 페이지 보존"**: 통째 skip / frontmatter 보존+상태만 / 누락 섹션만 보강 중 무엇인지.

## 3. 대안 제안

### 대안 A: 현재 spec 유지(완전 제거) + 누락 5종 보강
- 장점: 미출시·소비자0에 가장 정직, deprecation 비용0, interim 최단.
- 단점: 보강 없이는 interim에 flows/review가 죽은 참조를 가리켜 막다른 길.

### 대안 B: structure를 thin orchestrator로 잔존
- 장점: interim 깨짐 0, N/5·머슬메모리 유지.
- 단점: ADR-006/007 전환 의도와 어긋나는 잔존물, "완전 제거" 결정과 상충, 죽은 코드 한 겹.

### 대안 C: 1-04 경로갱신을 본 spec으로 흡수("참조까지 한 번에")
- 장점: 어느 시점에도 일관, interim 개념 소멸.
- 단점: spec 비대(right-size 위반 소지), 자동역참조(1-04 핵심)와 단순 경로갱신 분리선이 미묘.

## 권장안
**대안 A + 대안 C의 최소 조각**. 완전 제거는 옳다(B 비채택). 단 interim 막다른 길 2지점 — ①flows 하드 차단 메시지 ②start N/5 — 은 1~2줄 비용/큰 피해라 본 spec 흡수. flows 경로·역참조 로직 전체는 1-04 유지. + 누락 5종(정합성 점검, slug 규칙, 인자/선행 차단, decisions "헤더만 행0", 멱등 의미) FR 명문화 후 Plan Accept.

## 4. ADR 후보 추출
- [x] 후보 발견 — 2건 (ADR-006/007이 *답하지 않은* 운영 결정이 여기서 처음 굳음):
  1. **type: convention — slug ↔ PAGE-id 정규화 규칙**. slug=디렉토리명=식별자 스파인 → 한 번 정하면 모든 페이지·flows·review BLOCK이 의존하는 장기 불변.
  2. **type: invariant — sitemap 로스터 ↔ pages 디렉토리 정합성(단일 진실 방향)**. 외부 사례(디렉토리=진실)와 갈리는 핵심 설계 불변. drift 정책 근거.

## 출처
- Astro Content Collections / Docusaurus·MkDocs sidebar autogen / Terraform deprecations(warn→remove) / monorepo 매니페스트 lint
