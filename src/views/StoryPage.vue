<template>
  <div class="history-stories-page">
    <!-- 页面头部标题 -->
    <header class="page-header">
      <div class="header-content">
        <h1 class="main-title">
          历史故事
        </h1>
        <p class="subtitle">
          重温红色记忆，传承革命精神
        </p>
      </div>
      <div class="header-decoration" />
    </header>

    <!-- 轮播图区域 -->
    <section
      v-if="featuredStories.length"
      class="carousel-section"
    >
      <div
        ref="carouselRef"
        class="carousel-wrapper"
      >
        <div
          class="carousel-track"
          :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
        >
          <div
            v-for="story in featuredStories"
            :key="story.id"
            class="carousel-slide img-title"
            @click="openStory(story)"
          >
            <div class="slide-image">
              <img
                v-if="resolveImage(story.image)"
                :src="resolveImage(story.image)"
                :alt="story.title"
              >
              <div
                v-else
                class="slide-placeholder"
              >
                📖
              </div>
            </div>
            <div class="slide-title">
              {{ story.title }}
            </div>
          </div>
        </div>

        <!-- 轮播指示器 -->
        <div class="carousel-indicators">
          <button
            v-for="(_, index) in featuredStories"
            :key="index"
            :class="['indicator', { active: index === currentSlide }]"
            @click="goToSlide(index)"
          />
        </div>

        <!-- 轮播控制按钮 -->
        <button
          class="carousel-btn prev"
          @click="prevSlide"
        >
          ‹
        </button>
        <button
          class="carousel-btn next"
          @click="nextSlide"
        >
          ›
        </button>
      </div>
    </section>

    <!-- 故事列表 -->
    <section class="stories-list-section">
      <h2 class="section-title">
        全部故事
      </h2>
      <div
        v-if="stories.length"
        class="stories-grid"
      >
        <div
          v-for="story in stories"
          :key="story.id"
          class="story-card"
          @click="openStory(story)"
        >
          <div class="story-content">
            <h3 class="story-title">
              {{ story.title }}
            </h3>
            <p class="story-excerpt">
              {{ getExcerpt(story.content, 100) }}
            </p>
            <span class="read-more">阅读全文 →</span>
          </div>
        </div>
      </div>
      <div
        v-else
        class="empty-state"
      >
        <p>暂无历史故事</p>
      </div>
    </section>

    <!-- 故事详情弹窗 -->
    <StoryDetailModal
      v-if="selectedStory"
      :story="selectedStory"
      @close="closeStory"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import storiesData from '@/data/stories.mock.json'
import OkPng from '@/data/ok.png'

// 导入已知的历史故事图片
const storyImages = {
  'ruijinchufa': new URL('@/data/ruijinchufa.png', import.meta.url).href,
  'yuduheye': new URL('@/data/yuduheye.png', import.meta.url).href,
  'bantiaobeizi': new URL('@/data/bantiaobeizi.png', import.meta.url).href,
  'wuzhuangudu': new URL('@/data/ok.png', import.meta.url).href, // 使用占位图
  'qiaodujinsha': new URL('@/data/ok.png', import.meta.url).href, // 使用占位图
  'yihaijiemeng': new URL('@/data/ok.png', import.meta.url).href, // 使用占位图
  'feiduoluding': new URL('@/data/ok.png', import.meta.url).href, // 使用占位图
  'jiugechuishi': new URL('@/data/ok.png', import.meta.url).href, // 使用占位图
  'jueqianghongjun': new URL('@/data/ok.png', import.meta.url).href, // 使用占位图
  'qigenhuochai': new URL('@/data/ok.png', import.meta.url).href, // 使用占位图
  'bandaiganliang': new URL('@/data/ok.png', import.meta.url).href, // 使用占位图
  'zuokuangguoqiao': new URL('@/data/ok.png', import.meta.url).href, // 使用占位图
  'pengdehuaima': new URL('@/data/ok.png', import.meta.url).href, // 使用占位图
  'fanyuejiajin': new URL('@/data/ok.png', import.meta.url).href, // 使用占位图
  'nvzhanshijian': new URL('@/data/ok.png', import.meta.url).href, // 使用占位图
  'zhangsidechong': new URL('@/data/ok.png', import.meta.url).href, // 使用占位图
  'liucaixiang': new URL('@/data/ok.png', import.meta.url).href, // 使用占位图
  'yidaiganliang': new URL('@/data/ok.png', import.meta.url).href, // 使用占位图
  'helongdiaoyu': new URL('@/data/ok.png', import.meta.url).href, // 使用占位图
  'yiwanzi': new URL('@/data/ok.png', import.meta.url).href // 使用占位图
}
import StoryDetailModal from '@/components/StoryDetailModal.vue'

// 路由
const router = useRouter()

