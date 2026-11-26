import React, { useState } from 'react';
import {
  FaUsersCog,
  FaSearch,
  FaFilter,
  FaEye,
  FaCheckCircle,
  FaBan,
  FaUser,
  FaShieldAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaCalendarAlt,
  FaHdd
} from 'react-icons/fa';
import { useApp } from '../../context/AppContext';

const AdminUserManagement = () => {
  const { users, updateUserStatus, showToast } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // View User Modal State
  const [viewingUser, setViewingUser] = useState(null);

  const filteredUsers = users
    .filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'All' || user.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.registrationDate) - new Date(a.registrationDate);
      if (sortBy === 'oldest') return new Date(a.registrationDate) - new Date(b.registrationDate);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  const handleToggleStatus = (user) => {
    const nextStatus = user.status === 'Active' ? 'Suspended' : 'Active';
    updateUserStatus(user.id, nextStatus);
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div>
          <h3 className="fw-bold text-dark mb-1">User Account Management</h3>
          <p className="text-muted small mb-0">
            Control registered tenant accounts, monitor access privileges, and manage statuses.
          </p>
        </div>
        <div>
          <span className="badge bg-light text-secondary border px-3 py-2 rounded-pill small">
            {filteredUsers.length} of {users.length} Users Listed
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="tv-card p-3">
        <div className="row g-3">
          <div className="col-lg-5 col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-light text-muted border-end-0">
                <FaSearch />
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search user by name, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Account Statuses</option>
              <option value="Active">Active Accounts</option>
              <option value="Suspended">Suspended Accounts</option>
            </select>
          </div>

          <div className="col-lg-3 col-md-12">
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Sort: Newest Registration</option>
              <option value="oldest">Sort: Oldest Registration</option>
              <option value="name">Sort: Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="tv-card overflow-hidden">
        <div className="table-responsive">
          <table className="tv-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>User Name</th>
                <th>Email Address</th>
                <th>Registration Date</th>
                <th>Account Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    No users match your criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <code className="text-dark small font-monospace fw-bold">{user.id}</code>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center bg-teal text-white fw-bold"
                          style={{ width: 34, height: 34, fontSize: '0.8rem' }}
                        >
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="fw-bold text-dark small">{user.name}</div>
                          <span className="badge bg-light text-muted border" style={{ fontSize: '0.68rem' }}>
                            {user.role}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="small text-secondary">{user.email}</td>
                    <td className="small text-muted">{user.registrationDate}</td>
                    <td>
                      {user.status === 'Active' ? (
                        <span className="badge-active small">Active</span>
                      ) : (
                        <span className="badge-expired small">Suspended</span>
                      )}
                    </td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-light border"
                          title="View User Details"
                          onClick={() => setViewingUser(user)}
                        >
                          <FaEye className="text-teal me-1" /> View
                        </button>
                        {user.status === 'Active' ? (
                          <button
                            className="btn btn-outline-danger"
                            title="Deactivate / Suspend User"
                            onClick={() => handleToggleStatus(user)}
                          >
                            <FaBan className="me-1" /> Deactivate
                          </button>
                        ) : (
                          <button
                            className="btn btn-outline-success"
                            title="Activate User"
                            onClick={() => handleToggleStatus(user)}
                          >
                            <FaCheckCircle className="me-1" /> Activate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View User Modal */}
      {viewingUser && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(3px)', zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-light border-bottom px-4 py-3">
                <h5 className="modal-title fw-bold text-dark mb-0">User Account Overview</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setViewingUser(null)}
                ></button>
              </div>

              <div className="modal-body p-4">
                <div className="text-center mb-4">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center bg-teal text-white fw-bold mx-auto mb-2"
                    style={{ width: 64, height: 64, fontSize: '1.5rem' }}
                  >
                    {viewingUser.name.charAt(0)}
                  </div>
                  <h5 className="fw-bold text-dark mb-1">{viewingUser.name}</h5>
                  <span className="badge bg-light text-muted border">{viewingUser.role} Account</span>
                </div>

                <div className="bg-light rounded-3 p-3 border small d-flex flex-column gap-2 mb-3">
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">User ID:</span>
                    <strong className="text-dark font-monospace">{viewingUser.id}</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Email Address:</span>
                    <span className="text-dark">{viewingUser.email}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Phone:</span>
                    <span className="text-dark">{viewingUser.phone || 'N/A'}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Registration Date:</span>
                    <span className="text-dark">{viewingUser.registrationDate}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Account Status:</span>
                    <span className={`fw-bold ${viewingUser.status === 'Active' ? 'text-success' : 'text-danger'}`}>
                      {viewingUser.status}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Documents Stored:</span>
                    <span className="text-dark fw-bold">{viewingUser.documentsCount || 0}</span>
                  </div>
                </div>

                <div className="p-3 bg-white border rounded-3 small text-muted">
                  <FaShieldAlt className="text-teal me-1" /> User documents and encryption keys are strictly client-managed and protected from administrator inspection.
                </div>
              </div>

              <div className="modal-footer bg-light px-4 py-3 d-flex justify-content-between">
                <button
                  type="button"
                  className={`btn btn-sm ${viewingUser.status === 'Active' ? 'btn-outline-danger' : 'btn-outline-success'}`}
                  onClick={() => {
                    handleToggleStatus(viewingUser);
                    setViewingUser({
                      ...viewingUser,
                      status: viewingUser.status === 'Active' ? 'Suspended' : 'Active'
                    });
                  }}
                >
                  {viewingUser.status === 'Active' ? 'Suspend Account' : 'Activate Account'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setViewingUser(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;
