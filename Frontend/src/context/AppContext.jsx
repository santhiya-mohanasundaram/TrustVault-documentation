import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  initialCategories,
  initialDocuments,
  initialUsers,
  initialActivities,
  initialAdminLogs,
  initialNotifications
} from '../data/initialData';
import {
  authApi,
  documentApi,
  categoryApi,
  notificationApi,
  activityApi,
  userApi,
  adminApi,
  schedulerApi
} from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // 1. Current Session User (Restored from localStorage on refresh, or null if logged out)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('tv_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // 2. Current Role
  const [role, setRole] = useState(() => {
    return localStorage.getItem('tv_role') || 'User';
  });

  // 3. Registered Users List (For Admin)
  const [users, setUsers] = useState(initialUsers);

  // 4. All Documents
  const [allDocuments, setAllDocuments] = useState(initialDocuments);

  // 5. System Categories
  const [categories, setCategories] = useState(initialCategories);

  // 6. All User Activities
  const [allActivities, setAllActivities] = useState(initialActivities);

  // 7. System Admin Logs
  const [adminLogs, setAdminLogs] = useState(initialAdminLogs);

  // 8. All Notifications
  const [allNotifications, setAllNotifications] = useState(initialNotifications);

  const [toast, setToast] = useState(null);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Show Toast Helper
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  }, []);

  // Fetch all live data from backend for the authenticated user
  const refreshBackendData = useCallback(async (userRole = role) => {
    try {
      // 1. Load Categories
      const catRes = await categoryApi.getAll();
      if (catRes && catRes.data) {
        setCategories(catRes.data);
      }

      // 2. Load Documents
      const docRes = await documentApi.getAll();
      if (docRes && docRes.data) {
        setAllDocuments(docRes.data);
      }

      // 3. Load Notifications
      const notifRes = await notificationApi.getAll();
      if (notifRes && notifRes.data) {
        setAllNotifications(notifRes.data);
      }

      // 4. Load Activities
      const actRes = await activityApi.getUserActivities();
      if (actRes && actRes.data) {
        setAllActivities(actRes.data);
      }

      // 5. Admin data if Admin
      if (userRole === 'Admin') {
        const statsRes = await adminApi.getStats();
        if (statsRes && statsRes.data) {
          if (statsRes.data.users) setUsers(statsRes.data.users);
          if (statsRes.data.systemAuditLogs) setAdminLogs(statsRes.data.systemAuditLogs);
        }
      }

      setIsBackendConnected(true);
    } catch (err) {
      console.warn('Backend data sync notice:', err.message);
    }
  }, [role]);

  // Initial Load & Token Validation
  useEffect(() => {
    const token = localStorage.getItem('tv_token');
    if (token) {
      authApi.getMe()
        .then((res) => {
          if (res && res.data) {
            setCurrentUser(res.data);
            setRole(res.data.role);
            localStorage.setItem('tv_user', JSON.stringify(res.data));
            localStorage.setItem('tv_role', res.data.role);
            refreshBackendData(res.data.role);
          }
        })
        .catch(() => {
          // Token expired or invalid
          localStorage.removeItem('tv_token');
          localStorage.removeItem('tv_user');
          setCurrentUser(null);
        });
    } else {
      // Load public categories
      categoryApi.getAll()
        .then((res) => {
          if (res && res.data) setCategories(res.data);
        })
        .catch(() => {});
    }
  }, [refreshBackendData]);

  // User-scoped Documents: Filter by current user
  const documents = useMemo(() => {
    if (role === 'Admin') {
      return allDocuments;
    }
    if (!currentUser) return [];
    return allDocuments.filter((d) => d.userId === currentUser.id);
  }, [allDocuments, role, currentUser]);

  // User-scoped Notifications
  const notifications = useMemo(() => {
    if (role === 'Admin') {
      return allNotifications;
    }
    if (!currentUser) return [];
    return allNotifications.filter((n) => n.userId === currentUser.id);
  }, [allNotifications, role, currentUser]);

  // User-scoped Activities
  const activities = useMemo(() => {
    if (role === 'Admin') {
      return allActivities;
    }
    if (!currentUser) return [];
    return allActivities.filter(
      (a) => a.userId === currentUser.id || a.user === currentUser.name
    );
  }, [allActivities, role, currentUser]);

  // ==========================================
  // AUTHENTICATION: DYNAMIC LOGIN & REGISTRATION
  // ==========================================

  const login = async (email, password, selectedRole) => {
    const cleanEmail = (email || '').trim().toLowerCase();

    try {
      const res = await authApi.login(cleanEmail, password, selectedRole);
      if (res && res.success && res.data) {
        const { token, user } = res.data;
        localStorage.setItem('tv_token', token);
        localStorage.setItem('tv_user', JSON.stringify(user));
        localStorage.setItem('tv_role', user.role);

        setCurrentUser(user);
        setRole(user.role);

        await refreshBackendData(user.role);

        showToast(`Welcome back, ${user.name}!`, 'success');
        return { success: true, user };
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed. Please verify credentials.';
      showToast(msg, 'danger');
      return { success: false, error: msg };
    }
  };

  const register = async (formData) => {
    try {
      const res = await authApi.register({
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        mobileNumber: formData.phone ? formData.phone.trim() : null,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });

      if (res && res.success) {
        showToast(`Account created for ${res.data.name}! Please log in.`, 'success');
        return { success: true, user: res.data };
  const register = (formData) => {
    const cleanEmail = formData.email.trim().toLowerCase();
    const cleanName = formData.fullName.trim();

    // Check for duplicate registration
    const existing = users.find(
      (u) => u.email && u.email.toLowerCase() === cleanEmail
    );
    if (existing) {
      showToast(`An account with email "${cleanEmail}" is already registered. Please login.`, 'warning');
      return { success: false, error: 'User already exists' };
    }

    const newUserId = `USR-${Math.floor(100 + Math.random() * 900)}`;
    const newUser = {
      id: newUserId,
      name: cleanName,
      email: cleanEmail,
      phone: formData.phone.trim(),
      password: formData.password, // Saved for demo authentication
      role: 'User',
      status: 'Active',
      registrationDate: new Date().toISOString().split('T')[0],
      documentsCount: 0,
      storageUsed: '0 MB',
      lastLogin: 'Never',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
      notificationPreferences: {
        email: true,
        sms: false,
        push: true,
        expiryThreshold: '30', autoReminderEnabled: true
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed.';
      showToast(msg, 'warning');
      return { success: false, error: msg };
    }
  };

  const logout = async () => {
    await authApi.logout();
    setCurrentUser(null);
    setRole('User');
    setAllDocuments([]);
    setAllNotifications([]);
    setAllActivities([]);
    showToast('You have been logged out safely.', 'info');
  };

  // ==========================================
  // DOCUMENT OPERATIONS (USER-SCOPED)
  // ==========================================

  const addDocument = async (newDoc) => {
    try {
      const formData = new FormData();
  const addDocument = (newDoc) => {
    // Check for potential duplicate document names
    const isDuplicate = allDocuments.some(d => d.userId === (currentUser?.id || "USR-101") && d.name.toLowerCase() === newDoc.name.toLowerCase());
    const ownerId = currentUser?.id || 'USR-101';
    const ownerName = currentUser?.name || 'User';

    const docWithId = {
      ...newDoc,
      id: `doc-${Date.now()}`,
      userId: ownerId,
      uploadDate: new Date().toISOString().split('T')[0],
      lastModified: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    setAllDocuments((prev) => [docWithId, ...prev]);

      if (newDoc.rawFile) {
        formData.append('file', newDoc.rawFile);
      } else {
        // Fallback file blob for programmatic addition
        const blob = new Blob([`TrustVault Document: ${newDoc.name}`], { type: 'application/pdf' });
        formData.append('file', blob, `${newDoc.name.replace(/\s+/g, '_')}.pdf`);
      }

      formData.append('documentName', newDoc.name);
      formData.append('category', newDoc.category);
      if (newDoc.documentNumber) formData.append('documentNumber', newDoc.documentNumber);
      if (newDoc.issueDate) formData.append('issueDate', newDoc.issueDate);
      if (newDoc.expiryDate) formData.append('expiryDate', newDoc.expiryDate);
      if (newDoc.description) formData.append('description', newDoc.description);

      const res = await documentApi.upload(formData);
      if (res && res.success && res.data) {
        const savedDoc = res.data;
        setAllDocuments((prev) => [savedDoc, ...prev]);

        // Refresh notifications & activities
        try {
          const notifs = await notificationApi.getAll();
          if (notifs && notifs.data) setAllNotifications(notifs.data);
          const acts = await activityApi.getUserActivities();
          if (acts && acts.data) setAllActivities(acts.data);
        } catch (e) {}

        showToast(`"${savedDoc.name}" uploaded and encrypted successfully!`, 'success');
        return savedDoc;
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to upload document.';
      showToast(msg, 'danger');
      throw err;
    }
  };

  const updateDocument = async (id, updatedFields) => {
    try {
      if (typeof id === 'number') {
        const res = await documentApi.update(id, updatedFields);
        if (res && res.data) {
          setAllDocuments((prev) =>
            prev.map((doc) => (doc.id === id ? res.data : doc))
          );
          showToast(`"${res.data.name}" updated successfully!`, 'success');
          return;
        }
      }
    } catch (err) {
      console.warn('Update document API error:', err);
    }

    // Local fallback update
    setAllDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === id) {
          return { ...doc, ...updatedFields };
        }
        return doc;
      })
    );
    showToast('Document details updated successfully!', 'success');
  };

  const deleteDocument = async (id) => {
    try {
      if (typeof id === 'number') {
        await documentApi.delete(id);
      }
    } catch (err) {
      console.warn('Delete document API error:', err);
    }

    setAllDocuments((prev) => prev.filter((doc) => doc.id !== id));
    showToast('Document has been removed from vault.', 'info');
  };

  // ==========================================
  // ACTIVITIES & AUDIT LOGGING
  // ==========================================

  const logActivity = (type, documentName, category = 'General', status = 'Success') => {
    const newAct = {
      id: `act-${Date.now()}`,
      userId: currentUser?.id,
      type,
      documentName,
      user: currentUser?.name || 'User',
      timestamp: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status,
      category
    };
    setAllActivities((prev) => [newAct, ...prev.slice(0, 99)]);
  };

  const logAdminEvent = (event, user, action, status = 'Success') => {
    const newLog = {
      id: `sys-${Date.now()}`,
      event,
      user,
      action,
      ip: '127.0.0.1',
      timestamp: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status
    };
    setAdminLogs((prev) => [newLog, ...prev.slice(0, 99)]);
  };

  // ==========================================
  // NOTIFICATIONS (USER-SCOPED)
  // ==========================================

  const markNotificationAsRead = async (id) => {
    try {
      if (typeof id === 'number') {
        await notificationApi.markRead(id);
      }
    } catch (e) {}

    setAllNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = async () => {
    try {
      await notificationApi.markAllRead();
    } catch (e) {}

    setAllNotifications((prev) =>
      prev.map((n) => (currentUser && n.userId === currentUser.id ? { ...n, isRead: true } : n))
    );
    showToast('All notifications marked as read', 'success');
  };

  const clearNotifications = async () => {
    try {
      await notificationApi.clearAll();
    } catch (e) {}

    setAllNotifications((prev) =>
      prev.filter((n) => !currentUser || n.userId !== currentUser.id)
    );
    showToast('All notifications cleared', 'info');
  };

  const addNotification = (notif) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      userId: currentUser?.id,
      date: 'Just now',
      isRead: false,
      ...notif
    };
    setAllNotifications((prev) => [newNotif, ...prev]);
  };

  // ==========================================
  // CATEGORY MANAGEMENT (ADMIN)
  // ==========================================

  const addCategory = async (categoryData) => {
    try {
      const res = await categoryApi.create(categoryData);
      if (res && res.data) {
        setCategories((prev) => [...prev, res.data]);
        showToast(`Category "${res.data.name}" created!`, 'success');
        return;
      }
    } catch (err) {
      console.warn('Create category API warning:', err);
    }
  };

  const updateCategory = async (id, updatedData) => {
    try {
      if (typeof id === 'number') {
        const res = await categoryApi.update(id, updatedData);
        if (res && res.data) {
          setCategories((prev) =>
            prev.map((c) => (c.id === id ? res.data : c))
          );
          showToast('Category updated successfully!', 'success');
          return;
        }
      }
    } catch (e) {}
  };

  const deleteCategory = async (id) => {
    try {
      if (typeof id === 'number') {
        await categoryApi.delete(id);
      }
      setCategories((prev) => prev.filter((c) => c.id !== id));
      showToast('Category deleted successfully.', 'info');
    } catch (e) {}
  };

  // ==========================================
  // USER MANAGEMENT (ADMIN)
  // ==========================================

  const updateUserStatus = async (userId, newStatus) => {
    try {
      if (typeof userId === 'number') {
        const res = await adminApi.updateUserStatus(userId, newStatus);
        if (res && res.data) {
          setUsers((prev) =>
            prev.map((u) => (u.id === userId ? res.data : u))
          );
          showToast(`User status updated to ${newStatus}`, 'success');
          return;
        }
      }
    } catch (e) {}

    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );
    showToast(`User status updated to ${newStatus}`, 'success');
  };

  // ==========================================
  // PROFILE UPDATE (USER)
  // ==========================================

  const updateProfile = async (profileData) => {
    if (!currentUser) return;

    try {
      const res = await userApi.updateProfile(profileData);
      if (res && res.data) {
        setCurrentUser(res.data);
        localStorage.setItem('tv_user', JSON.stringify(res.data));
        showToast('Profile information saved successfully!', 'success');
        return;
      }
    } catch (err) {
      console.warn('Update profile API error:', err);
    }

    const updatedUser = { ...currentUser, ...profileData };
    setCurrentUser(updatedUser);
    localStorage.setItem('tv_user', JSON.stringify(updatedUser));
    showToast('Profile information saved successfully!', 'success');
  };

  // Trigger manual expiry audit
  const runExpiryAudit = async () => {
    try {
      const res = await schedulerApi.triggerExpiryAudit();
      if (res && res.success) {
        await refreshBackendData();
        showToast(`Expiry audit completed. ${res.data?.processedReminders || 0} reminders processed.`, 'info');
      }
    } catch (e) {
      showToast('Could not trigger expiry audit.', 'warning');
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        role,
        setRole,
        documents,
        allDocuments,
        categories,
        users,
        activities,
        allActivities,
        adminLogs,
        notifications,
        allNotifications,
        toast,
        showToast,
        login,
        register,
        logout,
        addDocument,
        updateDocument,
        deleteDocument,
        logActivity,
        logAdminEvent,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotifications,
        addNotification,
        addCategory,
        updateCategory,
        deleteCategory,
        updateUserStatus,
        updateProfile,
        runExpiryAudit,
        refreshBackendData,
        isBackendConnected
      }}
    >
      {children}
      {/* Global Toast Notification */}
      {toast && (
        <div
          className={`position-fixed bottom-0 end-0 p-3`}
          style={{ zIndex: 9999 }}
        >
          <div
            className={`toast show align-items-center text-white bg-${
              toast.type === 'danger'
                ? 'danger'
                : toast.type === 'warning'
                ? 'warning text-dark'
                : toast.type === 'info'
                ? 'info'
                : 'success'
            } border-0 shadow-lg rounded-3`}
            role="alert"
          >
            <div className="d-flex">
              <div className="toast-body fw-semibold px-3 py-2">
                {toast.message}
              </div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                onClick={() => setToast(null)}
              ></button>
            </div>
          </div>
        </div>
      )}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
