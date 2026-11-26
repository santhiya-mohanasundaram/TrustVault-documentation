import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaShieldAlt, FaLock, FaBars, FaTimes, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="public-navbar">
      <div className="container py-2">
        <div className="d-flex align-items-center justify-content-between">
          {/* Logo */}
          <Link to="/" className="text-decoration-none d-flex align-items-center gap-2">
            <div
              className="d-flex align-items-center justify-content-center text-white rounded-3 shadow-sm"
              style={{
                width: 42,
                height: 42,
                background: 'linear-gradient(135deg, #0f766e 0%, #10b981 100%)'
              }}
            >
              <FaShieldAlt size={22} />
            </div>
            <div>
              <span className="fw-bold fs-4 text-dark" style={{ letterSpacing: '-0.5px' }}>
                Trust<span style={{ color: '#0f766e' }}>Vault</span>
              </span>
              <span className="badge ms-2 bg-emerald text-white rounded-pill px-2 py-1 fw-semibold" style={{ fontSize: '0.74rem' }}>
                SECURE
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="d-none d-lg-flex align-items-center gap-4">
            <Link
              to="/"
              className={`nav-link-custom ${isActive('/') ? 'text-teal fw-bold' : ''}`}
            >
              Home
            </Link>
            <a href="/#features" className="nav-link-custom">
              Features
            </a>
            <a href="/#about" className="nav-link-custom">
              About
            </a>
            <a href="/#contact" className="nav-link-custom">
              Contact
            </a>
          </div>

          {/* Action Buttons */}
          <div className="d-none d-lg-flex align-items-center gap-3">
            <Link to="/login" className="btn btn-outline-teal d-flex align-items-center gap-2">
              <FaSignInAlt /> Login
            </Link>
            <Link to="/register" className="btn btn-emerald d-flex align-items-center gap-2">
              <FaUserPlus /> Register
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="btn btn-light d-lg-none border"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Navigation"
          >
            {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="d-lg-none mt-3 pt-3 border-top pb-2">
            <div className="d-flex flex-column gap-2 mb-3">
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="nav-link-custom py-2"
              >
                Home
              </Link>
              <a
                href="/#features"
                onClick={() => setIsOpen(false)}
                className="nav-link-custom py-2"
              >
                Features
              </a>
              <a
                href="/#about"
                onClick={() => setIsOpen(false)}
                className="nav-link-custom py-2"
              >
                About
              </a>
              <a
                href="/#contact"
                onClick={() => setIsOpen(false)}
                className="nav-link-custom py-2"
              >
                Contact
              </a>
            </div>
            <div className="d-flex flex-column gap-2">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="btn btn-outline-teal text-center"
              >
                <FaSignInAlt className="me-2" /> Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="btn btn-emerald text-center"
              >
                <FaUserPlus className="me-2" /> Register
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
