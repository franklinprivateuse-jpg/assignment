"""
Generate a Word document template for the Kewei Portfolio Technical Report.
Run: python docs/generate_report.py
Output: docs/Kewei_Portfolio_Technical_Report.docx
"""

from docx import Document
from docx.shared import Inches, Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.section import WD_ORIENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
import os

# ── Bookmark / Hyperlink helpers ──────────────────────────────────

_bookmark_id_counter = 0

def _next_bookmark_id() -> str:
    global _bookmark_id_counter
    _bookmark_id_counter += 1
    return str(_bookmark_id_counter)

def add_bookmark(paragraph, bookmark_name: str):
    """Add a bookmark anchor to a paragraph so hyperlinks can jump to it."""
    bid = _next_bookmark_id()
    start = OxmlElement("w:bookmarkStart")
    start.set(qn("w:id"), bid)
    start.set(qn("w:name"), bookmark_name)
    end = OxmlElement("w:bookmarkEnd")
    end.set(qn("w:id"), bid)
    # Insert bookmarkStart after <w:pPr> (paragraph properties) for valid XML ordering
    pPr = paragraph._p.find(qn("w:pPr"))
    if pPr is not None:
        pPr.addnext(start)
    else:
        paragraph._p.insert(0, start)
    paragraph._p.append(end)

def add_hyperlink_to_bookmark(paragraph, text: str, bookmark_name: str,
                               font_size=Pt(11), bold=False, color="4F46E5"):
    """Add a clickable hyperlink that jumps to a bookmark within the document."""
    hyperlink = OxmlElement("w:hyperlink")
    hyperlink.set(qn("w:anchor"), bookmark_name)

    new_run = OxmlElement("w:r")
    rPr = OxmlElement("w:rPr")

    # Font size
    sz = OxmlElement("w:sz")
    sz.set(qn("w:val"), str(int(font_size.pt * 2)) if hasattr(font_size, 'pt') else "22")
    rPr.append(sz)
    szCs = OxmlElement("w:szCs")
    szCs.set(qn("w:val"), str(int(font_size.pt * 2)) if hasattr(font_size, 'pt') else "22")
    rPr.append(szCs)

    # Color
    c = OxmlElement("w:color")
    c.set(qn("w:val"), color)
    rPr.append(c)

    # Underline
    u = OxmlElement("w:u")
    u.set(qn("w:val"), "single")
    rPr.append(u)

    # Bold
    if bold:
        b = OxmlElement("w:b")
        rPr.append(b)

    new_run.append(rPr)

    # Text must be inside <w:t> element for Word to recognize it
    t_elem = OxmlElement("w:t")
    t_elem.set(qn("xml:space"), "preserve")
    t_elem.text = text
    new_run.append(t_elem)

    hyperlink.append(new_run)
    paragraph._p.append(hyperlink)


# ── Other helper functions ────────────────────────────────────────

def set_cell_shading(cell, color: str):
    """Set background color of a table cell."""
    shading = OxmlElement("w:shd")
    shading.set(qn("w:fill"), color)
    shading.set(qn("w:val"), "clear")
    cell._tc.get_or_add_tcPr().append(shading)

def add_styled_table(doc, headers, rows, col_widths=None):
    """Add a formatted table with header row shading."""
    table = doc.add_table(rows=1 + len(rows), cols=len(headers))
    table.style = "Table Grid"
    table.alignment = WD_TABLE_ALIGNMENT.CENTER

    for i, header in enumerate(headers):
        cell = table.rows[0].cells[i]
        cell.text = header
        for paragraph in cell.paragraphs:
            paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
            for run in paragraph.runs:
                run.bold = True
                run.font.size = Pt(10)
                run.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
        set_cell_shading(cell, "4F46E5")

    for r, row_data in enumerate(rows):
        for c, value in enumerate(row_data):
            cell = table.rows[r + 1].cells[c]
            cell.text = str(value)
            for paragraph in cell.paragraphs:
                for run in paragraph.runs:
                    run.font.size = Pt(10)
            if r % 2 == 1:
                set_cell_shading(cell, "F3F4F6")

    if col_widths:
        for i, width in enumerate(col_widths):
            for row in table.rows:
                row.cells[i].width = Cm(width)

    return table

