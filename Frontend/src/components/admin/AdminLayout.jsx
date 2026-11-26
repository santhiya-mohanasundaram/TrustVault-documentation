import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FaBars,
  FaShieldAlt,
  FaBell,
  FaCogs,
  FaServer,
  FaUndoAlt,
  FaUserShield
} from 'react-icons/fa';
import AdminSidebar from './AdminSidebar';
import { useApp } from '../../context/AppContext';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, resetDemoData } = useApp();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('users')) return 'User Account Governance';
    if (path.includes('statistics')) return 'Enterprise Document Analytics';
    if (path.includes('categories')) return 'System Category Master';
    if (path.includes('activity')) return 'Security Audit & Activity Logs';
    if (path.includes('settings')) return 'System Engine Configuration';
    return 'Executive Administration Dashboard';
  };

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Container */}
      <div className="dashboard-main">
        {/* Topbar */}
        <header className="dashboard-topbar bg-white border-bottom">
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-dark d-lg-none border p-2"
              onClick={() => setSidebarOpen(true)}
              aria-label="Toggle Sidebar"
            >
              <FaBars size={18} />
            </button>
            <div>
              <div className="d-flex align-items-center gap-2">
                <h5 className="mb-0 fw-bold text-dark">{getPageTitle()}</h5>
                <span className="badge bg-dark text-white rounded-pill px-2 py-0" style={{ fontSize: '0.65rem' }}>
                  ADMIN MODE
                </span>
              </div>
              <small className="text-muted d-none d-md-inline">
                TrustVault Administrative Console & Infrastructure Management
              </small>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2 gap-md-3">
            {/* System Health Status Indicator */}
            <div
              className="d-none d-md-flex align-items-center gap-2 px-3 py-1 rounded-pill shadow-sm"
              style={{
                backgroundColor: '#ecfdf5',
                border: '1.5px solid #a7f3d0'
              }}
            >
              <span
                className="rounded-circle d-inline-block"
                style={{
                  width: 10,
                  height: 10,
                  backgroundColor: '#10b981',
                  boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.25)'
                }}
              ></span>
              <span className="fw-bold" style={{ color: '#065f46', fontSize: '0.86rem' }}>
                Engine: <span style={{ color: '#047857' }}>Healthy</span>
              </span>
            </div>

            {/* Reset Demo Data */}
            <button
              onClick={resetDemoData}
              className="btn btn-light border btn-sm d-flex align-items-center gap-1 rounded-pill fw-semibold text-dark shadow-sm px-3"
              title="Reset all demo data to initial defaults"
            >
              <FaUndoAlt size={12} className="text-secondary" /> Reset Data
            </button>

            {/* Admin Badge */}
            <div className="d-flex align-items-center gap-2 border rounded-pill p-1 pe-3 bg-light">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center bg-dark text-white fw-bold"
                style={{ width: 32, height: 32, fontSize: '0.8rem' }}
              >
                <FaUserShield />
              </div>
              <span className="fw-bold text-dark small">Administrator</span>
            </div>
          </div>
        </header>

        {/* Dynamic Admin Content */}
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
