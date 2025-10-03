<template>
  <div class="home-container">
    <!-- 英雄区域 -->
    <section class="hero-section">
      <div class="hero-background">
        <div class="hero-overlay"></div>
        <img 
          src="/images/hero-bg.svg" 
          alt="长征背景" 
          class="hero-image"
          @error="handleImageError"
        >
      </div>
      
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">
            <span class="title-main">重走长征路</span>
            <span class="title-sub">Interactive Long March Journey</span>
          </h1>
          
          <p class="hero-description">
            踏上这段伟大的历史征程，体验红军长征的艰难岁月，
            感受革命先辈的坚定信念和不屈精神。
          </p>
          
          <div class="hero-actions">
            <button 
              @click="startJourney"
              class="btn-primary btn-large pulse-glow hover-lift"
            >
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
              </svg>
              开始征程
            </button>
            
            <button 
              @click="continueJourney"
              v-if="hasProgress"
              class="btn-secondary btn-large hover-lift"
            >
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
              </svg>
              继续征程
            </button>
            
            <button 
              @click="watchDemo"
              class="btn-outline btn-large hover-lift"
            >
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
              观看演示
            </button>
          </div>
        </div>
        
        <!-- 进度概览 -->
        <div class="progress-overview animate-fade-in-left" v-if="hasProgress">
          <div class="progress-card hover-lift">
            <h3>您的征程进度</h3>
            <div class="progress-stats">
              <div class="stat-item">
                <span class="stat-value">{{ visitedNodes }}</span>
                <span class="stat-label">已访问节点</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ unlockedAchievements }}</span>
                <span class="stat-label">获得成就</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ completionPercentage }}%</span>
                <span class="stat-label">完成度</span>
              </div>
            </div>
            
            <div class="progress-bar">
              <div 
                class="progress-fill"
                :style="{ width: completionPercentage + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 特色功能 -->
    <section class="features-section">
      <div class="container">
        <h2 class="section-title">探索长征历史</h2>
        <p class="section-description">
          通过交互式地图、历史故事和成就系统，深入了解这段波澜壮阔的历史
        </p>
        
        <div class="features-grid">
          <div class="feature-card hover-lift animate-fade-in-up" @click="navigateToMap" style="animation-delay: 0.1s;">
            <div class="feature-icon">
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clip-rule="evenodd" />
              </svg>
            </div>
            <h3 class="feature-title">交互式地图</h3>
            <p class="feature-description">
              在详细的地图上追踪长征路线，探索每个重要的历史节点和事件发生地
            </p>
            <div class="feature-action">
              <span>探索地图</span>
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div class="feature-card hover-lift animate-fade-in-up" @click="navigateToStory" style="animation-delay: 0.2s;">
            <div class="feature-icon">
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="feature-title">历史故事</h3>
            <p class="feature-description">
              通过生动的故事情节和人物对话，亲身体验长征途中的重要历史时刻
            </p>
            <div class="feature-action">
              <span>阅读故事</span>
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div class="feature-card hover-lift animate-fade-in-up" @click="navigateToAchievements" style="animation-delay: 0.3s;">
            <div class="feature-icon">
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <h3 class="feature-title">成就系统</h3>
            <p class="feature-description">
              完成各种挑战，解锁成就徽章，记录您在长征路上的每一个里程碑
            </p>
            <div class="feature-action">
              <span>查看成就</span>
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 历史时间线 -->
    <section class="timeline-section">
      <div class="container">
        <h2 class="section-title">长征历程</h2>
        <p class="section-description">
          1934年10月至1936年10月，历时两年的伟大征程
        </p>
        
        <div class="timeline">
          <div 
            v-for="(event, index) in timelineEvents"
            :key="event.id"
            class="timeline-item"
            :class="{ visited: isEventVisited(event.id) }"
            @click="goToEvent(event)"
          >
            <div class="timeline-marker">
              <div class="marker-dot"></div>
            </div>
            
            <div class="timeline-content">
              <div class="timeline-date">{{ event.date }}</div>
              <h3 class="timeline-title">{{ event.title }}</h3>
              <p class="timeline-description">{{ event.description }}</p>
              
              <div class="timeline-stats" v-if="isEventVisited(event.id)">
                <span class="visited-badge">已访问</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 最新成就 -->
    <section class="recent-achievements" v-if="recentAchievements.length > 0">
      <div class="container">
        <h2 class="section-title">最新成就</h2>
        
        <div class="achievements-carousel">
          <div 
            v-for="achievement in recentAchievements"
            :key="achievement.id"
            class="achievement-item"
            @click="showAchievementDetail(achievement)"
          >
            <div class="achievement-icon">
              <img 
                v-if="achievement.icon"
                :src="achievement.icon"
                :alt="achievement.name"
                class="icon-image"
              >
              <div v-else class="icon-placeholder">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
            
            <div class="achievement-info">
              <h4 class="achievement-name">{{ achievement.name }}</h4>
              <p class="achievement-description">{{ achievement.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProgressStore } from '../stores/progress'
import { useAchievementsStore } from '../stores/achievements'
import { apiClient } from '../api'
import { eventBus } from '../utils/bus'

/**
 * 首页组件
 * 展示应用概览、用户进度和主要功能入口
 */

// 路由
const router = useRouter()

// 存储
const progressStore = useProgressStore()
const achievementsStore = useAchievementsStore()

// 响应式数据
const timelineEvents = ref([])
const recentAchievements = ref([])
const isLoading = ref(true)

// 计算属性
const hasProgress = computed(() => progressStore.hasProgress)
const visitedNodes = computed(() => progressStore.visited.length)
const unlockedAchievements = computed(() => achievementsStore.earnedCount)
const completionPercentage = computed(() => {
  // 这里需要根据实际的总节点数计算
  const totalNodes = 10 // 从API获取
  return visitedNodes.value > 0 ? Math.round((visitedNodes.value / totalNodes) * 100) : 0
})

/**
 * 加载首页数据
 */
const loadHomeData = async () => {
  try {
    isLoading.value = true
    
    // 加载时间线事件
    const nodes = await apiClient.getNodes()
    timelineEvents.value = nodes.slice(0, 6).map(node => ({
      id: node.id,
      date: node.date || '1934年',
      title: node.name,
      description: node.summary
    }))
    
    // 加载最新成就
    const achievements = await apiClient.getAchievements()
    recentAchievements.value = achievements
      .filter(achievement => achievementsStore.isEarned(achievement.id))
      .slice(-3)
      .reverse()
    
  } catch (error) {
    console.error('加载首页数据失败:', error)
  } finally {
    isLoading.value = false
  }
}

/**
 * 开始征程
 */
const startJourney = () => {
  // 重置进度
  progressStore.resetAll()
  
  // 跳转到地图页面
  router.push('/map')
}

/**
 * 继续征程
 */
const continueJourney = () => {
  router.push('/map')
}

/**
 * 观看演示
 */
const watchDemo = () => {
  // 触发演示模式
  eventBus.emit('start-demo')
  router.push('/map')
}

/**
 * 导航到地图
 */
const navigateToMap = () => {
  router.push('/map')
}

/**
 * 导航到故事
 */
const navigateToStory = () => {
  if (progressStore.currentNodeId) {
    router.push(`/story/${progressStore.currentNodeId}`)
  } else {
    router.push('/map')
  }
}

/**
 * 导航到成就
 */
const navigateToAchievements = () => {
  router.push('/achievements')
}

/**
 * 前往事件
 */
const goToEvent = (event) => {
  // 设置当前节点并跳转到地图
  progressStore.goto(event.id)
  router.push('/map')
}

/**
 * 检查事件是否已访问
 */
const isEventVisited = (eventId) => {
  return progressStore.isNodeVisited(eventId)
}

/**
 * 显示成就详情
 */
const showAchievementDetail = (achievement) => {
  // 这里可以显示成就详情弹窗
  console.log('显示成就详情:', achievement)
}

/**
 * 处理图片加载错误
 */
const handleImageError = (event) => {
  // 使用默认背景
  event.target.style.display = 'none'
}

// 生命周期
onMounted(() => {
  loadHomeData()
})
</script>

<style scoped>
.home-container {
  font-family: 'Inter', sans-serif;
}

/* 英雄区域 */
.hero-section {
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.6) 0%,
    rgba(0, 0, 0, 0.4) 50%,
    rgba(0, 0, 0, 0.6) 100%
  );
  z-index: 2;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-content {
  position: relative;
  z-index: 3;
  text-align: center;
  color: white;
  max-width: 800px;
  padding: 0 2rem;
}

