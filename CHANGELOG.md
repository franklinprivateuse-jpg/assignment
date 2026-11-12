# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- GSAP entrance animations on the Home page — hero section fade-in/slide-up and feature cards stagger animation via a reusable `useGsapFadeIn` hook
- Route-level lazy loading — all 12 page components are now `React.lazy`-loaded with a `Suspense` fallback, splitting each page into its own bundle chunk
- Keyword search on the Blog page — search box filters posts by title and excerpt (case-insensitive, client-side)

## [0.3.0] - 2026-11-12

### Added
- GitHub Actions CI workflow (`.github/workflows/ci.yml`) — runs ESLint and production build on every push/PR to `main`
- GitHub Actions CD workflow (`.github/workflows/deploy.yml`) — builds and deploys to GitHub Pages automatically on every push to `main` (replaces manual `npm run deploy`)
- Blog management panel on the Admin page (`/admin` → "Blog Posts" tab) — create, edit, and delete posts via the admin API (POST/PUT/DELETE `/api/v1/posts` with `X-Admin-Token` header); tab switcher between Messages and Blog Posts panels
- `useAdminPosts` hook for admin blog CRUD operations with automatic list refresh after each mutation

### Changed
- Blog page (`/blog`) now fetches post list from the backend API (`GET /api/v1/posts`) instead of hardcoded data
- Blog detail page (`/blog/:id`) now fetches post content from the backend API (`GET /api/v1/posts/{id}`) instead of hardcoded data

### Removed
- `src/data/posts.ts` — hardcoded blog posts replaced by database-backed API (FR5: posts stored in database, not hardcoded)

## [0.2.0] - 2026-11-11

### Added
- Admin dashboard page (`/admin`) with token login — owner-only view of all visitor messages grouped by session (GET `/api/v1/messages/all` with `X-Admin-Token` header); route hidden from navbar
- Privacy notice on the Messaging page telling visitors the site owner can see their messages
- Concise `intro.md` for the Project page

### Changed
- `useChat` hook rewritten from local-only (localStorage + fake replies) to backend REST API calls (POST/GET/DELETE `/api/v1/messages`); sessionId persisted in localStorage; loading/error states
- Vite dev-server proxy added (`/api` → `localhost:8080`) so frontend and backend share the same origin in development
- Project page now renders `intro.md` instead of the full repository README (which contains developer-only changelogs)
- Navbar label "README" renamed to "Project"

## [0.1.0] - 2026-11-10

### Added
- Mobile hamburger menu for screens ≤ 768px (C12)
- Manual light/dark theme toggle via `useTheme` hook, persisted to localStorage (C14)

### Changed
- Blog data extracted to a single typed `posts.ts` shared by Blog and BlogDetail (C3)
- Chat messages persist to localStorage; replies use keyword matching — transitional, see Pending Items (C4)
- Section comments added to all 12 CSS Module files (C9)
- README page renders `README.md` dynamically via react-markdown + Vite `?raw` (D5)
- README updated with repository and Live Demo links (D5)
- Report updated: phase plan changes, personas/user stories/NFRs added, diagrams redrawn (D1–D4)
- Vite `base` set to `/assignment/` for GitHub Pages sub-path

### Fixed
- Catch-all route added (`*` → NotFound); unknown URLs no longer blank (C1)
- Blog links generated for every article by id (C2)
- Auto-scroll to latest message; input `aria-label` added (C5)
- JD.com experience moved out of Education; unified to English; `id` used as key (C6)
- Gallery placeholder replaced with image (alt text + lazy loading) (C7)
- Home inline styles moved to CSS Modules (C8)
- Videos iframe indentation unified (C10)
- Unused assets removed; misspelled `background_pricture.png` renamed (C11)
- BlogDetail header comment added (C13)
- About highlighted words no longer appear as clickable links (C15)
- Blog dates formatted with `toLocaleDateString` (C16)
- BrowserRouter 404 on refresh → switched to HashRouter for static hosting