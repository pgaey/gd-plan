# 설계 기록 (원본 — gen-design 분리 전)

이 디렉토리는 gd-plan 이 `gen-design` monorepo 의 `packages/gd-plan` (spec-13-01) 으로
설계됐을 때의 **원본 SDD 산출물**이다. 분리 후 참고용 기록으로 보존한다.

| 파일 | 내용 |
|---|---|
| `spec.md` | 요구사항 (F1~F10, DoD) |
| `plan.md` | 구현 계획 |
| `task.md` | 17 task 체크리스트 |
| `critique.md` | 독립 아키텍트 비판 (유사기법·누락·과잉설계) |
| `walkthrough.md` | 작업 기록 + 결정 + 검증 결과 |
| `architecture.html` / `deep-dive.html` / `section-glossary.html` | 설명 문서 |
| `drafts/` | 템플릿·인터뷰 초안 |

> ⚠️ 이 문서들은 gen-design 맥락(create-gd-react / gd-chat F9 / gd-cli 통합)을 포함한다.
> 그 glue 부분은 분리된 gd-plan repo 의 범위가 **아니다** (→ 루트 README "배경" 참조).
> 본 repo 의 실제 범위 = standalone core (src / plans / templates / design-md-collection).
