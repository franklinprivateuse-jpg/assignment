import { useState, type FormEvent } from 'react';
import { useAdminPosts, type PostFormData } from '../../hooks/useAdminPosts';
import type { BlogPost } from '../blog/types';
import styles from './AdminBlog.module.css';

/** Empty form values — used when creating a new post */
const EMPTY_FORM: PostFormData = { date: '', title: '', excerpt: '', content: '' };

/**
 * Admin blog management panel — CRUD interface for blog articles.
 *
 * Rendered inside the Admin page when the "Blog Posts" tab is active.
 * The token prop comes from the Admin page (already authenticated),
 * so this component never shows a login form.
 *
 * Data flow:
 *   useAdminPosts hook → GET /api/v1/posts (list)
 *                      → POST /api/v1/posts (create)
 *                      → PUT /api/v1/posts/{id} (update)
 *                      → DELETE /api/v1/posts/{id} (delete)
 *   Every request carries X-Admin-Token; the hook auto-refreshes the
 *   list after each successful mutation.
 *
 * UI modes:
 *   - List mode (default): post rows with Edit / Delete buttons
 *   - Form mode: create or edit form replaces the list while open;
 *     Cancel or a successful save returns to list mode
 */
const AdminBlog: React.FC<{ token: string }> = ({ token }) => {
  // posts: current list from the API (auto-refreshed after mutations)
  // createPost/updatePost/deletePost: mutation functions returning
  //   Promise<boolean> (true = success, list will auto-refresh)
  const { posts, loading, error, createPost, updatePost, deletePost } = useAdminPosts(token);

  // editingPost: which post is being edited, or null when creating a
  // new one. Drives the form title, button label, and submit behavior.
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  // showForm: toggles between list mode (false) and form mode (true)
  const [showForm, setShowForm] = useState(false);
  // form: controlled form fields — date, title, excerpt, content
  const [form, setForm] = useState<PostFormData>(EMPTY_FORM);
  // submitting: disables the save button while a mutation is in flight
  // to prevent double-submits
  const [submitting, setSubmitting] = useState(false);

  /** Open the form for creating a new post — resets to empty fields */
  const handleNew = () => {
    setEditingPost(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  /** Open the form pre-filled with an existing post for editing.
   *  content uses ?? '' because the list API omits the content field;
   *  the edit form needs it so the owner can modify the article body. */
  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setForm({
      date: post.date,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content ?? '',
    });
    setShowForm(true);
  };

  /** Close the form and reset all form state back to defaults */
  const handleCancel = () => {
    setShowForm(false);
    setEditingPost(null);
    setForm(EMPTY_FORM);
  };

  /** Submit the form: routes to update or create depending on the mode.
   *  On success the form closes; on failure it stays open so the owner
   *  can retry without retyping. submitting guards against double-clicks. */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const success = editingPost
        ? await updatePost(editingPost.id, form)
        : await createPost(form);
      if (success) handleCancel();
    } finally {
      setSubmitting(false);
    }
  };

  /** Delete a post after a native confirmation dialog.
   *  The dialog shows the post title so the owner knows exactly which
   *  article will be removed — deletion is irreversible. */
  const handleDelete = async (post: BlogPost) => {
    if (!window.confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    await deletePost(post.id);
  };

  return (
    <div>
      {/* Toolbar: post count on the left, "New Post" button on the right.
          The button hides while the form is open to avoid stacking modes. */}
      <div className={styles.toolbar}>
        <span className={styles.count}>
          {posts.length} post{posts.length === 1 ? '' : 's'}
        </span>
        {!showForm && (
          <button type="button" className={styles.newButton} onClick={handleNew}>
            + New Post
          </button>
        )}
      </div>

      {/* Error banner — shown when a load or mutation failed */}
      {error && <div className={styles.errorText}>{error}</div>}
      {/* Loading placeholder — shown while the list is being fetched */}
      {loading && <p className={styles.statusMessage}>Loading posts...</p>}

      {/* Create / edit form — shown in form mode; replaces the list
          so the owner focuses on one task at a time */}
      {showForm && (
        <form className={styles.postForm} onSubmit={handleSubmit}>
          {/* Dynamic title: "Edit Post #N" or "New Post" depending on mode */}
          <h3 className={styles.formTitle}>
            {editingPost ? `Edit Post #${editingPost.id}` : 'New Post'}
          </h3>
          {/* Date — pattern matches the backend @Pattern(yyyy-MM-dd);
              HTML5 validation catches typos before the request is sent */}
          <label className={styles.fieldLabel}>
            Date (yyyy-MM-dd)
            <input
              type="text"
              className={styles.fieldInput}
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              placeholder="2026-11-11"
              required
              pattern="\d{4}-\d{2}-\d{2}"
            />
          </label>
          {/* Title — maxLength mirrors the backend @Size(max = 200) */}
          <label className={styles.fieldLabel}>
            Title
            <input
              type="text"
              className={styles.fieldInput}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Post title"
              required
              maxLength={200}
            />
          </label>
          {/* Excerpt — optional short summary; maxLength mirrors the
              backend @Size(max = 500) constraint */}
          <label className={styles.fieldLabel}>
            Excerpt
            <input
              type="text"
              className={styles.fieldInput}
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              placeholder="Short summary (optional)"
              maxLength={500}
            />
          </label>
          {/* Content — full article in Markdown; monospace font helps
              with formatting; required mirrors backend @NotBlank */}
          <label className={styles.fieldLabel}>
            Content (Markdown)
            <textarea
              className={styles.fieldTextarea}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Full article content in Markdown"
              required
              rows={10}
            />
          </label>
          {/* Action buttons: submit is disabled while a mutation is in
              flight; label switches between Create and Update by mode */}
          <div className={styles.formActions}>
            <button type="submit" className={styles.saveButton} disabled={submitting}>
              {submitting ? 'Saving...' : editingPost ? 'Update' : 'Create'}
            </button>
            <button type="button" className={styles.cancelButton} onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Post list — shown in list mode (not loading, form closed).
          Each row shows the date and title with Edit / Delete buttons. */}
      {!loading && !showForm && (
        <div className={styles.postList}>
          {/* Empty state — no posts in the database yet */}
          {posts.length === 0 && !error && (
            <p className={styles.statusMessage}>No posts yet. Click "New Post" to create one.</p>
          )}
          {/* Rows are ordered newest-first (API returns id DESC).
              Title truncates with ellipsis if too long for the row. */}
          {posts.map((post) => (
            <div key={post.id} className={styles.postRow}>
              <div className={styles.postInfo}>
                {/* Date in raw yyyy-MM-dd — admins prefer the sortable
                    format over the readable one used on the public Blog */}
                <span className={styles.postDate}>{post.date}</span>
                <span className={styles.postTitle}>{post.title}</span>
              </div>
              <div className={styles.postActions}>
                {/* Edit opens the form pre-filled with this post's data */}
                <button
                  type="button"
                  className={styles.editButton}
                  onClick={() => handleEdit(post)}
                >
                  Edit
                </button>
                {/* Delete asks for confirmation first (see handleDelete) */}
                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={() => handleDelete(post)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBlog;