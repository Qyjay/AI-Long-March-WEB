import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './assets/style.css'

/**
 * 创建Vue应用实例并配置全局插件
 */
const app = createApp(App)

// 配置Pinia状态管理
const pinia = createPinia()
app.use(pinia)

// 配置路由
app.use(router)

// 挂载应用
app.mount('#app')