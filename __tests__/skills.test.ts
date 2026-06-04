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
});
