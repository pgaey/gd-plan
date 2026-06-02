import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, writeFileSync, existsSync, readFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buildIndex, type IndexEntry } from "../src/build-index";

const SAMPLE = `# Design System Inspired by Acme

## 1. Visual Theme & Atmosphere

Acme is a masterclass in monochromatic restraint — minimal, professional, and precise.
Built for productivity and dense data dashboards.

**Key Characteristics:**
- Purely grayscale palette, professional
- Dense layout for power users

## 2. Color Palette & Roles

### Primary
- **Charcoal** (\`#242424\`): Primary text
- **Link Blue** (\`#0099ff\`): single accent

## 3. Typography Rules

### Font Family
- **Headline**: \`Inter\`, geometric sans-serif
- **Body**: \`Inter\`

## 5. Layout Principles

### Spacing System
- Base unit: 8px
- Section vertical spacing: compact, dense grid
`;

describe("buildIndex", () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "gd-idx-"));
  });
  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it("collection 디렉토리의 .md 파일마다 1 entry 를 만든다", () => {
    writeFileSync(join(dir, "acme.md"), SAMPLE);
    writeFileSync(join(dir, "beta.md"), SAMPLE.replace("Acme", "Beta"));
    const entries = buildIndex(dir);
    expect(entries).toHaveLength(2);
    expect(entries.map((e) => e.file).sort()).toEqual(["acme.md", "beta.md"]);
  });

  it("README.md / _index.json / 비.md 는 제외한다", () => {
    writeFileSync(join(dir, "acme.md"), SAMPLE);
    writeFileSync(join(dir, "README.md"), "# readme");
    writeFileSync(join(dir, "_index.json"), "[]");
    writeFileSync(join(dir, "notes.txt"), "x");
    const entries = buildIndex(dir);
    expect(entries.map((e) => e.file)).toEqual(["acme.md"]);
  });

  it("각 entry 는 5개 필드를 모두 가진다", () => {
    writeFileSync(join(dir, "acme.md"), SAMPLE);
    const e = buildIndex(dir)[0]!;
    const keys = Object.keys(e).sort();
    expect(keys).toEqual(
      ["color_summary", "domain_keywords", "file", "layout_density", "tone_keywords", "typography_summary"].sort(),
    );
  });

  it("산문에서 tone/density 키워드를 추출한다", () => {
    writeFileSync(join(dir, "acme.md"), SAMPLE);
    const e = buildIndex(dir)[0]!;
    expect(e.tone_keywords).toContain("minimal");
    expect(e.tone_keywords).toContain("professional");
    expect(e.layout_density).toBe("dense");
  });

  it("typography_summary 에 폰트명이 들어간다", () => {
    writeFileSync(join(dir, "acme.md"), SAMPLE);
    const e = buildIndex(dir)[0]!;
    expect(e.typography_summary.toLowerCase()).toContain("inter");
  });

  it("결정적이다 — 같은 입력에 같은 출력", () => {
    writeFileSync(join(dir, "acme.md"), SAMPLE);
    expect(buildIndex(dir)).toEqual(buildIndex(dir));
  });

  it("writeIndex 는 _index.json 을 정렬된 순서로 쓴다", async () => {
    writeFileSync(join(dir, "zeta.md"), SAMPLE);
    writeFileSync(join(dir, "acme.md"), SAMPLE);
    const { writeIndex } = await import("../src/build-index");
    writeIndex(dir);
    const out = JSON.parse(readFileSync(join(dir, "_index.json"), "utf-8")) as IndexEntry[];
    expect(out.map((e) => e.file)).toEqual(["acme.md", "zeta.md"]);
  });
});
