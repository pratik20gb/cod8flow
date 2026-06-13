// Generate the full polished COD8FLOW YouTube + X Content Strategy Guide as .docx
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, 
        HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
        Header, Footer, PageNumber, LevelFormat, PageBreak } = require('docx');
const fs = require('fs');

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Arial", color: "0F766E" },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: "17202A" },
        paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: "334155" },
        paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 2 } },
    ]
  },
  numbering: {
    config: [
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbers", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  sections: [{
    properties: {
      page: { size: { width: 12240, height: 15840 }, margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 } }
    },
    headers: {
      default: new Header({ children: [new Paragraph({ 
        children: [new TextRun({ text: "COD8FLOW — Complete YouTube + X Content Strategy Guide", italics: true, size: 18, color: "64748B" })] 
      })] })
    },
    footers: {
      default: new Footer({ children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Page ", size: 18 }), new TextRun({ children: [PageNumber.CURRENT], size: 18 })]
      })] })
    },
    children: [
      // TITLE
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("COD8FLOW")] }),
      new Paragraph({ children: [new TextRun({ text: "Complete YouTube + X Content Strategy Guide", size: 32, bold: true })] }),
      new Paragraph({ children: [new TextRun({ text: "Every video idea, title, description, thumbnail spec, X post, script template, and roadmap you need to turn this project into a high-quality content engine.", size: 22 })] }),
      new Paragraph({ children: [new TextRun({ text: "Project: Full-stack Jira-like SaaS | Stack: Java 21 + Spring Boot + React + Postgres + JWT", italics: true })] }),
      new Paragraph({ children: [new TextRun("")] }),

      // POSITIONING
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1. Positioning & Channel Brand")] }),
      new Paragraph({ children: [new TextRun("Core promise: \"The honest, production-grade journey of building a real Jira clone from scratch in modern Java.\"")] }),
      new Paragraph({ children: [new TextRun("Use this line in every video description and pinned comment.")] }),
      new Paragraph({ children: [new TextRun({ text: "Key differentiators: ", bold: true }), new TextRun("Build-in-public, real bugs shown, industry patterns (not toy CRUD), full-stack with real auth, mapped to clear phases.")] }),

      // PILLARS
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2. Content Pillars")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Main Build Series (long-form numbered episodes)")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Technical Deep Dives (JWT, Security, Domain, Caching)")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Honest Journey & Bug Fixes (highest retention & comments)")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Full-Stack Integration")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Production & DevOps")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Shorts & Quick Tips (reach)")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Livestreams")] }),

      // TITLE BANK
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3. High-Performing Title Bank (Copy & Adapt)")] }),
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Phase 1-2 (Start Here)")] }),
      new Paragraph({ children: [new TextRun("• Spring Boot 3 + Spring Security 6: Complete JWT Authentication with Refresh Tokens (2026)")] }),
      new Paragraph({ children: [new TextRun("• I Shipped a Broken JWT Filter in Spring Boot — Here's How I Fixed It Live")] }),
      new Paragraph({ children: [new TextRun("• Spring Boot + React Full Stack: Project Setup, Docker, Flyway & Health Endpoint (2026)")] }),
      new Paragraph({ children: [new TextRun("• Spring Boot 3 JWT: Register, Login & Refresh Tokens (Full Implementation)")] }),
      new Paragraph({ children: [new TextRun("• Building a Real Jira Clone in Java 21 + Spring Boot + React — From Scratch")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Future Videos")] }),
      new Paragraph({ children: [new TextRun("• Spring Boot Domain Modeling: Workspaces, Boards & Tasks for a Project Management App")] }),
      new Paragraph({ children: [new TextRun("• React + Spring Boot: Connecting Zustand Auth with Protected Routes & Interceptors")] }),
      new Paragraph({ children: [new TextRun("• Adding Redis Caching to Spring Boot SaaS (Without Breaking Auth)")] }),
      new Paragraph({ children: [new TextRun("• Spring Boot + Kafka: Event-Driven Notifications for Task Updates")] }),
      new Paragraph({ children: [new TextRun("• 5 Mistakes I Made Building JWT in Spring Boot (and How to Avoid Them)")] }),

      // FULL EXAMPLES
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4. Complete Video Packs (Ready to Use)")] }),
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Pack 1 — JWT Authentication (Highest Priority)")] }),
      new Paragraph({ children: [new TextRun({ text: "Title: ", bold: true }), new TextRun("Spring Boot 3 + Spring Security 6: Complete JWT Authentication with Refresh Tokens (2026)")] }),
      new Paragraph({ children: [new TextRun({ text: "Description (first 150 chars are critical):", bold: true })] }),
      new Paragraph({ children: [new TextRun("In this video we build production-ready JWT authentication in Spring Boot 3 with access + refresh tokens, BCrypt, stateless sessions, and a proper JwtAuthFilter.")] }),
      new Paragraph({ children: [new TextRun("Timestamps, code links, CTA, and full hashtags are in the master templates below.")] }),
      new Paragraph({ children: [new TextRun({ text: "Thumbnail spec: ", bold: true }), new TextRun("Dark grid background. Large bold \"JWT Refresh Tokens\". Teal accent. Small focused dev face + COD8FLOW F logo.")] }),
      new Paragraph({ children: [new TextRun({ text: "Tags (first 3 critical): ", bold: true }), new TextRun("spring boot jwt authentication, spring boot 3 jwt, spring security 6 jwt, jwt refresh token spring boot, full stack java spring boot react")] }),

      // X STRATEGY
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("5. X (Twitter) Strategy")] }),
      new Paragraph({ children: [new TextRun("Cadence: 5-7 posts/week. 1-2 threads. Daily short clips during build weeks.")] }),
      new Paragraph({ children: [new TextRun({ text: "Hashtags (rotate): ", bold: true }), new TextRun("#buildinpublic #Java #SpringBoot #FullStack #JWT #SpringSecurity #JiraClone #SaaS")] }),
      new Paragraph({ children: [new TextRun({ text: "Winning formats:", bold: true })] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Progress screenshot + honest caption")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("7-12 tweet technical thread")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Poll on architecture decision")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("60-90s video clip from long-form + link in reply")] }),

      new Paragraph({ children: [new TextRun({ text: "Example tweet for new video:", bold: true })] }),
      new Paragraph({ children: [new TextRun("\"Just dropped the full JWT auth implementation for COD8FLOW (my Jira clone in Java). Spring Boot 3 + Security 6 + refresh tokens + the exact bug I shipped this week.\\n\\nVideo + code: [link]\\n\\n#buildinpublic #SpringBoot #JWT\"")] }),

      // SEO & SETTINGS
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("6. YouTube SEO & Upload Settings (2026)")] }),
      new Paragraph({ children: [new TextRun("• Front-load primary keyword in title (first 55-65 chars)")] }),
      new Paragraph({ children: [new TextRun("• Description: First 120-150 chars hook + keyword. Always include full timestamps. 300+ words ideal.")] }),
      new Paragraph({ children: [new TextRun("• Tags: Tag 1-3 = exact main phrase. Mix long-tail + project name.")] }),
      new Paragraph({ children: [new TextRun("• Thumbnail formula: Dark code/grid bg + huge readable text + teal accent + small face or project icon + result badge")] }),
      new Paragraph({ children: [new TextRun("• Always: Chapters, cards (subscribe + playlist + next), end screen, captions.")] }),

      // ROADMAP
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("7. Content Roadmap (Mapped to Project Phases)")] }),
      new Table({
        width: { size: 10080, type: WidthType.DXA },
        columnWidths: [1800, 2400, 5880],
        rows: [
          new TableRow({ children: [
            new TableCell({ borders, width: { size: 1800, type: WidthType.DXA }, shading: { fill: "0F766E", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Phase", bold: true, color: "FFFFFF" })] })] }),
            new TableCell({ borders, width: { size: 2400, type: WidthType.DXA }, shading: { fill: "0F766E", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Status", bold: true, color: "FFFFFF" })] })] }),
            new TableCell({ borders, width: { size: 5880, type: WidthType.DXA }, shading: { fill: "0F766E", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Priority Content", bold: true, color: "FFFFFF" })] })] }),
          ]}),
          new TableRow({ children: [
            new TableCell({ borders, width: { size: 1800, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("1. Setup")] })] }),
            new TableCell({ borders, width: { size: 2400, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("✅ Complete")] })] }),
            new TableCell({ borders, width: { size: 5880, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("Kickoff video, Docker + Flyway, Health endpoint")] })] }),
          ]}),
          new TableRow({ children: [
            new TableCell({ borders, width: { size: 1800, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("2. JWT Auth")] })] }),
            new TableCell({ borders, width: { size: 2400, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("🔄 In Progress")] })] }),
            new TableCell({ borders, width: { size: 5880, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("JWT series (2-4 videos), Bug fix special, Connect to React frontend")] })] }),
          ]}),
          new TableRow({ children: [
            new TableCell({ borders, width: { size: 1800, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("3-7")] })] }),
            new TableCell({ borders, width: { size: 2400, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("⏳ Pending")] })] }),
            new TableCell({ borders, width: { size: 5880, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("Domain modeling, full-stack integration, Redis/Kafka, Testing, CI/CD + Grafana")] })] }),
          ]}),
        ]
      }),

      new Paragraph({ children: [new TextRun("")] }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("8. Reusable Templates")] }),
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Title Formula")] }),
      new Paragraph({ children: [new TextRun("[Tech Stack] + [Exact Feature] + [Benefit] (2026 or \"From Scratch\")")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Description Skeleton")] }),
      new Paragraph({ children: [new TextRun("Hook sentence with keyword.\nWhat we build (bullet list).\nFull timestamps.\nGitHub + playlist + previous video links.\nStrong CTA + hashtags.")] }),

      new Paragraph({ children: [new TextRun("")] }),
      new Paragraph({ children: [new TextRun({ text: "This document + the companion slide deck + actual video scripts + working backend code + thumbnail images = everything you need to execute.", italics: true })] }),
      new Paragraph({ children: [new TextRun("Created for COD8FLOW by Grok — 2026-06-13")] }),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("COD8FLOW_YT_X_Content_Strategy_Guide.docx", buffer);
  console.log("✅ DOCX guide created: docs/yt-guide/COD8FLOW_YT_X_Content_Strategy_Guide.docx");
});
