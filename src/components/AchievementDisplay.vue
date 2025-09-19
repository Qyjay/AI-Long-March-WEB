<template>
  <div class="achievement-display-container">
    <!-- 成就网格 -->
    <div class="achievements-grid">
      <div 
        v-for="achievement in displayedAchievements"
        :key="achievement.id"
        class="achievement-card"
        :class="{
          'unlocked': isUnlocked(achievement.id),
          'locked': !isUnlocked(achievement.id),
          'rare': achievement.rarity === 'rare',
          'epic': achievement.rarity === 'epic',
          'legendary': achievement.rarity === 'legendary'
        }"
        @click="showAchievementDetail(achievement)"
      >
        <!-- 成就图标 -->
        <div class="achievement-icon">
          <img 
            v-if="achievement.icon && isUnlocked(achievement.id)"
            :src="achievement.icon"
            :alt="achievement.name"
            class="icon-image"
          >
          <div v-else class="icon-placeholder">
            <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path v-if="isUnlocked(achievement.id)" fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              <path v-else fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
        
        <!-- 稀有度指示器 -->
        <div class="rarity-indicator" v-if="achievement.rarity !== 'common'">
          <span class="rarity-text">{{ getRarityLabel(achievement.rarity) }}</span>
        </div>
        
        <!-- 成就信息 -->
        <div class="achievement-info">
          <h3 class="achievement-name">
            {{ isUnlocked(achievement.id) ? achievement.name : '???' }}
          </h3>
          <p class="achievement-description">
            {{ isUnlocked(achievement.id) ? achievement.description : '未解锁的成就' }}
          </p>
          
          <!-- 成就点数 -->
          <div class="achievement-points" v-if="isUnlocked(achievement.id)">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>{{ achievement.points }}</span>
          </div>
          
          <!-- 解锁时间 -->
          <div class="unlock-time" v-if="isUnlocked(achievement.id)">
            <span>{{ formatUnlockTime(achievement.id) }}</span>
          </div>
          
          <!-- 解锁条件提示 -->
          <div class="unlock-hint" v-else-if="showHints">
            <p class="hint-text">{{ getUnlockHint(achievement) }}</p>
          </div>
        </div>
        
        <!-- 解锁状态覆盖层 -->
        <div class="lock-overlay" v-if="!isUnlocked(achievement.id)">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
    
    <!-- 成就统计 -->
    <div class="achievement-stats">
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-value">{{ unlockedCount }}</div>
          <div class="stat-label">已解锁</div>
        </div>
        
        <div class="stat-item">
          <div class="stat-value">{{ totalCount }}</div>
          <div class="stat-label">总计</div>
        </div>
        
        <div class="stat-item">
          <div class="stat-value">{{ completionPercentage }}%</div>
          <div class="stat-label">完成度</div>
        </div>
        
        <div class="stat-item">
          <div class="stat-value">{{ totalPoints }}</div>
          <div class="stat-label">总点数</div>
        </div>
      </div>
      
      <!-- 进度条 -->
      <div class="progress-container">
        <div class="progress-bar">
          <div 
            class="progress-fill"
            :style="{ width: completionPercentage + '%' }"
          ></div>
        </div>
        <span class="progress-text">{{ completionPercentage }}% 完成</span>
      </div>
    </div>
    
    <!-- 筛选和排序 -->
    <div class="filter-controls">
      <div class="filter-tabs">
        <button 
          v-for="filter in filters"
          :key="filter.key"
          @click="setActiveFilter(filter.key)"
          class="filter-tab"
          :class="{ active: activeFilter === filter.key }"
        >
          {{ filter.label }}
          <span class="filter-count">({{ getFilterCount(filter.key) }})</span>
        </button>
      </div>
      
      <div class="sort-controls">
        <select v-model="sortBy" class="sort-select">
          <option value="unlock-time">解锁时间</option>
          <option value="rarity">稀有度</option>
          <option value="points">点数</option>
          <option value="category">分类</option>
        </select>
        
        <button 
          @click="toggleSortOrder"
          class="sort-order-btn"
          :title="sortOrder === 'asc' ? '升序' : '降序'"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path v-if="sortOrder === 'asc'" fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
            <path v-else fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAchievementsStore } from '../stores/achievements'
import { apiClient } from '../api'

/**
 * 成就展示组件
 * 显示用户获得的成就徽章和进度统计
 */

