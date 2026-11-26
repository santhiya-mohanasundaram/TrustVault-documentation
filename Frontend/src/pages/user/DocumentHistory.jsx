import React, { useState } from 'react';
import {
  FaHistory,
  FaSearch,
  FaFilter,
  FaCloudUploadAlt,
  FaDownload,
  FaEdit,
  FaTrash,
  FaEye,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle
} from 'react-icons/fa';
import { useApp } from '../../context/AppContext';

const DocumentHistory = () => {
  const { activities } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [activityTypeFilter, setActivityTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredActivities = activities.filter((act) => {
    const matchesSearch =
      act.documentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (act.category && act.category.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType =
      activityTypeFilter === 'All' || act.type === activityTypeFilter;

    const matchesStatus =
      statusFilter === 'All' || act.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const getActivityBadge = (type) => {
    switch (type) {
      case 'Document Uploaded':
        return (
          <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
            <FaCloudUploadAlt className="me-1" /> Uploaded
          </span>
        );
      case 'Document Downloaded':
        return (
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1">
            <FaDownload className="me-1" /> Downloaded
          </span>
        );
      case 'Document Updated':
        return (
          <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-2 py-1">
            <FaEdit className="me-1" /> Updated
          </span>
        );
      case 'Document Deleted':
        return (
          <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1">
            <FaTrash className="me-1" /> Deleted
          </span>
        );
      case 'Document Viewed':
        return (
          <span className="badge bg-info-subtle text-info border border-info-subtle px-2 py-1">
            <FaEye className="me-1" /> Viewed
          </span>
        );
      default:
        return (
          <span className="badge bg-light text-secondary border px-2 py-1">
            <FaInfoCircle className="me-1" /> {type}
          </span>
        );
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header */}
      <div>
        <h3 className="fw-bold text-dark mb-1">Document Activity & Audit History</h3>
        <p className="text-muted small mb-0">
          Cryptographically timestamped user audit log of every document interaction.
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
                placeholder="Search activities by document name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <select
              className="form-select"
              value={activityTypeFilter}
              onChange={(e) => setActivityTypeFilter(e.target.value)}
            >
              <option value="All">All Document Operations</option>
              <option value="Document Uploaded">Document Uploaded</option>
              <option value="Document Downloaded">Document Downloaded</option>
              <option value="Document Updated">Document Updated</option>
              <option value="Document Deleted">Document Deleted</option>
              <option value="Document Viewed">Document Viewed</option>
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

      {/* History Table */}
      <div className="tv-card overflow-hidden">
        <div className="table-responsive">
          <table className="tv-table">
            <thead>
              <tr>
                <th>Activity</th>
                <th>Document Name</th>
                <th>Category</th>
                <th>Date and Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivities.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">
                    No activity logs match your filters.
                  </td>
                </tr>
              ) : (
                filteredActivities.map((act) => (
                  <tr key={act.id}>
                    <td>{getActivityBadge(act.type)}</td>
                    <td>
                      <span className="fw-bold text-dark small">{act.documentName}</span>
                    </td>
                    <td>
                      <span className="badge-category small">
                        {act.category || 'General'}
                      </span>
                    </td>
                    <td className="small text-muted font-monospace">{act.timestamp}</td>
                    <td>
                      <span
                        className={`badge ${
                          act.status === 'Success'
                            ? 'bg-success-subtle text-success border border-success-subtle'
                            : act.status === 'Warning'
                            ? 'bg-warning-subtle text-warning border border-warning-subtle'
                            : 'bg-info-subtle text-info border border-info-subtle'
                        } small`}
                      >
                        {act.status}
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

export default DocumentHistory;
