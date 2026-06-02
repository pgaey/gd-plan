#!/usr/bin/env node
import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

export interface IndexEntry {
  file: string;
  domain_keywords: string[];
  tone_keywords: string[];
  color_summary: string;
  typography_summary: string;
  layout_density: "dense" | "balanced" | "airy";
}

/**
 * design-md-collection 인덱스 빌더.
 *
 * collection 파일은 frontmatter 없는 순수 마크다운(9 섹션 표준 구조)이고
 * domain/tone/density 키워드가 산문에 인라인으로 존재한다 (critique ground-truth).
 * 따라서 LLM 없이 **결정적 휴리스틱**(섹션 슬라이스 + 키워드 사전 매칭)으로 추출한다.
 * — 같은 입력에 항상 같은 출력 (테스트 안정성 + 회귀 가능).
 *
 * collection-scanner(Sonnet)는 이 인덱스로 후보 3을 좁힌 뒤에만 원본 파일을 풀로드한다.
 */

const TONE_VOCAB = [
  "minimal", "minimalist", "bold", "playful", "professional", "elegant",
  "warm", "cold", "precise", "refined", "luxurious", "premium", "friendly",
  "approachable", "editorial", "technical", "clean", "modern", "retro",
  "monochromatic", "vibrant", "muted", "energetic", "calm", "trustworthy",
  "futuristic", "organic", "geometric", "sophisticated", "confident",
];

const DOMAIN_VOCAB = [
  "productivity", "dashboard", "data", "finance", "fintech", "ecommerce",
  "saas", "developer", "marketing", "landing", "portfolio", "social",
  "media", "scheduling", "automotive", "luxury", "travel", "healthcare",
  "education", "ai", "crypto", "analytics", "enterprise", "consumer",
  "admin", "documentation", "design-tool", "collaboration",
];

const DENSE_HINTS = ["dense", "compact", "power user", "data-heavy", "tight", "information-dense"];
const AIRY_HINTS = ["generous", "spacious", "airy", "editorial", "breathing", "whitespace", "roomy"];

/** 특정 섹션(## n. Title)의 본문을 다음 동급 헤딩 전까지 슬라이스 */
function sliceSection(md: string, titlePattern: RegExp): string {
  const lines = md.split("\n");
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? "";
    if (/^##\s/.test(line) && titlePattern.test(line)) {
      start = i;
      break;
    }
  }
  if (start === -1) return "";
  const out: string[] = [];
  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i] ?? "";
    if (/^##\s/.test(line) && !/^###/.test(line)) break;
    out.push(line);
  }
  return out.join("\n");
}

function matchVocab(text: string, vocab: string[]): string[] {
  const lower = text.toLowerCase();
  const found: string[] = [];
  for (const term of vocab) {
    // 단어 경계 매칭 (부분 단어 오탐 방지)
    const re = new RegExp(`\\b${term.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\\b`, "i");
    if (re.test(lower)) found.push(term);
  }
  return found;
}

function detectDensity(layoutText: string, themeText: string): IndexEntry["layout_density"] {
  const hay = (layoutText + " " + themeText).toLowerCase();
  const dense = DENSE_HINTS.some((h) => hay.includes(h));
  const airy = AIRY_HINTS.some((h) => hay.includes(h));
  if (dense && !airy) return "dense";
  if (airy && !dense) return "airy";
  return "balanced";
}

function firstFonts(typographyText: string): string {
  // `Inter`, `Cal Sans` 같은 백틱 폰트명 우선 추출
  const ticks = [...typographyText.matchAll(/`([^`]+)`/g)].map((m) => m[1] ?? "");
  const fonts = ticks.filter((t) => /^[A-Z][A-Za-z0-9 .-]{1,30}$/.test(t) && !t.startsWith("#"));
  const uniq = [...new Set(fonts)].slice(0, 3);
  return uniq.join(", ");
}

function colorOneLine(colorText: string): string {
  // §2 Primary 의 첫 굵은 항목 + accent 신호를 한 줄 요약
  const bolds = [...colorText.matchAll(/\*\*([^*]+)\*\*/g)].map((m) => (m[1] ?? "").trim()).slice(0, 3);
  const mono = /grayscale|monochrom/i.test(colorText) ? "monochrome" : "";
  const accent = /single accent|one (?:blue|accent)|rare|only/i.test(colorText) ? "single accent" : "";
  const parts = [mono, accent, bolds.length ? `key: ${bolds.join("/")}` : ""].filter(Boolean);
  return parts.join("; ") || "see source";
}

export function buildIndexEntry(file: string, md: string): IndexEntry {
  const theme = sliceSection(md, /Visual Theme|Atmosphere/i) || md.slice(0, 1200);
  const color = sliceSection(md, /Color Palette|Color/i);
  const typography = sliceSection(md, /Typography/i);
  const layout = sliceSection(md, /Layout/i);

  const themeAndKeys = theme; // Key Characteristics 가 §1 안에 포함됨
  const tone = matchVocab(themeAndKeys, TONE_VOCAB);
  const domain = matchVocab(themeAndKeys + " " + layout, DOMAIN_VOCAB);

  return {
    file,
    domain_keywords: domain,
    tone_keywords: tone,
    color_summary: colorOneLine(color),
    typography_summary: firstFonts(typography) || "see source",
    layout_density: detectDensity(layout, theme),
  };
}

/** 디렉토리의 *.md (README/_index 제외) → 정렬된 IndexEntry[] */
export function buildIndex(collectionDir: string): IndexEntry[] {
  if (!existsSync(collectionDir)) return [];
  const files = readdirSync(collectionDir)
    .filter((f) => f.endsWith(".md") && f.toLowerCase() !== "readme.md")
    .sort();
  return files.map((f) => buildIndexEntry(f, readFileSync(join(collectionDir, f), "utf-8")));
}

/** _index.json 을 collectionDir 에 쓴다 */
export function writeIndex(collectionDir: string): IndexEntry[] {
  const entries = buildIndex(collectionDir);
  writeFileSync(join(collectionDir, "_index.json"), JSON.stringify(entries, null, 2) + "\n", "utf-8");
  return entries;
}

// 직접 실행: 기본 collection 경로 빌드 (gd-plan build 후 `node dist/build-index.js`)
const __dirname = dirname(fileURLToPath(import.meta.url));
const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  // dist/ 기준: <repo>/dist → <repo>/design-md-collection (standalone)
  const fromArg = process.argv[2];
  const collectionDir = fromArg ?? join(__dirname, "..", "design-md-collection");
  if (!existsSync(collectionDir)) {
    console.error(`❌ collection 디렉토리를 찾을 수 없습니다: ${collectionDir}`);
    process.exit(1);
  }
  const entries = writeIndex(collectionDir);
  console.log(`✓ _index.json 빌드 완료 — ${entries.length} entries → ${join(collectionDir, "_index.json")}`);
}
