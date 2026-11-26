import React from 'react';
import { FaShieldAlt, FaLock } from 'react-icons/fa';

export const SecurityBadge = ({ text = '256-Bit Encrypted' }) => (
  <span className="badge bg-teal-subtle text-teal border border-teal-subtle d-inline-flex align-items-center gap-1 px-2 py-1 small rounded-pill">
    <FaLock size={11} /> {text}
  </span>
);
export default SecurityBadge;