// Props
const props = defineProps({
  // 是否显示提示
  showHints: {
    type: Boolean,
    default: true
  },
  // 每行显示数量
  itemsPerRow: {
    type: Number,
    default: 4
  },
  // 是否紧凑模式
  compact: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits([
  'achievement-click',
  'achievement-unlock'
])

// 响应式数据
const achievements = ref([])
const activeFilter = ref('all')
const sortBy = ref('unlock-time')
const sortOrder = ref('desc')
const isLoading = ref(true)

// 存储
const achievementsStore = useAchievementsStore()

// 筛选选项
const filters = [
  { key: 'all', label: '全部' },
  { key: 'unlocked', label: '已解锁' },
  { key: 'locked', label: '未解锁' },
  { key: 'story', label: '故事' },
  { key: 'exploration', label: '探索' },
  { key: 'collection', label: '收集' },
  { key: 'special', label: '特殊' }
]

// 计算属性
const totalCount = computed(() => achievements.value.length)
const unlockedCount = computed(() => achievementsStore.unlockedAchievements.length)
const completionPercentage = computed(() => {
  return totalCount.value > 0 ? Math.round((unlockedCount.value / totalCount.value) * 100) : 0
})

const totalPoints = computed(() => {
  return achievementsStore.unlockedAchievements.reduce((total, achievementId) => {
    const achievement = achievements.value.find(a => a.id === achievementId)
    return total + (achievement?.points || 0)
  }, 0)
})

const displayedAchievements = computed(() => {
  let result = achievements.value
  
  // 筛选
  if (activeFilter.value !== 'all') {
    result = result.filter(achievement => {
      switch (activeFilter.value) {
        case 'unlocked':
          return isUnlocked(achievement.id)
        case 'locked':
          return !isUnlocked(achievement.id)
        case 'story':
        case 'exploration':
        case 'collection':
        case 'special':
          return achievement.category === activeFilter.value
        default:
          return true
      }
    })
  }
  
  // 排序
  result.sort((a, b) => {
    let comparison = 0
    
    switch (sortBy.value) {
      case 'unlock-time':
        const aUnlocked = isUnlocked(a.id)
        const bUnlocked = isUnlocked(b.id)
        if (aUnlocked && bUnlocked) {
          // 都已解锁，按解锁时间排序
          comparison = 0 // 这里需要实际的解锁时间数据
        } else if (aUnlocked) {
          comparison = -1
        } else if (bUnlocked) {
          comparison = 1
        }
        break
      case 'rarity':
        const rarityOrder = { common: 0, rare: 1, epic: 2, legendary: 3 }
        comparison = rarityOrder[a.rarity] - rarityOrder[b.rarity]
        break
      case 'points':
        comparison = a.points - b.points
        break
      case 'category':
        comparison = a.category.localeCompare(b.category)
        break
    }
    
    return sortOrder.value === 'asc' ? comparison : -comparison
  })
  
  return result
})

/**
 * 加载成就数据
 */
const loadAchievements = async () => {
  try {
    isLoading.value = true
    achievements.value = await apiClient.getAchievements()
  } catch (error) {
    console.error('加载成就数据失败:', error)
  } finally {
    isLoading.value = false
  }
}

/**
 * 检查成就是否已解锁
 */
const isUnlocked = (achievementId) => {
  return achievementsStore.isEarned(achievementId)
}

/**
 * 设置活动筛选器
 */
const setActiveFilter = (filterKey) => {
  activeFilter.value = filterKey
}

/**
 * 切换排序顺序
 */
const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
}

/**
 * 获取筛选器计数
 */
const getFilterCount = (filterKey) => {
  switch (filterKey) {
    case 'all':
      return totalCount.value
    case 'unlocked':
      return unlockedCount.value
    case 'locked':
      return totalCount.value - unlockedCount.value
    default:
      return achievements.value.filter(a => a.category === filterKey).length
  }
}

/**
 * 显示成就详情
 */
const showAchievementDetail = (achievement) => {
  emit('achievement-click', achievement)
}

/**
 * 获取稀有度标签
 */
const getRarityLabel = (rarity) => {
  const labels = {
    common: '普通',
    rare: '稀有',
    epic: '史诗',
    legendary: '传说'
  }
  return labels[rarity] || '普通'
}

/**
 * 格式化解锁时间
 */
const formatUnlockTime = (achievementId) => {
  // 这里需要从存储中获取实际的解锁时间
  return '刚刚解锁'
}

/**
 * 获取解锁提示
 */
const getUnlockHint = (achievement) => {
  if (!achievement.unlockCondition) return '完成特定条件解锁'
  
  const condition = achievement.unlockCondition
  switch (condition.type) {
    case 'visit_nodes':
      return `访问 ${condition.count} 个节点`
    case 'complete_scenes':
      return `完成 ${condition.count} 个场景`
    case 'make_choices':
      return `做出 ${condition.count} 个选择`
    case 'explore_route':
      return '完整探索长征路线'
    default:
      return '完成特定条件解锁'
  }
}

// 生命周期
onMounted(() => {
  loadAchievements()
})

// 暴露方法给父组件
defineExpose({
  loadAchievements,
  achievements: () => achievements.value
})
</script>

<style scoped>
.achievement-display-container {
  font-family: 'Inter', sans-serif;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.achievement-card {
  position: relative;
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  overflow: hidden;
}

.achievement-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.achievement-card.unlocked {
  border: 2px solid #10b981;
}

.achievement-card.locked {
  border: 2px solid #d1d5db;
  opacity: 0.7;
}

.achievement-card.rare {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
}

.achievement-card.epic {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
}

.achievement-card.legendary {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  position: relative;
}

.achievement-card.legendary::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.2) 50%, transparent 70%);
  animation: shine 2s infinite;
}

@keyframes shine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.achievement-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1rem;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.1);
}

.icon-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.icon-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: currentColor;
}

.rarity-indicator {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  padding: 0.25rem 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.achievement-info {
  text-align: center;
}

.achievement-name {
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
  font-weight: 600;
}

.achievement-description {
  margin: 0 0 1rem 0;
  font-size: 0.875rem;
  line-height: 1.4;
  opacity: 0.8;
}

.achievement-points {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.unlock-time {
  font-size: 0.75rem;
  opacity: 0.6;
}

.unlock-hint {
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 0.375rem;
  margin-top: 0.5rem;
}

.hint-text {
  margin: 0;
  font-size: 0.75rem;
  font-style: italic;
  opacity: 0.7;
}

.lock-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #6b7280;
}

.achievement-stats {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.progress-container {
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
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  white-space: nowrap;
}

.filter-controls {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-tab {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
  color: #6b7280;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-tab:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.filter-tab.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.filter-count {
  margin-left: 0.25rem;
  opacity: 0.7;
}

.sort-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sort-select {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
  font-size: 0.875rem;
}

.sort-order-btn {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.sort-order-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .achievements-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .filter-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-tabs {
    justify-content: center;
  }
  
  .sort-controls {
    justify-content: center;
  }
}
</style>