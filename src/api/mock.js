/**
 * Mock API实现
 * 使用本地JSON文件模拟API响应
 */

// 导入Mock数据
import nodesData from '../data/nodes.mock.json'
import routeData from '../data/route.mock.json'
import scenesData from '../data/scenes.mock.json'
import achievementsData from '../data/achievements.mock.json'
import demoScriptData from '../data/demo-script.mock.json'

/**
 * 模拟网络延迟
 * @param {number} ms - 延迟毫秒数
 * @returns {Promise} Promise对象
 */
const delay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * 模拟API响应包装器
 * @param {any} data - 响应数据
 * @param {number} delayMs - 延迟时间
 * @returns {Promise} 包装后的响应
 */
const mockResponse = async (data, delayMs = 100) => {
  await delay(delayMs)
  return {
    success: true,
    data,
    timestamp: Date.now(),
    source: 'mock'
  }
}

/**
 * 模拟错误响应
 * @param {string} message - 错误消息
 * @param {number} code - 错误代码
 * @returns {Promise} 错误响应
 */
const mockError = async (message, code = 500) => {
  await delay(50)
  throw new Error(`Mock API Error ${code}: ${message}`)
}

/**
 * Mock API实现类
 */
class MockApi {
  constructor() {
    this.nodes = nodesData
    this.route = routeData
    this.scenes = scenesData
    this.achievements = achievementsData
    this.demoScript = demoScriptData
    
    // 模拟用户数据存储
    this.userProgress = new Map()
    this.userChoices = []
    this.statistics = {
      totalUsers: 1250,
      totalSessions: 3420,
      averageCompletionTime: 1800000, // 30分钟
      popularNodes: ['node_ruijin', 'node_zunyi', 'node_luding'],
      completionRate: 0.68
    }
  }

  /**
   * 获取所有节点数据
   * @returns {Promise<Array>} 节点数组
   */
  async getNodes() {
    try {
      const response = await mockResponse(this.nodes, 150)
      return response.data
    } catch (error) {
      console.error('Mock API getNodes error:', error)
      throw new Error('无法获取节点数据')
    }
  }

