import { createRouter, createWebHistory, Router, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

function createRouteGuard(router: Router) {
  router.beforeEach((to, from, next) => {
      next();
  });
}

createRouteGuard(router)

export default router
