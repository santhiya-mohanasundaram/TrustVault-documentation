// Initial seed data for TrustVault Demo Frontend

export const initialCategories = [
  {
    id: 'aadhaar',
    name: 'Aadhaar Card',
    description: 'National biometric identity document for Indian citizens',
    icon: 'FaIdCard',
    color: '#0f766e',
    bgColor: '#ccfbf1',
    count: 1
  },
  {
    id: 'pan',
    name: 'PAN Card',
    description: 'Permanent Account Number issued by Income Tax Department',
    icon: 'FaAddressCard',
    color: '#0d9488',
    bgColor: '#e6fffa',
    count: 1
  },
  {
    id: 'passport',
    name: 'Passport',
    description: 'Official international travel document and identity proof',
    icon: 'FaPassport',
    color: '#0284c7',
    bgColor: '#e0f2fe',
    count: 1
  },
  {
    id: 'driving',
    name: 'Driving Licence',
    description: 'Official permit authorized for driving motor vehicles',
    icon: 'FaCar',
    color: '#16a34a',
    bgColor: '#dcfce7',
    count: 1
  },
  {
    id: 'education',
    name: 'Educational Certificates',
    description: 'Degree, diploma, 10th/12th marksheets and transcripts',
    icon: 'FaGraduationCap',
    color: '#7c3aed',
    bgColor: '#ede9fe',
    count: 1
  },
  {
    id: 'bank',
    name: 'Bank Documents',
    description: 'Bank passbook, cancelled cheques, and account statements',
    icon: 'FaUniversity',
    color: '#d97706',
    bgColor: '#fef3c7',
    count: 1
  },
  {
    id: 'insurance',
    name: 'Insurance Documents',
    description: 'Health, motor, life, and personal accident policies',
    icon: 'FaShieldAlt',
    color: '#dc2626',
    bgColor: '#fee2e2',
    count: 2
  },
  {
    id: 'other',
    name: 'Other Documents',
    description: 'Rental agreement, utility bills, receipts and warranties',
    icon: 'FaFolderOpen',
    color: '#64748b',
    bgColor: '#f1f5f9',
    count: 1
  }
];

