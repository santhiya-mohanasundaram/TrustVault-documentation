import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaFileAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaCloudUploadAlt,
  FaFolder,
  FaCalendarAlt,
  FaHistory,
  FaArrowRight,
  FaEye,
  FaDownload,
  FaEdit,
  FaTrash
} from 'react-icons/fa';
import StatCard from '../../components/common/StatCard';
import { StatusDonutChart, CategoryDistributionChart } from '../../components/common/Charts';
import DocumentModal from '../../components/common/DocumentModal';
import ConfirmModal from '../../components/common/ConfirmModal';
import { useApp } from '../../context/AppContext';

const UserDashboard = () => {
  const { documents, categories, activities, currentUser, deleteDocument, showToast, logActivity } = useApp();

  const [selectedDoc, setSelectedDoc] = useState(null);
  const [modalMode, setModalMode] = useState('view');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteDocId, setDeleteDocId] = useState(null);

  // Statistics calculation
  const totalDocs = documents.length;
  const activeDocs = documents.filter((d) => d.status === 'Active').length;
  const expiringDocs = documents.filter((d) => d.status === 'Expiring Soon').length;
  const expiredDocs = documents.filter((d) => d.status === 'Expired').length;

  const handleOpenView = (doc) => {
    setSelectedDoc(doc);
    setModalMode('view');
    setIsModalOpen(true);
    logActivity('Document Viewed', doc.name, doc.category, 'Success');
  };

  const handleOpenEdit = (doc) => {
    setSelectedDoc(doc);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDownload = (doc) => {
    logActivity('Document Downloaded', doc.name, doc.category, 'Success');
    showToast(`Downloading demo document: ${doc.name}`, 'success');
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Welcome Banner */}
      <div
        className="rounded-4 p-4 p-md-5 text-white position-relative overflow-hidden shadow-sm"
        style={{
          background: 'linear-gradient(135deg, #0f766e 0%, #044e47 100%)'
        }}
      >
        <div className="row align-items-center position-relative" style={{ zIndex: 1 }}>
          <div className="col-md-8">
            <span className="badge bg-emerald px-3 py-1 rounded-pill fw-bold text-uppercase small mb-2">
              Identity & Certificate Vault
            </span>
            <h2 className="fw-bold mb-2">
              Welcome back, {currentUser?.name || 'User'}!
            </h2>
            <p className="mb-0 text-white-50 fs-6 pe-md-4">
              Your personal vault is active. You have <strong className="text-white">{expiringDocs} documents expiring soon</strong> and <strong className="text-white">{expiredDocs} expired documents</strong> requiring attention.
            </p>
          </div>
          <div className="col-md-4 text-md-end mt-3 mt-md-0">
            <Link to="/user/upload" className="btn btn-emerald btn-lg px-4 shadow">
              <FaCloudUploadAlt className="me-2" /> Upload New File
            </Link>
          </div>
        </div>
      </div>

      {/* Storage Usage Bar */}
      <div className="tv-card p-3 d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-teal-subtle text-teal fw-bold">Cloud Vault Storage</span>
          <span className="small text-muted">{documents.length * 1.8} MB of 500 MB used</span>
        </div>
        <div className="progress flex-grow-1 mx-3" style={{ height: 8, minWidth: 150 }}>
          <div className="progress-bar bg-teal" style={{ width: `${Math.min(documents.length * 3 + 4, 100)}%` }}></div>
        </div>
        <span className="small text-secondary fw-bold">99% Free</span>
      </div>

      {/* Dashboard Overview Cards */}
      <div className="row g-3">
        <div className="col-xl-3 col-sm-6">
          <StatCard
            title="Total Documents"
            value={totalDocs}
            icon={<FaFileAlt />}
            color="#0f766e"
            bgColor="#ccfbf1"
            subtitle="Across all categories"
          />
        </div>
        <div className="col-xl-3 col-sm-6">
          <StatCard
            title="Active Documents"
            value={activeDocs}
            icon={<FaCheckCircle />}
            color="#16a34a"
            bgColor="#dcfce7"
            subtitle="Valid and up-to-date"
          />
        </div>
        <div className="col-xl-3 col-sm-6">
          <StatCard
            title="Expiring Soon"
            value={expiringDocs}
            icon={<FaExclamationTriangle />}
            color="#d97706"
            bgColor="#fef3c7"
            subtitle="Action required in <30 days"
          />
        </div>
        <div className="col-xl-3 col-sm-6">
          <StatCard
            title="Expired Documents"
            value={expiredDocs}
            icon={<FaTimesCircle />}
            color="#dc2626"
            bgColor="#fee2e2"
            subtitle="Immediate renewal needed"
          />
        </div>
      </div>

      {/* Charts & Analytics Row */}
      <div className="row g-4">
        {/* Document Status Breakdown Donut */}
        <div className="col-lg-5">
          <div className="tv-card p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
              <div>
                <h6 className="fw-bold text-dark mb-0">Document Status Overview</h6>
                <small className="text-muted">Real-time health breakdown</small>
              </div>
              <Link to="/user/calendar" className="text-teal small fw-bold text-decoration-none">
                Calendar View &rarr;
              </Link>
            </div>
            <StatusDonutChart
              active={activeDocs}
              expiring={expiringDocs}
              expired={expiredDocs}
              size={180}
            />
          </div>
        </div>

        {/* Category Breakdown Progress */}
        <div className="col-lg-7">
          <div className="tv-card p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
              <div>
                <h6 className="fw-bold text-dark mb-0">Document Category Distribution</h6>
                <small className="text-muted">Breakdown across verified folders</small>
              </div>
              <Link to="/user/categories" className="text-teal small fw-bold text-decoration-none">
                All Categories &rarr;
              </Link>
            </div>
            <CategoryDistributionChart categories={categories} />
          </div>
        </div>
      </div>

      {/* Action Sections: Recently Uploaded & Upcoming Expiry */}
      <div className="row g-4">
        {/* Recently Uploaded Documents (Live) */}
        <div className="col-lg-8">
          <div className="tv-card p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
              <div className="d-flex align-items-center gap-2">
                <FaFileAlt className="text-teal" />
                <h6 className="fw-bold text-dark mb-0">Recently Uploaded Documents</h6>
              </div>
              <Link to="/user/documents" className="btn btn-sm btn-outline-teal">
                View All ({totalDocs})
              </Link>
            </div>

            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light">
                  <tr className="small text-muted text-uppercase">
                    <th>Document Name</th>
                    <th>Category</th>
                    <th>Uploaded</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.slice(0, 5).map((doc) => (
                    <tr key={doc.id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <span className="badge-category p-2 rounded-2 fw-bold">
                            {doc.fileType}
                          </span>
                          <div>
                            <div className="fw-bold text-dark small">{doc.name}</div>
                            <small className="text-muted">{doc.documentNumber || 'No ID'}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge-category small">
                          {doc.category}
                        </span>
                      </td>
                      <td className="small text-muted">{doc.uploadDate}</td>
                      <td>
                        {doc.status === 'Active' && <span className="badge-active small">Active</span>}
                        {doc.status === 'Expiring Soon' && <span className="badge-expiring small">Expiring</span>}
                        {doc.status === 'Expired' && <span className="badge-expired small">Expired</span>}
                      </td>
                      <td className="text-end">
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-light border"
                            title="View"
                            onClick={() => handleOpenView(doc)}
                          >
                            <FaEye className="text-teal" />
                          </button>
                          <button
                            className="btn btn-light border"
                            title="Download"
                            onClick={() => handleDownload(doc)}
                          >
                            <FaDownload className="text-muted" />
                          </button>
                          <button
                            className="btn btn-light border"
                            title="Edit"
                            onClick={() => handleOpenEdit(doc)}
                          >
                            <FaEdit className="text-muted" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Upcoming Expiry Documents & Alerts */}
        <div className="col-lg-4">
          <div className="tv-card p-4 h-100 d-flex flex-column">
            <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
              <div className="d-flex align-items-center gap-2">
                <FaCalendarAlt className="text-warning" />
                <h6 className="fw-bold text-dark mb-0">Upcoming Expiries</h6>
              </div>
              <Link to="/user/calendar" className="small text-teal fw-bold text-decoration-none">
                Calendar
              </Link>
            </div>

            <div className="d-flex flex-column gap-3 flex-grow-1">
              {documents
                .filter((d) => d.status === 'Expiring Soon' || d.status === 'Expired')
                .slice(0, 3)
                .map((doc) => (
                  <div
                    key={doc.id}
                    className={`p-3 rounded-3 border ${
                      doc.status === 'Expired' ? 'bg-danger-subtle border-danger' : 'bg-warning-subtle border-warning'
                    }`}
                  >
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <span className="fw-bold small text-dark text-truncate" style={{ maxWidth: 170 }}>
                        {doc.name}
                      </span>
                      <span className={`badge ${doc.status === 'Expired' ? 'bg-danger text-white' : 'bg-warning text-dark'} small`}>
                        {doc.status}
                      </span>
                    </div>
                    <div className="text-muted small mb-2">
                      Expiry: <strong>{doc.expiryDate}</strong>
                    </div>
                    <button
                      className="btn btn-sm btn-white bg-white border w-100 text-teal fw-semibold"
                      onClick={() => handleOpenView(doc)}
                    >
                      Inspect Document
                    </button>
                  </div>
                ))}

              {documents.filter((d) => d.status === 'Expiring Soon' || d.status === 'Expired').length === 0 && (
                <div className="text-center py-4 text-muted small">
                  <FaCheckCircle className="text-emerald fs-3 mb-2 d-block mx-auto" />
                  All your documents are currently up-to-date!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Audit Table */}
      <div className="tv-card p-4">
        <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
          <div className="d-flex align-items-center gap-2">
            <FaHistory className="text-teal" />
            <h6 className="fw-bold text-dark mb-0">Recent Activities</h6>
          </div>
          <Link to="/user/history" className="text-teal small fw-bold text-decoration-none">
            Full Audit Log &rarr;
          </Link>
        </div>

        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="table-light">
              <tr className="small text-muted text-uppercase">
                <th>Activity Type</th>
                <th>Document Name</th>
                <th>Category</th>
                <th>Timestamp</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {activities.slice(0, 5).map((act) => (
                <tr key={act.id}>
                  <td>
                    <span className="fw-semibold text-dark small">{act.type}</span>
                  </td>
                  <td className="small text-secondary">{act.documentName}</td>
                  <td>
                    <span className="badge bg-light text-muted border small">{act.category}</span>
                  </td>
                  <td className="small text-muted">{act.timestamp}</td>
                  <td>
                    <span className="badge bg-success-subtle text-success border border-success-subtle small">
                      {act.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document View & Edit Modal */}
      <DocumentModal
        document={selectedDoc}
        isOpen={isModalOpen}
        mode={modalMode}
        onClose={() => setIsModalOpen(false)}
        onSwitchToEdit={(doc) => {
          setSelectedDoc(doc);
          setModalMode('edit');
        }}
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={!!deleteDocId}
        onClose={() => setDeleteDocId(null)}
        onConfirm={() => {
          if (deleteDocId) deleteDocument(deleteDocId);
        }}
        title="Delete Document"
        message="Are you sure you want to remove this document from your secure vault? This will be permanently logged."
      />
    </div>
  );
};

export default UserDashboard;
