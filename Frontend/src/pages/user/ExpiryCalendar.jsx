import React, { useState } from 'react';
import {
  FaChevronLeft,
  FaChevronRight,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaTimesCircle,
  FaCheckCircle,
  FaEye,
  FaCalendarDay
} from 'react-icons/fa';
import DocumentModal from '../../components/common/DocumentModal';
import { useApp } from '../../context/AppContext';

const ExpiryCalendar = () => {
  const { documents } = useApp();
  
  // Default to November 2026 (matching system date context)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 10, 1)); // Nov 2026
  const [selectedDayDocs, setSelectedDayDocs] = useState([]);
  const [selectedDateLabel, setSelectedDateLabel] = useState(null);

  // Document modal
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDayDocs([]);
    setSelectedDateLabel(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDayDocs([]);
    setSelectedDateLabel(null);
  };

  const setToday = () => {
    setCurrentDate(new Date(2026, 10, 1));
    setSelectedDayDocs([]);
    setSelectedDateLabel(null);
  };

  // Calendar math
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Find documents expiring in current view month
  const getDocsForDate = (dayNum) => {
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(dayNum).padStart(2, '0');
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;

    return documents.filter((doc) => doc.expiryDate === dateStr);
  };

  // Helper for color coding
  const getDocStatusColor = (doc) => {
    if (doc.status === 'Expired') return '#ef4444'; // Red
    if (doc.status === 'Expiring Soon') return '#f97316'; // Orange
    return '#10b981'; // Green
  };

  // Upcoming and expired documents lists
  const upcomingDocs = documents
    .filter((d) => d.status === 'Expiring Soon' && d.expiryDate)
    .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));

  const expiredDocs = documents
    .filter((d) => d.status === 'Expired' && d.expiryDate)
    .sort((a, b) => new Date(b.expiryDate) - new Date(a.expiryDate));

  const handleDayClick = (dayNum) => {
    const docs = getDocsForDate(dayNum);
    const dateStr = `${dayNum} ${monthNames[month]} ${year}`;
    setSelectedDateLabel(dateStr);
    setSelectedDayDocs(docs);
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div>
          <h3 className="fw-bold text-dark mb-1">Document Expiry & Renewal Calendar</h3>
          <p className="text-muted small mb-0">
            Track certificate renewals, policy deadlines, and identity card expiration milestones.
          </p>
        </div>
        <div className="d-flex align-items-center gap-3">
          {/* Status Color Legend */}
          <div className="d-flex align-items-center gap-2 small">
            <span className="badge-active py-1 px-2" style={{ fontSize: '0.72rem' }}>
              Green: Active
            </span>
            <span className="badge-expiring py-1 px-2" style={{ fontSize: '0.72rem' }}>
              Orange: Expiring Soon
            </span>
            <span className="badge-expired py-1 px-2" style={{ fontSize: '0.72rem' }}>
              Red: Expired
            </span>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Main Monthly Calendar */}
        <div className="col-lg-8">
          <div className="tv-card p-4">
            {/* Calendar Controls */}
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div className="d-flex align-items-center gap-2">
                <h4 className="fw-bold text-dark mb-0">
                  {monthNames[month]} {year}
                </h4>
                <button onClick={setToday} className="btn btn-sm btn-outline-teal ms-2">
                  Today (Nov 2026)
                </button>
              </div>
              <div className="btn-group">
                <button onClick={prevMonth} className="btn btn-light border btn-sm" aria-label="Previous Month">
                  <FaChevronLeft />
                </button>
                <button onClick={nextMonth} className="btn btn-light border btn-sm" aria-label="Next Month">
                  <FaChevronRight />
                </button>
              </div>
            </div>

            {/* Days of week header */}
            <div className="calendar-grid mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="calendar-day-header">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid Cells */}
            <div className="calendar-grid">
              {/* Previous month padding days */}
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`prev-${i}`} className="calendar-cell other-month">
                  <span className="text-muted small">
                    {daysInPrevMonth - firstDayIndex + i + 1}
                  </span>
                </div>
              ))}

              {/* Current month days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const docsOnThisDay = getDocsForDate(dayNum);
                const isToday = month === 10 && year === 2026 && dayNum === 24;

                return (
                  <div
                    key={`curr-${dayNum}`}
                    className={`calendar-cell ${isToday ? 'today' : ''}`}
                    onClick={() => handleDayClick(dayNum)}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <span className={`small fw-bold ${isToday ? 'text-emerald' : 'text-dark'}`}>
                        {dayNum}
                      </span>
                      {isToday && (
                        <span className="badge bg-emerald text-white" style={{ fontSize: '0.6rem' }}>
                          TODAY
                        </span>
                      )}
                    </div>

                    {/* Expiry badges */}
                    <div className="d-flex flex-column gap-1 mt-1">
                      {docsOnThisDay.map((d) => (
                        <div
                          key={d.id}
                          className="text-truncate px-1 rounded"
                          style={{
                            fontSize: '0.65rem',
                            backgroundColor: getDocStatusColor(d),
                            color: '#ffffff',
                            fontWeight: 600
                          }}
                          title={`${d.name} (${d.status})`}
                        >
                          {d.name}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Date Expiry Details Drawer */}
          {selectedDateLabel && (
            <div className="tv-card p-3 mt-3 bg-light border-teal">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="fw-bold small text-teal">
                  <FaCalendarDay className="me-1" /> Events for {selectedDateLabel}
                </span>
                <button
                  className="btn btn-sm btn-link text-muted p-0 text-decoration-none"
                  onClick={() => setSelectedDateLabel(null)}
                >
                  Dismiss
                </button>
              </div>

              {selectedDayDocs.length === 0 ? (
                <p className="text-muted small mb-0">No document expiries recorded on this date.</p>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {selectedDayDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-2 rounded bg-white border d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <strong className="small text-dark">{doc.name}</strong>
                        <div className="text-muted small">{doc.category}</div>
                      </div>
                      <button
                        className="btn btn-sm btn-outline-teal"
                        onClick={() => {
                          setSelectedDoc(doc);
                          setIsModalOpen(true);
                        }}
                      >
                        Inspect
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Column: Upcoming and Expired Lists */}
        <div className="col-lg-4 d-flex flex-column gap-4">
          {/* Upcoming Expiry Documents */}
          <div className="tv-card p-4">
            <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
              <FaExclamationTriangle className="text-warning" />
              <h6 className="fw-bold text-dark mb-0">Upcoming Expiry Documents</h6>
            </div>

            {upcomingDocs.length === 0 ? (
              <p className="text-muted small mb-0">No documents expiring within the next 30 days.</p>
            ) : (
              <div className="d-flex flex-column gap-3">
                {upcomingDocs.map((doc) => (
                  <div key={doc.id} className="p-3 rounded-3 bg-warning-subtle border border-warning">
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <span className="fw-bold small text-dark text-truncate" style={{ maxWidth: 180 }}>
                        {doc.name}
                      </span>
                      <span className="badge bg-warning text-dark small">Expiring Soon</span>
                    </div>
                    <div className="text-muted small mb-2">
                      Deadline: <strong>{doc.expiryDate}</strong>
                    </div>
                    <button
                      className="btn btn-sm btn-white bg-white border w-100 text-teal fw-semibold"
                      onClick={() => {
                        setSelectedDoc(doc);
                        setIsModalOpen(true);
                      }}
                    >
                      <FaEye className="me-1" /> View Document Details
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Expired Documents */}
          <div className="tv-card p-4">
            <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
              <FaTimesCircle className="text-danger" />
              <h6 className="fw-bold text-dark mb-0">Expired Documents</h6>
            </div>

            {expiredDocs.length === 0 ? (
              <p className="text-muted small mb-0">No expired documents found in your vault.</p>
            ) : (
              <div className="d-flex flex-column gap-3">
                {expiredDocs.map((doc) => (
                  <div key={doc.id} className="p-3 rounded-3 bg-danger-subtle border border-danger">
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <span className="fw-bold small text-dark text-truncate" style={{ maxWidth: 180 }}>
                        {doc.name}
                      </span>
                      <span className="badge bg-danger text-white small">Expired</span>
                    </div>
                    <div className="text-muted small mb-2">
                      Expired on: <strong>{doc.expiryDate}</strong>
                    </div>
                    <button
                      className="btn btn-sm btn-white bg-white border w-100 text-danger fw-semibold"
                      onClick={() => {
                        setSelectedDoc(doc);
                        setIsModalOpen(true);
                      }}
                    >
                      <FaEye className="me-1" /> Inspect & Renew
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Document View Modal */}
      <DocumentModal
        document={selectedDoc}
        isOpen={isModalOpen}
        mode="view"
        onClose={() => setIsModalOpen(false)}
        onSwitchToEdit={() => {}}
      />
    </div>
  );
};

export default ExpiryCalendar;
