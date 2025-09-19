<template>
  <div class="story-runner-container" :class="{ 'fullscreen': isFullscreen }">
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
    
    <!-- 故事背景 -->
    <div 
      v-if="!isLoading && !error"
      class="story-background"
      :style="{ backgroundImage: currentScene?.background ? `url(${currentScene.background})` : 'none' }"
    >
      <div class="story-overlay"></div>
    </div>
    
    <!-- 故事内容 -->
    <div class="story-content">
      <!-- 头部控制栏 -->
      <div class="story-header">
        <div class="story-title">
          <h2>{{ currentScene?.title || '长征故事' }}</h2>
          <span class="scene-type">{{ getSceneTypeLabel(currentScene?.type) }}</span>
        </div>
        
        <div class="story-controls">
          <button 
            @click="toggleTimelineView"
            class="control-btn"
            :class="{ active: showTimeline }"
            title="时间轴视图"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
            </svg>
          </button>
          
          <button 
            @click="toggleAutoPlay"
            class="control-btn"
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
            class="control-btn"
            title="全屏"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path v-if="isFullscreen" fill-rule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clip-rule="evenodd" />
              <path v-else fill-rule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12z" clip-rule="evenodd" />
            </svg>
          </button>
          
          <button 
            @click="closeStory"
            class="control-btn close-btn"
            title="关闭"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- 历史时间轴视图 -->
      <div v-if="showTimeline" class="timeline-view">
        <div class="timeline-container">
          <h3 class="timeline-title">长征历史时间轴</h3>
          <div class="timeline-content">
            <div 
              v-for="(node, index) in timelineNodes"
              :key="node.id"
              class="timeline-item"
              :class="{ active: node.id === currentNodeId }"
              @click="selectTimelineNode(node)"
            >
              <div class="timeline-marker">
                <div class="timeline-dot"></div>
                <div v-if="index < timelineNodes.length - 1" class="timeline-line"></div>
              </div>
              <div class="timeline-content-item">
                <div class="timeline-header">
                  <h4 class="timeline-node-title">{{ node.name_zh }}</h4>
                  <span class="timeline-date">{{ node.time }}</span>
                </div>
                <p class="timeline-summary">{{ node.summary_zh }}</p>
                <div v-if="node.id === currentNodeId" class="timeline-details">
                  <div class="timeline-description">
                    <p>{{ node.description_zh }}</p>
                  </div>
                  <div v-if="node.gallery && node.gallery.length > 0" class="timeline-gallery">
                    <h5>历史图片</h5>
                    <div class="gallery-grid">
                      <div 
                        v-for="(image, imgIndex) in node.gallery"
                        :key="imgIndex"
                        class="gallery-item"
                        @click="openImageModal(image, imgIndex)"
                      >
                        <img :src="image" :alt="`${node.name_zh} 图片 ${imgIndex + 1}`" />
                      </div>
                    </div>
                  </div>
                  <div v-if="node.historical_significance" class="timeline-significance">
                    <h5>历史意义</h5>
                    <p>{{ node.historical_significance }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 角色对话区域 -->
      <div class="dialogue-area" v-if="currentDialogue">
        <!-- 角色头像和信息 -->
        <div class="character-info" v-if="currentCharacter">
          <div class="character-avatar">
            <img 
              v-if="currentCharacter.avatar"
              :src="currentCharacter.avatar"
              :alt="currentCharacter.name"
              class="avatar-image"
            >
            <div v-else class="avatar-placeholder">
              {{ currentCharacter.name.charAt(0) }}
            </div>
          </div>
          
          <div class="character-details">
            <h3 class="character-name">{{ currentCharacter.name }}</h3>
            <p class="character-role">{{ currentCharacter.role }}</p>
          </div>
        </div>
        
        <!-- 对话内容 -->
        <div class="dialogue-content">
          <div class="dialogue-text" ref="dialogueTextRef">
            <p v-html="displayedText"></p>
          </div>
          
          <!-- 继续指示器 -->
          <div 
            v-if="isTextComplete && !isAutoPlay"
            class="continue-indicator"
          >
            <span>点击继续</span>
            <svg class="w-4 h-4 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
      
      <!-- 选择分支 -->
      <div class="choices-area" v-if="showChoices && currentChoices.length > 0">
        <h4 class="choices-title">请选择：</h4>
        <div class="choices-list">
          <button 
            v-for="(choice, index) in currentChoices"
            :key="index"
            @click="makeChoice(choice)"
            class="choice-btn"
            :class="{ disabled: choice.disabled }"
            :disabled="choice.disabled"
          >
            <span class="choice-text">{{ choice.text }}</span>
            <span v-if="choice.consequence" class="choice-consequence">
              {{ choice.consequence }}
            </span>
          </button>
        </div>
      </div>
      
      <!-- 场景描述 -->
      <div class="scene-description" v-if="currentScene?.description">
        <p>{{ currentScene.description }}</p>
      </div>
    </div>
    
    <!-- 进度指示器 -->
    <div class="story-progress">
      <div class="progress-bar">
        <div 
          class="progress-fill"
          :style="{ width: progressPercentage + '%' }"
        ></div>
      </div>
      <span class="progress-text">
        {{ currentDialogueIndex + 1 }} / {{ totalDialogues }}
      </span>
    </div>
    
    <!-- 音频控制 -->
    <audio 
      ref="backgroundMusicRef"
      :src="currentScene?.music"
      loop
      preload="auto"
    ></audio>
    
    <!-- 图片模态框 -->
    <div v-if="showImageModal" class="image-modal" @click="closeImageModal">
      <div class="image-modal-content" @click.stop>
        <button class="image-modal-close" @click="closeImageModal">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
        <img :src="currentModalImage" :alt="modalImageAlt" class="modal-image" />
        <div class="image-modal-nav">
          <button 
            @click="previousImage"
            class="nav-btn"
            :disabled="currentImageIndex === 0"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
          <span class="image-counter">{{ currentImageIndex + 1 }} / {{ currentGallery.length }}</span>
          <button 
            @click="nextImage"
            class="nav-btn"
            :disabled="currentImageIndex === currentGallery.length - 1"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useProgressStore } from '../stores/progress'
