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

### Peer Review Fixes (November 2026)

Issues below were identified during the Phase 1 peer review and have been fixed.

#### Code Fixes (C1–C16)

| ID | File | Issue | Fix |
|----|------|-------|-----|
| C1 | `AppRouter.tsx` | No catch-all route; unknown URLs showed a blank page | Added `<Route path="*">` pointing to the NotFound page |
| C2 | `Blog.tsx` | Only the article with id=1 had a link | Added `<Link>` for every article by id |
| C3 | `Blog.tsx` / `BlogDetail.tsx` / `types.ts` | Title and date stored twice; BlogDetail defined its own type; `content` field unused | Extracted a single typed `posts.ts` data file shared by both pages |
| C4 | `useChat.ts` | Messages lost on refresh; replies were random | Messages now persist to localStorage; replies use keyword matching (partial — see Pending Items) |
| C5 | `Messaging.tsx` | No auto-scroll to latest message; input had no label | Added `useRef` + `scrollIntoView`; added `aria-label` |
| C6 | `Education.tsx` | JD.com work experience listed under Education; mixed Chinese/English; `date` used as key | Moved to Experience section; unified to English; switched to `id` as key |
| C7 | `Gallery.tsx` | Only placeholder text, no real images | Added image with alt text and lazy loading (placeholder photo — see Pending Items) |
| C8 | `Home.tsx` | Inline styles violated CSS Modules convention | Moved all inline styles into `Home.module.css` |
| C9 | 12 `.module.css` files | No comments in any CSS Module | Added section comments to all CSS Module files |
| C10 | `Videos.tsx` | Inconsistent iframe indentation | Unified indentation manually (Prettier not yet installed — see Pending Items) |
| C11 | `src/assets` | Unused assets; background image misspelled (`background_pricture.png`) | Removed unused files; renamed to `background_picture.png` (compression to WebP not yet done — see Pending Items) |
| C12 | `Navbar.module.css` | Mobile nav wrapped into three rows and occupied the screen | Added hamburger menu button with toggle state for screens ≤ 768px |
| C13 | `BlogDetail.tsx` | Only component without a header comment | Added a concise header comment |
| C14 | `index.css` | Dark mode only followed system preference; visitors could not toggle | Added light/dark toggle button via `useTheme` hook; choice persisted to localStorage |
| C15 | `About.module.css` | Highlighted words used link colour, appearing clickable but not clickable | Changed to normal colour with bold weight |
| C16 | `Blog.tsx` | Dates displayed in raw, unreadable format | Formatted with `toLocaleDateString` |

#### Documentation & Design Fixes (D1–D5)

| ID | Object | Issue | Fix |
|----|--------|-------|-----|
| D1 | Report: Phase Plan | Completed features were planned in Phase 2 | Moved Dark Mode, Error Handling, and Responsive Design into Phase 1; added a "Plan Changes" subsection explaining the reasons |
| D2 | Report: Requirements | No personas, scenarios, user stories, or non-functional requirements | Added 3 personas (recruiter, client, peer reviewer) with scenarios; added FR-01–FR-12 user stories and NFR-01–NFR-06 non-functional requirements |
| D3 | Control Flow Diagram | Diagram showed a 404 page that did not exist in code | Implemented the NotFound page to match the diagram |
| D4 | Block & Component Diagrams | Component diagram was a text tree; missing CSS/theme/YouTube dependencies | Redrew both diagrams with nodes, dependency arrows, and all layers (Entry → App → View → Page → Logic → Style → External) |
| D5 | README file & page | No online/repository links; README page was standalone text | Added repository and Live Demo links to README; README page now renders `README.md` dynamically via `react-markdown` + Vite `?raw` import |

#### Deployment Compatibility Fix

| Issue | Fix |
|-------|-----|
| BrowserRouter returns 404 on GitHub Pages when refreshing sub-routes (e.g. `/about`) | Switched from BrowserRouter to HashRouter in `App.tsx` for static hosting compatibility |
| Asset paths broke on GitHub Pages (served under `/assignment/` sub-path) | Set `base: '/assignment/'` in `vite.config.ts`; deployed `dist/` to the `gh-pages` branch |

**Live Demo deployed and verified:** [https://franklinprivateuse-jpg.github.io/assignment](https://franklinprivateuse-jpg.github.io/assignment)

### Backend Integration (November 2026)

Connected the frontend to the Spring Boot backend API ([kewei-portfolio-api](https://github.com/franklinprivateuse-jpg/kewei-portfolio-api)).

| File | Change |
|------|--------|
| `src/hooks/useChat.ts` | Rewritten from local-only (localStorage + fake replies) to backend REST API calls (POST/GET/DELETE `/api/v1/messages`); sessionId persisted in localStorage; loading/error states |
| `vite.config.ts` | Added dev-server proxy (`/api` → `localhost:8080`) so the frontend and backend share the same origin in development |
| `src/pages/admin/Admin.tsx` + `Admin.module.css` | New Admin page: token login, view all visitor messages grouped by session (GET `/api/v1/messages/all` with `X-Admin-Token` header); route `/admin` hidden from navbar |
| `src/pages/messaging/Messaging.tsx` | Loading/error states (disable input while sending, error banner); privacy note telling visitors the owner can see their messages |
| `src/pages/readme/Readme.tsx` + `intro.md` | README page now renders a concise `intro.md` instead of the full repository README (which contains developer-only changelogs) |
| `src/components/navbar/Navbar.tsx` | Renamed "README" nav label to "Project" |

### Pending Items (Not Yet Fixed)

The first four items require external resources or inputs. The remaining items (P1–P9) are planned improvements identified in the peer review that have not yet been implemented.

| ID | Issue | Why It Is Pending |
|----|-------|-------------------|
| C4 | ~~Chat is not real instant messaging~~ **Resolved** | Chat now uses the Spring Boot backend API (`kewei-portfolio-api`) for message persistence and auto-reply. See "Backend Integration" section above. |
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