import { useState, useEffect } from 'react';
import styles from './Admin.module.css';
import layout from '../page.module.css';
import AdminBlog from './AdminBlog';

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
 * Admin page — owner-only management console with two panels:
 *
 * 1. Messages tab — lists every visitor conversation grouped by
 *    sessionId (GET /api/v1/messages/all, admin-only endpoint).
 * 2. Blog Posts tab — CRUD interface for blog articles, delegated
 *    to the AdminBlog child component (POST/PUT/DELETE /api/v1/posts).
 *
 * Authentication flow:
 *   - The owner types the admin token once; it is persisted in
 *     localStorage so subsequent visits skip the login form.
 *   - Every API request carries the token in the X-Admin-Token header.
 *   - A 401 response clears the stored token and shows the login form.
 *
 * This route is intentionally NOT in the public navbar; the owner
 * navigates to /admin directly by typing the URL.
 */
const Admin: React.FC = () => {
  // token: the admin credential; null = not signed in (show login form).
  // Initialised from localStorage so a returning owner stays signed in.
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(ADMIN_TOKEN_KEY));
  // Controlled input value for the login form
  const [tokenInput, setTokenInput] = useState('');
  // All visitor messages fetched from the admin endpoint
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  // loading: true while the messages fetch is in flight.
  // Starts true when a stored token exists, because the effect will
  // auto-fetch on mount — avoids flashing "No messages yet" prematurely.
  const [loading, setLoading] = useState<boolean>(() => !!localStorage.getItem(ADMIN_TOKEN_KEY));
  // error: user-facing message when the fetch fails (bad token, backend down)
  const [error, setError] = useState<string | null>(null);
  // Bumping this counter re-triggers the fetch effect without changing
  // the token itself (used by the manual Refresh button)
  const [refreshKey, setRefreshKey] = useState(0);
  // Which admin panel is active: 'messages' (visitor conversations)
  // or 'blog' (blog post management). Defaults to 'messages'.
  const [activeTab, setActiveTab] = useState<'messages' | 'blog'>('messages');

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
  // This early return means everything below (tabs, messages, blog
  // panel) only renders when the owner is authenticated.
  if (!token) {
    return (
      <div className={layout.container}>
        <h1 className={layout.title}>Admin</h1>
        <p className={layout.subtitle}>Enter the admin token to view all messages</p>
        {/* Token form — onSubmit persists the token and triggers the
            fetch effect via the token state change */}
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

  // --- Token present: show the management console ---
  // Group messages by sessionId so each visitor conversation renders
  // as a separate card (one session = one visitor's chat history)
  const sessions = groupBySession(messages);

  return (
    <div className={layout.container}>
      {/* Header row: page title on the left, action buttons on the right */}
      <div className={styles.headerRow}>
        <h1 className={layout.title}>Admin</h1>
        <div className={styles.actions}>
          {/* Refresh only makes sense on the Messages tab — the Blog
              tab refreshes itself after every create/update/delete */}
          {activeTab === 'messages' && (
            <button type="button" className={styles.actionButton} onClick={handleRefresh} disabled={loading}>
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          )}
          {/* Sign out clears the token from state AND localStorage,
              returning to the login form */}
          <button type="button" className={styles.actionButton} onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </div>

      {/* Tab switcher: toggles between the two admin panels.
          The active tab gets a primary-color underline (tabActive);
          inactive tabs use the muted style (tab). */}
      <div className={styles.tabBar}>
        <button
          type="button"
          className={activeTab === 'messages' ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab('messages')}
        >
          Messages
        </button>
        <button
          type="button"
          className={activeTab === 'blog' ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab('blog')}
        >
          Blog Posts
        </button>
      </div>

      {/* --- Messages panel: visitor conversations grouped by session --- */}
      {activeTab === 'messages' ? (
        <>
          {/* Summary line: total message count and distinct session count */}
          <p className={layout.subtitle}>
            {messages.length} message{messages.length === 1 ? '' : 's'} in {sessions.size} session{sessions.size === 1 ? '' : 's'}
          </p>

          {/* Error banner — shown when the fetch failed (e.g. backend down) */}
          {error && <div className={styles.errorText}>{error}</div>}

          {/* Empty state — fetch succeeded but no visitor has chatted yet */}
          {messages.length === 0 && !loading && !error && (
            <div className={styles.emptyState}>No messages yet.</div>
          )}

          {/* Session list — one card per visitor conversation.
              Map iteration preserves insertion order, so the most
              recent sessions (highest ids) appear first because the
              API returns messages ordered by id. */}
          <div className={styles.sessionList}>
            {[...sessions.entries()].map(([sessionId, msgs]) => (
              <div key={sessionId} className={styles.sessionCard}>
                {/* Card header: session id (monospace, generated by the
                    frontend useChat hook) and message count */}
                <div className={styles.sessionHeader}>
                  <span className={styles.sessionId}>{sessionId}</span>
                  <span className={styles.sessionCount}>{msgs.length} messages</span>
                </div>
                {/* Message bubbles — visitor messages align right with
                    primary color; bot replies align left with neutral bg */}
                <div className={styles.sessionMessages}>
                  {msgs.map((msg) => (
                    <div key={msg.id} className={msg.sender === 'user' ? styles.msgUser : styles.msgBot}>
                      <span className={styles.msgText}>{msg.text}</span>
                      {/* Timestamp — formatted to yyyy-MM-dd HH:mm for scanning */}
                      <span className={styles.msgTime}>{formatTime(msg.createdAt)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* --- Blog panel: delegated to AdminBlog, which handles its own
           data fetching and CRUD mutations via useAdminPosts --- */
        <AdminBlog token={token} />
      )}
    </div>
  );
};

export default Admin;