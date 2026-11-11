import { useState, useEffect } from 'react';
import styles from './Admin.module.css';
import layout from '../page.module.css';

/** Admin message shape — matches backend AdminMessageVO
 *  (has sessionId and createdAt that visitors never see) */
interface AdminMessage {
  id: number;
  sessionId: string;
  text: string;
  sender: 'user' | 'bot';
  createdAt: string;
}

/** localStorage key for the admin token so the owner does not retype it */
const ADMIN_TOKEN_KEY = 'portfolio-admin-token';

/** Group messages by sessionId so each conversation is readable */
function groupBySession(messages: AdminMessage[]): Map<string, AdminMessage[]> {
  const groups = new Map<string, AdminMessage[]>();
  for (const msg of messages) {
    const list = groups.get(msg.sessionId) ?? [];
    list.push(msg);
    groups.set(msg.sessionId, list);
  }
  return groups;
}

/** Format ISO timestamp to a short readable form (yyyy-MM-dd HH:mm) */
function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Admin page — owner-only view of all visitor conversations.
 * Requires the X-Admin-Token header, so the token is typed once,
 * stored in localStorage, and sent with every API request.
 * This route is intentionally NOT in the public navbar; the owner
 * navigates to /admin directly.
 */
const Admin: React.FC = () => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(ADMIN_TOKEN_KEY));
  const [tokenInput, setTokenInput] = useState('');
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  // Start in loading state when a stored token will trigger an auto-fetch on mount
  const [loading, setLoading] = useState<boolean>(() => !!localStorage.getItem(ADMIN_TOKEN_KEY));
  const [error, setError] = useState<string | null>(null);
  // Bumping this counter re-triggers the fetch effect (manual refresh)
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch all messages whenever the token changes or refresh is clicked.
  // Inline async IIFE + cancelled guard: every setState call sits AFTER
  // the await, so nothing runs synchronously in the effect body
  // (required by the react-hooks/set-state-in-effect lint rule).
  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    console.info('[admin] Fetching all messages...');
    (async () => {
      try {
        const res = await fetch('/api/v1/messages/all', {
          headers: { 'X-Admin-Token': token },
        });
        if (cancelled) return;
        // 401 = bad token: clear it so the input form shows again
        if (res.status === 401) {
          console.warn('[admin] Invalid admin token (401)');
          localStorage.removeItem(ADMIN_TOKEN_KEY);
          setToken(null);
          setError('Invalid admin token. Please try again.');
          return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: AdminMessage[] = await res.json();
        // Log counts only — never the token or message bodies
        const sessionIds = new Set(data.map((m) => m.sessionId));
        console.info(`[admin] Loaded ${data.length} messages in ${sessionIds.size} session(s)`);
        if (!cancelled) setMessages(data);
      } catch {
        console.error('[admin] Failed to load messages');
        if (!cancelled) setError('Could not load messages. Is the backend running?');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    // Avoid setting state after the token changes mid-fetch
    return () => {
      cancelled = true;
    };
  }, [token, refreshKey]);

  /** Save the typed token and trigger loading */
  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = tokenInput.trim();
    if (!trimmed) return;
    // Log sign-in event without leaking the token value
    console.info('[admin] Sign-in submitted');
    localStorage.setItem(ADMIN_TOKEN_KEY, trimmed);
    setToken(trimmed);
    setTokenInput('');
    // Event handler: synchronous setState is allowed here (not in an effect)
    setLoading(true);
    setError(null);
  };

  /** Re-fetch by bumping the effect's dependency (see refreshKey above) */
  const handleRefresh = () => {
    if (loading) return;
    console.info('[admin] Manual refresh requested');
    setLoading(true);
    setError(null);
    setRefreshKey((k) => k + 1);
  };

  /** Forget the token and go back to the login form */
  const handleLogout = () => {
    console.info('[admin] Sign-out');
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    setToken(null);
    setMessages([]);
    setError(null);
    setLoading(false);
  };

  // --- No token yet: show the login form ---
  if (!token) {
    return (
      <div className={layout.container}>
        <h1 className={layout.title}>Admin</h1>
        <p className={layout.subtitle}>Enter the admin token to view all messages</p>
        <form className={styles.tokenForm} onSubmit={handleTokenSubmit}>
          <input
            type="password"
            className={styles.tokenInput}
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="Admin token"
            aria-label="Admin token"
            autoFocus
          />
          <button type="submit" className={styles.tokenButton}>
            Sign in
          </button>
        </form>
        {/* type="password" hides the token from shoulder-surfing */}
        {error && <div className={styles.errorText}>{error}</div>}
      </div>
    );
  }

  // --- Token present: show all conversations grouped by session ---
  const sessions = groupBySession(messages);

  return (
    <div className={layout.container}>
      <div className={styles.headerRow}>
        <h1 className={layout.title}>Admin</h1>
        <div className={styles.actions}>
          <button type="button" className={styles.actionButton} onClick={handleRefresh} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </button>
          <button type="button" className={styles.actionButton} onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </div>
      <p className={layout.subtitle}>
        {messages.length} message{messages.length === 1 ? '' : 's'} in {sessions.size} session{sessions.size === 1 ? '' : 's'}
      </p>

      {error && <div className={styles.errorText}>{error}</div>}

      {messages.length === 0 && !loading && !error && (
        <div className={styles.emptyState}>No messages yet.</div>
      )}

      <div className={styles.sessionList}>
        {[...sessions.entries()].map(([sessionId, msgs]) => (
          <div key={sessionId} className={styles.sessionCard}>
            <div className={styles.sessionHeader}>
              <span className={styles.sessionId}>{sessionId}</span>
              <span className={styles.sessionCount}>{msgs.length} messages</span>
            </div>
            <div className={styles.sessionMessages}>
              {msgs.map((msg) => (
                <div key={msg.id} className={msg.sender === 'user' ? styles.msgUser : styles.msgBot}>
                  <span className={styles.msgText}>{msg.text}</span>
                  <span className={styles.msgTime}>{formatTime(msg.createdAt)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;