import { apiClient } from '../api'
import { eventBus } from '../utils/bus'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'

/**
 * 故事运行器组件
 * 负责播放长征历史场景的交互式故事
 */

// Props
const props = defineProps({
  // 场景ID
  sceneId: {
    type: String,
    required: true
  },
  // 是否自动播放
  autoPlay: {
    type: Boolean,
    default: false
  },
  // 文字显示速度（毫秒/字符）
  textSpeed: {
    type: Number,
    default: 50
  }
})

// Emits
const emit = defineEmits([
  'scene-complete',
  'choice-made',
  'story-close'
])

// 响应式数据
const currentScene = ref(null)
const currentDialogueIndex = ref(0)
const displayedText = ref('')
const isTextComplete = ref(false)
const isAutoPlay = ref(props.autoPlay)
const isFullscreen = ref(false)
const showChoices = ref(false)
const isLoading = ref(true)
const error = ref(null)
const retrying = ref(false)

// 时间轴相关数据
const showTimeline = ref(false)
const timelineNodes = ref([])
const currentNodeId = ref(null)

// 图片模态框相关数据
const showImageModal = ref(false)
const currentModalImage = ref('')
const modalImageAlt = ref('')
const currentImageIndex = ref(0)
const currentGallery = ref([])

// DOM引用
const dialogueTextRef = ref(null)
const backgroundMusicRef = ref(null)

// 定时器
let textTimer = null
let autoPlayTimer = null

// 存储
const progressStore = useProgressStore()

// 计算属性
const currentDialogue = computed(() => {
  if (!currentScene.value?.dialogues || currentDialogueIndex.value >= currentScene.value.dialogues.length) {
    return null
  }
  return currentScene.value.dialogues[currentDialogueIndex.value]
})

