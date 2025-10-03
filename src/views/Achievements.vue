<template>
  <div class="achievements-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <button 
            @click="goBack"
            class="back-btn"
            title="返回"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
            </svg>
            <span>返回</span>
          </button>
          
          <div class="page-title-section">
            <h1 class="page-title">长征成就</h1>
            <p class="page-subtitle">记录您的长征历程中的重要里程碑</p>
          </div>
        </div>
        
        <div class="header-right">
          <div class="achievement-stats">
            <div class="stat-item">
              <span class="stat-value">{{ unlockedCount }}</span>
              <span class="stat-label">已解锁</span>
            </div>
            <div class="stat-divider">/</div>
            <div class="stat-item">
              <span class="stat-value">{{ totalCount }}</span>
              <span class="stat-label">总计</span>
            </div>
          </div>
          
          <div class="completion-rate">
            <div class="rate-circle">
              <svg class="rate-svg" viewBox="0 0 36 36">
                <path
                  class="rate-bg"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  class="rate-fill"
                  :stroke-dasharray="`${completionPercentage}, 100`"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span class="rate-text">{{ completionPercentage }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 筛选和排序 -->
    <div class="filters-section">
      <div class="filters-content">
        <div class="filter-group">
          <label class="filter-label">分类筛选</label>
          <select v-model="selectedCategory" class="filter-select">
            <option value="all">全部分类</option>
            <option value="exploration">探索发现</option>
            <option value="story">故事体验</option>
            <option value="collection">收集成就</option>
            <option value="special">特殊成就</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label class="filter-label">状态筛选</label>
          <select v-model="selectedStatus" class="filter-select">
            <option value="all">全部状态</option>
            <option value="unlocked">已解锁</option>
            <option value="locked">未解锁</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label class="filter-label">稀有度</label>
          <select v-model="selectedRarity" class="filter-select">
            <option value="all">全部稀有度</option>
            <option value="common">普通</option>
            <option value="rare">稀有</option>
            <option value="epic">史诗</option>
            <option value="legendary">传说</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label class="filter-label">排序方式</label>
          <select v-model="sortBy" class="filter-select">
            <option value="unlock_time">解锁时间</option>
            <option value="rarity">稀有度</option>
            <option value="points">成就点数</option>
            <option value="name">名称</option>
          </select>
        </div>
        
        <button 
          @click="resetFilters"
          class="reset-btn"
          title="重置筛选"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
          </svg>
          重置
        </button>
      </div>
    </div>
    
    <!-- 成就展示区域 -->
    <div class="achievements-content">
      <div class="achievements-grid">
        <AchievementDisplay 
          ref="achievementDisplayRef"
          :achievements="filteredAchievements"
          :show-locked="true"
          @achievement-click="handleAchievementClick"
        />
      </div>
      
      <!-- 空状态 -->
      <div v-if="filteredAchievements.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg class="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
        <h3 class="empty-title">暂无匹配的成就</h3>
        <p class="empty-description">尝试调整筛选条件或开始您的长征之旅</p>
      </div>
    </div>
    
    <!-- 成就详情弹窗 -->
    <div v-if="selectedAchievement" class="achievement-modal">
      <div class="modal-overlay" @click="closeAchievementModal"></div>
      <div class="modal-content">
        <div class="modal-header">
          <div class="achievement-icon-large">
            <img 
              :src="selectedAchievement.icon"
              :alt="selectedAchievement.name"
              class="icon-image"
            />
            <div 
              class="rarity-glow"
              :class="`rarity-${selectedAchievement.rarity}`"
            ></div>
          </div>
          
          <div class="achievement-info">
            <h2 class="achievement-name">{{ selectedAchievement.name }}</h2>
            <p class="achievement-description">{{ selectedAchievement.description }}</p>
            
            <div class="achievement-meta">
              <span class="achievement-category">{{ getCategoryName(selectedAchievement.category) }}</span>
              <span class="achievement-rarity" :class="`rarity-${selectedAchievement.rarity}`">
                {{ getRarityName(selectedAchievement.rarity) }}
              </span>
              <span class="achievement-points">{{ selectedAchievement.points }} 点</span>
            </div>
          </div>
          
          <button 
            @click="closeAchievementModal"
            class="modal-close"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="unlock-condition">
            <h3 class="condition-title">解锁条件</h3>
            <p class="condition-text">{{ selectedAchievement.unlockCondition }}</p>
          </div>
          
          <div v-if="isAchievementUnlocked(selectedAchievement.id)" class="unlock-info">
            <h3 class="unlock-title">解锁信息</h3>
            <div class="unlock-details">
              <div class="unlock-time">
                <span class="unlock-label">解锁时间：</span>
                <span class="unlock-value">{{ formatUnlockTime(selectedAchievement.id) }}</span>
              </div>
              <div class="unlock-progress">
                <span class="unlock-label">完成进度：</span>
                <span class="unlock-value">100%</span>
              </div>
            </div>
          </div>
          
          <div v-else class="progress-info">
            <h3 class="progress-title">进度信息</h3>
            <div class="progress-details">
              <div class="progress-bar-container">
                <div class="progress-bar">
                  <div 
                    class="progress-fill"
                    :style="{ width: getAchievementProgress(selectedAchievement.id) + '%' }"
                  ></div>
                </div>
                <span class="progress-text">
                  {{ getAchievementProgress(selectedAchievement.id) }}%
                </span>
              </div>
              <p class="progress-hint">{{ getProgressHint(selectedAchievement) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>加载成就数据...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProgressStore } from '../stores/progress'
import { apiClient } from '../api'
import AchievementDisplay from '../components/AchievementDisplay.vue'

/**
 * 成就页面组件
 * 展示用户的成就收集情况，支持筛选、排序和详情查看
 */

// 路由
const router = useRouter()

// 存储
const progressStore = useProgressStore()

// 组件引用
const achievementDisplayRef = ref(null)

// 响应式数据
const achievements = ref([])
const selectedAchievement = ref(null)
const isLoading = ref(true)

// 筛选和排序
const selectedCategory = ref('all')
const selectedStatus = ref('all')
const selectedRarity = ref('all')
const sortBy = ref('unlock_time')

// 计算属性
const totalCount = computed(() => achievements.value?.length || 0)
const unlockedCount = computed(() => {
  if (!achievements.value || !Array.isArray(achievements.value)) return 0
  return achievements.value.filter(achievement => 
    isAchievementUnlocked(achievement.id)
  ).length
})

const completionPercentage = computed(() => {
  return totalCount.value > 0 ? Math.round((unlockedCount.value / totalCount.value) * 100) : 0
})

const filteredAchievements = computed(() => {
  if (!achievements.value || !Array.isArray(achievements.value)) return []
  let filtered = achievements.value
  
  // 分类筛选
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(achievement => achievement.category === selectedCategory.value)
  }
  
  // 状态筛选
  if (selectedStatus.value !== 'all') {
    const isUnlocked = selectedStatus.value === 'unlocked'
    filtered = filtered.filter(achievement => 
      isAchievementUnlocked(achievement.id) === isUnlocked
    )
  }
  
  // 稀有度筛选
  if (selectedRarity.value !== 'all') {
    filtered = filtered.filter(achievement => achievement.rarity === selectedRarity.value)
  }
  
  // 排序
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'unlock_time':
        const aUnlocked = isAchievementUnlocked(a.id)
        const bUnlocked = isAchievementUnlocked(b.id)
        if (aUnlocked && bUnlocked) {
          const aTime = getUnlockTime(a.id)
          const bTime = getUnlockTime(b.id)
          return bTime - aTime // 最新解锁的在前
        }
        return bUnlocked - aUnlocked // 已解锁的在前
        
      case 'rarity':
        const rarityOrder = { common: 1, rare: 2, epic: 3, legendary: 4 }
        return rarityOrder[b.rarity] - rarityOrder[a.rarity] // 稀有度高的在前
        
      case 'points':
        return b.points - a.points // 点数高的在前
        
      case 'name':
        return a.name.localeCompare(b.name, 'zh-CN') // 按名称排序
        
      default:
        return 0
    }
  })
  
  return filtered
})

