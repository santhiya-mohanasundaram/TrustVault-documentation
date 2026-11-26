import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaUsers,
  FaFileContract,
  FaUserCheck,
  FaHdd,
  FaChartBar,
  FaShieldAlt,
  FaArrowRight,
  FaLayerGroup,
  FaExclamationCircle,
  FaServer,
  FaCheckCircle
} from 'react-icons/fa';
import StatCard from '../../components/common/StatCard';
import { MonthlyUploadBarChart, StatusDonutChart, CategoryDistributionChart } from '../../components/common/Charts';
import { useApp } from '../../context/AppContext';

const AdminDashboard = () => {
  const { users, documents, categories, adminLogs } = useApp();

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === 'Active').length;
  const totalDocs = documents.length;
  const activeDocs = documents.filter((d) => d.status === 'Active').length;
  const expiringDocs = documents.filter((d) => d.status === 'Expiring Soon').length;
  const expiredDocs = documents.filter((d) => d.status === 'Expired').length;

  return (
    <div className="d-flex flex-column gap-4">
      {/* Admin Executive Header Banner */}
      <div
        className="rounded-4 p-4 p-md-5 text-white position-relative overflow-hidden shadow-sm"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
        }}
      >
        <div className="row align-items-center position-relative" style={{ zIndex: 1 }}>
          <div className="col-md-8">
            <span className="badge bg-teal px-3 py-1 rounded-pill fw-bold text-uppercase small mb-2">
              System Administration
            </span>
            <h2 className="fw-bold mb-2">TrustVault Enterprise Control Center</h2>
            <p className="mb-0 text-white-50 fs-6 pe-md-4">
              Real-time platform metrics, user access governance, security monitoring, and category administration.
            </p>
          </div>
          <div className="col-md-4 text-md-end mt-3 mt-md-0">
            <div className="d-inline-flex flex-column align-items-md-end text-light">
              <span className="badge bg-success-subtle text-success border border-success px-3 py-1 mb-1">
                <FaCheckCircle className="me-1" /> Core Engine Online
              </span>
              <small className="text-secondary">Uptime: 99.98% &bull; Latency: 12ms &bull; Encryption: AES-256 Active</small>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Overview Cards */}
      <div className="row g-3">
        <div className="col-xl-3 col-sm-6">
          <StatCard
            title="Total Registered Users"
            value={totalUsers}
            icon={<FaUsers />}
            color="#0284c7"
            bgColor="#e0f2fe"
            subtitle="Verified accounts"
          />
        </div>
        <div className="col-xl-3 col-sm-6">
          <StatCard
            title="Total Documents"
            value={totalDocs}
            icon={<FaFileContract />}
            color="#0f766e"
            bgColor="#ccfbf1"
            subtitle="Tokenized in vault"
          />
        </div>
        <div className="col-xl-3 col-sm-6">
          <StatCard
            title="Total Active Users"
            value={activeUsers}
            icon={<FaUserCheck />}
            color="#16a34a"
            bgColor="#dcfce7"
            subtitle={`${Math.round((activeUsers / (totalUsers || 1)) * 100)}% active rate`}
          />
        </div>
        <div className="col-xl-3 col-sm-6">
          <StatCard
            title="Total Storage Used"
            value="1.42 GB"
            icon={<FaHdd />}
            color="#7c3aed"
            bgColor="#ede9fe"
            subtitle="14.2% of 10 GB limit"
          />
        </div>
      </div>

      {/* Visual Analytics Row */}
      <div className="row g-4">
        {/* Document Upload Statistics Chart */}
        <div className="col-lg-8">
          <div className="tv-card p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
              <div>
                <h6 className="fw-bold text-dark mb-0">Document Upload Statistics (Monthly)</h6>
                <small className="text-muted">Aggregate platform upload volume</small>
              </div>
              <Link to="/admin/statistics" className="text-teal small fw-bold text-decoration-none">
                Detailed Stats &rarr;
              </Link>
            </div>
            <MonthlyUploadBarChart />
          </div>
        </div>

        {/* Global Document Status */}
        <div className="col-lg-4">
          <div className="tv-card p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
              <div>
                <h6 className="fw-bold text-dark mb-0">Global Document Status</h6>
                <small className="text-muted">Platform document health</small>
              </div>
            </div>
            <StatusDonutChart
              active={activeDocs}
              expiring={expiringDocs}
              expired={expiredDocs}
              size={170}
            />
          </div>
        </div>
      </div>

      {/* Category Breakdown & Recent Activity */}
      <div className="row g-4">
        {/* Category-wise Document Statistics */}
        <div className="col-lg-6">
          <div className="tv-card p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
              <div>
                <h6 className="fw-bold text-dark mb-0">Category-wise Document Statistics</h6>
                <small className="text-muted">Document distribution across active categories</small>
              </div>
              <Link to="/admin/categories" className="text-teal small fw-bold text-decoration-none">
                Manage &rarr;
              </Link>
            </div>
            <CategoryDistributionChart categories={categories} />
          </div>
        </div>

        {/* Recent User Activities Log */}
        <div className="col-lg-6">
          <div className="tv-card p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
              <div>
                <h6 className="fw-bold text-dark mb-0">Recent User Activities & Audit</h6>
                <small className="text-muted">System security log events</small>
              </div>
              <Link to="/admin/activity" className="text-teal small fw-bold text-decoration-none">
                View All &rarr;
              </Link>
            </div>

            <div className="d-flex flex-column gap-2">
              {adminLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="p-2 rounded bg-light border d-flex justify-content-between align-items-center small">
                  <div>
                    <span className="fw-bold text-dark d-block">{log.event}</span>
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                      User: <strong>{log.user}</strong> &bull; {log.action}
                    </span>
                  </div>
                  <div className="text-end">
                    <span className="badge bg-success-subtle text-success border border-success-subtle mb-1 d-inline-block" style={{ fontSize: '0.7rem' }}>
                      {log.status}
                    </span>
                    <div className="text-muted font-monospace" style={{ fontSize: '0.68rem' }}>
                      {log.timestamp}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Admin Privacy Sandbox Banner */}
      <div className="p-3 rounded-3 bg-light border border-teal d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-3">
          <FaShieldAlt className="text-teal fs-3" />
          <div>
            <div className="fw-bold text-dark small">Zero-Knowledge Administrative Privacy Sandbox</div>
            <div className="text-muted small">
              TrustVault strictly isolates encryption keys. Administrators cannot decrypt raw document files or inspect private document numbers.
            </div>
          </div>
        </div>
        <span className="badge bg-teal text-white px-3 py-2 rounded-pill font-monospace small">
          PRIVACY ENFORCED
        </span>
      </div>
    </div>
  );
};

export default AdminDashboard;
