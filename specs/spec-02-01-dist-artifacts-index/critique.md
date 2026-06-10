# Spec Critique: spec-02-01

> 독립 시니어 아키텍트 검토. 대상: 컬렉션 픽 fetch 규약(raw URL·ref 핀·캐시) + `gd-plan-design.md` dev/소비자 2모드 + ADR-016.
> 검토일: 2026-06-10

## 1. 유사 기법 조사

### 발견된 패턴/도구

- **GitHub Actions tool-cache (`actions/cache`·setup-x 패턴)**: 버전별 캐시 폴더에 받은 뒤 `.complete` sentinel 파일을 남겨 "완전히 받힌 것"만 캐시로 인정 — 현재 spec과 비교: 본 spec의 캐시(`.gd/design-cache/<file>`)는 **무결성/완료 표식이 없다**. 네트워크가 중간에 끊겨 truncated 파일이 떨어지면 그게 영구 유효 캐시로 굳는다("캐시 우선"이라 재시도도 안 함).
- **jsDelivr GitHub CDN (`cdn.jsdelivr.net/gh/owner/repo@v{tag}/file`)**: raw.githubusercontent.com 의 목적별 대체 CDN. 버전 핀 URL을 **영구 불변 캐시**한다 — 본 spec의 "버전 핀이라 원본 불변 → TTL 불필요" 논리와 정확히 같은 모델을, 게다가 서버 측에서 보장. 비교: raw.githubusercontent.com 은 **비인증 요청 rate limit(HTTP 429)** 이 있고 CDN 캐시 보장이 없다. 다중 픽·여러 소비자 환경에서 429 위험이 실재한다.
- **gruntwork `fetch` / `gh release download` / release tarball**: 특정 ref(tag/branch/SHA)에서 파일·릴리스 자산을 받는 표준 도구. 비교: 본 spec은 raw 파일 1건 직접 fetch라 더 가볍지만, 무결성·재시도·코드 분기를 스스로 책임져야 함(도구가 안 해줌).
- **버전 핀 모범사례(digest/tag pinning)**: "프로덕션은 정확 버전·loose 는 범위, 자동 업데이트 PR" — 본 spec의 `v{VERSION}` 태그 핀 + `main` 폴백은 이 권고의 합리적 변형. 다만 폴백은 의도적으로 핀을 깨는 행위라 tradeoff 표기 필요.

### 시사점

1. 캐시에 **원자적 쓰기 + 완료 표식** 개념을 도입할 가치가 크다(GHA sentinel). 최소한 `curl -f -o <tmp> && mv <tmp> <dest>` 로 부분 파일을 캐시화하지 않게.
2. raw.githubusercontent.com 의 **429 rate limit** 을 ADR-016 의 알려진 위험으로 기록하고, "관측 시 jsDelivr 전환" 을 재검토 트리거로 박아두면 결정의 수명이 길어진다.

## 2. 요구사항 비판

### 누락

- **캐시 무결성/원자성**: fetch 중단 시 truncated 파일이 캐시로 굳는 경로가 열려 있다(FR1 "캐시 우선"과 결합 시 영구 오염). `curl -f` + temp→rename, 또는 최소한 frontmatter 존재 sanity 체크 규약이 없음.
- **HTTP 실패 코드 구분 부재**: curl 은 기본적으로 HTTP 4xx/5xx 에도 종료코드 0(성공)이다. `-f` 명시가 없으면 404 본문(GitHub의 "404: Not Found")이 정상 원본으로 캐시·복사될 수 있다. 또 404(ref/파일 없음)·429(rate limit)·네트워크 불가는 폴백 의미가 다른데(404만 main 폴백이 유효, 429/타임아웃은 폴백해도 동증상) 규약이 "태그 fetch 실패"로 뭉뚱그려져 있음.
- **`.gd/VERSION` 부재/이상 시 ref 결정**: 소비자 모드인데 VERSION 파일이 없거나 비정상이면 `v{VERSION}` 이 깨진다. 이 경우 곧장 main 폴백인지, 중단인지 미정.
- **`.gd/design-cache/` 의 gitignore 규약**: 소비자 프로젝트에서 캐시가 git에 커밋되지 않도록 안내가 필요(footprint 누수·repo 비대). plan 이 "footprint에 없던 항목"으로 인지는 하나 무시 규약은 미정.
- **픽 1회 = fetch 최대 3회**: §2는 후보 3개를 풀로드(=fetch 3)하지만 복사는 1개만. 나머지 2개도 네트워크·캐시 비용 발생. 의도된 비용인지, 비교는 인덱스 요약으로 하고 최종 1개만 fetch할지 명시가 없음(위험표의 "인덱스로 오프라인 픽 판단 가능"과 미묘하게 어긋남).

