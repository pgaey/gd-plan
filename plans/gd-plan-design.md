---
name: gd-plan-design
description: 디자인 시스템 선택. design-md-collection의 _index.json으로 후보 3개를 좁힌 뒤 풀로드해 docs/design.md로 복사한다(사람이 작성하지 않음). frontmatter의 reason만 사용자 편집. idempotent.
---

# gd-plan-design — 디자인 시스템 픽킹

> 본 스킬은 *큐레이터*입니다. 디자이너 없이 **검증된 66개 디자인 시스템** 중에서 골라 그 위에서만 생성합니다 (= v0/Lovable 대비 일관성 USP).
> **핵심**: design.md 는 사람이 *작성*하지 않는다. collection 파일을 *복사*하고 `reason` 만 편집한다.

---

## §1 자동 로딩 컨텍스트

| 파일 | 역할 |
|---|---|
| `docs/prd.md` | 톤 키워드·도메인·페르소나 (픽킹 기준) |
| `design-md-collection/_index.json` | 66개 요약 인덱스 (먼저 읽음 — 풀로드 회피) |
| `.gd/memory/decisions.md` (있으면) | 이전 디자인 결정 |

> **prd.md 가 없으면** 차단: "먼저 /gd-plan-prd 로 톤·도메인을 정하세요."

## §2 픽킹 절차 (인덱스 먼저 → 후보 3 → 풀로드)

1. `_index.json` 을 읽는다. **없으면** `pnpm gd plan refresh-index` 안내 후 중단.
2. prd 의 톤 키워드 + 도메인 + 페르소나로 인덱스 entry 를 점수화:
   - tone_keywords 교집합 (가중치 높음)
   - domain_keywords 교집합
   - layout_density 가 prd 성격과 맞는지
3. **상위 3개 후보**만 좁힌다. 이 단계까지 원본 파일은 **풀로드하지 않는다** (토큰 절약).
4. 후보 3개의 원본 `design-md-collection/<file>.md` 를 **그때 풀로드**해 사용자에게 비교 제시:
   ```
   후보 (prd 톤 "미니멀, 신뢰" 기준):
     1. cal.md      — monochrome, Cal Sans, 신뢰감 (tone 3개 일치)
     2. linear.app.md — 정밀·기술적, Inter (tone 2개 일치)
     3. claude.md   — 따뜻·editorial, serif (tone 1개 일치)
   어느 시스템 위에서 만들까요? (번호 또는 직접 지정)
   ```
5. 사용자가 고르면 → 해당 파일 **전체를 `docs/design.md` 로 복사**.

## §3 frontmatter 부착

복사한 design.md 맨 위에 frontmatter 추가:

```yaml
---
pickedFrom: cal.md
pickedAt: <오늘 날짜>
reason: <사용자가 이 시스템을 고른 이유 — 유일하게 사람이 편집하는 필드>
---
```

> `reason` 만 사용자 편집 대상. 본문(9섹션)은 collection 원본 그대로 — 임의 수정 금지 (수정하려면 ui-rules.md 에서 오버라이드).

## §4 collection-scanner 서브에이전트 (권장)

후보 점수화를 Sonnet 서브에이전트로 위임 가능 — `_index.json` + prd 를 주고 후보 3 + 사유를 받는다.
> **non-normative**: 서브에이전트 없이 메인에서 직접 점수화해도 된다 (권장 힌트, DoD 강제 아님).

## §5 idempotent

- 이미 `docs/design.md` 에 `pickedFrom` 이 있으면 → "현재 <X> 픽됨. 다시 고를까요?" 확인 후에만 재픽.
- 재픽 시 사용자의 기존 `reason` 을 보존하려 시도 (덮어쓰기 전 확인).

## §6 종료

- `docs/design.md` 생성 확인 (frontmatter + 9섹션 본문).
- 출력: `docs/design.md 작성 완료 (<file> 픽). 다음 단계: /gd-plan-structure. 전체 진행률: 2/5`
