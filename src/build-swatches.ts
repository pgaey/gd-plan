#!/usr/bin/env node
import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * design-md-collection 스와치 빌더 (spec-04-01, ADR-019).
 *
 * 각 collection .md → 무드 스와치 HTML fragment (`_swatches/<name>.html`).
 * **빌드타임 1회 생성·커밋** → 런타임(gd-plan-design)은 픽된 3개를 읽어 결합만 (node 불필요).
 * `build-index` 와 동일한 "dev 빌드 → 소비자 node-free" 패턴.
 *
 * 결정성: 같은 .md → 같은 fragment. 폰트는 **이름 라벨 + 균일 폴백**(실제 폰트 로드 안 함)
 * — 독점/오픈소스 차등 렌더로 인한 픽 편향 제거(critique). 팔레트는 §9 Quick Color
 * Reference 를 정본으로 결정적 파싱.
 */

export interface PaletteColor {
  label: string;
  hex: string;
}

export interface Swatch {
  file: string;
  html: string;
}

/** HTML 이스케이프 — 추출값을 마크업이 아닌 텍스트/CSS 값으로만 취급 (안전) */
export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const HEX_RE = /^#[0-9a-fA-F]{3,8}$/;

/** ### Quick Color Reference 하위 블록 슬라이스 (다음 ### 또는 ## 전까지) */
function sliceQuickColorRef(md: string): string {
  const lines = md.split("\n");
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^###\s+Quick Color Reference/i.test(lines[i] ?? "")) {
      start = i;
      break;
    }
  }
  if (start === -1) return "";
  const out: string[] = [];
  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i] ?? "";
    if (/^#{2,3}\s/.test(line)) break;
    out.push(line);
  }
  return out.join("\n");
}

/**
 * §9 Quick Color Reference 파싱.
 * `- <Label>: <Name> (`#hex`)` 규칙. hex 없는 줄은 건너뛴다(부분 렌더).
 */
export function parseQuickColorReference(md: string): PaletteColor[] {
  const block = sliceQuickColorRef(md);
  if (!block) return [];
  const out: PaletteColor[] = [];
  for (const raw of block.split("\n")) {
    const line = raw.trim();
    if (!line.startsWith("-")) continue;
    const item = line.replace(/^[-*]\s*/, "");
    const colon = item.indexOf(":");
    if (colon === -1) continue;
    const label = item.slice(0, colon).trim();
    const hexMatch = item.match(/#[0-9a-fA-F]{3,8}\b/);
    if (!label || !hexMatch) continue;
    const hex = hexMatch[0];
    if (!HEX_RE.test(hex)) continue;
    out.push({ label, hex });
  }
  return out;
}

/** 백틱 폰트명 추출(라벨 용도). 실제 폰트 로드 아님. */
export function extractFonts(md: string): string[] {
  const ticks = [...md.matchAll(/`([^`]+)`/g)].map((m) => (m[1] ?? "").trim());
  const fonts = ticks.filter(
    (t) => /^[A-Z][A-Za-z0-9 .-]{1,30}$/.test(t) && !t.startsWith("#"),
  );
  return [...new Set(fonts)].slice(0, 2);
}

/** best-effort: "Npx radius" 첫 매치 (없으면 undefined) */
export function extractRadius(md: string): string | undefined {
  const m = md.match(/(\d{1,3})px\s+radius/i);
  return m ? `${m[1]}px` : undefined;
}

/**
 * best-effort: shadow 괄호 안 값 (없으면 undefined).
 * 멀티레이어 shadow 는 중첩 rgba() 괄호를 가지므로, **한 단계 중첩까지 허용**하는
 * 균형 캡처를 쓴다(`[^)]*` 는 첫 inner `)` 에서 잘려 깨진 CSS 를 만든다).
 */
export function extractShadow(md: string): string | undefined {
  const m = md.match(/shadow\s*\(((?:[^()]|\([^()]*\))*)\)/i);
  if (!m || !m[1] || !/rgba|rgb|#|px/i.test(m[1])) return undefined;
  return m[1].replace(/`/g, "").replace(/\s+/g, " ").trim();
}

