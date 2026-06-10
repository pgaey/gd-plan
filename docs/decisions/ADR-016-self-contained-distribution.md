---
id: ADR-016
type: decision
date: 2026-06-10
status: accepted
---

# ADR-016: self-contained bash 배포 + 컬렉션 전체 동봉

## 📚 Context

gd-plan 을 외부 프로젝트에 설치할 공식 경로가 없었다 — 기존 설치기(`src/cli.ts`)는 스킬 9개만 같은 디스크 안에서 복사하며, 스킬이 읽는 템플릿·컬렉션이 함께 깔리지 않아 외부에서 동작하지 않는다. phase-02 는 harness-kit 동형의 `curl | bash` 설치/업그레이드를 도입한다. 소비자 전제: node 미설치, bash + curl 만. repo 는 2026-06-10 public 전환 완료.

## 🎯 Decision

1. **self-contained bash 배포**: 소비자 설치·업그레이드는 `get.sh`(bash) + `.gd/bin/gd`(bash)로만 동작한다. npm/npx 는 배포 경로가 아니다 (node 는 개발 측 전용 — `pnpm build-index`, vitest).
2. **컬렉션 전체 동봉**: 설치 footprint 에 `design-md-collection` 66개 + `_index.json` 전체를 `.gd/design-md-collection/` 으로 복사한다. 픽 시 네트워크 요청은 0회다. `_index.json` 은 용량이 아니라 토큰 절약(후보 3 좁히기 전 풀로드 회피)을 위해 유지한다.
3. **public GitHub repo = 배포 서버**: 설치·업그레이드 fetch 는 `github.com/pgaey/gd-plan` 에서 직접 받는다 (GitHub 단일 — CDN 미사용).

## 📊 Consequences

- **긍정**: 픽 시 fetch 가 없어 그 실패 클래스 전체가 소멸 — curl HTTP 에러 위장(404 본문 캐시 오염), 폴백 정책, stale 캐시, 버전 drift, 오프라인 불가가 설계상 존재하지 않는다. 설치본은 항상 자기 버전과 일치하는 컬렉션을 가진다.
- **긍정**: 소비자 의존 0 (bash + curl). tarball 설치 방식이면 컬렉션 동봉의 추가 다운로드 비용도 0.
- **부정**: 설치 용량 +1.2MB (실측 — 수용). 컬렉션 갱신은 `gd upgrade` 를 통해서만 반영된다 (실시간 아님).
- **중립**: 인덱스/컬렉션 빌드는 release 전 개발 측 책임 (`pnpm build-index`).

## 🔀 Alternatives

- **인덱스만 설치 + 픽 시 원본 fetch** (brainstorm 2026-06-09 승인안): 설치를 가볍게 한다는 아이디어 — 비채택(번복) 이유: 전제 "66개 무겁다"가 실측 1.2MB 로 반증. spec critique 가 fetch 경로의 위험 5건(curl 위장 실패·폴백 구분·캐시 무효화 등)을 드러냈고, 동봉 시 클래스째 소멸. 번복 승인 2026-06-10 (phase-02.md 결정 기록).
- **npm 패키지 배포**: `npx gd-plan` 설치 — 비채택 이유: 소비자 node 의존 발생, harness-kit 동형(curl|bash) 포기.
- **private repo + gh CLI / 별도 공개 dist repo**: 소스 비공개 유지 — 비채택 이유: 소비자 마찰(gh 인증) 또는 repo 2개 관리 비용. 도구 소스 공개 부담이 낮아 public 전환 선택.
- **CDN(jsDelivr 등) 경유**: GitHub rate limit 회피 — 비채택 이유: 픽 시 fetch 소멸로 요청량이 설치/업그레이드 시 1회 수준이라 불필요. GitHub 단일로 충분.

## 📌 Status

Accepted (2026-06-10, spec-02-01). 첫 사용자: `plans/gd-plan-design.md` (2모드 컬렉션 경로), 이후 spec-02-02 `get.sh`·spec-02-03 `gd` CLI 가 본 결정 위에서 구현.

## 🔗 Related

- `backlog/phase-02.md` 결정 기록 (public 전환·전체 동봉 번복)
- `specs/spec-02-01-dist-artifacts-index/critique.md` (픽 fetch 설계 위험 분석)
- ADR-002 (design-md 픽커 라이브러리 — 컬렉션이 픽킹 SoT 인 배경)
