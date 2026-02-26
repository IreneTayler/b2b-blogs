import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api';
import { useAuth } from '../AuthContext';
import { useToast } from '../ToastContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) return;

    try {
      setSubmitting(true);
      setError(null);
      const { user, token } = await loginUser({
        email: email.trim(),
        password: password,
      });
      setUser(user, token);
      toast.success('Welcome back!');
      navigate('/');
    } catch (e) {
      setError('Login failed. Please check your email and password.');
      toast.error('Login failed. Please check your email and password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-page-glow" />
      <div className="auth-card">
        <div className="auth-card-header">
          <div className="auth-avatar-circle">
            <span className="auth-avatar-icon">✦</span>
          </div>
          <h2 className="auth-title">Sign in</h2>
          <p className="auth-subtitle">Welcome back. Sign in to continue.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <input
              id="email"
              className="auth-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
            />
          </div>

          <div className="auth-field">
            <input
              id="password"
              className="auth-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-button" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="auth-footer">
          <span>Don&apos;t have an account?</span>
          <Link to="/register" className="auth-footer-link">
            Register now
          </Link>
        </div>
      </div>
    </section>
  );
};
