# 🦣 TaskTusk - Local Service Marketplace

**TaskTusk** is a production-ready, full-stack **MERN** (MongoDB, Express, React, Node.js) web application that connects customers with verified local service professionals (Plumbing, Electrical, AC Repair, Cleaning, Salon/Beautician, Carpentry, and more).

It includes a **Customer Web App**, a **Service Provider Hub**, an **Admin Management Dashboard**, and a **Real-Time Backend API** powered by WebSockets.

---

## 🌐 Live Deployments

* **Frontend Web Application (Customer & Provider)**: [https://mern-stack-projects-pv2m.vercel.app/](https://mern-stack-projects-pv2m.vercel.app/)
* **Admin Dashboard**: [https://mern-stack-projects-57r6.vercel.app/](https://mern-stack-projects-57r6.vercel.app/)
* **Backend API Server**: [https://mern-stack-projects-2-cqtx.onrender.com](https://mern-stack-projects-2-cqtx.onrender.com)

---

## 🌟 Key Features

### 👤 Customer Features
* **Service Discovery & Search**: Filter services by category (Plumbing, AC Repair, Cleaning, etc.) or search dynamically.
* **Instant Booking**: Schedule date, time slot, and service address with real-time order creation.
* **Mock Checkout & Payment System**: Secure simulated checkout flow for order fulfillment.
* **Order History & Tracking**: Track status (`Pending`, `Accepted`, `Completed`, `Rejected`) live from the customer dashboard.

### 🛠️ Provider Hub Features
* **Service Catalog Management**: Add, update, or remove service listings (title, price, description, cover image).
* **Order Management**: Review incoming requests, accept/decline jobs, and mark jobs as completed once paid.
* **Real-time Notifications**: Socket.IO integration for instant payment and booking updates.
* **Earnings & Performance Metrics**: Real-time revenue tracking and completed job analytics.

### 🛡️ Admin Dashboard Features
* **Platform Analytics**: Total revenue, provider payouts, customer counts, and booking metrics.
* **User & Partner Administration**: Monitor all registered customers and service providers.
* **Global Booking Oversight**: Inspect and manage platform-wide booking operations.

### 🔒 Security & Reliability
* **Dual Authentication**: HTTP-Only SameSite cookies + Authorization Bearer header fallbacks for 100% reliability across cross-domain deployments (Vercel -> Render).
* **Reverse Proxy Trust**: Configured `trust proxy` setting for seamless Render load-balancer integration.
* **Security Headers & Rate Limiting**: Powered by **Helmet** and **Express Rate Limit**.

---

## 🛠️ Tech Stack

### Frontend & Admin Applications
* **Framework**: React 19 + Vite 8
* **Routing**: React Router DOM (v7)
* **Real-Time Communication**: Socket.io Client
* **UI & Micro-Animations**: Framer Motion, Lucide React Icons, Swiper
* **Notifications**: React Hot Toast

### Backend API
* **Runtime**: Node.js
* **Framework**: Express.js (v5)
* **Database**: MongoDB Atlas (with Mongoose ORM + Simulated Local JSON Fallback)
* **Real-Time**: Socket.IO Server
* **Authentication**: JSON Web Tokens (JWT), BcryptJS
* **Security**: Helmet, Express Rate Limit, CORS, Cookie-Parser

---

## 📁 Repository Structure

```text
TaskTusk/
├── Admin/                   # Admin Portal (React + Vite)
│   ├── src/
│   │   ├── api.js           # API fetch utility with Bearer Token header
│   │   ├── pages/           # Admin Dashboard & Admin Login
│   │   └── App.jsx          # Admin router & session verifier
│   ├── public/              # Static assets (logo, favicon)
│   └── package.json
│
├── Backend/                 # Express API Server
│   ├── controllers/         # Auth, Customer, Provider, Admin logic
│   ├── middleware/          # JWT Auth Guard middleware
│   ├── models/              # Mongoose schemas (User, Service, Booking)
│   ├── routes/              # Express Router endpoints
│   ├── db.js                # MongoDB Atlas connection & fallback JSON DB
│   ├── socket.js            # Socket.IO WebSocket server
│   ├── index.js             # Express entry point & middleware setup
│   └── package.json
│
├── Frontend/                # Customer & Provider App (React + Vite)
│   ├── src/
│   │   ├── api.js           # API fetch utility with Bearer Token header
│   │   ├── components/      # Reusable UI (Navbar, Footer, UserNotice)
│   │   ├── pages/           # Home, Services, Auth, Dashboards, Legal
│   │   └── App.jsx          # App router & session check
│   ├── public/              # Static assets & manifest files
│   └── package.json
│
└── README.md                # Project Documentation
```

---

## 🔑 Environment Variables

### Backend Configuration (`Backend/.env`)
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/tasktusk
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=production
CLIENT_URL=https://mern-stack-projects-pv2m.vercel.app
ADMIN_URL=https://mern-stack-projects-57r6.vercel.app
```

### Frontend Configuration (`Frontend/.env.production`)
```env
VITE_API_URL=https://mern-stack-projects-2-cqtx.onrender.com
```

### Admin Configuration (`Admin/.env.production`)
```env
VITE_API_URL=https://mern-stack-projects-2-cqtx.onrender.com
```

---

## ⚙️ Local Development Setup

### Prerequisites
* **Node.js** (v18.x or higher)
* **npm** (v9.x or higher)

### 1. Clone Repository
```bash
git clone https://github.com/ghildiyalnitin067-a11y/mern-stack-projects.git
cd mern-stack-projects/TaskTusk
```

### 2. Start Backend Server
```bash
cd Backend
npm install
npm run dev
```
*Backend will run on `http://localhost:5000`.*

### 3. Start Frontend Client
```bash
cd ../Frontend
npm install
npm run dev
```
*Frontend will run on `http://localhost:5173`.*

### 4. Start Admin Portal (Optional)
```bash
cd ../Admin
npm install
npm run dev
```
*Admin will run on `http://localhost:5174`.*

---

## 🔌 API Route Summary

| Route Path | Method | Access | Description |
| :--- | :--- | :--- | :--- |
| `/api/health` | `GET` | Public | System status and uptime check |
| `/api/auth/register` | `POST` | Public | Register new customer or provider account |
| `/api/auth/login` | `POST` | Public | Authenticate user & issue JWT |
| `/api/auth/me` | `GET` | Protected | Retrieve current session profile |
| `/api/customer/bookings` | `GET/POST` | Customer | Fetch or create customer bookings |
| `/api/provider/bookings` | `GET` | Provider | Fetch provider job requests |
| `/api/provider/services` | `GET/POST/PUT/DELETE` | Provider | Manage provider service catalog |
| `/api/admin/analytics` | `GET` | Admin | Fetch platform performance metrics |
| `/api/payments/checkout` | `POST` | Customer | Process mock payment for bookings |

---

## 🚀 Production Deployment Notes

* **Render (Backend)**: Ensure `trust proxy` is enabled (`app.set('trust proxy', 1)`).
* **Vercel (Frontend & Admin)**: Set `VITE_API_URL` to your Render API domain.
* **CORS & Cookies**: Preflight handling and wildcard Vercel matching (`*.vercel.app`) ensures cross-origin compatibility.
