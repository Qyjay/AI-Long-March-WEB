import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * 进度状态管理
 * 管理用户在长征路线上的进度和选择记录
 */
export const useProgressStore = defineStore('progress', () => {
  // 状态
  const currentNodeId = ref(null)
  const visited = ref([])
  const choicesTrail = ref([])
  
  // 计算属性
  const hasAnyProgress = computed(() => {
    return visited.value.length > 0 || currentNodeId.value !== null
  })
  
  const isNodeVisited = computed(() => {
    return (nodeId) => visited.value.includes(nodeId)
  })
  
  const getChoiceForNode = computed(() => {
    return (nodeId) => {
      const choice = choicesTrail.value.find(c => c.nodeId === nodeId)
      return choice ? choice.choiceKey : null
    }
  })
  
  const visitedCount = computed(() => visited.value.length)
  
  // 方法
  
  /**
   * 前往指定节点
   * @param {string} nodeId - 节点ID
   */
  const goto = (nodeId) => {
    if (!nodeId) return
    
    currentNodeId.value = nodeId
    
    // 添加到已访问列表（如果尚未访问）
    if (!visited.value.includes(nodeId)) {
      visited.value.push(nodeId)
    }
    
    // 保存进度到本地存储
    saveToStorage()
    
    console.log(`前往节点: ${nodeId}`)
  }
  
  /**
   * 记录用户选择
   * @param {string} nodeId - 节点ID
   * @param {string} choiceKey - 选择键
   */
  const recordChoice = (nodeId, choiceKey) => {
    if (!nodeId || !choiceKey) return
    
    // 移除该节点的旧选择记录
    const existingIndex = choicesTrail.value.findIndex(c => c.nodeId === nodeId)
    if (existingIndex !== -1) {
      choicesTrail.value.splice(existingIndex, 1)
    }
    
    // 添加新选择记录
    choicesTrail.value.push({
      nodeId,
      choiceKey,
      timestamp: Date.now()
    })
    
    // 保存到本地存储
    saveToStorage()
    
    console.log(`记录选择: ${nodeId} -> ${choiceKey}`)
  }
  
  /**
   * 重置所有进度
   */
  const resetAll = () => {
    currentNodeId.value = null
    visited.value = []
    choicesTrail.value = []
    
    // 清除本地存储
    localStorage.removeItem('longmarch_progress')
    
    console.log('已重置所有进度')
  }
  
  /**
   * 保存进度到本地存储
   */
  const saveToStorage = () => {
    const progressData = {
      currentNodeId: currentNodeId.value,
      visited: visited.value,
      choicesTrail: choicesTrail.value,
      lastUpdated: Date.now()
    }
    
    localStorage.setItem('longmarch_progress', JSON.stringify(progressData))
  }
  
  /**
   * 从本地存储加载进度
   */
  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem('longmarch_progress')
      if (stored) {
        const progressData = JSON.parse(stored)
        
        currentNodeId.value = progressData.currentNodeId || null
        visited.value = progressData.visited || []
        choicesTrail.value = progressData.choicesTrail || []
        
        console.log('已加载本地进度数据')
      }
    } catch (error) {
      console.error('加载进度数据失败:', error)
      resetAll()
    }
  }
  
  /**
   * 获取进度统计信息
   * @returns {object} 进度统计
   */
  const getProgressStats = () => {
    return {
      visitedCount: visited.value.length,
      choicesCount: choicesTrail.value.length,
      currentNode: currentNodeId.value,
      hasProgress: hasAnyProgress.value
    }
  }
  
  /**
   * 检查是否可以访问指定节点
   * @param {string} nodeId - 节点ID
   * @param {Array} nodes - 所有节点数据
   * @returns {boolean} 是否可以访问
   */
  const canAccessNode = (nodeId, nodes = []) => {
    // 简单实现：第一个节点总是可以访问，其他节点需要前一个节点已访问
    if (!nodes.length) return true
    
    const nodeIndex = nodes.findIndex(n => n.id === nodeId)
    if (nodeIndex === -1) return false
    if (nodeIndex === 0) return true
    
    // 检查前一个节点是否已访问
    const prevNode = nodes[nodeIndex - 1]
    return visited.value.includes(prevNode.id)
  }
  
  // 初始化时加载本地数据
  loadFromStorage()
  
  return {
    // 状态
    currentNodeId,
    visited,
    choicesTrail,
    
    // 计算属性
    hasAnyProgress,
    isNodeVisited,
    getChoiceForNode,
    visitedCount,
    
    // 方法
    goto,
    recordChoice,
    resetAll,
    saveToStorage,
    loadFromStorage,
    getProgressStats,
    canAccessNode
  }
})