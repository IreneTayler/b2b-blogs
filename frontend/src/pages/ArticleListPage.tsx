import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchArticles } from '../api';
import type { Article } from '../api';

export const ArticleListPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchArticles();
        setArticles(data);
      } catch (e) {
        setError('Failed to load articles.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const formatDate = (value: string) => {
    const date = new Date(value);
    return date.toLocaleDateString();
  };

  const summarize = (content: string) => {
    if (content.length <= 160) return content;
    return content.slice(0, 160) + '…';
  };

  if (loading) {
    return (
      <section className="page">
        <div className="state-message loading">
          <div className="spinner" />
          <span>Loading articles…</span>
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

  if (articles.length === 0) {
    return (
      <section className="page">
        <div className="page-header">
          <h2>Articles</h2>
          <p className="page-sub">Stories and updates.</p>
        </div>
        <div className="state-message empty">No articles yet. Be the first to create one!</div>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="page-header">
        <h2>Articles</h2>
        <p className="page-sub">Stories and updates.</p>
      </div>
      <div className="card-list">
        {articles.map((article) => (
          <article key={article.id} className="card">
            <header className="card-header">
              <h3>
                <Link to={`/articles/${article.id}`}>{article.title}</Link>
              </h3>
              <span className="muted">{formatDate(article.created_at)}</span>
            </header>
            <p className="card-body">{summarize(article.content)}</p>
            <footer className="card-footer">
              <Link to={`/articles/${article.id}`} className="button-link">
                Read more
              </Link>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
};

