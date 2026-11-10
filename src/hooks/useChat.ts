import { useState, useCallback, useEffect } from 'react';

/** A single chat message from either the user or the bot */
interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

/** localStorage key for persisting chat messages */
const STORAGE_KEY = 'portfolio-chat-messages';

/** Keyword-to-reply rules for generating relevant auto-replies */
const REPLY_RULES: { keywords: string[]; reply: string }[] = [
  {
    keywords: ['hello', 'hi', 'hey', 'greetings'],
    reply: 'Hello! Thanks for visiting my portfolio. How can I help you?',
  },
  {
    keywords: ['job', 'work', 'experience', 'hire', 'career'],
    reply: 'I have seven years of industry experience — check out the About and Education pages for details!',
  },
  {
    keywords: ['project', 'portfolio', 'website', 'app'],
    reply: 'This portfolio is built with React, TypeScript and Vite. The Gallery page has project highlights.',
  },
  {
    keywords: ['skill', 'tech', 'technology', 'stack', 'language'],
    reply: 'My main skills include Java, TypeScript and React — see the Knowledge page for the full list.',
  },
  {
    keywords: ['education', 'study', 'university', 'degree', 'master'],
    reply: 'I am studying for an MSc in Software Engineering at the University of Limerick.',
  },
  {
    keywords: ['contact', 'email', 'reach', 'message'],
    reply: 'You can leave a message here and I will get back to you. Thanks for reaching out!',
  },
  {
    keywords: ['blog', 'article', 'post', 'write'],
    reply: 'I write about software development on the Blog page — take a look!',
  },
];

/** Default reply when no keyword matches */
const DEFAULT_REPLY =
  'Thanks for your message! I will get back to you soon. You can also explore the About, Knowledge and Blog pages.';

/** Pick a relevant reply based on keywords in the user's message */
function pickReply(userText: string): string {
  const lower = userText.toLowerCase();
  for (const rule of REPLY_RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return rule.reply;
    }
  }
  return DEFAULT_REPLY;
}

/** Load persisted messages from localStorage */
function loadMessages(): Message[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Message[]) : [];
  } catch {
    return [];
  }
}

/** Persist messages to localStorage */
function saveMessages(messages: Message[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // Storage may be unavailable (private mode) — silently ignore
  }
}

/**
 * Custom hook for a simple chat interface.
 * Persists messages to localStorage so they survive a page refresh,
 * and generates keyword-based auto-replies.
 */
export function useChat(): {
  messages: Message[];
  sendMessage: (text: string) => void;
  clearMessages: () => void;
} {
  const [messages, setMessages] = useState<Message[]>(loadMessages);

  // Persist messages to localStorage whenever they change
  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

  // Send a user message and append a relevant bot auto-reply
  const sendMessage = useCallback((text: string) => {
    setMessages((prev) => {
      const baseId = prev.length > 0 ? prev[prev.length - 1].id : 0;
      const userMsg: Message = { id: baseId + 1, text, sender: 'user' };
      const botMsg: Message = {
        id: baseId + 2,
        text: pickReply(text),
        sender: 'bot',
      };
      return [...prev, userMsg, botMsg];
    });
  }, []);

  // Clear all messages and remove them from storage
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return { messages, sendMessage, clearMessages };
}