/**
 * 加载成就数据
 */
const loadAchievements = async () => {
  try {
    isLoading.value = true
    const data = await apiClient.getAchievements()
    achievements.value = Array.isArray(data) ? data : []
  } catch (error) {
    console.error('加载成就数据失败:', error)
    achievements.value = [] // 确保在错误情况下设置为空数组
  } finally {
    isLoading.value = false
  }
}

/**
 * 检查成就是否已解锁
 */
const isAchievementUnlocked = (achievementId) => {
  return progressStore.unlockedAchievements?.includes(achievementId) || false
}

/**
 * 获取成就解锁时间
 */
const getUnlockTime = (achievementId) => {
  const achievement = progressStore.achievementProgress?.find(a => a.id === achievementId)
  return achievement ? achievement.unlockedAt : 0
}

/**
 * 格式化解锁时间
 */
const formatUnlockTime = (achievementId) => {
  const time = getUnlockTime(achievementId)
  if (!time) return '未解锁'
  
  const date = new Date(time)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * 获取成就进度
 */
const getAchievementProgress = (achievementId) => {
  const achievement = progressStore.achievementProgress?.find(a => a.id === achievementId)
  return achievement ? achievement.progress : 0
}

/**
 * 获取进度提示
 */
const getProgressHint = (achievement) => {
  const progress = getAchievementProgress(achievement.id)
  
  if (progress === 0) {
    return '尚未开始，继续您的长征之旅吧！'
  } else if (progress < 50) {
    return '刚刚起步，继续努力！'
  } else if (progress < 100) {
    return '即将完成，再接再厉！'
  } else {
    return '已完成！'
  }
}

/**
 * 获取分类名称
 */
const getCategoryName = (category) => {
  const categoryNames = {
    exploration: '探索发现',
    story: '故事体验',
    collection: '收集成就',
    special: '特殊成就'
  }
  return categoryNames[category] || category
}

/**
 * 获取稀有度名称
 */
const getRarityName = (rarity) => {
  const rarityNames = {
    common: '普通',
    rare: '稀有',
    epic: '史诗',
    legendary: '传说'
  }
  return rarityNames[rarity] || rarity
}

/**
 * 处理成就点击
 */
const handleAchievementClick = (achievement) => {
  selectedAchievement.value = achievement
}

/**
 * 关闭成就详情弹窗
 */
const closeAchievementModal = () => {
  selectedAchievement.value = null
}

/**
 * 重置筛选条件
 */
const resetFilters = () => {
  selectedCategory.value = 'all'
  selectedStatus.value = 'all'
  selectedRarity.value = 'all'
  sortBy.value = 'unlock_time'
}

/**
 * 返回上一页
 */
const goBack = () => {
  router.back()
}

// 生命周期
onMounted(() => {
  loadAchievements()
})
</script>

<style scoped>
.achievements-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Inter', sans-serif;
}

