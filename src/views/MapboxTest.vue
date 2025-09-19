<template>
  <div class="mapbox-test-container">
    <!-- 页面头部 -->
    <div class="test-header">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Mapbox Token 测试</h1>
            <p class="text-gray-600 mt-2">验证 Mapbox API Token 的有效性和功能</p>
          </div>
          <button 
            @click="runAllTests" 
            :disabled="isRunning"
            class="btn-primary"
          >
            {{ isRunning ? '测试中...' : '开始测试' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 测试结果面板 -->
    <div class="container mx-auto px-4 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 测试状态卡片 -->
        <div class="test-results-card">
          <h2 class="text-xl font-semibold mb-4">测试结果</h2>
          <div class="space-y-3">
            <div 
              v-for="test in testResults" 
              :key="test.name"
              class="test-item"
              :class="{
                'test-success': test.status === 'success',
                'test-error': test.status === 'error',
                'test-pending': test.status === 'pending'
              }"
            >
              <div class="flex items-center justify-between">
                <span class="test-name">{{ test.name }}</span>
                <div class="flex items-center space-x-2">
                  <span class="test-status">{{ getStatusText(test.status) }}</span>
                  <div class="status-icon">
                    <svg v-if="test.status === 'success'" class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else-if="test.status === 'error'" class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                    <div v-else class="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                  </div>
                </div>
              </div>
              <div v-if="test.details" class="test-details mt-2 text-sm text-gray-600">
                {{ test.details }}
              </div>
              <div v-if="test.error" class="test-error-details mt-2 text-sm text-red-600">
                错误: {{ test.error }}
              </div>
            </div>
          </div>
        </div>

        <!-- 地图预览 -->
        <div class="map-preview-card">
          <h2 class="text-xl font-semibold mb-4">地图预览</h2>
          <div class="map-container">
            <div id="test-map" class="w-full h-64 rounded-lg border"></div>
          </div>
          <div class="map-info mt-4">
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="font-medium">Token状态:</span>
                <span :class="tokenValid ? 'text-green-600' : 'text-red-600'" class="ml-2">
                  {{ tokenValid ? '有效' : '无效' }}
                </span>
              </div>
              <div>
                <span class="font-medium">地图样式:</span>
                <span class="ml-2">{{ currentMapStyle }}</span>
              </div>
              <div>
                <span class="font-medium">当前域名:</span>
                <span class="ml-2">{{ currentDomain }}</span>
              </div>
              <div>
                <span class="font-medium">API访问:</span>
                <span :class="apiAccessible ? 'text-green-600' : 'text-red-600'" class="ml-2">
                  {{ apiAccessible ? '正常' : '受限' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 详细信息和建议 -->
      <div class="mt-8">
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <h2 class="text-xl font-semibold mb-4">测试详情和建议</h2>
          
          <!-- Token信息 -->
          <div class="mb-6">
            <h3 class="text-lg font-medium mb-2">Token 信息</h3>
            <div class="bg-gray-50 rounded p-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="font-medium">Token (前8位):</span>
                  <span class="ml-2 font-mono">{{ tokenPreview }}</span>
                </div>
                <div>
                  <span class="font-medium">来源:</span>
                  <span class="ml-2">.env 文件 (VITE_MAPBOX_TOKEN)</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 问题诊断 -->
          <div v-if="hasErrors" class="mb-6">
            <h3 class="text-lg font-medium mb-2 text-red-600">问题诊断</h3>
            <div class="bg-red-50 border border-red-200 rounded p-4">
              <ul class="space-y-2 text-sm">
                <li v-for="error in errorMessages" :key="error" class="flex items-start">
                  <span class="text-red-500 mr-2">•</span>
                  <span>{{ error }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- 解决方案 -->
          <div v-if="hasErrors">
            <h3 class="text-lg font-medium mb-2 text-blue-600">解决方案</h3>
            <div class="bg-blue-50 border border-blue-200 rounded p-4">
              <div class="space-y-4 text-sm">
                <div>
                  <h4 class="font-medium mb-2">1. 检查 Token 配置</h4>
                  <ul class="space-y-1 ml-4">
                    <li>• 确认 .env 文件中的 VITE_MAPBOX_TOKEN 设置正确</li>
                    <li>• 重启开发服务器以加载新的环境变量</li>
                  </ul>
                </div>
                <div>
                  <h4 class="font-medium mb-2">2. 域名限制问题</h4>
                  <ul class="space-y-1 ml-4">
                    <li>• 登录 <a href="https://account.mapbox.com/access-tokens/" target="_blank" class="text-blue-600 underline">Mapbox 控制台</a></li>
                    <li>• 在 Token 设置中添加 <code class="bg-gray-100 px-1 rounded">http://localhost:3001/*</code></li>
                    <li>• 或创建一个无域名限制的开发用 Token</li>
                  </ul>
                </div>
                <div>
                  <h4 class="font-medium mb-2">3. 网络问题</h4>
                  <ul class="space-y-1 ml-4">
                    <li>• 检查网络连接是否正常</li>
                    <li>• 尝试刷新页面重新测试</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- 成功提示 -->
          <div v-else-if="allTestsPassed" class="bg-green-50 border border-green-200 rounded p-4">
            <div class="flex items-center">
              <svg class="w-6 h-6 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <div>
                <h3 class="text-lg font-medium text-green-800">测试通过！</h3>
                <p class="text-green-700 mt-1">您的 Mapbox Token 配置正确，可以正常使用所有功能。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import mapboxgl from 'mapbox-gl'

/**
 * Mapbox Token 测试页面
 * 提供全面的 Token 验证和诊断功能
 */

// 响应式数据
const isRunning = ref(false)
const tokenValid = ref(false)
const apiAccessible = ref(false)
const currentMapStyle = ref('streets-v11')
const currentDomain = ref(window.location.origin)
const map = ref(null)

// Token 信息
const token = import.meta.env.VITE_MAPBOX_TOKEN
const tokenPreview = computed(() => {
  return token ? `${token.substring(0, 8)}...` : '未配置'
})

// 测试结果
const testResults = ref([
  { name: 'Token 配置检查', status: 'pending', details: '', error: '' },
  { name: 'API 连接测试', status: 'pending', details: '', error: '' },
  { name: '地图样式加载', status: 'pending', details: '', error: '' },
  { name: '地图实例创建', status: 'pending', details: '', error: '' },
  { name: '域名权限检查', status: 'pending', details: '', error: '' },
  { name: '地图渲染测试', status: 'pending', details: '', error: '' }
])

// 计算属性
const hasErrors = computed(() => {
  return testResults.value.some(test => test.status === 'error')
})

const allTestsPassed = computed(() => {
  return testResults.value.every(test => test.status === 'success')
})

const errorMessages = computed(() => {
  return testResults.value
    .filter(test => test.status === 'error')
    .map(test => `${test.name}: ${test.error}`)
})

/**
 * 获取状态文本
 */
const getStatusText = (status) => {
  const statusMap = {
    'pending': '等待中',
    'success': '成功',
    'error': '失败'
  }
  return statusMap[status] || '未知'
}

/**
 * 更新测试结果
 */
const updateTestResult = (index, status, details = '', error = '') => {
  testResults.value[index] = {
    ...testResults.value[index],
    status,
    details,
    error
  }
}

/**
 * 检查 Token 配置
 */
const checkTokenConfiguration = async () => {
  try {
    if (!token) {
      updateTestResult(0, 'error', '', '未找到 VITE_MAPBOX_TOKEN 环境变量')
      return false
    }
    
    if (!token.startsWith('pk.')) {
      updateTestResult(0, 'error', '', 'Token 格式不正确，应以 pk. 开头')
      return false
    }
    
    updateTestResult(0, 'success', `Token 格式正确: ${tokenPreview.value}`)
    return true
  } catch (error) {
    updateTestResult(0, 'error', '', error.message)
    return false
  }
}

/**
 * 测试 API 连接
 */
const testAPIConnection = async () => {
  try {
    const response = await fetch(`https://api.mapbox.com/styles/v1/mapbox/streets-v11?access_token=${token}`)
    
    if (response.status === 403) {
      updateTestResult(1, 'error', '', '403 错误 - Token 可能有域名限制')
      apiAccessible.value = false
      return false
    }
    
    if (!response.ok) {
      updateTestResult(1, 'error', '', `API 请求失败: ${response.status} ${response.statusText}`)
      apiAccessible.value = false
      return false
    }
    
    const data = await response.json()
    updateTestResult(1, 'success', `API 响应正常，样式版本: ${data.version || '未知'}`)
    apiAccessible.value = true
    return true
  } catch (error) {
    updateTestResult(1, 'error', '', `网络错误: ${error.message}`)
    apiAccessible.value = false
    return false
  }
}

/**
 * 测试地图样式加载
 */
const testMapStyleLoading = async () => {
  try {
    const styles = ['streets-v11', 'satellite-v9', 'outdoors-v11']
    const results = []
    
    for (const style of styles) {
      try {
        const response = await fetch(`https://api.mapbox.com/styles/v1/mapbox/${style}?access_token=${token}`)
        results.push({ style, success: response.ok, status: response.status })
      } catch (error) {
        results.push({ style, success: false, error: error.message })
      }
    }
    
    const successCount = results.filter(r => r.success).length
    
    if (successCount === 0) {
      updateTestResult(2, 'error', '', '所有地图样式加载失败')
      return false
    }
    
    updateTestResult(2, 'success', `${successCount}/${styles.length} 个样式加载成功`)
    return true
  } catch (error) {
    updateTestResult(2, 'error', '', error.message)
    return false
  }
}

/**
 * 创建地图实例
 */
const createMapInstance = async () => {
  try {
    // 设置访问令牌
    mapboxgl.accessToken = token
    
    // 创建地图容器
    const mapContainer = document.getElementById('test-map')
    if (!mapContainer) {
      updateTestResult(3, 'error', '', '地图容器未找到')
      return false
    }
    
    // 清理现有地图
    if (map.value) {
      map.value.remove()
      map.value = null
    }
    
    // 创建新地图
    map.value = new mapboxgl.Map({
      container: 'test-map',
      style: `mapbox://styles/mapbox/${currentMapStyle.value}`,
      center: [104.0668, 30.5728], // 成都坐标
      zoom: 10,
      attributionControl: false
    })
    
    // 等待地图加载完成
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('地图加载超时'))
      }, 10000)
      
      map.value.on('load', () => {
        clearTimeout(timeout)
        resolve()
      })
      
      map.value.on('error', (error) => {
        clearTimeout(timeout)
        reject(error)
      })
    })
    
    updateTestResult(3, 'success', '地图实例创建成功')
    tokenValid.value = true
    return true
  } catch (error) {
    updateTestResult(3, 'error', '', error.message || '地图创建失败')
    tokenValid.value = false
    return false
  }
}

