import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import {
  FaShieldAlt,
  FaCloudUploadAlt,
  FaBell,
  FaFolderOpen,
  FaSearch,
  FaHistory,
  FaLock,
  FaCheckCircle,
  FaArrowRight,
  FaIdCard,
  FaPassport,
  FaUniversity,
  FaCar,
  FaFileAlt,
  FaPaperPlane
} from 'react-icons/fa';
import { useApp } from '../../context/AppContext';

const HomePage = () => {
  const { showToast } = useApp();
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
    showToast('Thank you! Your message has been received.', 'success');
    setContactForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setContactSubmitted(false), 5000);
  };

  const features = [
    {
      icon: <FaLock className="text-teal" size={28} />,
      title: 'Secure Document Storage',
      desc: 'Military-grade 256-bit AES demo client-side encryption keeps your critical files safe from unauthorized access.'
    },
    {
      icon: <FaCloudUploadAlt className="text-emerald" size={28} />,
      title: 'Easy Document Upload',
      desc: 'Seamless drag-and-drop interface with instant preview, progress tracker, and multi-format support (PDF, JPG, PNG).'
    },
    {
      icon: <FaBell className="text-warning" size={28} />,
      title: 'Smart Expiry Reminders',
      desc: 'Never miss a passport renewal or insurance premium with proactive notifications at 30, 15, and 7-day intervals.'
    },
    {
      icon: <FaFolderOpen className="text-primary" size={28} />,
      title: 'Document Categories',
      desc: 'Organized folders for Aadhaar, PAN, Passport, Driving Licence, Degrees, Bank records, and Insurance.'
    },
    {
      icon: <FaSearch className="text-info" size={28} />,
      title: 'Quick Search',
      desc: 'Instant keyword, category, status, and tag-based search filters to find any certificate in less than 2 seconds.'
    },
    {
      icon: <FaHistory className="text-secondary" size={28} />,
      title: 'Activity History',
      desc: 'Comprehensive timestamped audit trail tracking every document upload, edit, download, and view activity.'
    }
  ];

  return (
    <div className="min-vh-100 d-flex flex-column bg-white">
      <Navbar />

      {/* Hero Section */}
      <section
        className="py-5 position-relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #f0fdf9 0%, #ffffff 100%)'
        }}
      >
        <div className="container py-4 py-lg-5">
          <div className="row align-items-center g-5">
            {/* Left Column: Heading & CTAs */}
            <div className="col-lg-6">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-emerald-light border border-emerald text-emerald-hover fw-bold small mb-3">
                <FaShieldAlt /> Next-Gen Personal Document Vault
              </div>
              <h1 className="display-4 fw-extrabold text-dark mb-3" style={{ letterSpacing: '-0.03em', lineHeight: 1.15 }}>
                Your Documents, <br />
                <span style={{ color: '#0f766e' }}>Safe and Secure.</span>
              </h1>
              <p className="lead text-muted mb-4 fs-5 pe-lg-4">
                Manage, organize, and access all your important personal documents in one secure place.
                Store Aadhaar, PAN, Passport, Driving Licence, certificates, and insurance policies with automated expiry tracking.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/register" className="btn btn-emerald btn-lg px-4 shadow-sm">
                  Get Started Free <FaArrowRight size={14} className="ms-1" />
                </Link>
                <Link to="/login" className="btn btn-outline-teal btn-lg px-4">
                  Access Vault
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="row g-3 mt-4 pt-3 border-top">
                <div className="col-4">
                  <div className="fw-bold text-dark fs-5">100%</div>
                  <small className="text-muted">Client-Side Privacy</small>
                </div>
                <div className="col-4">
                  <div className="fw-bold text-dark fs-5">8+</div>
                  <small className="text-muted">Core Categories</small>
                </div>
                <div className="col-4">
                  <div className="fw-bold text-dark fs-5">24/7</div>
                  <small className="text-muted">Vault Availability</small>
                </div>
              </div>
            </div>

            {/* Right Column: Security Illustration Card */}
            <div className="col-lg-6">
              <div className="position-relative">
                {/* Decorative background glow */}
                <div
                  className="position-absolute top-50 start-50 translate-middle rounded-circle"
                  style={{
                    width: '380px',
                    height: '380px',
                    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, rgba(15, 118, 110, 0.05) 70%, transparent 100%)',
                    filter: 'blur(30px)',
                    zIndex: 0
                  }}
                ></div>

                {/* Main Visual Vault Card */}
                <div className="tv-card p-4 p-md-5 position-relative bg-white shadow-lg border" style={{ zIndex: 1 }}>
                  <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="rounded-3 d-flex align-items-center justify-content-center text-white"
                        style={{ width: 44, height: 44, backgroundColor: '#0f766e' }}
                      >
                        <FaShieldAlt size={22} />
                      </div>
                      <div>
                        <h6 className="fw-bold text-dark mb-0">TrustVault Identity Hub</h6>
                        <small className="text-emerald fw-semibold">
                          <FaCheckCircle size={11} className="me-1" /> Encrypted Vault Locked
                        </small>
                      </div>
                    </div>
                    <span className="badge bg-light text-secondary border px-3 py-2 rounded-pill font-monospace small">
                      AES-256
                    </span>
                  </div>

                  {/* Document Stack Simulation */}
                  <div className="d-flex flex-column gap-3">
                    <div className="p-3 rounded-3 border bg-light d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-3">
                        <div className="text-teal fs-4">
                          <FaIdCard />
                        </div>
                        <div>
                          <div className="fw-bold text-dark small">e-Aadhaar & PAN Card</div>
                          <small className="text-muted">Government Verified ID</small>
                        </div>
                      </div>
                      <span className="badge-active small">Active</span>
                    </div>

                    <div className="p-3 rounded-3 border bg-light d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-3">
                        <div className="text-info fs-4">
                          <FaPassport />
                        </div>
                        <div>
                          <div className="fw-bold text-dark small">Republic of India Passport</div>
                          <small className="text-muted">Expires in 21 Days</small>
                        </div>
                      </div>
                      <span className="badge-expiring small">Expiring Soon</span>
                    </div>

                    <div className="p-3 rounded-3 border bg-light d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-3">
                        <div className="text-primary fs-4">
                          <FaCar />
                        </div>
                        <div>
                          <div className="fw-bold text-dark small">Smart Driving Licence</div>
                          <small className="text-muted">Valid till 2030</small>
                        </div>
                      </div>
                      <span className="badge-active small">Active</span>
                    </div>
                  </div>

                  {/* Vault action indicator */}
                  <div className="mt-4 pt-3 border-top d-flex align-items-center justify-content-between small text-muted">
                    <span>
                      <FaLock className="text-teal me-1" /> 100% Zero-Knowledge Tokenized
                    </span>
                    <Link to="/login" className="text-teal fw-bold text-decoration-none">
                      Try Live Demo &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-5 bg-light">
        <div className="container py-4">
          <div className="text-center max-w-700 mx-auto mb-5">
            <span className="badge bg-teal-subtle text-teal px-3 py-1 rounded-pill fw-bold text-uppercase small">
              Complete Feature Suite
            </span>
            <h2 className="display-6 fw-bold text-dark mt-2 mb-3">
              Smart Tools Built For Document Peace of Mind
            </h2>
            <p className="text-muted fs-6">
              Organize everything from personal IDs to academic degrees, auto-detect expiration dates, and access them anytime, anywhere.
            </p>
          </div>

          <div className="row g-4">
            {features.map((feat, idx) => (
              <div key={idx} className="col-lg-4 col-md-6">
                <div className="tv-card p-4 h-100 bg-white">
                  <div
                    className="rounded-3 d-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: 54,
                      height: 54,
                      backgroundColor: '#f0fdf9',
                      border: '1px solid #ccfbf1'
                    }}
                  >
                    {feat.icon}
                  </div>
                  <h5 className="fw-bold text-dark mb-2">{feat.title}</h5>
                  <p className="text-muted small mb-0">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="badge bg-emerald-light text-emerald-hover px-3 py-1 rounded-pill fw-bold small text-uppercase">
              Simple 3-Step Process
            </span>
            <h2 className="display-6 fw-bold text-dark mt-2">How TrustVault Works</h2>
          </div>

          <div className="row g-4 text-center">
            <div className="col-md-4">
              <div className="p-4 rounded-4 border bg-light h-100 position-relative">
                <div
                  className="rounded-circle bg-emerald text-white fw-bold d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{ width: 48, height: 48, fontSize: '1.25rem' }}
                >
                  1
                </div>
                <h5 className="fw-bold text-dark">Create Your Account</h5>
                <p className="text-muted small mb-0">
                  Quick sign-up with client-side credential verification and zero complexity.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-4 rounded-4 border bg-light h-100 position-relative">
                <div
                  className="rounded-circle bg-teal text-white fw-bold d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{ width: 48, height: 48, fontSize: '1.25rem' }}
                >
                  2
                </div>
                <h5 className="fw-bold text-dark">Drag & Drop Documents</h5>
                <p className="text-muted small mb-0">
                  Upload Aadhaar, PAN, Passport, or PDF policies with category tagging and issue/expiry dates.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-4 rounded-4 border bg-light h-100 position-relative">
                <div
                  className="rounded-circle bg-dark text-white fw-bold d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{ width: 48, height: 48, fontSize: '1.25rem' }}
                >
                  3
                </div>
                <h5 className="fw-bold text-dark">Get Timely Expiry Alerts</h5>
                <p className="text-muted small mb-0">
                  Receive proactive alerts, inspect expiry calendars, and download verified files whenever needed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-5 bg-light">
        <div className="container py-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="badge bg-teal-subtle text-teal px-3 py-1 rounded-pill fw-bold text-uppercase small">
                About TrustVault
              </span>
              <h2 className="display-6 fw-bold text-dark mt-2 mb-3">
                Built For Seamless Personal Records Management
              </h2>
              <p className="text-muted">
                TrustVault was engineered to solve the persistent frustration of lost certificates, forgotten expiry dates,
                and disorganized folders. Our unified interface empowers individuals and families to manage their vital documents
                with extreme confidence and structured categorization.
              </p>
              <ul className="list-unstyled d-flex flex-column gap-2 text-dark fw-semibold small">
                <li className="d-flex align-items-center gap-2">
                  <FaCheckCircle className="text-emerald" /> Independent User and Admin Governance Portals
                </li>
                <li className="d-flex align-items-center gap-2">
                  <FaCheckCircle className="text-emerald" /> Interactive Monthly Expiry Calendar with color coding
                </li>
                <li className="d-flex align-items-center gap-2">
                  <FaCheckCircle className="text-emerald" /> Real-time activity logs and comprehensive notification center
                </li>
              </ul>
            </div>
            <div className="col-lg-6">
              <div className="p-4 p-md-5 rounded-4 bg-white border shadow-sm">
                <h4 className="fw-bold text-dark mb-3">Our Core Philosophy</h4>
                <div className="border-start border-4 border-teal ps-3 mb-4">
                  <p className="fst-italic text-secondary mb-0">
                    "Your personal identity and documents belong strictly to you. TrustVault delivers clean, intuitive organization with zero unnecessary complexity."
                  </p>
                </div>
                <div className="d-flex gap-3">
                  <Link to="/register" className="btn btn-emerald">
                    Start Free Demo
                  </Link>
                  <Link to="/login" className="btn btn-outline-secondary">
                    Login Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-5 bg-white">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="badge bg-emerald-light text-emerald-hover px-3 py-1 rounded-pill fw-bold small text-uppercase">
              Get In Touch
            </span>
            <h2 className="display-6 fw-bold text-dark mt-2">Have Questions About TrustVault?</h2>
            <p className="text-muted">Send us a message and our support team will get back to you promptly.</p>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="p-4 p-md-5 rounded-4 border bg-light shadow-sm">
                {contactSubmitted && (
                  <div className="alert alert-success d-flex align-items-center gap-2 mb-4">
                    <FaCheckCircle /> Thank you! Your demo message has been dispatched successfully.
                  </div>
                )}
                <form onSubmit={handleContactSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted">YOUR NAME *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="John Doe"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted">YOUR EMAIL *</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="john@example.com"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-bold small text-muted">SUBJECT</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Question about Expiry Alerts"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-bold small text-muted">MESSAGE *</label>
                      <textarea
                        className="form-control"
                        rows="4"
                        placeholder="Type your question or feedback..."
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        required
                      ></textarea>
                    </div>
                    <div className="col-12 text-end">
                      <button type="submit" className="btn btn-emerald px-4">
                        <FaPaperPlane className="me-2" /> Send Message
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
