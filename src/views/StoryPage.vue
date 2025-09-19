<template>
  <div class="story-page-container">
    <!-- 故事运行器 -->
    <div class="story-main">
      <StoryRunner 
        ref="storyRunnerRef"
        :node-id="nodeId"
        @story-complete="handleStoryComplete"
        @choice-made="handleChoiceMade"
        @scene-change="handleSceneChange"
        @story-exit="handleStoryExit"
      />
    </div>
    
    <!-- 顶部导航栏 -->
    <div class="top-nav">
      <div class="nav-left">
        <button 
          @click="goBack"
          class="nav-btn"
          title="返回"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
          <span>返回</span>
        </button>
        
        <div class="node-info" v-if="currentNode">
          <h1 class="node-title">{{ currentNode.name }}</h1>
          <p class="node-subtitle">{{ currentNode.summary }}</p>
        </div>
      </div>
      
      <div class="nav-right">
        <button 
          @click="toggleAutoPlay"
          class="nav-btn"
          :class="{ active: isAutoPlay }"
          title="自动播放"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path v-if="isAutoPlay" fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
            <path v-else fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
          </svg>
        </button>
        
        <button 
          @click="toggleFullscreen"
          class="nav-btn"
          title="全屏"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path v-if="isFullscreen" fill-rule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clip-rule="evenodd" />
            <path v-else fill-rule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
        </button>
        
        <button 
          @click="showSettings"
          class="nav-btn"
          title="设置"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
    
    <!-- 底部控制栏 -->
    <div class="bottom-controls" v-if="!isFullscreen">
      <div class="controls-left">
        <div class="story-progress">
          <div class="progress-info">
            <span class="progress-text">
              场景 {{ currentSceneIndex + 1 }}/{{ totalScenes }}
            </span>
            <span class="progress-percentage">
              {{ storyProgressPercentage }}%
            </span>
          </div>
          
          <div class="progress-bar">
            <div 
              class="progress-fill"
              :style="{ width: storyProgressPercentage + '%' }"
            ></div>
          </div>
        </div>
      </div>
      
      <div class="controls-center">
        <button 
          @click="previousScene"
          :disabled="!hasPreviousScene"
          class="control-btn"
          title="上一场景"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
          </svg>
        </button>
        
        <button 
          @click="togglePlayPause"
          class="control-btn control-btn-primary"
          :title="isPlaying ? '暂停' : '播放'"
        >
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path v-if="isPlaying" fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
            <path v-else fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
          </svg>
        </button>
        
        <button 
          @click="nextScene"
          :disabled="!hasNextScene"
          class="control-btn"
          title="下一场景"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
          </svg>
        </button>
      </div>
      
      <div class="controls-right">
        <div class="volume-control">
          <button 
            @click="toggleMute"
            class="volume-btn"
            title="静音"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path v-if="isMuted" fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clip-rule="evenodd" />
              <path v-else fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0c.28.28.599.577.936.884a12.97 12.97 0 010 5.546c-.337.307-.656.604-.936.884a1 1 0 01-1.414-1.414c.22-.22.4-.448.571-.684a10.97 10.97 0 000-3.118c-.17-.236-.351-.464-.571-.684a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
          
          <input 
            v-model="volume"
            @input="handleVolumeChange"
            type="range"
            min="0"
            max="100"
            class="volume-slider"
          />
        </div>
        
        <div class="speed-control">
          <select 
            v-model="playbackSpeed"
            @change="handleSpeedChange"
            class="speed-select"
          >
            <option value="0.5">0.5x</option>
            <option value="0.75">0.75x</option>
            <option value="1">1x</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
          </select>
        </div>
      </div>
    </div>
    
    <!-- 设置弹窗 -->
    <div v-if="showSettingsModal" class="settings-modal">
      <div class="modal-overlay" @click="closeSettings"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">故事设置</h3>
          <button 
            @click="closeSettings"
            class="modal-close"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="setting-group">
            <label class="setting-label">自动播放间隔</label>
            <select v-model="autoPlayInterval" class="setting-select">
              <option value="2000">2秒</option>
              <option value="3000">3秒</option>
              <option value="5000">5秒</option>
              <option value="8000">8秒</option>
            </select>
          </div>
          
          <div class="setting-group">
            <label class="setting-label">文字显示速度</label>
            <select v-model="textSpeed" class="setting-select">
              <option value="slow">慢速</option>
              <option value="normal">正常</option>
              <option value="fast">快速</option>
              <option value="instant">瞬间</option>
            </select>
          </div>
          
          <div class="setting-group">
            <label class="setting-checkbox">
              <input 
                v-model="showSubtitles"
                type="checkbox"
              />
              <span class="checkbox-text">显示字幕</span>
            </label>
          </div>
          
          <div class="setting-group">
            <label class="setting-checkbox">
              <input 
                v-model="enableSoundEffects"
                type="checkbox"
              />
              <span class="checkbox-text">启用音效</span>
            </label>
          </div>
          
          <div class="setting-group">
            <label class="setting-checkbox">
              <input 
                v-model="skipReadScenes"
                type="checkbox"
              />
              <span class="checkbox-text">跳过已读场景</span>
            </label>
          </div>
        </div>
        
        <div class="modal-footer">
          <button 
            @click="resetSettings"
            class="btn-secondary"
          >
            重置设置
          </button>
          <button 
            @click="saveSettings"
            class="btn-primary"
          >
            保存设置
          </button>
        </div>
      </div>
    </div>
    
    <!-- 加载状态 -->
    <LoadingSpinner 
      v-if="isLoading" 
      overlay 
      message="加载故事内容..." 
      size="large" 
    />
    
    <!-- 错误状态 -->
    <ErrorMessage
      v-if="error"
      overlay
      :title="error.title"
      :message="error.message"
      :details="error.details"
      :retrying="retrying"
      @retry="retry"
      @close="closeError"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProgressStore } from '../stores/progress'