def add_placeholder(doc, text: str):
    p = doc.add_paragraph()
    run = p.add_run(text)
    run.italic = True
    run.font.color.rgb = RGBColor(0x9C, 0xA3, 0xAF)
    run.font.size = Pt(11)

def add_body(doc, text: str):
    doc.add_paragraph(text)

# Heading functions with bookmark support
def add_heading1(doc, text: str, bookmark: str = None):
    p = doc.add_heading(text, level=1)
    if bookmark:
        add_bookmark(p, bookmark)

def add_heading2(doc, text: str, bookmark: str = None):
    p = doc.add_heading(text, level=2)
    if bookmark:
        add_bookmark(p, bookmark)

def add_heading3(doc, text: str, bookmark: str = None):
    p = doc.add_heading(text, level=3)
    if bookmark:
        add_bookmark(p, bookmark)


# ── Create Document ───────────────────────────────────────────────

doc = Document()

for section in doc.sections:
    section.top_margin = Cm(2.54)
    section.bottom_margin = Cm(2.54)
    section.left_margin = Cm(2.54)
    section.right_margin = Cm(2.54)

style = doc.styles["Normal"]
font = style.font
font.name = "Calibri"
font.size = Pt(11)

# ══════════════════════════════════════════════════════════════════
# FRONT COVER
# ══════════════════════════════════════════════════════════════════

for _ in range(6):
    doc.add_paragraph()

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = p.add_run("Kewei Portfolio")
run.bold = True
run.font.size = Pt(28)
run.font.color.rgb = RGBColor(0x4F, 0x46, 0xE5)

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = p.add_run("A Digital Portfolio Website")
run.font.size = Pt(18)
run.font.color.rgb = RGBColor(0x63, 0x66, 0xF1)

doc.add_paragraph()

cover_info = [
    ("Student Name:", "Kewei Wu"),
    ("Student ID:", "26141825"),
    ("Module:", "CS5709 — Software Engineering Evolution"),
    ("Module Leader:", "Dr. Salim Saay"),
    ("University:", "University of Limerick"),
    ("Date:", "November 2026"),
]

for label, value in cover_info:
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run_label = p.add_run(label + " ")
    run_label.bold = True
    run_label.font.size = Pt(12)
    run_val = p.add_run(value)
    run_val.font.size = Pt(12)
    if value.startswith("["):
        run_val.font.color.rgb = RGBColor(0xEF, 0x44, 0x44)

doc.add_page_break()

# ══════════════════════════════════════════════════════════════════
# TABLE OF CONTENTS (with clickable hyperlinks)
# ══════════════════════════════════════════════════════════════════

add_heading1(doc, "Table of Contents")

toc_entries = [
    ("1. Declaration and Transparency", "sec_declaration"),
    ("2. Abstract", "sec_abstract"),
    ("3. Discovery and Narrative Description", "sec_discovery"),
    ("4. Iterative Project Plan", "sec_plan"),
    ("5. Tools and Techniques", "sec_tools"),
    ("6. Design Discussion", "sec_design"),
    ("7. Code Listing", "sec_code"),
    ("8. Innovation", "sec_innovation"),
    ("9. Critique", "sec_critique"),
    ("10. Reflection", "sec_reflection"),
    ("11. References", "sec_references"),
]

for text, bookmark in toc_entries:
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.space_before = Pt(4)
    add_hyperlink_to_bookmark(p, text, bookmark, font_size=Pt(12), bold=False, color="4F46E5")

doc.add_page_break()

# ══════════════════════════════════════════════════════════════════
# 1. DECLARATION AND TRANSPARENCY
# ══════════════════════════════════════════════════════════════════

add_heading1(doc, "1. Declaration and Transparency", bookmark="sec_declaration")

add_heading2(doc, "Generative AI Transparency Statement")
add_body(doc, "AI Usage Level: 4 — AI Task Completion, Human Evaluation")

ai_table_headers = ["Tool", "Usage Level", "Precise Usage"]
ai_table_rows = [
    ["Joy AI (JoyCode)", "Level 4", "Generated project scaffolding (Vite + React + TypeScript setup), directory structure, boilerplate component code, and CSS styling. All AI-generated code was reviewed and understood by the student."],
]
add_styled_table(doc, ai_table_headers, ai_table_rows, col_widths=[4, 3, 9])

