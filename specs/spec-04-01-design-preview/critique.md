# Spec Critique: spec-04-01

> 독립 Opus 서브에이전트 비판. 메인이 채택분만 spec.md에 반영.

## 1. 유사 기법 조사
- **Style Tiles (Samantha Warren)**: 폰트·색·UI 요소로 브랜드 본질 전달, 무드보드와 컴프의 중간. 이 spec의 "3 무드 스와치"는 사실상 후보별 Style Tile 자동 생성 — 검증된 방법론과 정합(강점). 원조는 수작업, 여기선 LLM 추출.
- **Style Dictionary / 토큰 비주얼라이저**: 업계 표준은 구조화 토큰(JSON) 먼저 → 시각화. 이 spec은 산문 런타임 추출(반대). 단 각 .md의 §9 Quick Color Reference가 이미 반구조화 블록인데 미활용.
- **LLM 비결정성**: "결정적" 설정에서도 출력 변동, run 간 정확도 ±15%까지. 멱등=경로 덮어쓰기일 뿐 콘텐츠 재현성 미보장.

### 시사점
방법론은 정합하나 (1) §9 블록 앵커링으로 정확도·재현성↑, (2) "동일 후보=동일 프리뷰" 미보장을 명시 필요.

## 2. 요구사항 비판
### 누락
- **재현성 규약 부재**: LLM 비결정성 → 재생성마다 다른 HTML. 골든/허용변동 정의 없음.
- **프리뷰 편향(치명, spec은 추출정확도만 인지)**: 오픈소스 폰트(Cal Sans/Inter)는 CDN 진짜 렌더, 독점(SF Pro/Cereal)은 폴백 → 오픈소스 시스템이 더 완성도 있어 보여 **픽 쏠림**. 배너는 인지적 완화일 뿐 시각 편향 미차단.
- **부분 렌더 규약 부재**: hex 미발견 시·카드 최소 토큰셋·빈 칩 표기 규칙 없음.
- **토큰 주입 안전성**: .md 값을 CSS 값으로만 취급(임의 마크업 아님)한다는 규약 없음.
- **대비/가독성**: 스와치 자체가 읽혀야(밝은 surface+밝은 text 금지) 규약 없음.
- **산출물 git 정책**: `_design-preview.html` 커밋/gitignore 불명.
- **열람 방식**: node-free·크로스플랫폼이라 auto-open 불가 → 수동 명시 필요.
### 모순
- **"오프라인 가능" ↔ "Google Fonts CDN 시도"**: CDN은 네트워크 필요. 비차단 우아한 폴백 명시 필요.
- **Out of Scope "구조화 추출 거부(node 불필요)" ↔ 실제 .md**: §9 블록을 *읽는* 건 node 불필요. "구조화=빌드필요" 전제가 잘못 묶임.
### 과잉 설계
- 버튼+카드 둘 다는 중복 — 팔레트+헤딩 specimen+버튼 1개면 충분.
- CDN 폰트 시도는 오픈소스에만 이득 → 편향 키움. "전부 폴백+폰트명 라벨"이 더 단순·공정.
### 모호함
- primary/surface/text/accent 매핑 규칙 없음 → §9 Quick Color Reference를 정본 추출원으로 지정하면 해소.
- shadow(cal 11개 중 어느 것?)·radius(범위 중 버튼/카드 값?) 미지정 → workhorse/표준값 지정.
- 정직 배너가 "SF Pro 등" 하드코딩 → 후보의 독점 폰트만 동적 나열.

## 3. 대안 제안
### 대안 A: 런타임 LLM HTML 생성 (현행)
- 장점: node-free·빌드 0, 무한 적응. 단점: 비결정성, 추출 편차, 독점폰트 시각 편향, 토큰 비용.
### 대안 B: 빌드타임 사전 생성 동봉
- 장점: 완전 결정적·충실, 오프라인 완전, 런타임 변동 0. 단점: 66 아티팩트 유지·용량, stale, 빌드 툴링.
### 대안 C: 사전 렌더 fragment + 런타임 결합 (하이브리드) — 권장
- 아이디어: dev 빌드로 66개 미니 스와치 HTML fragment 사전 생성(`build-index` 선례), 런타임엔 픽된 3개 fragment 읽어 붙이기(node-free).
- 장점: 결정적·충실 + 런타임 node-free + 편향 제거(빌드 시 일관 통제). `build-index` 선례 존재.
- 단점: 66 fragment 빌드 단계(dev-side, 소비자 무영향), .md 변경 시 재빌드.
### 대안 D: 터미널 ASCII 팔레트 — 보조 수단 가치, 타이포/shadow 전달 불가.

## 권장안
**1순위 대안 C(하이브리드)** — `pnpm build-index`가 "dev 빌드 + 소비자 node-free"를 이미 입증, "build-swatches" 추가는 자연스럽고 비결정성·폰트 편향 두 약점 동시 제거.
**현행 A 유지 시 최소 4 하드닝 필수**: ① 추출원 §9 Quick Color Reference 앵커링, ② 균일 폴백 폰트+폰트명 라벨(CDN 차등 폐지), ③ 부분 렌더 구체 규약(shadow=workhorse/radius=표준), ④ CDN 비차단 오프라인 폴백 + git 정책 + 수동 열람 명시.

## 4. ADR 후보 추출
- [x] 후보 발견: **ADR-019** "디자인 프리뷰 생성 방식 = 런타임 LLM vs 빌드타임 fragment, node-free — 결정성/충실도 ↔ 단순성 tradeoff" (type: tradeoff/convention). phase-04 결정표가 이미 "시각화=로컬 프리뷰"를 결정으로 올렸고, cross-spec 재사용될 `docs/_*.html` 생성 컨벤션 + USP 직결 tradeoff. (ADR-018은 spec-04-02 외부 ref용 별개.)
