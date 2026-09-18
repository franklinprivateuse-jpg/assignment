# Kewei's Digital Portfolio

A functional digital portfolio built with React, TypeScript, and Vite.

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
│   ├── features/            # Feature modules (reserved)
│   ├── hooks/
│   │   └── useChat.ts       # Custom hook for messaging functionality
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
│   │   └── readme/          # README page - project structure description
│   ├── utils/               # Utility functions (reserved)
│   ├── App.tsx              # Root component with layout and router
│   ├── index.css            # Global styles and CSS variables
│   └── main.tsx             # Application entry point
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
| Video Gallery | `/videos` | Video gallery showcase |
| Blog | `/blog` | Blog articles and posts |
| Instant Messaging | `/messaging` | Contact form with auto-reply |
| README | `/readme` | Project structure documentation |

## Tech Stack

- **Framework:** React 19
- **Language:** TypeScript
- **Build Tool:** Vite
- **Routing:** React Router DOM v7
- **Styling:** CSS Modules with centralized theme variables

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
```

## Coding Standards

This project follows the coding standards defined in `requirements/coding-standards.md`, including:

- kebab-case for directory and file names
- CSS Modules for component styling
- Centralized CSS variables for theming
- No `any` type usage in TypeScript
- Reserved directories for future features (`utils/`, `i18n/`, `features/`)