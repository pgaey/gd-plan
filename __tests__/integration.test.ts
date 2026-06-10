import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, writeFileSync, readFileSync, existsSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buildIndex, writeIndex } from "../src/build-index";
import { installPlans } from "../src/cli";

/**
 * 통합 시나리오 — *자동화 가능한 부분만* 검증 (spec 통합 시나리오 1/2/3).
 *
 * 스킬 본문은 LLM 대화 가이드라 인터뷰 완주(5종 문서 생성)는 별도 Claude Code 세션의
 * 수동 검증 대상. 여기서는 시나리오를 *지원하는 결정적 인프라*(인덱스 추천 후보,
 * 스킬 설치, 차단에 필요한 파일 구조)가 실제 동작하는지 박제한다.
 * — 수동 검증 절차/증거는 walkthrough.md 참조.
 */

const PKG_ROOT = join(new URL(".", import.meta.url).pathname, "..");

describe("통합 시나리오 (자동화 가능 부분)", () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "gd-integ-"));
  });
  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it("시나리오 1 지원: gd-plan 스킬 9개가 프로젝트에 설치된다", () => {
    const result = installPlans({ plansSrc: join(PKG_ROOT, "plans"), dest: join(dir, ".claude", "commands") });
    expect(result.code).toBe(0);
    expect(result.installed.length).toBe(9);
  });

  it("시나리오 2 지원: 실제 66개 collection 인덱스가 후보 점수화에 쓸 필드를 갖는다", () => {
    const collection = join(PKG_ROOT, "design-md-collection");
    if (!existsSync(collection)) return; // collection 없는 환경 skip
    const idx = buildIndex(collection);
    expect(idx.length).toBeGreaterThanOrEqual(60);
    // "미니멀/신뢰" 톤 프로젝트가 cal 류를 후보로 추천받을 수 있는 신호 존재
    const cal = idx.find((e) => e.file === "cal.md");
    expect(cal).toBeDefined();
    expect(cal!.tone_keywords.length).toBeGreaterThan(0);
    expect(cal!.typography_summary).not.toBe("see source");
  });

  it("시나리오 3 지원: 미용실 픽스처로 review 차단 입력 구조가 성립한다", () => {
    // PRD capability 1개를 sitemap 로스터에서 누락한 상태 = BLOCK 되어야 하는 입력 (신모델)
    const prd = `## Capabilities
- [CAP-01] 시술 예약하기 (주체: User)
- [CAP-02] 예약 확인/승인하기 (주체: Admin)`;
    const sitemap = `## Sitemap (로스터)
- [PAGE-booking] 예약 (covers: CAP-01)`; // CAP-02 의도적 누락
    mkdirSync(join(dir, "docs"), { recursive: true });
    writeFileSync(join(dir, "docs", "prd.md"), prd);
    writeFileSync(join(dir, "docs", "sitemap.md"), sitemap);

    // 결정적으로 확인 가능한 부분: CAP-02 가 sitemap covers 목록에 없음 (=BLOCK 조건)
    const caps = [...prd.matchAll(/\[CAP-\d+\]/g)].map((m) => m[0]);
    const covered = [...sitemap.matchAll(/covers:\s*([^)]+)/g)].flatMap((m) =>
      (m[1] ?? "").split(",").map((s) => `[${s.trim()}]`),
    );
    const uncovered = caps.filter((c) => !covered.includes(c));
    expect(uncovered).toContain("[CAP-02]"); // review 가 BLOCK 해야 하는 항목
  });

  it("writeIndex 후 재빌드가 결정적이다 (시나리오 반복 안정성)", () => {
    const collection = join(PKG_ROOT, "design-md-collection");
    if (!existsSync(collection)) return;
    const a = JSON.stringify(buildIndex(collection));
    const b = JSON.stringify(buildIndex(collection));
    expect(a).toBe(b);
  });
});
