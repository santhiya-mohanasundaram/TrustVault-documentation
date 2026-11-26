import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import {
  FaShieldAlt,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSignInAlt,
  FaUserCog,
  FaUser,
  FaCheckCircle
} from 'react-icons/fa';
import { useApp } from '../../context/AppContext';

const LoginPage = () => {
  const { login, showToast } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(() => location.state?.registeredEmail || '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('User'); // Dropdown "Login As": initially displays "User"
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast('Please enter your email address', 'warning');
      return;
    }

    const res = login(email, password, role);
    if (!res || !res.success) {
      return; // Do not navigate if credentials invalid
    }

    // Navigate to completely separate dashboards based on role
    if (role === 'Admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/user/dashboard');
    }
  };

  const handleQuickLoginAs = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'Admin') {
      setEmail('admin@trustvault.io');
      setPassword('admin1234');
      const res = login('admin@trustvault.io', 'admin1234', 'Admin');
      if (res && res.success) navigate('/admin/dashboard');
    } else {
      setEmail('sathish@trustvault.io');
      setPassword('demo1234');
      const res = login('sathish@trustvault.io', 'demo1234', 'User');
      if (res && res.success) navigate('/user/dashboard');
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      showToast('Please enter your email', 'warning');
      return;
    }
    setForgotSent(true);
    showToast(`Password recovery link sent to ${forgotEmail}`, 'success');
    setTimeout(() => {
      setShowForgotModal(false);
      setForgotSent(false);
      setForgotEmail('');
    }, 2500);
  };

  return (
    <div className="min-vh-100 d-flex flex-column bg-white">
      <Navbar />

      <div
        className="flex-grow-1 py-5 d-flex align-items-center"
        style={{
          background: 'linear-gradient(180deg, #f0fdf9 0%, #f8fafc 100%)'
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-5 col-md-7">
              <div className="tv-card p-4 p-md-5 bg-white shadow-lg border">
                {/* Brand header */}
                <div className="text-center mb-4">
                  <div
                    className="d-inline-flex align-items-center justify-content-center text-white rounded-3 mb-2 shadow-sm"
                    style={{
                      width: 48,
                      height: 48,
                      background: 'linear-gradient(135deg, #0f766e 0%, #10b981 100%)'
                    }}
                  >
                    <FaShieldAlt size={24} />
                  </div>
                  <h3 className="fw-bold text-dark mb-1">Welcome to TrustVault</h3>
                  <p className="text-muted small">
                    Sign in to access your secure document repository.
                  </p>
                </div>

                {/* Role Switcher Pills */}
                <div className="bg-light p-2 rounded-3 mb-4 border d-flex gap-2">
                  <button
                    type="button"
                    className={`btn btn-sm flex-grow-1 ${role === 'User' ? 'btn-teal text-white' : 'btn-light text-secondary'}`}
                    onClick={() => {
                      setRole('User');
                      if (email === 'admin@trustvault.io') {
                        setEmail('');
                        setPassword('');
                      }
                    }}
                  >
                    <FaUser className="me-1" /> User Account
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm flex-grow-1 ${role === 'Admin' ? 'btn-dark text-white' : 'btn-light text-secondary'}`}
                    onClick={() => {
                      setRole('Admin');
                      setEmail('admin@trustvault.io');
                      setPassword('admin1234');
                    }}
                  >
                    <FaUserCog className="me-1" /> Admin Console
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                  {/* Role Selection Dropdown: REQUIRED SPECIFICATION */}
                  <div className="mb-3">
                    <label className="form-label fw-bold small text-muted">
                      LOGIN AS <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light text-teal border-end-0">
                        {role === 'Admin' ? <FaUserCog /> : <FaUser />}
                      </span>
                      <select
                        name="loginAs"
                        aria-label="Login As"
                        className="form-select border-start-0 fw-semibold"
                        value={role}
                        onChange={(e) => {
                          const newRole = e.target.value;
                          setRole(newRole);
                          if (newRole === 'Admin') {
                            setEmail('admin@trustvault.io');
                            setPassword('admin1234');
                          } else if (email === 'admin@trustvault.io') {
                            setEmail('');
                            setPassword('');
                          }
                        }}
                      >
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </div>
                    <small className="text-muted" style={{ fontSize: '0.72rem' }}>
                      Select <strong>User</strong> for personal vault or <strong>Admin</strong> for system governance.
                    </small>
                  </div>

                  {/* Email Field */}
                  <div className="mb-3">
                    <label className="form-label fw-bold small text-muted">EMAIL ADDRESS *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light text-muted border-end-0">
                        <FaEnvelope />
                      </span>
                      <input
                        type="email"
                        className="form-control border-start-0"
                        placeholder="e.g. name@example.com" autoCapitalize="none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="mb-3">
                    <label className="form-label fw-bold small text-muted">PASSWORD *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light text-muted border-end-0">
                        <FaLock />
                      </span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control border-start-0 border-end-0"
                        placeholder="Enter your password" aria-label="Account Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="input-group-text bg-light border-start-0 text-muted"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label="Toggle password"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="rememberMeCheck"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <label className="form-check-label small text-muted" htmlFor="rememberMeCheck">
                        Remember Me
                      </label>
                    </div>
                    <button
                      type="button"
                      className="btn btn-link p-0 small text-teal text-decoration-none fw-semibold"
                      onClick={() => setShowForgotModal(true)}
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {/* Login Button */}
                  <button
                    type="submit"
                    className={`btn w-100 py-2 fs-6 shadow-sm mb-3 ${role === 'Admin' ? 'btn-dark' : 'btn-emerald'}`}
                  >
                    <FaSignInAlt className="me-2" /> Login as {role}
                  </button>

                  {/* 1-Click Fast Demo Login buttons */}
                  <div className="pt-2 pb-1 text-center">
                    <span className="text-muted small d-block mb-2">Instant Demo Entry:</span>
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleQuickLoginAs('User')}
                        className="btn btn-outline-teal btn-sm flex-grow-1"
                      >
                        User Dashboard &rarr;
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickLoginAs('Admin')}
                        className="btn btn-outline-dark btn-sm flex-grow-1"
                      >
                        Admin Dashboard &rarr;
                      </button>
                    </div>
                  </div>

                  {/* Register Link */}
                  <div className="text-center pt-4 border-top mt-4">
                    <span className="text-muted small">Don't have an account? </span>
                    <Link to="/register" className="text-teal fw-bold text-decoration-none small">
                      Register Here
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(3px)', zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-bottom px-4 py-3">
                <h6 className="modal-title fw-bold text-dark mb-0">Reset Password</h6>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowForgotModal(false)}
                ></button>
              </div>
              <div className="modal-body p-4">
                {forgotSent ? (
                  <div className="text-center py-3">
                    <FaCheckCircle className="text-emerald fs-1 mb-2" />
                    <h6 className="fw-bold text-dark">Link Dispatched</h6>
                    <p className="text-muted small mb-0">
                      We sent a reset demo link to <strong>{forgotEmail}</strong>.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleForgotPassword}>
                    <p className="text-muted small mb-3">
                      Enter your account email to receive demo password reset instructions.
                    </p>
                    <div className="mb-3">
                      <input
                        type="email"
                        className="form-control"
                        placeholder="name@example.com"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-emerald w-100">
                      Send Reset Link
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default LoginPage;