/** collection .md → 무드 스와치 HTML fragment (자족 <section>) */
export function buildSwatchFragment(file: string, md: string): string {
  const name = file.replace(/\.md$/i, "");
  const colors = parseQuickColorReference(md);
  const fonts = extractFonts(md);
  const radius = extractRadius(md);
  const shadow = extractShadow(md);

  // 버튼 배경 = CTA/Primary 계열 첫 색, 없으면 첫 색
  const cta =
    colors.find((c) => /cta|button|primary/i.test(c.label)) ?? colors[0];
  const surface =
    colors.find((c) => /background|surface|white/i.test(c.label))?.hex ?? "#ffffff";
  const text =
    colors.find((c) => /text|charcoal|primary/i.test(c.label))?.hex ?? "#111111";

  const chips = colors
    .map(
      (c) =>
        `      <div class="chip"><span class="sw" style="background:${escapeHtml(
          c.hex,
        )}"></span><code>${escapeHtml(c.hex)}</code><small>${escapeHtml(
          c.label,
        )}</small></div>`,
    )
    .join("\n");

  const fontLabel = fonts.length
    ? fonts.map((f) => escapeHtml(f)).join(" · ")
    : "see source";

  const btnStyle = [
    `background:${escapeHtml(cta?.hex ?? "#111111")}`,
    "color:#fff",
    "padding:10px 18px",
    "border:0",
    radius ? `border-radius:${escapeHtml(radius)}` : "border-radius:6px",
    shadow ? `box-shadow:${escapeHtml(shadow)}` : "",
    "font:inherit",
  ]
    .filter(Boolean)
    .join(";");

  return `<section class="gd-swatch" style="background:${escapeHtml(
    surface,
  )};color:${escapeHtml(
    text,
  )};border:1px solid #e5e5e5;border-radius:10px;padding:20px;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif">
  <h3 style="margin:0 0 4px">${escapeHtml(name)}</h3>
  <div class="palette" style="display:flex;flex-wrap:wrap;gap:8px;margin:12px 0">
${chips || "      <small>(팔레트 추출 불가 — 원본 참조)</small>"}
  </div>
  <div class="type" style="margin:12px 0">
    <div style="font-size:28px;font-weight:600;line-height:1.1">Aa 제목 specimen</div>
    <div style="font-size:14px;opacity:.7">본문 텍스트 — the quick brown fox</div>
    <small style="opacity:.6">폰트(라벨, 실제 렌더 아님): ${fontLabel}</small>
  </div>
  <button style="${btnStyle}">CTA 버튼</button>
</section>`;
}

/** 디렉토리의 .md (README/_index/_swatches 제외) → Swatch[] */
export function buildSwatches(collectionDir: string): Swatch[] {
  if (!existsSync(collectionDir)) return [];
  const files = readdirSync(collectionDir)
    .filter((f) => f.endsWith(".md") && f.toLowerCase() !== "readme.md")
    .sort();
  return files.map((f) => ({
    file: f,
    html: buildSwatchFragment(f, readFileSync(join(collectionDir, f), "utf-8")),
  }));
}

/** _swatches/<name>.html 들을 collectionDir 아래에 쓴다 */
export function writeSwatches(collectionDir: string): Swatch[] {
  const swatches = buildSwatches(collectionDir);
  const outDir = join(collectionDir, "_swatches");
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  for (const s of swatches) {
    writeFileSync(join(outDir, s.file.replace(/\.md$/i, ".html")), s.html + "\n", "utf-8");
  }
  return swatches;
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  const fromArg = process.argv[2];
  const collectionDir = fromArg ?? join(__dirname, "..", "design-md-collection");
  if (!existsSync(collectionDir)) {
    console.error(`❌ collection 디렉토리를 찾을 수 없습니다: ${collectionDir}`);
    process.exit(1);
  }
  const swatches = writeSwatches(collectionDir);
  console.log(`✓ 스와치 빌드 완료 — ${swatches.length} fragments → ${join(collectionDir, "_swatches")}`);
}