// 状态
const stories = ref([])
const currentSlide = ref(0)
const selectedStory = ref(null)
const carouselRef = ref(null)

let autoPlayInterval = null

// 计算属性
const featuredStories = computed(() => stories.value.slice(0, 3))

/**
 * 返回上一页
 */
const goBack = () => {
  router.back()
}

/**
 * 加载本地故事列表（纯前端，不调用后端）
 * 从 src/data/stories.mock.json 读取并写入页面状态
 */
const loadStories = async () => {
  try {
    const data = storiesData
    stories.value = Array.isArray(data?.stories) ? data.stories : []
  } catch (error) {
    console.error('加载本地故事失败:', error)
    stories.value = []
  }
}

/**
 * 解析图片占位符为实际资源地址
 * 支持：
 * - 'ok'：映射为 src/data/ok.png 占位图
 * - 以 'http' 或 '/' 开头的路径：原样返回（用于公共资源）
 * - 本地图片文件名：自动添加.png后缀并从src/data目录加载
 * - 其他值或空值：返回空串表示无图
 */
const resolveImage = (image) => {
  if (!image) return ''
  if (image === 'ok') return OkPng
  if (typeof image === 'string' && (image.startsWith('http') || image.startsWith('/'))) return image
  // 检查是否是我们预导入的图片
  if (storyImages[image]) {
    return storyImages[image]
  }
  // 尝试动态导入其他本地图片
  if (typeof image === 'string' && image.length > 0) {
    try {
      return new URL(`../data/${image}.png`, import.meta.url).href
    } catch (error) {
      console.warn(`图片加载失败: ${image}.png`, error)
      return ''
    }
  }
  return ''
}

/**
 * 打开故事详情
 */
const openStory = (story) => {
  selectedStory.value = story
}

/**
 * 关闭故事详情
 */
const closeStory = () => {
  selectedStory.value = null
}

/**
 * 获取文本摘要
 */
const getExcerpt = (text, maxLength) => {
  if (!text) return ''
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
}

/**
 * 轮播控制
 */
/**
 * 切换到下一张轮播图
 */
const nextSlide = () => {
  if (!featuredStories.value.length) return
  currentSlide.value = (currentSlide.value + 1) % featuredStories.value.length
}

/**
 * 切换到上一张轮播图
 */
const prevSlide = () => {
  if (!featuredStories.value.length) return
  currentSlide.value =
    (currentSlide.value - 1 + featuredStories.value.length) %
    featuredStories.value.length
}

/**
 * 跳转到指定轮播索引
 */
const goToSlide = (index) => {
  if (!featuredStories.value.length) return
  currentSlide.value = index
}

/**
 * 自动轮播
 */
const startAutoPlay = () => {
  autoPlayInterval = setInterval(nextSlide, 5000)
}

const stopAutoPlay = () => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
    autoPlayInterval = null
  }
}

// 生命周期
onMounted(() => {
  loadStories()
  setTimeout(() => {
    if (featuredStories.value.length > 1) startAutoPlay()
  }, 0)
})

onUnmounted(() => {
  stopAutoPlay()
})
</script>

<style scoped>
.history-stories-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a0a0a 0%, #2d1810 50%, #1a0a0a 100%);
  color: #f5f5f5;
  position: relative;
  overflow-x: hidden;
}

/* 页面头部 */
.page-header {
  position: relative;
  padding: 60px 24px 40px;
  text-align: center;
  background: linear-gradient(180deg, rgba(139, 0, 0, 0.9) 0%, rgba(139, 0, 0, 0.7) 70%, transparent 100%);
  border-bottom: 3px solid #d4af37;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.header-content {
  position: relative;
  z-index: 2;
}

.main-title {
  font-size: 48px;
  font-weight: 800;
  margin: 0 0 16px 0;
  color: #ffffff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  letter-spacing: 4px;
  background: linear-gradient(45deg, #ffffff, #f1e1a6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 18px;
  color: #f1e1a6;
  margin: 0;
  font-weight: 300;
  letter-spacing: 2px;
  opacity: 0.9;
}

.header-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 30%, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(139, 0, 0, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

/* 轮播图区域 */
.carousel-section {
  padding: 40px 24px;
  max-width: 1280px;
  margin: 0 auto;
  position: relative;
}

.carousel-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #d4af37, transparent);
}

.carousel-wrapper {
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(139, 0, 0, 0.8) 0%, rgba(45, 24, 16, 0.9) 100%);
  border: 2px solid #d4af37;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.carousel-track {
  display: flex;
  transition: transform 0.5s ease;
}

.carousel-slide.img-title {
  min-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.carousel-slide.img-title::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.7) 100%);
  z-index: 1;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.carousel-slide.img-title:hover::before {
  opacity: 0.9;
}

.carousel-slide.img-title:hover {
  transform: scale(1.02);
}

