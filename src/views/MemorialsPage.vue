<template>
  <div class="memorials-page">
    <!-- 页面头部标题 -->
    <header class="page-header">
      <div class="header-content">
        <h1 class="main-title">
          长征纪念馆
        </h1>
        <p class="subtitle">
          追寻红色足迹，传承革命精神
        </p>
      </div>
      <div class="header-decoration" />
    </header>

    <!-- 搜索和筛选区域 -->
    <section class="filter-section">
      <div class="filter-container">
        <!-- 搜索框 -->
        <div class="search-box">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="搜索纪念馆名称或地址..."
            class="search-input"
          >
          <div class="search-icon">
            🔍
          </div>
        </div>

        <!-- 筛选按钮组 -->
        <div class="filter-buttons">
          <button 
            :class="['filter-btn', { active: selectedType === 'all' }]"
            @click="filterByType('all')"
          >
            全部
          </button>
          <button 
            :class="['filter-btn', { active: selectedType === '重要历史遗址' }]"
            @click="filterByType('重要历史遗址')"
          >
            重要遗址
          </button>
          <button 
            :class="['filter-btn', { active: selectedType === '纪念设施' }]"
            @click="filterByType('纪念设施')"
          >
            纪念设施
          </button>
          <button 
            :class="['filter-btn', { active: selectedImportance === 'high' }]"
            @click="filterByImportance('high')"
          >
            重点推荐
          </button>
        </div>
      </div>
    </section>

    <!-- 纪念馆列表 -->
    <section class="memorials-list-section">
      <div class="section-header">
        <h2 class="section-title">
          红色圣地
        </h2>
        <p class="section-subtitle">
          共 {{ filteredMemorials.length }} 处纪念馆和遗址
        </p>
      </div>
      
      <div
        v-if="filteredMemorials.length"
        class="memorials-grid"
      >
        <div 
          v-for="memorial in filteredMemorials" 
          :key="memorial.id" 
          class="memorial-card"
          @click="openMemorial(memorial)"
        >
          <!-- 卡片内容 -->
          <div class="card-content">
            <div
              class="importance-badge"
              :class="memorial.importance"
            >
              {{ getImportanceText(memorial.importance) }}
            </div>
            <h3 class="memorial-name">
              {{ memorial.name }}
            </h3>
            <p class="memorial-type">
              {{ memorial.type }} · {{ memorial.category }}
            </p>
            <p class="memorial-address">
              📍 {{ memorial.address }}
            </p>
            <p class="memorial-description">
              {{ memorial.description }}
            </p>
            
            <!-- 标签 -->
            <div class="tags-container">
              <span
                v-for="tag in memorial.tags.slice(0, 3)"
                :key="tag"
                class="tag"
              >
                {{ tag }}
              </span>
            </div>

            <!-- 底部信息 -->
            <div class="card-footer">
              <div class="rating">
                <span class="stars">⭐</span>
                <span class="rating-text">{{ memorial.rating }}</span>
              </div>
              <span class="read-more">了解详情 →</span>
            </div>
          </div>
        </div>
      </div>
      
      <div
        v-else
        class="empty-state"
      >
        <div class="empty-icon">
          🏛️
        </div>
        <h3>暂无相关纪念馆</h3>
        <p>请尝试其他搜索条件</p>
      </div>
    </section>

    <!-- 纪念馆详情弹窗 -->
    <MemorialDetailModal 
      v-if="selectedMemorial" 
      :memorial="selectedMemorial" 
      @close="closeMemorial" 
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import memorialsData from '@/data/memorials.json'
import MemorialDetailModal from '@/components/MemorialDetailModal.vue'

// 状态
const memorials = ref([])
const searchQuery = ref('')
const selectedType = ref('all')
const selectedImportance = ref('all')
const selectedMemorial = ref(null)

