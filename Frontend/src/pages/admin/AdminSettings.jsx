import React, { useState } from 'react';
import {
  FaCogs,
  FaShieldAlt,
  FaServer,
  FaHdd,
  FaUndoAlt,
  FaSave,
  FaLock,
  FaCheckCircle
} from 'react-icons/fa';
import { useApp } from '../../context/AppContext';

const AdminSettings = () => {
  const { showToast, resetDemoData } = useApp();

  const [settings, setSettings] = useState({
    platformName: 'TrustVault Enterprise Core',
    maxFileSize: '25',
    allowedExtensions: 'pdf, jpg, jpeg, png',
    defaultReminderDays: '30',
    enforce2FA: true,
    clientEncryption: true,
    autoPurgeExpired: false
  });

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Platform system settings saved successfully!', 'success');
  };

  return (
    <div className="d-flex flex-column gap-4 max-w-1000 mx-auto">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div>
          <h3 className="fw-bold text-dark mb-1">System Engine Settings</h3>
          <p className="text-muted small mb-0">
            Configure system storage quotas, encryption enforcement, and tenant governance rules.
          </p>
        </div>
        <button
          onClick={resetDemoData}
          className="btn btn-outline-danger btn-sm d-flex align-items-center gap-2"
        >
          <FaUndoAlt /> Reset All Demo Data
        </button>
      </div>

      <form onSubmit={handleSave}>
        <div className="row g-4">
          {/* General Platform Config */}
          <div className="col-lg-6">
            <div className="tv-card p-4 h-100">
              <h5 className="fw-bold text-dark mb-3 pb-2 border-bottom d-flex align-items-center gap-2">
                <FaServer className="text-teal" /> General Platform Configuration
              </h5>

              <div className="mb-3">
                <label className="form-label fw-bold small text-muted">PLATFORM DISPLAY NAME</label>
                <input
                  type="text"
                  className="form-control"
                  value={settings.platformName}
                  onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold small text-muted">MAX FILE UPLOAD SIZE (MB)</label>
                <input
                  type="number"
                  className="form-control"
                  value={settings.maxFileSize}
                  onChange={(e) => setSettings({ ...settings, maxFileSize: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold small text-muted">ALLOWED FILE EXTENSIONS</label>
                <input
                  type="text"
                  className="form-control font-monospace"
                  value={settings.allowedExtensions}
                  onChange={(e) => setSettings({ ...settings, allowedExtensions: e.target.value })}
                />
                <small className="text-muted" style={{ fontSize: '0.72rem' }}>
                  Comma-separated file formats accepted by user upload pipeline.
                </small>
              </div>
            </div>
          </div>

          {/* Security & Cryptography Policies */}
          <div className="col-lg-6">
            <div className="tv-card p-4 h-100">
              <h5 className="fw-bold text-dark mb-3 pb-2 border-bottom d-flex align-items-center gap-2">
                <FaShieldAlt className="text-teal" /> Security & Cryptographic Policies
              </h5>

              <div className="d-flex flex-column gap-3 pt-2">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="clientEncSwitch"
                    checked={settings.clientEncryption}
                    onChange={(e) => setSettings({ ...settings, clientEncryption: e.target.checked })}
                  />
                  <label className="form-check-label small fw-semibold text-dark" htmlFor="clientEncSwitch">
                    Enforce AES-256 Client-Side Tokenization
                  </label>
                  <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                    Prevents server admins from viewing raw document byte streams.
                  </div>
                </div>

                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="twoFaSwitch"
                    checked={settings.enforce2FA}
                    onChange={(e) => setSettings({ ...settings, enforce2FA: e.target.checked })}
                  />
                  <label className="form-check-label small fw-semibold text-dark" htmlFor="twoFaSwitch">
                    Enforce Multi-Factor Authentication (MFA)
                  </label>
                  <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                    Requires secondary OTP confirmation upon user sign-in.
                  </div>
                </div>

                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="autoPurgeSwitch"
                    checked={settings.autoPurgeExpired}
                    onChange={(e) => setSettings({ ...settings, autoPurgeExpired: e.target.checked })}
                  />
                  <label className="form-check-label small fw-semibold text-dark" htmlFor="autoPurgeSwitch">
                    Automatic Expiry Archive Notification
                  </label>
                  <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                    Notify users 60 days before document reaches irreversible expiration.
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-top">
                <span className="badge bg-light text-secondary border p-2 d-block text-center font-monospace small">
                  Security Profile: Production Grade (Level 4 Demo)
                </span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="col-12 text-end">
            <button type="submit" className="btn btn-emerald px-4 py-2">
              <FaSave className="me-2" /> Save System Settings
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