.slide-image {
  width: 100%;
  height: 320px;
  overflow: hidden;
  background: linear-gradient(135deg, #2d1810 0%, #1a0a0a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.slide-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.carousel-slide.img-title:hover .slide-image img {
  transform: scale(1.1);
}

.slide-placeholder {
  font-size: 64px;
  opacity: 0.8;
  color: #d4af37;
  text-shadow: 0 0 20px rgba(212, 175, 55, 0.5);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.8; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
}

.slide-title {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24px;
  font-size: 28px;
  font-weight: 800;
  color: #ffffff;
  text-align: center;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.9) 100%);
  z-index: 2;
  letter-spacing: 2px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

/* 轮播控制 */

.carousel-indicators {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: 10;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(212, 175, 55, 0.3);
  border: 2px solid rgba(212, 175, 55, 0.5);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.indicator:hover {
  background: rgba(212, 175, 55, 0.6);
  transform: scale(1.2);
}

.indicator.active {
  background: #d4af37;
  transform: scale(1.3);
  box-shadow: 0 0 15px rgba(212, 175, 55, 0.8);
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(212, 175, 55, 0.1);
  border: 2px solid rgba(212, 175, 55, 0.3);
  color: #f1e1a6;
  font-size: 28px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  z-index: 10;
}

.carousel-btn:hover {
  background: rgba(212, 175, 55, 0.2);
  border-color: rgba(212, 175, 55, 0.6);
  color: #ffffff;
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 0 25px rgba(212, 175, 55, 0.4);
}

.carousel-btn.prev {
  left: 32px;
}

.carousel-btn.next {
  right: 32px;
}

/* 故事列表 */
.stories-list-section {
  padding: 60px 24px;
  max-width: 1280px;
  margin: 0 auto;
  position: relative;
}

.stories-list-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #d4af37, transparent);
}

.section-title {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 40px 0;
  color: #f1e1a6;
  text-align: center;
  letter-spacing: 3px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, transparent, #d4af37, transparent);
}

.stories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 32px;
}

.story-card {
  background: linear-gradient(135deg, rgba(139, 0, 0, 0.3) 0%, rgba(45, 24, 16, 0.4) 100%);
  border: 2px solid rgba(212, 175, 55, 0.3);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.story-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.2), transparent);
  transition: left 0.6s ease;
}

.story-card:hover::before {
  left: 100%;
}

.story-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.3),
    0 0 30px rgba(212, 175, 55, 0.2);
  border-color: rgba(212, 175, 55, 0.6);
}

.story-image {
  width: 100%;
  height: 180px;
  overflow: hidden;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.story-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.story-placeholder {
  font-size: 36px;
  opacity: 0.5;
  color: #d4af37;
}

.story-content {
  padding: 32px;
  position: relative;
  z-index: 2;
}

.story-title {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 16px 0;
  color: #f1e1a6;
  letter-spacing: 1px;
  line-height: 1.4;
}

.story-excerpt {
  font-size: 15px;
  line-height: 1.7;
  color: rgba(245, 245, 245, 0.9);
  margin: 0 0 20px 0;
  font-weight: 300;
}

.read-more {
  font-size: 15px;
  color: #d4af37;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.read-more::after {
  content: '→';
  transition: transform 0.3s ease;
}

.story-card:hover .read-more::after {
  transform: translateX(4px);
}

.story-card:hover .read-more {
  color: #f1e1a6;
  text-shadow: 0 0 10px rgba(241, 225, 166, 0.5);
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: rgba(245, 245, 245, 0.6);
  font-size: 18px;
  font-weight: 300;
  letter-spacing: 1px;
}

.empty-state::before {
  content: '📚';
  display: block;
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.7;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-header {
    padding: 40px 16px 30px;
  }

  .main-title {
    font-size: 36px;
    letter-spacing: 2px;
  }

  .subtitle {
    font-size: 16px;
    letter-spacing: 1px;
  }

  .carousel-section {
    padding: 30px 16px;
  }

  .carousel-wrapper {
    border-radius: 16px;
  }

  .slide-image {
    height: 240px;
  }

  .slide-title {
    font-size: 22px;
    padding: 20px;
  }

  .carousel-btn {
    width: 48px;
    height: 48px;
    font-size: 24px;
  }

  .carousel-btn.prev {
    left: 16px;
  }

  .carousel-btn.next {
    right: 16px;
  }

  .stories-list-section {
    padding: 40px 16px;
  }

  .section-title {
    font-size: 28px;
    margin-bottom: 30px;
  }

  .stories-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .story-card {
    border-radius: 12px;
  }

  .story-content {
    padding: 24px;
  }

  .story-title {
    font-size: 18px;
  }
}

/* 工具类 */
.w-5 {
  width: 20px;
}

.h-5 {
  height: 20px;
}
</style>