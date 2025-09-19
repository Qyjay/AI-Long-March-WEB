/**
 * API客户端主文件
 * 提供统一的数据访问接口，支持Mock模式和真实API切换
 */

import { mockApi } from './mock'
import { realApi } from './real'

// 从环境变量读取是否使用Mock模式
const USE_MOCK = import.meta.env.VITE_USE_MOCK === '1' || import.meta.env.VITE_USE_MOCK === 'true'

/**
 * API客户端类
 * 根据配置自动切换Mock数据或真实API
 */
class ApiClient {
  constructor() {
    this.client = USE_MOCK ? mockApi : realApi
    this.isMockMode = USE_MOCK
  }

  /**
   * 获取所有节点数据
   * @returns {Promise<Array>} 节点数组
   */
  async getNodes() {
    try {
      return await this.client.getNodes()
    } catch (error) {
      console.error('获取节点数据失败:', error)
      throw error
    }
  }

  /**
   * 根据ID获取单个节点
   * @param {string} nodeId - 节点ID
   * @returns {Promise<Object>} 节点对象
   */
  async getNode(nodeId) {
    try {
      return await this.client.getNode(nodeId)
    } catch (error) {
      console.error(`获取节点 ${nodeId} 失败:`, error)
      throw error
    }
  }

  /**
   * 获取路线数据
   * @returns {Promise<Object>} GeoJSON格式的路线数据
   */
  async getRoute() {
    try {
      return await this.client.getRoute()
    } catch (error) {
      console.error('获取路线数据失败:', error)
      throw error
    }
  }

  /**
   * 获取场景数据
   * @param {string} sceneId - 场景ID（可选）
   * @returns {Promise<Array|Object>} 场景数组或单个场景
   */
  async getScenes(sceneId = null) {
    try {
      return await this.client.getScenes(sceneId)
    } catch (error) {
      console.error('获取场景数据失败:', error)
      throw error
    }
  }

  /**
   * 根据节点ID获取相关场景
   * @param {string} nodeId - 节点ID
   * @returns {Promise<Array>} 场景数组
   */
  async getScenesByNode(nodeId) {
    try {
      return await this.client.getScenesByNode(nodeId)
    } catch (error) {
      console.error(`获取节点 ${nodeId} 的场景失败:`, error)
      throw error
    }
  }

  /**
   * 获取成就数据
   * @returns {Promise<Array>} 成就数组
   */
  async getAchievements() {
    try {
      return await this.client.getAchievements()
    } catch (error) {
      console.error('获取成就数据失败:', error)
      throw error
    }
  }

  /**
   * 获取演示脚本
   * @returns {Promise<Object>} 演示脚本对象
   */
  async getDemoScript() {
    try {
      return await this.client.getDemoScript()
    } catch (error) {
      console.error('获取演示脚本失败:', error)
      throw error
    }
  }

  /**
   * 保存用户进度（仅在非Mock模式下有效）
   * @param {Object} progressData - 进度数据
   * @returns {Promise<Object>} 保存结果
   */
  async saveProgress(progressData) {
    try {
      if (this.isMockMode) {
        console.warn('Mock模式下不支持保存进度到服务器')
        return { success: true, message: 'Mock模式下本地保存' }
      }
      return await this.client.saveProgress(progressData)
    } catch (error) {
      console.error('保存进度失败:', error)
      throw error
    }
  }

  /**
   * 加载用户进度（仅在非Mock模式下有效）
   * @param {string} userId - 用户ID
   * @returns {Promise<Object>} 进度数据
   */
  async loadProgress(userId) {
    try {
      if (this.isMockMode) {
        console.warn('Mock模式下不支持从服务器加载进度')
        return null
      }
      return await this.client.loadProgress(userId)
    } catch (error) {
      console.error('加载进度失败:', error)
      throw error
    }
  }

  /**
   * 提交用户选择记录（用于数据分析）
   * @param {Object} choiceData - 选择数据
   * @returns {Promise<Object>} 提交结果
   */
  async submitChoice(choiceData) {
    try {
      if (this.isMockMode) {
        console.log('Mock模式下记录选择:', choiceData)
        return { success: true, message: 'Mock模式下本地记录' }
      }
      return await this.client.submitChoice(choiceData)
    } catch (error) {
      console.error('提交选择失败:', error)
      throw error
    }
  }

  /**
   * 获取统计数据
   * @returns {Promise<Object>} 统计数据
   */
  async getStatistics() {
    try {
      return await this.client.getStatistics()
    } catch (error) {
      console.error('获取统计数据失败:', error)
      throw error
    }
  }

  /**
   * 切换API模式（开发时使用）
   * @param {boolean} useMock - 是否使用Mock模式
   */
  switchMode(useMock) {
    this.client = useMock ? mockApi : realApi
    this.isMockMode = useMock
    console.log(`API模式已切换为: ${useMock ? 'Mock' : 'Real'}`)
  }

  /**
   * 获取当前模式
   * @returns {string} 当前模式
   */
  getCurrentMode() {
    return this.isMockMode ? 'mock' : 'real'
  }
}

// 创建并导出API客户端实例
export const apiClient = new ApiClient()

// 导出API客户端类（用于测试或特殊用途）
export { ApiClient }

// 导出便捷方法
export const {
  getNodes,
  getNode,
  getRoute,
  getScenes,
  getScenesByNode,
  getAchievements,
  getDemoScript,
  saveProgress,
  loadProgress,
  submitChoice,
  getStatistics
} = apiClient