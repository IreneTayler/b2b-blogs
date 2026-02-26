import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Article, Comment } from '../api';
import { createComment, fetchArticle } from '../api';
import { useAuth } from '../AuthContext';
import { useToast } from '../ToastContext';

export const ArticleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const toast = useToast();
  const [article, setArticle] = useState<(Article & { comments: Comment[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const data = await fetchArticle(id);
        setArticle(data);
      } catch (e) {
        setError('Failed to load article.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const formatDateTime = (value: string) => {
    const date = new Date(value);
    return date.toLocaleString();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!id || !commentContent.trim()) return;

    try {
      setSubmitting(true);
      const newComment = await createComment(id, { content: commentContent.trim() });
      setArticle((current) =>
        current ? { ...current, comments: [...current.comments, newComment] } : current,
      );
      setCommentContent('');
      toast.success('Comment added!');
    } catch (e) {
      toast.error("Couldn't add comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const isOwnArticle = Boolean(user && article && article.user_id != null && user.id === article.user_id);

  if (loading) {
    return (
      <section className="page">
        <div className="state-message loading">
          <div className="spinner" />
          <span>Loading article…</span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page">
        <div className="state-message error">{error}</div>
      </section>
    );
  }

  if (!article) {
    return (
      <section className="page">
        <div className="state-message">Article not found.</div>
      </section>
    );
  }

  return (
    <section className="page article-detail">
      <article className="card">
        <header className="card-header">
          <h2>{article.title}</h2>
          <span className="muted">{formatDateTime(article.created_at)}</span>
        </header>
        <div className="card-body article-content">
          {article.content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </article>

      <section className="comments">
        <h3>Comments ({article.comments.length})</h3>
        {article.comments.length === 0 ? (
          <p className="muted">No comments yet. Be the first to comment.</p>
        ) : (
          <ul className="comment-list">
            {article.comments.map((comment) => (
              <li key={comment.id} className="comment">
                <div className="comment-header">
                  <span className="comment-author">{comment.author_name}</span>
                  <span className="muted small">{formatDateTime(comment.created_at)}</span>
                </div>
                <p className="comment-content">{comment.content}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="comment-form-section">
        <h3>Add a comment</h3>
        {!user ? (
          <p className="muted">Please <Link to="/login">sign in</Link> to comment.</p>
        ) : isOwnArticle ? (
          <p className="muted">You cannot comment on your own article.</p>
        ) : (
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="comment">Comment</label>
              <textarea
                id="comment"
                rows={4}
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Write your comment here…"
                required
              />
            </div>
            <button type="submit" className="button" disabled={submitting}>
              {submitting ? 'Posting…' : 'Post Comment'}
            </button>
          </form>
        )}
      </section>
    </section>
  );
};

