<template>
  <div class="settings-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <button 
          @click="goBack"
          class="back-button"
          aria-label="返回"
        >
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
        </button>
        <h1 class="page-title">设置</h1>
      </div>
    </div>

    <!-- 设置内容 -->
    <div class="settings-content">
      <!-- 显示设置 -->
      <div class="settings-section">
        <h2 class="section-title">显示设置</h2>
        <div class="settings-group">
          <!-- 主题设置 -->
          <div class="setting-item">
            <div class="setting-info">
              <label class="setting-label">主题模式</label>
              <p class="setting-description">选择应用的外观主题</p>
            </div>
            <select 
              v-model="settings.theme"
              @change="updateSetting('theme', $event.target.value)"
              class="setting-select"
            >
              <option value="light">浅色</option>
              <option value="dark">深色</option>
              <option value="auto">跟随系统</option>
            </select>
          </div>

          <!-- 语言设置 -->
          <div class="setting-item">
            <div class="setting-info">
              <label class="setting-label">语言</label>
              <p class="setting-description">选择应用界面语言</p>
            </div>
            <select 
              v-model="settings.language"
              @change="updateSetting('language', $event.target.value)"
              class="setting-select"
            >
              <option value="zh-CN">简体中文</option>
              <option value="zh-TW">繁體中文</option>
              <option value="en-US">English</option>
            </select>
          </div>

          <!-- 字体大小 -->
          <div class="setting-item">
            <div class="setting-info">
              <label class="setting-label">字体大小</label>
              <p class="setting-description">调整文字显示大小</p>
            </div>
            <select 
              v-model="settings.fontSize"
              @change="updateSetting('fontSize', $event.target.value)"
              class="setting-select"
            >
              <option value="small">小</option>
              <option value="medium">中</option>
              <option value="large">大</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 音频设置 -->
      <div class="settings-section">
        <h2 class="section-title">音频设置</h2>
        <div class="settings-group">
          <!-- 背景音乐 -->
          <div class="setting-item">
            <div class="setting-info">
              <label class="setting-label">背景音乐</label>
              <p class="setting-description">开启或关闭背景音乐</p>
            </div>
            <label class="toggle-switch">
              <input 
                type="checkbox"
                v-model="settings.backgroundMusic"
                @change="updateSetting('backgroundMusic', $event.target.checked)"
              >
              <span class="toggle-slider"></span>
            </label>
          </div>

          <!-- 音效 -->
          <div class="setting-item">
            <div class="setting-info">
              <label class="setting-label">音效</label>
              <p class="setting-description">开启或关闭界面音效</p>
            </div>
            <label class="toggle-switch">
              <input 
                type="checkbox"
                v-model="settings.soundEffects"
                @change="updateSetting('soundEffects', $event.target.checked)"
              >
              <span class="toggle-slider"></span>
            </label>
          </div>

          <!-- 音量控制 -->
          <div class="setting-item">
            <div class="setting-info">
              <label class="setting-label">主音量</label>
              <p class="setting-description">调整整体音量大小</p>
            </div>
            <div class="volume-control">
              <input 
                type="range"
                min="0"
                max="100"
                v-model="settings.volume"
                @input="updateSetting('volume', $event.target.value)"
                class="volume-slider"
              >
              <span class="volume-value">{{ settings.volume }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 游戏设置 -->
      <div class="settings-section">
        <h2 class="section-title">游戏设置</h2>
        <div class="settings-group">
          <!-- 自动保存 -->
          <div class="setting-item">
            <div class="setting-info">
              <label class="setting-label">自动保存</label>
              <p class="setting-description">自动保存游戏进度</p>
            </div>
            <label class="toggle-switch">
              <input 
                type="checkbox"
                v-model="settings.autoSave"
                @change="updateSetting('autoSave', $event.target.checked)"
              >
              <span class="toggle-slider"></span>
            </label>
          </div>

          <!-- 动画效果 -->
          <div class="setting-item">
            <div class="setting-info">
              <label class="setting-label">动画效果</label>
              <p class="setting-description">开启或关闭界面动画</p>
            </div>
            <label class="toggle-switch">
              <input 
                type="checkbox"
                v-model="settings.animations"
                @change="updateSetting('animations', $event.target.checked)"
              >
              <span class="toggle-slider"></span>
            </label>
          </div>

          <!-- 提示功能 -->
          <div class="setting-item">
            <div class="setting-info">
              <label class="setting-label">新手提示</label>
              <p class="setting-description">显示操作提示和帮助信息</p>
            </div>
            <label class="toggle-switch">
              <input 
                type="checkbox"
                v-model="settings.showHints"
                @change="updateSetting('showHints', $event.target.checked)"
              >
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      <!-- 数据管理 -->
      <div class="settings-section">
        <h2 class="section-title">数据管理</h2>
        <div class="settings-group">
          <!-- 导出数据 -->
          <div class="setting-item">
            <div class="setting-info">
              <label class="setting-label">导出进度</label>
              <p class="setting-description">导出游戏进度和成就数据</p>
            </div>
            <button 
              @click="exportData"
              class="action-button secondary"
            >
              导出数据
            </button>
          </div>

          <!-- 导入数据 -->
          <div class="setting-item">
            <div class="setting-info">
              <label class="setting-label">导入进度</label>
              <p class="setting-description">从文件导入游戏进度</p>
            </div>
            <input 
              ref="fileInput"
              type="file"
              accept=".json"
              @change="importData"
              style="display: none;"
            >
            <button 
              @click="$refs.fileInput.click()"
              class="action-button secondary"
            >
              导入数据
            </button>
          </div>

          <!-- 重置数据 -->
          <div class="setting-item">
            <div class="setting-info">
              <label class="setting-label">重置进度</label>
              <p class="setting-description">清除所有游戏数据（不可恢复）</p>
            </div>
            <button 
              @click="showResetConfirm = true"
              class="action-button danger"
            >
              重置数据
            </button>
          </div>
        </div>
      </div>

      <!-- 关于信息 -->
      <div class="settings-section">
        <h2 class="section-title">关于</h2>
        <div class="settings-group">
          <div class="about-info">
            <h3 class="app-name">数字长征</h3>
            <p class="app-version">版本 1.0.0</p>
            <p class="app-description">
              通过交互式体验重走长征路，感受革命先辈的伟大精神。
            </p>
            <div class="app-links">
              <a href="#" class="app-link">用户协议</a>
              <a href="#" class="app-link">隐私政策</a>
              <a href="#" class="app-link">意见反馈</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 重置确认弹窗 -->
    <div v-if="showResetConfirm" class="modal-overlay" @click="showResetConfirm = false">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">确认重置</h3>
        <p class="modal-message">
          此操作将清除所有游戏进度、成就和设置，且无法恢复。确定要继续吗？
        </p>
        <div class="modal-actions">
          <button 
            @click="showResetConfirm = false"
            class="action-button secondary"
          >
            取消
          </button>
          <button 
            @click="resetAllData"
            class="action-button danger"
          >
            确认重置
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSettings } from '../stores/settings'
import { useProgressStore } from '../stores/progress'

