import { describe, it, expect } from "vitest";
import {
  parseQuickColorReference,
  extractFonts,
  buildSwatchFragment,
  type Swatch,
} from "../src/build-swatches";

const SAMPLE = `# Design System Inspired by Acme

## 3. Typography Rules

### Font Family
- **Display**: \`Cal Sans\` — geometric
- **Body**: \`Inter\`

## 9. Agent Prompt Guide

### Quick Color Reference
- Primary Text: Charcoal (\`#242424\`)
- Background: Pure White (\`#ffffff\`)
- CTA Button: Charcoal (\`#242424\`) bg, white text
- Vague Note: no hex here at all
`;

describe("parseQuickColorReference", () => {
  it("§9 Quick Color Reference 의 라벨+hex 를 추출한다", () => {
    const colors = parseQuickColorReference(SAMPLE);
    const hexes = colors.map((c) => c.hex);
    expect(hexes).toContain("#242424");
    expect(hexes).toContain("#ffffff");
  });

  it("hex 없는 줄은 건너뛴다 (부분 렌더)", () => {
    const colors = parseQuickColorReference(SAMPLE);
    expect(colors.every((c) => /^#[0-9a-fA-F]{3,8}$/.test(c.hex))).toBe(true);
    expect(colors.some((c) => /Vague Note/.test(c.label))).toBe(false);
  });

  it("Quick Color Reference 블록이 없으면 빈 배열", () => {
    expect(parseQuickColorReference("# 빈 문서\n\n## 1. Theme\n내용")).toEqual([]);
  });
});

describe("extractFonts", () => {
  it("폰트명을 라벨로 추출한다(실제 폰트 로드 아님)", () => {
    const fonts = extractFonts(SAMPLE);
    expect(fonts).toContain("Cal Sans");
    expect(fonts).toContain("Inter");
  });
});

describe("buildSwatchFragment", () => {
  it("팔레트 hex 와 폰트명을 포함한 HTML fragment 를 만든다", () => {
    const html = buildSwatchFragment("acme.md", SAMPLE);
    expect(html).toContain("#242424");
    expect(html).toContain("Cal Sans");
    expect(html).toContain("acme"); // 후보명 캡션
  });

  it("추출값을 HTML 이스케이프해 마크업 주입을 막는다 (안전)", () => {
    const malicious = SAMPLE.replace("Charcoal", "<script>alert(1)</script>");
    const html = buildSwatchFragment("evil.md", malicious);
    expect(html).not.toContain("<script>alert(1)</script>");
    expect(html).toContain("&lt;script&gt;");
  });
});
