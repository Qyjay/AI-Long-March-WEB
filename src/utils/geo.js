/**
 * 地理相关工具函数
 */

/**
 * 计算两点间距离（使用Haversine公式）
 * @param {number} lat1 - 第一个点的纬度
 * @param {number} lng1 - 第一个点的经度
 * @param {number} lat2 - 第二个点的纬度
 * @param {number} lng2 - 第二个点的经度
 * @returns {number} 距离（公里）
 */
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371 // 地球半径（公里）
  const dLat = toRadians(lat2 - lat1)
  const dLng = toRadians(lng2 - lng1)
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * 角度转弧度
 * @param {number} degrees - 角度
 * @returns {number} 弧度
 */
const toRadians = (degrees) => {
  return degrees * (Math.PI / 180)
}

/**
 * 弧度转角度
 * @param {number} radians - 弧度
 * @returns {number} 角度
 */
export const toDegrees = (radians) => {
  return radians * (180 / Math.PI)
}

/**
 * 计算两点间的方位角
 * @param {number} lat1 - 起点纬度
 * @param {number} lng1 - 起点经度
 * @param {number} lat2 - 终点纬度
 * @param {number} lng2 - 终点经度
 * @returns {number} 方位角（度）
 */
export const calculateBearing = (lat1, lng1, lat2, lng2) => {
  const dLng = toRadians(lng2 - lng1)
  const lat1Rad = toRadians(lat1)
  const lat2Rad = toRadians(lat2)
  
  const y = Math.sin(dLng) * Math.cos(lat2Rad)
  const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) -
    Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLng)
  
  const bearing = toDegrees(Math.atan2(y, x))
  return (bearing + 360) % 360
}

/**
 * 检查点是否在边界框内
 * @param {number} lat - 纬度
 * @param {number} lng - 经度
 * @param {object} bounds - 边界框 {north, south, east, west}
 * @returns {boolean} 是否在边界内
 */
export const isPointInBounds = (lat, lng, bounds) => {
  return lat >= bounds.south && lat <= bounds.north &&
         lng >= bounds.west && lng <= bounds.east
}

/**
 * 获取多个点的边界框
 * @param {Array} points - 点数组 [{lat, lng}, ...]
 * @returns {object} 边界框 {north, south, east, west}
 */
export const getBounds = (points) => {
  if (!points || points.length === 0) {
    return null
  }
  
  let north = points[0].lat
  let south = points[0].lat
  let east = points[0].lng
  let west = points[0].lng
  
  points.forEach(point => {
    north = Math.max(north, point.lat)
    south = Math.min(south, point.lat)
    east = Math.max(east, point.lng)
    west = Math.min(west, point.lng)
  })
  
  return { north, south, east, west }
}

/**
 * 格式化坐标显示
 * @param {number} lat - 纬度
 * @param {number} lng - 经度
 * @param {number} precision - 精度（小数位数）
 * @returns {string} 格式化的坐标字符串
 */
export const formatCoordinates = (lat, lng, precision = 4) => {
  const latDir = lat >= 0 ? 'N' : 'S'
  const lngDir = lng >= 0 ? 'E' : 'W'
  
  return `${Math.abs(lat).toFixed(precision)}°${latDir}, ${Math.abs(lng).toFixed(precision)}°${lngDir}`
}

/**
 * 中国地图的默认视图配置
 */
export const CHINA_VIEW = {
  center: [105, 31.5],
  zoom: 3.4,
  pitch: 45,
  bearing: -15
}

/**
 * 计算多个点的边界框（getBounds的别名）
 * @param {Array} points - 点数组 [{lat, lng}, ...]
 * @returns {object} 边界框 {north, south, east, west}
 */
export const calculateBounds = getBounds

/**
 * 长征路线的大致边界
 */
export const LONG_MARCH_BOUNDS = {
  north: 36.5,
  south: 24.5,
  east: 120,
  west: 100
}