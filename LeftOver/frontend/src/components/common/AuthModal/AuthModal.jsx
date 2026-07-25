import React, { useState } from 'react';
import {
  X, LogIn, UserPlus, Mail, Lock, User,
  Store, CheckCircle2, ShieldCheck, ArrowRight, RefreshCw
} from 'lucide-react';
import { apiLogin, apiRegister, apiSendOtp, apiVerifyOtp } from '../../../services/api';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [signUpStep, setSignUpStep] = useState(1);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [screenOtp, setScreenOtp] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    const res = await apiLogin(email, password);
    setLoading(false);
    if (res.success && res.data) {
      onAuthSuccess(res.data);
      onClose();
    } else {
      setErrorMsg(res.message || 'Invalid email or password.');
    }
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    const res = await apiSendOtp(email);
    setLoading(false);

    if (res.success) {
      setEmailSent(res.emailSent);
      if (res.otp) {
        setScreenOtp(res.otp);
        setOtp(res.otp.split(''));
      }
      setSignUpStep(2);
    } else {
      setErrorMsg(res.message || 'Failed to send OTP. Try again.');
    }
  };

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const code = otp.join('');
    const verRes = await apiVerifyOtp(email, code);

    if (!verRes.success) {
      setLoading(false);
      setErrorMsg(verRes.message || 'Incorrect code. Please try again.');
      return;
    }

    const regRes = await apiRegister(name, email, password, role);
    setLoading(false);

    if (regRes.success && regRes.data) {
      onAuthSuccess({ ...regRes.data, isEmailVerified: true });
      onClose();
    } else {
      setErrorMsg(regRes.message || 'Registration failed. This email may already be registered.');
    }
  };

  const handleOtpChange = (idx, val) => {
    const next = [...otp];
    next[idx] = val.slice(-1);
    setOtp(next);
    if (val && idx < 5) {
      document.getElementById(`otp-box-${idx + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      document.getElementById(`otp-box-${idx - 1}`)?.focus();
    }
  };

  const switchToLogin = () => {
    setIsSignUp(false);
    setSignUpStep(1);
    setErrorMsg('');
    setOtp(['', '', '', '', '', '']);
    setScreenOtp('');
  };

  const switchToSignUp = () => {
    setIsSignUp(true);
    setSignUpStep(1);
    setErrorMsg('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>

        <button className="auth-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="auth-modal-header">
          <h2>
            {isSignUp
              ? (signUpStep === 1 ? 'Create an account' : 'Verify your email')
              : 'Sign in'}
          </h2>
          <p>
            {isSignUp
              ? (signUpStep === 1
                  ? 'Fill in your details to get started.'
                  : `Enter the 6-digit code sent to ${email}`)
              : 'Enter your email and password to continue.'}
          </p>
        </div>

        {errorMsg && <div className="auth-error-banner">{errorMsg}</div>}

        {signUpStep === 1 && (
          <div className="auth-tabs">
            <button className={`auth-tab-btn ${!isSignUp ? 'active' : ''}`} onClick={switchToLogin}>
              <LogIn size={15} /> Sign In
            </button>
            <button className={`auth-tab-btn ${isSignUp ? 'active' : ''}`} onClick={switchToSignUp}>
              <UserPlus size={15} /> Create Account
            </button>
          </div>
        )}

        {/* Sign In */}
        {!isSignUp && (
          <form onSubmit={handleLoginSubmit} className="auth-form">
            <div className="form-group">
              <label><Mail size={14} /> Email</label>
              <input type="email" required placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label><Lock size={14} /> Password</label>
              <input type="password" required placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="btn-auth-submit" disabled={loading}>
              <LogIn size={16} /> {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        )}

        {/* Sign Up Step 1 */}
        {isSignUp && signUpStep === 1 && (
          <form onSubmit={handleRequestOtp} className="auth-form">
            <div className="form-group">
              <label><User size={14} /> Full Name</label>
              <input type="text" required placeholder="e.g. Rahul Sharma" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="form-group">
              <label><Mail size={14} /> Email</label>
              <input type="email" required placeholder="rahul@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label><Lock size={14} /> Password</label>
              <input type="password" required minLength={6} placeholder="At least 6 characters" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <div className="form-group">
              <label><Store size={14} /> I am a</label>
              <div className="role-selector-row">
                <button type="button" className={`role-option-btn ${role === 'user' ? 'active' : ''}`} onClick={() => setRole('user')}>
                  <User size={16} /> Food Rescuer
                </button>
                <button type="button" className={`role-option-btn ${role === 'donor' ? 'active' : ''}`} onClick={() => setRole('donor')}>
                  <Store size={16} /> Food Donor
                </button>
              </div>
            </div>
            <button type="submit" className="btn-auth-submit" disabled={loading}>
              {loading ? 'Sending code...' : 'Send Verification Code'} <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* Sign Up Step 2 — Email OTP only */}
        {isSignUp && signUpStep === 2 && (
          <form onSubmit={handleVerifyAndRegister} className="auth-form">

            {/* Show OTP on screen if email delivery failed */}
            {screenOtp && (
              <div className={`otp-info-banner ${emailSent ? 'success' : 'fallback'}`}>
                <ShieldCheck size={16} />
                <div>
                  {emailSent
                    ? <strong>Code sent to {email} — check your inbox</strong>
                    : <><strong>Email delivery failed.</strong> Use this code:</>
                  }
                  {!emailSent && (
                    <p className="otp-screen-code">{screenOtp}</p>
                  )}
                </div>
              </div>
            )}

            <div className="otp-section">
              <label className="otp-label">
                <Mail size={14} /> Enter the 6-digit code from your email
              </label>
              <div className="otp-inputs-row">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-box-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(idx, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(idx, e)}
                    className="otp-box"
                    autoFocus={idx === 0}
                  />
                ))}
              </div>
            </div>

            <div className="otp-actions-row">
              <button type="button" className="btn-back-step" onClick={() => { setSignUpStep(1); setErrorMsg(''); setOtp(['','','','','','']); setScreenOtp(''); }}>
                Back
              </button>
              <button type="submit" className="btn-auth-submit flex-1" disabled={loading}>
                <CheckCircle2 size={16} /> {loading ? 'Verifying...' : 'Verify & Create Account'}
              </button>
            </div>

            <button
              type="button"
              className="btn-resend-otp"
              onClick={handleRequestOtp}
              disabled={loading}
            >
              <RefreshCw size={13} /> Resend code
            </button>

          </form>
        )}

      </div>
    </div>
  );
};

export default AuthModal;