# ══════════════════════════════════════════════════════════════════
# 2. ABSTRACT
# ══════════════════════════════════════════════════════════════════

add_heading1(doc, "2. Abstract", bookmark="sec_abstract")

add_body(doc, "A portfolio website built with React, TypeScript, and Vite. It has eleven pages, uses CSS Modules and CSS variables for styling, and includes custom hooks for theme switching and chat. Technologies are kept simple to stay lightweight. This report covers the discovery, design, implementation, and evaluation of the project.")

# ══════════════════════════════════════════════════════════════════
# 3. DISCOVERY AND NARRATIVE DESCRIPTION
# ══════════════════════════════════════════════════════════════════

add_heading1(doc, "3. Discovery and Narrative Description", bookmark="sec_discovery")

add_heading2(doc, "3.1 Overview")
add_body(doc, "A React-based portfolio with eleven pages covering background, education, skills, gallery, videos, blog, messaging, and project documentation. The site features dark mode, a responsive hamburger menu, and error handling.")

add_heading2(doc, "3.2 Feature List")

feature_headers = ["#", "Feature", "Page/Route", "Phase", "Status", "Description"]
feature_rows = [
    # Phase 1 — Core structure and static pages
    ["1", "Home Page", "/", "1", "Done", "Intro and feature cards"],
    ["2", "About Me", "/about", "1", "Done", "Personal background and interests"],
    ["3", "Education", "/education", "1", "Done", "Education and work timeline"],
    ["4", "Professional Knowledge", "/knowledge", "1", "Done", "Skills grouped by category"],
    ["5", "Photo Gallery", "/gallery", "1", "Done", "Photo grid of projects and events"],
    ["6", "Video Gallery", "/videos", "1", "Done", "Embedded YouTube videos"],
    ["7", "Navigation Bar", "—", "1", "Done", "Top navigation with active styling and hamburger menu"],
    ["8", "Client-side Routing", "—", "1", "Done", "HashRouter page navigation (GitHub Pages compatible)"],
    ["9", "CSS Styling", "—", "1", "Done", "CSS Modules and theme variables"],
    ["10", "Dark Mode", "—", "1", "Done", "Auto dark/light theme switch with manual toggle (moved from Phase 2)"],
    ["11", "Error Handling", "—", "1", "Done", "404 page and Error Boundary (moved from Phase 2)"],
    ["12", "Responsive Design", "—", "1", "Done", "Mobile-friendly layout with hamburger menu (moved from Phase 2)"],
    # Phase 2 — Interactive features and polish
    ["13", "Blog", "/blog, /blog/:id", "2", "Done", "Articles with Markdown detail"],
    ["14", "Instant Messaging", "/messaging", "2", "Done", "Chat with auto-reply bot and localStorage persistence"],
    ["15", "README", "/readme", "2", "Done", "Project overview rendered from README.md via react-markdown"],
]
add_styled_table(doc, feature_headers, feature_rows, col_widths=[1, 3.2, 3.2, 1.2, 1.2, 6.2])

add_heading2(doc, "3.3 Personas and Scenarios")

add_heading3(doc, "Persona 1 — Sarah, the Technical Recruiter")
add_body(doc, "Sarah is a technical recruiter at a multinational company. She reviews dozens of student portfolios each week and spends less than two minutes on each one. She wants to quickly assess a candidate's technical skills, project experience, and communication ability.")
add_body(doc, "Scenario: Sarah opens the portfolio on her laptop, reads the About page for background, checks the Professional Knowledge page for skills, and browses the Blog to evaluate writing quality. She switches to dark mode because she is reviewing at night.")

add_heading3(doc, "Persona 2 — David, the Potential Client")
add_body(doc, "David is a small business owner looking for a freelance web developer. He is not technical; he cares about visual quality, responsiveness, and whether the developer can build something modern and clean.")
add_body(doc, "Scenario: David opens the portfolio on his phone during his commute. He views the Photo Gallery and Video Gallery to see past work, then uses the Messaging page to start a conversation and leave a message.")

