import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const PLANS = join(__dirname, "..", "plans");
const TEMPLATES = join(__dirname, "..", "templates");

const EXPECTED_SKILLS = [
  "gd-plan-start",
  "gd-plan-prd",
  "gd-plan-critique",
  "gd-plan-design",
  "gd-plan-sitemap",
  "gd-plan-page",
  "gd-plan-flows",
  "gd-plan-rules",
  "gd-plan-review",
];

// 길이 cap: 기본 400, review/critique 예외 600 (spec NFR — 복잡 스킬)
const CAP_DEFAULT = 400;
const CAP_EXCEPTION = 600;
const EXCEPTION_SKILLS = new Set(["gd-plan-review", "gd-plan-critique"]);

function read(skill: string): string {
  return readFileSync(join(PLANS, `${skill}.md`), "utf-8");
}

describe("gd-plan skills", () => {
  it("7개 스킬이 모두 존재한다", () => {
    for (const s of EXPECTED_SKILLS) {
      expect(existsSync(join(PLANS, `${s}.md`)), `${s}.md 누락`).toBe(true);
    }
  });

  it("plans/ 에 gd-plan-*.md 가 정확히 9개다 (군더더기 없음)", () => {
    const files = readdirSync(PLANS).filter((f) => f.startsWith("gd-plan-") && f.endsWith(".md"));
    expect(files.sort()).toEqual(EXPECTED_SKILLS.map((s) => `${s}.md`).sort());
  });

  it("각 스킬은 frontmatter(name/description)를 가진다", () => {
    for (const s of EXPECTED_SKILLS) {
      const body = read(s);
      expect(body.startsWith("---\n"), `${s}: frontmatter 시작 없음`).toBe(true);
      expect(body).toMatch(new RegExp(`name:\\s*${s}\\b`));
      expect(body).toMatch(/description:\s*\S/);
    }
  });

  it("인터뷰/생성 스킬은 진행률 출력 라인을 가진다 (start 제외 전 스킬 + start)", () => {
    // 모든 스킬은 "전체 진행률" 문구를 종료 안내에 포함
    for (const s of EXPECTED_SKILLS) {
      expect(read(s)).toContain("전체 진행률");
    }
  });

  it("산출 스킬은 '다음 단계: /gd-plan-' 안내를 가진다", () => {
    // review 는 마지막이라 다음 단계가 /gd-chat — 별도. 나머지는 /gd-plan-<next>
    for (const s of ["gd-plan-start", "gd-plan-prd", "gd-plan-design", "gd-plan-sitemap", "gd-plan-page", "gd-plan-flows", "gd-plan-rules"]) {
      expect(read(s), `${s}: 다음 단계 안내 없음`).toMatch(/다음 단계:/);
    }
  });

  it("길이 cap 준수 (기본 400, structure/review 600)", () => {
    for (const s of EXPECTED_SKILLS) {
      const lines = read(s).split("\n").length;
      const cap = EXCEPTION_SKILLS.has(s) ? CAP_EXCEPTION : CAP_DEFAULT;
      expect(lines, `${s}: ${lines}줄 > cap ${cap}`).toBeLessThanOrEqual(cap);
    }
  });

  it("템플릿 4종 + section-taxonomy 가 존재한다 (design.md 은 collection 픽)", () => {
    for (const t of ["prd.md", "structure.md", "ui-rules.md", "section-taxonomy.md"]) {
      expect(existsSync(join(TEMPLATES, t)), `templates/${t} 누락`).toBe(true);
    }
    expect(existsSync(join(TEMPLATES, "flows", "_name.md")), "flows/_name.md 누락").toBe(true);
    // design.md 템플릿은 없어야 한다 (collection 픽킹)
    expect(existsSync(join(TEMPLATES, "design.md"))).toBe(false);
  });

  it("인터뷰 스킬 5종은 결정 기록 참조(decisions.md + ADR-011 정본)를 가진다", () => {
    // B: 규칙 본문은 ADR-011/템플릿 정본, 스킬은 짧은 참조만 (spec-01-03)
    for (const s of ["gd-plan-prd", "gd-plan-design", "gd-plan-sitemap", "gd-plan-page", "gd-plan-rules"]) {
      const body = read(s);
      expect(body, `${s}: decisions.md 참조 없음`).toContain("decisions.md");
      expect(body, `${s}: ADR-011 정본 참조 없음`).toContain("ADR-011");
    }
  });

  it("page·prd 는 수동 보강 안내를 가진다 (fork 밖 결정)", () => {
    for (const s of ["gd-plan-prd", "gd-plan-page"]) {
      expect(read(s), `${s}: 수동 보강 안내 없음`).toContain("수동 보강");
    }
  });

  it("gd-plan-start 대시보드가 새 구조(sitemap + pages)를 인식한다", () => {
    const body = read("gd-plan-start");
    expect(body).toContain("/gd-plan-sitemap");
    expect(body).toContain("pages/");
    expect(body, "구 structure 참조 잔존").not.toContain("docs/structure.md");
  });
});

