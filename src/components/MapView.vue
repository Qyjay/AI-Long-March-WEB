<template>
  <div class="map-container relative w-full h-full">
    <!-- 地图容器 -->
    <div ref="mapContainer" class="w-full h-full" @contextmenu.prevent></div>

    <!-- 地图控制面板 -->
    <div class="absolute top-4 right-4 z-10">
      <!-- 主控制按钮组 -->
      <div class="flex flex-col gap-2 mb-4">
        <button @click="resetView" class="map-control-btn" title="重置视图">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
              clip-rule="evenodd" />
          </svg>
        </button>

        <button @click="toggleControlPanel" class="map-control-btn" :class="{ 'active': showControlPanel }"
          title="地图控制">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clip-rule="evenodd" />
          </svg>
        </button>

        <button @click="toggleLayerPanel" class="map-control-btn" :class="{ 'active': showLayerPanel }" title="图层管理">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
          </svg>
        </button>

        <button @click="toggleAnimationPanel" class="map-control-btn" :class="{ 'active': showAnimationPanel }"
          title="动画控制">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
              clip-rule="evenodd" />
          </svg>
        </button>
      </div>

      <!-- 控制面板 -->
      <div v-if="showControlPanel" class="control-panel">
        <h4 class="panel-title">地图控制</h4>
        <div class="control-group">
          <button @click="toggleRouteVisibility" class="control-item" :class="{ 'active': showRoute }">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                clip-rule="evenodd" />
            </svg>
            <span>显示路线</span>
          </button>

          <button @click="toggleSatelliteView" class="control-item" :class="{ 'active': isSatelliteView }">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fill-rule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clip-rule="evenodd" />
            </svg>
            <span>卫星视图</span>
          </button>

          <button @click="toggle3DView" class="control-item" :class="{ 'active': is3DView }">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>3D视图</span>
          </button>

          <button @click="toggleTerrainView" class="control-item" :class="{ 'active': showTerrain }">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clip-rule="evenodd" />
            </svg>
            <span>地形图</span>
          </button>
        </div>
      </div>

      <!-- 图层管理面板 -->
      <div v-if="showLayerPanel" class="control-panel">
        <h4 class="panel-title">图层管理</h4>
        <div class="layer-group">
          <div class="layer-item">
            <label class="layer-label">
              <input type="checkbox" v-model="layers.route.visible" @change="toggleLayer('route')">
              <span>长征路线</span>
            </label>
            <div class="layer-opacity">
              <input type="range" min="0" max="1" step="0.1" v-model="layers.route.opacity"
                @input="updateLayerOpacity('route')">
            </div>
          </div>

          <div class="layer-item">
            <label class="layer-label">
              <input type="checkbox" v-model="layers.nodes.visible" @change="toggleLayer('nodes')">
              <span>历史节点</span>
            </label>
            <div class="layer-opacity">
              <input type="range" min="0" max="1" step="0.1" v-model="layers.nodes.opacity"
                @input="updateLayerOpacity('nodes')">
            </div>
          </div>

          <div class="layer-item">
            <label class="layer-label">
              <input type="checkbox" v-model="layers.labels.visible" @change="toggleLayer('labels')">
              <span>地名标签</span>
            </label>
            <div class="layer-opacity">
              <input type="range" min="0" max="1" step="0.1" v-model="layers.labels.opacity"
                @input="updateLayerOpacity('labels')">
            </div>
          </div>

          <div class="layer-item">
            <label class="layer-label">
              <input type="checkbox" v-model="layers.historical.visible" @change="toggleLayer('historical')">
              <span>历史边界</span>
            </label>
            <div class="layer-opacity">
              <input type="range" min="0" max="1" step="0.1" v-model="layers.historical.opacity"
                @input="updateLayerOpacity('historical')">
            </div>
          </div>
        </div>
      </div>

      <!-- 动画控制面板 -->
      <div v-if="showAnimationPanel" class="control-panel">
        <h4 class="panel-title">动画控制</h4>
        <div class="animation-group">
          <button @click="startRouteAnimation" class="animation-btn" :disabled="isAnimating">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clip-rule="evenodd" />
            </svg>
            <span>播放路线</span>
          </button>

          <button @click="stopAnimation" class="animation-btn" :disabled="!isAnimating">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                clip-rule="evenodd" />
            </svg>
            <span>停止动画</span>
          </button>

          <div class="speed-control">
            <label>动画速度</label>
            <input type="range" min="0.5" max="3" step="0.5" v-model="animationSpeed">
            <span>{{ animationSpeed }}x</span>
          </div>

          <div class="progress-control" v-if="isAnimating">
            <label>进度</label>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: animationProgress + '%' }"></div>
            </div>
            <span>{{ Math.round(animationProgress) }}%</span>
          </div>
        </div>
      </div>
    </div>
  
    <!-- 节点信息弹窗 -->
    <div v-if="selectedNode">
    </div>

    <!-- 加载状态 -->
    <LoadingSpinner v-if="isLoading" :message="'加载地图中...'" class="absolute inset-0 z-30" />

    <!-- 错误状态 -->
    <ErrorMessage v-if="error" :error="error" :retrying="retrying" @retry="retry" @close="closeError"
      class="absolute inset-0 z-30" />
  </div>
