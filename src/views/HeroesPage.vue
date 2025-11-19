<template>
  <div class="heroes-page">
    <!-- 页面头部标题 -->
    <header class="page-header">
      <div class="header-content">
        <h1 class="main-title">
          长征英雄
        </h1>
        <p class="subtitle">
          铭记革命先辈，传承英雄精神
        </p>
      </div>
      <div class="header-decoration" />
    </header>

    <!-- 英雄列表 -->
    <section class="heros-list-section">
      <h2 class="section-title" />
      <div
        v-if="heros.length"
        class="heros-grid"
      >
        <div
          v-for="hero in heros"
          :key="hero.id"
          class="hero-card"
          @click="openHero(hero)"
        >
          <div class="hero-content">
            <h3 class="hero-name">
              {{ hero.name }}
            </h3>
            <p class="hero-position">
              {{ hero.position }}
            </p>
            <p class="hero-battles">
              {{ getBattlesText(hero.battles) }}
            </p>
            <span class="read-more">了解详情 →</span>
          </div>
        </div>
      </div>
      <div
        v-else
        class="empty-state"
      >
        <p>暂无英雄信息</p>
      </div>
    </section>

    <!-- 英雄详情弹窗 -->
    <HeroDetailModal
      v-if="selectedHero"
      :hero="selectedHero"
      @close="closeHero"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import herosData from '@/data/heros.json'
import OkPng from '@/data/ok.png'
import HeroDetailModal from '@/components/HeroDetailModal.vue'

// 导入已知的英雄图片
const heroImages = {
  'maozedong': new URL('@/data/maozedong.png', import.meta.url).href,
  'zhouenlai': new URL('@/data/zhouenlai.png', import.meta.url).href,
  'zhude': new URL('@/data/zhude.png', import.meta.url).href,
  'penghuai': new URL('@/data/ok.png', import.meta.url).href, // 使用占位图
  'linbiao': new URL('@/data/ok.png', import.meta.url).href, // 使用占位图
  'liuxiang': new URL('@/data/ok.png', import.meta.url).href, // 使用占位图
  'hexiao': new URL('@/data/ok.png', import.meta.url).href, // 使用占位图
  'chenyi': new URL('@/data/ok.png', import.meta.url).href // 使用占位图
}

// 路由
const router = useRouter()

// 状态
const heros = ref([])
const selectedHero = ref(null)



/**
 * 返回上一页
 */
const goBack = () => {
  router.back()
}

/**
 * 加载本地英雄列表（纯前端，不调用后端）
 * 从 src/data/heros.json 读取并写入页面状态
 */
const loadHeros = async () => {
  try {
    const data = herosData
    heros.value = Array.isArray(data?.heros) ? data.heros : []
  } catch (error) {
    console.error('加载本地英雄失败:', error)
    heros.value = []
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
  if (heroImages[image]) {
    return heroImages[image]
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
 * 获取战役文本
 */
const getBattlesText = (battles) => {
  if (!Array.isArray(battles) || battles.length === 0) return '暂无战役信息'
  return battles.slice(0, 3).join('、') + (battles.length > 3 ? '等' : '')
}

/**
 * 打开英雄详情
 */
const openHero = (hero) => {
  selectedHero.value = hero
}

/**
 * 关闭英雄详情
 */
const closeHero = () => {
  selectedHero.value = null
}



// 生命周期
onMounted(() => {
  loadHeros()
})
</script>

<style scoped>
.heroes-page {
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


/* 英雄列表 */
.heros-list-section {
  padding: 60px 24px;
  max-width: 1280px;
  margin: 0 auto;
  position: relative;
}

.heros-list-section::before {
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

.heros-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 32px;
}

.hero-card {
  background: linear-gradient(135deg, rgba(139, 0, 0, 0.3) 0%, rgba(45, 24, 16, 0.4) 100%);
  border: 2px solid rgba(212, 175, 55, 0.3);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.hero-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.2), transparent);
  transition: left 0.6s ease;
}

.hero-card:hover::before {
  left: 100%;
}

.hero-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.3),
    0 0 30px rgba(212, 175, 55, 0.2);
  border-color: rgba(212, 175, 55, 0.6);
}

.hero-content {
  padding: 32px;
  position: relative;
  z-index: 2;
}

.hero-name {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 12px 0;
  color: #f1e1a6;
  letter-spacing: 1px;
  line-height: 1.4;
}

.hero-position {
  font-size: 14px;
  color: #d4af37;
  margin: 0 0 16px 0;
  font-weight: 500;
  opacity: 0.9;
}

.hero-battles {
  font-size: 14px;
  line-height: 1.6;
  color: rgba(245, 245, 245, 0.8);
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

.hero-card:hover .read-more::after {
  transform: translateX(4px);
}

.hero-card:hover .read-more {
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
  content: '⚔️';
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



  .heros-list-section {
    padding: 40px 16px;
  }

  .section-title {
    font-size: 28px;
    margin-bottom: 30px;
  }

  .heros-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .hero-card {
    border-radius: 12px;
  }

  .hero-content {
    padding: 24px;
  }

  .hero-name {
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