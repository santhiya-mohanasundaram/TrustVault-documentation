import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaIdCard,
  FaAddressCard,
  FaPassport,
  FaCar,
  FaGraduationCap,
  FaUniversity,
  FaShieldAlt,
  FaFolderOpen,
  FaArrowRight,
  FaFileAlt
} from 'react-icons/fa';
import { useApp } from '../../context/AppContext';

const CategoriesPage = () => {
  const { categories, documents } = useApp();
  const navigate = useNavigate();

  // Helper to get category icon component
  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'FaIdCard':
        return <FaIdCard />;
      case 'FaAddressCard':
        return <FaAddressCard />;
      case 'FaPassport':
        return <FaPassport />;
      case 'FaCar':
        return <FaCar />;
      case 'FaGraduationCap':
        return <FaGraduationCap />;
      case 'FaUniversity':
        return <FaUniversity />;
      case 'FaShieldAlt':
        return <FaShieldAlt />;
      default:
        return <FaFolderOpen />;
    }
  };

  const handleViewCategoryDocs = (categoryName) => {
    navigate(`/user/documents?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div>
          <h3 className="fw-bold text-dark mb-1">Document Categories & Classifications</h3>
          <p className="text-muted small mb-0">
            Browse and organize your files by standardized legal, personal, and financial classifications.
          </p>
        </div>
        <div>
          <span className="badge bg-light text-secondary border px-3 py-2 rounded-pill small">
            {categories.length} Active Registered Categories &bull; {documents.length} Total Documents
          </span>
        </div>
      </div>

      {/* Category Cards Grid */}
      <div className="row g-4">
        {categories.map((cat) => {
          // Compute real count based on current documents in state
          const count = documents.filter((d) => d.category === cat.name).length;

          return (
            <div key={cat.id} className="col-xl-3 col-lg-4 col-md-6">
              <div className="tv-card p-4 h-100 d-flex flex-column justify-content-between tv-card-hover">
                <div>
                  {/* Category Icon */}
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div
                      className="rounded-3 d-flex align-items-center justify-content-center"
                      style={{
                        width: 52,
                        height: 52,
                        backgroundColor: cat.bgColor || '#ccfbf1',
                        color: cat.color || '#0f766e',
                        fontSize: '1.6rem'
                      }}
                    >
                      {getCategoryIcon(cat.icon)}
                    </div>
                    <span className="badge bg-light text-dark border px-2 py-1 font-monospace small">
                      {count} {count === 1 ? 'doc' : 'docs'}
                    </span>
                  </div>

                  {/* Category Name & Description */}
                  <h5 className="fw-bold text-dark mb-2">{cat.name}</h5>
                  <p className="text-muted small mb-3">
                    {cat.description || 'Secure personal identification and verified records.'}
                  </p>
                </div>

                {/* View Documents Button */}
                <div className="pt-3 border-top">
                  <button
                    onClick={() => handleViewCategoryDocs(cat.name)}
                    className="btn btn-outline-teal w-100 btn-sm d-flex align-items-center justify-content-center gap-2"
                  >
                    <span>View Documents</span>
                    <FaArrowRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoriesPage;