</template>

<script setup>
import mapboxgl from 'mapbox-gl'
import MapboxLanguage from '@mapbox/mapbox-gl-language'
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useProgressStore } from '../stores/progress'
import { apiClient } from '../api'
import { eventBus } from '../utils/bus'
import { calculateDistance, calculateBounds } from '../utils/geo'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import ErrorMessage from '../components/ErrorMessage.vue'

// 设置RTL文本插件（确保只调用一次）
if (!mapboxgl.getRTLTextPluginStatus || mapboxgl.getRTLTextPluginStatus() === 'unavailable') {
  mapboxgl.setRTLTextPlugin('https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js')
}

/**
 * 地图视图组件
 * 负责显示Mapbox地图、长征路线和节点标记
 */

// Props
const props = defineProps({
  // 初始中心点
  center: {
    type: Array,
    default: () => [104.0, 30.0]
  },
  // 初始缩放级别
  zoom: {
    type: Number,
    default: 6
  },
  // 是否显示路线
  showRouteByDefault: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits([
  'node-click',
  'node-hover',
  'map-ready',
  'view-change'
])

// 响应式数据
const mapContainer = ref(null)
const map = ref(null)
const isLoading = ref(true)
const selectedNode = ref(null)
const showRoute = ref(props.showRouteByDefault)
const isSatelliteView = ref(false)
const nodes = ref([])
const routeData = ref(null)
const error = ref(null)
const retrying = ref(false)

// 控制面板状态
const showControlPanel = ref(false)
const showLayerPanel = ref(false)
const showAnimationPanel = ref(false)

// 地图视图状态
const is3DView = ref(false)
const showTerrain = ref(false)

// 图层管理
const layers = ref({
  route: { visible: true, opacity: 0.8 },
  nodes: { visible: true, opacity: 1.0 },
  labels: { visible: true, opacity: 1.0 },
  historical: { visible: false, opacity: 0.6 }
})

// 动画控制
const isAnimating = ref(false)
const animationSpeed = ref(1.0)
const animationProgress = ref(0)
const animationTimer = ref(null)
const currentAnimationStep = ref(0)

// 存储
const progressStore = useProgressStore()

// 地图样式配置
const mapStyles = {
  street: 'mapbox://styles/mapbox/streets-v11',
  satellite: 'mapbox://styles/mapbox/satellite-v9',
  historical: 'mapbox://styles/mapbox/outdoors-v11'
}

/**
 * 初始化Mapbox地图
 */
const initializeMap = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    // 动态导入Mapbox GL JS
    const mapboxgl = await import('mapbox-gl')
    
    // 获取并验证访问令牌
    const token = import.meta.env.VITE_MAPBOX_TOKEN
    console.log('Mapbox Token:', token ? `${token.substring(0, 20)}...` : 'undefined')
    console.log('Token length:', token ? token.length : 0)
    
    if (!token) {
      throw new Error('Mapbox access token is not configured. Please check your .env file and ensure VITE_MAPBOX_TOKEN is set.')
    }
    
    // 验证 token 格式
    if (!token.startsWith('pk.')) {
      throw new Error(`Invalid Mapbox token format. Token should start with "pk." but got: ${token.substring(0, 10)}...`)
    }
    
    // 验证 token 长度（Mapbox tokens 通常很长）
    if (token.length < 50) {
      throw new Error(`Mapbox token seems too short (${token.length} characters). Please check if the token is complete.`)
    }
    
    // 设置访问令牌 - 确保在创建地图之前设置
    mapboxgl.default.accessToken = token
    
    // 也设置传统方式以确保兼容性
    if (mapboxgl.accessToken !== undefined) {
      mapboxgl.accessToken = token
    }
    
    console.log('Mapbox GL version:', mapboxgl.version || 'unknown')
    console.log('Access token set:', mapboxgl.default.accessToken ? 'yes' : 'no')
    
    // 创建地图实例并立即设置中文语言
    map.value = new mapboxgl.default.Map({
      container: mapContainer.value,
      style: mapStyles.street,
      center: props.center,
      zoom: props.zoom,
      attributionControl: false,
      accessToken: token, // 直接在构造函数中传递 token
      locale: {
        'NavigationControl.ResetBearing': '重置方向',
        'NavigationControl.ZoomIn': '放大',
        'NavigationControl.ZoomOut': '缩小'
      }
    })
    
    // 地图加载完成事件
    map.value.on('load', async () => {
      try {
        // 地图加载完成后立即添加中文语言控制器
        try {
          const languageControl = new MapboxLanguage({ 
            defaultLanguage: 'zh'
          })
          map.value.addControl(languageControl)
        } catch (langErr) {
          console.warn('添加中文语言控制器失败：', langErr)
        }
        
        // 确保地图样式加载后强制设置中文标签
        try {
          // 手动设置所有标签图层为中文，确保完全中文显示
          const style = map.value.getStyle()
          if (style && style.layers) {
            style.layers.forEach(layer => {
              if (layer.type === 'symbol' && layer.layout && layer.layout['text-field']) {
                // 针对所有包含文本的图层设置中文字段
                try {
                  map.value.setLayoutProperty(layer.id, 'text-field', [
                    'coalesce',
                    ['get', 'name_zh-Hans'],
                    ['get', 'name_zh'],
                    ['get', 'name']
                  ])
                } catch (err) {
                  console.warn(`设置图层 ${layer.id} 中文失败:`, err)
                }
              }
            })
          }
        } catch (langErr) {
          console.warn('强制设置地图中文标签失败：', langErr)
        }

        await loadMapData()
        setupMapEvents()
        isLoading.value = false
        emit('map-ready', map.value)
      } catch (err) {
        console.error('地图内容加载失败:', err)
        error.value = {
          title: '地图内容加载失败',
          message: '无法加载地图标记和路线，请检查网络连接后重试。',
          details: err.message
        }
        isLoading.value = false
      }
    })
    
    // 地图加载错误处理
    map.value.on('error', (e) => {
      console.error('地图加载错误:', e)
      error.value = {
        title: '地图加载失败',
        message: '无法加载地图，请检查网络连接或稍后重试。',
        details: e.error?.message || '未知错误'
      }
      isLoading.value = false
    })
    
    // 视图变化事件
    map.value.on('moveend', () => {
      emit('view-change', {
        center: map.value.getCenter(),
        zoom: map.value.getZoom(),
        bounds: map.value.getBounds()
      })
    })
    
  } catch (err) {
    console.error('地图初始化失败:', err)
    error.value = {
      title: '地图初始化失败',
      message: '无法初始化地图组件，请刷新页面重试。',
      details: err.message
    }
    isLoading.value = false
  }
}

