'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Eye, EyeSlash, X } from '@phosphor-icons/react';
import { useAuthModalStore } from '@/store/useAuthModalStore';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/api';
import './AuthModal.css';

/* ── Google SVG Icon ── */
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" style={{ flexShrink: 0 }}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

/* ── Apple SVG Icon ── */
function AppleIcon({ mode }: { mode: string }) {
  return (
    <svg viewBox="0 0 384 512" width="18" height="18" style={{ flexShrink: 0, fill: mode === 'dark' ? '#D7DADC' : '#1A1A1B' }}>
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
  );
}

/* ── Password Strength Calculator ── */
function getPasswordStrength(password: string): number {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return Math.min(4, score);
}

/* ── Success Toast Component ── */
function SuccessToast({ message, onDone }: { message: string; onDone: () => void }) {
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHiding(true);
      setTimeout(onDone, 300);
    }, 2500);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className={`auth-toast ${hiding ? 'hiding' : ''}`}>
      {message}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   LOGIN VIEW
   ══════════════════════════════════════════════════════ */
function LoginView({ mode }: { mode: string }) {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const { close, switchView } = useAuthModalStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isDisabled = !email.trim() || !password.trim() || loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      const { accessToken, refreshToken, user } = res.data;
      setAuth(user, accessToken, refreshToken);
      close();
      router.push('/feed');
    } catch (err: any) {
      const msg =
        err.response?.data?.error ||
        'Invalid email or password. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/google/redirect`;
  };

  return (
    <div className="auth-modal-content" key="login">
      <h2 className="auth-modal-heading">Log In</h2>
      <p className={`auth-modal-subtext ${mode}-mode`}>
        Welcome back to Skadoosh.
      </p>

      <div className="auth-modal-gap" />

      {/* Google OAuth */}
      <button
        type="button"
        className={`auth-modal-oauth-btn ${mode}-mode`}
        onClick={handleGoogleLogin}
        id="login-google-btn"
      >
        <GoogleIcon />
        <span>Continue with Google</span>
      </button>

      {/* Apple OAuth */}
      <button
        type="button"
        className={`auth-modal-oauth-btn ${mode}-mode`}
        id="login-apple-btn"
      >
        <AppleIcon mode={mode} />
        <span>Continue with Apple</span>
      </button>

      {/* OR Divider */}
      <div className="auth-modal-divider">
        <div className={`auth-modal-divider-line ${mode}-mode`} />
        <span className={`auth-modal-divider-text ${mode}-mode`}>OR</span>
        <div className={`auth-modal-divider-line ${mode}-mode`} />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Email */}
        <div className="auth-modal-input-wrapper">
          <input
            id="login-email"
            type="text"
            placeholder="Email or username"
            autoComplete="email"
            className={`auth-modal-input ${mode}-mode`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="auth-modal-input-wrapper">
          <input
            id="login-password"
            type={showPw ? 'text' : 'password'}
            placeholder="Password"
            autoComplete="current-password"
            className={`auth-modal-input has-toggle ${mode}-mode`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className={`auth-modal-pw-toggle ${mode}-mode`}
            onClick={() => setShowPw(!showPw)}
            aria-label={showPw ? 'Hide password' : 'Show password'}
          >
            {showPw ? <EyeSlash size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Forgot Password */}
        <button type="button" className={`auth-modal-forgot ${mode}-mode`}>
          Forgot password?
        </button>

        {/* Error */}
        {error && <p className="auth-modal-error">{error}</p>}

        {/* CTA */}
        <button
          type="submit"
          className="auth-modal-cta"
          disabled={isDisabled}
          id="login-submit-btn"
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      {/* Switch to Signup */}
      <div className={`auth-modal-switch ${mode}-mode`}>
        New to Skadoosh?{' '}
        <button
          type="button"
          className="auth-modal-switch-link"
          onClick={() => switchView('signup')}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   SIGNUP VIEW
   ══════════════════════════════════════════════════════ */
function SignupView({ mode, onSuccess }: { mode: string; onSuccess: () => void }) {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const { close, switchView } = useAuthModalStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [confirmPwError, setConfirmPwError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordStrength = getPasswordStrength(password);

  const handleConfirmBlur = () => {
    if (confirmPw && confirmPw !== password) {
      setConfirmPwError('Passwords do not match');
    } else {
      setConfirmPwError('');
    }
  };

  const isFormValid =
    fullName.trim() &&
    email.trim() &&
    password.trim() &&
    confirmPw.trim() &&
    confirmPw === password &&
    !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmPw !== password) {
      setConfirmPwError('Passwords do not match');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/signup', {
        email,
        displayName: fullName,
        username: email.split('@')[0], // derive username from email
        password,
      });

      const { accessToken, refreshToken, user } = res.data;
      setAuth(user, accessToken, refreshToken);
      close();
      onSuccess();
      router.push('/feed');
    } catch (err: any) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.details?.[0]?.message ||
        'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/google/redirect`;
  };

  return (
    <div className="auth-modal-content" key="signup">
      <h2 className="auth-modal-heading">Sign Up</h2>
      <p className={`auth-modal-subtext ${mode}-mode`}>
        Join Skadoosh and start reporting scams in your community.
      </p>

      <div className="auth-modal-gap" />

      {/* Google OAuth */}
      <button
        type="button"
        className={`auth-modal-oauth-btn ${mode}-mode`}
        onClick={handleGoogleSignup}
        id="signup-google-btn"
      >
        <GoogleIcon />
        <span>Continue with Google</span>
      </button>

      {/* Apple OAuth */}
      <button
        type="button"
        className={`auth-modal-oauth-btn ${mode}-mode`}
        id="signup-apple-btn"
      >
        <AppleIcon mode={mode} />
        <span>Continue with Apple</span>
      </button>

      {/* OR Divider */}
      <div className="auth-modal-divider">
        <div className={`auth-modal-divider-line ${mode}-mode`} />
        <span className={`auth-modal-divider-text ${mode}-mode`}>OR</span>
        <div className={`auth-modal-divider-line ${mode}-mode`} />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Full Name */}
        <div className="auth-modal-input-wrapper">
          <input
            id="signup-fullname"
            type="text"
            placeholder="Full name"
            autoComplete="name"
            className={`auth-modal-input ${mode}-mode`}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        {/* Email */}
        <div className="auth-modal-input-wrapper">
          <input
            id="signup-email"
            type="email"
            placeholder="Email address"
            autoComplete="email"
            className={`auth-modal-input ${mode}-mode`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="auth-modal-input-wrapper">
          <input
            id="signup-password"
            type={showPw ? 'text' : 'password'}
            placeholder="Create a password"
            autoComplete="new-password"
            className={`auth-modal-input has-toggle ${mode}-mode`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className={`auth-modal-pw-toggle ${mode}-mode`}
            onClick={() => setShowPw(!showPw)}
            aria-label={showPw ? 'Hide password' : 'Show password'}
          >
            {showPw ? <EyeSlash size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Password Strength Bar */}
        {password.length > 0 && (
          <div className="auth-modal-strength-bar">
            {[1, 2, 3, 4].map((seg) => (
              <div
                key={seg}
                className={`auth-modal-strength-segment ${mode}-mode ${
                  seg <= passwordStrength ? `active strength-${passwordStrength}` : ''
                }`}
              />
            ))}
          </div>
        )}

        {/* Confirm Password */}
        <div className="auth-modal-input-wrapper">
          <input
            id="signup-confirm-password"
            type={showConfirmPw ? 'text' : 'password'}
            placeholder="Confirm password"
            autoComplete="new-password"
            className={`auth-modal-input has-toggle ${mode}-mode ${confirmPwError ? 'error' : ''}`}
            value={confirmPw}
            onChange={(e) => {
              setConfirmPw(e.target.value);
              if (confirmPwError) setConfirmPwError('');
            }}
            onBlur={handleConfirmBlur}
          />
          <button
            type="button"
            className={`auth-modal-pw-toggle ${mode}-mode`}
            onClick={() => setShowConfirmPw(!showConfirmPw)}
            aria-label={showConfirmPw ? 'Hide password' : 'Show password'}
          >
            {showConfirmPw ? <EyeSlash size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {confirmPwError && (
          <p className="auth-modal-field-error">{confirmPwError}</p>
        )}

        {/* Error */}
        {error && <p className="auth-modal-error">{error}</p>}

        {/* CTA */}
        <button
          type="submit"
          className="auth-modal-cta"
          disabled={!isFormValid}
          id="signup-submit-btn"
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      {/* Terms */}
      <p className={`auth-modal-terms ${mode}-mode`}>
        By continuing, you agree to our{' '}
        <a href="/about" className="auth-modal-terms-link">Terms</a>
        {' '}and{' '}
        <a href="/about" className="auth-modal-terms-link">Privacy Policy</a>.
      </p>

      {/* Switch to Login */}
      <div className={`auth-modal-switch ${mode}-mode`}>
        Already have an account?{' '}
        <button
          type="button"
          className="auth-modal-switch-link"
          onClick={() => switchView('login')}
        >
          Log In
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   AUTH MODAL (Main Export)
   ══════════════════════════════════════════════════════ */
export function AuthModal() {
  const { isOpen, view, close } = useAuthModalStore();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, close]);

  const handleSignupSuccess = useCallback(() => {
    setShowToast(true);
  }, []);

  if (!mounted || !isOpen) return showToast ? (
    <SuccessToast message="Welcome to Skadoosh! 🎉" onDone={() => setShowToast(false)} />
  ) : null;

  const mode = resolvedTheme === 'dark' ? 'dark' : 'light';

  return (
    <>
      {/* Backdrop */}
      <div
        className={`auth-modal-backdrop ${mode}-mode`}
        onClick={close}
        id="auth-modal-backdrop"
      >
        {/* Card — stop propagation so clicking card doesn't close */}
        <div
          className={`auth-modal-card ${mode}-mode`}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label={view === 'login' ? 'Log In' : 'Sign Up'}
          id="auth-modal-card"
        >
          {/* Close Button */}
          <button
            type="button"
            className={`auth-modal-close ${mode}-mode`}
            onClick={close}
            aria-label="Close"
            id="auth-modal-close-btn"
          >
            <X size={20} weight="bold" />
          </button>

          {/* Content */}
          {view === 'login' ? (
            <LoginView mode={mode} />
          ) : (
            <SignupView mode={mode} onSuccess={handleSignupSuccess} />
          )}
        </div>
      </div>

      {/* Success Toast (after signup) */}
      {showToast && (
        <SuccessToast message="Welcome to Skadoosh! 🎉" onDone={() => setShowToast(false)} />
      )}
    </>
  );
}
