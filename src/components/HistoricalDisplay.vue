<template>
  <div class="historical-display">
    <!-- 历史资料展示头部 -->
    <div class="display-header">
      <h2 class="display-title">{{ title || '历史资料' }}</h2>
      <div class="display-controls">
        <button 
          class="control-btn"
          @click="toggleFullscreen"
          :title="isFullscreen ? '退出全屏' : '全屏显示'"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path v-if="!isFullscreen" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
            <path v-else d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
          </svg>
        </button>
        <button class="control-btn" @click="$emit('close')" title="关闭">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 媒体内容区域 -->
    <div class="media-container" ref="mediaContainer">
      <!-- 图片轮播 -->
      <div v-if="currentMedia.type === 'images'" class="image-carousel">
        <div class="carousel-container">
          <div 
            class="carousel-track" 
            :style="{ transform: `translateX(-${currentImageIndex * 100}%)` }"
          >
            <div 
              v-for="(image, index) in currentMedia.items" 
              :key="index"
              class="carousel-slide"
            >
              <img 
                :src="image.url" 
                :alt="image.caption || `历史图片 ${index + 1}`"
                class="carousel-image"
                @load="onImageLoad"
                @error="onImageError"
              />
              <div v-if="image.caption" class="image-caption">
                {{ image.caption }}
              </div>
            </div>
          </div>
        </div>
        
        <!-- 轮播控制 -->
        <div class="carousel-controls">
          <button 
            class="carousel-btn prev"
            @click="previousImage"
            :disabled="currentImageIndex === 0"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>
          <button 
            class="carousel-btn next"
            @click="nextImage"
            :disabled="currentImageIndex === currentMedia.items.length - 1"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </button>
        </div>
        
        <!-- 轮播指示器 -->
        <div class="carousel-indicators">
          <button 
            v-for="(image, index) in currentMedia.items"
            :key="index"
            class="indicator"
            :class="{ active: index === currentImageIndex }"
            @click="goToImage(index)"
          >
            <span class="sr-only">图片 {{ index + 1 }}</span>
          </button>
        </div>
      </div>

      <!-- 视频播放器 -->
      <div v-else-if="currentMedia.type === 'video'" class="video-player">
        <video 
          ref="videoPlayer"
          class="video-element"
          :src="currentMedia.url"
          :poster="currentMedia.poster"
          @loadedmetadata="onVideoLoaded"
          @timeupdate="onTimeUpdate"
          @ended="onVideoEnded"
          @error="onVideoError"
        ></video>
        
        <!-- 视频控制栏 -->
        <div class="video-controls" :class="{ visible: showVideoControls }">
          <button class="play-btn" @click="togglePlay">
            <svg v-if="!isPlaying" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          </button>
          
          <div class="time-display">
            {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
          </div>
          
          <div class="progress-container">
            <input 
              type="range" 
              class="progress-bar"
              :value="progressPercentage"
              @input="seekVideo"
              min="0"
              max="100"
            />
          </div>
          
          <button class="volume-btn" @click="toggleMute">
            <svg v-if="!isMuted && volume > 0.5" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
            <svg v-else-if="!isMuted && volume > 0" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>
            </svg>
            <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
            </svg>
          </button>
          
          <input 
            type="range" 
            class="volume-slider"
            v-model="volume"
            @input="updateVolume"
            min="0"
            max="1"
            step="0.1"
          />
        </div>
      </div>

      <!-- 音频播放器 -->
      <div v-else-if="currentMedia.type === 'audio'" class="audio-player">
        <div class="audio-info">
          <div class="audio-title">{{ currentMedia.title || '音频资料' }}</div>
          <div class="audio-description">{{ currentMedia.description }}</div>
        </div>
        
        <audio 
          ref="audioPlayer"
          :src="currentMedia.url"
          @loadedmetadata="onAudioLoaded"
          @timeupdate="onTimeUpdate"
          @ended="onAudioEnded"
          @error="onAudioError"
        ></audio>
        
        <div class="audio-controls">
          <button class="play-btn large" @click="togglePlay">
            <svg v-if="!isPlaying" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <svg v-else width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          </button>
          
          <div class="audio-progress">
            <div class="time-info">
              <span>{{ formatTime(currentTime) }}</span>
              <span>{{ formatTime(duration) }}</span>
            </div>
            <input 
              type="range" 
              class="progress-bar"
              :value="progressPercentage"
              @input="seekAudio"
              min="0"
              max="100"
            />
          </div>
        </div>
      </div>

      <!-- 文档展示 -->
      <div v-else-if="currentMedia.type === 'document'" class="document-viewer">
        <div class="document-header">
          <h3>{{ currentMedia.title }}</h3>
          <div class="document-meta">
            <span>{{ currentMedia.date }}</span>
            <span>{{ currentMedia.source }}</span>
          </div>
        </div>
        <div class="document-content" v-html="currentMedia.content"></div>
      </div>
    </div>

    <!-- 媒体列表 -->
    <div v-if="mediaList.length > 1" class="media-list">
      <h3>相关资料</h3>
      <div class="media-items">
        <div 
          v-for="(media, index) in mediaList"
          :key="index"
          class="media-item"
          :class="{ active: index === currentMediaIndex }"
          @click="selectMedia(index)"
        >
          <div class="media-thumbnail">
            <img v-if="media.thumbnail" :src="media.thumbnail" :alt="media.title" />
            <div v-else class="media-icon">
              <svg v-if="media.type === 'images'" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
              </svg>
              <svg v-else-if="media.type === 'video'" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
              </svg>
              <svg v-else-if="media.type === 'audio'" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
              <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              </svg>
            </div>
          </div>
          <div class="media-info">
            <div class="media-title">{{ media.title }}</div>
            <div class="media-type">{{ getMediaTypeLabel(media.type) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

/**
 * 历史资料展示组件
 * 支持图片轮播、视频播放、音频播放和文档展示
 */

// Props
const props = defineProps({
  title: {
    type: String,
    default: '历史资料'
  },
  mediaList: {
    type: Array,
    required: true,
    default: () => []
  },
  initialIndex: {
    type: Number,
    default: 0
  },
  autoPlay: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['close', 'media-change'])

// 响应式数据
const mediaContainer = ref(null)
const videoPlayer = ref(null)
const audioPlayer = ref(null)

// 媒体控制状态
const currentMediaIndex = ref(props.initialIndex)
const currentImageIndex = ref(0)
const isFullscreen = ref(false)
const isPlaying = ref(false)
const isMuted = ref(false)
const volume = ref(1)
const currentTime = ref(0)
const duration = ref(0)
const showVideoControls = ref(true)
const controlsTimer = ref(null)

// 计算属性
const currentMedia = computed(() => {
  return props.mediaList[currentMediaIndex.value] || {}
})

const progressPercentage = computed(() => {
  if (duration.value === 0) return 0
  return (currentTime.value / duration.value) * 100
})

// 方法

/**
 * 切换全屏模式
 */
const toggleFullscreen = async () => {
  if (!document.fullscreenElement) {
    try {
      await mediaContainer.value.requestFullscreen()
      isFullscreen.value = true
    } catch (error) {
      console.error('进入全屏失败:', error)
    }
  } else {
    try {
      await document.exitFullscreen()
      isFullscreen.value = false
    } catch (error) {
      console.error('退出全屏失败:', error)
    }
  }
}

/**
 * 图片轮播控制
 */
const previousImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  }
}

const nextImage = () => {
  if (currentImageIndex.value < currentMedia.value.items.length - 1) {
    currentImageIndex.value++
  }
}

const goToImage = (index) => {
  currentImageIndex.value = index
}

/**
 * 视频/音频播放控制
 */
const togglePlay = () => {
  const player = currentMedia.value.type === 'video' ? videoPlayer.value : audioPlayer.value
  if (!player) return
  
  if (isPlaying.value) {
    player.pause()
  } else {
    player.play()
  }
  isPlaying.value = !isPlaying.value
}

const toggleMute = () => {
  const player = currentMedia.value.type === 'video' ? videoPlayer.value : audioPlayer.value
  if (!player) return
  
  isMuted.value = !isMuted.value
  player.muted = isMuted.value
}

const updateVolume = () => {
  const player = currentMedia.value.type === 'video' ? videoPlayer.value : audioPlayer.value
  if (!player) return
  
  player.volume = volume.value
  isMuted.value = volume.value === 0
}

const seekVideo = (event) => {
  if (!videoPlayer.value) return
  const seekTime = (event.target.value / 100) * duration.value
  videoPlayer.value.currentTime = seekTime
}

const seekAudio = (event) => {
  if (!audioPlayer.value) return
  const seekTime = (event.target.value / 100) * duration.value
  audioPlayer.value.currentTime = seekTime
}

/**
 * 媒体选择
 */
const selectMedia = (index) => {
  currentMediaIndex.value = index
  currentImageIndex.value = 0
  emit('media-change', props.mediaList[index])
}

/**
 * 获取媒体类型标签
 */
const getMediaTypeLabel = (type) => {
  const labels = {
    images: '图片集',
    video: '视频',
    audio: '音频',
    document: '文档'
  }
  return labels[type] || '未知'
}

/**
 * 格式化时间
 */
const formatTime = (seconds) => {
  if (isNaN(seconds)) return '00:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

/**
 * 事件处理
 */
const onImageLoad = () => {
  console.log('图片加载完成')
}

const onImageError = (event) => {
  console.error('图片加载失败:', event.target.src)
}

const onVideoLoaded = () => {
  if (videoPlayer.value) {
    duration.value = videoPlayer.value.duration
    if (props.autoPlay) {
      togglePlay()
    }
  }
}

const onAudioLoaded = () => {
  if (audioPlayer.value) {
    duration.value = audioPlayer.value.duration
    if (props.autoPlay) {
      togglePlay()
    }
  }
}

const onTimeUpdate = (event) => {
  currentTime.value = event.target.currentTime
}

const onVideoEnded = () => {
  isPlaying.value = false
  currentTime.value = 0
}

const onAudioEnded = () => {
  isPlaying.value = false
  currentTime.value = 0
}

const onVideoError = (event) => {
  console.error('视频播放错误:', event)
}

const onAudioError = (event) => {
  console.error('音频播放错误:', event)
}

/**
 * 键盘事件处理
 */
const handleKeydown = (event) => {
  switch (event.key) {
    case 'Escape':
      if (isFullscreen.value) {
        toggleFullscreen()
      } else {
        emit('close')
      }
      break
    case 'ArrowLeft':
      if (currentMedia.value.type === 'images') {
        previousImage()
      }
      break
    case 'ArrowRight':
      if (currentMedia.value.type === 'images') {
        nextImage()
      }
      break
    case ' ':
      if (currentMedia.value.type === 'video' || currentMedia.value.type === 'audio') {
        event.preventDefault()
        togglePlay()
      }
      break
  }
}

/**
 * 鼠标移动事件处理（视频控制栏显示/隐藏）
 */
const handleMouseMove = () => {
  if (currentMedia.value.type === 'video') {
    showVideoControls.value = true
    clearTimeout(controlsTimer.value)
    controlsTimer.value = setTimeout(() => {
      showVideoControls.value = false
    }, 3000)
  }
}

// 监听器
watch(() => currentMediaIndex.value, () => {
  // 重置播放状态
  isPlaying.value = false
  currentTime.value = 0
  duration.value = 0
  currentImageIndex.value = 0
})

watch(() => props.mediaList, () => {
  if (currentMediaIndex.value >= props.mediaList.length) {
    currentMediaIndex.value = 0
  }
}, { deep: true })

// 生命周期
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  document.addEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement
  })
  
  if (mediaContainer.value) {
    mediaContainer.value.addEventListener('mousemove', handleMouseMove)
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  if (mediaContainer.value) {
    mediaContainer.value.removeEventListener('mousemove', handleMouseMove)
  }
  if (controlsTimer.value) {
    clearTimeout(controlsTimer.value)
  }
})
</script>

