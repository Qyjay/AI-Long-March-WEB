/**
 * 真实API实现
 * 连接到后端服务器的API接口
 */

/**
 * API配置
 */
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000
}

/**
 * HTTP请求工具类
 */
class HttpClient {
  constructor(config) {
    this.baseURL = config.baseURL
    this.timeout = config.timeout
    this.retryAttempts = config.retryAttempts
    this.retryDelay = config.retryDelay
  }

  /**
   * 发送HTTP请求
   * @param {string} url - 请求URL
   * @param {Object} options - 请求选项
   * @returns {Promise<Object>} 响应数据
   */
  async request(url, options = {}) {
    const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`
    const config = {
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    }

    let lastError
    for (let attempt = 0; attempt <= this.retryAttempts; attempt++) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), this.timeout)
        
        const response = await fetch(fullUrl, {
          ...config,
          signal: controller.signal
        })
        
        clearTimeout(timeoutId)
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const data = await response.json()
        return data
      } catch (error) {
        lastError = error
        
        if (attempt < this.retryAttempts) {
          console.warn(`请求失败，${this.retryDelay}ms后重试 (${attempt + 1}/${this.retryAttempts}):`, error.message)
          await new Promise(resolve => setTimeout(resolve, this.retryDelay))
        }
      }
    }
    
    throw lastError
  }

  /**
   * GET请求
   * @param {string} url - 请求URL
   * @param {Object} params - 查询参数
   * @returns {Promise<Object>} 响应数据
   */
  async get(url, params = {}) {
    const queryString = new URLSearchParams(params).toString()
    const fullUrl = queryString ? `${url}?${queryString}` : url
    return this.request(fullUrl, { method: 'GET' })
  }

  /**
   * POST请求
   * @param {string} url - 请求URL
   * @param {Object} data - 请求数据
   * @returns {Promise<Object>} 响应数据
   */
  async post(url, data = {}) {
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  /**
   * PUT请求
   * @param {string} url - 请求URL
   * @param {Object} data - 请求数据
   * @returns {Promise<Object>} 响应数据
   */
  async put(url, data = {}) {
    return this.request(url, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  /**
   * DELETE请求
   * @param {string} url - 请求URL
   * @returns {Promise<Object>} 响应数据
   */
  async delete(url) {
    return this.request(url, { method: 'DELETE' })
  }
}

/**
 * 真实API实现类
 */
class RealApi {
  constructor() {
    this.http = new HttpClient(API_CONFIG)
    this.authToken = null
  }

  /**
   * 设置认证令牌
   * @param {string} token - 认证令牌
   */
  setAuthToken(token) {
    this.authToken = token
  }

  /**
   * 获取认证头
   * @returns {Object} 认证头
   */
  getAuthHeaders() {
    return this.authToken ? {
      'Authorization': `Bearer ${this.authToken}`
    } : {}
  }

  /**
   * 获取所有节点数据
   * @returns {Promise<Array>} 节点数组
   */
  async getNodes() {
    try {
      const response = await this.http.get('/nodes')
      return response.data || response
    } catch (error) {
      console.error('获取节点数据失败:', error)
      throw new Error('无法连接到服务器获取节点数据')
    }
  }

  /**
   * 根据ID获取单个节点
   * @param {string} nodeId - 节点ID
   * @returns {Promise<Object>} 节点对象
   */
  async getNode(nodeId) {
    try {
      const response = await this.http.get(`/nodes/${nodeId}`)
      return response.data || response
    } catch (error) {
      console.error(`获取节点 ${nodeId} 失败:`, error)
      throw new Error(`无法获取节点 ${nodeId}`)
    }
  }

  /**
   * 获取路线数据
   * @returns {Promise<Object>} GeoJSON格式的路线数据
   */
  async getRoute() {
    try {
      const response = await this.http.get('/route')
      return response.data || response
    } catch (error) {
      console.error('获取路线数据失败:', error)
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
      const url = sceneId ? `/scenes/${sceneId}` : '/scenes'
      const response = await this.http.get(url)
      return response.data || response
    } catch (error) {
      console.error('获取场景数据失败:', error)
      throw new Error('无法获取场景数据')
    }
  }

  /**
   * 根据节点ID获取相关场景
   * @param {string} nodeId - 节点ID
   * @returns {Promise<Array>} 场景数组
   */
  async getScenesByNode(nodeId) {
    try {
      const response = await this.http.get('/scenes', { nodeId })
      return response.data || response
    } catch (error) {
      console.error(`获取节点 ${nodeId} 的场景失败:`, error)
      throw new Error(`无法获取节点 ${nodeId} 的场景`)
    }
  }

  /**
   * 获取成就数据
   * @returns {Promise<Array>} 成就数组
   */
  async getAchievements() {
    try {
      const response = await this.http.get('/achievements')
      return response.data || response
    } catch (error) {
      console.error('获取成就数据失败:', error)
      throw new Error('无法获取成就数据')
    }
  }

  /**
   * 获取演示脚本
   * @returns {Promise<Object>} 演示脚本对象
   */
  async getDemoScript() {
    try {
      const response = await this.http.get('/demo-script')
      return response.data || response
    } catch (error) {
      console.error('获取演示脚本失败:', error)
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
      const response = await this.http.post('/user/progress', progressData, {
        headers: this.getAuthHeaders()
      })
      return response.data || response
    } catch (error) {
      console.error('保存进度失败:', error)
      throw new Error('无法保存用户进度')
    }
  }

  /**
   * 加载用户进度
   * @param {string} userId - 用户ID
   * @returns {Promise<Object>} 进度数据
   */
  async loadProgress(userId) {
    try {
      const response = await this.http.get(`/user/progress/${userId}`, {}, {
        headers: this.getAuthHeaders()
      })
      return response.data || response
    } catch (error) {
      console.error('加载进度失败:', error)
      throw new Error('无法加载用户进度')
    }
  }

  /**
   * 提交用户选择记录
   * @param {Object} choiceData - 选择数据
   * @returns {Promise<Object>} 提交结果
   */
  async submitChoice(choiceData) {
    try {
      const response = await this.http.post('/analytics/choice', choiceData)
      return response.data || response
    } catch (error) {
      console.error('提交选择失败:', error)
      throw new Error('无法提交选择记录')
    }
  }

  /**
   * 获取统计数据
   * @returns {Promise<Object>} 统计数据
   */
  async getStatistics() {
    try {
      const response = await this.http.get('/analytics/statistics')
      return response.data || response
    } catch (error) {
      console.error('获取统计数据失败:', error)
      throw new Error('无法获取统计数据')
    }
  }

  /**
   * 用户认证
   * @param {Object} credentials - 认证信息
   * @returns {Promise<Object>} 认证结果
   */
  async authenticate(credentials) {
    try {
      const response = await this.http.post('/auth/login', credentials)
      if (response.token) {
        this.setAuthToken(response.token)
      }
      return response.data || response
    } catch (error) {
      console.error('用户认证失败:', error)
      throw new Error('认证失败')
    }
  }

  /**
   * 用户注册
   * @param {Object} userData - 用户数据
   * @returns {Promise<Object>} 注册结果
   */
  async register(userData) {
    try {
      const response = await this.http.post('/auth/register', userData)
      return response.data || response
    } catch (error) {
      console.error('用户注册失败:', error)
      throw new Error('注册失败')
    }
  }

  /**
   * 搜索节点
   * @param {string} query - 搜索关键词
   * @returns {Promise<Array>} 搜索结果
   */
  async searchNodes(query) {
    try {
      const response = await this.http.get('/search/nodes', { q: query })
      return response.data || response
    } catch (error) {
      console.error('搜索失败:', error)
      throw new Error('搜索请求失败')
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
      const response = await this.http.get('/route/path', {
        from: fromNodeId,
        to: toNodeId
      })
      return response.data || response
    } catch (error) {
      console.error('获取路径失败:', error)
      throw new Error('无法计算路径')
    }
  }

  /**
   * 健康检查
   * @returns {Promise<Object>} 服务器状态
   */
  async healthCheck() {
    try {
      const response = await this.http.get('/health')
      return response.data || response
    } catch (error) {
      console.error('健康检查失败:', error)
      throw new Error('服务器不可用')
    }
  }

  /**
   * 获取API状态信息
   * @returns {Object} 状态信息
   */
  getStatus() {
    return {
      mode: 'real',
      baseURL: this.http.baseURL,
      timeout: this.http.timeout,
      authenticated: !!this.authToken,
      retryAttempts: this.http.retryAttempts
    }
  }
}

// 创建并导出真实API实例
export const realApi = new RealApi()

// 导出真实API类
export { RealApi }