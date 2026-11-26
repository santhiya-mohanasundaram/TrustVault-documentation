import React from 'react';
import {
  FaFileContract,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaLock,
  FaShieldAlt,
  FaChartPie,
  FaHdd,
  FaLayerGroup
} from 'react-icons/fa';
import StatCard from '../../components/common/StatCard';
import { StatusDonutChart, CategoryDistributionChart, MonthlyUploadBarChart } from '../../components/common/Charts';
import { useApp } from '../../context/AppContext';

const AdminDocumentStats = () => {
  const { documents, categories } = useApp();

  const totalDocs = documents.length;
  const activeDocs = documents.filter((d) => d.status === 'Active').length;
  const expiringDocs = documents.filter((d) => d.status === 'Expiring Soon').length;
  const expiredDocs = documents.filter((d) => d.status === 'Expired').length;

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header */}
      <div>
        <h3 className="fw-bold text-dark mb-1">Document Statistics & Analytics</h3>
        <p className="text-muted small mb-0">
          Aggregated platform volume, category classification, and document lifecycle metrics.
        </p>
      </div>

      {/* Prominent Privacy Compliance Banner */}
      <div className="alert alert-warning border-warning d-flex align-items-center gap-3 rounded-4 shadow-sm py-3 px-4 mb-0">
        <FaLock className="text-warning fs-3 flex-shrink-0" />
        <div>
          <strong className="text-dark d-block">Zero-Knowledge Compliance Notice</strong>
          <span className="small text-secondary">
            In compliance with TrustVault's client-side security architecture, administrators do not have access
            to raw document files, decryption tokens, or unmasked identification numbers. All analytics shown below
            represent anonymized metadata counters.
          </span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="row g-3">
        <div className="col-xl-3 col-sm-6">
          <StatCard
            title="Total Uploaded Documents"
            value={totalDocs}
            icon={<FaFileContract />}
            color="#0f766e"
            bgColor="#ccfbf1"
            subtitle="Platform-wide records"
          />
        </div>
        <div className="col-xl-3 col-sm-6">
          <StatCard
            title="Active Documents"
            value={activeDocs}
            icon={<FaCheckCircle />}
            color="#16a34a"
            bgColor="#dcfce7"
            subtitle="Valid and certified"
          />
        </div>
        <div className="col-xl-3 col-sm-6">
          <StatCard
            title="Expiring Soon"
            value={expiringDocs}
            icon={<FaExclamationTriangle />}
            color="#f97316"
            bgColor="#ffedd5"
            subtitle="Action window < 30 days"
          />
        </div>
        <div className="col-xl-3 col-sm-6">
          <StatCard
            title="Expired Documents"
            value={expiredDocs}
            icon={<FaTimesCircle />}
            color="#ef4444"
            bgColor="#fee2e2"
            subtitle="Past renewal window"
          />
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="row g-4">
        {/* Category-wise Breakdown */}
        <div className="col-lg-6">
          <div className="tv-card p-4 h-100">
            <h6 className="fw-bold text-dark mb-3 pb-2 border-bottom d-flex align-items-center gap-2">
              <FaLayerGroup className="text-teal" /> Documents by Category
            </h6>
            <CategoryDistributionChart categories={categories} />
          </div>
        </div>

        {/* Global Document Lifecycle Donut */}
        <div className="col-lg-6">
          <div className="tv-card p-4 h-100">
            <h6 className="fw-bold text-dark mb-3 pb-2 border-bottom d-flex align-items-center gap-2">
              <FaChartPie className="text-teal" /> Status Distribution
            </h6>
            <StatusDonutChart
              active={activeDocs}
              expiring={expiringDocs}
              expired={expiredDocs}
              size={180}
            />
          </div>
        </div>

        {/* Monthly Upload Trajectory */}
        <div className="col-12">
          <div className="tv-card p-4">
            <h6 className="fw-bold text-dark mb-3 pb-2 border-bottom d-flex align-items-center gap-2">
              <FaFileContract className="text-teal" /> Monthly Ingestion Velocity
            </h6>
            <MonthlyUploadBarChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDocumentStats;