/**
 * 加载地图数据
 */
const loadMapData = async () => {
  try {
    // 并行加载节点和路线数据
    const [nodesData, routeGeoJSON] = await Promise.all([
      apiClient.getNodes(),
      apiClient.getRoute()
    ])
    
    nodes.value = nodesData
    routeData.value = routeGeoJSON
    
    // 添加数据源和图层
    addRouteLayer()
    addNodesLayer()
    
  } catch (err) {
    console.error('加载地图数据失败:', err)
    throw new Error(`数据加载失败: ${err.message}`)
  }
}

/**
 * 添加路线图层
 */
const addRouteLayer = () => {
  try {
    if (!map.value || !routeData.value) return
    
    // 添加路线数据源
    map.value.addSource('route', {
      type: 'geojson',
      data: routeData.value
    })
    
    // 添加主路线图层
    map.value.addLayer({
      id: 'route-main',
      type: 'line',
      source: 'route',
      filter: ['==', ['get', 'id'], 'main_route'],
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#dc2626',
        'line-width': [
          'interpolate',
          ['linear'],
          ['zoom'],
          5, 3,
          10, 6,
          15, 10
        ],
        'line-opacity': 0.8
      }
    })
    
    // 添加备选路线图层
    map.value.addLayer({
      id: 'route-alternative',
      type: 'line',
      source: 'route',
      filter: ['!=', ['get', 'id'], 'main_route'],
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#f59e0b',
        'line-width': [
          'interpolate',
          ['linear'],
          ['zoom'],
          5, 2,
          10, 4,
          15, 6
        ],
        'line-opacity': 0.6,
        'line-dasharray': [2, 2]
      }
    })
  } catch (err) {
    console.error('添加路线图层失败:', err)
    throw new Error(`路线图层添加失败: ${err.message}`)
  }
}

