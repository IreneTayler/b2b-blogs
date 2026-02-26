import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import { ArticleListPage } from './pages/ArticleListPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { NewArticlePage } from './pages/NewArticlePage';

export const App: React.FC = () => {
  return (
    <div className="app">
      <header className="app-header">
        <div className="container app-header-content">
          <h1 className="logo">
            <Link to="/">Simple Blog</Link>
          </h1>
          <nav className="nav">
            <Link to="/">Articles</Link>
            <Link to="/new">New Article</Link>
          </nav>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <Routes>
            <Route path="/" element={<ArticleListPage />} />
            <Route path="/articles/:id" element={<ArticleDetailPage />} />
            <Route path="/new" element={<NewArticlePage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

