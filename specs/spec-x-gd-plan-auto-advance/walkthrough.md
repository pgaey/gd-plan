# Walkthrough: spec-x-gd-plan-auto-advance

> 결정 과정, 사용자 협의, 검증 결과를 미래의 자신과 리뷰어에게 남깁니다.

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| 자동화 수준 | 확인 후 자동 / 완전 자동 / 오케스트레이터 커맨드 | **확인 후 자동(confirm-then-advance)** | 마찰 제거 + 체크포인트 유지 균형 |
| 메커니즘 | 각 §종료 인라인(A) / 공유 규약 파일(B) | **A 인라인** | 소비자에 공유 CLAUDE fragment 미설치 + 슬래시 커맨드 개별 로드 특성 |
| prd→critique 분기 | 3지선다 / 예-아니오 | **예/아니오** (아니오 시 design 안내) | 사용자 요청 — 단순화 |
| page 반복 | 다음 1개만 제안 / 모두 done 시 flows 자동 제안 | **페이지 루프 후 flows** | 페이지 단위 확인 유지 + 소진 시 다음 큰 단계로 |
| review 전이 | 자동 진행 / 게이트 | **게이트(자동 진행 금지)** | BLOCK 의미 보존 — 검증 게이트는 자동 통과 불가 |
| 검증 훅 | 텍스트만 / greppable 마커 | **`<!-- gd:advance next=X -->`** | 9개 파일 일관성을 shell 테스트로 강제 |

## 💬 사용자 협의

- **주제**: 매 단계마다 다음 슬래시 커맨드를 직접 타이핑하는 마찰
  - **합의**: 확인 후 자동 진행. 긍정 한 마디면 다음 단계 커맨드를 읽어 이어 실행, 부정/모호면 정지.
- **주제**: prd→critique 분기 형태
  - **합의**: 단순 예/아니오. 아니오면 정지 + "건너뛰려면 `/gd-plan-design`" 안내.

## 🧪 검증 결과

### 자동화 테스트
- **명령**: `bash test/sh/run.sh`
- **결과**: ✅ Passed (3 suites)
```text
✓ test-auto-advance.sh   (9개 마커 전이표 일치: start=auto … review=gate)
✓ test-gd.sh
✓ test-get.sh
shell tests: 3 passed, 0 failed
```

### 수동 검증
1. **Action**: `bash get.sh --yes --src "$PWD" <sandbox>` 재설치 후 설치본 grep
   - **Result**: `.claude/commands/gd-plan-*.md` 9개 전부 `gd:advance` 마커 전파. prd 예/아니오 분기·review 게이트 텍스트 확인.
2. **한계**: 대화형 "응 → 다음 단계 자동 실행"은 별도 Claude Code 세션이 필요 — 본 작업에서는 구조/텍스트 수준까지 검증.

## 🔍 발견 사항

- gd-plan 소비자 설치는 CLAUDE fragment 를 설치하지 않음(README footprint 와 실제 `install.sh` 불일치). → 규약을 각 스킬에 인라인하는 설계가 정당.
- `plans/gd-plan-*.md` 가 SoT, 설치 시 `.claude/commands/` 로 복사됨. 편집은 `plans/` 에서만.

## 🚧 이월 항목 (Optional)

- 대화형 자동 진행의 E2E 검증(별도 세션에서 `/gd-plan-start` → "응" 흐름) → 추후 수동 확인 권장.
- README footprint 와 실제 install 의 CLAUDE fragment 불일치 → 문서 정정 후보(별도 spec-x).
