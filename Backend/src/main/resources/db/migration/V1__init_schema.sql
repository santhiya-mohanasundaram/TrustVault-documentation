-- ===================================================================
-- TrustVault Database Initial Schema Migration
-- ===================================================================

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    mobile_number VARCHAR(25),
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    account_status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    avatar VARCHAR(500),
    email_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT FALSE,
    push_notifications BOOLEAN DEFAULT TRUE,
    expiry_threshold INT DEFAULT 30,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(20) DEFAULT '#0f766e',
    bg_color VARCHAR(20) DEFAULT '#ccfbf1',
    icon VARCHAR(50) DEFAULT 'FaFolder',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_category_name (category_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    document_name VARCHAR(200) NOT NULL,
    document_number_encrypted VARCHAR(500),
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    storage_path VARCHAR(500) NOT NULL,
    issue_date DATE,
    expiry_date DATE,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    INDEX idx_docs_user (user_id),
    INDEX idx_docs_category (category_id),
    INDEX idx_docs_expiry (expiry_date),
    INDEX idx_docs_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    document_id BIGINT NULL,
    notification_type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    scheduled_date DATE,
    sent_at TIMESTAMP NULL,
    read_status BOOLEAN DEFAULT FALSE,
    delivery_status VARCHAR(20) DEFAULT 'DELIVERED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE SET NULL,
    INDEX idx_notif_user (user_id),
    INDEX idx_notif_read (read_status),
    INDEX idx_notif_date (scheduled_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS activity_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NULL,
    activity_type VARCHAR(100) NOT NULL,
    document_id BIGINT NULL,
    document_name VARCHAR(200),
    category_name VARCHAR(100),
    description TEXT,
    ip_address VARCHAR(50),
    status VARCHAR(20) DEFAULT 'Success',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_activity_user (user_id),
    INDEX idx_activity_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Pre-populate Standard Document Categories
INSERT INTO categories (category_name, description, color, bg_color, icon) VALUES
('Aadhaar Card', 'Unique Identification Authority of India (UIDAI) Card', '#0f766e', '#ccfbf1', 'FaIdCard'),
('PAN Card', 'Permanent Account Number Income Tax Department Card', '#0284c7', '#e0f2fe', 'FaCreditCard'),
('Passport', 'Republic of India International Travel Document', '#4f46e5', '#e0e7ff', 'FaPassport'),
('Driving Licence', 'Regional Transport Office Motor Vehicle License', '#7c3aed', '#ede9fe', 'FaCar'),
('Educational Certificates', 'Academic Degrees, Diplomas, Marksheets & Transcripts', '#d97706', '#fef3c7', 'FaGraduationCap'),
('Bank Documents', 'Passbooks, Bank Statements, Cheques & Deposit Certificates', '#059669', '#d1fae5', 'FaUniversity'),
('Insurance Documents', 'Life, Health, Vehicle & Term Insurance Policy Bonds', '#dc2626', '#fee2e2', 'FaShieldAlt'),
('Other Documents', 'General Certificates, Warranties, Utility Bills & Receipts', '#4b5563', '#f3f4f6', 'FaFileAlt')
ON DUPLICATE KEY UPDATE description=VALUES(description);
