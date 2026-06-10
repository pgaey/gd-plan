# feat(spec-02-03): gd 소비자 CLI + install.sh --update 충돌 정책

## 📋 Summary

### 배경 및 목적

phase-02 의 마지막 spec — 설치 후 수명주기 도구를 완성한다. spec-02-02 가 만든 `.gd/VERSION`·`manifest`·`install.sh` 를 입력으로, 소비자가 "내 설치가 최신인가 / 업그레이드하면 내 수정이 보존되나"에 답할 수 있게 한다. `bin/gd` 3개 명령 + `install.sh --update` 충돌 정책으로, 비가역 손실 금지(phase 불변 조건, RC5 교훈)를 실제 코드로 보장.

### 주요 변경 사항
- [x] `bin/gd version`: `.gd/VERSION` 출력 (부재 시 복구 안내 + 비0)
- [x] `bin/gd status`: 자체 semver 비교로 `최신` / `업그레이드 가능 (x→y)` + manifest 대조 수정 파일 표시 + `.gd/cache` TTL 1h
- [x] `bin/gd upgrade [--src] [--yes]`: tar.gz(main) 또는 로컬 → `install.sh --update` 위임, VERSION·manifest 재기록(부재 복구 포함)
- [x] `install.sh --update`: 사용자 수정 파일(현재 sha ≠ 기존 manifest)은 `<file>.new` 보존 + 경고, 미수정은 갱신, `docs/` 미접촉
- [x] manifest 해석 통일: 항상 "상류 배포 sha" → status 수정 감지와 upgrade 충돌 판정이 동일 비교

### Phase 컨텍스트
- **Phase**: `phase-02` (이 spec 으로 spec 3종 완료)
- **본 SPEC 의 역할**: 버전 판단·업그레이드·충돌 보존 — phase 목표 "버전으로 업그레이드 필요 판단 + 비가역 손실 0" 의 본체

## 🎯 Key Review Points

1. **충돌 정책 정확성** (`install.sh` place_file): 수정 파일 판정 = `현재 sha ≠ 기존 manifest`, 처리 = `.new` 보존. fresh 경로는 불변(기존 test-get 4건 PASS 유지).
2. **manifest = 상류 sha 해석**: upgrade 후에도 사용자 수정 파일이 status 에서 "수정됨" 으로 일관 표시되는 의도된 동작 (walkthrough 결정 기록).
3. **bash 3.2 이식성**: `local` 한 줄 self-참조 버그 수정, 자체 semver(`sort -V` 회피), 프로세스 치환 회피(임시 파일).
4. **테스트 네트워크 0**: `GD_RAW_BASE=file://` 오버라이드로 status 원격 비교까지 격리 검증.

## 🧪 Verification

### 자동 테스트
```bash
pnpm test && pnpm test:sh && pnpm typecheck
```

**결과 요약**:
- ✅ vitest 67/67 (회귀 0) · 셸 9건(test-get 4 + test-gd 5) PASS · typecheck 클린
- ✅ TDD: Red(test-gd 5건 fail — 9cdabda) → Green(9건 PASS — 1094695)

### 수동 검증 시나리오
1. **충돌 재연** (test-gd 시나리오 4): 수정 파일 보존 + `.new` + docs diff 0 + VERSION 재기록
2. **네트워크 경로**: 머지 후 phase 통합 시나리오 2 에서 실제 raw/tar.gz fetch 검증

## 📦 Files Changed

### 🆕 New Files
- `bin/gd`: 소비자 CLI (version·status·upgrade)
- `test/sh/test-gd.sh`: gd 시나리오 5건
- `specs/spec-02-03-gd-consumer-cli/{spec,plan,task,walkthrough,pr_description}.md`

### 🛠 Modified Files
- `install.sh` (+71, -46): `--update` 충돌 정책 + manifest 상류 sha 기록 + bash 3.2 버그 수정
- `backlog/phase-02.md`, `backlog/queue.md`: spec-02-03 등재 (sdd)

**Total**: 8 files changed (+641, -46)

## ✅ Definition of Done

- [x] 모든 단위 테스트 통과 (vitest 67 + 셸 9)
- [x] `walkthrough.md` ship commit 완료
- [x] `pr_description.md` ship commit 완료
- [x] lint / type check 통과
- [x] 사용자 검토 요청 알림 완료

## 🔗 관련 자료

- Phase: `backlog/phase-02.md`
- Walkthrough: `specs/spec-02-03-gd-consumer-cli/walkthrough.md`
- 관련 ADR: `docs/decisions/ADR-016-self-contained-distribution.md`