import { useSettings } from '../stores/settings'
import { apiClient } from '../api'
import { eventBus } from '../utils/bus'
import StoryRunner from '../components/StoryRunner.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'

/**
 * 故事页面组件
 * 提供沉浸式的故事体验界面，包含故事播放控制和设置
 */

// 路由
const route = useRoute()
const router = useRouter()

// 存储
const progressStore = useProgressStore()
const settingsStore = useSettings()

// 组件引用
const storyRunnerRef = ref(null)

// 路由参数
const nodeId = computed(() => route.params.nodeId)

// 响应式数据
const currentNode = ref(null)
const scenes = ref([])
const currentSceneIndex = ref(0)
const isLoading = ref(true)
const isPlaying = ref(false)
const isAutoPlay = ref(false)
const isFullscreen = ref(false)
const isMuted = ref(false)
const volume = ref(80)
const playbackSpeed = ref(1)
const showSettingsModal = ref(false)
const error = ref(null)
const retrying = ref(false)

// 设置相关
const autoPlayInterval = ref(3000)
const textSpeed = ref('normal')
const showSubtitles = ref(true)
const enableSoundEffects = ref(true)
const skipReadScenes = ref(false)

// 计算属性
const totalScenes = computed(() => scenes.value.length)
const storyProgressPercentage = computed(() => {
  return totalScenes.value > 0 ? Math.round(((currentSceneIndex.value + 1) / totalScenes.value) * 100) : 0
})

const hasPreviousScene = computed(() => currentSceneIndex.value > 0)
const hasNextScene = computed(() => currentSceneIndex.value < totalScenes.value - 1)

/**
 * 加载故事数据
 */
const loadStoryData = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    // 加载节点信息
    const nodes = await apiClient.getNodes()
    currentNode.value = nodes.find(node => node.id === nodeId.value)
    
    if (!currentNode.value) {
      throw new Error('节点不存在')
    }
    
    // 加载场景数据
    scenes.value = await apiClient.getScenes(nodeId.value)
    
    if (!scenes.value || scenes.value.length === 0) {
      throw new Error('该节点没有故事内容')
    }
    
    // 设置当前场景索引
    const savedProgress = progressStore.getNodeProgress(nodeId.value)
    if (savedProgress && savedProgress.currentSceneIndex !== undefined) {
      currentSceneIndex.value = savedProgress.currentSceneIndex
    }
    
  } catch (err) {
    console.error('加载故事数据失败:', err)
    error.value = {
      title: '故事加载失败',
      message: '无法加载故事数据，请检查网络连接后重试。',
      details: err.message
    }
  } finally {
    isLoading.value = false
  }
}

/**
 * 处理故事完成
 */
const handleStoryComplete = () => {
  try {
    console.log('故事完成')
    
    // 标记节点为已完成
    progressStore.completeNode(nodeId.value)
    
    // 触发成就检查
    eventBus.emit('story-completed', {
      nodeId: nodeId.value,
      node: currentNode.value
    })
    
    // 可以显示完成动画或跳转到下一个节点
  } catch (err) {
    console.error('处理故事完成失败:', err)
    error.value = {
      title: '故事完成处理失败',
      message: '无法保存故事进度，请重试。',
      details: err.message
    }
  }
}

/**
 * 处理选择做出
 */
