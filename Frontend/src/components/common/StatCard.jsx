import React from 'react';

const StatCard = ({ title, value, icon, color = '#0f766e', bgColor = '#ccfbf1', subtitle, trend }) => {
  return (
    <div className="stat-card">
      <div
        className="stat-icon-wrapper"
        style={{
          backgroundColor: bgColor,
          color: color
        }}
      >
        {icon}
      </div>
      <div className="flex-grow-1 overflow-hidden">
        <span className="text-muted d-block small text-uppercase fw-bold" style={{ letterSpacing: '0.04em' }}>
          {title}
        </span>
        <div className="d-flex align-items-baseline gap-2 mt-1">
          <span className="fs-3 fw-bold text-dark">{value}</span>
          {trend && (
            <span className={`small fw-semibold ${trend.positive ? 'text-success' : 'text-danger'}`}>
              {trend.text}
            </span>
          )}
        </div>
        {subtitle && <small className="text-muted text-truncate d-block mt-1">{subtitle}</small>}
      </div>
    </div>
  );
};

export default StatCard;
