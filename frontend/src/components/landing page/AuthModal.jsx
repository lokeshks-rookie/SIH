import React, { useState, useEffect, useCallback } from 'react';
import './AuthModal.css';

/* ── Phosphor Icons (Inline SVG to avoid dependency) ── */
const Eye = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256">
    <path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.48c.35.79,8.82,19.58,27.65,38.41C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.35c18.83-18.83,27.3-37.62,27.65-38.41A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path>
  </svg>
);

const EyeSlash = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256">
    <path d="M53.92,34.62A8,8,0,1,0,42.08,45.38l38.2,42.44A133.72,133.72,0,0,0,25,121.52a8,8,0,0,0,0,6.48c.35.79,8.82,19.58,27.65,38.41C74.93,188.75,100.32,200,128,200a125.79,125.79,0,0,0,45.39-8.23l38.69,43a8,8,0,1,0,11.92-10.76Zm43,47.79,23.33,25.92a32,32,0,0,0-15.54,17.27L81.27,99.64A48.1,48.1,0,0,1,96.93,82.41ZM128,184c-24.87,0-46.74-8.86-65.05-26.29A118.89,118.89,0,0,1,41.42,128a118,118,0,0,1,19.78-26.65l22,24.47a48,48,0,0,0,67.33,74.81l21,23.36A112.59,112.59,0,0,1,128,184Zm119.31-62.48c-.35-.79-8.82-19.58-27.65-38.41C197.39,61.85,164.21,48,128,48a127,127,0,0,0-51,10.63,8,8,0,1,0,6.29,14.71A111.13,111.13,0,0,1,128,64c29.47,0,55.45,10.74,77.23,31.94A118.3,118.3,0,0,1,227,124.62a8,8,0,0,1-3.69,11.66,8.23,8.23,0,0,1-3.61.85,8,8,0,0,1-7.14-4.5,102.82,102.82,0,0,0-19.11-23.75l-19,21.1a47.88,47.88,0,0,1,1.52,18,8,8,0,1,1-15.75-2.73,31.81,31.81,0,0,0-1.89-13.62l-23.23,25.8a8,8,0,1,1-11.92-10.76l22.45-24.94a32.18,32.18,0,0,0,18.42-20.47l23.51-26.11A134.19,134.19,0,0,1,250,124.76,8,8,0,0,0,247.31,121.52Z"></path>
  </svg>
);

const X = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
    <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
  </svg>
);

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

