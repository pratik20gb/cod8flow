// COD8FLOW YouTube + X Strategy - Polished Slide Deck
const pptxgen = require("pptxgenjs");
const fs = require("fs");

let pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "COD8FLOW Dev";
pres.title = "COD8FLOW - Complete YouTube + X Content Strategy";
pres.subject = "Full content plan for the COD8FLOW Java SaaS project";

// Color palette (Teal Trust + dark)
const colors = {
  primary: "0F766E",      // brand teal
  dark: "17202A",         // ink
  light: "F8FAFC",        // panel
  accent: "14B8A6",
  white: "FFFFFF",
  text: "334155"
};

// Slide 1 - Title
let slide1 = pres.addSlide();
slide1.background = { color: colors.dark };
slide1.addText("COD8FLOW", { x: 0.5, y: 1.5, w: 9, h: 1, fontSize: 54, fontFace: "Arial", bold: true, color: colors.white });
slide1.addText("Complete YouTube + X\nContent Strategy Guide", { x: 0.5, y: 2.6, w: 9, h: 1.4, fontSize: 32, fontFace: "Arial", color: colors.accent });
slide1.addText("Every title, description, thumbnail, script, X post & roadmap\nfor turning this Java full-stack project into a content engine", { x: 0.5, y: 4.3, w: 9, h: 0.8, fontSize: 16, fontFace: "Arial", color: "94A3B8" });

// Slide 2 - Positioning
let slide2 = pres.addSlide();
slide2.addText("Positioning", { x: 0.5, y: 0.3, w: 9, h: 0.7, fontSize: 36, bold: true, color: colors.dark });
slide2.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.1, w: 0.12, h: 3.8, fill: { color: colors.primary } });
slide2.addText("Core Promise", { x: 0.9, y: 1.1, w: 8.5, h: 0.5, fontSize: 20, bold: true, color: colors.primary });
slide2.addText("\"The honest, production-grade journey of building a real Jira clone from scratch in modern Java.\"", { x: 0.9, y: 1.6, w: 8.5, h: 1, fontSize: 18, color: colors.text });
slide2.addText("Key Angles", { x: 0.9, y: 2.8, w: 8.5, h: 0.5, fontSize: 20, bold: true, color: colors.primary });
slide2.addText([
  { text: "• Build-in-public (show the bugs)", options: { breakLine: true } },
  { text: "• Industry-grade patterns, not toy CRUD", options: { breakLine: true } },
  { text: "• Full-stack (Java 21 + Spring Boot + React + TS)", options: { breakLine: true } },
  { text: "• Clear phase-based roadmap (your README is perfect)", options: { breakLine: true } }
], { x: 0.9, y: 3.3, w: 8.5, h: 2, fontSize: 17, color: colors.text });

// Slide 3 - Content Pillars
let slide3 = pres.addSlide();
slide3.addText("Content Pillars", { x: 0.5, y: 0.3, w: 9, h: 0.7, fontSize: 36, bold: true, color: colors.dark });
const pillars = [
  { title: "Main Build Series", desc: "Numbered long-form episodes following your 7 phases" },
  { title: "Technical Deep Dives", desc: "JWT, Security, Domain Modeling, Caching, Kafka" },
  { title: "Honest Journey & Bugs", desc: "Highest retention & comments. Gold for authenticity" },
  { title: "Full-Stack Integration", desc: "Connect Spring Boot APIs to the React frontend live" },
  { title: "Production & DevOps", desc: "Docker, Testing, CI/CD, Observability, Redis" },
  { title: "Shorts + Livestreams", desc: "Reach + community. Quick tips and building live" }
];
pillars.forEach((p, i) => {
  const y = 1.1 + (i * 0.7);
  slide3.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: y, w: 9, h: 0.6, fill: { color: i % 2 === 0 ? "F0FDFA" : "FFFFFF" }, rectRadius: 0.05 });
  slide3.addText(p.title, { x: 0.7, y: y + 0.08, w: 3.5, h: 0.45, fontSize: 16, bold: true, color: colors.primary });
  slide3.addText(p.desc, { x: 4.3, y: y + 0.08, w: 5, h: 0.45, fontSize: 15, color: colors.text });
});

