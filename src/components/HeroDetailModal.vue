<template>
  <Teleport to="body">
    <div
      class="hero-modal-overlay"
      @click="$emit('close')"
    >
      <div
        class="hero-modal"
        @click.stop
      >
        <div class="modal-header">
          <h2 class="modal-title">
            {{ hero.name }}
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
          <div class="hero-meta">
            <div class="meta-item">
              <span class="meta-label">生卒年份：</span>
              <span class="meta-value">{{ hero.birthDate }} - {{ hero.deathDate }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">出生地：</span>
              <span class="meta-value">{{ hero.birthPlace }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">职务：</span>
              <span class="meta-value">{{ hero.position }}</span>
            </div>
          </div>
          
          <div class="battles-section">
            <h3 class="section-subtitle">
              参与战役
            </h3>
            <div class="battles-list">
              <span
                v-for="battle in hero.battles"
                :key="battle"
                class="battle-tag"
              >
                {{ battle }}
              </span>
            </div>
          </div>
          
          <div class="achievements-section">
            <h3 class="section-subtitle">
              主要功绩
            </h3>
            <p class="achievements-text">
              {{ hero.achievements }}
            </p>
          </div>
          
          <div class="description-section">
            <h3 class="section-subtitle">
              人物简介
            </h3>
            <p class="description-text">
              {{ hero.description }}
            </p>
          </div>
          
          <div
            v-if="hero.quotes"
            class="quotes-section"
          >
            <h3 class="section-subtitle">
              经典语录
            </h3>
            <blockquote class="quote-text">
              "{{ hero.quotes }}"
            </blockquote>
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
 * 英雄详情弹窗组件
 * 用于在长征英雄页面展示完整英雄信息
 */

defineProps({
  hero: {
    type: Object,
    required: true
  }
})

defineEmits(['close'])
</script>

<style scoped>
.hero-modal-overlay {
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

.hero-modal {
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

.hero-meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
  padding: 20px;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(212, 175, 55, 0.2);
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meta-label {
  font-size: 12px;
  color: rgba(241, 225, 166, 0.7);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.meta-value {
  font-size: 16px;
  color: #f1e1a6;
  font-weight: 600;
}

.section-subtitle {
  font-size: 20px;
  font-weight: 700;
  margin: 24px 0 16px 0;
  color: #d4af37;
  letter-spacing: 1px;
  border-bottom: 2px solid rgba(212, 175, 55, 0.3);
  padding-bottom: 8px;
}

.battles-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}

.battle-tag {
  padding: 6px 12px;
  background: rgba(212, 175, 55, 0.15);
  color: #f1e1a6;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid rgba(212, 175, 55, 0.3);
  transition: all 0.3s ease;
}

.battle-tag:hover {
  background: rgba(212, 175, 55, 0.25);
  transform: translateY(-1px);
}

.achievements-text,
.description-text {
  font-size: 16px;
  line-height: 1.8;
  color: rgba(245, 245, 245, 0.95);
  margin: 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.quote-text {
  font-size: 18px;
  font-style: italic;
  color: #f1e1a6;
  text-align: center;
  padding: 20px;
  margin: 16px 0 0 0;
  background: rgba(212, 175, 55, 0.1);
  border-left: 4px solid #d4af37;
  border-radius: 8px;
  position: relative;
  font-weight: 500;
  line-height: 1.6;
}

.quote-text::before {
  content: '';
  position: absolute;
  top: -8px;
  left: 20px;
  font-size: 24px;
  color: #d4af37;
  opacity: 0.5;
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
  .hero-modal-overlay {
    padding: 16px;
  }

  .hero-modal {
    max-height: 95vh;
  }

  .modal-header,
  .modal-content,
  .modal-footer {
    padding: 16px;
  }

  .modal-title {
    font-size: 24px;
  }

  .hero-meta {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .section-subtitle {
    font-size: 18px;
  }

  .meta-value {
    font-size: 14px;
  }

  .achievements-text,
  .description-text {
    font-size: 14px;
  }

  .quote-text {
    font-size: 16px;
    padding: 16px;
  }

  .battle-tag {
    font-size: 12px;
    padding: 4px 8px;
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