add_heading3(doc, "Persona 3 — Emma, the Classmate and Peer Reviewer")
add_body(doc, "Emma is a fellow software engineering student assigned to review this portfolio as part of a peer review exercise. She is technical and interested in code structure, architecture, and the technologies used.")
add_body(doc, "Scenario: Emma opens the README page to see the project overview rendered from the repository, then visits the GitHub repository to review the code. She tests the routing, dark mode toggle, and mobile hamburger menu to verify responsiveness.")

add_heading2(doc, "3.4 User Stories and Functional Requirements")

fr_headers = ["ID", "User Story", "Priority"]
fr_rows = [
    ["FR-01", "As a visitor, I want to view a home page with an introduction, so that I can quickly understand who the owner is.", "High"],
    ["FR-02", "As a visitor, I want to read about the owner's background on an About page, so that I can learn about their personal and professional journey.", "High"],
    ["FR-03", "As a visitor, I want to see the owner's education and work history on a timeline, so that I can understand their qualifications.", "High"],
    ["FR-04", "As a recruiter, I want to view skills grouped by category, so that I can quickly assess technical competencies.", "High"],
    ["FR-05", "As a potential client, I want to browse a photo gallery of past projects, so that I can evaluate visual quality.", "Medium"],
    ["FR-06", "As a potential client, I want to watch embedded videos of project demos, so that I can see the work in action.", "Medium"],
    ["FR-07", "As a visitor, I want to read blog articles with rich formatting, so that I can learn from the owner's insights.", "Medium"],
    ["FR-08", "As a visitor, I want to send messages via a chat interface and receive replies, so that I can contact the owner.", "Medium"],
    ["FR-09", "As a peer reviewer, I want to view the project README within the site, so that I can understand the project without leaving the portfolio.", "Low"],
    ["FR-10", "As a visitor, I want to toggle between light and dark themes, so that I can read comfortably in any lighting.", "Medium"],
    ["FR-11", "As a mobile user, I want a hamburger menu for navigation, so that I can browse easily on a small screen.", "High"],
    ["FR-12", "As a visitor, I want to see a friendly 404 page when I enter an invalid URL, so that I am not confused by a blank screen.", "Low"],
]
add_styled_table(doc, fr_headers, fr_rows, col_widths=[1.5, 12, 2])

add_heading2(doc, "3.5 Non-functional Requirements")

nfr_headers = ["ID", "Requirement", "Category"]
nfr_rows = [
    ["NFR-01", "The website shall load its first page within 2 seconds on a standard broadband connection.", "Performance"],
    ["NFR-02", "The website shall be responsive and usable on screens from 320px to 1920px wide.", "Usability"],
    ["NFR-03", "The website shall support light and dark themes with sufficient colour contrast (WCAG AA).", "Accessibility"],
    ["NFR-04", "The website shall work on the latest versions of Chrome, Firefox, Edge, and Safari.", "Compatibility"],
    ["NFR-05", "The chat history shall persist across page reloads using localStorage.", "Reliability"],
    ["NFR-06", "The codebase shall use TypeScript for type safety and ESLint for code quality.", "Maintainability"],
]
add_styled_table(doc, nfr_headers, nfr_rows, col_widths=[1.5, 11, 3])

add_heading2(doc, "3.6 Narrative Description")
add_body(doc, "The portfolio is a single-page application built with React, TypeScript, and Vite. It has eleven pages linked through a top navigation bar with a hamburger menu on mobile. Phase 1 covers six static content pages, routing (HashRouter), CSS theming with dark mode, a hamburger menu, and error handling (404 page and Error Boundary). Phase 2 adds interactive features — blog, messaging with localStorage persistence, and a README page rendered from the repository's README.md via react-markdown.")

# ══════════════════════════════════════════════════════════════════
# 4. ITERATIVE PROJECT PLAN
# ══════════════════════════════════════════════════════════════════

add_heading1(doc, "4. Iterative Project Plan", bookmark="sec_plan")

add_heading2(doc, "4.1 Phase 1 — Core Structure and Static Pages (Sep 15 – Oct 6)")

