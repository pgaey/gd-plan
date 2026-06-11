# feat(spec-02-02): get.sh 부트스트랩 + install.sh 설치기

## 📋 Summary

### 배경 및 목적

phase-02 의 본체 — 외부 프로젝트에 gd-plan 을 한 줄로 설치하는 경로를 만든다. spec-02-01 이 확정한 footprint 규약(스킬 9 + `.gd/` templates·컬렉션 전체·VERSION·manifest)을 실제로 까는 설치기로, harness-kit 실물과 동형인 2층 구조(get.sh 부트스트랩 → install.sh 위임)를 채택했다. phase 미해결 결정 2건(fetch 방식·bash 테스트 도구)을 본 spec 에서 확정.

### 주요 변경 사항
- [x] `get.sh`: `bash <(curl …get.sh) [--yes] [--version v] <dir>` — archive tar.gz 1요청 + mktemp/trap + install.sh 위임, `--src` 로컬 모드(테스트·오프라인)
- [x] `install.sh`: footprint 복사 + `.gd/VERSION`(package.json 파싱, node 비사용) + `.gd/manifest`(sha256 평문, `shasum -c` 호환) + `docs/` 미접촉 + 멱등
- [x] `test/sh/` 셸 어서션 하네스 + 시나리오 4건 (fresh·docs 미접촉·멱등·node 비의존) — 전부 네트워크 0
- [x] `package.json` 에 `test:sh` 등록

### Phase 컨텍스트
- **Phase**: `phase-02`
- **본 SPEC 의 역할**: 설치 경로 본체. `.gd/VERSION`·manifest 를 처음 기록해 spec-02-03(status·upgrade·충돌 감지)의 입력을 만든다

## 🎯 Key Review Points

1. **install.sh 의 docs/ 미접촉 보장**: 복사 맵이 `.claude/commands/`·`.gd/` 로만 향하는지 (phase 불변 조건 — RC5 교훈).
2. **manifest 형식**: `<sha256>  <상대경로>` 표준 — spec-02-03 충돌 감지가 이 형식을 그대로 소비하므로 여기서 굳는다.
3. **bash 3.2 호환**: macOS 기본 bash 에서 동작해야 함 (배열·mapfile 미사용 확인).
4. **bin/gd "존재 시 복사"**: spec-02-03 에서 gd 가 추가되면 install.sh 수정 없이 자동 포함되는 구조.

## 🧪 Verification

### 자동 테스트
```bash
pnpm test && pnpm test:sh && pnpm typecheck
```

**결과 요약**:
- ✅ vitest 67/67 (회귀 0) · 셸 시나리오 4건 PASS · typecheck 클린
- ✅ TDD: Red(get.sh 미존재 exit 1 — fb61b2e) → Green(4 시나리오 — b746445)

### 수동 검증 시나리오
1. **harness-kit get.sh 실물 대조**: archive 1요청 + 위임 구조 동형 확인
2. **네트워크 경로 실검증**: 머지 후 phase 통합 테스트 시나리오 1 에서 수행 (브랜치 단계에선 raw URL 미존재)

## 📦 Files Changed

### 🆕 New Files
- `get.sh`: 부트스트랩 (tar.gz fetch + 위임)
- `install.sh`: 설치기 (footprint 복사 + VERSION·manifest)
- `test/sh/run.sh`, `test/sh/test-get.sh`: 셸 어서션 하네스 + 시나리오 4건
- `specs/spec-02-02-get-sh-bootstrap/{spec,plan,task,walkthrough,pr_description}.md`

### 🛠 Modified Files
- `package.json` (+1): `test:sh` 스크립트
- `backlog/phase-02.md`, `backlog/queue.md`: spec-02-02 등재 (sdd)

**Total**: 10 files changed (+581, -1)

## ✅ Definition of Done

- [x] 모든 단위 테스트 통과 (vitest 67/67 + 셸 4 시나리오)
- [x] `walkthrough.md` ship commit 완료
- [x] `pr_description.md` ship commit 완료
- [x] lint / type check 통과
- [x] 사용자 검토 요청 알림 완료

## 🔗 관련 자료

- Phase: `backlog/phase-02.md`
- Walkthrough: `specs/spec-02-02-get-sh-bootstrap/walkthrough.md`
- 관련 ADR: `docs/decisions/ADR-016-self-contained-distribution.md`
