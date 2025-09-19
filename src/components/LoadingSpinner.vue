<template>
  <div class="loading-container" :class="{ overlay: overlay }">
    <div class="loading-content">
      <div class="spinner" :class="size"></div>
      <p v-if="message" class="loading-message">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
/**
 * 加载状态组件
 * 提供统一的加载动画和消息显示
 */
defineProps({
  // 是否显示为覆盖层
  overlay: {
    type: Boolean,
    default: false
  },
  // 加载消息
  message: {
    type: String,
    default: ''
  },
  // 尺寸大小
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  }
})
</script>

<style scoped>
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.loading-container.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  z-index: 9999;
  padding: 0;
}

.loading-content {
  text-align: center;
}

.spinner {
  border: 3px solid #e5e7eb;
  border-top: 3px solid #dc2626;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

.spinner.small {
  width: 1.5rem;
  height: 1.5rem;
  border-width: 2px;
}

.spinner.medium {
  width: 2.5rem;
  height: 2.5rem;
}

.spinner.large {
  width: 4rem;
  height: 4rem;
  border-width: 4px;
}

.loading-message {
  margin-top: 1rem;
  color: #6b7280;
  font-size: 0.875rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 移动端优化 */
@media (max-width: 768px) {
  .loading-container {
    padding: 1rem;
  }
  
  .spinner.large {
    width: 3rem;
    height: 3rem;
  }
  
  .loading-message {
    font-size: 0.8rem;
  }
}
</style>