// Slide 4 - Title Examples
let slide4 = pres.addSlide();
slide4.addText("Proven Title Formulas & Examples", { x: 0.5, y: 0.3, w: 9, h: 0.7, fontSize: 32, bold: true, color: colors.dark });
slide4.addText("Front-load the keyword. Add year or \"From Scratch\". Promise a result.", { x: 0.5, y: 1.0, w: 9, h: 0.5, fontSize: 16, color: colors.text });
const titles = [
  "Spring Boot 3 + Spring Security 6: Complete JWT Authentication with Refresh Tokens (2026)",
  "I Shipped a Broken JWT Filter in Spring Boot — Here's How I Fixed It Live",
  "Spring Boot + React Full Stack: Project Setup, Docker, Flyway & Health Endpoint (2026)",
  "Building a Real Jira Clone in Java 21 + Spring Boot + React — From Scratch"
];
titles.forEach((t, i) => {
  slide4.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 1.6 + i*0.9, w: 9, h: 0.75, fill: { color: "F8FAFC" }, rectRadius: 0.06 });
  slide4.addText((i+1) + ". " + t, { x: 0.7, y: 1.7 + i*0.9, w: 8.6, h: 0.55, fontSize: 15, color: colors.dark });
});

// Slide 5 - Thumbnail System
let slide5 = pres.addSlide();
slide5.addText("Thumbnail Design System", { x: 0.5, y: 0.3, w: 9, h: 0.7, fontSize: 32, bold: true, color: colors.dark });
slide5.addText("Formula for maximum CTR on coding content:", { x: 0.5, y: 1.0, w: 9, h: 0.4, fontSize: 17, color: colors.text });
const thumbRules = [
  "Background: Dark code screenshot or your grid asset (slightly blurred)",
  "Big bold readable text (white + strong teal accent #0f766e)",
  "Small human face (you looking focused or surprised for bug videos)",
  "Project badge or result indicator (\"Part 3\", \"Fixed\", \"2026\")",
  "COD8FLOW logo/icon in corner for brand consistency"
];
thumbRules.forEach((r, i) => {
  slide5.addText("✓  " + r, { x: 0.5, y: 1.6 + i*0.55, w: 9, h: 0.5, fontSize: 16, color: colors.text });
});
slide5.addText("Generated thumbnails are in /docs/thumbnails (use 1.jpg–4.jpg as starting points)", { x: 0.5, y: 4.6, w: 9, h: 0.4, fontSize: 15, italic: true, color: colors.primary });

// Slide 6 - X Strategy
let slide6 = pres.addSlide();
slide6.addText("X (Twitter) Promotion System", { x: 0.5, y: 0.3, w: 9, h: 0.7, fontSize: 32, bold: true, color: colors.dark });
slide6.addText("Cadence: 5–7 posts/week • 1–2 threads • Daily clips during active building", { x: 0.5, y: 1.0, w: 9, h: 0.4, fontSize: 16, color: colors.text });
slide6.addText("Winning Post Types", { x: 0.5, y: 1.6, w: 9, h: 0.4, fontSize: 18, bold: true, color: colors.primary });
const xTypes = ["Progress screenshot + honest text", "Technical thread (7-12 tweets)", "Poll on a real decision", "60-90s clip from the video + link"];
xTypes.forEach((t, i) => slide6.addText("→ " + t, { x: 0.7, y: 2.1 + i*0.5, w: 8.5, h: 0.45, fontSize: 16, color: colors.text }));
slide6.addText("Always use #buildinpublic + 2-3 tech tags. Pin your best thread.", { x: 0.5, y: 4.4, w: 9, h: 0.4, fontSize: 15, italic: true, color: colors.text });

