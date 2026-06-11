# Release 절차 (gd-plan)

> 배포 모델은 `docs/decisions/ADR-016-self-contained-distribution.md` 참조.
> 버전은 `package.json` 의 `version` 이 **단일 진실(SoT)** 이며, 설치 시 `.gd/VERSION` 으로 복사된다.
> bump 는 **수동** 이다 (YAGNI — 자동 판정 안 함).

## semver bump 기준

| 단계 | 기준 | 예 |
|---|---|---|
| **MAJOR** (x.0.0) | 스킬 동작·doc 모델·템플릿 구조가 깨지는 변경 (소비자 재학습/마이그레이션 필요) | 평면 5문서 → 세로 슬라이스, footprint 경로 변경 |
| **MINOR** (0.x.0) | 신규 스킬·capability 추가 (하위호환) | `/gd-plan-critique` 추가, 새 템플릿 |
| **PATCH** (0.0.x) | 규칙 보강·문구·버그픽스 (동작 동일) | 스킬 문구 교정, 셸 버그 수정 |

## release 체크리스트

1. **변경 정리**: 마지막 release 이후 변경을 요약 (CHANGELOG 가 있으면 항목 추가).
2. **version bump**: `package.json` 의 `version` 을 위 기준으로 수정.
3. **인덱스 재빌드** (컬렉션을 건드린 경우만): `pnpm build-index` → `design-md-collection/_index.json` 갱신.
4. **검증**: `pnpm test` (vitest 회귀) + `pnpm test:sh` (get.sh·gd 셸) + `pnpm typecheck` 모두 PASS.
5. **머지**: 변경을 `main` 에 머지 (SDD phase/spec 흐름).
6. **태그 생성**: `main` 에서
   ```bash
   git tag "v$(grep '"version"' package.json | head -1 | sed 's/.*"version"[^"]*"\([^"]*\)".*/\1/')"
   git push origin --tags
   ```
   태그는 `get.sh --version <ver>` 와 `gd upgrade` 의 버전 핀이 가리키는 대상이다 (ADR-016).

## 소비자 영향

- `get.sh` 기본 설치는 `main` tarball 을 받는다 — 머지 즉시 최신 반영.
- `gd status` 는 `main` 의 `package.json` version 과 설치본 `.gd/VERSION` 을 비교한다 — version bump + main 머지가 끝나면 소비자에게 "업그레이드 가능" 으로 노출된다.
- `gd upgrade` 는 `main` tarball 로 갱신하며 사용자 수정 파일은 `<file>.new` 로 보존한다 (손실 없음).

> **현재(v1) 범위**: `gd upgrade` 는 `main` 추적. 태그 핀 기반 업그레이드(`--version`)는 get.sh 에만 구현돼 있고, 태그 운영이 안정화되면 `gd upgrade` 도 태그 핀으로 전환을 검토한다 (spec-02-03 결정 기록).
