<template>
  <div class="timeline-container" v-show="isVisible">
    <transition name="slide-up">
      <div v-show="isVisible" class="timeline-wrapper">
        <div class="timeline-steps">
          <div v-for="(node, index) in timelineNodes" :key="node.id" class="timeline-step" :class="{
            'active': index === activeStep,
            'completed': progressStore.isNodeVisited(node.id),
            'current': progressStore.currentNodeId === node.id
          }" @click="handleStepClick(node, index)">
            <div class="step-icon">
              <i v-if="progressStore.isNodeVisited(node.id)" class="icon-check">✓</i>
              <i v-else-if="progressStore.currentNodeId === node.id" class="icon-current">●</i>
              <span v-else class="step-number">{{ index + 1 }}</span>
            </div>
            <div class="step-content">
              <div class="step-title">{{ node.name_zh }}</div>
              <div class="step-subtitle">{{ node.time || '长征途中' }}</div>
            </div>
          </div>
        </div>

        <!-- 关闭按钮 -->
        <button class="close-btn" @click="hide" title="关闭时间轴">
          <i class="icon-close">×</i>
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useProgressStore } from '@/stores/progress'
import { useRouter } from 'vue-router'

/**
 * 时间轴交互组件
 * 参考ChangZheng项目的timeline设计，提供步骤条式的历史节点导航
 */

// Props
const props = defineProps({
  nodes: {
    type: Array,
    default: () => []
  },
  visible: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['node-select', 'close'])

// Stores
const progressStore = useProgressStore()
const router = useRouter()

// State
const isVisible = ref(props.visible)
const activeStep = ref(0)

// Computed
const timelineNodes = computed(() => {
  return props.nodes.map(node => ({
    ...node,
    time: getNodeTime(node.id) // 根据节点ID获取对应的历史时间
  }))
})

/**
 * 获取节点对应的历史时间
 * @param {string} nodeId - 节点ID
 * @returns {string} 历史时间
 */
function getNodeTime(nodeId) {
  const timeMap = {
    'ruijin': '1934年10月',
    'xiangjiang': '1934年11月',
    'zunyi': '1935年1月',
    'chishui': '1935年1-4月',
    'jinsha': '1935年5月',
    'luding': '1935年5月',
    'jiajin': '1935年6月',
    'maogai': '1935年8月',
    'lazikou': '1935年9月',
    'wuqi': '1935年10月'
  }
  return timeMap[nodeId] || '长征途中'
}

/**
 * 处理步骤点击事件
 * @param {Object} node - 节点数据
 * @param {number} index - 步骤索引
 */
function handleStepClick(node, index) {
  activeStep.value = index

  // 发射节点选择事件
  emit('node-select', node)

  // 如果在地图页面，直接飞行到节点
  if (router.currentRoute.value.path === '/map') {
    // 通过事件总线或直接调用地图组件的方法
    window.dispatchEvent(new CustomEvent('flyToNode', {
      detail: { nodeId: node.id, zoom: 12 }
    }))
  } else {
    // 如果不在地图页面，导航到地图页面并设置当前节点
    progressStore.setCurrentNode(node.id)
    router.push('/map')
  }
}

/**
 * 显示时间轴
 */
function show() {
  isVisible.value = true
}

/**
 * 隐藏时间轴
 */
function hide() {
  isVisible.value = false
  emit('close')
}

/**
 * 切换时间轴显示状态
 */
function toggle() {
  isVisible.value = !isVisible.value
  if (!isVisible.value) {
    emit('close')
  }
}

// Watch
watch(() => props.visible, (newVal) => {
  isVisible.value = newVal
})

watch(() => progressStore.currentNodeId, (newNodeId) => {
  if (newNodeId) {
    const index = timelineNodes.value.findIndex(node => node.id === newNodeId)
    if (index !== -1) {
      activeStep.value = index
    }
  }
})

// Expose methods
defineExpose({
  show,
  hide,
  toggle
})
</script>

<style scoped>
.timeline-container {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  pointer-events: none;
}

.timeline-wrapper {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px 12px 0 0;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
  padding: 20px 60px 20px 20px;
  pointer-events: auto;
  position: relative;
  max-width: 90vw;
  overflow-x: auto;
}

.timeline-steps {
  display: flex;
  gap: 16px;
  align-items: center;
  min-width: max-content;
}

.timeline-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 8px;
  border-radius: 8px;
  min-width: 100px;
  position: relative;
}

.timeline-step:hover {
  background: rgba(59, 130, 246, 0.1);
  transform: translateY(-2px);
}

.timeline-step.active {
  background: rgba(59, 130, 246, 0.15);
}

.timeline-step.completed .step-icon {
  background: #10b981;
  color: white;
}

.timeline-step.current .step-icon {
  background: #f59e0b;
  color: white;
  animation: pulse 2s infinite;
}

.step-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #e5e7eb;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 8px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.timeline-step:hover .step-icon {
  border-color: #3b82f6;
}

.step-content {
  text-align: center;
}

.step-title {
  font-size: 12px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 2px;
  line-height: 1.2;
}

.step-subtitle {
  font-size: 10px;
  color: #6b7280;
  line-height: 1.2;
}

.close-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(107, 114, 128, 0.1);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  color: #6b7280;
  font-size: 18px;
  font-weight: bold;
}

.close-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

/* 动画 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

@keyframes pulse {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .timeline-wrapper {
    padding: 16px 50px 16px 16px;
  }

  .timeline-steps {
    gap: 12px;
  }

  .timeline-step {
    min-width: 80px;
    padding: 6px;
  }

  .step-icon {
    width: 30px;
    height: 30px;
    font-size: 12px;
  }

  .step-title {
    font-size: 11px;
  }

  .step-subtitle {
    font-size: 9px;
  }
}
</style>