/* 页面头部 */
.page-header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  backdrop-filter: blur(10px);
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.4);
}

.page-title-section {
  color: white;
}

.page-title {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(45deg, #fff, #f0f9ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  margin: 0.5rem 0 0 0;
  font-size: 1rem;
  opacity: 0.9;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.achievement-stats {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
}

.stat-label {
  font-size: 0.875rem;
  opacity: 0.8;
}

.stat-divider {
  font-size: 1.5rem;
  opacity: 0.6;
  margin: 0 0.5rem;
}

.completion-rate {
  position: relative;
}

.rate-circle {
  position: relative;
  width: 80px;
  height: 80px;
}

.rate-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.rate-bg {
  fill: none;
  stroke: rgba(255, 255, 255, 0.2);
  stroke-width: 2;
}

.rate-fill {
  fill: none;
  stroke: #10b981;
  stroke-width: 2;
  stroke-linecap: round;
  transition: stroke-dasharray 0.6s ease;
}

.rate-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
}

/* 筛选区域 */
.filters-section {
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.filters-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
}

.filter-select {
  padding: 0.5rem 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  backdrop-filter: blur(10px);
}

.filter-select option {
  background: #1f2937;
  color: white;
}

.reset-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: white;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
  margin-top: 1.5rem;
}

.reset-btn:hover {
  background: rgba(239, 68, 68, 0.3);
  border-color: rgba(239, 68, 68, 0.4);
}

/* 成就内容区域 */
.achievements-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.achievements-grid {
  margin-bottom: 2rem;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: rgba(255, 255, 255, 0.8);
}

.empty-icon {
  margin-bottom: 1.5rem;
  opacity: 0.6;
}

.empty-title {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
}

.empty-description {
  margin: 0;
  font-size: 1rem;
  opacity: 0.8;
}

/* 成就详情弹窗 */
.achievement-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
}

.modal-content {
  position: relative;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
}

.modal-header {
  position: relative;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.achievement-icon-large {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 1rem;
  overflow: hidden;
  flex-shrink: 0;
}

.icon-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.rarity-glow {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 1rem;
  z-index: -1;
}

.rarity-common { background: linear-gradient(45deg, #9ca3af, #6b7280); }
.rarity-rare { background: linear-gradient(45deg, #3b82f6, #1d4ed8); }
.rarity-epic { background: linear-gradient(45deg, #8b5cf6, #7c3aed); }
.rarity-legendary { background: linear-gradient(45deg, #f59e0b, #d97706); }

.achievement-info {
  flex: 1;
}

.achievement-name {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.achievement-description {
  margin: 0 0 1rem 0;
  opacity: 0.9;
  line-height: 1.5;
}

.achievement-meta {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.achievement-category,
.achievement-rarity,
.achievement-points {
  padding: 0.25rem 0.75rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.3);
}

.modal-body {
  padding: 2rem;
}

.unlock-condition,
.unlock-info,
.progress-info {
  margin-bottom: 2rem;
}

.condition-title,
.unlock-title,
.progress-title {
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.condition-text {
  margin: 0;
  color: #6b7280;
  line-height: 1.6;
}

.unlock-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.unlock-time,
.unlock-progress {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.unlock-label {
  font-weight: 500;
  color: #374151;
}

.unlock-value {
  color: #6b7280;
}

.progress-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.progress-bar-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #059669);
  transition: width 0.3s ease;
}

.progress-text {
  font-weight: 600;
  color: #374151;
  min-width: 40px;
}

.progress-hint {
  margin: 0;
  font-size: 0.875rem;
  color: #6b7280;
  font-style: italic;
}

/* 加载状态 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
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
  .header-content {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .filters-content {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .filter-group {
    width: 100%;
  }
  
  .reset-btn {
    margin-top: 0;
    align-self: center;
  }
  
  .achievements-content {
    padding: 1rem;
  }
  
  .modal-header {
    flex-direction: column;
    text-align: center;
  }
  
  .achievement-meta {
    justify-content: center;
  }
}
</style>