// 计算属性 - 筛选纪念馆
const filteredMemorials = computed(() => {
  let result = memorials.value

  // 搜索筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(memorial => 
      memorial.name.toLowerCase().includes(query) ||
      memorial.address.toLowerCase().includes(query) ||
      memorial.description.toLowerCase().includes(query) ||
      memorial.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }

  // 类型筛选
  if (selectedType.value !== 'all') {
    result = result.filter(memorial => memorial.category === selectedType.value)
  }

  // 重要程度筛选
  if (selectedImportance.value !== 'all') {
    result = result.filter(memorial => memorial.importance === selectedImportance.value)
  }

  return result
})

/**
 * 加载纪念馆数据
 */
const loadMemorials = async () => {
  try {
    const data = memorialsData
    memorials.value = Array.isArray(data?.memorials) ? data.memorials : []
  } catch (error) {
    console.error('加载纪念馆数据失败:', error)
    memorials.value = []
  }
}

/**
 * 按类型筛选
 */
const filterByType = (type) => {
  selectedType.value = type
  selectedImportance.value = 'all'
}

/**
 * 按重要程度筛选
 */
const filterByImportance = (importance) => {
  selectedImportance.value = importance
  selectedType.value = 'all'
}

/**
 * 获取重要程度文本
 */
const getImportanceText = (importance) => {
  const map = {
    high: '重点',
    medium: '重要',
    low: '一般'
  }
  return map[importance] || '一般'
}

/**
 * 打开纪念馆详情
 */
const openMemorial = (memorial) => {
  selectedMemorial.value = memorial
}

/**
 * 关闭纪念馆详情
 */
const closeMemorial = () => {
  selectedMemorial.value = null
}

// 生命周期
onMounted(() => {
  loadMemorials()
})
</script>

<style scoped>
.memorials-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a0a0a 0%, #2d1810 50%, #1a0a0a 100%);
  color: #f5f5f5;
  position: relative;
  overflow-x: hidden;
}

/* 页面头部 */
.page-header {
  position: relative;
  padding: 60px 24px 40px;
  text-align: center;
  background: linear-gradient(180deg, rgba(139, 0, 0, 0.9) 0%, rgba(139, 0, 0, 0.7) 70%, transparent 100%);
  border-bottom: 3px solid #d4af37;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.header-content {
  position: relative;
  z-index: 2;
}

.main-title {
  font-size: 48px;
  font-weight: 800;
  margin: 0 0 16px 0;
  color: #ffffff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  letter-spacing: 4px;
  background: linear-gradient(45deg, #ffffff, #f1e1a6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 18px;
  color: #f1e1a6;
  margin: 0;
  font-weight: 300;
  letter-spacing: 2px;
  opacity: 0.9;
}

.header-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 30%, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(139, 0, 0, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

/* 筛选区域 */
.filter-section {
  padding: 40px 24px;
  max-width: 1280px;
  margin: 0 auto;
}

.filter-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
}

.search-box {
  position: relative;
  width: 100%;
  max-width: 500px;
}

.search-input {
  width: 100%;
  padding: 16px 50px 16px 20px;
  font-size: 16px;
  background: rgba(139, 0, 0, 0.3);
  border: 2px solid rgba(212, 175, 55, 0.3);
  border-radius: 30px;
  color: #f5f5f5;
  outline: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.search-input::placeholder {
  color: rgba(245, 245, 245, 0.6);
}

.search-input:focus {
  border-color: #d4af37;
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
}

.search-icon {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #d4af37;
  font-size: 18px;
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

.filter-btn {
  padding: 10px 20px;
  background: rgba(139, 0, 0, 0.3);
  border: 2px solid rgba(212, 175, 55, 0.3);
  border-radius: 20px;
  color: #f1e1a6;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.filter-btn:hover {
  border-color: rgba(212, 175, 55, 0.6);
  transform: translateY(-2px);
}

.filter-btn.active {
  background: rgba(212, 175, 55, 0.2);
  border-color: #d4af37;
  color: #ffffff;
  box-shadow: 0 0 15px rgba(212, 175, 55, 0.3);
}

/* 纪念馆列表 */
.memorials-list-section {
  padding: 40px 24px 80px;
  max-width: 1280px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 48px;
}

.section-title {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 12px 0;
  color: #f1e1a6;
  letter-spacing: 3px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

.section-subtitle {
  font-size: 16px;
  color: rgba(245, 245, 245, 0.8);
  margin: 0;
  font-weight: 300;
}

.memorials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 32px;
}

.memorial-card {
  background: linear-gradient(135deg, rgba(139, 0, 0, 0.3) 0%, rgba(45, 24, 16, 0.4) 100%);
  border: 2px solid rgba(212, 175, 55, 0.3);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.memorial-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.2), transparent);
  transition: left 0.6s ease;
}

.memorial-card:hover::before {
  left: 100%;
}

.memorial-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.3),
    0 0 30px rgba(212, 175, 55, 0.2);
  border-color: rgba(212, 175, 55, 0.6);
}

