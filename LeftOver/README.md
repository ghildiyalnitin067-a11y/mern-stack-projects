# 🥗 LeftOver — Community Surplus Food Sharing Platform

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-green.svg?style=for-the-badge&logo=mongodb)](https://github.com/ghildiyalnitin067-a11y/mern-stack-projects)
[![React](https://img.shields.io/badge/Frontend-React_19-blue.svg?style=for-the-badge&logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-green.svg?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen.svg?style=for-the-badge&logo=mongodb)](https://www.mongodb.com)
[![Cloudinary](https://img.shields.io/badge/Storage-Cloudinary-blueviolet.svg?style=for-the-badge&logo=cloudinary)](https://cloudinary.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

> **LeftOver** is a full-stack MERN application engineered to bridge the gap between surplus food providers (restaurants, events, households) and local community recipients or NGOs. By providing real-time food tracking, interactive map discovery, Cloudinary-powered image uploads, OTP verification, and an administrative control panel, **LeftOver** empowers communities to reduce food waste efficiently.

---

## 🔗 Live Links & Demo Workspace

| Resource | Link / Status | Description |
| :--- | :--- | :--- |
| 🌐 **Live User Web App** | https://mern-stack-projects-c62o.vercel.app/ | Main user portal to browse, list, and claim surplus food |
| 🛡️ **Admin Dashboard** | https://mern-stack-projects-ua53.vercel.app/| Administrative moderation and analytics panel |

---

## ✨ Key Features

### 🍲 User & Donor Portal
* **Surplus Food Listing**: Post excess food with quantity, expiry timer, food type (Veg/Non-Veg), pick-up location, and photo attachments.
* **Smart Discover & Search**: Filter food items by category (Cooked Meals, Bakery, Produce, Pantry Staples), status, distance, or search query.
* **Interactive Map Integration**: Pinpoint food listings on interactive maps for convenient local pick-up.
* **Reservation & Claiming**: Reserve active food listings with instant status updates and donor notification.

### 🔐 Security & User Verification
* **JWT Authentication**: Secure token-based session management with protected API routes.
* **Bcrypt Hashing**: End-to-end password encryption.
* **OTP Email Verification**: Automated 6-digit OTP delivery powered by Nodemailer for verified user accounts.
* **Rate Limiting & Helmet**: Built-in HTTP header protection and rate limits to safeguard against spam and abuse.

### 📸 Cloudinary Media Storage
* Direct image upload service integrated into listing creation and user profile settings.
* Automatic image optimization and transformation delivery.

### 🛡️ Administrative Dashboard (`admin-frontend`)
* **KPI Analytics**: Track total claims, food saved, active listings, and community impact metrics.
* **Content Moderation**: Review, approve, or flag user listings and profiles.
* **System Reports**: Interactive tables with status filters and data export capabilities.

### 📱 Responsive & Dynamic Design
* **100% Mobile Responsive**: Mobile hamburger drawer, adaptive grids, responsive touch controls, and fluid container layouts.
* **Dark / Light Theme System**: Integrated theme toggle supporting user visual preference.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend Web App** | React 19, Vite, Vanilla CSS Design System, Lucide React Icons, React Hot Toast |
| **Admin Dashboard** | React, Vite, Custom Admin UI System, Dynamic Analytics Grid |
| **Backend Server** | Node.js, Express.js, JWT, BcryptJS, Nodemailer, Express Rate Limit, Helmet |
| **Database** | MongoDB, Mongoose ODM |
| **Cloud Services** | Cloudinary (Media Assets Storage & Management) |
| **Dev Tooling** | Nodemon, Oxlint, Git |

---

## 📂 Project Architecture

```
LeftOver/
├── backend/                  # Express REST API Server
│   ├── config/               # Database & Cloudinary configurations
│   ├── controllers/          # Business logic handlers (auth, food, upload, admin)
│   ├── middleware/           # Auth protection, error handlers, rate limiters
│   ├── models/               # Mongoose Schemas (User, Food, Reservation, OTP)
│   ├── routes/               # API endpoint route definitions
│   ├── utils/                # Nodemailer helpers, OTP generators
│   └── server.js             # Express app entry point
│
├── frontend/                 # User-facing React Application
│   ├── src/
│   │   ├── components/       # Common & feature components (Navbar, Footer, Modals)
│   │   ├── pages/            # Views (Home, Discover, Dashboard, FoodDetail, Mission)
│   │   ├── services/         # API integration services (axios / fetch calls)
│   │   ├── App.css           # Global & responsive layout styling
│   │   └── main.jsx          # React app entry point
│   └── vite.config.js
│
├── admin-frontend/           # Admin Management Panel
│   ├── src/                  # Admin UI components & management pages
│   └── vite.config.js
│
└── package.json              # Workspace root configuration
```

---

## ⚙️ Environment Setup

Create a `.env` file inside the `backend/` directory with the following environment variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/leftover?retryWrites=true&w=majority

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Email Service (Nodemailer OTP)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

# Cloudinary Integration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 🚀 Quick Start Guide

### 1. Clone the Repository
```bash
git clone https://github.com/ghildiyalnitin067-a11y/mern-stack-projects.git
cd mern-stack-projects/LeftOver
```

### 2. Setup & Launch Backend
```bash
cd backend
npm install
npm run dev
# Server will run on http://localhost:5000
```

### 3. Setup & Launch Frontend
```bash
# In a new terminal window:
cd frontend
npm install
npm run dev
# App will run on http://localhost:5173
```

### 4. Setup & Launch Admin Frontend (Optional)
```bash
# In a new terminal window:
cd admin-frontend
npm install
npm run dev
# Admin Portal will run on http://localhost:5174
```

---

## 🔌 API Reference Summary

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user & receive JWT |
| `POST` | `/api/auth/send-otp` | Private | Request 6-digit email OTP |
| `POST` | `/api/auth/verify-otp` | Private | Verify account with OTP |
| `GET` | `/api/food` | Public | Fetch food listings with filters |
| `POST` | `/api/food` | Private | Create a new food listing |
| `GET` | `/api/food/:id` | Public | Retrieve food listing details |
| `POST` | `/api/upload` | Private | Upload image file to Cloudinary |
| `GET` | `/api/admin/analytics` | Admin | Fetch admin dashboard analytics |

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve LeftOver, feel free to fork the repository and submit a pull request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Crafted with ❤️ by <strong>Nitin Ghildiyal</strong> & Community Contributors.
</p>
