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
| 컬렉션 인덱스 (↓ 모드 판별) | 66개 요약 인덱스 (먼저 읽음 — 풀로드 회피) |
| `.gd/memory/decisions.md` (있으면) | 이전 디자인 결정 |

> **모드 판별 (인덱스 위치로 자동)**: `design-md-collection/_index.json` 존재 → **dev 모드** (이 repo 안). `.gd/design-md-collection/_index.json` 존재 → **소비자 모드** (외부 설치본 — 컬렉션 전체 동봉, 픽 시 네트워크 불필요). 이하 "컬렉션 디렉토리"는 판별된 모드의 디렉토리를 가리킨다.

> **prd.md 가 없으면** 차단: "먼저 /gd-plan-prd 로 톤·도메인을 정하세요."
> **critique soft-gate (경고, 차단 아님)**: `docs/_critique.md` 가 없거나(전제 검증 미실행), `prd.version > _critique.prdVersion`(stale) 이면 경고 — "PRD 전제 검증(/gd-plan-critique)을 먼저 권장합니다." 그대로 진행 가능(stale 인 동안 **매 진입 경고** — stateless). **frontmatter `prdVersion` 만 비교하고 `_critique` 본문은 읽지 않는다**(위생 — 비판 텍스트를 픽킹 기준으로 오독 방지).

## §2 픽킹 절차 (인덱스 먼저 → 후보 3 → 풀로드)

1. 컬렉션 디렉토리의 `_index.json` 을 읽는다. **두 모드 모두 없으면** 중단 — dev: `pnpm build-index` 실행 안내 / 소비자: 재설치 또는 `gd upgrade` 안내.
2. prd 의 톤 키워드 + 도메인 + 페르소나로 인덱스 entry 를 점수화:
   - tone_keywords 교집합 (가중치 높음)
   - domain_keywords 교집합
   - layout_density 가 prd 성격과 맞는지
3. **상위 3개 후보**만 좁힌다. 이 단계까지 원본 파일은 **풀로드하지 않는다** (토큰 절약).
4. 후보 3개의 원본을 컬렉션 디렉토리에서 **그때 풀로드**해 사용자에게 비교 제시. 파일명은 인덱스 `file` 필드 **그대로** 사용 (이미 확장자 포함 — `.md` 를 덧붙이지 말 것):
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

> **결정 기록**: 픽 확정 시 `docs/decisions.md` 에 typed 1행 — 예: `design = X 픽 / 탈락 Y,Z / 이유`. 형식·ID·supersede 는 헤더 / `ADR-011` 정본 참조.

## §4 collection-scanner 서브에이전트 (권장)

후보 점수화를 Sonnet 서브에이전트로 위임 가능 — `_index.json` + prd 를 주고 후보 3 + 사유를 받는다.
> **non-normative**: 서브에이전트 없이 메인에서 직접 점수화해도 된다 (권장 힌트, DoD 강제 아님).

## §5 idempotent

- 이미 `docs/design.md` 에 `pickedFrom` 이 있으면 → "현재 <X> 픽됨. 다시 고를까요?" 확인 후에만 재픽.
- 재픽 시 사용자의 기존 `reason` 을 보존하려 시도 (덮어쓰기 전 확인).

## §6 종료

- `docs/design.md` 생성 확인 (frontmatter + 9섹션 본문).
- 출력: `docs/design.md 작성 완료 (<file> 픽). 다음 단계: /gd-plan-sitemap. 전체 진행률: 2/5`
- **자동 진행 (confirm-then-advance)**: 위 출력 직후 "다음 단계 `/gd-plan-sitemap`(페이지 지도)으로 바로 진행할까요?"라고 묻는다.
  - 사용자가 **긍정**(응/네/그래/ㅇㅇ/yes/y/진행 등)하면 → `.claude/commands/gd-plan-sitemap.md` 를 읽어 같은 대화에서 즉시 이어 실행(슬래시 불필요).
  - **부정/모호**하면 → 정지. 슬래시 커맨드만 남긴다.
  - 직전 단계가 실제 done 일 때만 제안. `<!-- TODO -->` 등 미완 필드가 있으면 자동 진행 대신 보완을 먼저 안내.

<!-- gd:advance next=sitemap -->
