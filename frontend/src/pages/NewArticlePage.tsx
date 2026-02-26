import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createArticle } from '../api';
import type { Article } from '../api';

export const NewArticlePage: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      setSubmitting(true);
      const article: Article = await createArticle({
        title: title.trim(),
        content: content.trim(),
      });
      navigate(`/articles/${article.id}`);
    } catch (e) {
      alert('Failed to create article. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section>
      <h2>New Article</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Article title"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your article content here…"
            required
          />
        </div>
        <button type="submit" className="button" disabled={submitting}>
          {submitting ? 'Saving…' : 'Publish Article'}
        </button>
      </form>
    </section>
  );
};