/**
 * 检查域名权限
 */
const checkDomainPermissions = async () => {
  try {
    // 测试从当前域名访问 API
    const testUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/test.json?access_token=${token}`
    const response = await fetch(testUrl)
    
    if (response.status === 403) {
      updateTestResult(4, 'error', '', `域名 ${currentDomain.value} 未被授权访问此 Token`)
      return false
    }
    
    if (response.ok) {
      updateTestResult(4, 'success', `域名 ${currentDomain.value} 有访问权限`)
      return true
    }
    
    updateTestResult(4, 'error', '', `权限检查失败: ${response.status}`)
    return false
  } catch (error) {
    updateTestResult(4, 'error', '', `权限检查错误: ${error.message}`)
    return false
  }
}

/**
 * 测试地图渲染
 */
const testMapRendering = async () => {
  try {
    if (!map.value) {
      updateTestResult(5, 'error', '', '地图实例不存在')
      return false
    }
    
    // 添加测试标记
    const marker = new mapboxgl.Marker()
      .setLngLat([104.0668, 30.5728])
      .addTo(map.value)
    
    // 测试地图交互
    map.value.flyTo({
      center: [104.0668, 30.5728],
      zoom: 12,
      duration: 1000
    })
    
    updateTestResult(5, 'success', '地图渲染和交互正常')
    return true
  } catch (error) {
    updateTestResult(5, 'error', '', error.message)
    return false
  }
}

/**
 * 运行所有测试
 */
const runAllTests = async () => {
  if (isRunning.value) return
  
  isRunning.value = true
  
  // 重置所有测试状态
  testResults.value.forEach((test, index) => {
    updateTestResult(index, 'pending', '', '')
  })
  
  try {
    // 按顺序执行测试
    await checkTokenConfiguration()
    await new Promise(resolve => setTimeout(resolve, 500))
    
    await testAPIConnection()
    await new Promise(resolve => setTimeout(resolve, 500))
    
    await testMapStyleLoading()
    await new Promise(resolve => setTimeout(resolve, 500))
    
    await createMapInstance()
    await new Promise(resolve => setTimeout(resolve, 500))
    
    await checkDomainPermissions()
    await new Promise(resolve => setTimeout(resolve, 500))
    
    await testMapRendering()
    
  } catch (error) {
    console.error('测试过程中出现错误:', error)
  } finally {
    isRunning.value = false
  }
}

// 生命周期
onMounted(() => {
  // 自动运行测试
  setTimeout(() => {
    runAllTests()
  }, 1000)
})

onUnmounted(() => {
  // 清理地图实例
  if (map.value) {
    map.value.remove()
    map.value = null
  }
})
</script>

<style scoped>
.mapbox-test-container {
  min-height: 100vh;
  background-color: #f9fafb;
}

.test-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200;
}

.btn-primary:disabled {
  @apply bg-gray-400 cursor-not-allowed;
}

.test-results-card,
.map-preview-card {
  @apply bg-white rounded-lg shadow-sm border p-6;
}

.test-item {
  @apply p-3 rounded-lg border transition-colors duration-200;
}

.test-item.test-success {
  @apply bg-green-50 border-green-200;
}

.test-item.test-error {
  @apply bg-red-50 border-red-200;
}

.test-item.test-pending {
  @apply bg-gray-50 border-gray-200;
}

.test-name {
  @apply font-medium text-gray-900;
}

.test-status {
  @apply text-sm font-medium;
}

.test-details {
  @apply text-gray-600;
}

.test-error-details {
  @apply text-red-600;
}

.map-container {
  @apply relative;
}

#test-map {
  @apply bg-gray-100;
}

.map-info {
  @apply text-sm text-gray-600;
}

code {
  @apply bg-gray-100 px-1 py-0.5 rounded text-sm font-mono;
}
</style>