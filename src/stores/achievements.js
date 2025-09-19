import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { showAchievement } from '@/utils/bus'

/**
 * 成就状态管理
 * 管理用户获得的成就徽章
 */
export const useAchievementsStore = defineStore('achievements', () => {
  // 状态
  const earned = ref({})
  const availableAchievements = ref([])
  
  // 计算属性
  const earnedCount = computed(() => {
    return Object.values(earned.value).filter(Boolean).length
  })
  
  const totalCount = computed(() => {
    return availableAchievements.value.length
  })
  
  const completionRate = computed(() => {
    if (totalCount.value === 0) return 0
    return Math.round((earnedCount.value / totalCount.value) * 100)
  })
  
  const isEarned = computed(() => {
    return (achievementKey) => Boolean(earned.value[achievementKey])
  })
  
  const earnedAchievements = computed(() => {
    return availableAchievements.value.filter(achievement => 
      earned.value[achievement.key]
    )
  })
  
  const lockedAchievements = computed(() => {
    return availableAchievements.value.filter(achievement => 
      !earned.value[achievement.key]
    )
  })
  
  // 方法
  
  /**
   * 解锁成就
   * @param {string} achievementKey - 成就键
   * @param {boolean} showNotification - 是否显示通知
   */
  const award = (achievementKey, showNotification = true) => {
    if (!achievementKey) return
    
    // 如果已经获得，不重复处理
    if (earned.value[achievementKey]) {
      return
    }
    
    // 标记为已获得
    earned.value[achievementKey] = true
    
    // 保存到本地存储
    saveToStorage()
    
    // 查找成就信息
    const achievement = availableAchievements.value.find(a => a.key === achievementKey)
    
    if (achievement && showNotification) {
      // 显示成就解锁通知
      showAchievement(achievement)
    }
    
    console.log(`成就解锁: ${achievementKey}`)
    
    return achievement
  }
  
  /**
   * 批量解锁成就
   * @param {Array} achievementKeys - 成就键数组
   */
  const awardMultiple = (achievementKeys) => {
    if (!Array.isArray(achievementKeys)) return
    
    achievementKeys.forEach(key => {
      award(key, false) // 批量解锁时不显示单个通知
    })
    
    // 显示批量解锁通知
    const newAchievements = achievementKeys
      .map(key => availableAchievements.value.find(a => a.key === key))
      .filter(Boolean)
    
    if (newAchievements.length > 0) {
      showAchievement({
        key: 'multiple',
        name_zh: `解锁了 ${newAchievements.length} 个成就`,
        name_en: `Unlocked ${newAchievements.length} achievements`,
        achievements: newAchievements
      })
    }
  }
  
  /**
   * 重置所有成就
   */
  const resetAll = () => {
    earned.value = {}
    
    // 清除本地存储
    localStorage.removeItem('longmarch_achievements')
    
    console.log('已重置所有成就')
  }
  
  /**
   * 设置可用成就列表
   * @param {Array} achievements - 成就数据数组
   */
  const setAvailableAchievements = (achievements) => {
    availableAchievements.value = achievements || []
    
    // 确保earned对象包含所有成就的键
    achievements.forEach(achievement => {
      if (!(achievement.key in earned.value)) {
        earned.value[achievement.key] = false
      }
    })
  }
  
  /**
   * 保存成就数据到本地存储
   */
  const saveToStorage = () => {
    const achievementData = {
      earned: earned.value,
      lastUpdated: Date.now()
    }
    
    localStorage.setItem('longmarch_achievements', JSON.stringify(achievementData))
  }
  
  /**
   * 从本地存储加载成就数据
   */
  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem('longmarch_achievements')
      if (stored) {
        const achievementData = JSON.parse(stored)
        earned.value = achievementData.earned || {}
        
        console.log('已加载本地成就数据')
      }
    } catch (error) {
      console.error('加载成就数据失败:', error)
      earned.value = {}
    }
  }
  
  /**
   * 获取成就统计信息
   * @returns {object} 成就统计
   */
  const getAchievementStats = () => {
    return {
      earnedCount: earnedCount.value,
      totalCount: totalCount.value,
      completionRate: completionRate.value,
      recentAchievements: earnedAchievements.value.slice(-3) // 最近3个成就
    }
  }
  
  /**
   * 根据条件检查并解锁成就
   * @param {object} conditions - 检查条件
   */
  const checkAndAward = (conditions) => {
    availableAchievements.value.forEach(achievement => {
      if (earned.value[achievement.key]) return // 已获得的跳过
      
      // 这里可以根据成就的解锁条件进行检查
      // 简单示例：基于访问节点数量的成就
      if (achievement.condition) {
        const shouldAward = evaluateCondition(achievement.condition, conditions)
        if (shouldAward) {
          award(achievement.key)
        }
      }
    })
  }
  
  /**
   * 评估成就解锁条件
   * @param {object} condition - 条件对象
   * @param {object} context - 上下文数据
   * @returns {boolean} 是否满足条件
   */
  const evaluateCondition = (condition, context) => {
    // 简单的条件评估逻辑
    switch (condition.type) {
      case 'visit_count':
        return context.visitedCount >= condition.value
      case 'choice_made':
        return context.choiceKey === condition.value
      case 'node_visited':
        return context.visitedNodes && context.visitedNodes.includes(condition.value)
      default:
        return false
    }
  }
  
  // 初始化时加载本地数据
  loadFromStorage()
  
  return {
    // 状态
    earned,
    availableAchievements,
    
    // 计算属性
    earnedCount,
    totalCount,
    completionRate,
    isEarned,
    earnedAchievements,
    lockedAchievements,
    
    // 方法
    award,
    awardMultiple,
    resetAll,
    setAvailableAchievements,
    saveToStorage,
    loadFromStorage,
    getAchievementStats,
    checkAndAward
  }
})