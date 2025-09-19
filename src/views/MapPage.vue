<template>
  <div class="map-page-container">
    <!-- 地图主体 -->
    <div class="map-main">
      <MapView 
        ref="mapViewRef"
        @node-click="handleNodeClick"
        @route-complete="handleRouteComplete"
        @map-ready="handleMapReady"
      />
    </div>
    
    <!-- 侧边栏 -->
    <div class="sidebar animate-fade-in-left" :class="{ collapsed: sidebarCollapsed }">
      <!-- 侧边栏头部 -->
      <div class="sidebar-header">
        <h2 v-if="!sidebarCollapsed" class="sidebar-title">长征节点</h2>
        <button 
          @click="toggleSidebar"
          class="sidebar-toggle hover-lift"
          :title="sidebarCollapsed ? '展开侧边栏' : '收起侧边栏'"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path v-if="sidebarCollapsed" fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            <path v-else fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
      
      <!-- 节点列表 -->
      <div class="sidebar-content" v-if="!sidebarCollapsed">
        <NodeList 
          ref="nodeListRef"
          @node-select="handleNodeSelect"
          @node-visit="handleNodeVisit"
          @show-story="handleShowStory"
        />
      </div>
    </div>
    
    <!-- 浮动控制面板 -->
    <div class="floating-controls">
      <!-- 地图控制 -->
      <div class="control-group">
        <button 
          @click="resetMapView"
          class="control-btn hover-lift"
          title="重置视图"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
          </svg>
        </button>
        
        <button 
          @click="toggleRouteAnimation"
          class="control-btn hover-lift"
          :class="{ active: isRouteAnimating }"
          title="路线动画"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path v-if="isRouteAnimating" fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
            <path v-else fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
          </svg>
        </button>
        
        <button 
          @click="toggleMapStyle"
          class="control-btn hover-lift"
          title="切换地图样式"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
      
      <!-- 导航控制 -->
      <div class="control-group">
        <button 
          @click="goToPreviousNode"
          :disabled="!hasPreviousNode"
          class="control-btn hover-lift"
          title="上一个节点"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
        
        <button 
          @click="goToNextNode"
          :disabled="!hasNextNode"
          class="control-btn hover-lift"
          title="下一个节点"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
      
      <!-- 功能控制 -->
      <div class="control-group">
        <button 
          @click="showCurrentStory"
          :disabled="!currentNode"
          class="control-btn"
          title="查看当前故事"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        
        <button 
          @click="showAchievements"
          class="control-btn"
          title="查看成就"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
        
        <button 
          @click="goHome"
          class="control-btn"
          title="返回首页"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        </button>
      </div>
    </div>
    
    <!-- 进度指示器 -->
    <div class="progress-indicator">
      <div class="progress-content">
        <div class="progress-info">
          <span class="progress-text">
            {{ visitedNodes }}/{{ totalNodes }} 节点已访问
          </span>
          <span class="progress-percentage">
            {{ progressPercentage }}%
          </span>
        </div>
        
        <div class="progress-bar">
          <div 
            class="progress-fill"
            :style="{ width: progressPercentage + '%' }"
          ></div>
        </div>
      </div>
    </div>
    
    <!-- 节点信息弹窗 -->
    <div 
      v-if="selectedNode"
      class="node-popup"
      :style="popupPosition"
    >
      <div class="popup-content">
        <div class="popup-header">
          <h3 class="popup-title">{{ selectedNode.name }}</h3>
          <button 
            @click="closeNodePopup"
            class="popup-close"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div class="popup-body">
          <p class="node-summary">{{ selectedNode.summary }}</p>
          
          <div class="node-poem" v-if="selectedNode.poem">
            <blockquote>{{ selectedNode.poem }}</blockquote>
          </div>
          
          <div class="node-actions">
            <button 
              @click="visitNode(selectedNode)"
              :disabled="isNodeVisited(selectedNode.id)"
              class="btn-primary btn-sm"
            >
              {{ isNodeVisited(selectedNode.id) ? '已访问' : '访问节点' }}
            </button>
            
            <button 
              @click="showNodeStory(selectedNode)"
              class="btn-secondary btn-sm"
            >
              查看故事
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 时间轴组件 -->
    <Timeline 
      :nodes="nodes"
      :current-node-id="progressStore.currentNodeId"
      :visited-nodes="progressStore.visited"
      @node-select="handleTimelineNodeSelect"
    />
    
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>加载地图数据...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProgressStore } from '../stores/progress'
import { apiClient } from '../api'
import { eventBus } from '../utils/bus'
import MapView from '../components/MapView.vue'
import NodeList from '../components/NodeList.vue'
import Timeline from '../components/Timeline.vue'

