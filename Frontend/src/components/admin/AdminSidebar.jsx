import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FaShieldAlt,
  FaChartPie,
  FaUsersCog,
  FaFileContract,
  FaLayerGroup,
  FaClipboardList,
  FaCogs,
  FaSignOutAlt,
  FaTimes,
  FaLock
} from 'react-icons/fa';
import { useApp } from '../../context/AppContext';

const AdminSidebar = ({ isOpen, onClose }) => {
  const { currentUser, logout, users } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/admin/dashboard', icon: <FaChartPie />, label: 'Admin Dashboard' },
    { to: '/admin/users', icon: <FaUsersCog />, label: 'User Management', badge: `${users.length}` },
    { to: '/admin/statistics', icon: <FaFileContract />, label: 'Document Statistics' },
    { to: '/admin/categories', icon: <FaLayerGroup />, label: 'Category Management' },
    { to: '/admin/activity', icon: <FaClipboardList />, label: 'Activity Monitoring' },
    { to: '/admin/settings', icon: <FaCogs />, label: 'System Settings' }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && <div className="sidebar-backdrop d-lg-none" onClick={onClose}></div>}

      <aside className={`tv-sidebar tv-sidebar-admin ${isOpen ? 'show' : ''}`}>
        {/* Header */}
        <div className="tv-sidebar-header">
          <div className="d-flex align-items-center gap-2">
            <div
              className="d-flex align-items-center justify-content-center text-white rounded-3 shadow"
              style={{
                width: 36,
                height: 36,
                background: 'linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)'
              }}
            >
              <FaShieldAlt size={18} />
            </div>
            <div>
              <span className="fw-bold fs-5 text-white" style={{ letterSpacing: '-0.5px' }}>
                Trust<span style={{ color: '#2dd4bf' }}>Vault</span>
              </span>
              <span className="badge ms-1 bg-danger text-white px-2 py-1 small fw-semibold" style={{ fontSize: '0.75rem' }}>
                ADMIN
              </span>
            </div>
          </div>
          <button
            className="btn btn-sm btn-dark text-white d-lg-none"
            onClick={onClose}
            aria-label="Close Sidebar"
          >
            <FaTimes />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-grow-1 py-3 overflow-y-auto">
          <div className="px-3 mb-2">
            <span className="text-muted text-uppercase fw-bold" style={{ fontSize: '0.78rem', letterSpacing: '0.06em' }}>
              Administration Console
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
                  <span className="badge bg-secondary text-white rounded-pill" style={{ fontSize: '0.76rem' }}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Privacy Sandbox Notice in Sidebar */}
          <div className="p-3 mx-3 my-4 rounded-3 border border-secondary border-opacity-25" style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)' }}>
            <div className="d-flex align-items-center gap-2 text-warning small fw-bold mb-1">
              <FaLock size={12} /> Privacy Sandbox Active
            </div>
            <p className="text-secondary small mb-0" style={{ fontSize: '0.8rem' }}>
              Document files and private keys are tokenized client-side. Admins cannot view raw user files.
            </p>
          </div>
        </div>

        {/* Admin Profile & Logout */}
        <div className="p-3 border-top border-secondary border-opacity-25" style={{ backgroundColor: '#090d16' }}>
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2 overflow-hidden">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center bg-teal text-white fw-bold"
                style={{ width: 38, height: 38, fontSize: '0.9rem' }}
              >
                AD
              </div>
              <div className="overflow-hidden">
                <div className="fw-bold text-white text-truncate small">
                  {currentUser?.name || 'Administrator'}
                </div>
                <div className="text-secondary small text-truncate" style={{ fontSize: '0.78rem' }}>
                  admin@trustvault.io
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

export default AdminSidebar;
