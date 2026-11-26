import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  FaSearch,
  FaFilter,
  FaThLarge,
  FaList,
  FaEye,
  FaDownload,
  FaEdit,
  FaTrash,
  FaCloudUploadAlt,
  FaFilePdf,
  FaFileImage,
  FaFileAlt,
  FaCalendarAlt,
  FaIdCard,
  FaPlus,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle
} from 'react-icons/fa';
import DocumentModal from '../../components/common/DocumentModal';
import ConfirmModal from '../../components/common/ConfirmModal';
import { useApp } from '../../context/AppContext';

const MyDocuments = () => {
  const { documents, categories, deleteDocument, showToast, logActivity } = useApp();
  const location = useLocation();

  // Parse category filter from query params if passed e.g. from Categories page
  const queryParams = new URLSearchParams(location.search);
  const initialCategoryFilter = queryParams.get('category') || 'All';

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(initialCategoryFilter);
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Modals state
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [modalMode, setModalMode] = useState('view');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteDocId, setDeleteDocId] = useState(null);

  // Filter & Search Logic
  const filteredDocs = documents
    .filter((doc) => {
      const matchesSearch =
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.documentNumber && doc.documentNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (doc.category && doc.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory =
        categoryFilter === 'All' || doc.category === categoryFilter;

      const matchesStatus =
        statusFilter === 'All' || doc.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.uploadDate) - new Date(a.uploadDate);
      if (sortBy === 'oldest') return new Date(a.uploadDate) - new Date(b.uploadDate);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'expiry') {
        if (!a.expiryDate) return 1;
        if (!b.expiryDate) return -1;
        return new Date(a.expiryDate) - new Date(b.expiryDate);
      }
      return 0;
    });

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
    showToast(`Downloading verified file: ${doc.name}`, 'success');

    const element = window.document.createElement('a');
    const file = new Blob([`TrustVault Demo Document\nName: ${doc.name}\nCategory: ${doc.category}\nNumber: ${doc.documentNumber || 'N/A'}\nStatus: ${doc.status}\nValid: ${doc.expiryDate || 'No Expiry'}`], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${doc.name.replace(/\s+/g, '_')}_document.txt`;
    window.document.body.appendChild(element);
    element.click();
    window.document.body.removeChild(element);
  };

  const getStatusBadge = (status) => {
    if (status === 'Active') return <span className="badge-active"><FaCheckCircle /> Active</span>;
    if (status === 'Expiring Soon') return <span className="badge-expiring"><FaExclamationTriangle /> Expiring Soon</span>;
    return <span className="badge-expired"><FaTimesCircle /> Expired</span>;
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header Bar */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div>
          <h3 className="fw-bold text-dark mb-1">My Documents Repository</h3>
          <p className="text-muted small mb-0 d-flex align-items-center gap-2">
            <span>Client-side encrypted & organized personal records ({filteredDocs.length} displayed)</span>
            <span className="badge bg-success-subtle text-success border border-success-subtle small py-1 px-2">AES-256 GCM</span>
          <h3 className="fw-bold text-dark mb-1">My Documents Repository & Vault</h3>
          <p className="text-muted small mb-0">
            Securely stored, organized, and categorized personal records ({filteredDocs.length} displayed)
          </p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <Link to="/user/upload" className="btn btn-emerald d-flex align-items-center gap-2 shadow-sm">
            <FaPlus /> Upload Document
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar Controls */}
      <div className="tv-card p-3">
        <div className="row g-3 align-items-center">
          {/* Search Input */}
          <div className="col-lg-4 col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-light text-muted border-end-0">
                <FaSearch />
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search documents by name, number, keywords..." aria-label="Search documents"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="col-lg-3 col-md-6">
            <select
              className="form-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter by category"
            >
              <option value="All">All Categories ({categories.length})</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Expiry Status Filter */}
          <div className="col-lg-2 col-sm-6">
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by expiry status"
            >
              <option value="All">All Expiry Statuses</option>
              <option value="Active">Active</option>
              <option value="Expiring Soon">Expiring Soon</option>
              <option value="Expired">Expired</option>
            </select>
          </div>

          {/* Sorting */}
          <div className="col-lg-2 col-sm-6">
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort documents"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="name">Sort: Name (A-Z)</option>
              <option value="expiry">Sort: Expiry Date</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="col-lg-1 d-flex justify-content-end">
            <div className="btn-group">
              <button
                className={`btn btn-sm ${viewMode === 'grid' ? 'btn-teal' : 'btn-light border'}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <FaThLarge />
              </button>
              <button
                className={`btn btn-sm ${viewMode === 'table' ? 'btn-teal' : 'btn-light border'}`}
                onClick={() => setViewMode('table')}
                title="Table View"
              >
                <FaList />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Document Content View */}
      {filteredDocs.length === 0 ? (
        <div className="tv-card p-5 text-center my-4">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
            style={{ width: 70, height: 70, backgroundColor: '#f0fdf9', color: '#0f766e', fontSize: '2rem' }}
          >
            <FaFolderOpen />
          </div>
          <h5 className="fw-bold text-dark">No Documents Found</h5>
          <p className="text-muted small mb-4">
            No documents matched your current search filters. Try clearing filters or upload a new record.
          </p>
          <div className="d-flex justify-content-center gap-2">
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('All');
                setStatusFilter('All');
              }}
            >
              Reset All Active Filters
            </button>
            <Link to="/user/upload" className="btn btn-emerald btn-sm">
              Upload Document
            </Link>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW OF ATTRACTIVE DOCUMENT CARDS */
        <div className="row g-4">
          {filteredDocs.map((doc) => (
            <div key={doc.id} className="col-xl-4 col-md-6">
              <div className="doc-card h-100 shadow-sm">
                <div>
                  {/* Card Top: Icon & Status */}
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div
                      className="rounded-3 d-flex align-items-center justify-content-center text-white"
                      style={{
                        width: 46,
                        height: 46,
                        backgroundColor: '#0f766e'
                      }}
                    >
                      {doc.fileType === 'PDF' ? <FaFilePdf size={22} /> : <FaFileImage size={22} />}
                    </div>
                    {getStatusBadge(doc.status)}
                  </div>

                  {/* Category & Title */}
                  <span className="badge-category mb-2">
                    {doc.category}
                  </span>
                  <h5 className="fw-bold text-dark mb-1 text-truncate" title={doc.name}>
                    {doc.name}
                  </h5>
                  <p className="text-muted small text-truncate-2 mb-3" style={{ minHeight: '2.5rem' }}>
                    {doc.description || 'Verified personal identity record.'}
                  </p>

                  {/* Meta details badge */}
                  <div className="bg-light rounded-3 p-3 mb-3 border small">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-muted">Doc ID / No:</span>
                      <strong className="text-dark font-monospace">{doc.documentNumber || 'N/A'}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-muted">Uploaded:</span>
                      <span className="text-secondary">{doc.uploadDate}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Expiry Date:</span>
                      <span className={`fw-bold ${doc.status === 'Expired' ? 'text-danger' : doc.status === 'Expiring Soon' ? 'text-warning' : 'text-success'}`}>
                        {doc.expiryDate || 'Lifetime / No Expiry'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-top d-flex align-items-center justify-content-between">
                  <span className="badge-category small py-1 px-2">
                    {doc.fileSize} &bull; {doc.fileType}
                  </span>
                  <div className="btn-group btn-group-sm">
                    <button
                      className="btn btn-outline-secondary"
                      title="View Details"
                      onClick={() => handleOpenView(doc)}
                    >
                      <FaEye className="text-teal" /> View
                    </button>
                    <button
                      className="btn btn-outline-secondary"
                      title="Download Demo File"
                      onClick={() => handleDownload(doc)}
                    >
                      <FaDownload />
                    </button>
                    <button
                      className="btn btn-outline-secondary"
                      title="Edit Document"
                      onClick={() => handleOpenEdit(doc)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn btn-outline-danger"
                      title="Delete Document"
                      onClick={() => setDeleteDocId(doc.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE VIEW OF DOCUMENTS */
        <div className="tv-card overflow-hidden">
          <div className="table-responsive">
            <table className="tv-table">
              <thead>
                <tr>
                  <th>Document</th>
                  <th>Category</th>
                  <th>Document No</th>
                  <th>Upload Date</th>
                  <th>Expiry Date</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocs.map((doc) => (
                  <tr key={doc.id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge-category p-2 rounded-2 fw-bold">
                          {doc.fileType}
                        </span>
                        <div>
                          <div className="fw-bold text-dark">{doc.name}</div>
                          <small className="text-muted">{doc.fileSize}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge-category">
                        {doc.category}
                      </span>
                    </td>
                    <td>
                      <code className="text-dark small font-monospace">
                        {doc.documentNumber || '-'}
                      </code>
                    </td>
                    <td className="small text-muted">{doc.uploadDate}</td>
                    <td>
                      <span className={`small fw-bold ${doc.status === 'Expired' ? 'text-danger' : doc.status === 'Expiring Soon' ? 'text-warning' : 'text-success'}`}>
                        {doc.expiryDate || 'Lifetime'}
                      </span>
                    </td>
                    <td>{getStatusBadge(doc.status)}</td>
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
                        <button
                          className="btn btn-light border"
                          title="Delete"
                          onClick={() => setDeleteDocId(doc.id)}
                        >
                          <FaTrash className="text-danger" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteDocId}
        onClose={() => setDeleteDocId(null)}
        onConfirm={() => {
          if (deleteDocId) deleteDocument(deleteDocId);
        }}
        title="Delete Document"
        message="Are you sure you want to delete this document from your vault? This change cannot be reverted."
      />
    </div>
  );
};

export default MyDocuments;