phase1_headers = ["Iteration", "Duration", "Deliverables"]
phase1_rows = [
    ["1.1", "Sep 15–28", "Project setup, HashRouter routing, styling (CSS Modules + variables), Navbar with hamburger menu, Home page, 404 page, Error Boundary"],
    ["1.2", "Sep 29 – Oct 6", "About, Education, Knowledge, Gallery, Videos pages, dark mode (useTheme hook with auto detection and manual toggle)"],
]
add_styled_table(doc, phase1_headers, phase1_rows, col_widths=[2.5, 3, 11])

add_heading2(doc, "4.2 Project Peer Review (Oct 6 – Oct 24)")

peer_review_rows = [
    ["—", "Oct 6–24", "Peer review of Phase 1"],
]
add_styled_table(doc, phase1_headers, peer_review_rows, col_widths=[2.5, 3, 11])

add_heading2(doc, "4.3 Phase 2 — Interactive Features and Polish (Oct 24 – Nov 14)")

phase2_headers = ["Iteration", "Duration", "Deliverables"]
phase2_rows = [
    ["2.1", "Oct 24 – Nov 7", "Blog (Markdown articles), Messaging (auto-reply bot + localStorage), README page (react-markdown rendering)"],
    ["2.2", "Nov 8–14", "Final polish, accessibility improvements, deployment preparation"],
]
add_styled_table(doc, phase2_headers, phase2_rows, col_widths=[2.5, 3, 11])

add_heading2(doc, "4.4 Plan Changes")

add_body(doc, "The following features were originally planned for Phase 2 but were completed during Phase 1. The reasons for the changes are explained below.")

change_headers = ["Feature", "Original Phase", "Actual Phase", "Reason for Change"]
change_rows = [
    ["Dark Mode", "2", "1", "CSS variables were set up in Phase 1 for theming; adding the useTheme hook and toggle button was a natural extension during initial styling work."],
    ["Error Handling (404 + Error Boundary)", "2", "1", "The 404 page is part of the route configuration built in Phase 1; the Error Boundary was added alongside routing to catch rendering errors early in development."],
    ["Responsive Design (Hamburger Menu)", "2", "1", "The Navbar was built in Phase 1; implementing the hamburger menu at the same time avoided reworking the component later and ensured mobile usability from the start."],
]
add_styled_table(doc, change_headers, change_rows, col_widths=[4, 2.5, 2.5, 7])

# ══════════════════════════════════════════════════════════════════
# 5. TOOLS AND TECHNIQUES
# ══════════════════════════════════════════════════════════════════

add_heading1(doc, "5. Tools and Techniques", bookmark="sec_tools")

add_heading2(doc, "5.1 Development Stack")

tools_headers = ["Category", "Tool / Technology", "Version", "Purpose"]
tools_rows = [
    ["Framework", "React", "19.2.8", "Build UI components"],
    ["Language", "TypeScript", "6.0.2", "Type checking"],
    ["Build Tool", "Vite", "8.3.0", "Dev server and bundling"],
    ["Routing", "React Router DOM", "7.18.4", "Page navigation"],
    ["Markdown", "react-markdown", "10.1.0", "Render blog and README content"],
    ["Linting", "ESLint", "10.10.0", "Code smell detection"],
    ["Package Manager", "npm", "—", "Install and run packages"],
    ["Version Control", "Git", "—", "Track code changes"],
    ["Repository", "GitHub", "—", "Host code remotely"],
]
add_styled_table(doc, tools_headers, tools_rows, col_widths=[3.5, 4.5, 2.5, 6])

add_heading2(doc, "5.2 Techniques")

tech_headers = ["Technique", "Application"]
tech_rows = [
    ["CSS Modules", "Scoped styling per component"],
    ["CSS Custom Properties", "Shared color and spacing variables"],
    ["Custom React Hooks", "Separate logic from UI (useTheme, useChat)"],
    ["Dark Mode", "Auto theme switch via prefers-color-scheme with manual toggle and localStorage persistence"],
    ["HashRouter", "Client-side routing compatible with GitHub Pages static hosting"],
    ["Vite ?raw Imports", "Import Markdown files as raw strings for dynamic rendering"],
    ["Static Data Separation", "Data constants separated from rendering"],
]
add_styled_table(doc, tech_headers, tech_rows, col_widths=[5, 11])

doc.add_page_break()

