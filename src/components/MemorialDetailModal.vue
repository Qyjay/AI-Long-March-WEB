<template>
  <div
    class="modal-overlay"
    @click="$emit('close')"
  >
    <div
      class="modal-content"
      @click.stop
    >
      <!-- 关闭按钮 -->
      <button
        class="close-btn"
        @click="$emit('close')"
      >
        ×
      </button>
      
      <!-- 头部图片区域 -->
      <div class="modal-header">
        <div class="header-image">
          <div class="image-placeholder">
            <div class="placeholder-icon">
              🏛️
            </div>
          </div>
          <div class="header-overlay">
            <h2 class="memorial-title">
              {{ memorial.name }}
            </h2>
            <p class="memorial-subtitle">
              {{ memorial.type }} · {{ memorial.category }}
            </p>
          </div>
        </div>
      </div>

      <!-- 主要内容 -->
      <div class="modal-body">
        <!-- 基本信息 -->
        <div class="info-section">
          <h3 class="section-title">
            基本信息
          </h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">📍 地址</span>
              <span class="info-value">{{ memorial.address }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">🕐 开放时间</span>
              <span class="info-value">{{ memorial.openingHours }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">🎫 门票信息</span>
              <span class="info-value">{{ memorial.ticketInfo }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">📞 联系电话</span>
              <span class="info-value">{{ memorial.phone || '暂无' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">🌐 官方网站</span>
              <span class="info-value">{{ memorial.website || '暂无' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">📅 建立年份</span>
              <span class="info-value">{{ memorial.establishmentYear }}年</span>
            </div>
          </div>
        </div>

        <!-- 历史背景 -->
        <div class="info-section">
          <h3 class="section-title">
            历史背景
          </h3>
          <p class="description-text">
            {{ memorial.description }}
          </p>
          <div class="significance-box">
            <h4 class="significance-title">
              历史意义
            </h4>
            <p class="significance-text">
              {{ memorial.historicalSignificance }}
            </p>
          </div>
        </div>

        <!-- 相关事件 -->
        <div class="info-section">
          <h3 class="section-title">
            相关历史事件
          </h3>
          <div class="events-list">
            <div
              v-for="event in memorial.relatedEvents"
              :key="event"
              class="event-item"
            >
              <span class="event-icon">⚡</span>
              <span class="event-text">{{ event }}</span>
            </div>
          </div>
        </div>

        <!-- 特色功能 -->
        <div class="info-section">
          <h3 class="section-title">
            特色功能
          </h3>
          <div class="features-grid">
            <div
              v-for="feature in memorial.features"
              :key="feature"
              class="feature-item"
            >
              <span class="feature-icon">✨</span>
              <span class="feature-text">{{ feature }}</span>
            </div>
          </div>
        </div>

        <!-- 交通信息 -->
        <div class="info-section">
          <h3 class="section-title">
            交通指南
          </h3>
          <p class="transport-text">
            {{ memorial.transportation }}
          </p>
        </div>

        <!-- 标签 -->
        <div class="info-section">
          <h3 class="section-title">
            标签
          </h3>
          <div class="tags-container">
            <span
              v-for="tag in memorial.tags"
              :key="tag"
              class="tag"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <!-- 评分 -->
        <div class="info-section">
          <div class="rating-box">
            <div class="rating-left">
              <span class="rating-label">推荐指数</span>
              <div class="rating-stars">
                <span class="star">⭐</span>
                <span class="rating-number">{{ memorial.rating }}</span>
              </div>
            </div>
            <div class="rating-right">
              <div
                class="importance-badge"
                :class="memorial.importance"
              >
                {{ getImportanceText(memorial.importance) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部按钮 -->
      <div class="modal-footer">
        <button
          class="btn btn-primary"
          @click="$emit('close')"
        >
          关闭
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'

const props = defineProps({
  memorial: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])

/**
 * 获取重要程度文本
 */
const getImportanceText = (importance) => {
  const map = {
    high: '重点推荐',
    medium: '重要景点',
    low: '一般景点'
  }
  return map[importance] || '一般景点'
}

/**
 * 键盘事件处理
 */
const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    emit('close')
  }
}

// 生命周期
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: linear-gradient(135deg, #1a0a0a 0%, #2d1810 100%);
  border: 2px solid #d4af37;
  border-radius: 16px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from { 
    opacity: 0;
    transform: translateY(-50px) scale(0.9);
  }
  to { 
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 20px;
  background: rgba(212, 175, 55, 0.2);
  border: 2px solid rgba(212, 175, 55, 0.3);
  color: #f1e1a6;
  font-size: 24px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
}

.close-btn:hover {
  background: rgba(212, 175, 55, 0.4);
  border-color: #d4af37;
  color: #ffffff;
  transform: scale(1.1);
}

/* 头部图片 */
.modal-header {
  position: relative;
  height: 250px;
  overflow: hidden;
}

.header-image {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #2d1810 0%, #1a0a0a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-icon {
  font-size: 64px;
  opacity: 0.6;
  color: #d4af37;
}

.header-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 32px;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.8) 100%);
}

.memorial-title {
  font-size: 28px;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 8px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

.memorial-subtitle {
  font-size: 16px;
  color: #f1e1a6;
  margin: 0;
  font-weight: 500;
  opacity: 0.9;
}

/* 主要内容 */
.modal-body {
  padding: 32px;
}

.info-section {
  margin-bottom: 32px;
}

.info-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: #f1e1a6;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #d4af37;
  display: flex;
  align-items: center;
}

.section-title::before {
  content: '';
  width: 4px;
  height: 20px;
  background: #d4af37;
  margin-right: 12px;
  border-radius: 2px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 12px;
  color: #d4af37;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.info-value {
  font-size: 14px;
  color: #f5f5f5;
  line-height: 1.5;
}

.description-text {
  font-size: 15px;
  line-height: 1.7;
  color: rgba(245, 245, 245, 0.9);
  margin: 0 0 16px 0;
}

.significance-box {
  background: rgba(139, 0, 0, 0.2);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 8px;
  padding: 20px;
  margin-top: 16px;
}

.significance-title {
  font-size: 16px;
  font-weight: 700;
  color: #f1e1a6;
  margin: 0 0 8px 0;
}

.significance-text {
  font-size: 14px;
  line-height: 1.6;
  color: rgba(245, 245, 245, 0.9);
  margin: 0;
}

.events-list,
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.event-item,
.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: rgba(139, 0, 0, 0.2);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.event-item:hover,
.feature-item:hover {
  background: rgba(139, 0, 0, 0.3);
  border-color: rgba(212, 175, 55, 0.4);
}

.event-icon,
.feature-icon {
  font-size: 16px;
  color: #d4af37;
}

.event-text,
.feature-text {
  font-size: 14px;
  color: #f5f5f5;
  font-weight: 500;
}

.transport-text {
  font-size: 15px;
  line-height: 1.7;
  color: rgba(245, 245, 245, 0.9);
  margin: 0;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  padding: 6px 12px;
  background: rgba(212, 175, 55, 0.2);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 16px;
  font-size: 12px;
  color: #f1e1a6;
  font-weight: 500;
}

.rating-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(139, 0, 0, 0.2);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 8px;
  padding: 16px 20px;
}

.rating-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.rating-label {
  font-size: 12px;
  color: #d4af37;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.rating-stars {
  display: flex;
  align-items: center;
  gap: 6px;
}

.star {
  color: #fbbf24;
  font-size: 16px;
}

.rating-number {
  font-size: 18px;
  font-weight: 700;
  color: #f5f5f5;
}

.importance-badge {
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.importance-badge.high {
  background: rgba(220, 38, 38, 0.8);
  color: #ffffff;
  border: 1px solid rgba(220, 38, 38, 0.5);
}

.importance-badge.medium {
  background: rgba(245, 158, 11, 0.8);
  color: #ffffff;
  border: 1px solid rgba(245, 158, 11, 0.5);
}

.importance-badge.low {
  background: rgba(107, 114, 128, 0.8);
  color: #ffffff;
  border: 1px solid rgba(107, 114, 128, 0.5);
}

/* 底部按钮 */
.modal-footer {
  padding: 24px 32px;
  border-top: 1px solid rgba(212, 175, 55, 0.2);
  display: flex;
  justify-content: flex-end;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background: linear-gradient(135deg, #d4af37 0%, #b8941f 100%);
  color: #1a0a0a;
  border: 2px solid transparent;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #f1e1a6 0%, #d4af37 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    max-height: 95vh;
  }

  .modal-header {
    height: 200px;
  }

  .modal-body {
    padding: 24px;
  }

  .modal-footer {
    padding: 20px 24px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .events-list,
  .features-grid {
    grid-template-columns: 1fr;
  }

  .memorial-title {
    font-size: 24px;
  }

  .section-title {
    font-size: 18px;
  }

  .close-btn {
    top: 12px;
    right: 16px;
    width: 36px;
    height: 36px;
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .modal-body {
    padding: 20px;
  }

  .modal-footer {
    padding: 16px 20px;
  }

  .rating-box {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}
</style>