const currentCharacter = computed(() => {
  if (!currentDialogue.value?.character || !currentScene.value?.characters) {
    return null
  }
  return currentScene.value.characters.find(char => char.id === currentDialogue.value.character)
})

const currentChoices = computed(() => {
  return currentDialogue.value?.choices || []
})

const totalDialogues = computed(() => {
  return currentScene.value?.dialogues?.length || 0
})

const progressPercentage = computed(() => {
  if (totalDialogues.value === 0) return 0
  return ((currentDialogueIndex.value + 1) / totalDialogues.value) * 100
})

// 当前选中的时间轴节点
const currentSelectedNode = computed(() => {
  return timelineNodes.value.find(node => node.id === currentNodeId.value)
})

/**
 * 加载场景数据
 */
const loadScene = async (sceneId) => {
  try {
    isLoading.value = true
    error.value = null
    
    const scenes = await apiClient.getScenes()
    currentScene.value = scenes.find(scene => scene.id === sceneId)
    
    if (!currentScene.value) {
      throw new Error(`场景 ${sceneId} 不存在`)
    }
    
    // 加载时间轴节点数据
    await loadTimelineNodes()
    
    // 重置状态
    currentDialogueIndex.value = 0
    displayedText.value = ''
    isTextComplete.value = false
    showChoices.value = false
    
    // 开始播放第一段对话
    await nextTick()
    startDialogue()
    
    // 播放背景音乐
    playBackgroundMusic()
    
  } catch (err) {
    console.error('加载场景失败:', err)
    error.value = {
      title: '场景加载失败',
      message: '无法加载故事场景，请检查网络连接后重试。',
      details: err.message
    }
  } finally {
    isLoading.value = false
  }
}

/**
 * 加载时间轴节点数据
 */
const loadTimelineNodes = async () => {
  try {
    const nodes = await apiClient.getNodes()
    timelineNodes.value = nodes.sort((a, b) => {
      // 按时间排序，如果没有时间信息则按ID排序
      if (a.time && b.time) {
        return new Date(a.time.replace(/年|月|日/g, '').replace(/-/g, '/')) - 
               new Date(b.time.replace(/年|月|日/g, '').replace(/-/g, '/'))
      }
      return a.id.localeCompare(b.id)
    })
    
    // 设置当前节点ID（如果场景有关联的节点）
    if (currentScene.value?.nodeId) {
      currentNodeId.value = currentScene.value.nodeId
    } else if (timelineNodes.value.length > 0) {
      currentNodeId.value = timelineNodes.value[0].id
    }
  } catch (err) {
    console.error('加载时间轴节点失败:', err)
  }
}

/**
 * 切换时间轴视图
 */
const toggleTimelineView = () => {
  showTimeline.value = !showTimeline.value
}

/**
 * 选择时间轴节点
 */
const selectTimelineNode = (node) => {
  currentNodeId.value = node.id
  // 可以触发相关事件，比如地图飞行到该节点
  emit('node-selected', node)
}

/**
 * 打开图片模态框
 */
const openImageModal = (image, index) => {
  const selectedNode = timelineNodes.value.find(node => node.id === currentNodeId.value)
  if (selectedNode && selectedNode.gallery) {
    currentGallery.value = selectedNode.gallery
    currentImageIndex.value = index
    currentModalImage.value = image
    modalImageAlt.value = `${selectedNode.name_zh} 历史图片 ${index + 1}`
    showImageModal.value = true
  }
}

/**
 * 关闭图片模态框
 */
const closeImageModal = () => {
  showImageModal.value = false
  currentModalImage.value = ''
  modalImageAlt.value = ''
  currentImageIndex.value = 0
  currentGallery.value = []
}

/**
 * 上一张图片
 */
const previousImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
    currentModalImage.value = currentGallery.value[currentImageIndex.value]
    const selectedNode = timelineNodes.value.find(node => node.id === currentNodeId.value)
    modalImageAlt.value = `${selectedNode?.name_zh} 历史图片 ${currentImageIndex.value + 1}`
  }
}

