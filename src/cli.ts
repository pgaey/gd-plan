#!/usr/bin/env node
import { existsSync, mkdirSync, copyFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PLANS_SRC = join(__dirname, "..", "plans");

export interface InstallResult {
  code: number;
  installed: string[];
  skipped: string[];
}

export interface InstallOptions {
  force?: boolean;
  /** override source dir (테스트용). 기본은 패키지의 plans/ */
  plansSrc?: string;
  /** override 설치 대상 (테스트용). 기본은 cwd/.claude/commands */
  dest?: string;
}

/**
 * plans/ 의 gd-plan-*.md 스킬을 프로젝트의 .claude/commands/ 로 설치한다.
 * idempotent: 이미 존재하면 --force 없이는 스킵.
 */
export function installPlans(opts: InstallOptions = {}): InstallResult {
  const force = opts.force ?? false;
  const src = opts.plansSrc ?? PLANS_SRC;
  const dest = opts.dest ?? join(process.cwd(), ".claude", "commands");

  if (!existsSync(src)) {
    return { code: 1, installed: [], skipped: [] };
  }

  mkdirSync(dest, { recursive: true });

  const files = readdirSync(src).filter((f) => f.startsWith("gd-plan-") && f.endsWith(".md"));
  const installed: string[] = [];
  const skipped: string[] = [];

  for (const file of files) {
    const target = join(dest, file);
    if (existsSync(target) && !force) {
      skipped.push(file);
      continue;
    }
    copyFileSync(join(src, file), target);
    installed.push(file);
  }

  return { code: 0, installed, skipped };
}

function green(s: string) { return `\x1b[32m${s}\x1b[0m`; }
function yellow(s: string) { return `\x1b[33m${s}\x1b[0m`; }
function bold(s: string) { return `\x1b[1m${s}\x1b[0m`; }
function dim(s: string) { return `\x1b[2m${s}\x1b[0m`; }

export function main(argv: string[]): number {
  const force = argv.includes("--force");

  console.log(`\n${bold("gd-plan")} — 상류 기획 스킬 설치기\n`);

  const result = installPlans({ force });

  if (result.code !== 0) {
    console.error("❌ plans/ 디렉토리를 찾을 수 없습니다. 패키지가 올바르게 빌드됐는지 확인하세요.");
    return 1;
  }

  if (result.installed.length > 0) {
    console.log(green("✅ 설치 완료:"));
    for (const f of result.installed) console.log(`   ${green("+")} .claude/commands/${f}`);
  }

  if (result.skipped.length > 0) {
    console.log(yellow("\n⏭  이미 존재 (스킵):"));
    for (const f of result.skipped) console.log(`   ${dim("·")} .claude/commands/${f}`);
    console.log(dim(`   덮어쓰려면: gd-plan --force`));
  }

  if (result.installed.length === 0 && result.skipped.length === 0) {
    console.log("설치할 스킬 파일이 없습니다.");
    return 0;
  }

  console.log(`
${bold("🚀 다음 단계:")} 상류 기획 인터뷰를 시작하세요:

   ${green("/gd-plan-start")}      — 진입점, docs/ 진행률 안내
   ${green("/gd-plan-prd")}        — PRD 인터뷰
   ${green("/gd-plan-critique")}   — PRD 전제 적대 검증 (의미 정합, 독립 서브에이전트)
   ${green("/gd-plan-design")}     — design-md-collection 픽킹
   ${green("/gd-plan-sitemap")}    — 사이트 골격/지도 (페이지 로스터)
   ${green("/gd-plan-page")}       — 페이지별 구조 (세로 슬라이스)
   ${green("/gd-plan-flows")}      — 사용자 여정
   ${green("/gd-plan-rules")}      — ui-rules 수치 확정
   ${green("/gd-plan-review")}     — 구조 일관성 검증
`);

  return 0;
}

// 직접 실행 시에만 main 호출 (테스트 import 시 부작용 없음)
const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  process.exit(main(process.argv.slice(2)));
}