/* ── Password Strength Calculator ── */
function getPasswordStrength(password) {
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
function SuccessToast({ message, onDone }) {
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
function LoginView({ switchView, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isDisabled = !email.trim() || !password.trim() || loading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Mock login delay
    setTimeout(() => {
      setLoading(false);
      onClose();
      // In real app, redirect or update auth state here
    }, 1000);
  };

  return (
    <div className="auth-modal-content" key="login">
      <h2 className="auth-modal-heading">Log In</h2>
      <p className="auth-modal-subtext">
        Welcome back to Quantum Learning.
      </p>

      <div className="auth-modal-gap" />

      {/* Google OAuth */}
      <button 
        type="button" 
        className="auth-modal-oauth-btn" 
        id="login-google-btn"
        onClick={() => { window.location.href = '/dashboard'; }}
      >
        <GoogleIcon />
        <span>Continue with Google</span>
      </button>

      {/* OR Divider */}
      <div className="auth-modal-divider">
        <div className="auth-modal-divider-line" />
        <span className="auth-modal-divider-text">OR</span>
        <div className="auth-modal-divider-line" />
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
            className="auth-modal-input"
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
            className="auth-modal-input has-toggle"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="auth-modal-pw-toggle"
            onClick={() => setShowPw(!showPw)}
            aria-label={showPw ? 'Hide password' : 'Show password'}
          >
            {showPw ? <EyeSlash /> : <Eye />}
          </button>
        </div>

        {/* Forgot Password */}
        <button type="button" className="auth-modal-forgot">
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
      <div className="auth-modal-switch">
        New to Quantum Learning?{' '}
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
function SignupView({ switchView, onSuccess }) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (confirmPw !== password) {
      setConfirmPwError('Passwords do not match');
      return;
    }
    setError('');
    setLoading(true);

    // Mock signup delay
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 1000);
  };

  return (
    <div className="auth-modal-content" key="signup">
      <h2 className="auth-modal-heading">Sign Up</h2>
      <p className="auth-modal-subtext">
        Join our quantum learning platform.
      </p>

      <div className="auth-modal-gap" />

      {/* Google OAuth */}
      <button 
        type="button" 
        className="auth-modal-oauth-btn" 
        id="signup-google-btn"
        onClick={() => { window.location.href = '/dashboard'; }}
      >
        <GoogleIcon />
        <span>Continue with Google</span>
      </button>

      {/* OR Divider */}
      <div className="auth-modal-divider">
        <div className="auth-modal-divider-line" />
        <span className="auth-modal-divider-text">OR</span>
        <div className="auth-modal-divider-line" />
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
            className="auth-modal-input"
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
            className="auth-modal-input"
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
            className="auth-modal-input has-toggle"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="auth-modal-pw-toggle"
            onClick={() => setShowPw(!showPw)}
            aria-label={showPw ? 'Hide password' : 'Show password'}
          >
            {showPw ? <EyeSlash /> : <Eye />}
          </button>
        </div>

        {/* Password Strength Bar */}
        {password.length > 0 && (
          <div className="auth-modal-strength-bar">
            {[1, 2, 3, 4].map((seg) => (
              <div
                key={seg}
                className={`auth-modal-strength-segment ${
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
            className={`auth-modal-input has-toggle ${confirmPwError ? 'error' : ''}`}
            value={confirmPw}
            onChange={(e) => {
              setConfirmPw(e.target.value);
              if (confirmPwError) setConfirmPwError('');
            }}
            onBlur={handleConfirmBlur}
          />
          <button
            type="button"
            className="auth-modal-pw-toggle"
            onClick={() => setShowConfirmPw(!showConfirmPw)}
            aria-label={showConfirmPw ? 'Hide password' : 'Show password'}
          >
            {showConfirmPw ? <EyeSlash /> : <Eye />}
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
      <p className="auth-modal-terms">
        By continuing, you agree to our{' '}
        <a href="/about" className="auth-modal-terms-link">Terms</a>
        {' '}and{' '}
        <a href="/about" className="auth-modal-terms-link">Privacy Policy</a>.
      </p>

      {/* Switch to Login */}
      <div className="auth-modal-switch">
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
export default function AuthModal({ isOpen, onClose, initialView = 'login' }) {
  const [view, setView] = useState(initialView);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setView(initialView);
    }
  }, [isOpen, initialView]);

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
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const handleSignupSuccess = useCallback(() => {
    onClose();
    setShowToast(true);
  }, [onClose]);

  if (!isOpen && !showToast) return null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="auth-modal-backdrop"
          onClick={onClose}
          id="auth-modal-backdrop"
        >
          {/* Card — stop propagation so clicking card doesn't close */}
          <div
            className="auth-modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={view === 'login' ? 'Log In' : 'Sign Up'}
            id="auth-modal-card"
          >
            {/* Close Button */}
            <button
              type="button"
              className="auth-modal-close"
              onClick={onClose}
              aria-label="Close"
              id="auth-modal-close-btn"
            >
              <X />
            </button>

            {/* Content */}
            {view === 'login' ? (
              <LoginView switchView={setView} onClose={onClose} />
            ) : (
              <SignupView switchView={setView} onSuccess={handleSignupSuccess} />
            )}
          </div>
        </div>
      )}

      {/* Success Toast (after signup) */}
      {showToast && (
        <SuccessToast message="Welcome to Quantum Learning! 🎉" onDone={() => setShowToast(false)} />
      )}
    </>
  );
}