# ══════════════════════════════════════════════════════════════════
# 6. DESIGN DISCUSSION
# ══════════════════════════════════════════════════════════════════

add_heading1(doc, "6. Design Discussion", bookmark="sec_design")

add_heading2(doc, "6.1 Architecture and Component Diagram")
add_body(doc, "main.tsx → App.tsx → HashRouter → Navbar + AppRouter → Pages → Hooks (useTheme, useChat) → Styles (CSS Modules + Variables). HashRouter is used instead of BrowserRouter for GitHub Pages static hosting compatibility.")
doc.add_picture(os.path.join(os.path.dirname(os.path.abspath(__file__)), "Block Diagram.png"), width=Inches(3.5))
doc.add_picture(os.path.join(os.path.dirname(os.path.abspath(__file__)), "Component diagram.png"), width=Inches(3.5))

add_heading2(doc, "6.2 Control Flow Diagram")
doc.add_picture(os.path.join(os.path.dirname(os.path.abspath(__file__)), "Control Flow Diagram.png"), width=Inches(3.5))

add_heading2(doc, "6.3 Design Decisions")

decisions = [
    ("CSS Variables in index.css", "Shared theming and auto dark mode."),
    ("useTheme Hook", "Theme detection and toggle logic separated from UI; persists choice via localStorage."),
    ("useChat Hook", "Chat logic separated from UI with auto-reply and localStorage persistence."),
    ("Static Data Separation", "Data constants kept apart from rendering."),
    ("react-markdown for Blog and README", "Render rich text without a CMS; README page imports the repository's README.md via Vite ?raw."),
    ("HashRouter instead of BrowserRouter", "Ensures sub-routes work on GitHub Pages static hosting without server-side rewrite rules."),
]

for i, (title, desc) in enumerate(decisions, 1):
    p = doc.add_paragraph()
    run_num = p.add_run(f"{i}. {title}: ")
    run_num.bold = True
    p.add_run(desc)

doc.add_page_break()

# ══════════════════════════════════════════════════════════════════
# 7. CODE LISTING
# ══════════════════════════════════════════════════════════════════

add_heading1(doc, "7. Code Listing", bookmark="sec_code")

add_heading2(doc, "7.1 GitHub Repository")
p = doc.add_paragraph()
run = p.add_run("https://github.com/franklinprivateuse-jpg/assignment")
run.font.color.rgb = RGBColor(0x25, 0x63, 0xEB)
run.underline = True

add_heading2(doc, "7.2 Project Structure")

structure = """kewei-portfolio/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── app/
│   │   └── AppRouter.tsx          # Route configuration
│   ├── assets/
│   │   ├── background_picture.png
│   │   └── gallery.png
│   ├── components/
│   │   └── navbar/
│   │       ├── Navbar.tsx         # Navigation with hamburger menu
│   │       └── Navbar.module.css
│   ├── data/
│   │   └── posts.ts               # Blog post data
│   ├── hooks/
│   │   ├── useChat.ts             # Chat logic with localStorage
│   │   └── useTheme.ts            # Theme toggle with localStorage
│   ├── pages/
│   │   ├── page.module.css        # Shared page layout
│   │   ├── about/
│   │   ├── blog/
│   │   │   ├── Blog.tsx
│   │   │   ├── BlogDetail.tsx
│   │   │   ├── types.ts
│   │   │   └── *.module.css
│   │   ├── education/
│   │   ├── gallery/
│   │   ├── home/
│   │   ├── knowledge/
│   │   ├── messaging/
│   │   ├── notfound/              # 404 page
│   │   ├── readme/                # README rendered via react-markdown
│   │   └── videos/
│   ├── utils/
│   │   └── date.ts                # Date formatting utility
│   ├── App.tsx                    # Root component (HashRouter)
│   ├── index.css                  # Global styles & CSS variables
│   ├── main.tsx                   # Entry point
│   └── vite-env.d.ts              # Vite + ?raw module declarations
├── index.html
├── package.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── eslint.config.js"""

p = doc.add_paragraph()
run = p.add_run(structure)
run.font.name = "Consolas"
run.font.size = Pt(8)

# ══════════════════════════════════════════════════════════════════
# 8. INNOVATION
# ══════════════════════════════════════════════════════════════════

