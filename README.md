# TrustVault – Smart Personal Document Manager

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

TrustVault is a modern, responsive, and secure personal document management platform built with React, Bootstrap 5, React Router, and React Icons. It empowers individuals to organize, categorize, and track expiration dates for their vital personal and financial records.

---

## 🌟 Key Highlights

- **Dual Independent Portals:** Completely separate, role-governed User Dashboard and Executive Admin Console.
- **Dynamic Identity & Session Management:** Multi-user registration, authenticated sessions, and isolated per-user vaults.
- **Smart Expiry Tracking:** Real-time monthly calendar view with color-coded status badges (Active, Expiring Soon, Expired).
- **Modern Drag-and-Drop Upload:** Cloud upload zone with simulated progress bar, file validation, and format support (PDF, JPG, JPEG, PNG).
- **Proactive Notification Center:** In-app alert system with filterable categories and bulk read/clear actions.
- **Comprehensive Audit Trail:** Timestamped activity history tracking uploads, downloads, views, and edits.
- **Zero-Knowledge Privacy Sandbox:** Anonymized administrative oversight that preserves client-side tokenization.

---

## 📁 Project Structure

```
TrustVault/
├── .gitignore
├── README.md
└── Frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    ├── src/
    │   ├── main.jsx
    │   ├── App.jsx
    │   ├── context/
    │   │   └── AppContext.jsx          # Central state & localStorage engine
    │   ├── data/
    │   │   └── initialData.js         # Seed database (users, docs, categories)
    │   ├── components/
    │   │   ├── common/                # Navbar, Footer, Charts, Modals, StatCards
    │   │   ├── user/                  # UserLayout, UserSidebar
    │   │   └── admin/                 # AdminLayout, AdminSidebar
    │   ├── pages/
    │   │   ├── public/                # HomePage, LoginPage, RegisterPage
    │   │   ├── user/                  # UserDashboard, MyDocuments, Upload, Calendar...
    │   │   └── admin/                 # AdminDashboard, Users, Statistics, Activity...
    │   └── styles/
    │       └── custom.css             # Theme tokens, dark teal & emerald styling
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.0 or higher recommended)
- npm or yarn

### Installation & Run

1. Clone the repository:
   ```bash
   git clone https://github.com/santhiya-mohanasundaram/TrustVault-documentation.git
   cd TrustVault-documentation
   ```

2. Navigate to Frontend and install dependencies:
   ```bash
   cd Frontend
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Open your browser at `http://127.0.0.1:3000/`.

---

## 🔐 Demo Credentials

- **User Demo:** `sathish@trustvault.io` / `demo1234` (Role: User)
- **Admin Demo:** `admin@trustvault.io` / `admin1234` (Role: Admin)
- *Or register any new account with your own name, email, and password to test private data isolation.*