export const initialDocuments = [
  {
    id: 'doc-1',
    userId: 'USR-101',
    name: 'Aadhaar Card - Original e-Aadhaar',
    category: 'Aadhaar Card',
    categoryId: 'aadhaar',
    documentNumber: 'XXXX-XXXX-4921',
    issueDate: '2020-05-12',
    expiryDate: '',
    status: 'Active',
    fileType: 'PDF',
    fileSize: '1.4 MB',
    description: 'Government issued unique 12-digit identity proof copy with QR code verification.',
    uploadDate: '2026-01-18',
    lastModified: '2026-01-18 10:30 AM',
    tags: ['Identity', 'Govt', 'Official']
  },
  {
    id: 'doc-2',
    userId: 'USR-101',
    name: 'PAN Card Digital Copy',
    category: 'PAN Card',
    categoryId: 'pan',
    documentNumber: 'ABCDE1234F',
    issueDate: '2019-08-20',
    expiryDate: '',
    status: 'Active',
    fileType: 'PNG',
    fileSize: '820 KB',
    description: 'Income Tax Department PAN for financial and tax filing needs.',
    uploadDate: '2026-02-04',
    lastModified: '2026-02-04 03:15 PM',
    tags: ['Tax', 'Finance']
  },
  {
    id: 'doc-3',
    userId: 'USR-101',
    name: 'Republic of India Passport',
    category: 'Passport',
    categoryId: 'passport',
    documentNumber: 'Z8924011',
    issueDate: '2016-12-15',
    expiryDate: '2026-12-15',
    status: 'Expiring Soon',
    fileType: 'PDF',
    fileSize: '3.2 MB',
    description: '36-page regular international passport booklet. Renewal recommended within 30 days.',
    uploadDate: '2026-02-10',
    lastModified: '2026-02-10 11:45 AM',
    tags: ['Travel', 'Passport', 'Visa']
  },
  {
    id: 'doc-4',
    userId: 'USR-101',
    name: 'Smart Card Driving Licence',
    category: 'Driving Licence',
    categoryId: 'driving',
    documentNumber: 'KA-01-2015-0082914',
    issueDate: '2015-03-24',
    expiryDate: '2030-03-24',
    status: 'Active',
    fileType: 'JPG',
    fileSize: '1.1 MB',
    description: 'LMV + MCWG driving permit issued by RTO Bangalore Central.',
    uploadDate: '2026-02-12',
    lastModified: '2026-02-12 04:00 PM',
    tags: ['Vehicle', 'Transport']
  },
  {
    id: 'doc-5',
    userId: 'USR-101',
    name: 'B.Tech Degree Certificate & Transcripts',
    category: 'Educational Certificates',
    categoryId: 'education',
    documentNumber: 'DEG/2022/CS-492',
    issueDate: '2022-07-10',
    expiryDate: '',
    status: 'Active',
    fileType: 'PDF',
    fileSize: '4.8 MB',
    description: 'Computer Science and Engineering graduation degree certificate and final grade sheet.',
    uploadDate: '2026-02-14',
    lastModified: '2026-02-14 02:20 PM',
    tags: ['Academic', 'University']
  },
  {
    id: 'doc-6',
    userId: 'USR-101',
    name: 'Star Health Comprehensive Insurance',
    category: 'Insurance Documents',
    categoryId: 'insurance',
    documentNumber: 'P/191214/01/2026/001',
    issueDate: '2025-10-31',
    expiryDate: '2026-10-30',
    status: 'Expired',
    fileType: 'PDF',
    fileSize: '2.4 MB',
    description: 'Family health floater coverage plan policy document with cashless card. Needs urgent renewal.',
    uploadDate: '2026-01-10',
    lastModified: '2026-10-30 11:59 PM',
    tags: ['Health', 'Insurance', 'Medical']
  },
  {
    id: 'doc-7',
    userId: 'USR-101',
    name: 'HDFC Bank Passbook & Account Details',
    category: 'Bank Documents',
    categoryId: 'bank',
    documentNumber: 'A/C 501004928190',
    issueDate: '2024-01-05',
    expiryDate: '',
    status: 'Active',
    fileType: 'PDF',
    fileSize: '1.9 MB',
    description: 'Primary salary savings account verified statement with IFSC and MICR codes.',
    uploadDate: '2026-02-15',
    lastModified: '2026-02-15 09:10 AM',
    tags: ['Banking', 'Statements']
  },
  {
    id: 'doc-8',
    userId: 'USR-101',
    name: 'Max Life Super Term Plan',
    category: 'Insurance Documents',
    categoryId: 'insurance',
    documentNumber: 'MLI-90182746',
    issueDate: '2023-01-15',
    expiryDate: '2045-01-14',
    status: 'Active',
    fileType: 'PDF',
    fileSize: '2.1 MB',
    description: 'Term life cover with accidental death benefit endorsement policy schedule.',
    uploadDate: '2026-02-16',
    lastModified: '2026-02-16 01:40 PM',
    tags: ['Life Insurance', 'Protection']
  },
  {
    id: 'doc-9',
    userId: 'USR-101',
    name: 'Residential Apartment Lease Agreement',
    category: 'Other Documents',
    categoryId: 'other',
    documentNumber: 'REG-AGR-2026-88',
    issueDate: '2026-01-01',
    expiryDate: '2026-11-30',
    status: 'Expiring Soon',
    fileType: 'PDF',
    fileSize: '5.6 MB',
    description: 'Notarized 11-month rental lease deed with security deposit receipt.',
    uploadDate: '2026-01-02',
    lastModified: '2026-01-02 05:00 PM',
    tags: ['Legal', 'Lease', 'Housing']
  }
];