<style scoped>
.historical-display {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.95);
  z-index: 2000;
  display: flex;
  flex-direction: column;
  color: white;
}

/* 头部样式 */
.display-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.display-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  color: white;
}

.display-controls {
  display: flex;
  gap: 12px;
}

.control-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

/* 媒体容器样式 */
.media-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

/* 图片轮播样式 */
.image-carousel {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-container {
  width: 90%;
  height: 80%;
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.carousel-track {
  display: flex;
  height: 100%;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.carousel-slide {
  min-width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
}

.image-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
  padding: 20px;
  font-size: 16px;
  text-align: center;
}

.carousel-controls {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  pointer-events: none;
}

.carousel-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: rgba(0, 0, 0, 0.6);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  pointer-events: auto;
}

.carousel-btn:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.8);
  transform: scale(1.1);
}

.carousel-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.carousel-indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: all 0.2s ease;
}

.indicator.active {
  background: white;
  transform: scale(1.2);
}

.indicator:hover {
  background: rgba(255, 255, 255, 0.7);
}

/* 视频播放器样式 */
.video-player {
  width: 90%;
  height: 80%;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.video-element {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: black;
}

.video-controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.video-controls.visible {
  opacity: 1;
}

.play-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.play-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.play-btn.large {
  width: 60px;
  height: 60px;
}

.time-display {
  font-size: 14px;
  color: white;
  min-width: 100px;
  text-align: center;
}

.progress-container {
  flex: 1;
  margin: 0 16px;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  outline: none;
  cursor: pointer;
  appearance: none;
}

.progress-bar::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  background: #dc2626;
  border-radius: 50%;
  cursor: pointer;
}

