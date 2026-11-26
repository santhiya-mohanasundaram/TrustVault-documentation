import React from 'react';
import { FaExclamationTriangle, FaTrash } from 'react-icons/fa';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', confirmVariant = 'danger' }) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 1060 }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered modal-sm">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="modal-body p-4 text-center">
            <div
              className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 bg-${confirmVariant}-subtle text-${confirmVariant}`}
              style={{ width: 60, height: 60, fontSize: '1.75rem' }}
            >
              <FaExclamationTriangle />
            </div>
            <h5 className="fw-bold text-dark mb-2">{title || 'Are you sure?'}</h5>
            <p className="text-muted small mb-4">{message || 'This action cannot be undone.'}</p>
            <div className="d-flex justify-content-center gap-2">
              <button type="button" className="btn btn-light px-3" onClick={onClose}>
                Cancel
              </button>
              <button
                type="button"
                className={`btn btn-${confirmVariant} px-3`}
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
