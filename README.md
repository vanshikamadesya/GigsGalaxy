# 🌌 Gig Galaxy — Freelancer Hiring Marketplace

A full-stack freelancer marketplace platform built with **Vue 3 / Quasar** on the frontend and **Node.js / Express / MongoDB** on the backend, with real-time communication via **Socket.IO**.

### Live Demo

- **Frontend:** [https://gigs-galaxy.vercel.app/](https://gigs-galaxy.vercel.app/)
- **Backend API:** [https://gigsgalaxy.onrender.com](https://gigsgalaxy.onrender.com)

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
├── backend/                              # Node.js Express API server
│   ├── src/
│   │   ├── config/                       # Database & app configuration
│   │   │   └── database.ts
│   │   ├── controllers/                  # Route handler logic
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
│   │   ├── middleware/                   # Express middleware
│   │   │   ├── auth.ts                   # JWT authentication guard
│   │   │   ├── errorHandler.ts           # Global error handler
│   │   │   └── upload.ts                 # Multer file upload config
│   │   ├── models/                       # Mongoose schemas
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
│   │   ├── routes/                       # Express route definitions
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
│   │   ├── scripts/                      # Utility scripts (e.g., DB seeding)
│   │   │   └── seed.ts
│   │   ├── utils/                        # Helper utilities
│   │   ├── server.ts                     # App entry point
│   │   └── socket.ts                     # Socket.IO setup
│   ├── uploads/                          # Uploaded files (gitignored)
│   ├── dist/                             # Compiled JS output (gitignored)
│   ├── .env                              # Backend environment variables
│   ├── .gitignore
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                             # Vue 3 / Quasar SPA
│   ├── src/
│   │   ├── boot/                         # Quasar boot files
│   │   │   ├── auth.ts
│   │   │   ├── axios.ts
│   │   │   ├── pinia.ts
│   │   │   └── socket.ts
│   │   ├── components/
│   │   │   ├── common/                   # Shared reusable components
│   │   │   │   ├── ChatWindow.vue
│   │   │   │   ├── DrawerItem.vue
│   │   │   │   ├── FreelancerCard.vue
│   │   │   │   ├── FreelancerListItem.vue
│   │   │   │   ├── GigCard.vue
│   │   │   │   ├── GigListItem.vue
│   │   │   │   ├── NotificationBell.vue
│   │   │   │   ├── OrderStatusStepper.vue
│   │   │   │   ├── PublicFooter.vue
│   │   │   │   ├── SearchFilters.vue
│   │   │   │   ├── StarRating.vue
│   │   │   │   └── StatCard.vue
│   │   │   └── freelancer/               # Freelancer-specific components
│   │   │       ├── CreateGigContent.vue
│   │   │       └── EarningsChart.vue
│   │   ├── composables/                  # Vue composables (shared logic)
│   │   │   ├── useForm.ts
│   │   │   ├── useInfiniteScroll.ts
│   │   │   ├── useNotify.ts
│   │   │   ├── usePagination.ts
│   │   │   └── useSearch.ts
│   │   ├── css/                          # Global SCSS styles
│   │   │   ├── app.scss
│   │   │   ├── components.scss
│   │   │   ├── global.scss
│   │   │   ├── home.scss
│   │   │   ├── layouts.scss
│   │   │   ├── pages-admin.scss
│   │   │   ├── pages-auth.scss
│   │   │   ├── pages-client.scss
│   │   │   ├── pages-freelancer.scss
│   │   │   ├── pages-public.scss
│   │   │   ├── quasar.variables.scss
│   │   │   └── variables.scss
│   │   ├── layouts/                      # App layout wrappers
│   │   │   ├── AdminLayout.vue
│   │   │   ├── AuthLayout.vue
│   │   │   ├── ClientLayout.vue
│   │   │   ├── FreelancerLayout.vue
│   │   │   └── PublicLayout.vue
│   │   ├── pages/                        # Route-level page components
│   │   │   ├── ErrorPage.vue
│   │   │   ├── admin/                    # Admin dashboard pages
│   │   │   ├── auth/                     # Login / Register pages
│   │   │   ├── client/                   # Client-facing pages
│   │   │   ├── freelancer/               # Freelancer-facing pages
│   │   │   └── public/                   # Public-facing pages
│   │   ├── router/                       # Vue Router configuration
│   │   │   ├── index.ts
│   │   │   └── routes.ts
│   │   ├── services/                     # Axios API service wrappers
│   │   │   ├── api.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── category.service.ts
│   │   │   ├── chat.service.ts
│   │   │   ├── dashboard.service.ts
│   │   │   ├── gig.service.ts
│   │   │   ├── notification.service.ts
│   │   │   ├── order.service.ts
│   │   │   ├── review.service.ts
│   │   │   ├── user.service.ts
│   │   │   └── wallet.service.ts
│   │   ├── stores/                       # Pinia state stores
│   │   │   ├── auth.store.ts
│   │   │   ├── chat.store.ts
│   │   │   ├── gig.store.ts
│   │   │   ├── notification.store.ts
│   │   │   ├── order.store.ts
│   │   │   ├── ui.store.ts
│   │   │   └── wallet.store.ts
│   │   ├── types/                        # TypeScript type definitions
│   │   │   ├── auth.ts
│   │   │   └── index.ts
│   │   ├── utils/                        # Frontend utility functions
│   │   │   ├── constants.ts
│   │   │   ├── helpers.ts
│   │   │   ├── logger.ts
│   │   │   └── validators.ts
│   │   ├── App.vue                       # Root Vue component
│   │   └── env.d.ts                      # Vite environment type declarations
│   ├── dist/                             # Build output (gitignored)
│   ├── .env                              # Frontend environment variables
│   ├── .env.example
│   ├── .gitignore
│   ├── .dockerignore
│   ├── .eslintrc.cjs                     # ESLint configuration
│   ├── .prettierrc                       # Prettier configuration
│   ├── Dockerfile
│   ├── nginx.conf                        # Nginx config for production
│   ├── vercel.json                       # Vercel deployment config
│   ├── index.html                        # HTML entry point
│   ├── package.json                      # Frontend dependencies & scripts
│   ├── quasar.config.ts                  # Quasar framework configuration
│   └── tsconfig.json                     # TypeScript configuration
│
├── Dockerfile                            # Root Dockerfile (for Render)
├── docker-compose.yml                    # Docker Compose for full stack
├── .gitignore
└── README.md
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
VITE_API_TIMEOUT=30000
VITE_LOG_LEVEL=info
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
cd frontend
npm install
```
*(Note: Ensure you are in the `frontend` or root directory depending on your structure. Typically, dependencies for Quasar are in the `frontend` folder.)*

#### Backend

```bash
cd backend
npm install
```

---

### 4. Database Setup & Seeding

Before running the application, you need to seed the database with initial categories, roles, and test users to ensure the platform works correctly. 

Make sure your MongoDB instance is running (locally or via Atlas) and that your `backend/.env` is configured correctly.

```bash
cd backend
npm run seed
```
*This will execute the `src/scripts/seed.ts` script to populate your database with essential default data.*

---

### 5. Run the Development Servers

Open **two terminals** and run each concurrently:

**Terminal 1 — Backend API:**
```bash
cd backend
npm run dev
# Starts API server on http://localhost:3000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# Starts Quasar dev server on http://localhost:9000
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