/**
 * 下一张图片
 */
const nextImage = () => {
  if (currentImageIndex.value < currentGallery.value.length - 1) {
    currentImageIndex.value++
    currentModalImage.value = currentGallery.value[currentImageIndex.value]
    const selectedNode = timelineNodes.value.find(node => node.id === currentNodeId.value)
    modalImageAlt.value = `${selectedNode?.name_zh} 历史图片 ${currentImageIndex.value + 1}`
  }
}

/**
 * 开始播放对话
 */
const startDialogue = () => {
  if (!currentDialogue.value) {
    completeScene()
    return
  }
  
  displayedText.value = ''
  isTextComplete.value = false
  showChoices.value = false
  
  // 开始打字机效果
  typeText(currentDialogue.value.text)
}

/**
 * 打字机效果
 */
const typeText = (text) => {
  clearTimeout(textTimer)
  
  let index = 0
  const type = () => {
    if (index < text.length) {
      displayedText.value += text.charAt(index)
      index++
      textTimer = setTimeout(type, props.textSpeed)
    } else {
      isTextComplete.value = true
      
      // 显示选择分支
      if (currentChoices.value.length > 0) {
        showChoices.value = true
      } else if (isAutoPlay.value) {
        // 自动播放下一段对话
        autoPlayTimer = setTimeout(() => {
          nextDialogue()
        }, 2000)
      }
    }
  }
  
  type()
}

/**
 * 下一段对话
 */
const nextDialogue = () => {
  clearTimeout(autoPlayTimer)
  
  if (currentChoices.value.length > 0) {
    // 有选择分支，等待用户选择
    return
  }
  
  currentDialogueIndex.value++
  startDialogue()
}

/**
 * 做出选择
 */
const makeChoice = (choice) => {
  try {
    if (choice.disabled) return
    
    // 记录选择
    progressStore.recordChoice({
      sceneId: props.sceneId,
      dialogueIndex: currentDialogueIndex.value,
      choice: choice
    })
    
    emit('choice-made', {
      scene: currentScene.value,
      dialogue: currentDialogue.value,
      choice
    })
    
    // 根据选择跳转
    if (choice.nextDialogue !== undefined) {
      currentDialogueIndex.value = choice.nextDialogue
    } else {
      currentDialogueIndex.value++
    }
    
    startDialogue()
  } catch (err) {
    console.error('处理选择失败:', err)
    error.value = {
      title: '选择处理失败',
      message: '无法处理您的选择，请重试。',
      details: err.message
    }
  }
}

/**
 * 完成场景
 */
const completeScene = () => {
  emit('scene-complete', {
    scene: currentScene.value,
    choices: progressStore.getSceneChoices(props.sceneId)
  })
}

/**
 * 切换自动播放
 */
const toggleAutoPlay = () => {
  isAutoPlay.value = !isAutoPlay.value
  
  if (isAutoPlay.value && isTextComplete.value && currentChoices.value.length === 0) {
    autoPlayTimer = setTimeout(() => {
      nextDialogue()
    }, 1000)
  } else {
    clearTimeout(autoPlayTimer)
  }
}

/**
 * 切换全屏
 */
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
}

/**
 * 关闭故事
 */
const closeStory = () => {
  try {
    stopBackgroundMusic()
    emit('story-close')
  } catch (err) {
    console.error('关闭故事失败:', err)
    // 即使出错也要尝试关闭
    emit('story-close')
  }
}

/**
 * 重试加载
 */