  /**
   * 根据ID获取单个节点
   * @param {string} nodeId - 节点ID
   * @returns {Promise<Object>} 节点对象
   */
  async getNode(nodeId) {
    try {
      const node = this.nodes.find(n => n.id === nodeId)
      if (!node) {
        await mockError(`节点 ${nodeId} 不存在`, 404)
      }
      const response = await mockResponse(node, 80)
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * 获取路线数据
   * @returns {Promise<Object>} GeoJSON格式的路线数据
   */
  async getRoute() {
    try {
      const response = await mockResponse(this.route, 120)
      return response.data
    } catch (error) {
      console.error('Mock API getRoute error:', error)
      throw new Error('无法获取路线数据')
    }
  }

  /**
   * 获取场景数据
   * @param {string} sceneId - 场景ID（可选）
   * @returns {Promise<Array|Object>} 场景数组或单个场景
   */
  async getScenes(sceneId = null) {
    try {
      if (sceneId) {
        const scene = this.scenes.find(s => s.id === sceneId)
        if (!scene) {
          await mockError(`场景 ${sceneId} 不存在`, 404)
        }
        const response = await mockResponse(scene, 90)
        return response.data
      } else {
        const response = await mockResponse(this.scenes, 200)
        return response.data
      }
    } catch (error) {
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
      const nodeScenes = this.scenes.filter(s => s.nodeId === nodeId)
      const response = await mockResponse(nodeScenes, 100)
      return response.data
    } catch (error) {
      await mockError(`无法获取节点 ${nodeId} 的场景数据`)
    }
  }

  /**
   * 获取成就数据
   * @returns {Promise<Array>} 成就数组
   */
  async getAchievements() {
    try {
      const response = await mockResponse(this.achievements, 110)
      return response.data
    } catch (error) {
      console.error('Mock API getAchievements error:', error)
      throw new Error('无法获取成就数据')
    }
  }

  /**
   * 获取演示脚本
   * @returns {Promise<Object>} 演示脚本对象
   */
  async getDemoScript() {
    try {
      const response = await mockResponse(this.demoScript, 130)
      return response.data
    } catch (error) {
      console.error('Mock API getDemoScript error:', error)
      throw new Error('无法获取演示脚本')
    }
  }

  /**
   * 保存用户进度
   * @param {Object} progressData - 进度数据
   * @returns {Promise<Object>} 保存结果
   */
  async saveProgress(progressData) {
    try {
      const userId = progressData.userId || 'mock_user'
      this.userProgress.set(userId, {
        ...progressData,
        savedAt: Date.now()
      })
      
      const response = await mockResponse({
        success: true,
        message: '进度保存成功',
        userId
      }, 200)
      return response.data
    } catch (error) {
      await mockError('保存进度失败')
    }
  }

  /**
   * 加载用户进度
   * @param {string} userId - 用户ID
   * @returns {Promise<Object>} 进度数据
   */
  async loadProgress(userId) {
    try {
      const progress = this.userProgress.get(userId)
      const response = await mockResponse(progress || null, 150)
      return response.data
    } catch (error) {
      await mockError('加载进度失败')
    }
  }

  /**
   * 提交用户选择记录
   * @param {Object} choiceData - 选择数据
   * @returns {Promise<Object>} 提交结果
   */
  async submitChoice(choiceData) {
    try {
      this.userChoices.push({
        ...choiceData,
        timestamp: Date.now(),
        sessionId: 'mock_session_' + Math.random().toString(36).substr(2, 9)
      })
      
      const response = await mockResponse({
        success: true,
        message: '选择记录提交成功',
        choiceId: this.userChoices.length
      }, 80)
      return response.data
    } catch (error) {
      await mockError('提交选择失败')
    }
  }

  /**
   * 获取统计数据
   * @returns {Promise<Object>} 统计数据
   */
  async getStatistics() {
    try {
      // 动态更新一些统计数据
      const updatedStats = {
        ...this.statistics,
        totalChoices: this.userChoices.length,
        lastUpdated: Date.now(),
        recentChoices: this.userChoices.slice(-10)
      }
      
      const response = await mockResponse(updatedStats, 180)
      return response.data
    } catch (error) {
      await mockError('获取统计数据失败')
    }
  }

  /**
   * 搜索节点
   * @param {string} query - 搜索关键词
   * @returns {Promise<Array>} 搜索结果
   */
  async searchNodes(query) {
    try {
      const results = this.nodes.filter(node => 
        node.name.includes(query) || 
        node.summary.includes(query) ||
        node.poem.includes(query)
      )
      
      const response = await mockResponse(results, 120)
      return response.data
    } catch (error) {
      await mockError('搜索失败')
    }
  }

  /**
   * 获取节点间的路径
   * @param {string} fromNodeId - 起始节点ID
   * @param {string} toNodeId - 目标节点ID
   * @returns {Promise<Object>} 路径数据
   */
  async getPath(fromNodeId, toNodeId) {
    try {
      // 简单的路径计算模拟
      const fromNode = this.nodes.find(n => n.id === fromNodeId)
      const toNode = this.nodes.find(n => n.id === toNodeId)
      
      if (!fromNode || !toNode) {
        await mockError('节点不存在', 404)
      }
      
      const path = {
        from: fromNode,
        to: toNode,
        distance: Math.random() * 1000 + 100, // 模拟距离
        estimatedTime: Math.random() * 24 + 1, // 模拟时间（小时）
        waypoints: [
          [fromNode.coordinates[0], fromNode.coordinates[1]],
          [toNode.coordinates[0], toNode.coordinates[1]]
        ]
      }
      
      const response = await mockResponse(path, 100)
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * 重置Mock数据（开发时使用）
   */
  reset() {
    this.userProgress.clear()
    this.userChoices = []
    console.log('Mock数据已重置')
  }

  /**
   * 获取Mock状态信息
   * @returns {Object} 状态信息
   */
  getStatus() {
    return {
      mode: 'mock',
      nodesCount: this.nodes.length,
      scenesCount: this.scenes.length,
      achievementsCount: this.achievements.length,
      userProgressCount: this.userProgress.size,
      userChoicesCount: this.userChoices.length,
      uptime: Date.now()
    }
  }
}

// 创建并导出Mock API实例
export const mockApi = new MockApi()

// 导出Mock API类
export { MockApi }