import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const TEMPLATES = join(__dirname, "..", "templates");
const DECISIONS = join(__dirname, "..", "docs", "decisions");
const ADR_TYPES = new Set(["decision", "invariant", "convention", "tradeoff"]);

function readTpl(rel: string): string {
  return readFileSync(join(TEMPLATES, rel), "utf-8");
}

describe("세로 슬라이스 v2 템플릿 (spec-01-01)", () => {
  it("신규 템플릿 4종이 존재한다", () => {
    for (const t of ["sitemap.md", "pages/structure.md", "pages/decisions.md", "decisions.md"]) {
      expect(existsSync(join(TEMPLATES, t)), `templates/${t} 누락`).toBe(true);
    }
  });

  it("sitemap.md 은 자동관리 마커 + 로스터 표를 가진다", () => {
    const body = readTpl("sitemap.md");
    expect(body, "gd:pages:start 마커 없음").toContain("<!-- gd:pages:start -->");
    expect(body, "gd:pages:end 마커 없음").toContain("<!-- gd:pages:end -->");
    expect(body).toContain("covers");
    expect(body).toMatch(/todo|draft|done/);
  });

  it("pages/structure.md 은 ID 스파인 frontmatter 키를 가진다", () => {
    const body = readTpl("pages/structure.md");
    expect(body.startsWith("---\n"), "frontmatter 시작 없음").toBe(true);
    for (const key of ["page:", "covers:", "roles:", "flows:", "parent:"]) {
      expect(body, `frontmatter 키 ${key} 없음`).toContain(key);
    }
  });

  it("결정 로그 2종은 typed 6열 헤더를 가진다 (ID·연결 포함, set-diff 키)", () => {
    // ADR-011: | ID | 결정 | 선택지 | 탈락 | 이유 | 연결 |
    for (const t of ["pages/decisions.md", "decisions.md"]) {
      const body = readTpl(t);
      const header = body.split("\n").find((l) => l.includes("| 결정 ") || l.includes("|결정"));
      expect(header, `${t}: 표 헤더 행 없음`).toBeTruthy();
      for (const col of ["ID", "결정", "선택지", "탈락", "이유", "연결"]) {
        expect(header, `${t}: '${col}' 열 없음`).toContain(col);
      }
    }
  });

  it("결정 로그 정본 규칙 블록이 ADR-011 과 순차 ID 패턴을 참조한다", () => {
    for (const t of ["pages/decisions.md", "decisions.md"]) {
      const body = readTpl(t);
      expect(body, `${t}: ADR-011 참조 없음`).toContain("ADR-011");
      expect(body, `${t}: 순차 ID(D-01) 규칙 없음`).toMatch(/D-\d{1,2}/);
    }
  });
});

describe("세로 슬라이스 v2 ADR (spec-01-01)", () => {
  const ADRS = [
    "ADR-006-vertical-slice-page-unit.md",
    "ADR-007-sitemap-as-map.md",
    "ADR-008-decision-log-two-tier.md",
    "ADR-009-slug-page-id-normalization.md",
    "ADR-010-sitemap-pages-single-source.md",
    "ADR-011-decision-log-auto-trigger.md",
  ];

  it("ADR-006~011 이 존재한다", () => {
    for (const a of ADRS) {
      expect(existsSync(join(DECISIONS, a)), `docs/decisions/${a} 누락`).toBe(true);
    }
  });

  it("각 ADR frontmatter type 이 closure(decision/invariant/convention/tradeoff) 안이다", () => {
    for (const a of ADRS) {
      const body = readFileSync(join(DECISIONS, a), "utf-8");
      const m = body.match(/^type:\s*(\S+)/m);
      const type = m?.[1];
      expect(type, `${a}: type 슬롯 없음`).toBeTruthy();
      expect(Boolean(type && ADR_TYPES.has(type)), `${a}: type '${type}' 가 closure 밖`).toBe(true);
    }
  });
});
