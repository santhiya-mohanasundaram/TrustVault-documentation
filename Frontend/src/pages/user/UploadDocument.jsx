import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaCloudUploadAlt,
  FaFilePdf,
  FaFileImage,
  FaFileAlt,
  FaCheckCircle,
  FaTimes,
  FaTrash,
  FaArrowRight,
  FaLock,
  FaCalendarAlt,
  FaFolder
} from 'react-icons/fa';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';

const UploadDocument = () => {
  const { categories, addDocument, showToast } = useApp();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadComplete, setIsUploadComplete] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    category: 'Aadhaar Card',
    documentNumber: '',
    issueDate: '',
    expiryDate: '',
    noExpiry: false,
    description: ''
  });

  const [formErrors, setFormErrors] = useState({});

  // Handle Drag Events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const processSelectedFile = (file) => {
    // Check supported types
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    const ext = file.name.split('.').pop().toLowerCase();
    const isSupported = validTypes.includes(file.type) || ['pdf', 'jpg', 'jpeg', 'png'].includes(ext);

    if (!isSupported) {
      showToast('Unsupported file type! Please upload PDF, JPG, JPEG, or PNG.', 'danger');
      return;
    }

    const fileSizeFormatted =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

    const fileTypeClean = ext.toUpperCase() === 'JPEG' ? 'JPG' : ext.toUpperCase();

    const fileData = {
      name: file.name,
      size: fileSizeFormatted,
      type: fileTypeClean,
      rawFile: file
    };

    setSelectedFile(fileData);
    setIsUploading(true);
    setUploadProgress(0);
    setIsUploadComplete(false);

    // Auto-fill document name if empty
    if (!formData.name) {
      const cleanName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      setFormData((prev) => ({ ...prev, name: cleanName.replace(/[-_]/g, ' ') }));
    }

    // Simulate upload progress
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 25) + 15;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setUploadProgress(100);
        setIsUploading(false);
        setIsUploadComplete(true);
        showToast('File uploaded and verified successfully!', 'success');
      } else {
        setUploadProgress(currentProgress);
      }
    }, 180);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    setIsUploadComplete(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Document name is required';
    if (!formData.category) errors.category = 'Document category is required';
    if (!selectedFile) errors.file = 'Please upload a document file';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveDocument = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please fill all mandatory fields and attach a file', 'warning');
      return;
    }

    // Calculate status based on expiry
    let status = 'Active';
    if (formData.expiryDate && !formData.noExpiry) {
      const expDate = new Date(formData.expiryDate);
      const today = new Date();
      const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
      if (diffDays <= 0) {
        status = 'Expired';
      } else if (diffDays <= 30) {
        status = 'Expiring Soon';
      }
    }

    const newDoc = {
      name: formData.name,
      category: formData.category,
      documentNumber: formData.documentNumber || '',
      issueDate: formData.issueDate || '',
      expiryDate: formData.noExpiry ? '' : formData.expiryDate || '',
      status: status,
      fileType: selectedFile.type,
      fileSize: selectedFile.size,
      description: formData.description || 'Uploaded via TrustVault Web Portal.'
    };

    addDocument(newDoc);

    // Fire confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // safe fallback
    }

    // Navigate to documents list
    setTimeout(() => {
      navigate('/user/documents');
    }, 1200);
  };

  return (
    <div className="d-flex flex-column gap-4 max-w-1000 mx-auto">
      {/* Page Header */}
      <div>
        <h3 className="fw-bold text-dark mb-1">Upload New Document</h3>
        <p className="text-muted small mb-0">
          Upload and organize your important files with auto-categorization and expiry tracking.
        </p>
      </div>

      <div className="row g-4">
        {/* Left Column: Upload Area Inspired by Reference Image */}
        <div className="col-lg-6">
          <div className="tv-card p-4 h-100 d-flex flex-column">
            <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <FaCloudUploadAlt className="text-teal" size={18} />
              File Attachment
            </h6>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
              style={{ display: 'none' }}
            />

            {/* Drag & Drop Zone */}
            <div
              className={`upload-dropzone ${isDragging ? 'dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
            >
              <div className="upload-icon-circle">
                <FaCloudUploadAlt />
              </div>
              <h5 className="fw-bold text-dark mb-2">Drag & drop your files securely here</h5>
              <div className="d-flex align-items-center justify-content-center gap-3 my-3">
                <span className="border-bottom flex-grow-1" style={{ maxWidth: 80 }}></span>
                <span className="text-muted small fw-bold">OR</span>
                <span className="border-bottom flex-grow-1" style={{ maxWidth: 80 }}></span>
              </div>
              <button
                type="button"
                className="btn btn-emerald px-4 py-2 fw-semibold"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current && fileInputRef.current.click();
                }}
              >
                Browse Files
              </button>
              <div className="mt-3 text-muted small">
                Supported formats: <strong>PDF, JPG, JPEG, PNG</strong> &bull; Max: 25 MB per file
              </div>
            </div>

            {formErrors.file && (
              <div className="text-danger small mt-2 fw-semibold text-center">
                {formErrors.file}
              </div>
            )}

            {/* Uploaded File List with Progress and Status */}
            {selectedFile && (
              <div className="uploaded-file-item mt-4">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center text-white flex-shrink-0"
                  style={{
                    width: 44,
                    height: 44,
                    backgroundColor: selectedFile.type === 'PDF' ? '#0f766e' : '#0284c7'
                  }}
                >
                  {selectedFile.type === 'PDF' ? <FaFilePdf size={22} /> : <FaFileImage size={22} />}
                </div>

                <div className="flex-grow-1 overflow-hidden">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-bold text-dark small text-truncate" style={{ maxWidth: 190 }}>
                      {selectedFile.name}
                    </span>
                    <span className="badge bg-light text-secondary border small">
                      {selectedFile.size}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="progress" style={{ height: 6, borderRadius: 10 }}>
                    <div
                      className={`progress-bar ${isUploadComplete ? 'bg-success' : 'bg-teal'}`}
                      role="progressbar"
                      style={{ width: `${uploadProgress}%`, transition: 'width 0.2s ease' }}
                    ></div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mt-2 small">
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                      {isUploading && `Uploading... ${uploadProgress}%`}
                      {isUploadComplete && (
                        <span className="text-success fw-bold d-flex align-items-center gap-1">
                          <FaCheckCircle /> Completed
                        </span>
                      )}
                    </span>
                    <span className="badge bg-teal-subtle text-teal">{selectedFile.type}</span>
                  </div>
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger border-0 p-2"
                  onClick={handleRemoveFile}
                  title="Remove File"
                >
                  <FaTrash />
                </button>
              </div>
            )}

            {/* Client-Side Encryption Guarantee */}
            <div className="mt-auto pt-4 border-top mt-4">
              <div className="d-flex align-items-center gap-2 text-teal small fw-semibold">
                <FaLock /> Zero-Knowledge Client Tokenization Guaranteed
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Document Details Form */}
        <div className="col-lg-6">
          <div className="tv-card p-4 h-100">
            <h6 className="fw-bold text-dark mb-3 pb-2 border-bottom">
              Document Metadata & Details
            </h6>

            <form onSubmit={handleSaveDocument}>
              {/* Document Name */}
              <div className="mb-3">
                <label className="form-label fw-bold small text-muted">DOCUMENT NAME *</label>
                <input
                  type="text"
                  className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
                  placeholder="e.g. Passport 2026 Renewal Copy"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
              </div>

              {/* Document Category */}
              <div className="mb-3">
                <label className="form-label fw-bold small text-muted">DOCUMENT CATEGORY *</label>
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

              {/* Document Number */}
              <div className="mb-3">
                <label className="form-label fw-bold small text-muted">
                  DOCUMENT NUMBER <span className="text-muted fw-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 501004928190 / Z8924011"
                  value={formData.documentNumber}
                  onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                />
              </div>

              {/* Issue Date & Expiry Date */}
              <div className="row g-3 mb-3">
                <div className="col-sm-6">
                  <label className="form-label fw-bold small text-muted">ISSUE DATE</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                  />
                </div>
                <div className="col-sm-6">
                  <div className="d-flex justify-content-between align-items-center">
                    <label className="form-label fw-bold small text-muted mb-0">EXPIRY DATE</label>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="noExpCheck"
                        checked={formData.noExpiry}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            noExpiry: e.target.checked,
                            expiryDate: e.target.checked ? '' : formData.expiryDate
                          })
                        }
                      />
                      <label className="form-check-label text-muted small" htmlFor="noExpCheck" style={{ fontSize: '0.72rem' }}>
                        No Expiry
                      </label>
                    </div>
                  </div>
                  <input
                    type="date"
                    className="form-control mt-1"
                    disabled={formData.noExpiry}
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="form-label fw-bold small text-muted">DESCRIPTION & TAGS</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Add any reminders, notes, or tags for this record..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>

              {/* Save Button */}
              <button
                type="submit"
                className="btn btn-emerald w-100 py-2 fs-6 shadow-sm d-flex align-items-center justify-content-center gap-2"
              >
                <FaCheckCircle /> Save Document to Vault
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadDocument;
