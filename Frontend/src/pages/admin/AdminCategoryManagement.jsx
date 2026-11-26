import React, { useState } from 'react';
import {
  FaLayerGroup,
  FaPlus,
  FaEdit,
  FaTrash,
  FaFolder,
  FaIdCard,
  FaPassport,
  FaCar,
  FaGraduationCap,
  FaUniversity,
  FaShieldAlt,
  FaAddressCard,
  FaCheckCircle
} from 'react-icons/fa';
import ConfirmModal from '../../components/common/ConfirmModal';
import { useApp } from '../../context/AppContext';

const AdminCategoryManagement = () => {
  const { categories, addCategory, updateCategory, deleteCategory, documents, showToast } = useApp();

  // Modal States
  const [modalMode, setModalMode] = useState(null); // 'add' | 'edit' | null
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteCatId, setDeleteCatId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#0f766e',
    bgColor: '#ccfbf1',
    icon: 'FaFolder'
  });

  const availableIcons = [
    { name: 'FaFolder', label: 'Folder', icon: <FaFolder /> },
    { name: 'FaIdCard', label: 'ID Card', icon: <FaIdCard /> },
    { name: 'FaAddressCard', label: 'Address/PAN', icon: <FaAddressCard /> },
    { name: 'FaPassport', label: 'Passport', icon: <FaPassport /> },
    { name: 'FaCar', label: 'Vehicle', icon: <FaCar /> },
    { name: 'FaGraduationCap', label: 'Education', icon: <FaGraduationCap /> },
    { name: 'FaUniversity', label: 'Bank', icon: <FaUniversity /> },
    { name: 'FaShieldAlt', label: 'Insurance', icon: <FaShieldAlt /> }
  ];

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      description: '',
      color: '#0f766e',
      bgColor: '#ccfbf1',
      icon: 'FaFolder'
    });
    setModalMode('add');
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      description: cat.description || '',
      color: cat.color || '#0f766e',
      bgColor: cat.bgColor || '#ccfbf1',
      icon: cat.icon || 'FaFolder'
    });
    setModalMode('edit');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Category name is required', 'warning');
      return;
    }

    if (modalMode === 'add') {
      addCategory(formData);
    } else if (modalMode === 'edit' && editingCategory) {
      updateCategory(editingCategory.id, formData);
    }

    setModalMode(null);
    setEditingCategory(null);
  };

  const getCategoryIconComponent = (iconName) => {
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
        return <FaFolder />;
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div>
          <h3 className="fw-bold text-dark mb-1">System Document Category Master</h3>
          <p className="text-muted small mb-0">
            Define, customize, and govern legal document classification rules and folder structures.
          </p>
        </div>
        <div>
          <button onClick={handleOpenAdd} className="btn btn-emerald d-flex align-items-center gap-2 shadow-sm">
            <FaPlus /> Add New Category
          </button>
        </div>
      </div>

      {/* Categories Summary Cards */}
      <div className="row g-4">
        {categories.map((cat) => {
          const docCount = documents.filter((d) => d.category === cat.name).length;
          return (
            <div key={cat.id} className="col-xl-3 col-lg-4 col-md-6">
              <div className="tv-card p-4 h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div
                      className="rounded-3 d-flex align-items-center justify-content-center"
                      style={{
                        width: 48,
                        height: 48,
                        backgroundColor: cat.bgColor || '#ccfbf1',
                        color: cat.color || '#0f766e',
                        fontSize: '1.4rem'
                      }}
                    >
                      {getCategoryIconComponent(cat.icon)}
                    </div>
                    <span className="badge bg-light text-dark border small">
                      {docCount} docs
                    </span>
                  </div>

                  <h5 className="fw-bold text-dark mb-1">{cat.name}</h5>
                  <p className="text-muted small mb-3">
                    {cat.description || 'System document classification.'}
                  </p>
                </div>

                <div className="pt-3 border-top d-flex gap-2">
                  <button
                    className="btn btn-sm btn-outline-secondary flex-grow-1"
                    onClick={() => handleOpenEdit(cat)}
                  >
                    <FaEdit className="me-1" /> Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => setDeleteCatId(cat.id)}
                    title="Delete Category"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Category Table */}
      <div className="tv-card overflow-hidden mt-2">
        <div className="p-3 border-bottom bg-light">
          <h6 className="fw-bold text-dark mb-0">Master Verified Category Registry</h6>
        </div>
        <div className="table-responsive">
          <table className="tv-table">
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Icon</th>
                <th>Description</th>
                <th>Active Documents</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td>
                    <span className="fw-bold text-dark small">{cat.name}</span>
                  </td>
                  <td>
                    <span
                      className="d-inline-flex p-2 rounded-2"
                      style={{ backgroundColor: cat.bgColor || '#f1f5f9', color: cat.color || '#0f766e' }}
                    >
                      {getCategoryIconComponent(cat.icon)}
                    </span>
                  </td>
                  <td className="small text-secondary">{cat.description}</td>
                  <td>
                    <span className="badge bg-light text-teal border">
                      {documents.filter((d) => d.category === cat.name).length} Documents
                    </span>
                  </td>
                  <td className="text-end">
                    <div className="btn-group btn-group-sm">
                      <button
                        className="btn btn-light border"
                        onClick={() => handleOpenEdit(cat)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-light border"
                        onClick={() => setDeleteCatId(cat.id)}
                      >
                        <FaTrash className="text-danger" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      {modalMode && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(3px)', zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-light border-bottom px-4 py-3">
                <h5 className="modal-title fw-bold text-dark mb-0">
                  {modalMode === 'add' ? 'Add New Category' : 'Edit Category'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModalMode(null)}
                ></button>
              </div>

              <form onSubmit={handleFormSubmit}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label fw-bold small text-muted">CATEGORY NAME *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Medical Records"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold small text-muted">ICON</label>
                    <div className="d-flex flex-wrap gap-2">
                      {availableIcons.map((item) => (
                        <button
                          key={item.name}
                          type="button"
                          className={`btn btn-sm d-flex align-items-center gap-1 ${formData.icon === item.name ? 'btn-teal' : 'btn-light border'}`}
                          onClick={() => setFormData({ ...formData, icon: item.name })}
                        >
                          {item.icon} {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold small text-muted">DESCRIPTION</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Describe what documents belong in this category..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                  </div>
                </div>

                <div className="modal-footer bg-light px-4 py-3 d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => setModalMode(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-emerald">
                    {modalMode === 'add' ? 'Create Category' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteCatId}
        onClose={() => setDeleteCatId(null)}
        onConfirm={() => {
          if (deleteCatId) deleteCategory(deleteCatId);
        }}
        title="Delete Category"
        message="Are you sure you want to remove this category? Documents assigned to it will remain safe under Other Documents."
      />
    </div>
  );
};

export default AdminCategoryManagement;
