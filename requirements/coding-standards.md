# Coding Standards

## 1. Directory Structure

```
src/
  ├── app/           → Global config (routes, providers, theme)
  ├── pages/         → Page components (1:1 with routes)
  ├── features/      → Feature modules (as needed)
  ├── components/    → Shared UI components
  ├── hooks/         → Custom hooks
  ├── utils/         → Utility functions
  ├── i18n/          → Internationalization (translating text to different languages)
  └── assets/        → Static assets
```

## 2. What Goes Where

- **Pages only handle layout and putting components together, no business logic**
- Shared components go in `components/`, feature-specific components go in the matching `features/`
- Global config (routes, providers, theme) lives in `app/`
- Custom hooks go in `hooks/`, utility functions go in `utils/`

## 3. Naming Rules

- Component files: PascalCase (e.g. `NavBar.tsx`)
- Utility/Hook files: camelCase (e.g. `useAuth.ts`, `formatDate.ts`)
- Component file name must match the component name
- Directory names: kebab-case or camelCase, stay consistent within the project

## 4. Component Rules

- **One component per file**, file name matches component name
- Always use TypeScript: `const MyComp: React.FC = () => {}`
- **Props must be defined as interface, no `any`**
- Internal order: hooks → derived state → event handlers → JSX
- Split components that are over 150 lines

## 5. TypeScript Rules

- **No `any`** — use `unknown` or define a specific type
- Use `interface` for objects, `type` for unions/intersections
- Prefer `const enum` or `as const` objects over regular `enum`
- All API responses must have defined types

## 6. Style Rules

- Prefer CSS Modules or CSS-in-JS to avoid global style conflicts
- Use camelCase (CSS Modules) or BEM for class names
- Manage theme variables in one place, no hardcoded color values

## 7. Commit Rules

- Follow Conventional Commits format
- Branch naming: `feature/xxx`, `fix/xxx`, `refactor/xxx`
- Make sure ESLint and TypeScript checks pass before committing