### 모순

- **URL의 `<file>` 확장자 처리**: FR1은 `design-md-collection/<file>` 인데 인덱스 `file` 필드는 이미 `airbnb.md`(확장자 포함). 반면 기존 스킬 §2 step4 본문은 `design-md-collection/<file>.md` 로 `.md` 를 덧붙인다 → `cal.md.md` 가 될 위험. 본 spec이 본문을 갱신하므로 **이때 한쪽으로 통일**해야 함(권장: `file` 필드가 확장자 포함이므로 덧붙이지 않음).
- **기존 인덱스-부재 안내 문구 vs 실제 스크립트**: 현행 스킬 §2 step1 은 `pnpm gd plan refresh-index` 라 안내하나 package.json 의 실제 스크립트는 `pnpm build-index`. FR2.3은 "dev면 `pnpm build-index`"라 사실상 교정 의도가 있지만, spec이 "기존 문구가 틀렸으니 교정한다"를 명시하지 않아 구현자가 둘 다 남길 수 있음. 교정 대상임을 못 박을 것.
- **`main` 폴백 ↔ drift 방지 목적 충돌(tradeoff)**: ref 핀의 명시 목적이 "인덱스↔원본 버전 drift 방지"인데, 폴백은 정확히 그 핀을 깨고 drift를 허용한다. 모순까진 아니나 의도된 tradeoff이며 폴백본을 어떻게 표시/격리할지(아래 모호) 없이는 조용한 drift가 된다.

### 과잉 설계

- **ADR-016 범위가 spec 범위보다 넓음(경계선)**: ADR-016은 배포 모델 전체(npm 비채택·전체 복사 탈락·private+gh 탈락)를 명문화 — spec-02-01의 픽 fetch 규약보다 큰 phase 차원 결정. 다만 phase 첫 spec에 박는 것은 합리적이라 제거가 아니라 "ADR는 phase 결정, spec FR4는 그 일부"임을 인지하는 선에서 OK. YAGNI 위반은 아님.
- 그 외 뚜렷한 과잉 없음. 캐시 TTL 없음·동시성 락 없음은 단일 에이전트·버전 핀 전제에서 올바른 YAGNI.

### 모호함

- **폴백 트리거 "태그 fetch 실패"의 정의**: 위 누락(HTTP 코드 구분)과 연결 — 어떤 실패에 폴백하고 어떤 실패에 중단하는지 불명.
- **캐시 키에 ref/version 미포함**: 키가 `<file>` 뿐. upgrade로 VERSION이 바뀌면 같은 `<file>` 이 다른 내용일 수 있는데(원본 개정), stale 캐시를 "캐시 우선"으로 그냥 쓴다. plan은 "캐시 비우기는 spec-02-03"으로 미루지만, 그 사이 버전 불일치 구간이 비어 있음. 키를 `<version>/<file>` 로 두면 자가 무효화되어 02-03 의존이 줄어든다.
- **폴백본(main)의 캐시 저장 여부·표식**: main 폴백으로 받은 파일을 v태그 키와 같은 슬롯에 저장하면 이후 "이게 핀된 버전 원본"이라는 의미가 오염된다. 저장 안 함/별도 표식 중 무엇인지 모호.

## 3. 대안 제안