.volume-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.volume-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.volume-slider {
  width: 80px;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
  appearance: none;
}

.volume-slider::-webkit-slider-thumb {
  appearance: none;
  width: 14px;
  height: 14px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
}

/* 音频播放器样式 */
.audio-player {
  width: 600px;
  max-width: 90%;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 30px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.audio-info {
  text-align: center;
  margin-bottom: 30px;
}

.audio-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
  color: white;
}

.audio-description {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
}

.audio-controls {
  display: flex;
  align-items: center;
  gap: 20px;
}

.audio-progress {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.time-info {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

/* 文档查看器样式 */
.document-viewer {
  width: 90%;
  height: 80%;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
}

.document-header {
  padding: 20px 30px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.document-header h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  color: #333;
}

.document-meta {
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: #666;
}

.document-content {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
  color: #333;
  line-height: 1.6;
}

.document-content h1,
.document-content h2,
.document-content h3 {
  color: #333;
  margin-top: 24px;
  margin-bottom: 12px;
}

.document-content p {
  margin-bottom: 16px;
}

/* 媒体列表样式 */
.media-list {
  background: rgba(0, 0, 0, 0.8);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px 30px;
  max-height: 200px;
  overflow-y: auto;
}

.media-list h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: white;
}

.media-items {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 8px;
}

.media-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 120px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.media-item:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.media-item.active {
  border-color: #dc2626;
  background: rgba(220, 38, 38, 0.2);
}

.media-thumbnail {
  width: 80px;
  height: 60px;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
}

.media-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.media-icon {
  color: rgba(255, 255, 255, 0.6);
}

.media-info {
  text-align: center;
}

.media-title {
  font-size: 12px;
  font-weight: 500;
  color: white;
  margin-bottom: 4px;
  line-height: 1.3;
}

.media-type {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.6);
}