const handleChoiceMade = (choice) => {
  try {
    console.log('选择做出:', choice)
    
    // 保存选择到进度
    progressStore.saveChoice(nodeId.value, currentSceneIndex.value, choice)
    
    // 触发成就检查
    eventBus.emit('choice-made', {
      nodeId: nodeId.value,
      sceneIndex: currentSceneIndex.value,
      choice
    })
  } catch (err) {
    console.error('处理选择失败:', err)
    error.value = {
      title: '选择处理失败',
      message: '无法保存您的选择，请重试。',
      details: err.message
    }
  }
}

/**
 * 处理场景变化
 */
const handleSceneChange = (sceneIndex) => {
  try {
    currentSceneIndex.value = sceneIndex
    
    // 保存进度
    progressStore.saveProgress(nodeId.value, {
      currentSceneIndex: sceneIndex,
      timestamp: Date.now()
    })
  } catch (err) {
    console.error('保存场景进度失败:', err)
    // 场景变化失败不应该阻止故事继续
  }
}

/**
 * 处理故事退出
 */
const handleStoryExit = () => {
  goBack()
}

/**
 * 返回上一页
 */
const goBack = () => {
  router.back()
}

/**
 * 切换自动播放
 */
const toggleAutoPlay = () => {
  isAutoPlay.value = !isAutoPlay.value
  
  if (storyRunnerRef.value) {
    storyRunnerRef.value.setAutoPlay(isAutoPlay.value)
  }
}

/**
 * 切换全屏
 */
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

/**
 * 上一场景
 */
const previousScene = () => {
  try {
    if (storyRunnerRef.value && hasPreviousScene.value) {
      storyRunnerRef.value.previousScene()
    }
  } catch (err) {
    console.error('切换到上一场景失败:', err)
    error.value = {
      title: '场景切换失败',
      message: '无法切换到上一场景，请重试。',
      details: err.message
    }
  }
}

/**
 * 重试加载
 */
const retry = async () => {
  retrying.value = true
  try {
    await loadStoryData()
  } catch (err) {
    console.error('重试失败:', err)
    error.value = {
      title: '重试失败',
      message: '重试时出现了新的错误，请检查网络连接后再试。',
      details: err.message
    }
  } finally {
    retrying.value = false
  }
}

/**
 * 关闭错误提示
 */
const closeError = () => {
  error.value = null
}

/**
 * 下一场景
 */
const nextScene = () => {
  if (storyRunnerRef.value && hasNextScene.value) {
    storyRunnerRef.value.nextScene()
  }
}

/**
 * 切换播放/暂停
 */
const togglePlayPause = () => {
  isPlaying.value = !isPlaying.value
  
  if (storyRunnerRef.value) {
    if (isPlaying.value) {
      storyRunnerRef.value.play()
    } else {
      storyRunnerRef.value.pause()
    }
  }
}

/**
 * 切换静音
 */
const toggleMute = () => {
  isMuted.value = !isMuted.value
  
  if (storyRunnerRef.value) {
    storyRunnerRef.value.setMuted(isMuted.value)
  }
}

/**
 * 处理音量变化
 */
const handleVolumeChange = () => {
  if (storyRunnerRef.value) {
    storyRunnerRef.value.setVolume(volume.value / 100)
  }
}

/**
 * 处理播放速度变化
 */
const handleSpeedChange = () => {
  if (storyRunnerRef.value) {
    storyRunnerRef.value.setPlaybackSpeed(playbackSpeed.value)
  }
}

/**
 * 显示设置
 */
const showSettings = () => {
  showSettingsModal.value = true
}

/**
 * 关闭设置
 */
const closeSettings = () => {
  showSettingsModal.value = false
}

/**
 * 保存设置
 */
const saveSettings = () => {
  const settings = {
    autoPlayInterval: autoPlayInterval.value,
    textSpeed: textSpeed.value,
    showSubtitles: showSubtitles.value,
    enableSoundEffects: enableSoundEffects.value,
    skipReadScenes: skipReadScenes.value
  }
  
  // 保存到本地存储
  localStorage.setItem('storySettings', JSON.stringify(settings))
  
  // 应用设置到故事运行器
  if (storyRunnerRef.value) {
    storyRunnerRef.value.applySettings(settings)
  }
  
  closeSettings()
}

/**
 * 重置设置
 */
const resetSettings = () => {
  autoPlayInterval.value = 3000
  textSpeed.value = 'normal'
  showSubtitles.value = true
  enableSoundEffects.value = true
  skipReadScenes.value = false
}

/**
 * 加载设置
 */
const loadSettings = () => {
  const saved = localStorage.getItem('storySettings')
  if (saved) {
    try {
      const settings = JSON.parse(saved)
      autoPlayInterval.value = settings.autoPlayInterval || 3000
      textSpeed.value = settings.textSpeed || 'normal'
      showSubtitles.value = settings.showSubtitles !== false
      enableSoundEffects.value = settings.enableSoundEffects !== false
      skipReadScenes.value = settings.skipReadScenes || false
    } catch (error) {
      console.error('加载设置失败:', error)
    }
  }
}