.hero-text {
  margin-bottom: 3rem;
}

.hero-title {
  margin-bottom: 1.5rem;
}

.title-main {
  display: block;
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title-sub {
  display: block;
  font-size: 1.25rem;
  font-weight: 300;
  opacity: 0.9;
  letter-spacing: 0.1em;
}

.hero-description {
  font-size: 1.25rem;
  line-height: 1.6;
  opacity: 0.9;
  margin-bottom: 2rem;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-large {
  padding: 1rem 2rem;
  font-size: 1.125rem;
  font-weight: 600;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  text-decoration: none;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
}

.btn-secondary {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
}

.btn-outline {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.btn-outline:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

/* 进度概览 */
.progress-overview {
  margin-top: 2rem;
}

.progress-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.progress-card h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.progress-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.stat-label {
  display: block;
  font-size: 0.875rem;
  opacity: 0.8;
}

.progress-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #059669);
  transition: width 0.3s ease;
}

/* 通用样式 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1rem;
  color: #1f2937;
}

.section-description {
  font-size: 1.125rem;
  text-align: center;
  color: #6b7280;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* 特色功能 */
.features-section {
  padding: 5rem 0;
  background: #f9fafb;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  width: 4rem;
  height: 4rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 1.5rem;
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1f2937;
}

.feature-description {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.feature-action {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #3b82f6;
  font-weight: 500;
}

/* 时间线 */
.timeline-section {
  padding: 5rem 0;
}

.timeline {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 2rem;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #e5e7eb;
}

.timeline-item {
  position: relative;
  padding-left: 5rem;
  margin-bottom: 3rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.timeline-item:hover {
  transform: translateX(8px);
}

.timeline-item.visited .timeline-marker .marker-dot {
  background: #10b981;
  border-color: #10b981;
}

.timeline-marker {
  position: absolute;
  left: 1.25rem;
  top: 0.5rem;
}

.marker-dot {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background: #d1d5db;
  border: 4px solid white;
  box-shadow: 0 0 0 2px #e5e7eb;
  transition: all 0.3s ease;
}

.timeline-content {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.timeline-date {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.timeline-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1f2937;
}

.timeline-description {
  color: #6b7280;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.timeline-stats {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.visited-badge {
  padding: 0.25rem 0.75rem;
  background: #dcfce7;
  color: #166534;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

/* 最新成就 */
.recent-achievements {
  padding: 5rem 0;
  background: #f9fafb;
}

.achievements-carousel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.achievement-item {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.achievement-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.achievement-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.icon-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.icon-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.achievement-info {
  flex: 1;
}

.achievement-name {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #1f2937;
}

.achievement-description {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.4;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .hero-content {
    padding: 2rem;
  }
  
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .home-container {
    padding: 0;
  }
  
  .hero-section {
    min-height: 100vh;
    padding: 1rem;
  }
  
  .hero-content {
    padding: 1.5rem;
    text-align: center;
  }
  
  .title-main {
    font-size: 2.5rem;
    line-height: 1.1;
  }
  
  .title-sub {
    font-size: 1rem;
    margin-top: 0.5rem;
  }
  
  .hero-description {
    font-size: 1rem;
    margin: 1.5rem 0;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .btn-large {
    width: 100%;
    max-width: 280px;
    justify-content: center;
    font-size: 1rem;
  }
  
  .progress-overview {
    margin-top: 2rem;
  }
  
  .progress-stats {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .features-section {
    padding: 3rem 1rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .feature-card {
    padding: 1.5rem;
  }
  
  .timeline::before {
    left: 1rem;
  }
  
  .timeline-item {
    padding-left: 3rem;
  }
  
  .timeline-marker {
    left: 0.25rem;
  }
  
  .achievements-carousel {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 0.5rem;
  }
  
  .hero-content {
    padding: 1rem;
  }
  
  .title-main {
    font-size: 2rem;
  }
  
  .title-sub {
    font-size: 0.875rem;
  }
  
  .hero-description {
    font-size: 0.875rem;
  }
  
  .btn-large {
    max-width: 100%;
    padding: 0.875rem 1.5rem;
    font-size: 0.875rem;
  }
  
  .features-section {
    padding: 2rem 0.5rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .feature-card {
    padding: 1rem;
  }
  
  .feature-title {
    font-size: 1rem;
  }
  
  .feature-description {
    font-size: 0.875rem;
  }
}
</style>