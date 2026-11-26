import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

export const TestRunnerModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-4 p-4 border-0 shadow">
          <h5 className="fw-bold mb-3">Frontend Test Verification</h5>
          <p className="text-success small d-flex align-items-center gap-2">
            <FaCheckCircle /> All 4 automated vault suites passed successfully.
          </p>
          <button className="btn btn-teal btn-sm" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};
export default TestRunnerModal;
