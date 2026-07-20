# 🦣 TaskTusk - Local Service Marketplace

TaskTusk is a modern, premium web application built on the **MERN** stack that serves as a marketplace for local services. It connects clients with skilled professionals (Plumbers, Electricians, Cleaners, Tutors, Carpenters, Gardeners) in their immediate vicinity, allowing quick searches, availability checks, and streamlined bookings.

---

## 🚀 Key Features

*   **Sleek, Premium UI/UX:** Developed with high-quality CSS variables, custom typography (Inter), glassmorphism, responsive grids, and subtle shadows.
*   **Smooth Animations & Transitions:** Powered by **Framer Motion** for micro-interactions, spring animations, and responsive hover effects.
*   **Dynamic Categories:** Easy service discovery categorized by categories like Plumbing, Electrical, Cleaning, Tutoring, Carpentry, and Gardening.
*   **Real-time Search:** High-performance, client-side filtering to search for specific services or providers.
*   **Toast Notifications:** Real-time feedback on actions (like booking requests, search operations) using **React Hot Toast**.
*   **Lightweight Backend API:** Express-powered backend server with modular route structures and service uptime/health checks.

---

## 🛠️ Tech Stack

### Frontend
*   **Library:** React 19
*   **Build Tool:** Vite
*   **Router:** React Router DOM (v7)
*   **Animations:** Framer Motion (v12)
*   **Linter:** Oxlint (Oxc ecosystem for ultra-fast checks)
*   **Icons:** Lucide React
*   **Sliders:** Swiper

### Backend
*   **Framework:** Express.js (v5)
*   **Runtime:** Node.js
*   **Dev Tool:** Nodemon (for hot reloading)
*   **Configuration:** Cors, Dotenv

---

## 📁 Repository Structure

```text
TaskTusk/
├── Backend/               # Express.js Server
│   ├── .env.example       # Example environment configuration
│   ├── index.js           # Server entry point
│   ├── package.json       # Backend dependencies & scripts
│   └── node_modules/      # Ignored by git
│
├── Frontend/              # React + Vite Client
│   ├── src/
│   │   ├── components/    # Reusable UI components (Navbar, Footer, etc.)
│   │   ├── pages/         # Page components (Home, Testimonials, etc.)
│   │   ├── App.jsx        # Main React container with Routing
│   │   ├── main.jsx       # React entry point
│   │   └── index.css      # Custom design tokens & root CSS
│   ├── vite.config.js     # Vite configuration
│   ├── package.json       # Frontend dependencies & scripts
│   └── node_modules/      # Ignored by git
│
├── .gitignore             # Root gitignore rules
└── README.md              # Main project documentation
```

---

## ⚙️ Getting Started & Setup

### Prerequisites
*   [Node.js](https://nodejs.org/) (v18.x or higher recommended)
*   [npm](https://www.npmjs.com/) (bundled with Node.js)

### 1. Clone & Project Initialization
Navigate to your workspace directory and open your terminal.

### 2. Backend Setup
1. Change directory to [Backend](file:///c:/Users/lenovo/OneDrive/Desktop/MERN%20Project/TaskTusk/Backend):
    ```bash
    cd Backend
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Create your `.env` configuration:
    ```bash
    cp .env.example .env
    ```
4. Run the development server (runs by default on `http://localhost:5000`):
    ```bash
    npm run dev
    ```

### 3. Frontend Setup
1. Change directory to [Frontend](file:///c:/Users/lenovo/OneDrive/Desktop/MERN%20Project/TaskTusk/Frontend):
    ```bash
    cd ../Frontend
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Run the development server (runs by default on `http://localhost:5173`):
    ```bash
    npm run dev
    ```

---

## 🔌 API Endpoints (Backend)

The backend provides simple endpoints:
*   **GET** `/api/health` - Checks the server uptime status and returns a JSON payload containing the server status.

---

## 🧹 Quality Control

*   **Linting:** The frontend uses **Oxlint** for lightning-fast analysis:
    ```bash
    cd Frontend
    npm run lint
    ```
