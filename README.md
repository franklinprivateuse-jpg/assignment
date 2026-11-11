# Kewei's Digital Portfolio

A functional digital portfolio built with React, TypeScript, and Vite.

**Repository:** [https://github.com/franklinprivateuse-jpg/assignment](https://github.com/franklinprivateuse-jpg/assignment)

**Live Demo:** [https://franklinprivateuse-jpg.github.io/assignment](https://franklinprivateuse-jpg.github.io/assignment)

## Project Structure

```
kewei-portfolio/
├── public/                  # Static assets (favicon, icons)
├── requirements/            # Assessment requirements and coding standards
├── src/
│   ├── app/
│   │   └── AppRouter.tsx    # Route configuration for all pages
│   ├── assets/              # Images and media files
│   ├── components/
│   │   └── navbar/          # Navigation bar component
│   │       ├── Navbar.tsx
│   │       └── Navbar.module.css
│   ├── data/
│   │   └── posts.ts         # Shared blog post data (typed)
│   ├── features/            # Feature modules (reserved)
│   ├── hooks/
│   │   ├── useChat.ts       # Custom hook for messaging functionality
│   │   └── useTheme.ts      # Custom hook for light/dark theme toggle
│   ├── i18n/                # Internationalization (reserved)
│   ├── pages/
│   │   ├── page.module.css  # Shared page layout styles
│   │   ├── home/            # Home page - portfolio landing
│   │   ├── about/           # About page - personal introduction
│   │   ├── education/       # Education page - academic background
│   │   ├── knowledge/       # Professional Knowledge page - skills & expertise
│   │   ├── gallery/         # Pictures Gallery page - photo showcase
│   │   ├── videos/          # Video Gallery page - video showcase
│   │   ├── blog/            # Blog page - articles and posts
│   │   ├── messaging/       # Instant Messaging page - contact/leave a message
│   │   ├── notfound/        # 404 page - shown for unknown URLs
│   │   ├── readme/          # Project page - renders intro.md
│   │   └── admin/           # Admin page - owner-only message dashboard
│   ├── utils/
│   │   └── date.ts          # Date formatting utility
│   ├── App.tsx              # Root component with layout and HashRouter
│   ├── index.css            # Global styles and CSS variables
│   ├── main.tsx             # Application entry point
│   └── vite-env.d.ts        # Vite type declarations
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── tsconfig.app.json        # App-specific TypeScript config
├── tsconfig.node.json       # Node-specific TypeScript config
├── vite.config.ts           # Vite build configuration
└── eslint.config.js         # ESLint configuration
```

## Pages

| Page | Path | Description |
|------|------|-------------|
| Home | `/` | Portfolio landing page with hero section |
| About | `/about` | Personal introduction and background |
| Education | `/education` | Academic history and qualifications |
| Professional Knowledge | `/knowledge` | Skills, technologies, and expertise |
| Pictures Gallery | `/gallery` | Photo gallery showcase |
| Video Gallery | `/videos` | Video gallery with YouTube embed |
| Blog | `/blog` | Blog articles and posts |
| Instant Messaging | `/messaging` | Contact form with auto-reply, backed by portfolio API |
| Project | `/readme` | Concise project overview (intro.md) |
| Admin | `/admin` | Owner-only dashboard: view all visitor messages (hidden from navbar) |
| NotFound | `*` | 404 page for unknown URLs |

## Tech Stack

- **Framework:** React 19
- **Language:** TypeScript
- **Build Tool:** Vite
- **Routing:** React Router DOM v7 (HashRouter for static hosting compatibility)
- **Styling:** CSS Modules with centralized theme variables
- **Markdown Rendering:** react-markdown (renders intro.md on the Project page)
- **Backend:** Spring Boot + H2 ([kewei-portfolio-api](https://github.com/franklinprivateuse-jpg/kewei-portfolio-api)) — chat messages and auto-reply

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to GitHub Pages (builds and pushes dist/ to gh-pages branch)
npm run deploy
```

## Coding Standards

This project follows the coding standards defined in `requirements/coding-standards.md`, including:

- kebab-case for directory and file names
- CSS Modules for component styling
- Centralized CSS variables for theming
- No `any` type usage in TypeScript
- Reserved directories for future features (`i18n/`, `features/`)

## Changelog

Version history follows the [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format.
See [`CHANGELOG.md`](CHANGELOG.md) for the full changelog.

### Pending Items (Not Yet Fixed)

The first four items require external resources or inputs. The remaining items (P1–P9) are planned improvements identified in the peer review that have not yet been implemented.

| ID | Issue | Why It Is Pending |
|----|-------|-------------------|
| C4 | Chat is not real instant messaging | A true chat backend (Firebase, custom API, etc.) is required for message delivery to the author and multi-device sync. Current solution uses localStorage + keyword-matched replies as a transitional approach. |
| C7 | Gallery lacks real project/event photos | Real photos must be provided by the site owner. The component structure, alt text, and layout are ready for images to be dropped in. |
| D6 | References are not academic sources | Replacing web references with peer-reviewed literature requires searching academic databases (IEEE, ACM, etc.) for suitable sources. |
| D7 | No analysis of the given portfolio brief | The original portfolio assets provided at the start of the module are needed to write the analysis. |
| P1 | Page data still stored inside components (Home, Videos, Gallery, Knowledge, Education) | Only Blog data was moved to `data/posts.ts`. The remaining pages still hold their data inline; moving each to a separate data file keeps content separate from layout per the coding standards. |
| P2 | No automated tests | Requires installing Vitest + React Testing Library. Recommended starting point: `useChat` hook (pure logic, no layout dependency). |
| P3 | No CI/CD pipeline | Requires setting up GitHub Actions to run lint, build, and tests on every push, then deploy to GitHub Pages automatically. |
| P4 | No Error Boundary | A single component error can blank the entire site. Adding an Error Boundary with a friendly fallback message is recommended. |
| P5 | No per-page titles or meta descriptions | Each page should set its own `<title>` and a short meta description for browser tabs and search engines. |
| P6 | No Lighthouse audit | Running Chrome Lighthouse after each iteration would help track accessibility, performance, and best-practice improvements. |
| P7 | Report: TOC lacks page numbers; abstract does not mention results | The table of contents needs page numbers; the abstract should be extended to summarise the project results. |
| P8 | README lacks screenshot and requirements/design sections | Adding a screenshot of the live site and a short requirements or design section would make the README more complete. |
| P9 | Background image not compressed to WebP | `background_picture.png` is still 324 KB. Converting to WebP would reduce every page load. |
| P10 | Prettier not installed | Prettier with a shared config would keep formatting consistent across the project; currently indentation is fixed manually. |