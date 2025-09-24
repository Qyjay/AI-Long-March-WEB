<template>
  <div v-if="node" class="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
  <!-- 中心弹窗 -->
<div class="bg-white rounded-2xl shadow-xl w-[850px] max-h-[90vh] flex flex-col overflow-hidden transform -translate-x-40">
  
  <!-- 头部 -->
  <div class="flex items-start justify-between p-4">
    <div>
      <h3 class="text-lg font-semibold">{{ node.name_zh }}</h3>
      <p class="text-sm text-gray-500">{{ node.time || '' }}</p>
    </div>
    <button @click="close" class="text-gray-500 hover:text-gray-800">✕</button>
  </div>

  <!-- 主体内容 -->
  <div class="px-4 py-3 flex-1 overflow-auto" ref="contentArea">
    
    <!-- 页 1：描述 + 诗词 + 图片 -->
    <div v-if="currentPage === 1">
      <div class="mb-4" v-if="node.image">
        <img
          :src="`/assets/${node.image}`"
          alt="node image"
          class="w-full max-h-[380px] object-contain rounded-lg"
        />
      </div>

      <p class="text-gray-700 leading-snug whitespace-pre-wrap mb-2">
        {{ node.description_zh }}
      </p>

      <div v-if="node.poem_zh" class="mb-2">
        <p class="italic text-sm text-red-700 whitespace-pre-wrap">{{ node.poem_zh }}</p>
      </div>

      <div class="text-sm text-gray-600">
        <p><strong>地形：</strong>{{ node.terrain || '—' }}</p>
        <p><strong>气候：</strong>{{ node.weather || '—' }}</p>
        <p><strong>参与：</strong>{{ node.participants || '—' }}</p>
      </div>
    </div>

        <!-- 页 2：小精灵气泡 + 问题 + 选项（都在弹窗内部，不会溢出） -->
        <div v-else-if="currentPage === 2 && decision">
          <div class="flex items-start gap-4">
            <!-- 小精灵头像（固定宽度，不会撑开弹窗） -->
            <img
              :src="spriteUrl"
              alt="sprite"
              class="w-16 h-16 rounded-full flex-shrink-0"
            />

            <!-- 气泡区域：受限最大宽度，自动换行 -->
            <div class="flex-1">
              <div class="bg-gray-100 p-3 rounded-xl break-words">
                <!-- 显示问题或已选后的简短精灵提示 -->
                <p class="text-sm font-medium text-gray-800" v-if="!submitted">
                  {{ decision.question }}
                </p>
                <p class="text-sm font-medium text-gray-800" v-else>
                  <!-- 精灵回答气泡：根据是否正确显示不同短语 -->
                  <span v-if="isCorrect">精灵：回答正确 ✅</span>
                  <span v-else>精灵：回答错误 ❌</span>
                </p>
              </div>

              <!-- 解释（选择后在此展示，保持在弹窗内部） -->
              <div v-if="submitted" class="mt-3">
                <div class="bg-white border p-3 rounded shadow-sm text-sm text-gray-700 whitespace-pre-wrap">
                  {{ decision.explanation }}
                </div>
              </div>
            </div>
          </div>

          <!-- 选项：放在气泡下面并左内缩对齐（避免遮挡右侧） -->
          <div class="mt-5 ml-[64px]"> <!-- ml 与头像宽度一致，使选项左对齐气泡下方 -->
            <div class="grid gap-3">
              <button
                v-for="(opt, idx) in decision.options"
                :key="idx"
                @click="onSelect(idx)"
                :disabled="submitted"
                :class="optionClass(idx)"
                class="w-full text-left px-4 py-2 rounded-lg transition"
              >
                {{ opt }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部控制栏 -->
      <div class="p-4 border-t flex items-center justify-between">
        <div class="flex items-center gap-3">
          <button
            v-if="currentPage > 1"
            @click="prevPage"
            class="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm"
          >
            上一步
          </button>
          <button
            v-if="currentPage < totalPages"
            @click="nextPage"
            class="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm"
          >
            下一步
          </button>
        </div>

        <div class="text-sm text-gray-500">
          {{ currentPage }} / {{ totalPages }}
        </div>

        <div>
          <button @click="close" class="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import { saveProgress } from '../api';

const props = defineProps({
  node: { type: Object, required: true },
  userId: { type: String, default: 'user123' }
});
const emit = defineEmits(['close']);

// pagination
const currentPage = ref(1);
const totalPages = 2;

// decision computed
const decision = computed(() => props.node?.interactive_decision ?? null);

// selection state
const submitted = ref(false);
const selectedIndex = ref(null);
const isCorrect = ref(false);

// small sprite url (放 public/assets/sprite.png)
const spriteUrl = '/assets/sprite.png';

// helper to build image url (支持绝对 URL 或 public/assets/ 文件名)
const imageUrl = (img) => {
  if (!img) return '';
  if (img.startsWith('http') || img.startsWith('//')) return img;
  return `/assets/${img}`;
};

// expose for template
const optionClass = (idx) => {
  // base
  let base = 'border ';
  if (!submitted.value) return base + 'border-gray-200 bg-white hover:bg-gray-50';
  // already submitted: mark selected and correct
  if (idx === selectedIndex.value) {
    return base + (isCorrect.value ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50');
  }
  if (idx === decision.value?.correct_answer) {
    return base + 'border-green-200 bg-green-25';
  }
  return base + 'border-gray-200 bg-white/90';
};

const onSelect = async (idx) => {
  if (!decision.value || submitted.value) return;
  selectedIndex.value = idx;
  submitted.value = true;
  isCorrect.value = idx === decision.value.correct_answer;

  // show explanation inside modal (we already show it via template)
  // 保存进度：仅在正确时把节点加入 unlocked_nodes（根据后端实现可调整为合并）
  try {
    if (isCorrect.value) {
      await saveProgress({
        user_id: props.userId,
        unlocked_nodes: [props.node.id],
        achievements: ['correct-choice']
      });
    } else {
      // 选择错误也可以记录（可选）
      await saveProgress({
        user_id: props.userId,
        achievements: ['answered-wrong']
      });
    }
  } catch (err) {
    console.warn('saveProgress failed', err);
  }

  // 确保解释可见，滚动到顶部或气泡位置（若内容过长）
  await nextTick();
  const area = contentArea.value;
  if (area) {
    // 将气泡顶部滚到可见区域
    area.scrollTop = area.scrollTop; // keep current; you can refine to scroll to top or specific offset
  }
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
  // reset selection when going back to question page (可按需保留)
  if (currentPage.value === 2) {
    // keep prior answer
  }
};
const nextPage = () => {
  if (currentPage.value < totalPages) {
    currentPage.value++;
    // reset state for new page
    submitted.value = false;
    selectedIndex.value = null;
    isCorrect.value = false;
  }
};

const close = () => {
  emit('close');
};

// refs
const contentArea = ref(null);
</script>

<style scoped>
/* 微调，防止绿色背景类不存在时颜色看起来怪 */
.bg-green-25 { background-color: rgba(16, 185, 129, 0.06); } /* tailwind-like */
</style>