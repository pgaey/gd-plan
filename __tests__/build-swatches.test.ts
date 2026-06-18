import { describe, it, expect } from "vitest";
import {
  parseQuickColorReference,
  extractFonts,
  extractShadow,
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

describe("extractShadow", () => {
  it("중첩 rgba() 괄호가 있는 멀티레이어 shadow 를 잘리지 않게 캡처한다", () => {
    const md = "card with multi-layered shadow (0px 1px 5px -4px rgba(19,19,22,0.7), 0px 0px 0px 1px rgba(34,42,53,0.08)), 12px radius";
    const shadow = extractShadow(md);
    expect(shadow).toBeDefined();
    // rgba 중간에서 잘리면 안 됨 → 여는/닫는 괄호 수 일치(유효 CSS)
    const opens = (shadow!.match(/\(/g) ?? []).length;
    const closes = (shadow!.match(/\)/g) ?? []).length;
    expect(opens).toBe(closes);
    expect(shadow).toContain("rgba(19,19,22,0.7)");
  });

  it("shadow 가 없으면 undefined", () => {
    expect(extractShadow("플랫 디자인, 그림자 없음")).toBeUndefined();
  });
});

describe("buildSwatchFragment", () => {
  it("생성된 버튼 box-shadow 의 괄호가 균형을 이룬다 (유효 CSS)", () => {
    const md = SAMPLE + "\n버튼 shadow (0px 1px 5px -4px rgba(19,19,22,0.7)), 8px radius\n";
    const html = buildSwatchFragment("acme.md", md);
    const style = html.match(/<button style="([^"]*)"/)?.[1] ?? "";
    const opens = (style.match(/\(/g) ?? []).length;
    const closes = (style.match(/\)/g) ?? []).length;
    expect(opens).toBe(closes);
  });

  it("팔레트 hex 와 폰트명을 포함한 HTML fragment 를 만든다", () => {
    const html = buildSwatchFragment("acme.md", SAMPLE);
    expect(html).toContain("#242424");
    expect(html).toContain("Cal Sans");
    expect(html).toContain("acme"); // 후보명 캡션
  });

  it("출력 필드(라벨)의 추출값을 HTML 이스케이프해 마크업 주입을 막는다 (안전)", () => {
    // 라벨은 fragment 에 출력되는 필드 → 주입 시 이스케이프돼야 함
    const malicious = SAMPLE.replace("Primary Text", "<script>alert(1)</script>");
    const html = buildSwatchFragment("evil.md", malicious);
    expect(html).not.toContain("<script>alert(1)</script>");
    expect(html).toContain("&lt;script&gt;");
  });
});
