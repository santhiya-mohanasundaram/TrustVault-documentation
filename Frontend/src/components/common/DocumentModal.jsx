import React, { useState, useEffect } from 'react';
import {
  FaTimes,
  FaFilePdf,
  FaFileImage,
  FaFileAlt,
  FaDownload,
  FaEdit,
  FaTrash,
  FaCalendarAlt,
  FaIdCard,
  FaCheckCircle,
  FaExclamationTriangle,
  FaLock
} from 'react-icons/fa';
import { useApp } from '../../context/AppContext';

const DocumentModal = ({ document, isOpen, onClose, mode = 'view', onSwitchToEdit }) => {
  const { updateDocument, categories, showToast, logActivity } = useApp();
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    documentNumber: '',
    issueDate: '',
    expiryDate: '',
    status: 'Active',
    description: ''
  });

  useEffect(() => {
    if (document) {
      setFormData({
        name: document.name || '',
        category: document.category || 'Other Documents',
        documentNumber: document.documentNumber || '',
        issueDate: document.issueDate || '',
        expiryDate: document.expiryDate || '',
        status: document.status || 'Active',
        description: document.description || ''
      });
    }
  }, [document]);

  if (!isOpen || !document) return null;

  const handleDownload = () => {
    logActivity('Document Downloaded', document.name, document.category, 'Success');
    showToast(`Downloading "${document.name}" (Demo file verified)`, 'success');
    // Simulated trigger
    const element = window.document.createElement('a');
    const file = new Blob([`TrustVault Demo Document\nName: ${document.name}\nCategory: ${document.category}\nDocument No: ${document.documentNumber || 'N/A'}\nStatus: ${document.status}`], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${document.name.replace(/\s+/g, '_')}_verified.txt`;
    window.document.body.appendChild(element);
    element.click();
    window.document.body.removeChild(element);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Document name cannot be empty', 'warning');
      return;
    }
    updateDocument(document.id, formData);
    onClose();
  };

  const getStatusBadge = (status) => {
    if (status === 'Active') return <span className="badge-active"><FaCheckCircle /> Active</span>;
    if (status === 'Expiring Soon') return <span className="badge-expiring"><FaExclamationTriangle /> Expiring Soon</span>;
    return <span className="badge-expired"><FaTimes /> Expired</span>;
  };

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 1050 }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          {/* Header */}
          <div className="modal-header bg-light border-bottom px-4 py-3">
            <div className="d-flex align-items-center gap-2">
              <div
                className="d-flex align-items-center justify-content-center rounded-3 text-white"
                style={{
                  width: 36,
                  height: 36,
                  backgroundColor: '#0f766e'
                }}
              >
                {document.fileType === 'PDF' ? <FaFilePdf size={18} /> : <FaFileImage size={18} />}
              </div>
              <div>
                <h5 className="modal-title fw-bold text-dark mb-0" title="Click to view details">
                  {mode === 'edit' ? 'Edit Document Details' : document.name}
                </h5>
                <small className="text-muted">ID: {document.id} &bull; Type: {document.fileType || 'PDF'}</small>
              </div>
            </div>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          {/* Modal Body */}
          <div className="modal-body p-4">
            {mode === 'view' ? (
              <div>
                {/* Simulated Document Preview Card */}
                <div
                  className="rounded-3 p-4 mb-4 border"
                  style={{
                    background: 'linear-gradient(135deg, #f0fdf9 0%, #e6fffa 100%)',
                    borderColor: '#99f6e4'
                  }}
                >
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <span className="badge bg-teal text-white mb-2 px-3 py-1 rounded-pill">
                        {document.category}
                      </span>
                      <h4 className="fw-bold text-dark mb-1">{document.name}</h4>
                      <p className="text-muted small mb-0">{document.description || 'No description provided.'}</p>
                    </div>
                    <div>{getStatusBadge(document.status)}</div>
                  </div>

                  {/* Document Identification preview */}
                  <div className="bg-white rounded-3 p-3 border shadow-sm mt-3">
                    <div className="row g-3">
                      <div className="col-sm-6">
                        <span className="text-muted small d-block">Document Number</span>
                        <strong className="fs-6 text-dark font-monospace">
                          {document.documentNumber || 'NOT SPECIFIED'}
                        </strong>
                      </div>
                      <div className="col-sm-6">
                        <span className="text-muted small d-block">File Size & Format</span>
                        <span className="badge bg-light text-dark border px-2 py-1">
                          {document.fileSize || '1.2 MB'} &bull; {document.fileType || 'PDF'}
                        </span>
                      </div>
                      <div className="col-sm-6">
                        <span className="text-muted small d-block">Issue Date</span>
                        <span className="fw-semibold text-secondary">
                          {document.issueDate || 'N/A'}
                        </span>
                      </div>
                      <div className="col-sm-6">
                        <span className="text-muted small d-block">Expiry Date</span>
                        <span className={`fw-bold ${document.status === 'Expired' ? 'text-danger' : document.status === 'Expiring Soon' ? 'text-warning' : 'text-success'}`}>
                          {document.expiryDate || 'Lifetime / No Expiry'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center justify-content-between mt-3 text-muted small">
                    <span>
                      <FaCalendarAlt className="me-1" /> Uploaded on: {document.uploadDate}
                    </span>
                    <span className="d-flex align-items-center gap-1 text-teal fw-semibold">
                      <FaLock size={12} /> Encrypted & Verified QR Seal
                    </span>
                  </div>
                </div>

                {/* Additional Metadata */}
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="border rounded-3 p-3 bg-light">
                      <span className="text-muted small fw-bold text-uppercase d-block mb-1">
                        Security Hash Token
                      </span>
                      <code className="small text-truncate d-block">
                        tv-sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
                      </code>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="border rounded-3 p-3 bg-light">
                      <span className="text-muted small fw-bold text-uppercase d-block mb-1">
                        Last Modified
                      </span>
                      <span className="text-dark small fw-semibold">
                        {document.lastModified || document.uploadDate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Edit Mode Form */
              <form onSubmit={handleSaveEdit}>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label fw-bold small text-muted">DOCUMENT NAME *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted">CATEGORY *</label>
                    <select
                      className="form-select"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted">DOCUMENT NUMBER</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.documentNumber}
                      onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                      placeholder="e.g. XXXX-XXXX-4921"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted">ISSUE DATE</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.issueDate}
                      onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted">EXPIRY DATE</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted">STATUS</label>
                    <select
                      className="form-select"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="Active">Active</option>
                      <option value="Expiring Soon">Expiring Soon</option>
                      <option value="Expired">Expired</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold small text-muted">DESCRIPTION / NOTES</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Add brief notes regarding this document..."
                    ></textarea>
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                  <button type="button" className="btn btn-light" onClick={onClose}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-emerald">
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Footer for View Mode */}
          {mode === 'view' && (
            <div className="modal-footer bg-light px-4 py-3 d-flex justify-content-between">
              <div>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => onSwitchToEdit(document)}
                >
                  <FaEdit className="me-1" /> Edit Details
                </button>
              </div>
              <div className="d-flex gap-2">
                <button type="button" className="btn btn-light" onClick={onClose}>
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-emerald d-flex align-items-center gap-2"
                  onClick={handleDownload}
                >
                  <FaDownload /> Download File
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentModal;
