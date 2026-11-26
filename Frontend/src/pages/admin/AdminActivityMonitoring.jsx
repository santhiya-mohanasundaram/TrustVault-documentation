import React, { useState } from 'react';
import {
  FaClipboardList,
  FaSearch,
  FaFilter,
  FaShieldAlt,
  FaUserCheck,
  FaSignInAlt,
  FaCloudUploadAlt,
  FaUserSlash,
  FaCogs
} from 'react-icons/fa';
import { useApp } from '../../context/AppContext';

const AdminActivityMonitoring = () => {
  const { adminLogs } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [eventFilter, setEventFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredLogs = adminLogs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.ip && log.ip.includes(searchTerm));

    const matchesEvent =
      eventFilter === 'All' || log.event === eventFilter;

    const matchesStatus =
      statusFilter === 'All' || log.status === statusFilter;

    return matchesSearch && matchesEvent && matchesStatus;
  });

  const getEventBadge = (event) => {
    switch (event) {
      case 'User Registration':
        return <span className="badge bg-primary-subtle text-primary border border-primary-subtle">User Registration</span>;
      case 'User Login':
        return <span className="badge bg-success-subtle text-success border border-success-subtle">Login Activity</span>;
      case 'Document Upload':
        return <span className="badge bg-info-subtle text-info border border-info-subtle">Document Upload</span>;
      case 'Account Status Change':
        return <span className="badge bg-warning-subtle text-warning border border-warning-subtle">Account Status Change</span>;
      default:
        return <span className="badge bg-light text-secondary border">{event}</span>;
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header */}
      <div>
        <h3 className="fw-bold text-dark mb-1">System Security & Activity Monitoring</h3>
        <p className="text-muted small mb-0">
          Immutable system-level audit logs for authentication events, uploads, and governance operations.
        </p>
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
                placeholder="Search by user email, IP address, action..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <select
              className="form-select"
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
            >
              <option value="All">All Event Types</option>
              <option value="User Registration">User Registration</option>
              <option value="User Login">Login Activity</option>
              <option value="Document Upload">Document Upload Activity</option>
              <option value="Account Status Change">Account Status Changes</option>
              <option value="Category Created">Category Operations</option>
            </select>
          </div>

          <div className="col-lg-3 col-md-12">
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Success">Success</option>
              <option value="Warning">Warning</option>
              <option value="Info">Info</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="tv-card overflow-hidden">
        <div className="table-responsive">
          <table className="tv-table">
            <thead>
              <tr>
                <th>Event ID</th>
                <th>Event Type</th>
                <th>User / Initiator</th>
                <th>Operation Details</th>
                <th>IP Origin</th>
                <th>Timestamp</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">
                    No activity logs found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <code className="text-dark small font-monospace">{log.id}</code>
                    </td>
                    <td>{getEventBadge(log.event)}</td>
                    <td>
                      <span className="fw-semibold text-dark small">{log.user}</span>
                    </td>
                    <td className="small text-secondary">{log.action}</td>
                    <td>
                      <span className="badge bg-light text-muted border font-monospace small">
                        {log.ip || '192.168.1.1'}
                      </span>
                    </td>
                    <td className="small text-muted font-monospace">{log.timestamp}</td>
                    <td>
                      <span
                        className={`badge ${
                          log.status === 'Success'
                            ? 'bg-success-subtle text-success border border-success-subtle'
                            : log.status === 'Warning'
                            ? 'bg-warning-subtle text-warning border border-warning-subtle'
                            : 'bg-info-subtle text-info border border-info-subtle'
                        } small`}
                      >
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminActivityMonitoring;