add_heading1(doc, "8. Innovation", bookmark="sec_innovation")

add_heading2(doc, "8.1 Architecture Innovation")
add_body(doc, "Page-based layout with co-located CSS Modules — no global state, clear separation, Markdown blog without a CMS.")

# ══════════════════════════════════════════════════════════════════
# 9. CRITIQUE
# ══════════════════════════════════════════════════════════════════

add_heading1(doc, "9. Critique", bookmark="sec_critique")

add_heading2(doc, "9.1 Strengths")

strengths = [
    "Clean separation of pages, components, hooks, and styles.",
    "CSS variables with auto dark mode and manual toggle (useTheme hook).",
    "useChat hook separates logic from UI with localStorage persistence.",
    "Hamburger menu ensures mobile usability across all screen sizes.",
    "HashRouter enables GitHub Pages deployment without 404 issues on refresh.",
    "README page renders the repository's README.md dynamically via react-markdown.",
]
for s in strengths:
    doc.add_paragraph(s, style="List Bullet")

add_heading2(doc, "9.2 Weaknesses")

weaknesses = [
    "No automated tests (unit or integration).",
    "The messaging auto-reply bot uses simple keyword matching, not a real backend.",
    "Blog content is hardcoded in static data files rather than a CMS.",
]
for w in weaknesses:
    doc.add_paragraph(w, style="List Bullet")

add_heading2(doc, "9.3 Enhancement Suggestions")

suggestions = [
    "Add unit tests for the useTheme and useChat hooks using Vitest and React Testing Library.",
    "Connect the messaging feature to a real backend or AI API for meaningful replies.",
    "Move blog content to a headless CMS or Markdown files loaded at build time.",
    "Add page-level code splitting with React.lazy to reduce the initial bundle size.",
]
for s in suggestions:
    doc.add_paragraph(s, style="List Bullet")

# ══════════════════════════════════════════════════════════════════
# 10. REFLECTION
# ══════════════════════════════════════════════════════════════════

add_heading1(doc, "10. Reflection", bookmark="sec_reflection")

add_heading2(doc, "10.1 Learning Outcomes")
learnings = [
    "Using CSS variables and CSS Modules for scoped, themeable styling.",
    "Separating logic from UI with custom hooks (useTheme, useChat).",
    "Page routing with React Router and HashRouter for static hosting.",
    "Rendering Markdown dynamically with react-markdown and Vite ?raw imports.",
    "Creating responsive navigation with a hamburger menu and CSS media queries.",
]
for l in learnings:
    doc.add_paragraph(l, style="List Bullet")

add_heading2(doc, "10.2 Challenges Faced")
challenges = [
    "Balancing features and quality in limited time.",
    "Too many navbar links for mobile screens — resolved by implementing a hamburger menu with a toggle state.",
    "BrowserRouter caused 404 errors on page refresh in static hosting — resolved by switching to HashRouter.",
    "Rendering the repository README inside the app without duplication — resolved by importing README.md as a raw string via Vite ?raw and rendering it with react-markdown.",
]
for c in challenges:
    doc.add_paragraph(c, style="List Bullet")

# ══════════════════════════════════════════════════════════════════
# 11. REFERENCES
# ══════════════════════════════════════════════════════════════════

add_heading1(doc, "11. References", bookmark="sec_references")

references = [
    "GeeksforGeeks (2025). Difference Between TypeScript and JavaScript. Available at: https://www.geeksforgeeks.org/typescript/difference-between-typescript-and-javascript/ (Accessed: September 2026).",
    "Mohanty, S. (2024). Difference Between Vite and Normal NPM. Available at: https://medium.com/@mailtosatyabratamohanty/difference-between-vite-and-normal-npm-2097c277beb0 (Accessed: September 2026).",
]

for i, ref in enumerate(references, 1):
    p = doc.add_paragraph()
    run = p.add_run(f"[{i}] {ref}")
    run.font.size = Pt(10)

# ── Save ──────────────────────────────────────────────────────────

output_dir = os.path.dirname(os.path.abspath(__file__))
output_path = os.path.join(output_dir, "Kewei_Portfolio_Technical_Report.docx")
doc.save(output_path)
print(f"Word document generated: {output_path}")