// Slide 7 - Roadmap Table
let slide7 = pres.addSlide();
slide7.addText("Content Roadmap by Phase", { x: 0.5, y: 0.3, w: 9, h: 0.7, fontSize: 32, bold: true, color: colors.dark });
const phases = [
  { phase: "Phase 1", status: "✅ Done", content: "Kickoff + Setup + Docker + Health" },
  { phase: "Phase 2", status: "🔥 Now", content: "JWT series (3 videos) + Bug fix special + Frontend connect" },
  { phase: "Phase 3", status: "Next", content: "Workspaces, Boards, Tasks domain + APIs" },
  { phase: "Phase 4-5", status: "Later", content: "Redis, S3, Kafka events" },
  { phase: "Phase 6-7", status: "Later", content: "Testing, CI/CD, Grafana, full frontend polish" }
];
phases.forEach((p, i) => {
  const y = 1.2 + i * 0.75;
  slide7.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: y, w: 9, h: 0.65, fill: { color: p.status.includes("Now") ? "FEF3C7" : "F8FAFC" }, rectRadius: 0.05 });
  slide7.addText(p.phase, { x: 0.7, y: y + 0.12, w: 1.8, h: 0.4, fontSize: 16, bold: true, color: colors.dark });
  slide7.addText(p.status, { x: 2.6, y: y + 0.12, w: 1.5, h: 0.4, fontSize: 15, color: colors.primary });
  slide7.addText(p.content, { x: 4.2, y: y + 0.12, w: 5, h: 0.4, fontSize: 15, color: colors.text });
});

// Slide 8 - Action Plan
let slide8 = pres.addSlide();
slide8.background = { color: colors.dark };
slide8.addText("Immediate Action Plan", { x: 0.5, y: 0.5, w: 9, h: 0.8, fontSize: 36, bold: true, color: colors.white });
slide8.addText("1. Use the working Auth code I just added (register / login / refresh now work)", { x: 0.5, y: 1.5, w: 9, h: 0.6, fontSize: 18, color: colors.white });
slide8.addText("2. Record the JWT video first (use script in docs/yt-scripts)", { x: 0.5, y: 2.2, w: 9, h: 0.6, fontSize: 18, color: colors.white });
slide8.addText("3. Post the bug fix story — it performs extremely well", { x: 0.5, y: 2.9, w: 9, h: 0.6, fontSize: 18, color: colors.white });
slide8.addText("4. Drop the thumbnails from docs/thumbnails into your video uploads", { x: 0.5, y: 3.6, w: 9, h: 0.6, fontSize: 18, color: colors.white });
slide8.addText("5. Use the generated .docx + .pptx as your content bible", { x: 0.5, y: 4.3, w: 9, h: 0.6, fontSize: 18, color: colors.white });

// Slide 9 - Deliverables
let slide9 = pres.addSlide();
slide9.addText("Everything Delivered", { x: 0.5, y: 0.3, w: 9, h: 0.7, fontSize: 32, bold: true, color: colors.dark });
const delivered = [
  "✅ Fixed + complete working backend auth (Controller, Service, Refresh tokens, fixes)",
  "✅ 4 custom high-quality thumbnails in docs/thumbnails",
  "✅ 3 full detailed video scripts (JWT, Bug Fix, Kickoff)",
  "✅ This full strategy guide as polished .docx",
  "✅ Companion slide deck (.pptx)",
  "✅ Ready title/description/tag/X templates throughout"
];
delivered.forEach((d, i) => {
  slide9.addText(d, { x: 0.5, y: 1.2 + i*0.6, w: 9, h: 0.55, fontSize: 17, color: colors.text });
});

pres.writeFile({ fileName: "COD8FLOW_YT_Strategy_Deck.pptx" })
  .then(() => console.log("✅ PPTX deck created: docs/yt-guide/COD8FLOW_YT_Strategy_Deck.pptx"));
