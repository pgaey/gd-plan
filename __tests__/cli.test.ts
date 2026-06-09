import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, existsSync, mkdirSync, writeFileSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { installPlans } from "../src/cli";

/**
 * Task 1 smoke test — 설치 *메커니즘* 만 검증한다 (fixture plansSrc 사용).
 * 실제 gd-plan 스킬 9개의 존재·포맷 검증은 skills.test.ts 소관.
 */
describe("gd-plan installPlans (mechanism)", () => {
  let tempDir: string;
  let srcDir: string;
  let destDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), "gd-plan-test-"));
    srcDir = join(tempDir, "plans");
    destDir = join(tempDir, ".claude", "commands");
    mkdirSync(srcDir, { recursive: true });
    // fixture: 더미 스킬 2개 + 무관 파일 1개
    writeFileSync(join(srcDir, "gd-plan-start.md"), "# start\n");
    writeFileSync(join(srcDir, "gd-plan-prd.md"), "# prd\n");
    writeFileSync(join(srcDir, "README.md"), "ignore me\n");
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it("plans/ 의 gd-plan-*.md 만 .claude/commands/ 로 설치한다 (README 제외)", () => {
    const result = installPlans({ plansSrc: srcDir, dest: destDir });
    expect(result.code).toBe(0);
    expect(result.installed.sort()).toEqual(["gd-plan-prd.md", "gd-plan-start.md"]);
    expect(existsSync(join(destDir, "gd-plan-start.md"))).toBe(true);
    expect(existsSync(join(destDir, "README.md"))).toBe(false);
  });

  it("이미 존재하는 파일은 --force 없이 스킵한다 (idempotent)", () => {
    mkdirSync(destDir, { recursive: true });
    writeFileSync(join(destDir, "gd-plan-start.md"), "EXISTING");
    const result = installPlans({ plansSrc: srcDir, dest: destDir, force: false });
    expect(result.skipped).toContain("gd-plan-start.md");
    expect(result.installed).toContain("gd-plan-prd.md");
  });

  it("--force 면 기존 파일을 덮어쓴다", () => {
    mkdirSync(destDir, { recursive: true });
    writeFileSync(join(destDir, "gd-plan-start.md"), "EXISTING");
    const result = installPlans({ plansSrc: srcDir, dest: destDir, force: true });
    expect(result.installed).toContain("gd-plan-start.md");
    expect(result.skipped).toHaveLength(0);
  });

  it("source 디렉토리가 없으면 code 1 을 반환한다", () => {
    const result = installPlans({ plansSrc: join(tempDir, "nonexistent"), dest: destDir });
    expect(result.code).toBe(1);
  });
});
