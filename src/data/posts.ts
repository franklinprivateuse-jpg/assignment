import type { BlogPost } from '../pages/blog/types';

/** All blog posts — single source of truth shared by Blog and BlogDetail */
export const POSTS: BlogPost[] = [
  {
    id: 1,
    date: '2025-09-01',
    title: 'What is the Relationship Between React and JavaScript?',
    excerpt:
      'Understanding how React relates to JavaScript and why you need to master JavaScript before learning React.',
    content: `React is a JavaScript library — it is not a separate language, it is JavaScript.

## What React Does

- **Components**: Break UI into reusable pieces.
- **Declarative**: You say what the UI looks like, React updates the DOM.
- **State**: \`useState\` tracks data that changes.
- **Virtual DOM**: React only updates what changed, making it fast.

## Why Learn JavaScript First

Hooks are closures. Lists are array methods. Bugs are JavaScript bugs. Without JS basics, React will feel confusing.

## TL;DR

React = JavaScript + a smarter way to write UI. Learn JS first.`,
  },
];