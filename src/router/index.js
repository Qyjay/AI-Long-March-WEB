import { createRouter, createWebHistory } from 'vue-router'
import { useProgressStore } from '@/stores/progress'

/**
 * 路由配置
 * 按照文档规范定义的路由结构
 */
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: {
      title: '重走长征路',
      description: '沉浸式互动体验'
    }
  },
  {
    path: '/map',
    name: 'Map',
    component: () => import('@/views/MapPage.vue'),
    meta: {
      title: '长征地图',
      requiresProgress: false
    }
  },
  {
    path: '/story/:nodeId',
    name: 'Story',
    component: () => import('@/views/StoryPage.vue'),
    props: true,
    meta: {
      title: '长征故事',
      requiresProgress: true
    }
  },
  {
    path: '/achievements',
    name: 'Achievements',
    component: () => import('@/views/Achievements.vue'),
    meta: {
      title: '成就徽章'
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/Settings.vue'),
    meta: {
      title: '设置'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/'
  }
]

/**
 * 创建路由实例
 */
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

/**
 * 路由守卫 - 根据文档规范实现
 * 首次进入若无进度，导航至首页
 */
router.beforeEach((to, from, next) => {
  const progressStore = useProgressStore()
  
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - ${import.meta.env.VITE_APP_TITLE}`
  }
  
  // 检查是否需要进度验证
  if (to.meta.requiresProgress) {
    // 如果访问故事页面但没有当前进度，重定向到地图页面
    if (to.name === 'Story' && !progressStore.currentNodeId) {
      next('/map')
      return
    }
  }
  
  // 首次访问且无进度时，引导到首页
  if (to.path === '/map' && !progressStore.hasAnyProgress && from.path === '/') {
    // 允许直接访问地图，但会在地图页面显示引导
  }
  
  next()
})

/**
 * 路由后置守卫 - 处理页面加载完成后的逻辑
 */
router.afterEach((to, from) => {
  // 可以在这里添加页面访问统计等逻辑
  console.log(`导航到: ${to.path}`)
})

export default router