/**
 * 添加节点图层
 */
const addNodesLayer = () => {
  try {
    if (!map.value || !nodes.value.length) return
    
    // 创建节点GeoJSON数据
    const nodesGeoJSON = {
      type: 'FeatureCollection',
      features: nodes.value.map(node => {
        // 安全地获取坐标数据
        let coordinates
        if (node.coordinates && Array.isArray(node.coordinates)) {
          coordinates = node.coordinates
        } else if (node.lng !== undefined && node.lat !== undefined) {
          coordinates = [node.lng, node.lat]
        } else {
          console.warn(`节点 ${node.id} 缺少有效的坐标数据`, node)
          coordinates = [0, 0] // 默认坐标
        }
        
        return {
          type: 'Feature',
          properties: {
            ...node,
            visited: progressStore.isNodeVisited(node.id),
            current: progressStore.currentNodeId === node.id
          },
          geometry: {
            type: 'Point',
            coordinates: coordinates
          }
        }
      })
    }
    
    // 添加节点数据源
    map.value.addSource('nodes', {
      type: 'geojson',
      data: nodesGeoJSON
    })
    
    // 添加节点图层
    map.value.addLayer({
      id: 'nodes',
      type: 'circle',
      source: 'nodes',
      paint: {
        'circle-radius': [
          'case',
          ['get', 'current'], 12,
          ['get', 'visited'], 8,
          6
        ],
        'circle-color': [
          'case',
          ['get', 'current'], '#dc2626',
          ['get', 'visited'], '#059669',
          '#6b7280'
        ],
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff',
        'circle-opacity': 0.9
      }
    })
    
    // 添加节点标签图层
    map.value.addLayer({
      id: 'nodes-labels',
      type: 'symbol',
      source: 'nodes',
      layout: {
        'text-field': ['get', 'name'],
        'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
        'text-size': 12,
        'text-offset': [0, 2],
        'text-anchor': 'top'
      },
      paint: {
        'text-color': '#374151',
        'text-halo-color': '#ffffff',
        'text-halo-width': 1
      }
    })
    
  } catch (err) {
    console.error('添加节点图层失败:', err)
    throw new Error(`节点图层添加失败: ${err.message}`)
  }
}

/**
 * 设置地图事件监听
 */
