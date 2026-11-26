import React, { useState, useEffect } from 'react';
import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaCalendarAlt,
  FaEdit,
  FaCheckCircle,
  FaCamera,
  FaShieldAlt,
  FaLock
} from 'react-icons/fa';
import { useApp } from '../../context/AppContext';

const ProfilePage = () => {
  const { currentUser, updateProfile, showToast, documents } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
    bio: currentUser?.bio || 'Securing personal certificates and official government documents.'
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        avatar: currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
        bio: currentUser.bio || 'Securing personal certificates and official government documents.'
      });
    }
  }, [currentUser]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      showToast('Name and Email cannot be empty', 'warning');
      return;
    }
    updateProfile(formData);
    setIsEditing(false);
  };

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80'
  ];

  return (
    <div className="d-flex flex-column gap-4 max-w-1000 mx-auto">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div>
          <h3 className="fw-bold text-dark mb-1">My Profile</h3>
          <p className="text-muted small mb-0">
            Personal vault account credentials, registered identity, and security tokens.
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-outline-teal d-flex align-items-center gap-2"
          >
            <FaEdit /> Edit Profile
          </button>
        )}
      </div>

      <div className="row g-4">
        {/* Left Column: Avatar & Quick Info Card */}
        <div className="col-lg-4">
          <div className="tv-card p-4 text-center">
            <div className="position-relative d-inline-block mb-3">
              <img
                src={formData.avatar}
                alt="Profile Avatar"
                className="rounded-circle border shadow-sm"
                style={{ width: 120, height: 120, objectFit: 'cover' }}
              />
              <span
                className="position-absolute bottom-0 end-0 badge bg-emerald text-white rounded-circle p-2 shadow"
                title="Active Account"
              >
                <FaCheckCircle size={14} />
              </span>
            </div>

            <h5 className="fw-bold text-dark mb-1">{formData.name}</h5>
            <p className="text-muted small mb-3">{formData.email}</p>

            <span className="badge bg-teal-subtle text-teal px-3 py-1 rounded-pill small fw-semibold">
              Verified Vault Owner
            </span>

            {/* Quick avatar selection if editing */}
            {isEditing && (
              <div className="mt-4 pt-3 border-top">
                <span className="text-muted small d-block mb-2">Choose Avatar:</span>
                <div className="d-flex justify-content-center gap-2">
                  {sampleAvatars.map((av, idx) => (
                    <img
                      key={idx}
                      src={av}
                      alt="avatar"
                      className={`rounded-circle cursor-pointer border ${formData.avatar === av ? 'border-teal border-3' : ''}`}
                      style={{ width: 36, height: 36, objectFit: 'cover', cursor: 'pointer' }}
                      onClick={() => setFormData({ ...formData, avatar: av })}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="border-top mt-4 pt-3 text-start small text-muted">
              <div className="d-flex justify-content-between mb-2">
                <span>Account ID:</span>
                <strong className="text-dark font-monospace">{currentUser?.id || 'USR-NEW'}</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Total Documents:</span>
                <strong className="text-dark">{documents.length}</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span>Account Created:</span>
                <strong className="text-dark">{currentUser?.registrationDate || new Date().toISOString().split('T')[0]}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Editable Profile Form */}
        <div className="col-lg-8">
          <div className="tv-card p-4">
            <h5 className="fw-bold text-dark mb-3 pb-2 border-bottom">
              Personal Information
            </h5>

            <form onSubmit={handleSave}>
              <div className="row g-3">
                {/* Full Name */}
                <div className="col-md-6">
                  <label className="form-label fw-bold small text-muted">FULL NAME *</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted border-end-0">
                      <FaUser />
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0"
                      disabled={!isEditing}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="col-md-6">
                  <label className="form-label fw-bold small text-muted">EMAIL ADDRESS *</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted border-end-0">
                      <FaEnvelope />
                    </span>
                    <input
                      type="email"
                      className="form-control border-start-0"
                      disabled={!isEditing}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Mobile Number */}
                <div className="col-md-6">
                  <label className="form-label fw-bold small text-muted">MOBILE NUMBER *</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted border-end-0">
                      <FaPhoneAlt />
                    </span>
                    <input
                      type="tel"
                      className="form-control border-start-0"
                      disabled={!isEditing}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Account Created Date */}
                <div className="col-md-6">
                  <label className="form-label fw-bold small text-muted">ACCOUNT CREATED DATE</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted border-end-0">
                      <FaCalendarAlt />
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0 bg-light"
                      disabled
                      value={currentUser?.registrationDate || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                {/* Bio / Notes */}
                <div className="col-12">
                  <label className="form-label fw-bold small text-muted">PROFILE BIO</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    disabled={!isEditing}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  ></textarea>
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                  <button
                    type="button"
                    className="btn btn-light px-4"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-emerald px-4">
                    <FaCheckCircle className="me-2" /> Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
