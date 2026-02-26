import React from 'react';
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { ArticleListPage } from './pages/ArticleListPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { NewArticlePage } from './pages/NewArticlePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { useAuth } from './AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

const HomeRedirect: React.FC = () => {
  const { user } = useAuth();
  return <Navigate to={user ? '/articles' : '/login'} replace />;
};

export const App: React.FC = () => {
  const { user, logout, loggingOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="container app-header-content">
          <h1 className="logo">
            <Link to="/">Simple Blog</Link>
          </h1>
          <nav className="nav">
            {user ? (
              <>
                <Link to="/articles">Articles</Link>
                <Link to="/new">New Article</Link>
                <button
                  type="button"
                  className="nav-logout-button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                >
                  {loggingOut ? 'Logging out…' : 'Logout'}
                </button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <Routes>
            <Route path="/" element={<HomeRedirect />} />
            <Route
              path="/articles"
              element={
                <ProtectedRoute>
                  <ArticleListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/articles/:id"
              element={
                <ProtectedRoute>
                  <ArticleDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/new"
              element={
                <ProtectedRoute>
                  <NewArticlePage />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};