export const initialUsers = [
  {
    id: 'USR-101',
    name: 'Sathish Kumar',
    email: 'sathish@trustvault.io',
    phone: '+91 98765 43210',
    password: 'demo1234',
    role: 'User',
    status: 'Active',
    registrationDate: '2026-01-15',
    documentsCount: 9,
    storageUsed: '23.4 MB',
    lastLogin: 'Today, 03:45 PM',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
    notificationPreferences: {
      email: true,
      sms: false,
      push: true,
      expiryThreshold: '30'
    }
  },
  {
    id: 'USR-102',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '+91 98234 56789',
    password: 'demo1234',
    role: 'User',
    status: 'Active',
    registrationDate: '2026-01-20',
    documentsCount: 0,
    storageUsed: '0 MB',
    lastLogin: 'Yesterday, 11:20 AM',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80',
    notificationPreferences: {
      email: true,
      sms: false,
      push: true,
      expiryThreshold: '30'
    }
  },
  {
    id: 'USR-103',
    name: 'Rahul Verma',
    email: 'rahul.verma@example.com',
    phone: '+91 97123 45678',
    password: 'demo1234',
    role: 'User',
    status: 'Active',
    registrationDate: '2026-02-01',
    documentsCount: 0,
    storageUsed: '0 MB',
    lastLogin: '3 days ago',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
    notificationPreferences: {
      email: true,
      sms: false,
      push: true,
      expiryThreshold: '30'
    }
  },
  {
    id: 'USR-104',
    name: 'Ananya Iyer',
    email: 'ananya.iyer@example.com',
    phone: '+91 96543 21098',
    password: 'demo1234',
    role: 'User',
    status: 'Suspended',
    registrationDate: '2026-02-08',
    documentsCount: 0,
    storageUsed: '0 MB',
    lastLogin: '1 week ago',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80',
    notificationPreferences: {
      email: true,
      sms: false,
      push: true,
      expiryThreshold: '30'
    }
  },
  {
    id: 'USR-105',
    name: 'Vikram Singh',
    email: 'vikram.singh@example.com',
    phone: '+91 95432 10987',
    password: 'demo1234',
    role: 'User',
    status: 'Active',
    registrationDate: '2026-02-12',
    documentsCount: 0,
    storageUsed: '0 MB',
    lastLogin: 'Today, 09:15 AM',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80',
    notificationPreferences: {
      email: true,
      sms: false,
      push: true,
      expiryThreshold: '30'
    }
  },
  {
    id: 'ADM-001',
    name: 'Admin System',
    email: 'admin@trustvault.io',
    phone: '+91 90000 00001',
    password: 'admin1234',
    role: 'Admin',
    status: 'Active',
    registrationDate: '2025-12-01',
    documentsCount: 0,
    storageUsed: 'System',
    lastLogin: 'Just now',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80'
  }
];

export const initialActivities = [
  {
    id: 'act-1',
    userId: 'USR-101',
    type: 'Document Uploaded',
    documentName: 'Residential Apartment Lease Agreement',
    user: 'Sathish Kumar',
    timestamp: '2026-11-24 03:15 PM',
    status: 'Success',
    category: 'Other Documents'
  },
  {
    id: 'act-2',
    userId: 'USR-101',
    type: 'Document Viewed',
    documentName: 'Republic of India Passport',
    user: 'Sathish Kumar',
    timestamp: '2026-11-24 02:40 PM',
    status: 'Success',
    category: 'Passport'
  },
  {
    id: 'act-3',
    userId: 'USR-101',
    type: 'Document Downloaded',
    documentName: 'Aadhaar Card - Original e-Aadhaar',
    user: 'Sathish Kumar',
    timestamp: '2026-11-23 05:20 PM',
    status: 'Success',
    category: 'Aadhaar Card'
  },
  {
    id: 'act-4',
    userId: 'USR-101',
    type: 'Document Updated',
    documentName: 'Smart Card Driving Licence',
    user: 'Sathish Kumar',
    timestamp: '2026-11-22 11:10 AM',
    status: 'Success',
    category: 'Driving Licence'
  },
  {
    id: 'act-5',
    userId: 'USR-101',
    type: 'Document Viewed',
    documentName: 'Star Health Comprehensive Insurance',
    user: 'Sathish Kumar',
    timestamp: '2026-11-21 04:30 PM',
    status: 'Warning',
    category: 'Insurance Documents'
  },
  {
    id: 'act-6',
    userId: 'USR-101',
    type: 'Document Uploaded',
    documentName: 'Max Life Super Term Plan',
    user: 'Sathish Kumar',
    timestamp: '2026-11-20 01:45 PM',
    status: 'Success',
    category: 'Insurance Documents'
  },
  {
    id: 'act-7',
    userId: 'USR-101',
    type: 'Document Deleted',
    documentName: 'Old Electricity Bill Oct 2025',
    user: 'Sathish Kumar',
    timestamp: '2026-11-18 10:05 AM',
    status: 'Info',
    category: 'Other Documents'
  }
];

