import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { slugify } from "./slugify";

export type Accent = "lime" | "violet" | "cyan" | "amber";

export type CaseStudyMeta = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  tags: string[];
  kind: string;
  role: string;
  stack: string[];
  index: string;
  accent: Accent;
  featured: boolean;
  readingMinutes: number;
};

export type CaseStudy = CaseStudyMeta & {
  body: string;
  headings: { depth: 2 | 3; text: string; id: string }[];
};

const DIR = path.join(process.cwd(), "content", "case-studies");
const ACCENTS: Accent[] = ["lime", "violet", "cyan", "amber"];

function extractHeadings(body: string): CaseStudy["headings"] {
  const headings: CaseStudy["headings"] = [];
  let inFence = false;
  for (const line of body.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    if (inFence) continue;
    const m = /^(##|###)\s+(.+?)\s*#*\s*$/.exec(line);
    if (m) {
      const text = m[2].replace(/[`*_]/g, "");
      headings.push({ depth: m[1].length as 2 | 3, text, id: slugify(text) });
    }
  }
  return headings;
}

function read(file: string): CaseStudy {
  const raw = fs.readFileSync(path.join(DIR, file), "utf8");
  const { data, content } = matter(raw);
  const accent = ACCENTS.includes(data.accent) ? (data.accent as Accent) : "lime";
  return {
    slug: file.replace(/\.mdx?$/, ""),
    title: String(data.title ?? "Untitled"),
    summary: String(data.summary ?? ""),
    date: String(data.date ?? "2026-01-01"),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    kind: String(data.kind ?? "Case study"),
    role: String(data.role ?? ""),
    stack: Array.isArray(data.stack) ? data.stack.map(String) : [],
    index: String(data.index ?? "00"),
    accent,
    featured: Boolean(data.featured),
    readingMinutes: Math.max(1, Math.round(readingTime(content).minutes)),
    body: content,
    headings: extractHeadings(content),
  };
}

export function getAllCaseStudies(): CaseStudyMeta[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => /\.mdx?$/.test(f))
    .map(read)
    .sort((a, b) => a.index.localeCompare(b.index))
    .map((cs): CaseStudyMeta => {
      const { body, headings, ...meta } = cs;
      void body;
      void headings;
      return meta;
    });
}

export function getCaseStudy(slug: string): CaseStudy | null {
  for (const ext of [".mdx", ".md"]) {
    const file = `${slug}${ext}`;
    if (/^[a-z0-9-]+$/.test(slug) && fs.existsSync(path.join(DIR, file))) return read(file);
  }
  return null;
}

export function formatDate(date: string): string {
  const d = new Date(`${date}T00:00:00Z`);
  return d.toLocaleDateString("en-AU", { month: "short", year: "numeric", timeZone: "UTC" });
}
