export const site = {
  name: "Tim Restieaux",
  short: "Restieaux",
  role: "AI Engineer",
  title: "AI Engineering Lead",
  location: "Melbourne, AU",
  timezone: "Australia/Melbourne",
  email: "comfycactus@gmail.com",
  tagline: "I build the harness around the model.",
  description:
    "Tim Restieaux is an AI engineer in Melbourne who designs and builds production agent systems: harnesses, guardrails, evals and long-running agents.",
};

export const nav = [
  { href: "/", label: "Index" },
  { href: "/case-studies", label: "Case studies" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const experience = [
  {
    org: "Australian Venue Co.",
    role: "AI Engineering Lead",
    period: "2026 — Now",
    detail: "Leading AI engineering for a large portfolio of hospitality venues: agents, platforms and the team that builds them.",
  },
  {
    org: "Australian Venue Co.",
    role: "AI Engineer",
    period: "2025 — 2026",
    detail: "Designed and built AI products for the group, from prototype to production.",
  },
  {
    org: "NAB",
    role: "Product Owner, Gen AI",
    period: "2024 — 2025",
    detail: "Owned generative AI products inside one of Australia's big four banks, where guardrails are not optional.",
  },
  {
    org: "Te Pūkenga",
    role: "AI Architect",
    period: "2021 — 2024",
    detail: "Led research, design and development of AI applications through a national enterprise transformation.",
  },
  {
    org: "Competenz",
    role: "Digital Experience Lead",
    period: "2019 — 2022",
    detail: "Owned the digital customer journey across 32 industry sectors, from ad channels to conversion. Automated whatever stood still long enough.",
  },
] as const;

export const capabilities = [
  {
    no: "01",
    title: "Harness engineering",
    body: "Context assembly, tool design, state, retries and observability. The unglamorous 90% that makes a model useful.",
    tags: ["Tool design", "Context", "Tracing"],
  },
  {
    no: "02",
    title: "Guardrails & evals",
    body: "Layered validation, permissioned tools and eval suites wired into CI, so you can ship changes without crossing your fingers.",
    tags: ["Policy", "LLM-as-judge", "Red-teaming"],
  },
  {
    no: "03",
    title: "Long-running agents",
    body: "Agents that work for hours: checkpoints, durable execution, memory, budgets and humans in the loop at the right moments.",
    tags: ["Durable execution", "Memory", "Supervision"],
  },
  {
    no: "04",
    title: "AI product strategy",
    body: "Finding the problems worth automating, then shaping a roadmap a team can actually deliver. I was a marketer before I was an engineer.",
    tags: ["Discovery", "Roadmaps", "Teams"],
  },
] as const;