/**
 * 设置页面组件
 * 提供应用设置、数据管理和关于信息
 */

// 路由
const router = useRouter()

// 存储
const settingsStore = useSettings()
const progressStore = useProgressStore()

// 响应式数据
const settings = reactive({
  theme: 'light',
  language: 'zh-CN',
  fontSize: 'medium',
  backgroundMusic: true,
  soundEffects: true,
  volume: 80,
  autoSave: true,
  animations: true,
  showHints: true
})

const showResetConfirm = ref(false)
const fileInput = ref(null)

/**
 * 返回上一页
 */
const goBack = () => {
  router.back()
}

/**
 * 更新设置
 */
const updateSetting = async (key, value) => {
  settings[key] = value
  await settingsStore.updateSetting(key, value)
  
  // 应用特定设置
  applySettings(key, value)
}

/**
 * 应用设置
 */
const applySettings = (key, value) => {
  switch (key) {
    case 'theme':
      applyTheme(value)
      break
    case 'fontSize':
      applyFontSize(value)
      break
    case 'language':
      applyLanguage(value)
      break
  }
}

/**
 * 应用主题
 */
const applyTheme = (theme) => {
  const root = document.documentElement
  
  if (theme === 'dark') {
    root.classList.add('dark')
  } else if (theme === 'light') {
    root.classList.remove('dark')
  } else {
    // 跟随系统
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (prefersDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }
}

/**
 * 应用字体大小
 */
const applyFontSize = (fontSize) => {
  const root = document.documentElement
  const sizeMap = {
    small: '14px',
    medium: '16px',
    large: '18px'
  }
  root.style.fontSize = sizeMap[fontSize] || '16px'
}

/**
 * 应用语言设置
 */
const applyLanguage = (language) => {
  // 这里可以集成国际化库
  console.log('切换语言到:', language)
}

/**
 * 导出数据
 */
const exportData = () => {
  try {
    const data = {
      settings: settings,
      progress: progressStore.getExportData(),
      timestamp: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    })
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `long-march-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    console.log('数据导出成功')
  } catch (error) {
    console.error('数据导出失败:', error)
  }
}

/**
 * 导入数据
 */
const importData = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result)
      
      // 验证数据格式
      if (data.settings && data.progress) {
        // 导入设置
        Object.assign(settings, data.settings)
        
        // 导入进度
        progressStore.importData(data.progress)
        
        // 应用设置
        Object.keys(data.settings).forEach(key => {
          applySettings(key, data.settings[key])
        })
        
        console.log('数据导入成功')
      } else {
        throw new Error('数据格式不正确')
      }
    } catch (error) {
      console.error('数据导入失败:', error)
      alert('数据导入失败，请检查文件格式')
    }
  }
  reader.readAsText(file)
  
  // 清空文件输入
  event.target.value = ''
}

/**
 * 重置所有数据
 */
const resetAllData = () => {
  try {
    // 重置设置
    Object.assign(settings, {
      theme: 'light',
      language: 'zh-CN',
      fontSize: 'medium',
      backgroundMusic: true,
      soundEffects: true,
      volume: 80,
      autoSave: true,
      animations: true,
      showHints: true
    })
    
    // 重置进度
    progressStore.resetAllData()
    
    // 重置设置存储
    settingsStore.resetSettings()
    
    // 应用默认设置
    applyTheme('light')
    applyFontSize('medium')
    
    showResetConfirm.value = false
    console.log('数据重置成功')
    
    // 刷新页面
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  } catch (error) {
    console.error('数据重置失败:', error)
  }
}

/**
 * 加载设置
 */
const loadSettings = async () => {
  try {
    const savedSettings = await settingsStore.getSettings()
    Object.assign(settings, savedSettings)
    
    // 应用已保存的设置
    Object.keys(savedSettings).forEach(key => {
      applySettings(key, savedSettings[key])
    })
  } catch (error) {
    console.error('加载设置失败:', error)
  }
}

// 组件挂载时加载设置
onMounted(() => {
  loadSettings()
})
</script>

<style scoped>
.settings-page {
  min-height: 100vh;
  background: #f8fafc;
}

.page-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.back-button {
  padding: 0.5rem;
  border: none;
  background: #f1f5f9;
  border-radius: 0.5rem;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.back-button:hover {
  background: #e2e8f0;
  color: #475569;
}

.page-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

.settings-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.settings-section {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  overflow: hidden;
}

.section-title {
  margin: 0;
  padding: 1.5rem 1.5rem 1rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  border-bottom: 1px solid #f1f5f9;
}

.settings-group {
  padding: 0;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #f1f5f9;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-info {
  flex: 1;
  margin-right: 1rem;
}

.setting-label {
  display: block;
  font-size: 1rem;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.setting-description {
  margin: 0;
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.4;
}

.setting-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: white;
  font-size: 0.875rem;
  min-width: 120px;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
  cursor: pointer;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #cbd5e1;
  border-radius: 24px;
  transition: 0.3s;
}

.toggle-slider:before {
  position: absolute;
  content: '';
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background: white;
  border-radius: 50%;
  transition: 0.3s;
}

input:checked + .toggle-slider {
  background: #3b82f6;
}

input:checked + .toggle-slider:before {
  transform: translateX(24px);
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 1rem;
  min-width: 160px;
}

.volume-slider {
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: #e2e8f0;
  outline: none;
  cursor: pointer;
}

.volume-slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
}

.volume-value {
  font-size: 0.875rem;
  color: #64748b;
  min-width: 40px;
  text-align: right;
}

.action-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.action-button.secondary {
  background: #f1f5f9;
  color: #475569;
}

.action-button.secondary:hover {
  background: #e2e8f0;
}

.action-button.danger {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.action-button.danger:hover {
  background: #fee2e2;
}

.about-info {
  padding: 1.5rem;
  text-align: center;
}

.app-name {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

.app-version {
  margin: 0 0 1rem 0;
  font-size: 0.875rem;
  color: #64748b;
}

.app-description {
  margin: 0 0 1.5rem 0;
  color: #475569;
  line-height: 1.6;
}

.app-links {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.app-link {
  color: #3b82f6;
  text-decoration: none;
  font-size: 0.875rem;
}

.app-link:hover {
  text-decoration: underline;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 0.75rem;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.modal-title {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
}

.modal-message {
  margin: 0 0 2rem 0;
  color: #475569;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .settings-content {
    padding: 1rem;
  }
  
  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .setting-info {
    margin-right: 0;
  }
  
  .volume-control {
    width: 100%;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .app-links {
    flex-direction: column;
    gap: 0.75rem;
  }
}
</style>