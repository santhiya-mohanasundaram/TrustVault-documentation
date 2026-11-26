import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import {
  FaShieldAlt,
  FaEye,
  FaEyeSlash,
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaLock,
  FaCheckCircle,
  FaUserPlus
} from 'react-icons/fa';
import { useApp } from '../../context/AppContext';

const RegisterPage = () => {
  const { register, showToast } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // Password Strength Calculation
  const calculatePasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, text: 'None', color: '#e2e8f0', width: '0%' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { score: 1, text: 'Weak', color: '#ef4444', width: '33%' };
    if (score <= 4) return { score: 2, text: 'Medium', color: '#f59e0b', width: '66%' };
    return { score: 3, text: 'Strong', color: '#10b981', width: '100%' };
  };

  const strength = calculatePasswordStrength(formData.password);

  const validate = () => {
    const err = {};
    if (!formData.fullName.trim()) err.fullName = 'Full Name is required';
    if (!formData.email.trim()) {
      err.email = 'Email Address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      err.email = 'Valid email address required';
    }
    if (!formData.phone.trim()) {
      err.phone = 'Mobile Number is required';
    } else if (!/^[0-9+ -]{8,15}$/.test(formData.phone)) {
      err.phone = 'Valid phone number required';
    }
    if (!formData.password) {
      err.password = 'Password is required';
    } else if (formData.password.length < 6) {
      err.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      err.confirmPassword = 'Passwords do not match';
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please fix the errors in the form', 'warning');
      return;
    }

    const res = register(formData);
    if (res && res.success) {
      navigate('/login', { state: { registeredEmail: formData.email } });
    }
  };

  const fillSampleData = () => {
    setFormData({
      fullName: 'Rahul Verma',
      email: 'rahul.verma@example.com',
      phone: '+91 98765 12345',
      password: 'Password@123',
      confirmPassword: 'Password@123'
    });
    setErrors({});
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
            <div className="col-lg-6 col-md-8">
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
                  <h3 className="fw-bold text-dark mb-1">Create TrustVault Account</h3>
                  <p className="text-muted small">
                    Join thousands securing their personal documents with smart expiry alerts.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} noValidate>
                  {/* Full Name */}
                  <div className="mb-3">
                    <label className="form-label fw-bold small text-muted">FULL NAME *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light text-muted border-end-0">
                        <FaUser />
                      </span>
                      <input
                        type="text"
                        className={`form-control border-start-0 ${errors.fullName ? 'is-invalid' : ''}`}
                        placeholder="e.g. Santhiya Devi"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        required
                      />
                    </div>
                    {errors.fullName && <div className="text-danger small mt-1">{errors.fullName}</div>}
                  </div>

                  {/* Email Address */}
                  <div className="mb-3">
                    <label className="form-label fw-bold small text-muted">EMAIL ADDRESS *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light text-muted border-end-0">
                        <FaEnvelope />
                      </span>
                      <input
                        type="email"
                        className={`form-control border-start-0 ${errors.email ? 'is-invalid' : ''}`}
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    {errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
                  </div>

                  {/* Mobile Number */}
                  <div className="mb-3">
                    <label className="form-label fw-bold small text-muted">MOBILE NUMBER *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light text-muted border-end-0">
                        <FaPhoneAlt />
                      </span>
                      <input
                        type="tel"
                        className={`form-control border-start-0 ${errors.phone ? 'is-invalid' : ''}`}
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                    {errors.phone && <div className="text-danger small mt-1">{errors.phone}</div>}
                  </div>

                  {/* Password */}
                  <div className="mb-3">
                    <label className="form-label fw-bold small text-muted">PASSWORD *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light text-muted border-end-0">
                        <FaLock />
                      </span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className={`form-control border-start-0 border-end-0 ${errors.password ? 'is-invalid' : ''}`}
                        placeholder="Min 6 characters"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        className="input-group-text bg-light border-start-0 text-muted"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {errors.password && <div className="text-danger small mt-1">{errors.password}</div>}

                    {/* Password Strength Indicator */}
                    {formData.password && (
                      <div className="mt-2">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <small className="text-muted" style={{ fontSize: '0.72rem' }}>
                            Strength: <strong style={{ color: strength.color }}>{strength.text}</strong>
                          </small>
                          <small className="text-muted" style={{ fontSize: '0.7rem' }}>Use letters & numbers</small>
                        </div>
                        <div className="progress" style={{ height: 5, borderRadius: 5, backgroundColor: '#f1f5f9' }}>
                          <div
                            className="progress-bar"
                            style={{
                              width: strength.width,
                              backgroundColor: strength.color,
                              transition: 'width 0.3s ease'
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-4">
                    <label className="form-label fw-bold small text-muted">CONFIRM PASSWORD *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light text-muted border-end-0">
                        <FaLock />
                      </span>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        className={`form-control border-start-0 border-end-0 ${errors.confirmPassword ? 'is-invalid' : ''}`}
                        placeholder="Re-enter your password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        className="input-group-text bg-light border-start-0 text-muted"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label="Toggle confirm password visibility"
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <div className="text-danger small mt-1">{errors.confirmPassword}</div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button type="submit" className="btn btn-emerald w-100 py-2 fs-6 shadow-sm mb-3">
                    <FaUserPlus className="me-2" /> Register Account
                  </button>

                  {/* Demo helper */}
                  <div className="text-center mb-3">
                    <button
                      type="button"
                      onClick={fillSampleData}
                      className="btn btn-link btn-sm text-teal text-decoration-none fw-semibold"
                    >
                      Fill Demo Form Details
                    </button>
                  </div>

                  {/* Login Link */}
                  <div className="text-center pt-3 border-top">
                    <span className="text-muted small">Already have an account? </span>
                    <Link to="/login" className="text-teal fw-bold text-decoration-none small">
                      Login Here
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RegisterPage;
