import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home.vue'),
    meta: { 
      title: 'PBO3',
      requiresAuth: true 
    },
    alias: ["/search=:input"]
  },
  {
    path: '/server/:hostname',
    name: 'Servers',
    component: () => import('@/views/infos.vue'),
    meta: { 
      requiresAuth: true 
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login.vue'),
    meta: {
      title: 'PBO3 - Login',
    }
  },
  {
    path: '/archives',
    name: 'Archives',
    component: () => import('@/views/archives.vue'),
    meta: { 
      title: 'PBO3 - Archives',
      requiresAuth: true 
    }
  },
  {
    path: '/clients',
    name: 'Client',
    component: () => import('@/views/clients.vue'),
    meta: { 
      title: 'PBO3 - Clients',
      requiresAuth: true 
    }
  },
  {
    path: '/services',
    name: 'Service',
    component: () => import('@/views/services.vue'),
    meta: {
      title: 'PBO3 - Services', 
      requiresAuth: true 
    }
  },
  {
    path: '/dcs',
    name: 'Dc',
    component: () => import('@/views/dcs.vue'),
    meta: { 
      title: 'PBO3 - Dcs',
      requiresAuth: true 
    }
  },
  {
    path: '/envs',
    name: 'Env',
    component: () => import('@/views/envs.vue'),
    meta: { 
      title: 'PBO3 - Envs',
      requiresAuth: true 
    }
  },
  {
    path: '/hosters',
    name: 'Hoster',
    component: () => import('@/views/hosters.vue'),
    meta: { 
      title: 'PBO3 - Hosters',
      requiresAuth: true 
    }
  },
  {
    path: '/os',
    name: 'Os',
    component: () => import('@/views/os.vue'),
    meta: {
      title: 'PBO3 - Os',
      requiresAuth: true 
    }
  },
  {
    path: '/profiles',
    name: 'Profile',
    component: () => import('@/views/profiles.vue'),
    meta: {
      title: 'PBO3 - Profiles',
      requiresAuth: true 
    }
  },
  {
    path: '/serverUsers',
    name: 'ServerUser',
    component: () => import('@/views/serverUsers.vue'),
    meta: {
      title: 'PBO3 - Server User',
      requiresAuth: true }
  },
  {
    path: '/types',
    name: 'Type',
    component: () => import('@/views/types.vue'),
    meta: { 
      title: 'PBO3 - Types',
      requiresAuth: true 
    }
  },
  {
    path: '*',
    redirect: '/'
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  // Check if the user is logged in
const isUserLoggedIn = store.getters.isAuthenticated
if (to.matched.some(record => record.meta.requiresAuth)) {
  if (!isUserLoggedIn) {
    store.dispatch('logOut')
    document.title = to.meta.title
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else {
    document.title = to.meta.title
    next()
  }
} else {
  document.title = to.meta.title
  next()
}
})

export default router