export const initialAdminLogs = [
  {
    id: 'sys-101',
    event: 'User Login',
    user: 'sathish@trustvault.io',
    action: 'Successful Authentication (User Portal)',
    ip: '192.168.1.42',
    timestamp: '2026-11-24 03:45 PM',
    status: 'Success'
  },
  {
    id: 'sys-102',
    event: 'Document Upload',
    user: 'sathish@trustvault.io',
    action: 'Encrypted token storage for doc ID: doc-9',
    ip: '192.168.1.42',
    timestamp: '2026-11-24 03:15 PM',
    status: 'Success'
  },
  {
    id: 'sys-103',
    event: 'Account Status Change',
    user: 'admin@trustvault.io',
    action: 'Status updated to Suspended for User USR-104',
    ip: '10.0.0.1',
    timestamp: '2026-11-23 04:00 PM',
    status: 'Warning'
  },
  {
    id: 'sys-104',
    event: 'User Registration',
    user: 'vikram.singh@example.com',
    action: 'New user account created with 2FA prompt',
    ip: '192.168.4.11',
    timestamp: '2026-11-22 09:15 AM',
    status: 'Success'
  },
  {
    id: 'sys-105',
    event: 'Category Created',
    user: 'admin@trustvault.io',
    action: 'New category "Educational Certificates" added',
    ip: '10.0.0.1',
    timestamp: '2026-11-20 02:00 PM',
    status: 'Info'
  }
];

export const initialNotifications = [
  {
    id: 'notif-1',
    userId: 'USR-101',
    title: 'Passport Expiry Alert (Action Needed)',
    description: 'Your Republic of India Passport (Z8924011) expires on 15 Dec 2026. Schedule renewal to avoid travel delays.',
    date: '2026-11-24 09:00 AM',
    isRead: false,
    type: 'warning',
    docId: 'doc-3'
  },
  {
    id: 'notif-2',
    userId: 'USR-101',
    title: 'Health Insurance Expired',
    description: 'Star Health Comprehensive Insurance expired on 30 Oct 2026. Renew your policy to maintain cashless hospitalization benefit.',
    date: '2026-11-20 10:15 AM',
    isRead: false,
    type: 'danger',
    docId: 'doc-6'
  },
  {
    id: 'notif-3',
    userId: 'USR-101',
    title: 'Document Upload Verified',
    description: 'Residential Apartment Lease Agreement was uploaded and 256-bit client-side verified successfully.',
    date: '2026-11-19 03:18 PM',
    isRead: true,
    type: 'success',
    docId: 'doc-9'
  },
  {
    id: 'notif-4',
    userId: 'USR-101',
    title: 'Rental Agreement Expiry Reminder',
    description: 'Your Residential Apartment Lease Agreement expires on 30 Nov 2026 (in 6 days).',
    date: '2026-11-18 08:30 AM',
    isRead: false,
    type: 'warning',
    docId: 'doc-9'
  },
  {
    id: 'notif-5',
    userId: 'USR-101',
    title: 'Welcome to TrustVault!',
    description: 'Welcome to your smart personal document vault. Start organizing and tagging your vital certificates today.',
    date: '2026-11-01 12:00 PM',
    isRead: true,
    type: 'info',
    docId: null
  }
];
