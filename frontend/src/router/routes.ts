import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  // ──────────────────────────────────────────
  // Public Layout
  // ──────────────────────────────────────────
  {
    path: '/',
    component: () => import('src/layouts/PublicLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('src/pages/public/HomePage.vue'),
        meta: { title: 'Home' }
      },
      {
        path: 'categories',
        name: 'categories',
        component: () => import('src/pages/public/CategoriesPage.vue'),
        meta: { title: 'Browse Categories' }
      },
      {
        path: 'categories/:slug',
        name: 'category-detail',
        component: () => import('src/pages/public/CategoryDetailPage.vue'),
        meta: { title: 'Category' }
      },
      {
        path: 'freelancers',
        name: 'freelancers',
        component: () => import('src/pages/public/FreelancersPage.vue'),
        meta: { title: 'Browse Freelancers' }
      },
      {
        path: 'freelancers/:username',
        name: 'freelancer-profile',
        component: () => import('src/pages/public/FreelancerProfilePage.vue'),
        meta: { title: 'Freelancer Profile' }
      },
      {
        path: 'gigs',
        name: 'gigs',
        component: () => import('src/pages/public/GigsPage.vue'),
        meta: { title: 'Browse Gigs' }
      },
      {
        path: 'gigs/:id',
        name: 'gig-detail',
        component: () => import('src/pages/public/GigDetailPage.vue'),
        meta: { title: 'Gig Details' }
      },
      {
        path: 'search',
        name: 'search',
        component: () => import('src/pages/public/SearchPage.vue'),
        meta: { title: 'Search Results' }
      }
    ]
  },

  // ──────────────────────────────────────────
  // Auth Pages (no layout)
  // ──────────────────────────────────────────
  {
    path: '/auth',
    component: () => import('src/layouts/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('src/pages/auth/LoginPage.vue'),
        meta: { title: 'Sign In', guest: true }
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('src/pages/auth/RegisterPage.vue'),
        meta: { title: 'Create Account', guest: true }
      },
      {
        path: 'forgot-password',
        name: 'forgot-password',
        component: () => import('src/pages/auth/ForgotPasswordPage.vue'),
        meta: { title: 'Forgot Password', guest: true }
      },
      {
        path: 'reset-password',
        name: 'reset-password',
        component: () => import('src/pages/auth/ResetPasswordPage.vue'),
        meta: { title: 'Reset Password', guest: true }
      },
      {
        path: 'verify-email',
        name: 'verify-email',
        component: () => import('src/pages/auth/VerifyEmailPage.vue'),
        meta: { title: 'Verify Email' }
      }
    ]
  },

  // ──────────────────────────────────────────
  // Freelancer Dashboard
  // ──────────────────────────────────────────
  {
    path: '/freelancer',
    component: () => import('src/layouts/FreelancerLayout.vue'),
    meta: { requiresAuth: true, role: 'freelancer' },
    children: [
      {
        path: '',
        redirect: '/freelancer/dashboard'
      },
      {
        path: 'dashboard',
        name: 'freelancer-dashboard',
        component: () => import('src/pages/freelancer/DashboardPage.vue'),
        meta: { title: 'Dashboard' }
      },
      {
        path: 'gigs',
        name: 'my-gigs',
        component: () => import('src/pages/freelancer/MyGigsPage.vue'),
        meta: { title: 'My Gigs' }
      },
      {
        path: 'gigs/create',
        name: 'create-gig',
        component: () => import('src/pages/freelancer/CreateGigPage.vue'),
        meta: { title: 'Create Gig' }
      },
      {
        path: 'gigs/:id/edit',
        name: 'edit-gig',
        component: () => import('src/pages/freelancer/EditGigPage.vue'),
        meta: { title: 'Edit Gig' }
      },
      {
        path: 'portfolio',
        name: 'my-portfolio',
        component: () => import('src/pages/freelancer/PortfolioPage.vue'),
        meta: { title: 'Portfolio' }
      },
      {
        path: 'orders',
        name: 'freelancer-orders',
        component: () => import('src/pages/freelancer/OrdersPage.vue'),
        meta: { title: 'Orders' }
      },
      {
        path: 'orders/:id',
        name: 'freelancer-order-detail',
        component: () => import('src/pages/freelancer/OrderDetailPage.vue'),
        meta: { title: 'Order Details' }
      },
      {
        path: 'messages',
        name: 'freelancer-messages',
        component: () => import('src/pages/freelancer/MessagesPage.vue'),
        meta: { title: 'Messages' }
      },
      {
        path: 'wallet',
        name: 'freelancer-wallet',
        component: () => import('src/pages/freelancer/WalletPage.vue'),
        meta: { title: 'Wallet & Earnings' }
      },
      {
        path: 'reviews',
        name: 'freelancer-reviews',
        component: () => import('src/pages/freelancer/ReviewsPage.vue'),
        meta: { title: 'Reviews' }
      },
      {
        path: 'profile',
        name: 'freelancer-profile-settings',
        component: () => import('src/pages/freelancer/ProfileSettingsPage.vue'),
        meta: { title: 'Profile Settings' }
      }
    ]
  },

  // ──────────────────────────────────────────
  // Client Dashboard
  // ──────────────────────────────────────────
  {
    path: '/client',
    component: () => import('src/layouts/ClientLayout.vue'),
    meta: { requiresAuth: true, role: 'client' },
    children: [
      {
        path: '',
        redirect: '/client/dashboard'
      },
      {
        path: 'dashboard',
        name: 'client-dashboard',
        component: () => import('src/pages/client/DashboardPage.vue'),
        meta: { title: 'Dashboard' }
      },
      {
        path: 'orders',
        name: 'client-orders',
        component: () => import('src/pages/client/OrdersPage.vue'),
        meta: { title: 'My Orders' }
      },
      {
        path: 'orders/:id',
        name: 'client-order-detail',
        component: () => import('src/pages/client/OrderDetailPage.vue'),
        meta: { title: 'Order Details' }
      },
      {
        path: 'messages',
        name: 'client-messages',
        component: () => import('src/pages/client/MessagesPage.vue'),
        meta: { title: 'Messages' }
      },
      {
        path: 'reviews',
        name: 'client-reviews',
        component: () => import('src/pages/client/ReviewsPage.vue'),
        meta: { title: 'My Reviews' }
      },
      {
        path: 'profile',
        name: 'client-profile-settings',
        component: () => import('src/pages/client/ProfileSettingsPage.vue'),
        meta: { title: 'Profile Settings' }
      }
    ]
  },

  // ──────────────────────────────────────────
  // Admin Dashboard
  // ──────────────────────────────────────────
  {
    path: '/admin',
    component: () => import('src/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      {
        path: '',
        redirect: '/admin/dashboard'
      },
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: () => import('src/pages/admin/DashboardPage.vue'),
        meta: { title: 'Admin Dashboard' }
      },
      {
        path: 'users',
        name: 'admin-users',
        component: () => import('src/pages/admin/UsersPage.vue'),
        meta: { title: 'User Management' }
      },
      {
        path: 'freelancers',
        name: 'admin-freelancers',
        component: () => import('src/pages/admin/FreelancersPage.vue'),
        meta: { title: 'Freelancer Management' }
      },
      {
        path: 'clients',
        name: 'admin-clients',
        component: () => import('src/pages/admin/ClientsPage.vue'),
        meta: { title: 'Client Management' }
      },
      {
        path: 'gigs',
        name: 'admin-gigs',
        component: () => import('src/pages/admin/GigsPage.vue'),
        meta: { title: 'Gig Moderation' }
      },
      {
        path: 'categories',
        name: 'admin-categories',
        component: () => import('src/pages/admin/CategoriesPage.vue'),
        meta: { title: 'Category Management' }
      },
      {
        path: 'orders',
        name: 'admin-orders',
        component: () => import('src/pages/admin/OrdersPage.vue'),
        meta: { title: 'All Orders' }
      },
      {
        path: 'reports',
        name: 'admin-reports',
        component: () => import('src/pages/admin/ReportsPage.vue'),
        meta: { title: 'Reports' }
      },
      {
        path: 'settings',
        name: 'admin-settings',
        component: () => import('src/pages/admin/SettingsPage.vue'),
        meta: { title: 'Settings' }
      }
    ]
  },

  // ──────────────────────────────────────────
  // Error pages
  // ──────────────────────────────────────────
  {
    path: '/403',
    name: 'forbidden',
    component: () => import('src/pages/ErrorPage.vue'),
    props: { code: 403, message: 'Access Denied' }
  },
  {
    path: '/:catchAll(.*)*',
    name: 'not-found',
    component: () => import('src/pages/ErrorPage.vue'),
    props: { code: 404, message: 'Page Not Found' }
  }
]

export default routes
