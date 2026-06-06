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
  "gd-plan-design",
  "gd-plan-sitemap",
  "gd-plan-page",
  "gd-plan-flows",
  "gd-plan-rules",
  "gd-plan-review",
];

// 길이 cap: 기본 400, review 예외 600 (spec NFR)
const CAP_DEFAULT = 400;
const CAP_EXCEPTION = 600;
const EXCEPTION_SKILLS = new Set(["gd-plan-review"]);

function read(skill: string): string {
  return readFileSync(join(PLANS, `${skill}.md`), "utf-8");
}

describe("gd-plan skills", () => {
  it("7개 스킬이 모두 존재한다", () => {
    for (const s of EXPECTED_SKILLS) {
      expect(existsSync(join(PLANS, `${s}.md`)), `${s}.md 누락`).toBe(true);
    }
  });

  it("plans/ 에 gd-plan-*.md 가 정확히 8개다 (군더더기 없음)", () => {
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