describe("spec-01-05: gd-plan-prd 제약/규제 슬롯 + version bump", () => {
  it("gd-plan-prd 가 제약/규제 질문을 capability ID 규칙(§4) 앞에 가진다", () => {
    const body = read("gd-plan-prd");
    expect(body, "제약 질문 없음").toMatch(/제약/);
    expect(body, "규제 어휘 없음").toMatch(/규제/);
    const idxConstraint = body.indexOf("제약");
    const idxCapRule = body.indexOf("## §4");
    expect(idxConstraint, "제약 질문 없음").toBeGreaterThan(-1);
    expect(idxCapRule, "§4 capability 규칙 없음").toBeGreaterThan(-1);
    expect(idxConstraint, "제약 질문이 capability 정의보다 뒤 (앞이어야 함)").toBeLessThan(idxCapRule);
  });

  it("gd-plan-prd 종료가 prd frontmatter version bump 를 지시한다", () => {
    const body = read("gd-plan-prd");
    expect(body, "version bump 지시 없음").toMatch(/version[\s\S]{0,40}(bump|\+\s*1|증가|올린)/i);
  });
});

describe("spec-01-05: gd-plan-critique 스킬", () => {
  const body = () => read("gd-plan-critique");

  it("독립 서브에이전트(Opus, general-purpose)를 강제하고 침묵 self-review 를 금지한다 (FR1·§F)", () => {
    const b = body();
    expect(b, "서브에이전트 지시 없음").toMatch(/서브에이전트|subagent/i);
    expect(b, "Opus 지정 없음").toMatch(/opus/i);
    expect(b, "general-purpose 타입 없음").toMatch(/general-purpose/);
    expect(b, "침묵 self-review 금지 불변식 없음").toMatch(/self-review|자가\s*점검|self review/i);
    expect(b, "정직성 배너/폴백 없음").toMatch(/배너|폴백|fallback/i);
  });

  it("3렌즈(L1·L2·L3)와 tie-break 규칙을 가진다 (§C)", () => {
    const b = body();
    for (const lens of ["L1", "L2", "L3"]) {
      expect(b, `${lens} 렌즈 없음`).toContain(lens);
    }
    expect(b, "tie-break 우선순위 없음").toMatch(/tie-break|우선순위|L2.*L1.*L3/i);
  });

  it("severity 루브릭(4단)과 _critique.md 보고서 스키마(prdVersion)를 정의한다 (§B)", () => {
    const b = body();
    expect(b, "severity 단계 없음").toMatch(/치명/);
    expect(b, "_critique.md 산출 없음").toContain("_critique.md");
    expect(b, "prdVersion frontmatter 없음").toContain("prdVersion");
  });

  it("입력 범위(prd.md)·보고서 only·사람 반영(decisions.md)을 명시한다 (§A·FR3·4)", () => {
    const b = body();
    expect(b, "prd.md 입력 없음").toContain("prd.md");
    expect(b, "보고서 only(직접 수정 금지) 없음").toMatch(/직접\s*수정|보고서만|보고서 only/);
    expect(b, "decisions.md 반영 기록 없음").toContain("decisions.md");
  });

  it("L2 grounding 이 선언된 제약슬롯을 1차 소스로 쓴다 (§D)", () => {
    const b = body();
    expect(b, "제약/규제 grounding 없음").toMatch(/제약/);
    expect(b, "grounding 개념 없음").toMatch(/grounding|근거|1차/i);
  });
});