### 대안 A: jsDelivr CDN을 배포 서버로
- **아이디어**: fetch URL을 `https://cdn.jsdelivr.net/gh/pgaey/gd-plan@v{VERSION}/design-md-collection/<file>` 로 두어 rate limit 회피 + CDN 영구 불변 캐시 활용.
- **장점**: 비인증 429 위험 제거, 버전 핀 = 서버 측 불변 보장(본 spec 캐시 논리와 정합), 전세계 CDN 지연 개선. 무료.
- **단점**: 서드파티 가용성 의존(jsDelivr 다운=픽 불가). 새 태그 전파 지연 가능. public 전용(현재 public이라 OK). 규약 URL을 한 외부 서비스에 고정.

### 대안 B: 현재 규약 + 견고성 보강(추천 보강)
- **아이디어**: URL/ref는 그대로 두고 빈틈만 메운다 — (1) `curl -fsSL` + temp→`mv` 원자적 쓰기, (2) HTTP 404→main 폴백, 429/타임아웃→재시도 후 중단, (3) 캐시 키를 `.gd/design-cache/<version>/<file>` 로, (4) main 폴백본은 캐시 저장 안 함(또는 `.main` 접미사 격리).
- **장점**: 최소 변경으로 무결성·stale·조용한 drift를 동시 차단. 스킬 cap(400줄) 여유 충분(현재 72줄). 외부 의존 무증가.
- **단점**: 스킬 본문 지시가 길어져 마크다운 규약 정밀도(curl 플래그까지)를 본문에 박아야 함. raw.githubusercontent 429 자체는 미해결(완화는 캐시·재시도뿐).

### 대안 C: 후보 비교는 인덱스 요약, fetch는 최종 1개만
- **아이디어**: §2 step4의 후보 3 풀로드를 없애고 인덱스의 color/typo/tone 요약으로 비교 제시 → 사용자가 고른 **1개만** fetch·복사.
- **장점**: 픽당 fetch 3→1로 네트워크·429 위험·토큰 절감. "인덱스로 오프라인 픽 판단" 위험완화책과 정합.
- **단점**: 후보 풀로드 비교 UX 약화(원문 발췌 비교 불가). dev 모드 현행 동작(풀로드 비교)과 갈라져 2모드 동작 차이가 생김 — NFR "dev 회귀 0"과 충돌 소지. 범위 확장이라 후속 spec 권장.

## 권장안

**현재 spec 유지 + 대안 B 필수 반영.** ref 핀·캐시·2모드 자동판별의 골격은 적절하고 업계 패턴(버전 핀·tool-cache)과 정합한다. 다만 마크다운 지시로만 fetch를 수행하는 구조상 **curl의 기본 동작(4xx에도 성공 종료)·중단 무결성·stale 캐시**가 실제 깨짐 지점이므로, 대안 B의 4개 보강(원자적 쓰기·HTTP 코드 분기·버전 포함 캐시 키·폴백본 격리)을 FR1에 흡수해야 한다. 대안 A(jsDelivr)는 지금 채택하지 말고 **ADR-016에 탈락 대안 + "429 관측 시 전환" 재검토 트리거**로만 기록. 대안 C는 범위 밖 — 후속 검토 항목으로 backlog.

## 4. ADR 후보 추출

- [x] **후보 발견(이미 계획됨)**: `ADR-016-self-contained-distribution` — type: **decision** — 이유: self-contained bash 배포 / 인덱스만 설치+픽시 fetch / public raw=배포서버 는 cross-spec(02-01/02/03 공유)·6개월+ 유지·배포 아키텍처 결정. 적절. **보강 권고**: ADR 본문에 (a) 탈락 대안에 jsDelivr 추가 + "429 관측 시 전환" 재검토 트리거, (b) `main` 폴백 = drift 허용 tradeoff 명기.
- [ ] **신규 추가 후보 없음**: 캐시 키 정책(`<version>/<file>` 불변 캐시)·원자적 쓰기는 convention 수준이며 별도 ADR보다 ADR-016 본문 또는 스킬 규약으로 흡수하는 편이 적절(파편화 방지).