/**
 * 地图页面组件
 * 主要的地图交互界面，包含地图视图、节点列表和控制面板
 */

// 路由
const router = useRouter()

// 存储
const progressStore = useProgressStore()

// 组件引用
const mapViewRef = ref(null)
const nodeListRef = ref(null)

// 响应式数据
const nodes = ref([])
const selectedNode = ref(null)
const currentNode = ref(null)
const sidebarCollapsed = ref(false)
const isRouteAnimating = ref(false)
const isLoading = ref(true)
const popupPosition = ref({ top: '0px', left: '0px' })
const currentMapStyle = ref('satellite')

// 计算属性
const totalNodes = computed(() => nodes.value.length)
const visitedNodes = computed(() => progressStore.visited.length)
const progressPercentage = computed(() => {
  return totalNodes.value > 0 ? Math.round((visitedNodes.value / totalNodes.value) * 100) : 0
})

const hasNextNode = computed(() => {
  const currentIndex = nodes.value.findIndex(node => node.id === progressStore.currentNodeId)
  return currentIndex >= 0 && currentIndex < nodes.value.length - 1
})

const hasPreviousNode = computed(() => {
  const currentIndex = nodes.value.findIndex(node => node.id === progressStore.currentNodeId)
  return currentIndex > 0
})

/**
 * 加载地图数据
 */
const loadMapData = async () => {
  try {
    isLoading.value = true
    
    // 加载节点数据
    nodes.value = await apiClient.getNodes()
    
    // 设置当前节点
    if (progressStore.currentNodeId) {
      currentNode.value = nodes.value.find(node => node.id === progressStore.currentNodeId)
    } else if (nodes.value.length > 0) {
      // 如果没有当前节点，设置为第一个节点
      currentNode.value = nodes.value[0]
      progressStore.goto(currentNode.value.id)
    }
    
  } catch (error) {
    console.error('加载地图数据失败:', error)
  } finally {
    isLoading.value = false
  }
}

/**
 * 处理地图准备就绪
 */
const handleMapReady = () => {
  console.log('地图已准备就绪')
}

/**
 * 处理节点点击
 */
const handleNodeClick = (nodeId, event) => {
  const node = nodes.value.find(n => n.id === nodeId)
  if (node) {
    selectedNode.value = node
    
    // 设置弹窗位置
    if (event) {
      popupPosition.value = {
        top: event.clientY + 10 + 'px',
        left: event.clientX + 10 + 'px'
      }
    }
  }
}

/**
 * 处理节点选择
 */
const handleNodeSelect = (node) => {
  selectedNode.value = node
  
  // 在地图上聚焦到该节点
  if (mapViewRef.value) {
    mapViewRef.value.flyToNode(node.id)
  }
}

/**
 * 处理节点访问
 */
const handleNodeVisit = (node) => {
  visitNode(node)
}

/**
 * 处理显示故事
 */
const handleShowStory = (node) => {
  showNodeStory(node)
}

/**
 * 处理路线完成
 */
const handleRouteComplete = () => {
  console.log('长征路线完成！')
  // 可以显示完成庆祝动画或跳转到成就页面
}

/**
 * 访问节点
 */
const visitNode = (node) => {
  if (!isNodeVisited(node.id)) {
    progressStore.goto(node.id)
    currentNode.value = node
    
    // 触发成就检查
    eventBus.emit('node-visited', node)
  }
  
  closeNodePopup()
}

