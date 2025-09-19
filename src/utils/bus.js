import mitt from 'mitt'

/**
 * 全局事件总线
 * 用于组件间通信，特别是地图和其他组件的交互
 */
const bus = mitt()

/**
 * 事件类型定义
 */
export const BusEvents = {
  // 地图相关事件
  FLY_TO_NODE: 'flyToNode',
  OPEN_SCENE: 'openScene',
  MAP_READY: 'mapReady',
  
  // 故事相关事件
  STORY_COMPLETE: 'storyComplete',
  CHOICE_MADE: 'choiceMade',
  
  // 成就相关事件
  ACHIEVEMENT_UNLOCKED: 'achievementUnlocked',
  
  // 演示模式事件
  DEMO_START: 'demoStart',
  DEMO_STOP: 'demoStop',
  DEMO_STEP: 'demoStep',
  
  // UI事件
  SHOW_LOADING: 'showLoading',
  HIDE_LOADING: 'hideLoading',
  SHOW_TOAST: 'showToast'
}

/**
 * 便捷方法：飞行到指定节点
 * @param {string} nodeId - 节点ID
 * @param {object} options - 飞行选项
 */
export const flyToNode = (nodeId, options = {}) => {
  bus.emit(BusEvents.FLY_TO_NODE, { nodeId, ...options })
}

/**
 * 便捷方法：打开场景
 * @param {string} nodeId - 节点ID
 */
export const openScene = (nodeId) => {
  bus.emit(BusEvents.OPEN_SCENE, { nodeId })
}

/**
 * 便捷方法：显示成就解锁提示
 * @param {object} achievement - 成就信息
 */
export const showAchievement = (achievement) => {
  bus.emit(BusEvents.ACHIEVEMENT_UNLOCKED, achievement)
}

/**
 * 便捷方法：显示提示消息
 * @param {string} message - 消息内容
 * @param {string} type - 消息类型 (success, error, warning, info)
 */
export const showToast = (message, type = 'info') => {
  bus.emit(BusEvents.SHOW_TOAST, { message, type })
}

// 为了兼容性，同时导出为eventBus和默认导出
export const eventBus = bus
export default bus