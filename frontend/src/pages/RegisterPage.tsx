import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api';
import { useAuth } from '../AuthContext';
import { useToast } from '../ToastContext';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const toast = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Please enter your email address.');
      toast.error('Please enter your email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      toast.error('Please enter a valid email address.');
      return;
    }

    if (!name.trim() || !password || !passwordConfirmation) {
      setError('Please fill in all fields.');
      toast.error('Please fill in all fields.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      toast.error('Password must be at least 8 characters.');
      return;
    }

    if (password !== passwordConfirmation) {
      setError('Passwords do not match.');
      toast.error('Passwords do not match.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const { user, token } = await registerUser({
        name: name.trim(),
        email: trimmedEmail,
        password,
        password_confirmation: passwordConfirmation,
      });
      setUser(user, token);
      toast.success('Account created! Welcome.');
      navigate('/articles');
    } catch (e) {
      setError('Registration failed. Please check your details and try again.');
      toast.error('Registration failed. Please check your details and try again.');
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
          <h2 className="auth-title">Create your account</h2>
          <p className="auth-subtitle">Join the blog community and start sharing your stories.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <input
              id="name"
              className="auth-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              required
            />
          </div>

          <div className="auth-field">
            <input
              id="email"
              className="auth-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <input
              id="password"
              className="auth-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (at least 8 characters)"
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>

          <div className="auth-field">
            <input
              id="passwordConfirmation"
              className="auth-input"
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder="Confirm password"
              required
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-button" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Sign up'}
          </button>
        </form>

        <div className="auth-footer">
          <span>Already have an account?</span>
          <Link to="/login" className="auth-footer-link">
            Sign in
          </Link>
        </div>
      </div>
    </section>
  );
};