.card-image {
  position: relative;
  height: 200px;
  background: linear-gradient(135deg, #2d1810 0%, #1a0a0a 100%);
  border-bottom: 2px solid rgba(212, 175, 55, 0.3);
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-icon {
  font-size: 48px;
  opacity: 0.6;
  color: #d4af37;
}

.importance-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 6px 12px;
  border-radius: 20px;
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

.card-content {
  padding: 24px;
  position: relative;
  z-index: 2;
}

.memorial-name {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #f1e1a6;
  line-height: 1.4;
}

.memorial-type {
  font-size: 14px;
  color: #d4af37;
  margin: 0 0 8px 0;
  font-weight: 500;
  opacity: 0.9;
}

.memorial-address {
  font-size: 13px;
  color: rgba(245, 245, 245, 0.8);
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.memorial-description {
  font-size: 14px;
  line-height: 1.6;
  color: rgba(245, 245, 245, 0.9);
  margin: 0 0 16px 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 0 0 16px 0;
}

.tag {
  padding: 4px 8px;
  background: rgba(212, 175, 55, 0.2);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 12px;
  font-size: 11px;
  color: #f1e1a6;
  font-weight: 500;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(212, 175, 55, 0.2);
}

.rating {
  display: flex;
  align-items: center;
  gap: 4px;
}

.stars {
  color: #fbbf24;
  font-size: 14px;
}

.rating-text {
  font-size: 14px;
  color: rgba(245, 245, 245, 0.9);
  font-weight: 600;
}

.read-more {
  font-size: 14px;
  color: #d4af37;
  font-weight: 600;
  transition: all 0.3s ease;
}

.memorial-card:hover .read-more {
  color: #f1e1a6;
  text-shadow: 0 0 10px rgba(241, 225, 166, 0.5);
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: rgba(245, 245, 245, 0.6);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.7;
}

.empty-state h3 {
  font-size: 24px;
  margin: 0 0 8px 0;
  color: #f1e1a6;
}

.empty-state p {
  font-size: 16px;
  margin: 0;
  font-weight: 300;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-header {
    padding: 40px 16px 30px;
  }

  .main-title {
    font-size: 36px;
    letter-spacing: 2px;
  }

  .subtitle {
    font-size: 16px;
    letter-spacing: 1px;
  }

  .filter-section {
    padding: 30px 16px;
  }

  .filter-container {
    gap: 20px;
  }

  .search-box {
    max-width: 100%;
  }

  .filter-buttons {
    gap: 8px;
  }

  .filter-btn {
    padding: 8px 16px;
    font-size: 13px;
  }

  .memorials-list-section {
    padding: 30px 16px 60px;
  }

  .section-header {
    margin-bottom: 32px;
  }

  .section-title {
    font-size: 28px;
    margin-bottom: 8px;
  }

  .memorials-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .memorial-card {
    border-radius: 12px;
  }

  .card-content {
    padding: 20px;
  }

  .memorial-name {
    font-size: 18px;
  }

  .card-image {
    height: 180px;
  }
}

@media (max-width: 480px) {
  .filter-buttons {
    flex-direction: column;
    align-items: center;
  }

  .filter-btn {
    width: 200px;
    text-align: center;
  }
}
</style>