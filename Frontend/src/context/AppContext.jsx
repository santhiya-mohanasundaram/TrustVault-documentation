import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  initialCategories,
  initialDocuments,
  initialUsers,
  initialActivities,
  initialAdminLogs,
  initialNotifications
} from '../data/initialData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // 1. Registered Users List
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('tv_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialUsers;
      }
    }
    return initialUsers;
  });

  // 2. Current Session User (Restored from localStorage on refresh, or null if logged out)
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

  // 3. Current Role
  const [role, setRole] = useState(() => {
    return localStorage.getItem('tv_role') || 'User';
  });

  // 4. All Documents across all users (with userId association)
  const [allDocuments, setAllDocuments] = useState(() => {
    const saved = localStorage.getItem('tv_documents');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((d) => ({ ...d, userId: d.userId || 'USR-101' }));
      } catch (e) {
        return initialDocuments;
      }
    }
    return initialDocuments;
  });

  // 5. System Categories
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('tv_categories');
    return saved ? JSON.parse(saved) : initialCategories;
  });

  // 6. All User Activities (with userId association)
  const [allActivities, setAllActivities] = useState(() => {
    const saved = localStorage.getItem('tv_activities');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((a) => ({ ...a, userId: a.userId || 'USR-101' }));
      } catch (e) {
        return initialActivities;
      }
    }
    return initialActivities;
  });

  // 7. System Admin Logs
  const [adminLogs, setAdminLogs] = useState(() => {
    const saved = localStorage.getItem('tv_admin_logs');
    return saved ? JSON.parse(saved) : initialAdminLogs;
  });

  // 8. All Notifications (with userId association)
  const [allNotifications, setAllNotifications] = useState(() => {
    const saved = localStorage.getItem('tv_notifications');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((n) => ({ ...n, userId: n.userId || 'USR-101' }));
      } catch (e) {
        return initialNotifications;
      }
    }
    return initialNotifications;
  });

  const [toast, setToast] = useState(null);

  // Sync state changes with localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('tv_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('tv_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('tv_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('tv_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('tv_documents', JSON.stringify(allDocuments));
  }, [allDocuments]);

  useEffect(() => {
    localStorage.setItem('tv_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('tv_activities', JSON.stringify(allActivities));
  }, [allActivities]);

  useEffect(() => {
    localStorage.setItem('tv_admin_logs', JSON.stringify(adminLogs));
  }, [adminLogs]);

  useEffect(() => {
    localStorage.setItem('tv_notifications', JSON.stringify(allNotifications));
  }, [allNotifications]);

  // Show Toast
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // User-scoped Documents: A user sees ONLY their own documents! Admin sees all documents.
  const documents = useMemo(() => {
    if (role === 'Admin') {
      return allDocuments;
    }
    if (!currentUser) return [];
    return allDocuments.filter((d) => d.userId === currentUser.id);
  }, [allDocuments, role, currentUser]);

  // User-scoped Notifications: A user sees ONLY their own notifications!
  const notifications = useMemo(() => {
    if (role === 'Admin') {
      return allNotifications;
    }
    if (!currentUser) return [];
    return allNotifications.filter((n) => n.userId === currentUser.id);
  }, [allNotifications, role, currentUser]);

  // User-scoped Activities: A user sees ONLY their own history!
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

  const login = (email, password, selectedRole) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    setRole(selectedRole);

    if (selectedRole === 'Admin') {
      // Check Admin credentials
      if (
        (cleanEmail === 'admin@trustvault.io' && (password === 'admin1234' || password === 'admin' || !password)) ||
        cleanEmail === 'admin'
      ) {
        const adminUser = {
          id: 'ADM-001',
          name: 'Admin System',
          email: 'admin@trustvault.io',
          phone: '+91 90000 00001',
          role: 'Admin',
          registrationDate: '2025-12-01',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80'
        };
        setCurrentUser(adminUser);
        localStorage.setItem('tv_user', JSON.stringify(adminUser));
        localStorage.setItem('tv_role', 'Admin');
        logAdminEvent('User Login', adminUser.email, 'Admin session authenticated', 'Success');
        showToast('Welcome to TrustVault Admin Console!', 'success');
        return { success: true, user: adminUser };
      } else {
        showToast('Invalid Admin credentials. Demo Admin: admin@trustvault.io / admin1234', 'danger');
        return { success: false, error: 'Invalid admin credentials' };
      }
    } else {
      // User Role: Verify dynamically against registered users in `users`
      const foundUser = users.find(
        (u) => u.email && u.email.toLowerCase() === cleanEmail
      );

      if (!foundUser) {
        showToast(`No registered account found for "${email}". Please register first.`, 'danger');
        return { success: false, error: 'User not found' };
      }

      // Check password if set
      if (foundUser.password && foundUser.password !== password) {
        showToast('Incorrect password. Please verify and try again.', 'danger');
        return { success: false, error: 'Incorrect password' };
      }

      // Check account status
      if (foundUser.status === 'Suspended') {
        showToast('Your account is currently suspended. Please contact administrator.', 'warning');
        return { success: false, error: 'Account suspended' };
      }

      const loggedInUser = {
        ...foundUser,
        lastLogin: 'Just now'
      };

      // Update lastLogin in users array
      setUsers((prev) =>
        prev.map((u) => (u.id === foundUser.id ? { ...u, lastLogin: 'Just now' } : u))
      );

      setCurrentUser(loggedInUser);
      localStorage.setItem('tv_user', JSON.stringify(loggedInUser));
      localStorage.setItem('tv_role', 'User');

      logActivity('User Login', 'User Dashboard Accessed', 'System', 'Success', loggedInUser.id, loggedInUser.name);
      logAdminEvent('User Login', loggedInUser.email, `User ${loggedInUser.name} signed in`, 'Success');

      showToast(`Welcome back, ${loggedInUser.name}!`, 'success');
      return { success: true, user: loggedInUser };
    }
  };

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
    };

    // Update registered users list
    setUsers((prev) => [newUser, ...prev]);

    // Add a welcome notification specifically for this newly registered user
    const welcomeNotif = {
      id: `notif-${Date.now()}`,
      userId: newUserId,
      title: `Welcome to TrustVault, ${cleanName}!`,
      description: 'Your personal document vault is ready. Start by uploading and organizing your vital certificates.',
      date: 'Just now',
      isRead: false,
      type: 'info',
      docId: null
    };
    setAllNotifications((prev) => [welcomeNotif, ...prev]);

    // Log registration in activity & admin logs
    logAdminEvent('User Registration', cleanEmail, `New user ${cleanName} registered`, 'Success');

    showToast(`Account created for ${cleanName}! Please log in.`, 'success');
    return { success: true, user: newUser };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('tv_user');
    localStorage.removeItem('tv_role');
    showToast('You have been logged out safely.', 'info');
  };

  // ==========================================
  // DOCUMENT OPERATIONS (USER-SCOPED)
  // ==========================================

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

    // Update user's document count in users list
    setUsers((prev) =>
      prev.map((u) =>
        u.id === ownerId ? { ...u, documentsCount: (u.documentsCount || 0) + 1 } : u
      )
    );

    // Also update currentUser's own document count if matching
    if (currentUser && currentUser.id === ownerId) {
      setCurrentUser((prev) => ({
        ...prev,
        documentsCount: (prev.documentsCount || 0) + 1
      }));
    }

    // Log Activity for this user
    logActivity('Document Uploaded', docWithId.name, docWithId.category, 'Success', ownerId, ownerName);
    logAdminEvent('Document Upload', currentUser?.email || 'user', `Uploaded ${docWithId.name} by ${ownerName}`, 'Success');

    // Add Notification for this user
    addNotification({
      userId: ownerId,
      title: 'New Document Uploaded',
      description: `${docWithId.name} has been added securely to your vault under ${docWithId.category}.`,
      type: 'success',
      docId: docWithId.id
    });

    showToast(`"${docWithId.name}" saved successfully!`, 'success');
    return docWithId;
  };

  const updateDocument = (id, updatedFields) => {
    setAllDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === id) {
          return {
            ...doc,
            ...updatedFields,
            lastModified: new Date().toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          };
        }
        return doc;
      })
    );

    const targetDoc = allDocuments.find((d) => d.id === id);
    const docName = targetDoc ? targetDoc.name : 'Document';
    logActivity('Document Updated', docName, targetDoc?.category || 'General', 'Success');
    showToast(`"${docName}" updated successfully!`, 'success');
  };

  const deleteDocument = (id) => {
    const targetDoc = allDocuments.find((d) => d.id === id);
    if (!targetDoc) return;

    setAllDocuments((prev) => prev.filter((doc) => doc.id !== id));

    // Decrement user document count
    if (targetDoc.userId) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === targetDoc.userId
            ? { ...u, documentsCount: Math.max(0, (u.documentsCount || 0) - 1) }
            : u
        )
      );

      if (currentUser && currentUser.id === targetDoc.userId) {
        setCurrentUser((prev) => ({
          ...prev,
          documentsCount: Math.max(0, (prev.documentsCount || 0) - 1)
        }));
      }
    }

    logActivity('Document Deleted', targetDoc.name, targetDoc.category, 'Info');
    logAdminEvent('Document Deleted', currentUser?.email || 'user', `Removed ${targetDoc.name}`, 'Warning');
    showToast(`"${targetDoc.name}" has been removed from vault.`, 'info');
  };

  // ==========================================
  // ACTIVITIES & AUDIT LOGGING
  // ==========================================

  const logActivity = (
    type,
    documentName,
    category = 'General',
    status = 'Success',
    userId = null,
    userName = null
  ) => {
    const newAct = {
      id: `act-${Date.now()}`,
      userId: userId || currentUser?.id || 'USR-101',
      type,
      documentName,
      user: userName || currentUser?.name || 'User',
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
      ip: '192.168.1.100',
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

  const markNotificationAsRead = (id) => {
    setAllNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    if (!currentUser) return;
    setAllNotifications((prev) =>
      prev.map((n) =>
        n.userId === currentUser.id ? { ...n, isRead: true } : n
      )
    );
    showToast('All notifications marked as read', 'success');
  };

  const clearNotifications = () => {
    if (!currentUser) return;
    setAllNotifications((prev) =>
      prev.filter((n) => n.userId !== currentUser.id)
    );
    showToast('All notifications cleared', 'info');
  };

  const addNotification = (notif) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      userId: notif.userId || currentUser?.id || 'USR-101',
      date: 'Just now',
      isRead: false,
      ...notif
    };
    setAllNotifications((prev) => [newNotif, ...prev]);
  };

  // ==========================================
  // CATEGORY MANAGEMENT (ADMIN)
  // ==========================================

  const addCategory = (categoryData) => {
    const newCat = {
      id: categoryData.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      count: 0,
      color: '#0f766e',
      bgColor: '#ccfbf1',
      icon: 'FaFolder',
      ...categoryData
    };
    setCategories((prev) => [...prev, newCat]);
    logAdminEvent('Category Created', currentUser?.email || 'admin', `Created category "${newCat.name}"`, 'Success');
    showToast(`Category "${newCat.name}" created!`, 'success');
  };

  const updateCategory = (id, updatedData) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedData } : c))
    );
    logAdminEvent('Category Updated', currentUser?.email || 'admin', `Updated category "${id}"`, 'Success');
    showToast('Category updated successfully!', 'success');
  };

  const deleteCategory = (id) => {
    const cat = categories.find((c) => c.id === id);
    if (!cat) return;
    setCategories((prev) => prev.filter((c) => c.id !== id));
    logAdminEvent('Category Deleted', currentUser?.email || 'admin', `Removed category "${cat.name}"`, 'Warning');
    showToast(`Category "${cat.name}" deleted.`, 'info');
  };

  // ==========================================
  // USER MANAGEMENT (ADMIN)
  // ==========================================

  const updateUserStatus = (userId, newStatus) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );

    // If current logged in user status changed, update session too
    if (currentUser && currentUser.id === userId) {
      setCurrentUser((prev) => ({ ...prev, status: newStatus }));
    }

    logAdminEvent(
      'User Status Changed',
      currentUser?.email || 'admin',
      `User ${userId} status changed to ${newStatus}`,
      newStatus === 'Active' ? 'Success' : 'Warning'
    );
    showToast(`User status updated to ${newStatus}`, 'success');
  };

  // ==========================================
  // PROFILE UPDATE (USER)
  // ==========================================

  const updateProfile = (profileData) => {
    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      ...profileData
    };

    setCurrentUser(updatedUser);
    localStorage.setItem('tv_user', JSON.stringify(updatedUser));

    // Synchronize into master users directory
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, ...profileData } : u))
    );

    logActivity('Profile Updated', 'User Profile Information', 'Account', 'Success');
    showToast('Profile information saved successfully!', 'success');
  };

  // ==========================================
  // RESET DEMO DATA
  // ==========================================

  const resetDemoData = () => {
    localStorage.clear();
    setAllDocuments(initialDocuments);
    setCategories(initialCategories);
    setUsers(initialUsers);
    setAllActivities(initialActivities);
    setAdminLogs(initialAdminLogs);
    setAllNotifications(initialNotifications);
    setCurrentUser(null);
    setRole('User');
    showToast('Reset to original sample demo data! Please log in.', 'info');
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
        resetDemoData
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