const setupMapEvents = () => {
  if (!map.value) return
  
  // 节点点击事件
  map.value.on('click', 'nodes', (e) => {
    const feature = e.features[0]
    if (feature) {
      selectedNode.value = feature.properties
      emit('node-click', feature.properties)
    }
  })
  
  // 节点悬停事件
  map.value.on('mouseenter', 'nodes', (e) => {
    map.value.getCanvas().style.cursor = 'pointer'
    if (e.features[0]) {
      emit('node-hover', e.features[0].properties)
    }
  })
  
  map.value.on('mouseleave', 'nodes', () => {
    map.value.getCanvas().style.cursor = ''
  })
  
  // 路线点击事件
  map.value.on('click', 'route-main', (e) => {
    console.log('路线点击:', e.lngLat)
  })
}

/**
 * 更新节点图层数据
 */
const updateNodesLayer = () => {
  if (!map.value || !nodes.value.length) return
  
  try {
    const nodesGeoJSON = {
      type: 'FeatureCollection',
      features: nodes.value.map(node => {
        let coordinates
        if (node.coordinates && Array.isArray(node.coordinates)) {
          coordinates = node.coordinates
        } else if (node.lng !== undefined && node.lat !== undefined) {
          coordinates = [node.lng, node.lat]
        } else {
          coordinates = [0, 0]
        }
        
        return {
          type: 'Feature',
          properties: {
            ...node,
            visited: progressStore.isNodeVisited(node.id),
            current: progressStore.currentNodeId === node.id
          },
          geometry: {
            type: 'Point',
            coordinates: coordinates
          }
        }
      })
    }
    
    const source = map.value.getSource('nodes')
    if (source) {
      source.setData(nodesGeoJSON)
    }
  } catch (err) {
    console.error('更新节点图层失败:', err)
  }
}

/**
 * 飞行到指定节点
 */
const flyToNode = (nodeId) => {
  const node = nodes.value.find(n => n.id === nodeId)
  if (!node || !map.value) return
  
  let coordinates
  if (node.coordinates && Array.isArray(node.coordinates)) {
    coordinates = node.coordinates
  } else if (node.lng !== undefined && node.lat !== undefined) {
    coordinates = [node.lng, node.lat]
  } else {
    console.warn(`节点 ${nodeId} 缺少坐标数据`)
    return
  }
  
  map.value.flyTo({
    center: coordinates,
    zoom: 12,
    duration: 2000
  })
}

/**
 * 飞行到指定边界
 */
const flyToBounds = (bounds, options = {}) => {
  if (!map.value || !bounds) return
  
  map.value.fitBounds(bounds, {
    padding: 50,
    duration: 2000,
    ...options
  })
}

/**
 * 重置视图
 */
const resetView = () => {
  if (!map.value) return
  
  map.value.flyTo({
    center: props.center,
    zoom: props.zoom,
    duration: 2000
  })
}

/**
 * 切换控制面板
 */
const toggleControlPanel = () => {
  showControlPanel.value = !showControlPanel.value
  if (showControlPanel.value) {
    showLayerPanel.value = false
    showAnimationPanel.value = false
  }
}

/**
 * 切换图层面板
 */
const toggleLayerPanel = () => {
  showLayerPanel.value = !showLayerPanel.value
  if (showLayerPanel.value) {
    showControlPanel.value = false
    showAnimationPanel.value = false
  }
}

/**
 * 切换动画面板
 */
const toggleAnimationPanel = () => {
  showAnimationPanel.value = !showAnimationPanel.value
  if (showAnimationPanel.value) {
    showControlPanel.value = false
    showLayerPanel.value = false
  }
}

/**
 * 切换路线显示
 */
const toggleRouteVisibility = () => {
  if (!map.value) return
  
  showRoute.value = !showRoute.value
  
  const visibility = showRoute.value ? 'visible' : 'none'
  map.value.setLayoutProperty('route-main', 'visibility', visibility)
  map.value.setLayoutProperty('route-alternative', 'visibility', visibility)
}

/**
 * 切换卫星视图
 */
