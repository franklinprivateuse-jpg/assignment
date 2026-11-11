# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

## [0.1.0] - 2026-11-01

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