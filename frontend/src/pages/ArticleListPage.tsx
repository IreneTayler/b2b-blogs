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
    return <p>Loading articles…</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (articles.length === 0) {
    return <p>No articles yet. Be the first to create one!</p>;
  }

  return (
    <section>
      <h2>Articles</h2>
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

