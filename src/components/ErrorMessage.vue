<template>
  <div class="error-container" :class="{ overlay: overlay }">
    <div class="error-content">
      <div class="error-icon">
        <svg class="w-12 h-12 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
      </div>
      
      <h3 class="error-title">{{ title || '出现错误' }}</h3>
      
      <p class="error-message">{{ message || '请稍后重试或联系技术支持' }}</p>
      
      <div class="error-details" v-if="details && showDetails">
        <button 
          @click="toggleDetails" 
          class="details-toggle"
        >
          {{ showDetailsText ? '隐藏详情' : '显示详情' }}
        </button>
        <pre v-if="showDetailsText" class="details-content">{{ details }}</pre>
      </div>
      
      <div class="error-actions">
        <button 
          v-if="showRetry"
          @click="handleRetry"
          class="btn btn-primary"
          :disabled="retrying"
        >
          <svg v-if="retrying" class="w-4 h-4 mr-2 animate-spin" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
          </svg>
          {{ retrying ? '重试中...' : '重试' }}
        </button>
        
        <button 
          v-if="showClose"
          @click="handleClose"
          class="btn btn-secondary"
        >
          关闭
        </button>
        
        <button 
          v-if="showHome"
          @click="handleGoHome"
          class="btn btn-outline"
        >
          返回首页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

/**
 * 错误提示组件
 * 提供统一的错误信息显示和处理
 */
const props = defineProps({
  // 错误标题
  title: {
    type: String,
    default: ''
  },
  // 错误消息
  message: {
    type: String,
    default: ''
  },
  // 错误详情
  details: {
    type: String,
    default: ''
  },
  // 是否显示为覆盖层
  overlay: {
    type: Boolean,
    default: false
  },
  // 是否显示重试按钮
  showRetry: {
    type: Boolean,
    default: true
  },
  // 是否显示关闭按钮
  showClose: {
    type: Boolean,
    default: true
  },
  // 是否显示返回首页按钮
  showHome: {
    type: Boolean,
    default: false
  },
  // 重试状态
  retrying: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['retry', 'close'])
const router = useRouter()

const showDetails = ref(false)
const showDetailsText = ref(false)

/**
 * 切换详情显示
 */
const toggleDetails = () => {
  showDetailsText.value = !showDetailsText.value
}

/**
 * 处理重试
 */
const handleRetry = () => {
  emit('retry')
}

/**
 * 处理关闭
 */
const handleClose = () => {
  emit('close')
}

/**
 * 返回首页
 */
const handleGoHome = () => {
  router.push('/')
}

// 如果有详情，显示详情按钮
if (props.details) {
  showDetails.value = true
}
</script>

<style scoped>
.error-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.error-container.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(4px);
  z-index: 9999;
  padding: 0;
}

.error-content {
  text-align: center;
  max-width: 500px;
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.error-icon {
  margin-bottom: 1rem;
}

.error-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.error-message {
  color: #6b7280;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.error-details {
  margin-bottom: 1.5rem;
}

.details-toggle {
  color: #3b82f6;
  text-decoration: underline;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.details-toggle:hover {
  color: #2563eb;
}

.details-content {
  background: #f3f4f6;
  border-radius: 0.5rem;
  padding: 1rem;
  text-align: left;
  font-size: 0.75rem;
  color: #374151;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
}

.error-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  min-height: 40px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #dc2626;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #b91c1c;
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background: #4b5563;
}

.btn-outline {
  background: transparent;
  color: #3b82f6;
  border: 1px solid #3b82f6;
}

.btn-outline:hover {
  background: #3b82f6;
  color: white;
}

/* 移动端优化 */
@media (max-width: 768px) {
  .error-container {
    padding: 1rem;
  }
  
  .error-content {
    padding: 1.5rem;
    margin: 0 0.5rem;
  }
  
  .error-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
  
  .error-title {
    font-size: 1.25rem;
  }
  
  .error-message {
    font-size: 0.875rem;
  }
}
</style>