/**
 * 显示节点故事
 */
const showNodeStory = (node) => {
  router.push(`/story/${node.id}`)
}

/**
 * 显示当前故事
 */
const showCurrentStory = () => {
  if (currentNode.value) {
    showNodeStory(currentNode.value)
  }
}

/**
 * 检查节点是否已访问
 */
const isNodeVisited = (nodeId) => {
  return progressStore.isNodeVisited(nodeId)
}

/**
 * 关闭节点弹窗
 */
const closeNodePopup = () => {
  selectedNode.value = null
}

/**
 * 切换侧边栏
 */
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

/**
 * 重置地图视图
 */
const resetMapView = () => {
  if (mapViewRef.value) {
    mapViewRef.value.resetView()
  }
}

/**
 * 切换路线动画
 */
const toggleRouteAnimation = () => {
  isRouteAnimating.value = !isRouteAnimating.value
  
  if (mapViewRef.value) {
    if (isRouteAnimating.value) {
      mapViewRef.value.startRouteAnimation()
    } else {
      mapViewRef.value.stopRouteAnimation()
    }
  }
}

/**
 * 切换地图样式
 */
const toggleMapStyle = () => {
  const styles = ['satellite', 'streets', 'outdoors']
  const currentIndex = styles.indexOf(currentMapStyle.value)
  const nextIndex = (currentIndex + 1) % styles.length
  currentMapStyle.value = styles[nextIndex]
  
  if (mapViewRef.value) {
    mapViewRef.value.setMapStyle(currentMapStyle.value)
  }
}

/**
 * 前往上一个节点
 */
const goToPreviousNode = () => {
  const currentIndex = nodes.value.findIndex(node => node.id === progressStore.currentNodeId)
  if (currentIndex > 0) {
    const prevNode = nodes.value[currentIndex - 1]
    progressStore.goto(prevNode.id)
    currentNode.value = prevNode
    
    if (mapViewRef.value) {
      mapViewRef.value.flyToNode(prevNode.id)
    }
  }
}

/**
 * 前往下一个节点
 */
const goToNextNode = () => {
  const currentIndex = nodes.value.findIndex(node => node.id === progressStore.currentNodeId)
  if (currentIndex >= 0 && currentIndex < nodes.value.length - 1) {
    const nextNode = nodes.value[currentIndex + 1]
    progressStore.goto(nextNode.id)
    currentNode.value = nextNode
    
    if (mapViewRef.value) {
      mapViewRef.value.flyToNode(nextNode.id)
    }
  }
}

/**
 * 显示成就
 */
const showAchievements = () => {
  router.push('/achievements')
}

/**
 * 返回首页
 */
const goHome = () => {
  router.push('/')
}

/**
 * 处理时间轴节点选择
 */
const handleTimelineNodeSelect = (nodeId) => {
  const node = nodes.value.find(n => n.id === nodeId)
  if (node) {
    // 更新当前节点
    progressStore.goto(nodeId)
    currentNode.value = node
    
    // 在地图上飞行到该节点
    if (mapViewRef.value) {
      mapViewRef.value.flyToNode(nodeId)
    }
    
    // 更新节点列表选中状态
    if (nodeListRef.value) {
      nodeListRef.value.selectNode(nodeId)
    }
  }
}

/**
 * 处理键盘事件
 */
const handleKeydown = (event) => {
  switch (event.key) {
    case 'Escape':
      closeNodePopup()
      break
    case 'ArrowLeft':
      if (hasPreviousNode.value) {
        goToPreviousNode()
      }
      break
    case 'ArrowRight':
      if (hasNextNode.value) {
        goToNextNode()
      }
      break
    case ' ':
      event.preventDefault()
      toggleRouteAnimation()
      break
  }
}

/**
 * 处理点击外部关闭弹窗
 */
const handleClickOutside = (event) => {
  if (selectedNode.value && !event.target.closest('.node-popup')) {
    closeNodePopup()
  }
}

