import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

function guardMyroute(to, from, next)
{
  var connecter = false;

  if(sessionStorage.getItem('apollo-token')) {
    connecter = true;
  } else {
    connecter = false;
  }

  if(connecter == true ) {
    console.log('validation gaurdroute');
    next();
  } else {
    console.log('Redirection vers login');
    next('/login');
  }
}

const routes = [
  {
    path: '/',
    name: 'Home',
    beforeEnter : guardMyroute,
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
    beforeEnter : guardMyroute,
    component: () => import('@/views/infos.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/suppliers/:name',
    name: 'SuppliersTable',
    beforeEnter : guardMyroute,
    component: () => import('@/views/suppliersTable.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/suppliers',
    name: 'Suppliers',
    beforeEnter : guardMyroute,
    component: () => import('@/views/suppliers.vue'),
    meta: {
      title: 'PBO3 - Suppliers',
      requiresAuth: true
    }
  },
  {
    path: '/globalVars',
    name: 'GlobalVars',
    beforeEnter : guardMyroute,
    component: () => import('@/views/globalVars.vue'),
    meta: {
      title: 'PBO3 - Global Vars',
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login.vue'),
    meta: {
      title: 'PBO3 - Login',
    },
    beforeEnter: (to,from, next) => {
      if (store.getters.isAuthenticated == true) {
        next("/");
      } else {
        next();
      }
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