<template>
  <div class="map-container relative w-full h-full">
    <!-- 地图容器 -->
    <div ref="mapContainer" class="w-full h-full" @contextmenu.prevent></div>

    <!-- 左下角小精灵 -->
    <SpriteAssistant />
    
    <!-- 加载状态 -->
    <LoadingSpinner v-if="isLoading" :message="'加载地图中...'" class="absolute inset-0 z-30" />

    <div>
    <!-- 地图和剧情节点 -->
    <button @click="finishAllNodes">完成所有节点</button>

    <!-- 成就弹窗：始终挂载，靠事件控制显示 -->
<Achievement ref="achievementRef" /></div>
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
import NodeDialog from './NodeDialog.vue';
import AchievementPopup from './AchievementPopup.vue';
import SpriteAssistant from './SpriteAssistant.vue'
import Achievement from './Achievement.vue'

const achievementData = ref({ title: '', description: '' });

/**
 * 地图视图组件
 * 负责显示Mapbox地图、长征路线和节点标记
 */


const showAchievement = ref(false);

const finishAllNodes = () => {
  // 所有剧情节点完成后显示成就
  showAchievement.value = true;
};
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
const nodes = ref([])
const routeData = ref(null)
const error = ref(null)
const retrying = ref(false)
const markerClicked = ref(false) // 标记是否点击了标记
const scale = 5000; // 地图坐标缩放
const lngOffset = 116.4;
const latOffset = 39.91;
const nodeMarkers = ref([]) // 节点标记数组
const openNode = (node) => {
  selectedNode.value = node;
};



onMounted(async () => {
  try {
    const res = await apiClient.getNodes();
    nodes.value = res.data;
  } catch (error) {
    console.error('获取节点数据失败:', error);
    // 设置错误状态
    error.value = {
      title: '数据加载失败',
      message: '无法获取节点数据，请检查网络连接后重试。',
      details: error.message
    };
  }
});


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
      mapStyle: 'amap://styles/normal',
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

const addNodesLayer = () => {
  try {
    if (!map.value || !nodes.value.length) return

    // 清除已存在的标记
    nodeMarkers.value.forEach(marker => map.value.remove(marker))
    nodeMarkers.value = []

    nodes.value.forEach(node => {
      let coordinates = node.coordinates?.length ? node.coordinates : [node.lng || 0, node.lat || 0]

      const isVisited = progressStore.isNodeVisited(node.id)
      const isCurrent = progressStore.currentNodeId === node.id && !isVisited

      // 状态判定
      let markerColor = isVisited ? '#059669' : isCurrent ? '#dc2626' : '#6b7280'
      let markerSize = isVisited ? 14 : isCurrent ? 16 : 12

      const marker = new AMap.value.Marker({
        position: coordinates,
        title: node.name,
        content: `<div style="
          width: ${markerSize}px;
          height: ${markerSize}px;
          background-color: ${markerColor};
          border: 2px solid #fff;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          cursor: pointer;
        "></div>`,
        anchor: 'center',
        zIndex: 100
      })

      // 点击事件
      marker.on('click', (e) => {
  markerClicked.value = true
  emit('node-click', node, e)

  marker.on('click', () => {
  if (node.id === 'wuqizheng') {
    progressStore.markNodeVisited(node.id)
    progressStore.currentNodeId = null
    addNodesLayer() // 更新颜色

    // 触发成就弹窗
    eventBus.emit('show-achievement', { title: '吴起镇会师', description: '完成吴起镇节点互动！' })
  }
})
})

      // 鼠标悬停效果
      marker.on('mouseover', () => {
        hoveredNode.value = node
        marker.setContent(`<div style="
          width: ${markerSize + 4}px;
          height: ${markerSize + 4}px;
          background-color: ${markerColor};
          border: 3px solid #fff;
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
          border: 2px solid #fff;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          cursor: pointer;
        "></div>`)
      })

      map.value.add(marker)
      nodeMarkers.value.push(marker)
    })
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
  
  // 地图点击事件（点击空白区域关闭节点选择）
  map.value.on('click', (e) => {
    // 检查是否点击在标记上，如果不是则清除选中的节点
    if (!markerClicked.value) {
      selectedNode.value = null
      showNodeInfo.value = false
    }
    
    // 延迟重置标记点击状态，确保标记点击事件完全处理完毕
    setTimeout(() => {
      markerClicked.value = false
    }, 10)
    
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