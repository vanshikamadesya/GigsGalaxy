import { route } from 'quasar/wrappers'
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory
} from 'vue-router'
import routes from './routes'
import { useAuthStore } from 'src/stores/auth.store'

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  // Navigation guards
  Router.beforeEach(async (to, _from, next) => {
    const authStore = useAuthStore()

    // Set page title
    document.title = to.meta.title
      ? `${String(to.meta.title)} | Gig Galaxy`
      : 'Gig Galaxy'

    const requiresAuth = to.meta.requiresAuth as boolean | undefined
    const requiredRole = to.meta.role as string | undefined
    const isGuestOnly = to.meta.guest as boolean | undefined

    // Redirect authenticated users away from guest-only pages
    if (isGuestOnly && authStore.isAuthenticated) {
      return next(getRoleDashboard(authStore.userRole))
    }

    // Requires auth
    if (requiresAuth && !authStore.isAuthenticated) {
      return next({ name: 'login', query: { redirect: to.fullPath } })
    }

    // Role-based access control
    if (requiresAuth && requiredRole && authStore.userRole !== requiredRole) {
      return next({ name: 'forbidden' })
    }

    next()
  })

  return Router
})

function getRoleDashboard(role?: string): string {
  switch (role) {
    case 'admin':
      return '/admin/dashboard'
    case 'freelancer':
      return '/freelancer/dashboard'
    case 'client':
      return '/client/dashboard'
    default:
      return '/'
  }
}
