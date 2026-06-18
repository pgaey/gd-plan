# Walkthrough: spec-04-01

> 결정 과정, 사용자 협의, 검증 결과 기록.

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| 생성 방식 | 런타임 LLM(A) / 빌드타임 fragment(C) | **C** | 결정성 + 폰트 편향 제거(critique), `build-index` 선례. ADR-019 |
| 폰트 | 실제 렌더(CDN) / 이름 라벨+균일 폴백 | **이름 라벨+균일 폴백** | 독점/오픈소스 차등 렌더가 픽 왜곡 → 공정성 |
| 팔레트 추출원 | 산문 자유 / §9 Quick Color Reference | **§9 블록** | 규칙적 → 결정적 파싱(critique) |
| shadow 추출 | `[^)]*` / 균형 캡처 | **균형 캡처(1단 중첩)** | 멀티레이어 rgba 중첩 괄호로 깨진 CSS 방지(버그 수정) |
| 컴포넌트 | 버튼+카드 / 버튼만 | **버튼만** | YAGNI(critique) — 톤 비교엔 팔레트+specimen+버튼 충분 |

## 💬 사용자 협의

- **주제**: 디자인 시스템을 글로만 보면 톤을 모름 → 실제로 보이게
  - **합의**: 로컬 프리뷰 HTML, 3후보 무드 스와치 비교. critique 후 **빌드타임 fragment(C)**로 전환.
- **Spec Critique(독립 Opus) 반영**: 폰트 편향(균일 폴백), §9 앵커링, 부분 렌더·안전(HTML 이스케이프), CDN 비차단/git 권고/수동 열람, ADR-019.

## 🧪 검증 결과

### 자동화 테스트
- **명령**: `pnpm test` / `pnpm typecheck` / `bash test/sh/run.sh`
- **결과**: ✅ vitest 76 PASS / typecheck 0 / shell 5 suites PASS
- TDD: build-swatches 단위 테스트 Red→Green. shadow 중첩 괄호 버그를 테스트로 잡고 균형 캡처로 수정.

### 통합/E2E (phase 시나리오 1 선검증)
1. **분배**: install.sh가 `_swatches/`(하위 디렉토리)를 누락하던 버그 발견 → `find -type f` 복사로 수정 → 재설치 시 66개 동봉 확인.
2. **결합**: 후보 3개(cal/stripe/linear) fragment → `docs/_design-preview.html` 결합. 팔레트 시스템별 상이(cal #242424 / stripe #533afd / linear #5e6ad2).
3. **결정성**: `build-swatches` 2회 출력 byte-동일.

### 수동 검증 한계
- 실제 소비자 세션에서 `/gd-plan-design`이 자동으로 프리뷰를 생성하는 흐름은 별도 세션 필요 — 규약 전파(grep) + 수동 결합 E2E로 대체 검증.

## 🔍 발견 사항

- **install.sh 분배 버그**(기존): 컬렉션 복사 루프가 top-level 파일만 복사해 하위 디렉토리를 누락. `_swatches/` 도입으로 표면화 → `find -type f`로 수정(templates 섹션과 동일 패턴). 향후 컬렉션 하위 디렉토리 추가 시에도 안전.
- shadow 멀티레이어의 중첩 rgba 괄호는 단순 `[^)]*` 정규식을 깨뜨림 → 균형 캡처 필요.

## 🚧 이월 항목 (Optional)

- 외부 ref = 베이스+오버라이드 (ADR-018) → spec-04-02.
- radius/shadow 추출 정밀화(현 best-effort) → 필요 시 후속.
