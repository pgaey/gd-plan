import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const DESIGN_SKILL = join(__dirname, "..", "plans", "gd-plan-design.md");

/**
 * spec-02-01 — design 스킬 소비자 모드 규약 테스트.
 *
 * 스킬은 마크다운 지시문이므로 동작을 직접 실행할 수 없다.
 * 대신 규약 문구·경로의 존재/부재를 고정해 회귀를 막는다 (skills.test.ts idiom).
 */
describe("gd-plan-design 소비자 모드 규약 (spec-02-01)", () => {
  const body = readFileSync(DESIGN_SKILL, "utf-8");

  it("소비자 컬렉션 경로(.gd/design-md-collection/)를 안내한다", () => {
    expect(body).toContain(".gd/design-md-collection/");
  });

  it("dev 경로(design-md-collection/_index.json)를 유지한다 (dev 회귀 방지)", () => {
    expect(body).toContain("design-md-collection/_index.json");
  });

  it("사문 명령이 없고 실존 명령(pnpm build-index)을 안내한다", () => {
    expect(body).not.toContain("pnpm gd plan refresh-index");
    expect(body).toContain("pnpm build-index");
  });

  it("원본 로드에 .md 중복 부착 패턴(<file>.md)이 없다 (cal.md.md 사고 방지)", () => {
    // 인덱스 file 필드가 이미 확장자 포함("cal.md") — "<file>.md" 지시는 cal.md.md 를 만든다
    expect(body).not.toMatch(/<file>\.md/);
  });

  it("픽 절차에 네트워크 fetch 지시가 없다 (전체 동봉 — 오프라인 보장, NFR3)", () => {
    expect(body).not.toMatch(/curl|raw\.githubusercontent|fetch\b/i);
  });
});
