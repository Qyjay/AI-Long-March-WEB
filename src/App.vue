<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- 全局加载状态 -->
    <Transition name="fade">
      <div 
        v-if="isLoading || globalLoading" 
        class="fixed inset-0 bg-white z-50 flex items-center justify-center"
      >
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p class="text-gray-600">{{ loadingMessage || '正在加载长征之路...' }}</p>
        </div>
      </div>
    </Transition>

    <!-- 主要内容区域 -->
    <RouterView v-slot="{ Component }">
      <Suspense>
        <template #default>
          <Transition name="slide-up" mode="out-in">
            <component :is="Component" />
          </Transition>
        </template>
        <template #fallback>
          <div class="flex items-center justify-center min-h-96">
            <div class="text-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
              <p class="text-gray-600">正在加载页面...</p>
            </div>
          </div>
        </template>
      </Suspense>
    </RouterView>

    <!-- 成就解锁提示 -->
    <AchievementToast />
    
    <!-- 全局错误提示 -->
    <Transition name="fade">
      <div 
        v-if="globalError" 
        class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      >
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div class="text-center">
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">{{ errorTitle || '出现错误' }}</h3>
            <p class="text-sm text-gray-500 mb-4">{{ errorMessage || '应用运行时出现了错误，请稍后重试。' }}</p>
            <div v-if="errorDetails" class="text-xs text-gray-400 mb-4 p-2 bg-gray-50 rounded text-left">
              {{ errorDetails }}
            </div>
            <div class="flex space-x-3">
              <button 
                @click="handleRetry" 
                :disabled="retrying"
                class="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50"
              >
                {{ retrying ? '重试中...' : '重试' }}
              </button>
              <button 
                @click="handleCloseError" 
                class="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
    
    <!-- 离线模式提示 -->
    <div 
      v-if="isOfflineMode" 
      class="fixed top-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-lg shadow-lg z-40"
    >
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        离线内容
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onErrorCaptured } from 'vue'
import { useSettings } from '@/stores/settings'
import AchievementToast from '@/components/AchievementToast.vue'

export default {
  name: 'App',
  components: {
    AchievementToast
  },
  setup() {
    const isLoading = ref(true)
    const settingsStore = useSettings()
    
    // 全局状态管理
    const globalLoading = ref(false)
    const loadingMessage = ref('')
    const globalError = ref(false)
    const errorTitle = ref('')
    const errorMessage = ref('')
    const errorDetails = ref('')
    const retrying = ref(false)
    
    /**
     * 检查是否为离线模式
     */
    const isOfflineMode = computed(() => {
      return import.meta.env.VITE_USE_MOCK === '1'
    })

    /**
     * 显示全局加载状态
     */
    const showGlobalLoading = (message = '正在加载...') => {
      globalLoading.value = true
      loadingMessage.value = message
    }

    /**
     * 隐藏全局加载状态
     */
    const hideGlobalLoading = () => {
      globalLoading.value = false
      loadingMessage.value = ''
    }

    /**
     * 显示全局错误
     */
    const showGlobalError = (title, message, details = '') => {
      globalError.value = true
      errorTitle.value = title
      errorMessage.value = message
      errorDetails.value = details
    }

    /**
     * 处理重试
     */
    const handleRetry = async () => {
      retrying.value = true
      try {
        // 重新初始化应用
        await settingsStore.initialize()
        globalError.value = false
      } catch (error) {
        console.error('重试失败:', error)
        showGlobalError('重试失败', '重试时出现了新的错误，请检查网络连接后再试。', error.message)
      } finally {
        retrying.value = false
      }
    }

    /**
     * 关闭错误提示
     */
    const handleCloseError = () => {
      globalError.value = false
      errorTitle.value = ''
      errorMessage.value = ''
      errorDetails.value = ''
    }

    /**
     * 全局错误捕获
     */
    onErrorCaptured((error, instance, info) => {
      console.error('全局错误捕获:', error, info)
      showGlobalError(
        '应用错误',
        '应用运行时出现了错误，请稍后重试。',
        `${error.message}\n\n组件信息: ${info}`
      )
      return false
    })

    /**
     * 应用初始化
     */
    onMounted(async () => {
      try {
        // 模拟加载时间，确保资源准备就绪
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 初始化设置
        await settingsStore.initialize()
        
      } catch (error) {
        console.error('应用初始化失败:', error)
        showGlobalError(
          '初始化失败',
          '应用初始化时出现错误，请检查网络连接后重试。',
          error.message
        )
      } finally {
        isLoading.value = false
      }
    })

    return {
      isLoading,
      isOfflineMode,
      globalLoading,
      loadingMessage,
      globalError,
      errorTitle,
      errorMessage,
      errorDetails,
      retrying,
      showGlobalLoading,
      hideGlobalLoading,
      showGlobalError,
      handleRetry,
      handleCloseError
    }
  }
}
</script>

<style scoped>
/* 组件特定样式 */
</style>