const retry = async () => {
  retrying.value = true
  try {
    await loadScene(props.sceneId)
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
 * 播放背景音乐
 */
const playBackgroundMusic = () => {
  try {
    if (backgroundMusicRef.value && currentScene.value?.music) {
      backgroundMusicRef.value.volume = 0.3
      backgroundMusicRef.value.play().catch(error => {
        console.warn('背景音乐播放失败:', error)
        // 音乐播放失败不应该阻止故事继续
      })
    }
  } catch (err) {
    console.warn('背景音乐初始化失败:', err)
  }
}

/**
 * 停止背景音乐
 */
const stopBackgroundMusic = () => {
  if (backgroundMusicRef.value) {
    backgroundMusicRef.value.pause()
    backgroundMusicRef.value.currentTime = 0
  }
}

/**
 * 获取场景类型标签
 */
const getSceneTypeLabel = (type) => {
  const typeLabels = {
    dialogue: '对话',
    narrative: '叙述',
    choice: '选择',
    battle: '战斗',
    meeting: '会议'
  }
  return typeLabels[type] || '故事'
}

/**
 * 处理点击事件
 */
const handleClick = () => {
  if (!isTextComplete.value) {
    // 跳过打字机效果
    clearTimeout(textTimer)
    displayedText.value = currentDialogue.value?.text || ''
    isTextComplete.value = true
    
    if (currentChoices.value.length > 0) {
      showChoices.value = true
    }
  } else if (currentChoices.value.length === 0) {
    // 继续下一段对话
    nextDialogue()
  }
}

/**
 * 处理键盘事件
 */
const handleKeydown = (event) => {
  switch (event.key) {
    case ' ':
    case 'Enter':
      event.preventDefault()
      handleClick()
      break
    case 'Escape':
      closeStory()
      break
    case 'f':
    case 'F':
      toggleFullscreen()
      break
    case 'a':
    case 'A':
      toggleAutoPlay()
      break
  }
}

// 监听场景ID变化
watch(
  () => props.sceneId,
  (newSceneId) => {
    if (newSceneId) {
      loadScene(newSceneId)
    }
  },
  { immediate: true }
)

// 生命周期
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  clearTimeout(textTimer)
  clearTimeout(autoPlayTimer)
  stopBackgroundMusic()
})

// 暴露方法给父组件
defineExpose({
  loadScene,
  nextDialogue,
  makeChoice,
  toggleAutoPlay,
  closeStory,
  retry,
  closeError
})
</script>

<style scoped>
.story-runner-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  color: white;
  cursor: pointer;
}

.story-runner-container.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
}

.story-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: #1a1a1a;
}

.story-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3) 0%,
    rgba(0, 0, 0, 0.6) 100%
  );
}

.story-content {
  position: relative;
  z-index: 10;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.story-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
}

.story-title h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.scene-type {
  display: inline-block;
  margin-left: 0.5rem;
  padding: 0.25rem 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 0.25rem;
  font-size: 0.75rem;
}

.story-controls {
  display: flex;
  gap: 0.5rem;
}

.control-btn {
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.375rem;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.control-btn.active {
  background: rgba(59, 130, 246, 0.5);
  border-color: rgba(59, 130, 246, 0.7);
}

.control-btn.close-btn:hover {
  background: rgba(239, 68, 68, 0.5);
  border-color: rgba(239, 68, 68, 0.7);
}

.dialogue-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 2rem;
}

.character-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.character-avatar {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  font-weight: 600;
  font-size: 1.25rem;
}

.character-name {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
}

.character-role {
  margin: 0;
  font-size: 0.875rem;
  opacity: 0.8;
}

.dialogue-content {
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.dialogue-text {
  font-size: 1.125rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.continue-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
  font-size: 0.875rem;
  opacity: 0.7;
}

.choices-area {
  padding: 1rem 2rem 2rem;
}

.choices-title {
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  text-align: center;
}

.choices-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 600px;
  margin: 0 auto;
}

.choice-btn {
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  color: white;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
}

