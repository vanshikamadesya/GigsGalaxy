# 🌌 Gig Galaxy — Freelancer Hiring Marketplace

A full-stack freelancer marketplace platform built with **Vue 3 / Quasar** on the frontend and **Node.js / Express / MongoDB** on the backend, with real-time communication via **Socket.IO**.

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Environment Configuration](#2-environment-configuration)
  - [3. Install Dependencies](#3-install-dependencies)
  - [4. Run the Development Servers](#4-run-the-development-servers)
- [Running with Docker](#-running-with-docker)
- [Available Scripts](#-available-scripts)
- [API Overview](#-api-overview)
- [Database Models](#-database-models)
- [Folder Structure](#-folder-structure)
- [Contributing](#-contributing)

---

## 🛠 Tech Stack

| Layer       | Technology                                      |
|-------------|--------------------------------------------------|
| Frontend    | Vue 3, Quasar Framework, TypeScript, Pinia       |
| Backend     | Node.js, Express.js, TypeScript                  |
| Database    | MongoDB (Mongoose ODM)                           |
| Auth        | JWT (Access + Refresh Tokens), bcryptjs          |
| Real-time   | Socket.IO                                        |
| File Upload | Multer                                           |
| Styling     | SCSS, Quasar Components                          |
| Tooling     | ESLint, Prettier, ts-node                        |
| DevOps      | Docker, Docker Compose                           |

---

## 📁 Project Structure

```
gig-galaxy/
├── backend/                          # Node.js Express API server
│   ├── src/
│   │   ├── config/                   # Database & app configuration
│   │   ├── controllers/              # Route handler logic
│   │   │   ├── authController.ts
│   │   │   ├── categoryController.ts
│   │   │   ├── chatController.ts
│   │   │   ├── dashboardController.ts
│   │   │   ├── gigController.ts
│   │   │   ├── notificationController.ts
│   │   │   ├── orderController.ts
│   │   │   ├── reviewController.ts
│   │   │   ├── userController.ts
│   │   │   └── walletController.ts
│   │   ├── middleware/               # Express middleware
│   │   │   ├── auth.ts               # JWT authentication guard
│   │   │   ├── errorHandler.ts       # Global error handler
│   │   │   └── upload.ts             # Multer file upload config
│   │   ├── models/                   # Mongoose schemas
│   │   │   ├── Category.ts
│   │   │   ├── Chat.ts
│   │   │   ├── Conversation.ts
│   │   │   ├── Gig.ts
│   │   │   ├── Notification.ts
│   │   │   ├── Order.ts
│   │   │   ├── Portfolio.ts
│   │   │   ├── Review.ts
│   │   │   ├── User.ts
│   │   │   ├── Wallet.ts
│   │   │   └── WithdrawRequest.ts
│   │   ├── routes/                   # Express route definitions
│   │   │   ├── admin.ts
│   │   │   ├── auth.ts
│   │   │   ├── categories.ts
│   │   │   ├── chat.ts
│   │   │   ├── dashboard.ts
│   │   │   ├── gigs.ts
│   │   │   ├── notifications.ts
│   │   │   ├── orders.ts
│   │   │   ├── reviews.ts
│   │   │   ├── users.ts
│   │   │   └── wallet.ts
│   │   ├── scripts/                  # Utility scripts (e.g., DB seeding)
│   │   ├── utils/                    # Helper utilities
│   │   ├── server.ts                 # App entry point
│   │   └── socket.ts                 # Socket.IO setup
│   ├── uploads/                      # Uploaded files (gitignored)
│   ├── dist/                         # Compiled JS output (gitignored)
│   ├── .env                          # Backend environment variables
│   ├── .gitignore
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── src/                              # Quasar/Vue 3 frontend source
│   ├── boot/                         # Quasar boot files (axios, plugins)
│   ├── components/
│   │   ├── common/                   # Shared reusable components
│   │   └── freelancer/               # Freelancer-specific components
│   ├── composables/                  # Vue composables (shared logic)
│   ├── css/                          # Global CSS / SCSS
│   ├── i18n/                         # Internationalization files
│   ├── layouts/                      # App layout wrappers
│   ├── pages/                        # Route-level page components
│   │   ├── admin/                    # Admin dashboard pages
│   │   ├── auth/                     # Login / Register pages
│   │   ├── client/                   # Client-facing pages
│   │   ├── freelancer/               # Freelancer-facing pages
│   │   └── public/                   # Public-facing pages
│   ├── router/                       # Vue Router configuration
│   ├── services/                     # Axios API service wrappers
│   ├── stores/                       # Pinia state stores
│   │   ├── auth.store.ts
│   │   ├── chat.store.ts
│   │   ├── gig.store.ts
│   │   ├── notification.store.ts
│   │   ├── order.store.ts
│   │   ├── ui.store.ts
│   │   └── wallet.store.ts
│   ├── styles/                       # Additional SCSS styles
│   ├── types/                        # TypeScript type definitions
│   ├── utils/                        # Frontend utility functions
│   ├── App.vue                       # Root Vue component
│   └── env.d.ts                      # Vite environment type declarations
│
├── .env                              # Frontend environment variables
├── .eslintrc.cjs                     # ESLint configuration
├── .gitignore
├── .prettierrc                       # Prettier configuration
├── docker-compose.yml                # Docker Compose for full stack
├── Dockerfile                        # Frontend Docker image
├── index.html                        # HTML entry point
├── package.json                      # Frontend dependencies & scripts
├── quasar.config.ts                  # Quasar framework configuration
└── tsconfig.json                     # TypeScript configuration
```

---

## ✅ Prerequisites

Make sure you have the following installed:

| Tool            | Version          | Notes                          |
|-----------------|------------------|--------------------------------|
| Node.js         | >=22.22.0 (frontend) / >=20.0.0 (backend) | Required for both frontend & backend |
| npm             | `>= 6.13.4`      | Comes with Node.js             |
| Quasar CLI      | Latest           | `npm install -g @quasar/cli`   |
| MongoDB         | Atlas or Local   | Cloud URI recommended          |
| Docker          | Latest           | Only for Docker setup          |
| Docker Compose  | Latest           | Only for Docker setup          |

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/gig-galaxy.git
cd gig-galaxy
```

---

### 2. Environment Configuration

#### Frontend — `.env` (root directory)

Create a `.env` file in the project root:

```env
VITE_APP_NAME=GigGalaxy
VITE_API_BASE_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
VITE_APP_VERSION=1.0.0
```

#### Backend — `backend/.env`

Create a `.env` file inside the `backend/` directory:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/gig-galaxy?appName=Cluster0
JWT_SECRET=your-strong-jwt-secret
JWT_EXPIRE=7d
REFRESH_TOKEN_SECRET=your-strong-refresh-secret
REFRESH_TOKEN_EXPIRE=30d
```

> ⚠️ **Never commit `.env` files with real secrets to version control.**

---

### 3. Install Dependencies

#### Frontend

```bash
# From the project root
npm install
```

#### Backend

```bash
cd backend
npm install
```

---

### 4. Run the Development Servers

Open **two terminals** and run each concurrently:

**Terminal 1 — Backend API:**
```bash
cd backend
npm run dev
# Starts on http://localhost:3000
```

**Terminal 2 — Frontend:**
```bash
# From project root
npm run dev
# Starts on http://localhost:9000
```

---

## 🐳 Running with Docker

Make sure Docker and Docker Compose are installed, then from the project root:

```bash
docker compose up --build
```

This will spin up:
- **Backend** → `http://localhost:3000`
- **Frontend** → `http://localhost:9000`

Both services share the `gig-galaxy-network` Docker bridge network.

To stop the containers:
```bash
docker-compose down
```

---

## 📜 Available Scripts

### Frontend (project root)

| Command           | Description                          |
|-------------------|--------------------------------------|
| `npm run dev`     | Start Quasar dev server              |
| `npm run build`   | Build for production                 |
| `npm run lint`    | Lint `.js`, `.ts`, `.vue` files      |
| `npm run format`  | Format source files with Prettier    |
| `npm run type-check` | Run TypeScript type checking      |

### Backend (`/backend`)

| Command           | Description                          |
|-------------------|--------------------------------------|
| `npm run dev`     | Start API server with ts-node        |
| `npm run build`   | Compile TypeScript to JavaScript     |
| `npm start`       | Start compiled production server     |
| `npm run seed`    | Seed the database with initial data  |

---

## 🔌 API Overview

The backend API is mounted at `/api`. The following route groups are available:

| Route Prefix              | Description                          |
|---------------------------|--------------------------------------|
| `POST /api/auth/...`      | Register, Login, Refresh Token       |
| `GET/PUT /api/users/...`  | User profile, portfolios             |
| `GET/POST /api/gigs/...`  | Gig listings, search, management     |
| `GET/POST /api/orders/...`| Order placement and management       |
| `GET/POST /api/reviews/...`| Reviews and ratings                 |
| `GET/POST /api/chat/...`  | Conversations and messages           |
| `GET /api/notifications/..`| User notifications                  |
| `GET/POST /api/wallet/...`| Wallet balance and withdrawals       |
| `GET /api/categories/...` | Gig categories                       |
| `GET /api/dashboard/...`  | Dashboard stats (admin/user)         |
| `GET /api/admin/...`      | Admin management endpoints           |

---

## 🗃 Database Models

| Model             | Description                                     |
|-------------------|-------------------------------------------------|
| `User`            | Freelancer & client accounts, roles, profiles  |
| `Gig`             | Service listings posted by freelancers         |
| `Order`           | Orders placed by clients for gigs              |
| `Review`          | Ratings and feedback on completed orders       |
| `Chat`            | Chat messages between users                    |
| `Conversation`    | Chat thread between two users                  |
| `Notification`    | In-app notification records                    |
| `Category`        | Gig categories and sub-categories              |
| `Portfolio`       | Freelancer portfolio items                     |
| `Wallet`          | User wallet balance and transaction history    |
| `WithdrawRequest` | Freelancer withdrawal requests                 |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please follow the existing code style enforced by ESLint and Prettier.

---