describe("spec-01-05: 통합 표면 (design soft-gate · start 상태 · _critique 위생)", () => {
  it("gd-plan-design 진입이 critique 미실행/stale 을 경고한다 (soft-gate, BLOCK 아님)", () => {
    const b = read("gd-plan-design");
    expect(b, "critique 참조 없음").toMatch(/critique/i);
    expect(b, "version 비교 없음").toMatch(/version|prdVersion/);
    expect(b, "경고/권장(비차단) 명시 없음").toMatch(/경고|권장/);
  });

  it("gd-plan-start 가 critique 상태(미실행/stale/완료)를 표시한다", () => {
    const b = read("gd-plan-start");
    expect(b, "critique 상태 표시 없음").toMatch(/critique/i);
  });

  it("gd-plan-start·gd-plan-review 가 _critique.md 를 auto-load 모델에서 무시한다 (위생)", () => {
    for (const s of ["gd-plan-start", "gd-plan-review"]) {
      const b = read(s);
      expect(b, `${s}: _critique 무시 명시 없음`).toMatch(/_critique[\s\S]{0,60}(무시|제외|본문은 안)/);
    }
  });
});

describe("spec-01-04: flows full re-derive + 신모델 참조", () => {
  it("gd-plan-flows 는 구 평면 docs/structure.md 를 참조하지 않는다", () => {
    expect(read("gd-plan-flows"), "구 structure 참조 잔존").not.toContain("docs/structure.md");
  });

  it("gd-plan-flows 는 신모델(sitemap + pages)을 참조한다", () => {
    const body = read("gd-plan-flows");
    expect(body).toContain("sitemap.md");
    expect(body, "pages/ 참조 없음").toContain("pages/");
  });

  it("gd-plan-flows 는 full re-derive 자동 역참조 지시문을 가진다", () => {
    const body = read("gd-plan-flows");
    expect(body, "flows: 필드 언급 없음").toContain("flows:");
    expect(body, "재계산/덮어쓰기 지시 없음").toMatch(/재계산|덮어/);
    expect(body, "정렬 규칙 없음").toContain("정렬");
    expect(body, "ADR-012 참조 없음").toContain("ADR-012");
  });

  it("templates/flows/_name.md 는 'structure.md sitemap' 잔재가 없다", () => {
    const body = readFileSync(join(TEMPLATES, "flows", "_name.md"), "utf-8");
    expect(body, "구 structure.md sitemap 표현 잔존").not.toContain("structure.md sitemap");
  });

  it("templates/pages/structure.md flows 주석이 ADR-012 로 정정됐다", () => {
    const body = readFileSync(join(TEMPLATES, "pages", "structure.md"), "utf-8");
    expect(body, "ADR-009 오참조 잔존").not.toContain("ADR-009");
    expect(body, "ADR-012 참조 없음").toContain("ADR-012");
  });
});

describe("spec-01-04: review 신모델 + ID 체인 소비", () => {
  it("gd-plan-review 는 구 평면 docs/structure.md 를 참조하지 않는다", () => {
    expect(read("gd-plan-review"), "구 structure 참조 잔존").not.toContain("docs/structure.md");
  });

  it("gd-plan-review 는 신모델(sitemap + pages)을 로딩한다", () => {
    const body = read("gd-plan-review");
    expect(body).toContain("sitemap.md");
    expect(body, "pages/ 참조 없음").toContain("pages/");
  });

  it("gd-plan-review 는 frontmatter ID 체인(covers/flows/parent)을 소비한다", () => {
    const body = read("gd-plan-review");
    expect(body).toContain("covers");
    expect(body).toContain("flows");
    expect(body, "parent 체인 없음").toContain("parent");
  });

  it("gd-plan-review 는 결정 로그(decisions.md) '연결' 열 무결성 점검을 한다", () => {
    const body = read("gd-plan-review");
    expect(body, "결정 로그 decisions.md 로딩 없음").toContain("decisions.md");
    expect(body, "결정 연결 열 소비 없음").toContain("연결");
  });
});

describe("spec-01-04: design/rules stale 참조 정상화", () => {
  it("gd-plan-design 의 다음 단계가 /gd-plan-sitemap 이다 (없어진 /gd-plan-structure 아님)", () => {
    const body = read("gd-plan-design");
    expect(body, "/gd-plan-sitemap 안내 없음").toContain("/gd-plan-sitemap");
    expect(body, "없어진 /gd-plan-structure 참조 잔존").not.toContain("/gd-plan-structure");
  });

  it("gd-plan-rules 는 구 평면 docs/structure.md 대신 신모델(pages)을 참조한다", () => {
    const body = read("gd-plan-rules");
    expect(body, "구 structure 참조 잔존").not.toContain("docs/structure.md");
    expect(body, "pages/ 참조 없음").toContain("pages/");
  });
});
