import React, { useState } from 'react';
import {
  FaBell,
  FaCheckDouble,
  FaTrashAlt,
  FaExclamationTriangle,
  FaTimesCircle,
  FaCheckCircle,
  FaInfoCircle,
  FaFilter
} from 'react-icons/fa';
import { useApp } from '../../context/AppContext';

const NotificationsPage = () => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications
  } = useApp();

  const [filter, setFilter] = useState('all'); // 'all' | 'unread' | 'read'

  const filteredNotifs = notifications.filter((n) => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'read') return n.isRead;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'danger':
        return <FaTimesCircle className="text-danger fs-4" />;
      case 'warning':
        return <FaExclamationTriangle className="text-warning fs-4" />;
      case 'success':
        return <FaCheckCircle className="text-emerald fs-4" />;
      default:
        return <FaInfoCircle className="text-info fs-4" />;
    }
  };

  return (
    <div className="d-flex flex-column gap-4 max-w-1000 mx-auto">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div>
          <h3 className="fw-bold text-dark mb-1">Notification & Alert Center</h3>
          <p className="text-muted small mb-0">
            Real-time proactive alerts for expiring certificates, system events, and upload confirmations.
          </p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button
            onClick={markAllNotificationsAsRead}
            disabled={unreadCount === 0}
            className="btn btn-outline-teal btn-sm d-flex align-items-center gap-2"
          >
            <FaCheckDouble /> Mark All as Read (Verified)
          </button>
          <button
            onClick={clearNotifications}
            disabled={notifications.length === 0}
            className="btn btn-outline-danger btn-sm d-flex align-items-center gap-2"
          >
            <FaTrashAlt /> Clear Notifications
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="tv-card p-3 d-flex align-items-center justify-content-between">
        <div className="btn-group">
          <button
            className={`btn btn-sm ${filter === 'all' ? 'btn-teal' : 'btn-light border'}`}
            onClick={() => setFilter('all')}
          >
            All Notifications ({notifications.length})
          </button>
          <button
            className={`btn btn-sm ${filter === 'unread' ? 'btn-teal' : 'btn-light border'}`}
            onClick={() => setFilter('unread')}
          >
            Unread ({unreadCount})
          </button>
          <button
            className={`btn btn-sm ${filter === 'read' ? 'btn-teal' : 'btn-light border'}`}
            onClick={() => setFilter('read')}
          >
            Read ({notifications.length - unreadCount})
          </button>
        </div>
        <span className="text-muted small d-none d-sm-inline">
          Click any notification to toggle read status
        </span>
      </div>

      {/* Notifications List */}
      {filteredNotifs.length === 0 ? (
        <div className="tv-card p-5 text-center my-4">
          <FaBell className="text-muted fs-1 mb-3" />
          <h5 className="fw-bold text-dark">No Notifications</h5>
          <p className="text-muted small mb-0">
            You're all caught up! No notifications to display for the current filter.
          </p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {filteredNotifs.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markNotificationAsRead(notif.id)}
              className={`tv-card p-3 p-md-4 d-flex align-items-start gap-3 cursor-pointer transition ${
                notif.isRead ? 'bg-white' : 'bg-light border-teal shadow-sm'
              }`}
              style={{ cursor: 'pointer' }}
            >
              <div className="flex-shrink-0 mt-1">
                {getNotificationIcon(notif.type)}
              </div>

              <div className="flex-grow-1">
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-1 mb-1">
                  <h6 className={`mb-0 ${notif.isRead ? 'text-dark' : 'fw-bold text-teal'}`}>
                    {notif.title}
                  </h6>
                  <small className="text-muted">{notif.date}</small>
                </div>
                <p className="text-secondary small mb-2">{notif.description}</p>
                <div>
                  {notif.isRead ? (
                    <span className="badge bg-light text-muted border small">Read</span>
                  ) : (
                    <span className="badge bg-danger-subtle text-danger border border-danger-subtle small">
                      Unread Alert
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
