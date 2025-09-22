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
import AMapLoader from '@amap/amap-jsapi-loader'
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useProgressStore } from '../stores/progress'
import { apiClient } from '../api'
import { eventBus } from '../utils/bus'
import { calculateDistance, calculateBounds } from '../utils/geo'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import ErrorMessage from '../components/ErrorMessage.vue'

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
const map = ref(null) // 高德地图实例
const AMap = ref(null) // 高德地图类引用
const isLoading = ref(true)
const selectedNode = ref(null)
const hoveredNode = ref(null) // 当前悬停的节点
const showNodeInfo = ref(false) // 是否显示节点信息弹窗
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
 * 初始化高德地图
 */
const initializeMap = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    // 验证高德地图API key
    const apiKey = import.meta.env.VITE_AMAP_KEY
    const securityCode = import.meta.env.VITE_AMAP_SECURITY_CODE
    
    if (!apiKey) {
      throw new Error('高德地图API Key未配置，请在.env文件中设置VITE_AMAP_KEY')
    }
    
    // 加载高德地图API
    const AMapClass = await AMapLoader.load({
      key: apiKey,
      version: '2.0',
      plugins: [
        'AMap.Scale',
        'AMap.ToolBar', 
        'AMap.Marker',
        'AMap.InfoWindow',
        'AMap.Polyline',
        'AMap.Polygon',
        'AMap.CircleMarker'
      ],
      AMapUI: {
        version: '1.1',
        plugins: []
      },
      Loca: {
        version: '2.0'
      }
    })
    
    AMap.value = AMapClass
    
    // 设置安全密钥
    if (securityCode) {
      AMapClass._securityConfig = {
        securityJsCode: securityCode
      }
    }
    
    // 创建地图实例
    const mapInstance = new AMapClass.Map(mapContainer.value, {
      zoom: props.zoom,
      center: props.center,
      mapStyle: isSatelliteView.value ? 'amap://styles/satellite' : 'amap://styles/normal',
      viewMode: '2D',
      lang: 'zh_cn'
    })
    
    // 添加比例尺控件
    const scale = new AMapClass.Scale({
      position: 'LB'
    })
    mapInstance.addControl(scale)
    
    // 添加工具条控件
    const toolbar = new AMapClass.ToolBar({
      position: 'RT'
    })
    mapInstance.addControl(toolbar)
    
    map.value = mapInstance
    
    // 地图加载完成事件
    mapInstance.on('complete', async () => {
      try {
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
    
    // 视图变化事件
    mapInstance.on('moveend', () => {
      emit('view-change', {
        center: mapInstance.getCenter(),
        zoom: mapInstance.getZoom(),
        bounds: mapInstance.getBounds()
      })
    })
    
    console.log('高德地图初始化成功')
    
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
 * 从API获取路线和节点数据并添加到地图
 */
const loadMapData = async () => {
  try {
    console.log('开始加载地图数据...')
    
    // 获取路线数据
    const routeDataResponse = await apiClient.getRoute()
    
    if (routeDataResponse) {
      // 处理GeoJSON格式的路线数据
      if (routeDataResponse.type === 'FeatureCollection' && routeDataResponse.features) {
        // 提取主路线的坐标
        const mainRoute = routeDataResponse.features.find(feature => 
          feature.properties && feature.properties.id === 'main_route'
        )
        
        if (mainRoute && mainRoute.geometry && mainRoute.geometry.coordinates) {
          console.log('路线数据加载成功，坐标点数量:', mainRoute.geometry.coordinates.length)
          routeData.value = {
            coordinates: mainRoute.geometry.coordinates,
            properties: mainRoute.properties
          }
          
          // 添加路线图层
          addRouteLayer()
        } else {
          console.warn('未找到主路线数据')
        }
      } else if (routeDataResponse.coordinates && routeDataResponse.coordinates.length > 0) {
        // 处理简单格式的路线数据
        console.log('路线数据加载成功，坐标点数量:', routeDataResponse.coordinates.length)
        routeData.value = routeDataResponse
        
        // 添加路线图层
        addRouteLayer()
      } else {
        console.warn('路线数据格式不正确')
      }
    } else {
      console.warn('路线数据为空')
    }
    
    // 获取节点数据
    const nodesDataResponse = await apiClient.getNodes()
    
    if (nodesDataResponse && Array.isArray(nodesDataResponse) && nodesDataResponse.length > 0) {
      console.log('节点数据加载成功，节点数量:', nodesDataResponse.length)
      nodes.value = nodesDataResponse
      
      // 添加节点图层
      addNodesLayer()
    } else {
      console.warn('节点数据为空或格式不正确')
    }
    
    console.log('地图数据加载完成')
    
  } catch (err) {
    console.error('加载地图数据失败:', err)
    throw new Error(`数据加载失败: ${err.message}`)
  }
}

/**
 * 添加路线图层到地图
 * 使用高德地图Polyline创建路线可视化
 */
const routePolyline = ref(null) // 路线折线对象

const addRouteLayer = () => {
  try {
    if (!map.value || !routeData.value || !routeData.value.coordinates || routeData.value.coordinates.length === 0) {
      console.warn('地图实例或路线数据无效，无法添加路线图层')
      return
    }
    
    // 转换坐标格式为高德地图格式 [lng, lat]
    const path = routeData.value.coordinates.map(coord => [coord[0], coord[1]])
    
    // 如果已存在路线，先移除
    if (routePolyline.value) {
      map.value.remove(routePolyline.value)
    }
    
    // 创建路线折线
    routePolyline.value = new AMap.value.Polyline({
      path: path,
      strokeColor: '#dc2626', // 线条颜色
      strokeWeight: 4, // 线条宽度
      strokeOpacity: 0.8, // 线条透明度
      strokeStyle: 'solid', // 线条样式
      lineJoin: 'round', // 折线拐点连接处样式
      lineCap: 'round', // 折线两端线帽的绘制样式
      zIndex: 50
    })
    
    // 添加到地图
    map.value.add(routePolyline.value)
    
    console.log('路线图层添加成功')
    
  } catch (err) {
    console.error('添加路线图层失败:', err)
    throw new Error(`路线图层添加失败: ${err.message}`)
  }
}

/**
 * 添加节点图层
 * 使用高德地图Marker创建节点标记
 */
const nodeMarkers = ref([]) // 节点标记数组

const addNodesLayer = () => {
  try {
    if (!map.value || !nodes.value.length) return
    
    // 清除已存在的标记
    nodeMarkers.value.forEach(marker => {
      map.value.remove(marker)
    })
    nodeMarkers.value = []
    
    // 为每个节点创建标记
    nodes.value.forEach(node => {
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
      
      // 根据节点状态确定标记样式
      const isVisited = progressStore.isNodeVisited(node.id)
      const isCurrent = progressStore.currentNodeId === node.id
      
      let markerColor = '#6b7280' // 默认灰色
      let markerSize = 12
      
      if (isCurrent) {
        markerColor = '#dc2626' // 当前节点红色
        markerSize = 16
      } else if (isVisited) {
        markerColor = '#059669' // 已访问节点绿色
        markerSize = 14
      }
      
      // 创建标记点
      const marker = new AMap.value.Marker({
        position: coordinates,
        title: node.name,
        content: `<div style="
          width: ${markerSize}px;
          height: ${markerSize}px;
          background-color: ${markerColor};
          border: 2px solid #ffffff;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          cursor: pointer;
        "></div>`,
        anchor: 'center',
        zIndex: 100
      })
      
      // 创建信息窗体
      const infoWindow = new AMap.value.InfoWindow({
        content: `
          <div style="padding: 12px; min-width: 200px; font-family: 'Inter', sans-serif;">
            <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px; font-weight: 600;">${node.name}</h3>
            <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">日期: ${node.date || '未知'}</p>
            <p style="margin: 8px 0 0 0; color: #374151; font-size: 14px; line-height: 1.4;">${node.description || '暂无描述'}</p>
          </div>
        `,
        anchor: 'bottom-center',
        offset: [0, -10]
      })
      
      // 添加点击事件
      marker.on('click', () => {
        selectedNode.value = node
        infoWindow.open(map.value, marker.getPosition())
        emit('node-click', node)
      })
      
      // 添加鼠标悬停事件
      marker.on('mouseover', () => {
        hoveredNode.value = node
        marker.setContent(`<div style="
          width: ${markerSize + 4}px;
          height: ${markerSize + 4}px;
          background-color: ${markerColor};
          border: 3px solid #ffffff;
          border-radius: 50%;
          box-shadow: 0 4px 8px rgba(0,0,0,0.4);
          cursor: pointer;
          transform: scale(1.1);
        "></div>`)
        emit('node-hover', node)
      })
      
      marker.on('mouseout', () => {
        hoveredNode.value = null
        marker.setContent(`<div style="
          width: ${markerSize}px;
          height: ${markerSize}px;
          background-color: ${markerColor};
          border: 2px solid #ffffff;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          cursor: pointer;
        "></div>`)
      })
      
      // 添加到地图
      map.value.add(marker)
      nodeMarkers.value.push(marker)
    })
    
    console.log('节点图层添加成功，节点数量:', nodeMarkers.value.length)
    
  } catch (err) {
    console.error('添加节点图层失败:', err)
    throw new Error(`节点图层添加失败: ${err.message}`)
  }
}

/**
 * 设置地图事件监听
 * 包括地图点击、拖拽等基础交互事件
 */
const setupMapEvents = () => {
  if (!map.value) return
  
  // 地图点击事件（点击空白区域关闭信息窗体）
  map.value.on('click', (e) => {
    // 检查是否点击在标记上，如果不是则关闭所有信息窗体
    selectedNode.value = null
    showNodeInfo.value = false
    
    emit('map-click', {
      lngLat: e.lnglat,
      pixel: e.pixel
    })
  })
  
  // 地图拖拽开始事件
  map.value.on('dragstart', () => {
    emit('map-drag-start')
  })
  
  // 地图拖拽结束事件
  map.value.on('dragend', () => {
    emit('map-drag-end', {
      center: map.value.getCenter(),
      zoom: map.value.getZoom(),
      bounds: map.value.getBounds()
    })
  })
  
  // 地图缩放事件
  map.value.on('zoomend', () => {
    emit('map-zoom', {
      zoom: map.value.getZoom(),
      center: map.value.getCenter()
    })
  })
  
  // 地图移动结束事件
  map.value.on('moveend', () => {
    emit('view-change', {
      center: map.value.getCenter(),
      zoom: map.value.getZoom(),
      bounds: map.value.getBounds()
    })
  })
  
  console.log('地图事件监听设置完成')
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
  
  // 使用高德地图的平滑移动
  map.value.setZoomAndCenter(12, coordinates, false, 2000)
}

/**
 * 飞行到指定边界
 */
const flyToBounds = (bounds, options = {}) => {
  if (!map.value || !bounds) return
  
  // 转换边界格式为高德地图格式
  const amapBounds = new AMap.value.Bounds(
    [bounds[0], bounds[1]], // 西南角
    [bounds[2], bounds[3]]  // 东北角
  )
  
  map.value.setBounds(amapBounds, false, [20, 20, 20, 20], 2000)
}

/**
 * 重置视图
 */
const resetView = () => {
  if (!map.value) return
  
  // 使用高德地图的平滑移动到初始位置
  map.value.setZoomAndCenter(props.zoom, props.center, false, 1500)
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
 * 显示路线图层
 */
const showRouteLayer = () => {
  if (!map.value || !routePolyline.value) return
  
  try {
    routePolyline.value.show()
    showRoute.value = true
    emit('route-visibility-change', true)
  } catch (err) {
    console.error('显示路线图层失败:', err)
  }
}

/**
 * 隐藏路线图层
 */
const hideRouteLayer = () => {
  if (!map.value || !routePolyline.value) return
  
  try {
    routePolyline.value.hide()
    showRoute.value = false
    emit('route-visibility-change', false)
  } catch (err) {
    console.error('隐藏路线图层失败:', err)
  }
}

/**
 * 切换路线显示
 */
const toggleRouteVisibility = () => {
  if (showRoute.value) {
    hideRouteLayer()
  } else {
    showRouteLayer()
  }
}

/**
 * 切换地图样式
 * 在不同的地图样式之间切换
 */
const toggleMapStyle = (styleName) => {
  if (!map.value) return
  
  let mapStyle = 'amap://styles/normal' // 默认标准样式
  
  switch (styleName) {
    case 'satellite':
      mapStyle = 'amap://styles/satellite'
      break
    case 'dark':
      mapStyle = 'amap://styles/dark'
      break
    case 'light':
      mapStyle = 'amap://styles/light'
      break
    case 'fresh':
      mapStyle = 'amap://styles/fresh'
      break
    default:
      mapStyle = 'amap://styles/normal'
  }
  
  map.value.setMapStyle(mapStyle)
  emit('style-change', styleName)
}

/**
 * 切换卫星视图
 * 在标准地图和卫星地图之间切换
 */
const toggleSatelliteView = () => {
  isSatelliteView.value = !isSatelliteView.value
  const styleName = isSatelliteView.value ? 'satellite' : 'normal'
  toggleMapStyle(styleName)
  emit('satellite-toggle', isSatelliteView.value)
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
  try {
    // 停止动画
    stopAnimation()
    
    // 清理节点标记
    if (nodeMarkers.value && nodeMarkers.value.length > 0) {
      nodeMarkers.value.forEach(marker => {
        if (map.value) {
          map.value.remove(marker)
        }
      })
      nodeMarkers.value = []
    }
    
    // 清理路线
    if (routePolyline.value && map.value) {
      map.value.remove(routePolyline.value)
      routePolyline.value = null
    }
    
    // 销毁地图实例
    if (map.value) {
      map.value.destroy()
      map.value = null
    }
    
    // 清理AMap引用
    AMap.value = null
    
    console.log('地图组件清理完成')
    
  } catch (err) {
    console.error('地图组件清理失败:', err)
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
  toggleSatelliteView,
  toggleRouteVisibility,
  toggleMapStyle,
  showRouteLayer,
  hideRouteLayer,
  addNodesLayer,
  addRouteLayer,
  updateNodesLayer,
  retry,
  closeError,
  getMapInstance: () => map.value,
  getAMapClass: () => AMap.value,
  getCurrentView: () => ({
    center: map.value?.getCenter(),
    zoom: map.value?.getZoom(),
    bounds: map.value?.getBounds()
  }),
  getSelectedNode: () => selectedNode.value,
  getHoveredNode: () => hoveredNode.value
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