import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaLock,
  FaBell,
  FaEnvelope,
  FaShieldAlt,
  FaSignOutAlt,
  FaCheckCircle,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';
import { useApp } from '../../context/AppContext';

const SettingsPage = () => {
  const { logout, showToast } = useApp();
  const navigate = useNavigate();

  // Password state
  const [pwdForm, setPwdForm] = useState({
    current: '',
    newPwd: '',
    confirmPwd: ''
  });
  const [showPwd, setShowPwd] = useState(false);

  // Notification Preferences state
  const [notifPrefs, setNotifPrefs] = useState({
    emailReminders: true,
    smsAlerts: false,
    pushNotifications: true,
    expiryDays: '30',
    weeklySummary: true
  });

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!pwdForm.current || !pwdForm.newPwd) {
      showToast('Please fill all password fields', 'warning');
      return;
    }
    if (pwdForm.newPwd !== pwdForm.confirmPwd) {
      showToast('New passwords do not match', 'danger');
      return;
    }
    showToast('Password updated successfully! (Demo)', 'success');
    setPwdForm({ current: '', newPwd: '', confirmPwd: '' });
  };

  const handleSavePreferences = (e) => {
    e.preventDefault();
    showToast('Notification and Reminder preferences saved!', 'success');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="d-flex flex-column gap-4 max-w-1000 mx-auto">
      {/* Header */}
      <div>
        <h3 className="fw-bold text-dark mb-1">Vault Preferences & Security Settings</h3>
        <p className="text-muted small mb-0">
          Manage your account credentials, proactive reminder schedules, and privacy controls.
        </p>
      </div>

      <div className="row g-4">
        {/* Change Password Card */}
        <div className="col-lg-6">
          <div className="tv-card p-4 h-100">
            <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
              <FaLock className="text-teal" />
              <h5 className="fw-bold text-dark mb-0">Change Password</h5>
            </div>

            <form onSubmit={handlePasswordChange}>
              <div className="mb-3">
                <label className="form-label fw-bold small text-muted">CURRENT PASSWORD</label>
                <input
                  type={showPwd ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Enter current password"
                  value={pwdForm.current}
                  onChange={(e) => setPwdForm({ ...pwdForm, current: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold small text-muted">NEW PASSWORD</label>
                <input
                  type={showPwd ? 'text' : 'password'}
                  className="form-control"
                  placeholder="At least 6 characters"
                  value={pwdForm.newPwd}
                  onChange={(e) => setPwdForm({ ...pwdForm, newPwd: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold small text-muted">CONFIRM NEW PASSWORD</label>
                <input
                  type={showPwd ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Re-enter new password"
                  value={pwdForm.confirmPwd}
                  onChange={(e) => setPwdForm({ ...pwdForm, confirmPwd: e.target.value })}
                  required
                />
              </div>

              <div className="form-check mb-4">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="showPwdCheck"
                  checked={showPwd}
                  onChange={(e) => setShowPwd(e.target.checked)}
                />
                <label className="form-check-label small text-muted" htmlFor="showPwdCheck">
                  Show passwords
                </label>
              </div>

              <button type="submit" className="btn btn-emerald w-100">
                Update Password
              </button>
            </form>
          </div>
        </div>

        {/* Email & Reminder Preferences */}
        <div className="col-lg-6">
          <div className="tv-card p-4 h-100">
            <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
              <FaBell className="text-teal" />
              <h5 className="fw-bold text-dark mb-0">Notification Preferences</h5>
            </div>

            <form onSubmit={handleSavePreferences}>
              <div className="mb-3">
                <label className="form-label fw-bold small text-muted">
                  EXPIRY ALERT THRESHOLD
                </label>
                <select
                  className="form-select"
                  value={notifPrefs.expiryDays}
                  onChange={(e) => setNotifPrefs({ ...notifPrefs, expiryDays: e.target.value })}
                >
                  <option value="60">60 Days in advance</option>
                  <option value="30">30 Days in advance (Recommended)</option>
                  <option value="15">15 Days in advance</option>
                  <option value="7">7 Days in advance</option>
                </select>
                <small className="text-muted" style={{ fontSize: '0.72rem' }}>
                  When a document's expiry falls within this window, it flags as "Expiring Soon".
                </small>
              </div>

              <div className="d-flex flex-column gap-3 mb-4 pt-2">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="emailRemSwitch"
                    checked={notifPrefs.emailReminders}
                    onChange={(e) => setNotifPrefs({ ...notifPrefs, emailReminders: e.target.checked })}
                  />
                  <label className="form-check-label small fw-semibold text-dark" htmlFor="emailRemSwitch">
                    Email Reminder Alerts
                  </label>
                  <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                    Receive automated email digests for documents approaching expiration.
                  </div>
                </div>

                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="pushNotifSwitch"
                    checked={notifPrefs.pushNotifications}
                    onChange={(e) => setNotifPrefs({ ...notifPrefs, pushNotifications: e.target.checked })}
                  />
                  <label className="form-check-label small fw-semibold text-dark" htmlFor="pushNotifSwitch">
                    In-App Notification Center
                  </label>
                  <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                    Display real-time alerts in topbar bell and notification center.
                  </div>
                </div>

                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="weeklySummSwitch"
                    checked={notifPrefs.weeklySummary}
                    onChange={(e) => setNotifPrefs({ ...notifPrefs, weeklySummary: e.target.checked })}
                  />
                  <label className="form-check-label small fw-semibold text-dark" htmlFor="weeklySummSwitch">
                    Weekly Vault Security Summary
                  </label>
                  <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                    Receive a weekly status review of your secured files.
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-emerald w-100">
                Save Preferences
              </button>
            </form>
          </div>
        </div>

        {/* Account Actions & Logout */}
        <div className="col-12">
          <div className="tv-card p-4 border-danger-subtle">
            <h5 className="fw-bold text-dark mb-2">Account Session Management</h5>
            <p className="text-muted small mb-3">
              Safely end your current session or manage identity authentication keys.
            </p>

            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 pt-3 border-top">
              <div>
                <span className="fw-bold text-dark small d-block">Log Out of TrustVault</span>
                <span className="text-muted small">You will need to re-authenticate to view encrypted files.</span>
              </div>
              <button onClick={handleLogout} className="btn btn-outline-danger">
                <FaSignOutAlt className="me-2" /> Logout From Vault
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
