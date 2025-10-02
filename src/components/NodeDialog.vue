<template>
  <div v-if="props.node" class="fixed inset-0 flex items-center justify-center bg-black/50 z-[200]" @click.self="close">
  <!-- 中心弹窗 -->
<div class="node-popup bg-white rounded-2xl shadow-xl w-[850px] max-h-[90vh] flex flex-col overflow-hidden">
  
  <!-- 头部 -->
  <div class="flex items-start justify-between p-4">
    <div>
      <h3 class="text-lg font-semibold">{{ props.node.name_zh }}</h3>
      <p class="text-sm text-gray-500">{{ props.node.time || '' }}</p>
    </div>
    <button @click="close" class="text-gray-500 hover:text-gray-800">✕</button>
  </div>

  <!-- 主体内容 -->
  <div class="px-4 py-3 flex-1 overflow-auto" ref="contentArea">
    
    <!-- 页 1：描述 + 诗词 + 图片 -->
    <div v-if="currentPage === 1">
      <div class="mb-4" v-if="props.node.image">
        <img
          :src="`/assets/${props.node.image}`"
          alt="node image"
          class="w-full max-h-[380px] object-contain rounded-lg"
        />
      </div>

      <p class="text-gray-700 leading-snug whitespace-pre-wrap mb-2">
        {{ props.node.description_zh }}
      </p>

      <div v-if="props.node.poem_zh" class="mb-2">
        <p class="italic text-sm text-red-700 whitespace-pre-wrap">{{ props.node.poem_zh }}</p>
      </div>

      <div class="text-sm text-gray-600">
        <p><strong>地形：</strong>{{ props.node.terrain || '—' }}</p>
        <p><strong>气候：</strong>{{ props.node.weather || '—' }}</p>
        <p><strong>参与：</strong>{{ props.node.participants || '—' }}</p>
      </div>
    </div>

        <!-- 页 2：小精灵气泡 + 问题 + 选项（都在弹窗内部，不会溢出） -->
        <div v-else-if="currentPage === 2 && decision">
          <div class="flex items-start gap-4">
            <!-- 小精灵头像（固定宽度，不会撑开弹窗） -->
            <img
              src="/assets/1.png"
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
import { eventBus } from '../utils/bus'; // ✅ 引入事件总线

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

// small sprite url
const spriteUrl = '/assets/sprite.png';
const contentArea = ref(null);

// class helper
const optionClass = (idx) => {
  let base = 'border ';
  if (!submitted.value) return base + 'border-gray-200 bg-white hover:bg-gray-50';
  if (idx === selectedIndex.value) {
    return base + (isCorrect.value ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50');
  }
  if (idx === decision.value?.correct_answer) {
    return base + 'border-green-200 bg-green-25';
  }
  return base + 'border-gray-200 bg-white/90';
};

// ✅ 核心改动：选择答案
const onSelect = async (idx) => {
  if (!decision.value || submitted.value) return;

  selectedIndex.value = idx;
  submitted.value = true;
  isCorrect.value = idx === decision.value.correct_answer;

  try {
    if (isCorrect.value) {
      await saveProgress({
        user_id: props.userId,
        unlocked_nodes: [props.node.id],
        achievements: ['correct-choice']
      });
    } else {
      await saveProgress({
        user_id: props.userId,
        achievements: ['answered-wrong']
      });
    }

    // ✅ 如果是 wuqizheng 节点并回答正确，触发成就弹窗
    if (props.node.id === 'wuqizheng' && isCorrect.value) {
      eventBus.emit('show-achievement', {
        title: '吴起镇会师',
        description: '完成吴起镇节点互动！'
      });
    }
  } catch (err) {
    console.warn('saveProgress failed', err);
  }

  await nextTick();
  if (contentArea.value) contentArea.value.scrollTop = contentArea.value.scrollTop;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};
const nextPage = (event) => {
  if (event) event.stopPropagation();
  if (currentPage.value < totalPages) {
    currentPage.value++;
    submitted.value = false;
    selectedIndex.value = null;
    isCorrect.value = false;
  }
};

const close = () => {
  emit('close');
};
</script>