# 섹션 어휘 (Section Taxonomy)

> structure.md 가 페이지를 조립할 때 쓰는 **통제된 섹션 어휘**. 아무 섹션이나 못 쓰고 이 목록 안에서만 고른다 (= 통제 레이어의 실체).
> 각 섹션 = (1) 목적 (2) 슬롯(채울 내용) (3) 매핑(FRONT.md / catalog 컴포넌트) (4) 위치 관례.
> 출처: relume 섹션 모델 차용 + 앱 섹션은 본 프로젝트 정의. relume 과 동일하게 **shadcn 토대**.
> **중요**: 프로젝트마다 *배치(arrangement)* 는 다르다. *어휘* 만 공통이다. 그래서 이 표는 재사용되고, 페이지 배치는 structure.md 에서 매번 정한다.

## A. 마케팅 섹션 (랜딩 / 소개 페이지)

| 섹션 | 목적 | 슬롯 | 매핑(catalog) | 위치 관례 |
|---|---|---|---|---|
| `Navbar` | 전역 네비 | logo, links[], cta? | NavBar | 최상단 sticky |
| `Hero` | 첫인상 / 가치 제안 | heading, subhead, primaryCTA, secondaryCTA?, media? | (조합) | Navbar 바로 아래 |
| `Feature` | 기능 / 가치 나열 | items[]{icon?, title, desc} | Card grid | Hero 아래 |
| `Logos` | 신뢰(고객 로고) | logos[] | (조합) | Hero / Feature 사이 |
| `Stats` | 핵심 지표 | stats[]{value, label} | StatCard | 중단 |
| `Gallery` | 시각 쇼케이스 | images[] | (조합) | 중단 |
| `Testimonial` | 후기 / 추천 | quotes[]{quote, author, role?} | Card | 중하단 |
| `Pricing` | 요금제 | tiers[]{name, price, features[], cta} | Card | 하단부 |
| `FAQ` | 자주 묻는 질문 | items[]{q, a} | Accordion | 하단 |
| `CTA` | 행동 유도 | heading, button | (조합) | Footer 직전 |
| `Footer` | 하단 정보 | columns[], legal | (조합) | 최하단 |

## B. 앱 섹션 (대시보드 / 관리 / 폼)

| 섹션 | 목적 | 슬롯 | 매핑(catalog) | 위치 관례 |
|---|---|---|---|---|
| `Sidebar`(LNB) | 좌측 네비 | groups[]{label, items[]} | (조합) | 좌측 고정 |
| `PageHeader` | 화면 제목 + 액션 | title, breadcrumb?, actions[] | (조합) | 콘텐츠 최상단 |
| `Toolbar` | 검색 / 필터 / 뷰 | search?, filters[], actions[] | (조합) | PageHeader 아래 |
| `StatGrid` | 지표 카드 묶음 | cards[]{label, value, delta?} | StatCard | 대시보드 상단 |
| `DataTable` | 표 데이터 | columns[], rowActions?, pagination? | DataTable | 본문 |
| `List` | 목록 / 카드 그리드 | items[], itemShape | Card grid | 본문 |
| `Form` | 입력 폼 | fields[], submit | Form | 본문 / 모달 |
| `DetailPanel` | 상세 보기(읽기) | fields[]{label, value} | (조합) | 본문 / 우측 |
| `Tabs` | 탭 분할 | tabs[]{label, content} | Tabs | 본문 상단 |
| `EmptyState` | 빈 상태 | icon?, message, action? | (조합) | 데이터 0 일 때 |

## 규칙

- 오버레이(`Modal` / `Sheet` / `Drawer`)는 "섹션"이 아니라 **동작** — structure.md 의 `page.layout.modal` 에 기술, `sections` 에는 넣지 않는다.
- `Form` 섹션은 검증/제출 동작을 `<slug>.order.md` 로 분리(컴파일러가 zod/useForm 생성).
- **새 섹션이 필요하면 임의로 만들지 말고 이 표에 먼저 추가** (= 어휘 확장 규칙). 추가 시 "매핑할 catalog 컴포넌트"가 있어야 함.
- 슬롯 표기: `이름` 필수, `이름?` 선택, `이름[]` 배열.
