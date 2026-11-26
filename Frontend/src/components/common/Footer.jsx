import React from 'react';
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaLock, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaHeart } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white border-top mt-auto pt-5 pb-4">
      <div className="container">
        <div className="row g-4 mb-4">
          {/* Brand info */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div
                className="d-flex align-items-center justify-content-center text-white rounded-3"
                style={{
                  width: 38,
                  height: 38,
                  background: 'linear-gradient(135deg, #0f766e 0%, #10b981 100%)'
                }}
              >
                <FaShieldAlt size={20} />
              </div>
              <span className="fw-bold fs-4 text-dark">
                Trust<span style={{ color: '#0f766e' }}>Vault</span>
              </span>
            </div>
            <p className="text-muted small pe-lg-3">
              TrustVault is your next-generation smart personal document repository.
              Store, organize, categorize, and receive timely expiry notifications
              for all your vital personal and financial records.
            </p>
            <div className="d-flex align-items-center gap-2 text-teal fw-semibold small">
              <FaLock className="text-emerald" /> 256-Bit Client-Side Tokenized Encryption Demo
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold text-dark mb-3">Quick Links</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li>
                <Link to="/" className="text-decoration-none text-muted hover-teal">
                  Home
                </Link>
              </li>
              <li>
                <a href="/#features" className="text-decoration-none text-muted hover-teal">
                  Features
                </a>
              </li>
              <li>
                <a href="/#about" className="text-decoration-none text-muted hover-teal">
                  About Us
                </a>
              </li>
              <li>
                <a href="/#contact" className="text-decoration-none text-muted hover-teal">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>

          {/* Document Categories */}
          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold text-dark mb-3">Supported Documents</h6>
            <div className="d-flex flex-wrap gap-1">
              <span className="badge bg-light text-secondary border">Aadhaar Card</span>
              <span className="badge bg-light text-secondary border">PAN Card</span>
              <span className="badge bg-light text-secondary border">Passport</span>
              <span className="badge bg-light text-secondary border">Driving Licence</span>
              <span className="badge bg-light text-secondary border">Certificates</span>
              <span className="badge bg-light text-secondary border">Bank Records</span>
              <span className="badge bg-light text-secondary border">Insurance</span>
            </div>
            <div className="mt-3">
              <Link to="/login" className="btn btn-sm btn-outline-teal">
                Open Your Vault
              </Link>
            </div>
          </div>

          {/* Contact & Support */}
          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold text-dark mb-3">Contact Information</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small text-muted">
              <li className="d-flex align-items-center gap-2">
                <FaEnvelope className="text-teal" /> support@trustvault.io
              </li>
              <li className="d-flex align-items-center gap-2">
                <FaPhoneAlt className="text-teal" /> +91 98765 43210 (Toll-Free Demo)
              </li>
              <li className="d-flex align-items-center gap-2">
                <FaMapMarkerAlt className="text-teal" /> Cyber City Tech Park, Bengaluru, India
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-4" style={{ borderColor: '#e2e8f0' }} />

        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between text-muted small gap-2">
          <div>
            &copy; {new Date().getFullYear()} TrustVault Systems. All rights reserved.
          </div>
          <div className="d-flex align-items-center gap-3">
            <span>Frontend Demo Presentation</span>
            <span>&bull;</span>
            <span>No backend storage required</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
