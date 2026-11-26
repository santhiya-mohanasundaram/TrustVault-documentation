import React from 'react';

// SVG Donut Chart for Document Status Distribution
export const StatusDonutChart = ({ active = 6, expiring = 2, expired = 1, size = 180 }) => {
  const total = active + expiring + expired || 1;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const activePct = (active / total);
  const expiringPct = (expiring / total);
  const expiredPct = (expired / total);

  const activeDash = activePct * circumference;
  const expiringDash = expiringPct * circumference;
  const expiredDash = expiredPct * circumference;

  const activeOffset = 0;
  const expiringOffset = -activeDash;
  const expiredOffset = -(activeDash + expiringDash);

  return (
    <div className="d-flex flex-column align-items-center justify-content-center">
      <div className="position-relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)', transition: 'transform 0.3s ease' }}>
          {/* Background Ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
          />
          {/* Active Slice (Emerald) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#10b981"
            strokeWidth={strokeWidth}
            strokeDasharray={`${activeDash} ${circumference}`}
            strokeDashoffset={activeOffset}
            strokeLinecap="round"
          />
          {/* Expiring Slice (Orange) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#f97316"
            strokeWidth={strokeWidth}
            strokeDasharray={`${expiringDash} ${circumference}`}
            strokeDashoffset={expiringOffset}
          />
          {/* Expired Slice (Red) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#ef4444"
            strokeWidth={strokeWidth}
            strokeDasharray={`${expiredDash} ${circumference}`}
            strokeDashoffset={expiredOffset}
          />
        </svg>

        {/* Center label */}
        <div
          className="position-absolute top-50 start-50 translate-middle text-center"
          style={{ pointerEvents: 'none' }}
        >
          <div className="fs-3 fw-bold text-dark">{total}</div>
          <div className="text-muted small fw-semibold" style={{ fontSize: '0.72rem' }}>TOTAL DOCS</div>
        </div>
      </div>

      {/* Legend */}
      <div className="d-flex justify-content-center gap-3 mt-3 small">
        <div className="d-flex align-items-center gap-1">
          <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#10b981' }}></span>
          <span className="text-muted">Active ({active})</span>
        </div>
        <div className="d-flex align-items-center gap-1">
          <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#f97316' }}></span>
          <span className="text-muted">Expiring ({expiring})</span>
        </div>
        <div className="d-flex align-items-center gap-1">
          <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#ef4444' }}></span>
          <span className="text-muted">Expired ({expired})</span>
        </div>
      </div>
    </div>
  );
};

// SVG Monthly Activity Bar Chart
export const MonthlyUploadBarChart = ({ data = [
  { month: 'Jun', uploads: 4 },
  { month: 'Jul', uploads: 7 },
  { month: 'Aug', uploads: 5 },
  { month: 'Sep', uploads: 9 },
  { month: 'Oct', uploads: 12 },
  { month: 'Nov', uploads: 16 }
] }) => {
  const maxVal = Math.max(...data.map(d => d.uploads), 1);
  const chartHeight = 160;

  return (
    <div className="w-100">
      <div className="d-flex align-items-end justify-content-between gap-2" style={{ height: chartHeight, paddingBottom: 10 }}>
        {data.map((item, idx) => {
          const barHeight = (item.uploads / maxVal) * (chartHeight - 40);
          return (
            <div key={idx} className="d-flex flex-column align-items-center flex-grow-1">
              <span className="small fw-semibold text-teal mb-1" style={{ fontSize: '0.75rem' }}>{item.uploads}</span>
              <div
                style={{
                  width: '65%',
                  maxWidth: 36,
                  height: `${Math.max(barHeight, 8)}px`,
                  backgroundColor: idx === data.length - 1 ? '#0f766e' : '#a7f3d0',
                  borderRadius: '6px 6px 0 0',
                  transition: 'height 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                title={`${item.month}: ${item.uploads} documents`}
              ></div>
              <span className="text-muted small mt-2 fw-semibold" style={{ fontSize: '0.75rem' }}>
                {item.month}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Category Horizontal Distribution Bar
export const CategoryDistributionChart = ({ categories = [] }) => {
  const total = categories.reduce((acc, cat) => acc + (cat.count || 0), 0) || 1;

  return (
    <div className="d-flex flex-column gap-3">
      {categories.slice(0, 6).map((cat, idx) => {
        const pct = Math.round(((cat.count || 0) / total) * 100);
        return (
          <div key={idx}>
            <div className="d-flex justify-content-between align-items-center mb-1 small">
              <span className="fw-semibold text-dark">{cat.name}</span>
              <span className="text-muted">{cat.count || 0} docs ({pct}%)</span>
            </div>
            <div className="progress" style={{ height: 8, borderRadius: 10, backgroundColor: '#f1f5f9' }}>
              <div
                className="progress-bar"
                role="progressbar"
                style={{
                  width: `${pct}%`,
                  backgroundColor: cat.color || '#0f766e',
                  borderRadius: 10
                }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