.choice-btn:hover:not(.disabled) {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.choice-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.choice-text {
  display: block;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.choice-consequence {
  display: block;
  font-size: 0.875rem;
  opacity: 0.7;
}

.scene-description {
  padding: 1rem 2rem;
  text-align: center;
  font-style: italic;
  opacity: 0.8;
}

.story-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem 2rem;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.progress-bar {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #06b6d4);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.875rem;
  opacity: 0.8;
  white-space: nowrap;
}

/* 时间轴视图样式 */
.timeline-view {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  z-index: 10;
  overflow-y: auto;
  padding: 20px;
}

.timeline-container {
  max-width: 1200px;
  margin: 0 auto;
}

.timeline-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 30px;
  background: linear-gradient(45deg, #ffd700, #ff6b6b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
}

.timeline-content {
  position: relative;
  padding-left: 30px;
}

.timeline-content::before {
  content: '';
  position: absolute;
  left: 15px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, #ffd700, #ff6b6b);
}

.timeline-item {
  position: relative;
  margin-bottom: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
}

.timeline-item:hover {
  transform: translateX(10px);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.timeline-item.active {
  background: rgba(255, 215, 0, 0.2);
  border-color: #ffd700;
  transform: translateX(15px);
}

.timeline-marker {
  position: absolute;
  left: -35px;
  top: 25px;
}

.timeline-dot {
  width: 12px;
  height: 12px;
  background: #ffd700;
  border-radius: 50%;
  border: 3px solid #1a1a2e;
  transition: all 0.3s ease;
}

.timeline-item.active .timeline-dot {
  background: #ff6b6b;
  transform: scale(1.3);
  box-shadow: 0 0 20px rgba(255, 107, 107, 0.5);
}

.timeline-line {
  position: absolute;
  top: 15px;
  left: 5px;
  width: 2px;
  height: 40px;
  background: linear-gradient(to bottom, #ffd700, #ff6b6b);
}

.timeline-content-item {
  color: #fff;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.timeline-node-title {
  font-size: 1.3rem;
  font-weight: bold;
  margin: 0;
}

.timeline-date {
  color: #ffd700;
  font-size: 0.9rem;
  font-weight: bold;
}

.timeline-summary {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 15px;
}

.timeline-details {
  margin-top: 15px;
}

.timeline-description {
  margin-bottom: 15px;
}

.timeline-description p {
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
}

.timeline-gallery h5,
.timeline-significance h5 {
  color: #ffd700;
  font-weight: bold;
  margin-bottom: 10px;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 10px;
  margin-bottom: 15px;
}

.gallery-item {
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.gallery-item:hover {
  transform: scale(1.05);
}

.gallery-item img {
  width: 100%;
  height: 80px;
  object-fit: cover;
}

.timeline-significance {
  background: rgba(255, 215, 0, 0.1);
  border-left: 4px solid #ffd700;
  padding: 10px 15px;
  border-radius: 0 8px 8px 0;
}

.timeline-significance p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
}

/* 图片模态框样式 */
.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.image-modal-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.image-modal-close {
  position: absolute;
  top: -40px;
  right: 0;
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  z-index: 1001;
  transition: color 0.3s ease;
  padding: 5px;
}

.image-modal-close:hover {
  color: #ff6b6b;
}

.modal-image {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 10px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.image-modal-nav {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
}

.nav-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: #fff;
  padding: 10px 15px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.nav-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.image-counter {
  color: #fff;
  font-size: 1rem;
  background: rgba(0, 0, 0, 0.5);
  padding: 5px 15px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .story-header {
    padding: 0.75rem 1rem;
  }
  
  .story-title h2 {
    font-size: 1.25rem;
  }
  
  .dialogue-area {
    padding: 1rem;
  }
  
  .dialogue-text {
    font-size: 1rem;
  }
  
  .choices-area {
    padding: 1rem;
  }
  
  .story-progress {
    padding: 0.75rem 1rem;
  }
  
  .timeline-view {
    padding: 15px;
  }
  
  .timeline-title {
    font-size: 1.5rem;
  }
  
  .timeline-content {
    padding-left: 20px;
  }
  
  .timeline-item {
    padding: 15px;
    margin-bottom: 30px;
  }
  
  .gallery-grid {
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  }
  
  .gallery-item img {
    height: 60px;
  }
  
  .image-modal-content {
    max-width: 95vw;
    max-height: 95vh;
  }
  
  .modal-image {
    max-height: 70vh;
  }
}
</style>