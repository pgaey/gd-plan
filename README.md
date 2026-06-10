# gd-plan

> 상류 기획 레이어 — 검증된 디자인 시스템 위에서 PRD·구조·플로우·UI규칙을 **인터뷰로 생성**하는 Claude Code 스킬 패키지.

디자이너 없이도 **66개 검증된 디자인 시스템**(`design-md-collection/`) 위에서만 생성해 일관성을 강제한다. v0 / Lovable / Bolt 처럼 매번 들쭉날쭉하지 않다.

## 무엇을 만드나 (5종 문서 + 검증 2종)

```
/gd-plan-start    → 진행률 안내 (진입점)
/gd-plan-prd      → docs/prd.md        무엇을·누구를 (16문항 인터뷰, 제약/규제 포함)
/gd-plan-critique → docs/_critique.md  PRD 전제 적대 검증 (독립 서브에이전트 · 의미 정합)
/gd-plan-design   → docs/design.md     검증된 시스템 픽 (collection 복사)
/gd-plan-sitemap  → docs/sitemap.md    페이지 로스터 (지도)
/gd-plan-page     → docs/pages/[PAGE]/ 페이지별 구조·결정 (섹션 스택)
/gd-plan-flows    → docs/flows/        사용자 여정 (mermaid)
/gd-plan-rules    → docs/ui-rules.md   인터랙션·수치 규칙
/gd-plan-review   → 구조 일관성 검증 (structural BLOCK / style WARN)
```

연결 모델: `role → capability → page → flow`. 끊긴 고리는 `/gd-plan-review` 가 BLOCK.
**검증 2층**: `/gd-plan-critique`(의미 정합 — "말이 되나", 독립 서브에이전트) / `/gd-plan-review`(구조 정합 — "아귀가 맞나", lint). 구조적 완성 ≠ 의미적 정합.

## 구조

```
src/{cli,build-index}.ts   설치기 + design-md-collection 인덱스 빌더
plans/                     gd-plan 스킬 9개 (Claude Code /command)
templates/                 prd/sitemap/ui-rules + pages/{structure,decisions} + decisions
                           + flows/_name + section-taxonomy
                           (design.md 은 collection 픽킹이라 템플릿 없음 · 구조는 sitemap+pages)
design-md-collection/      66개 검증 디자인 시스템 + _index.json (후보 캐시)
docs/decisions/            ADR-001~015 (설계 결정)
specs/spec-13-01-gd-plan-package/  원본 설계 기록 (gen-design 분리 전, 참고용)
```

## 설치 (소비자 — node 불필요)

harness-kit 형태로 `curl | bash` 한 줄 설치합니다. 소비자 측은 **bash + curl + tar + shasum** 만 있으면 됩니다 (node 불필요).

```bash
# 현재 프로젝트(또는 <dir>)에 설치
bash <(curl -fsSL https://raw.githubusercontent.com/pgaey/gd-plan/main/get.sh) --yes <dir>
```

설치되는 것 (footprint):

```
.claude/commands/gd-plan-*.md   스킬 9
.gd/templates/                  prd·sitemap·pages·ui-rules·section-taxonomy·decisions
.gd/design-md-collection/       검증된 디자인 시스템 66개 + _index.json (전체 동봉)
.gd/bin/gd                      소비자 CLI (status·upgrade·version)
.gd/VERSION · .gd/manifest      설치 버전 + 파일 무결성(shasum)
docs/                           사용자 산출물 — 설치/업그레이드 절대 미접촉
```

설치 후 Claude Code 에서 `/gd-plan-start` 로 시작합니다.

### 업그레이드 / 상태 (소비자 CLI)

```bash
.gd/bin/gd status     # 설치 버전 vs 원격 최신 비교 + 사용자 수정 파일 표시
.gd/bin/gd upgrade    # 최신으로 갱신 (수정한 파일은 <file>.new 로 보존 — 손실 없음)
.gd/bin/gd version    # 설치 버전 출력
```

자세한 배포 모델: `docs/decisions/ADR-016-self-contained-distribution.md` · release 절차: `docs/RELEASE.md`.

## 개발 (이 repo 기여자)

```bash
pnpm install
pnpm build            # dist/ 생성
pnpm build-index      # design-md-collection/_index.json 재생성
pnpm test             # vitest 회귀
pnpm test:sh          # get.sh·gd 셸 테스트
pnpm typecheck
```

> `node dist/cli.js` (구 설치기) 는 **deprecated** — 스킬 9개만 복사하고 templates·컬렉션·CLI 를 빠뜨려 외부에서 동작하지 않습니다. 소비자 설치는 위 `get.sh` 를 사용하세요.

## 배경 — gen-design 에서 분리

이 패키지는 원래 `gen-design` monorepo 의 `packages/gd-plan` 으로 설계됐다 (상류 기획 레이어, spec-13-01). 기존 코드베이스(dennis)와 **호환 결합이 없어** 독립 repo 로 분리했다. `spec/` 의 설계 문서는 분리 전 gen-design 맥락(create-gd-react 스캐폴드, gd-chat F9 주입, gd-cli 통합 등)을 일부 포함하며, 이는 **참고용 원본 기록**이다 — 본 repo 의 실제 범위는 위 "구조"의 standalone 파일들이다.

### 후속 (gen-design 측 glue, 본 repo 범위 밖)
- `/gd-chat` 주입 (F9): 기획 문서를 화면 생성에 주입 — gen-design 의 gd-chat 스킬 소관
- create-gd-react docs/ 스캐폴드 — gen-design 소관
- 문서 ↔ 작업물 sync (paper.design resync) — 별도 spec

## License

MIT