/**
 * 处理键盘事件
 */
const handleKeydown = (event) => {
  if (showSettingsModal.value) return
  
  switch (event.key) {
    case 'Escape':
      if (isFullscreen.value) {
        toggleFullscreen()
      } else {
        goBack()
      }
      break
    case ' ':
      event.preventDefault()
      togglePlayPause()
      break
    case 'ArrowLeft':
      if (hasPreviousScene.value) {
        previousScene()
      }
      break
    case 'ArrowRight':
      if (hasNextScene.value) {
        nextScene()
      }
      break
    case 'f':
    case 'F':
      toggleFullscreen()
      break
    case 'm':
    case 'M':
      toggleMute()
      break
  }
}

/**
 * 处理全屏变化
 */
const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement
}

// 监听节点ID变化
watch(nodeId, () => {
  if (nodeId.value) {
    loadStoryData()
  }
}, { immediate: true })

// 生命周期
onMounted(() => {
  loadSettings()
  document.addEventListener('keydown', handleKeydown)
  document.addEventListener('fullscreenchange', handleFullscreenChange)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
})
</script>

<style scoped>
.story-page-container {
  position: relative;
  height: 100vh;
  overflow: hidden;
  background: #000;
  font-family: 'Inter', sans-serif;
}

.story-main {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

/* 顶部导航栏 */
.top-nav {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  z-index: 20;
  transition: opacity 0.3s ease;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
  backdrop-filter: blur(10px);
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.nav-btn.active {
  background: rgba(59, 130, 246, 0.8);
  border-color: rgba(59, 130, 246, 1);
}

.node-info {
  color: white;
}

.node-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.node-subtitle {
  margin: 0;
  font-size: 0.875rem;
  opacity: 0.8;
}

/* 底部控制栏 */
.bottom-controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.9) 0%, transparent 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  z-index: 20;
}

.controls-left,
.controls-right {
  flex: 1;
  display: flex;
  align-items: center;
}

.controls-center {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.controls-right {
  justify-content: flex-end;
  gap: 1rem;
}

.story-progress {
  max-width: 200px;
  color: white;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
}

.progress-text {
  opacity: 0.8;
}

.progress-percentage {
  font-weight: 600;
}

.progress-bar {
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
  transition: width 0.3s ease;
}

.control-btn {
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.control-btn-primary {
  background: rgba(59, 130, 246, 0.8);
  border-color: rgba(59, 130, 246, 1);
  padding: 1rem;
}

.control-btn-primary:hover:not(:disabled) {
  background: rgba(37, 99, 235, 0.9);
}

/* 音量控制 */
.volume-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.volume-btn {
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s;
}

.volume-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.volume-slider {
  width: 80px;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
}

.volume-slider::-webkit-slider-thumb {
  appearance: none;
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
}

/* 速度控制 */
.speed-control {
  color: white;
}

.speed-select {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.speed-select option {
  background: #1f2937;
  color: white;
}

/* 设置弹窗 */
.settings-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
}

.modal-content {
  position: relative;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: 90%;
  max-height: 80vh;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.modal-close {
  padding: 0.25rem;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  border-radius: 0.25rem;
  transition: all 0.2s;
}

.modal-close:hover {
  background: #f3f4f6;
  color: #374151;
}

.modal-body {
  padding: 1.5rem;
  max-height: 400px;
  overflow-y: auto;
}

.setting-group {
  margin-bottom: 1.5rem;
}

.setting-label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.setting-select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background: white;
}

.setting-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-text {
  font-size: 0.875rem;
  color: #374151;
}

.modal-footer {
  display: flex;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.btn-primary {
  flex: 1;
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-secondary {
  padding: 0.75rem 1.5rem;
  background: #6b7280;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #4b5563;
}

/* 加载状态 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  color: white;
}

.loading-spinner {
  text-align: center;
}

.spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .top-nav {
    padding: 0 0.5rem;
  }
  
  .node-title {
    font-size: 1rem;
  }
  
  .node-subtitle {
    font-size: 0.75rem;
  }
  
  .bottom-controls {
    padding: 0 0.5rem;
    height: 70px;
  }
  
  .controls-center {
    gap: 0.5rem;
  }
  
  .control-btn {
    padding: 0.5rem;
  }
  
  .control-btn-primary {
    padding: 0.75rem;
  }
  
  .story-progress {
    max-width: 150px;
  }
  
  .volume-slider {
    width: 60px;
  }
}
</style>