import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Mail, Phone, CheckCircle2, ArrowRight, RefreshCw, KeyRound } from 'lucide-react';
import { apiSendOtp, apiVerifyOtp } from '../../../services/api';
import './VerificationModal.css';

const VerificationModal = ({ isOpen, onClose, currentUser, onVerificationSuccess }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '+1 (555) 234-5678');
  const [emailOtp, setEmailOtp] = useState(['1', '2', '3', '4', '5', '6']);
  const [mobileOtp, setMobileOtp] = useState(['1', '2', '3', '4', '5', '6']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (currentUser) {
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '+1 (555) 234-5678');
    }
  }, [currentUser]);

  useEffect(() => {
    let interval = null;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  if (!isOpen) return null;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    await apiSendOtp(email, phone);
    setLoading(false);
    setStep(2);
    setTimer(30);
    setCanResend(false);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const eCode = emailOtp.join('');
    const mCode = mobileOtp.join('');

    const res = await apiVerifyOtp(email, eCode, mCode);
    setLoading(false);

    if (res.success) {
      if (onVerificationSuccess) onVerificationSuccess();
      onClose();
    } else {
      setErrorMsg(res.message || 'Verification failed. Please check your 6-digit codes.');
    }
  };

  const fillDemoCode = () => {
    setEmailOtp(['1', '2', '3', '4', '5', '6']);
    setMobileOtp(['1', '2', '3', '4', '5', '6']);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="verification-modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="verification-modal-header">
          <div className="ver-header-title">
            <div className="ver-shield-icon">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2>Email & Mobile Verification</h2>
              <p>Secure your account with 2-Step OTP Verification</p>
            </div>
          </div>
          <button className="ver-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {errorMsg && (
          <div className="ver-error-banner">
            {errorMsg}
          </div>
        )}

        {/* Step 1: Input Contact Info */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="ver-form">
            <div className="ver-info-box">
              <KeyRound size={18} className="ver-key-icon" />
              <span>We will send 6-digit security OTP codes to your Email and Mobile Phone Number.</span>
            </div>

            <div className="form-group">
              <label><Mail size={14} /> Email Address *</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@domain.com"
              />
            </div>

            <div className="form-group">
              <label><Phone size={14} /> Mobile Phone Number *</label>
              <input 
                type="tel" 
                required 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 234-5678"
              />
            </div>

            <div className="ver-actions">
              <button type="submit" className="btn-send-otp" disabled={loading}>
                {loading ? 'Sending Security Codes...' : 'Send Verification OTPs'} <ArrowRight size={16} />
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Enter 6-digit OTP codes */}
        {step === 2 && (
          <form onSubmit={handleVerify} className="ver-form">
            
            <div className="demo-helper-badge" onClick={fillDemoCode}>
              <span>Demo OTP Helper: Auto-fill `123456`</span>
            </div>

            <div className="otp-section">
              <label className="otp-label">
                <Mail size={14} /> Enter Email OTP (Sent to {email})
              </label>
              <div className="otp-inputs-row">
                {emailOtp.map((digit, idx) => (
                  <input
                    key={`email-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const newOtp = [...emailOtp];
                      newOtp[idx] = e.target.value;
                      setEmailOtp(newOtp);
                    }}
                    className="otp-box"
                  />
                ))}
              </div>
            </div>

            <div className="otp-section">
              <label className="otp-label">
                <Phone size={14} /> Enter Mobile SMS OTP (Sent to {phone})
              </label>
              <div className="otp-inputs-row">
                {mobileOtp.map((digit, idx) => (
                  <input
                    key={`mobile-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const newOtp = [...mobileOtp];
                      newOtp[idx] = e.target.value;
                      setMobileOtp(newOtp);
                    }}
                    className="otp-box"
                  />
                ))}
              </div>
            </div>

            <div className="resend-row">
              {canResend ? (
                <button type="button" className="btn-resend-link" onClick={handleSendOtp}>
                  <RefreshCw size={14} /> Resend New OTP Codes
                </button>
              ) : (
                <span className="resend-timer-text">Resend codes in {timer}s</span>
              )}
            </div>

            <div className="ver-actions">
              <button type="submit" className="btn-confirm-verify" disabled={loading}>
                <CheckCircle2 size={18} /> {loading ? 'Verifying...' : 'Verify Email & Mobile Phone'}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};

export default VerificationModal;
