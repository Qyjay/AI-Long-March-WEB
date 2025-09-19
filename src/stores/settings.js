import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * 设置状态管理
 * 管理应用的全局设置选项
 */
export const useSettings = defineStore('settings', () => {
  // 状态
  const lang = ref('zh')
  const demoMode = ref(false)
  const sfx = ref(true)
  const tts = ref(false)
  const autoSave = ref(true)
  const showTutorial = ref(true)
  const mapStyle = ref('streets-v12')
  const animationSpeed = ref(1.0)
  
  // 计算属性
  const isChineseLanguage = computed(() => lang.value === 'zh')
  const isEnglishLanguage = computed(() => lang.value === 'en')
  
  const isDemoModeActive = computed(() => demoMode.value)
  
  const isSoundEnabled = computed(() => sfx.value)
  
  const shouldShowTutorial = computed(() => showTutorial.value)
  
  // 方法
  
  /**
   * 切换语言
   * @param {string} newLang - 新语言代码 ('zh' | 'en')
   */
  const setLanguage = (newLang) => {
    if (!['zh', 'en'].includes(newLang)) return
    
    lang.value = newLang
    saveToStorage()
    
    // 更新HTML lang属性
    document.documentElement.lang = newLang === 'zh' ? 'zh-CN' : 'en-US'
    
    console.log(`语言切换为: ${newLang}`)
  }
  
  /**
   * 切换演示模式
   * @param {boolean} enabled - 是否启用演示模式
   */
  const setDemoMode = (enabled) => {
    demoMode.value = Boolean(enabled)
    saveToStorage()
    
    console.log(`演示模式: ${enabled ? '开启' : '关闭'}`)
  }
  
  /**
   * 切换音效
   * @param {boolean} enabled - 是否启用音效
   */
  const setSfx = (enabled) => {
    sfx.value = Boolean(enabled)
    saveToStorage()
    
    console.log(`音效: ${enabled ? '开启' : '关闭'}`)
  }
  
  /**
   * 切换语音播报
   * @param {boolean} enabled - 是否启用语音播报
   */
  const setTts = (enabled) => {
    tts.value = Boolean(enabled)
    saveToStorage()
    
    console.log(`语音播报: ${enabled ? '开启' : '关闭'}`)
  }
  
  /**
   * 设置地图样式
   * @param {string} style - 地图样式名称
   */
  const setMapStyle = (style) => {
    mapStyle.value = style
    saveToStorage()
    
    console.log(`地图样式: ${style}`)
  }
  
  /**
   * 设置动画速度
   * @param {number} speed - 动画速度倍数 (0.5 - 2.0)
   */
  const setAnimationSpeed = (speed) => {
    const clampedSpeed = Math.max(0.5, Math.min(2.0, speed))
    animationSpeed.value = clampedSpeed
    saveToStorage()
    
    console.log(`动画速度: ${clampedSpeed}x`)
  }
  
  /**
   * 关闭新手教程
   */
  const dismissTutorial = () => {
    showTutorial.value = false
    saveToStorage()
    
    console.log('新手教程已关闭')
  }
  
  /**
   * 重置所有设置为默认值
   */
  const resetToDefaults = () => {
    lang.value = 'zh'
    demoMode.value = false
    sfx.value = true
    tts.value = false
    autoSave.value = true
    showTutorial.value = true
    mapStyle.value = 'streets-v12'
    animationSpeed.value = 1.0
    
    saveToStorage()
    
    console.log('设置已重置为默认值')
  }
  
  /**
   * 获取当前文本（根据语言设置）
   * @param {object} textObj - 包含多语言文本的对象 {zh: '', en: ''}
   * @returns {string} 当前语言的文本
   */
  const getText = (textObj) => {
    if (!textObj) return ''
    
    const key = lang.value === 'zh' ? 'name_zh' : 'name_en'
    return textObj[key] || textObj.text_zh || textObj.text_en || ''
  }
  
  /**
   * 保存设置到本地存储
   */
  const saveToStorage = () => {
    const settingsData = {
      lang: lang.value,
      demoMode: demoMode.value,
      sfx: sfx.value,
      tts: tts.value,
      autoSave: autoSave.value,
      showTutorial: showTutorial.value,
      mapStyle: mapStyle.value,
      animationSpeed: animationSpeed.value,
      lastUpdated: Date.now()
    }
    
    localStorage.setItem('longmarch_settings', JSON.stringify(settingsData))
  }
  
  /**
   * 从本地存储加载设置
   */
  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem('longmarch_settings')
      if (stored) {
        const settingsData = JSON.parse(stored)
        
        lang.value = settingsData.lang || 'zh'
        demoMode.value = settingsData.demoMode || false
        sfx.value = settingsData.sfx !== undefined ? settingsData.sfx : true
        tts.value = settingsData.tts || false
        autoSave.value = settingsData.autoSave !== undefined ? settingsData.autoSave : true
        showTutorial.value = settingsData.showTutorial !== undefined ? settingsData.showTutorial : true
        mapStyle.value = settingsData.mapStyle || 'streets-v12'
        animationSpeed.value = settingsData.animationSpeed || 1.0
        
        // 设置HTML lang属性
        document.documentElement.lang = lang.value === 'zh' ? 'zh-CN' : 'en-US'
        
        console.log('已加载本地设置数据')
      }
    } catch (error) {
      console.error('加载设置数据失败:', error)
      resetToDefaults()
    }
  }
  
  /**
   * 初始化设置
   */
  const initialize = async () => {
    loadFromStorage()
    
    // 检查URL参数中的演示模式
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('demo') === '1') {
      setDemoMode(true)
    }
    
    return true
  }
  
  /**
   * 获取设置摘要
   * @returns {object} 设置摘要信息
   */
  const getSettingsSummary = () => {
    return {
      language: lang.value,
      demoMode: demoMode.value,
      soundEnabled: sfx.value,
      ttsEnabled: tts.value,
      mapStyle: mapStyle.value,
      animationSpeed: animationSpeed.value
    }
  }
  
  return {
    // 状态
    lang,
    demoMode,
    sfx,
    tts,
    autoSave,
    showTutorial,
    mapStyle,
    animationSpeed,
    
    // 计算属性
    isChineseLanguage,
    isEnglishLanguage,
    isDemoModeActive,
    isSoundEnabled,
    shouldShowTutorial,
    
    // 方法
    setLanguage,
    setDemoMode,
    setSfx,
    setTts,
    setMapStyle,
    setAnimationSpeed,
    dismissTutorial,
    resetToDefaults,
    getText,
    saveToStorage,
    loadFromStorage,
    initialize,
    getSettingsSummary
  }
})