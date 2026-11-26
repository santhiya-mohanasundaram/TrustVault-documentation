import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FaShieldAlt,
  FaThLarge,
  FaFileAlt,
  FaCloudUploadAlt,
  FaFolder,
  FaCalendarAlt,
  FaBell,
  FaHistory,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaTimes
} from 'react-icons/fa';
import { useApp } from '../../context/AppContext';

const UserSidebar = ({ isOpen, onClose }) => {
  const { currentUser, logout, notifications, documents } = useApp();
  const navigate = useNavigate();

  const unreadNotifs = notifications.filter((n) => !n.isRead).length;
  const expiringCount = documents.filter((d) => d.status === 'Expiring Soon').length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/user/dashboard', icon: <FaThLarge />, label: 'Dashboard' },
    { to: '/user/documents', icon: <FaFileAlt />, label: 'My Documents' },
    { to: '/user/upload', icon: <FaCloudUploadAlt />, label: 'Upload Document' },
    { to: '/user/categories', icon: <FaFolder />, label: 'Categories' },
    {
      to: '/user/calendar',
      icon: <FaCalendarAlt />,
      label: 'Expiry Calendar',
      badge: expiringCount > 0 ? `${expiringCount} soon` : null,
      badgeClass: 'badge-expiring'
    },
    {
      to: '/user/notifications',
      icon: <FaBell />,
      label: 'Notifications',
      badge: unreadNotifs > 0 ? unreadNotifs : null,
      badgeClass: 'bg-danger text-white rounded-pill'
    },
    { to: '/user/history', icon: <FaHistory />, label: 'Document History' },
    { to: '/user/profile', icon: <FaUser />, label: 'My Profile' },
    { to: '/user/settings', icon: <FaCog />, label: 'Settings' }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && <div className="sidebar-backdrop d-lg-none" onClick={onClose}></div>}

      <aside className={`tv-sidebar ${isOpen ? 'show' : ''}`}>
        {/* Brand Header */}
        <div className="tv-sidebar-header">
          <div className="d-flex align-items-center gap-2">
            <div
              className="d-flex align-items-center justify-content-center text-white rounded-3 shadow-sm"
              style={{
                width: 36,
                height: 36,
                background: 'linear-gradient(135deg, #0f766e 0%, #10b981 100%)'
              }}
            >
              <FaShieldAlt size={18} />
            </div>
            <div>
              <span className="fw-bold fs-5 text-dark" style={{ letterSpacing: '-0.5px' }}>
                Trust<span style={{ color: '#0f766e' }}>Vault</span>
              </span>
              <span className="badge ms-1 bg-teal-subtle text-teal px-2 py-1 small fw-semibold" style={{ fontSize: '0.75rem' }}>
                USER
              </span>
            </div>
          </div>
          <button
            className="btn btn-sm btn-light d-lg-none"
            onClick={onClose}
            aria-label="Close Sidebar"
          >
            <FaTimes />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-grow-1 py-3 overflow-y-auto">
          <div className="px-3 mb-2">
            <span className="text-muted text-uppercase fw-bold" style={{ fontSize: '0.78rem', letterSpacing: '0.06em' }}>
              User Workspace
            </span>
          </div>

          <nav className="nav flex-column">
            {navLinks.map((item, index) => (
              <NavLink
                key={index}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) => `tv-nav-item ${isActive ? 'active' : ''}`}
              >
                <span className="fs-5 d-flex align-items-center">{item.icon}</span>
                <span className="flex-grow-1">{item.label}</span>
                {item.badge && (
                  <span className={`badge ${item.badgeClass}`} style={{ fontSize: '0.76rem' }}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User Mini Profile & Logout */}
        <div className="p-3 border-top bg-light">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2 overflow-hidden">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80'}
                alt="Profile"
                className="rounded-circle border"
                style={{ width: 38, height: 38, objectFit: 'cover' }}
              />
              <div className="overflow-hidden">
                <div className="fw-bold text-dark text-truncate small" style={{ maxWidth: 120 }}>
                  {currentUser?.name || 'User'}
                </div>
                <div className="text-muted small text-truncate" style={{ fontSize: '0.78rem' }}>
                  {currentUser?.email || ''}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-sm btn-outline-danger p-2 rounded-3"
              title="Logout"
              aria-label="Logout"
            >
              <FaSignOutAlt />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default UserSidebar;
