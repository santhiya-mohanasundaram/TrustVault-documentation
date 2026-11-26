import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  FaBars,
  FaBell,
  FaCloudUploadAlt,
  FaSearch,
  FaShieldAlt,
  FaUserCircle,
  FaSignOutAlt,
  FaCheckCircle,
  FaExclamationTriangle
} from 'react-icons/fa';
import UserSidebar from './UserSidebar';
import { useApp } from '../../context/AppContext';

const UserLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const { currentUser, notifications, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  // If session expired or logged out, redirect cleanly to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const unreadNotifs = notifications.filter((n) => !n.isRead);

  // Derive friendly page title from pathname
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('documents')) return 'My Documents Repository';
    if (path.includes('upload')) return 'Upload New Document';
    if (path.includes('categories')) return 'Document Categories';
    if (path.includes('calendar')) return 'Expiry Calendar & Schedule';
    if (path.includes('notifications')) return 'Notification Center';
    if (path.includes('history')) return 'Document Activity History';
    if (path.includes('profile')) return 'User Profile & Identity';
    if (path.includes('settings')) return 'Security & Preferences';
    return 'User Overview Dashboard';
  };

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Container */}
      <div className="dashboard-main">
        {/* Topbar */}
        <header className="dashboard-topbar">
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-light d-lg-none border p-2"
              onClick={() => setSidebarOpen(true)}
              aria-label="Toggle Sidebar"
            >
              <FaBars size={18} />
            </button>
            <div>
              <h5 className="mb-0 fw-bold text-dark">{getPageTitle()}</h5>
              <small className="text-muted d-none d-md-inline">
                TrustVault Smart Document Environment
              </small>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2 gap-md-3">
            {/* Quick Upload Button */}
            <Link to="/user/upload" className="btn btn-emerald btn-sm d-none d-sm-flex align-items-center gap-2">
              <FaCloudUploadAlt size={16} /> Upload File
            </Link>

            {/* Notification Bell Dropdown */}
            <div className="position-relative">
              <button
                className="btn btn-light border rounded-circle position-relative p-2"
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                style={{ width: 40, height: 40 }}
                aria-label="Notifications"
              >
                <FaBell className="text-secondary" />
                {unreadNotifs.length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.65rem' }}>
                    {unreadNotifs.length}
                  </span>
                )}
              </button>

              {notifDropdownOpen && (
                <div
                  className="dropdown-menu dropdown-menu-end show shadow-lg border-0 rounded-3 p-0 mt-2 position-absolute"
                  style={{ width: 320, zIndex: 1050 }}
                >
                  <div className="p-3 border-bottom d-flex align-items-center justify-content-between bg-light">
                    <span className="fw-bold small text-dark">Notifications ({unreadNotifs.length} new)</span>
                    <Link
                      to="/user/notifications"
                      className="small text-teal text-decoration-none fw-semibold"
                      onClick={() => setNotifDropdownOpen(false)}
                    >
                      View All
                    </Link>
                  </div>
                  <div className="p-2" style={{ maxHeight: 280, overflowY: 'auto' }}>
                    {notifications.slice(0, 4).map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-2 rounded-2 mb-1 small ${notif.isRead ? 'text-muted' : 'bg-light text-dark fw-semibold'}`}
                      >
                        <div className="d-flex align-items-center gap-2">
                          {notif.type === 'danger' ? (
                            <FaExclamationTriangle className="text-danger flex-shrink-0" />
                          ) : (
                            <FaCheckCircle className="text-emerald flex-shrink-0" />
                          )}
                          <span className="text-truncate">{notif.title}</span>
                        </div>
                        <div className="text-muted" style={{ fontSize: '0.72rem', paddingLeft: 22 }}>
                          {notif.date}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 border-top text-center bg-light">
                    <Link
                      to="/user/notifications"
                      className="btn btn-sm btn-link text-teal text-decoration-none py-1 fw-bold"
                      onClick={() => setNotifDropdownOpen(false)}
                    >
                      Open Notification Center &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Avatar Link */}
            <Link
              to="/user/profile"
              className="d-flex align-items-center gap-2 text-decoration-none border rounded-pill p-1 pe-2 bg-light hover-shadow"
            >
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&h=60&q=80'}
                alt="User Avatar"
                className="rounded-circle"
                style={{ width: 32, height: 32, objectFit: 'cover' }}
              />
              <span className="fw-semibold text-dark small d-none d-md-inline">
                {currentUser?.name?.split(' ')[0] || 'User'}
              </span>
            </Link>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
