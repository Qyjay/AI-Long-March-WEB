<template>
  <Teleport to="body">
    <Transition
      name="achievement-toast"
      @enter="onEnter"
      @leave="onLeave"
    >
      <div 
        v-if="visible" 
        class="achievement-toast"
        :class="`rarity-${achievement?.rarity || 'common'}`"
        ref="toastRef"
      >
        <div class="toast-content">
          <!-- 成就图标 -->
          <div class="achievement-icon">
            <img 
              v-if="achievement?.icon"
              :src="achievement.icon"
              :alt="achievement.name"
              class="icon-image"
            />
            <div v-else class="icon-placeholder">
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
          
          <!-- 成就信息 -->
          <div class="achievement-info">
            <div class="achievement-header">
              <span class="achievement-label">成就解锁</span>
              <span class="achievement-points">+{{ achievement?.points || 0 }} 点</span>
            </div>
            <h3 class="achievement-name">{{ achievement?.name || '未知成就' }}</h3>
            <p class="achievement-description">{{ achievement?.description || '暂无描述' }}</p>
          </div>
          
          <!-- 稀有度指示器 -->
          <div class="rarity-indicator">
            <span class="rarity-text">{{ getRarityName(achievement?.rarity) }}</span>
          </div>
        </div>
        
        <!-- 关闭按钮 -->
        <button 
          @click="close"
          class="close-button"
          aria-label="关闭成就提示"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
        
        <!-- 进度条 -->
        <div class="progress-bar">
          <div 
            class="progress-fill"
            :style="{ width: progressWidth + '%' }"
          ></div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'

/**
 * 成就解锁提示组件
 * 使用GSAP动画显示成就解锁通知
 */

// Props
const props = defineProps({
  // 成就数据
  achievement: {
    type: Object,
    default: null
  },
  // 显示时长（毫秒）
  duration: {
    type: Number,
    default: 3000
  },
  // 是否自动关闭
  autoClose: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits([
  'close',
  'click'
])

// 响应式数据
const visible = ref(false)
const toastRef = ref(null)
const progressWidth = ref(100)
const progressTimer = ref(null)
const autoCloseTimer = ref(null)

/**
 * 获取稀有度名称
 */
const getRarityName = (rarity) => {
  const rarityMap = {
    common: '普通',
    uncommon: '优秀', 
    rare: '稀有',
    epic: '史诗',
    legendary: '传奇',
    mythic: '神话'
  }
  return rarityMap[rarity] || '普通'
}

/**
 * 显示成就提示
 */
const show = () => {
  if (!props.achievement) return
  
  visible.value = true
  
  // 启动进度条动画
  if (props.autoClose) {
    startProgressAnimation()
    startAutoCloseTimer()
  }
}

/**
 * 关闭成就提示
 */
const close = () => {
  clearTimers()
  visible.value = false
  emit('close')
}

/**
 * 启动进度条动画
 */
const startProgressAnimation = () => {
  progressWidth.value = 100
  
  gsap.to(progressWidth, {
    value: 0,
    duration: props.duration / 1000,
    ease: 'none'
  })
}

/**
 * 启动自动关闭定时器
 */
const startAutoCloseTimer = () => {
  autoCloseTimer.value = setTimeout(() => {
    close()
  }, props.duration)
}

/**
 * 清除定时器
 */
const clearTimers = () => {
  if (progressTimer.value) {
    clearTimeout(progressTimer.value)
    progressTimer.value = null
  }
  if (autoCloseTimer.value) {
    clearTimeout(autoCloseTimer.value)
    autoCloseTimer.value = null
  }
}

/**
 * 进入动画
 */
const onEnter = (el) => {
  gsap.fromTo(el, 
    {
      y: -100,
      opacity: 0,
      scale: 0.8
    },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.6,
      ease: 'power2.out'
    }
  )
}

/**
 * 离开动画
 */
const onLeave = (el) => {
  gsap.to(el, {
    y: -50,
    opacity: 0,
    scale: 0.9,
    duration: 0.4,
    ease: 'power2.in'
  })
}

// 暴露方法给父组件
defineExpose({
  show,
  close
})

// 组件挂载时如果有成就数据则自动显示
onMounted(() => {
  if (props.achievement) {
    show()
  }
})

// 组件卸载时清除定时器
onUnmounted(() => {
  clearTimers()
})
</script>

<style scoped>
.achievement-toast {
  position: fixed;
  top: 2rem;
  right: 2rem;
  z-index: 9999;
  max-width: 400px;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  border: 2px solid transparent;
}

/* 稀有度样式 */
.rarity-common {
  border-color: #9ca3af;
}

.rarity-uncommon {
  border-color: #22c55e;
}

.rarity-rare {
  border-color: #3b82f6;
  box-shadow: 0 20px 40px rgba(59, 130, 246, 0.3);
}

.rarity-epic {
  border-color: #8b5cf6;
  box-shadow: 0 20px 40px rgba(139, 92, 246, 0.3);
}

.rarity-legendary {
  border-color: #f59e0b;
  box-shadow: 0 20px 40px rgba(245, 158, 11, 0.3);
  position: relative;
}

.rarity-legendary::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(245, 158, 11, 0.1) 50%, transparent 70%);
  animation: shine 2s infinite;
  pointer-events: none;
}

.rarity-mythic {
  border-color: #ec4899;
  box-shadow: 0 20px 40px rgba(236, 72, 153, 0.3);
  background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%);
}

@keyframes shine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.toast-content {
  padding: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  position: relative;
}

.achievement-icon {
  flex-shrink: 0;
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  overflow: hidden;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.icon-placeholder {
  color: #6b7280;
}

.achievement-info {
  flex: 1;
  min-width: 0;
}

.achievement-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.achievement-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.achievement-points {
  font-size: 0.875rem;
  font-weight: 600;
  color: #059669;
  background: #d1fae5;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
}

.achievement-name {
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.3;
}

.achievement-description {
  margin: 0;
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.4;
}

.rarity-indicator {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.rarity-text {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  background: rgba(0, 0, 0, 0.1);
  color: #374151;
}

.close-button {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 2rem;
  height: 2rem;
  border: none;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 0.375rem;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-button:hover {
  background: rgba(0, 0, 0, 0.2);
  color: #374151;
}

.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(0, 0, 0, 0.1);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #059669);
  transition: width 0.1s linear;
}

/* 过渡动画 */
.achievement-toast-enter-active,
.achievement-toast-leave-active {
  transition: all 0.3s ease;
}

.achievement-toast-enter-from {
  transform: translateY(-100%) scale(0.8);
  opacity: 0;
}

.achievement-toast-leave-to {
  transform: translateY(-50px) scale(0.9);
  opacity: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .achievement-toast {
    top: 1rem;
    right: 1rem;
    left: 1rem;
    max-width: none;
  }
  
  .toast-content {
    padding: 1rem;
  }
  
  .achievement-icon {
    width: 2.5rem;
    height: 2.5rem;
  }
  
  .achievement-name {
    font-size: 1rem;
  }
  
  .achievement-description {
    font-size: 0.8rem;
  }
}
</style>