/* 辅助类 */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .display-header {
    padding: 15px 20px;
  }
  
  .display-title {
    font-size: 20px;
  }
  
  .control-btn {
    width: 40px;
    height: 40px;
  }
  
  .carousel-container,
  .video-player {
    width: 95%;
    height: 70%;
  }
  
  .carousel-controls {
    padding: 0 10px;
  }
  
  .carousel-btn {
    width: 44px;
    height: 44px;
  }
  
  .video-controls {
    padding: 15px;
    gap: 12px;
  }
  
  .time-display {
    font-size: 12px;
    min-width: 80px;
  }
  
  .volume-slider {
    width: 60px;
  }
  
  .audio-player {
    width: 95%;
    padding: 20px;
  }
  
  .audio-title {
    font-size: 18px;
  }
  
  .document-viewer {
    width: 95%;
    height: 75%;
  }
  
  .document-header {
    padding: 15px 20px;
  }
  
  .document-content {
    padding: 20px;
  }
  
  .media-list {
    padding: 15px 20px;
    max-height: 150px;
  }
  
  .media-items {
    gap: 12px;
  }
  
  .media-item {
    min-width: 100px;
    padding: 10px;
  }
  
  .media-thumbnail {
    width: 60px;
    height: 45px;
  }
}

@media (max-width: 480px) {
  .display-header {
    padding: 12px 15px;
  }
  
  .display-title {
    font-size: 18px;
  }
  
  .control-btn {
    width: 36px;
    height: 36px;
  }
  
  .carousel-container,
  .video-player {
    width: 98%;
    height: 65%;
  }
  
  .audio-player {
    width: 98%;
    padding: 15px;
  }
  
  .audio-controls {
    flex-direction: column;
    gap: 15px;
  }
  
  .play-btn.large {
    width: 50px;
    height: 50px;
  }
  
  .document-viewer {
    width: 98%;
    height: 70%;
  }
  
  .media-list {
    padding: 12px 15px;
  }
  
  .media-item {
    min-width: 80px;
    padding: 8px;
  }
  
  .media-thumbnail {
    width: 50px;
    height: 38px;
  }
  
  .media-title {
    font-size: 11px;
  }
  
  .media-type {
    font-size: 9px;
  }
}
</style>