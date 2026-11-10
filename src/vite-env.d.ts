/// <reference types="vite/client" />

// Allow importing Markdown files as raw strings (used by the README page)
declare module '*.md?raw' {
  const content: string;
  export default content;
}