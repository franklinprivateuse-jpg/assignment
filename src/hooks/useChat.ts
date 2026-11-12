import { useState, useCallback, useEffect, useRef } from 'react';
import { isBackendDown, BACKEND_DOWN_MSG } from '../utils/backend';

/** A single chat message from either the user or the bot.
 *  Field names match the backend MessageVO (id, text, sender). */
interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

/** localStorage key for persisting the visitor's session ID */
const SESSION_KEY = 'portfolio-chat-session-id';

/**
 * Backend API base. Empty string = same origin, so the Vite dev-server
 * proxy (vite.config.ts) forwards /api to localhost:8080.
 */
const API_BASE = '';

/** Read the stored session ID, or create one for a new visitor */
function getSessionId(): string {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    // Timestamp + random suffix is unique enough for a portfolio chat
    id = `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    localStorage.setItem(SESSION_KEY, id);
    console.info('[chat] Created new session:', id);
  } else {
    console.info('[chat] Reusing existing session:', id);
  }
  return id;
}

/**
 * Custom hook for the chat interface.
 * Talks to the backend API so messages and auto-replies are persisted
 * server-side; only the session ID is kept in localStorage so the
 * visitor's history survives a page refresh.
 */
export function useChat(): {
  messages: Message[];
  sendMessage: (text: string) => Promise<void>;
  clearMessages: () => Promise<void>;
  loading: boolean;
  error: string | null;
} {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // useRef: the session ID never changes for the lifetime of the page
  const sessionIdRef = useRef<string>(getSessionId());

  // Load this session's chat history from the backend on first render
  useEffect(() => {
    let cancelled = false;
    const sessionId = sessionIdRef.current;
    (async () => {
      try {
        // encodeURIComponent: sessionId contains random chars; encode it
        // so special characters never break the query string
        const res = await fetch(
          `${API_BASE}/api/v1/messages?sessionId=${encodeURIComponent(sessionId)}`,
        );
        // fetch does NOT throw on 4xx/5xx, so we must check res.ok manually
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: Message[] = await res.json();
        if (!cancelled) setMessages(data);
      } catch (err) {
        // Distinguish "backend not running" (network error) from HTTP errors
        if (!cancelled) setError(isBackendDown(err) ? BACKEND_DOWN_MSG : 'Could not load chat history.');
      }
    })();
    // Avoid setting state after the component unmounts
    return () => {
      cancelled = true;
    };
  }, []);

  // Send a user message; the backend saves it and returns the auto-reply
  const sendMessage = useCallback(async (text: string) => {
    // Loading flag disables the form (see Messaging.tsx) so the visitor
    // cannot fire a second request while the first one is still pending
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/v1/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: sessionIdRef.current, text }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      // Backend returns { userMessage, botMessage } — append both
      const data: { userMessage: Message; botMessage: Message } = await res.json();
      setMessages((prev) => [...prev, data.userMessage, data.botMessage]);
    } catch (err) {
      setError(isBackendDown(err) ? BACKEND_DOWN_MSG : 'Message could not be sent. Please try again.');
    } finally {
      // Always reset loading, even on failure, so the form is usable again
      setLoading(false);
    }
  }, []);

  // Delete this session's history on the backend, then clear the UI
  const clearMessages = useCallback(async () => {
    try {
      await fetch(
        `${API_BASE}/api/v1/messages?sessionId=${encodeURIComponent(sessionIdRef.current)}`,
        { method: 'DELETE' },
      );
      setMessages([]);
      setError(null);
    } catch (err) {
      setError(isBackendDown(err) ? BACKEND_DOWN_MSG : 'Could not clear messages.');
    }
  }, []);

  return { messages, sendMessage, clearMessages, loading, error };
}