const toggleSatelliteView = () => {
  if (!map.value) return
  
  isSatelliteView.value = !isSatelliteView.value
  
  const style = isSatelliteView.value ? mapStyles.satellite : mapStyles.street
  map.value.setStyle(style)
  
  // 样式切换后重新添加数据
  map.value.once('styledata', () => {
    setTimeout(() => {
      try {
        // 在样式切换后重新应用简体中文语言
        try {
          const languageControl = new MapboxLanguage({ defaultLanguage: 'zh-Hans' })
          map.value.addControl(languageControl)
          if (typeof languageControl.setLanguage === 'function') {
            languageControl.setLanguage('zh-Hans')
          }
        } catch (langErr) {
          console.warn('样式切换后应用地图中文语言失败：', langErr)
        }
        
        addRouteLayer()
        addNodesLayer()
      } catch (err) {
        console.error('样式切换后重新添加图层失败:', err)
      }
    }, 100)
  })
}

/**
 * 切换3D视图
 */
const toggle3DView = () => {
  if (!map.value) return
  
  is3DView.value = !is3DView.value
  
  if (is3DView.value) {
    map.value.setPitch(60)
    map.value.setBearing(0)
  } else {
    map.value.setPitch(0)
    map.value.setBearing(0)
  }
}

/**
 * 切换地形视图
 */
const toggleTerrainView = () => {
  if (!map.value) return
  
  showTerrain.value = !showTerrain.value
  
  if (showTerrain.value) {
    // 添加地形数据源
    if (!map.value.getSource('mapbox-dem')) {
      map.value.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14
      })
    }
    
    // 设置地形
    map.value.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 })
  } else {
    // 移除地形
    map.value.setTerrain(null)
  }
}

/**
 * 切换图层
 */
const toggleLayer = (layerName) => {
  if (!map.value) return
  
  const layer = layers.value[layerName]
  if (!layer) return
  
  const visibility = layer.visible ? 'visible' : 'none'
  
  switch (layerName) {
    case 'route':
      map.value.setLayoutProperty('route-main', 'visibility', visibility)
      map.value.setLayoutProperty('route-alternative', 'visibility', visibility)
      break
    case 'nodes':
      map.value.setLayoutProperty('nodes', 'visibility', visibility)
      map.value.setLayoutProperty('nodes-labels', 'visibility', visibility)
      break
    case 'labels':
      // 控制地图标签显示
      break
    case 'historical':
      // 控制历史边界显示
      break
  }
}

/**
 * 更新图层透明度
 */
const updateLayerOpacity = (layerName) => {
  if (!map.value) return
  
  const layer = layers.value[layerName]
  if (!layer) return
  
  switch (layerName) {
    case 'route':
      map.value.setPaintProperty('route-main', 'line-opacity', layer.opacity)
      map.value.setPaintProperty('route-alternative', 'line-opacity', layer.opacity * 0.8)
      break
    case 'nodes':
      map.value.setPaintProperty('nodes', 'circle-opacity', layer.opacity)
      break
  }
}

/**
 * 开始路线动画
 */
const startRouteAnimation = () => {
  if (!map.value || !routeData.value || isAnimating.value) return
  
  isAnimating.value = true
  animationProgress.value = 0
  currentAnimationStep.value = 0
  
  // 实现路线动画逻辑
  console.log('开始路线动画')
}

/**
 * 停止动画
 */
const stopAnimation = () => {
  if (animationTimer.value) {
    clearInterval(animationTimer.value)
    animationTimer.value = null
  }
  
  isAnimating.value = false
  animationProgress.value = 0
  currentAnimationStep.value = 0
}

/**
 * 关闭节点信息
 */
const closeNodeInfo = () => {
  selectedNode.value = null
}

/**
 * 访问节点
 */
const visitNode = (node) => {
  progressStore.visitNode(node.id)
  updateNodesLayer()
  closeNodeInfo()
  emit('node-click', node)
}

/**
 * 显示节点故事
 */
const showNodeStory = (node) => {
  closeNodeInfo()
  // 触发故事显示事件
  eventBus.emit('show-story', node)
}

/**
 * 重试加载
 */
const retry = async () => {
  retrying.value = true
  error.value = null
  
  try {
    await initializeMap()
  } catch (err) {
    console.error('重试失败:', err)
  } finally {
    retrying.value = false
  }
}

/**
 * 关闭错误
 */
const closeError = () => {
  error.value = null
}

// 监听进度变化
watch(() => progressStore.currentNodeId, () => {
  updateNodesLayer()
})

