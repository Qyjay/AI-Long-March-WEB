<template>
  <Teleport to="body">
    <div
      class="story-modal-overlay"
      @click="$emit('close')"
    >
      <div
        class="story-modal"
        @click.stop
      >
        <div class="modal-header">
          <h2 class="modal-title">
            {{ story.title }}
          </h2>
          <button
            class="close-btn"
            @click="$emit('close')"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div class="modal-content">
          <div
            v-if="story.time || story.location"
            class="story-meta"
          >
            <span
              v-if="story.time"
              class="story-time"
            >📅 {{ story.time }}</span>
            <span
              v-if="story.location"
              class="story-location"
            >📍 {{ story.location }}</span>
          </div>
          <div class="story-text">
            <p class="story-content">
              {{ story.content }}
            </p>
          </div>
        </div>
        <div class="modal-footer">
          <button
            class="close-action-btn"
            @click="$emit('close')"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
/**
 * 故事详情弹窗组件
 * 用于在历史故事页面展示完整故事内容
 */

defineProps({
  story: {
    type: Object,
    required: true
  }
})

defineEmits(['close'])
</script>

<style scoped>
.story-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.story-modal {
  background: linear-gradient(135deg, rgba(139, 0, 0, 0.95) 0%, rgba(45, 24, 16, 0.98) 100%);
  border-radius: 20px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(212, 175, 55, 0.3);
  border: 2px solid rgba(212, 175, 55, 0.2);
  backdrop-filter: blur(20px);
  animation: modalAppear 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes modalAppear {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32px;
  border-bottom: 2px solid rgba(212, 175, 55, 0.2);
  background: linear-gradient(135deg, rgba(139, 0, 0, 0.3) 0%, transparent 100%);
}

.modal-title {
  font-size: 32px;
  font-weight: 800;
  margin: 0;
  color: #f1e1a6;
  background: linear-gradient(45deg, #f1e1a6, #d4af37);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 2px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.close-btn {
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.3);
  color: #f1e1a6;
  cursor: pointer;
  padding: 12px;
  border-radius: 50%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #ffffff;
  background: rgba(212, 175, 55, 0.2);
  transform: rotate(90deg);
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
}

.modal-content {
  padding: 32px;
  overflow-y: auto;
  max-height: calc(90vh - 200px);
}

.story-meta {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
  padding: 16px;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(212, 175, 55, 0.2);
}

.story-time,
.story-location {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #f1e1a6;
  font-size: 14px;
  font-weight: 500;
}

.story-text {
  line-height: 1.8;
}

.story-content {
  font-size: 18px;
  color: rgba(245, 245, 245, 0.95);
  margin: 0;
  white-space: pre-wrap;
  line-height: 1.8;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.modal-footer {
  padding: 24px 32px;
  border-top: 2px solid rgba(212, 175, 55, 0.2);
  display: flex;
  justify-content: flex-end;
  background: linear-gradient(135deg, transparent 0%, rgba(139, 0, 0, 0.2) 100%);
}

.close-action-btn {
  padding: 16px 32px;
  background: linear-gradient(45deg, #d4af37, #f1e1a6);
  border: none;
  border-radius: 12px;
  color: #1a0a0a;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
  letter-spacing: 1px;
  text-transform: uppercase;
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
}

.close-action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4);
  background: linear-gradient(45deg, #f1e1a6, #d4af37);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .story-modal-overlay {
    padding: 16px;
  }

  .story-modal {
    max-height: 95vh;
  }

  .modal-header,
  .modal-content,
  .modal-footer {
    padding: 16px;
  }

  .modal-title {
    font-size: 20px;
  }

  .story-content {
    font-size: 14px;
  }
}

/* 工具类 */
.w-6 {
  width: 24px;
}
.h-6 {
  height: 24px;
}
</style>