// 生命周期
onMounted(() => {
  loadMapData()
  document.addEventListener('keydown', handleKeydown)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.map-page-container {
  position: relative;
  height: 100vh;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
}

.map-main {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

/* 侧边栏 */
.sidebar {
  position: absolute;
  top: 0;
  right: 0;
  width: 400px;
  height: 100%;
  background: white;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
  transition: transform 0.3s ease;
}

.sidebar.collapsed {
  transform: translateX(350px);
  width: 50px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.sidebar-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.sidebar-toggle {
  padding: 0.5rem;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.sidebar-toggle:hover {
  background: #e5e7eb;
  color: #374151;
}

.sidebar-content {
  height: calc(100% - 73px);
  overflow: hidden;
}

/* 浮动控制面板 */
.floating-controls {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 20;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.control-group {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.control-btn {
  padding: 0.75rem;
  background: white;
  border: none;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-btn:hover:not(:disabled) {
  background: #f3f4f6;
  color: #374151;
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.control-btn.active {
  background: #3b82f6;
  color: white;
}

.control-btn.active:hover {
  background: #2563eb;
}

/* 进度指示器 */
.progress-indicator {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  right: 420px;
  z-index: 20;
}

.progress-content {
  background: white;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.progress-text {
  font-size: 0.875rem;
  color: #6b7280;
}

.progress-percentage {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
}

.progress-bar {
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #059669);
  transition: width 0.3s ease;
}

/* 节点弹窗 */
.node-popup {
  position: fixed;
  z-index: 50;
  max-width: 300px;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.popup-content {
  padding: 0;
}

.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.popup-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.popup-close {
  padding: 0.25rem;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  border-radius: 0.25rem;
  transition: all 0.2s;
}

.popup-close:hover {
  background: #e5e7eb;
  color: #374151;
}

.popup-body {
  padding: 1rem;
}

.node-summary {
  margin: 0 0 1rem 0;
  color: #6b7280;
  line-height: 1.5;
}

.node-poem {
  margin: 1rem 0;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  border-left: 4px solid #3b82f6;
}

.node-poem blockquote {
  margin: 0;
  font-style: italic;
  color: #374151;
  line-height: 1.6;
}

.node-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn-primary:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background: #4b5563;
}

/* 时间轴样式 */
.map-page-container :deep(.timeline-container) {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid #e5e7eb;
  box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* 加载状态 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.loading-spinner {
  text-align: center;
}

.spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .sidebar {
    width: 350px;
  }
  
  .floating-controls {
    bottom: 1rem;
    right: 1rem;
  }
}

@media (max-width: 768px) {
  .map-page-container {
    flex-direction: column;
  }
  
  .map-main {
    height: 60vh;
    order: 1;
  }
  
  .sidebar {
    position: relative;
    width: 100%;
    height: 40vh;
    order: 2;
    border-radius: 1rem 1rem 0 0;
    box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  
  .sidebar.collapsed {
    height: 60px;
    overflow: hidden;
  }
  
  .sidebar-header {
    padding: 1rem;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .sidebar-content {
    height: calc(100% - 80px);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  .floating-controls {
    position: fixed;
    bottom: calc(40vh + 6rem);
    right: 1rem;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .control-group {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .control-btn {
    width: 48px;
    height: 48px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .progress-indicator {
    right: 1rem;
    bottom: calc(40vh + 12rem);
  }
}

@media (max-width: 480px) {
  .map-main {
    height: 65vh;
  }
  
  .sidebar {
    height: 35vh;
  }
  
  .sidebar.collapsed {
    height: 50px;
  }
  
  .floating-controls {
    bottom: calc(35vh + 0.5rem);
    right: 0.5rem;
  }
  
  .control-btn {
    width: 44px;
    height: 44px;
  }
  
  .progress-indicator {
    right: 0.5rem;
    bottom: calc(35vh + 6rem);
    font-size: 0.875rem;
  }
  
  .sidebar-title {
    font-size: 1.125rem;
  }
}

/* 移动端触摸优化 */
@media (hover: none) and (pointer: coarse) {
  .control-btn:hover {
    transform: none;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  
  .sidebar-toggle:hover {
    transform: none;
  }
}
</style>