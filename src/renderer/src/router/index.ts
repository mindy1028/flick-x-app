import { createRouter, createWebHashHistory, Router, RouteRecordRaw } from 'vue-router'
import WelcomePage from '@renderer/components/views/welcome-page/WelcomePage.vue'
import MainPage from '@renderer/components/views/main-page/MainPage.vue'

// 配置路由
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'WelcomePage',
    component: WelcomePage, // 欢迎页
  },
  {
    path: '/main',
    name: 'MainPage',
    component: MainPage, // 主页面
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 路由守卫
function createRouteGuard(router: Router) {
  router.beforeEach((to, from, next) => {
    // 你可以在这里添加一些全局的路由守卫逻辑
    console.log(`Navigating from ${from.fullPath} to ${to.fullPath}`);
    next(); // 必须调用 next() 来允许导航
  });
}

createRouteGuard(router)

export default router