watch(() => progressStore.visitedNodes, () => {
  updateNodesLayer()
}, { deep: true })

// 监听事件总线
eventBus.on('fly-to-node', flyToNode)
eventBus.on('fly-to-bounds', flyToBounds)

// 组件挂载
onMounted(async () => {
  await nextTick()
  if (mapContainer.value) {
    await initializeMap()
  }
})

// 组件卸载
onUnmounted(() => {
  // 停止动画
  stopAnimation()
  
  // 销毁地图实例
  if (map.value) {
    map.value.remove()
  }
  
  // 清理事件监听
  eventBus.off('fly-to-node')
  eventBus.off('fly-to-bounds')
})

// 暴露方法给父组件
defineExpose({
  flyToNode,
  flyToBounds,
  resetView,
  updateNodesLayer,
  retry,
  closeError,
  map: () => map.value
})
</script>

<style scoped>
.map-container {
  font-family: 'Inter', sans-serif;
}

/* Mapbox样式覆盖 */
:deep(.mapboxgl-ctrl-attrib) {
  display: none;
}

:deep(.mapboxgl-ctrl-logo) {
  display: none;
}

:deep(.mapboxgl-popup) {
  z-index: 1000;
}

:deep(.mapboxgl-popup-content) {
  padding: 0;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

:deep(.mapboxgl-popup-close-button) {
  display: none;
}

/* 地图控制按钮样式 */
.map-control-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.map-control-btn:hover {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

.map-control-btn.active {
  background: #dc2626;
  color: white;
}

.map-control-btn.active:hover {
  background: #b91c1c;
}

/* 控制面板样式 */
.control-panel {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  min-width: 250px;
  max-height: 400px;
  overflow-y: auto;
  margin-top: 8px;
}

.panel-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
}

/* 控制组样式 */
.control-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.control-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: #f8f9fa;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  color: #374151;
}

.control-item:hover {
  background: #e9ecef;
}

.control-item.active {
  background: #dc2626;
  color: white;
}

.control-item.active:hover {
  background: #b91c1c;
}

/* 图层管理样式 */
.layer-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.layer-item {
  background: #f8f9fa;
  border-radius: 6px;
  padding: 12px;
}

.layer-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  margin-bottom: 8px;
}

.layer-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: #dc2626;
}

.layer-opacity {
  display: flex;
  align-items: center;
  gap: 8px;
}

.layer-opacity input[type="range"] {
  flex: 1;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  outline: none;
  cursor: pointer;
}

.layer-opacity input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  background: #dc2626;
  border-radius: 50%;
  cursor: pointer;
}

/* 动画控制样式 */
.animation-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.animation-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  justify-content: center;
}

.animation-btn:first-child {
  background: #059669;
  color: white;
}

.animation-btn:first-child:hover:not(:disabled) {
  background: #047857;
}

.animation-btn:last-child {
  background: #dc2626;
  color: white;
}

.animation-btn:last-child:hover:not(:disabled) {
  background: #b91c1c;
}

.animation-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  opacity: 0.6;
}

.speed-control {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.speed-control label {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.speed-control input[type="range"] {
  width: 100%;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  outline: none;
  cursor: pointer;
}

.speed-control input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  background: #2563eb;
  border-radius: 50%;
  cursor: pointer;
}

.speed-control span {
  font-size: 12px;
  color: #6b7280;
  text-align: center;
}

.progress-control {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-control label {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #059669, #10b981);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-control span {
  font-size: 12px;
  color: #6b7280;
  text-align: center;
}

/* 按钮样式 */
.btn-primary {
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: #b91c1c;
}

.btn-secondary {
  background: #6b7280;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: #4b5563;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .map-container {
    height: 300px;
  }
  
  .control-panel {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 350px;
    max-height: 70vh;
    z-index: 1001;
  }
  
  .map-control-btn {
    width: 36px;
    height: 36px;
  }
  
  .control-item {
    padding: 8px 10px;
    font-size: 13px;
  }
  
  .layer-item {
    padding: 10px;
  }
  
  .animation-btn {
    padding: 8px 12px;
    font-size: 13px;
  }
}
</style>