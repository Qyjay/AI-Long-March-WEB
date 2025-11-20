<template>
  <div class="fixed left-4 bottom-4 z-50 flex flex-col items-start">
    <!-- 小精灵按钮 -->
    <button
      v-if="!isOpen"
      class="flex items-center gap-2 bg-white shadow-lg rounded-full px-3 py-2"
      @click="isOpen=true"
    >
      <img
        src="/assets/1.png"
        alt="sprite"
        class="w-16 h-16 rounded-full"
      >
      <span class="text-lg font-medium text-gray-800">我是长小征～欢迎向我提问❤️</span>
    </button>

    <!-- 聊天窗口 -->
    <div
      v-if="isOpen"
      class="w-[400px] h-[500px] bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden"
    >
      <div class="flex items-center justify-between p-3 border-b">
        <div class="flex items-center gap-2">
          <img
            src="/assets/1.png"
            alt="sprite"
            class="w-16 h-16 rounded-full"
          >
          <span class="font-medium text-gray-800">长小征🚩</span>
        </div>
        <button
          class="text-gray-500 hover:text-gray-800"
          @click="isOpen=false"
        >
          ✕
        </button>
      </div>

      <!-- Tab 选择 -->
      <div class="flex border-b">
        <button
          :class="tab==='story'?activeTab:inactiveTab"
          @click="tab='story'"
        >
          剧情类
        </button>
        <button
          :class="tab==='poem'?activeTab:inactiveTab"
          @click="tab='poem'"
        >
          诗词类
        </button>
        <button
          :class="tab==='qa'?activeTab:inactiveTab"
          @click="tab='qa'"
        >
          问答类
        </button>
      </div>

      <!-- 消息区 -->
      <div
        ref="messageArea"
        class="flex-1 p-3 overflow-y-auto space-y-2 bg-gray-50"
      >
        <div
          v-for="(msg, idx) in messages[tab]"
          :key="idx"
          class="flex"
          :class="msg.role==='user'?'justify-end':'justify-start'"
        >
          <div :class="msg.role==='user' ? userClass : assistantClass">
            {{ msg.content }}
          </div>
        </div>
      </div>

      <!-- 输入框 -->
      <div class="flex p-2 border-t gap-2">
        <input
          v-model="inputText"
          type="text"
          :placeholder="placeholder"
          class="flex-1 border rounded-full px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          @keydown.enter="sendMessage"
        >
        <button
          class="bg-blue-600 text-white px-4 py-1 rounded-full hover:bg-blue-700"
          @click="sendMessage"
        >
          发送
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, computed } from 'vue';
import { createLlmClient } from '../lib/langchainClient';

const isOpen = ref(false);
const tab = ref('story'); // story / poem / qa
const inputText = ref('');
const messages = ref({ story: [], poem: [], qa: [] });
const messageArea = ref(null);
const abortController = ref(null);

// 输入占位提示
const placeholder = computed(() => {
  if (tab.value === 'story') return '请输入背景或补充信息（剧情类）';
  if (tab.value === 'poem') return '请输入赏析要点（诗词类）';
  return '请输入提问（问答类）';
});

const activeTab = "flex-1 py-2 text-center font-medium border-b-2 border-blue-500";
const inactiveTab = "flex-1 py-2 text-center font-medium text-gray-500 hover:bg-gray-100";
const userClass = 'inline-block bg-blue-500 text-white px-3 py-1 rounded-lg max-w-[80%] break-words';
const assistantClass = 'inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-lg max-w-[80%] break-words';

// 是否启用前端 mock（使用 LangChain 直接调用）
const USE_MOCK = import.meta.env.VITE_USE_MOCK === '1' || import.meta.env.VITE_USE_MOCK === 'true';

// 前端 LangChain 客户端（仅在 mock 模式创建）
const llmClient = USE_MOCK
  ? createLlmClient({
      model: import.meta.env.VITE_LLM_MODEL,
      baseUrl: import.meta.env.VITE_OPENAI_BASE_URL,
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    })
  : null;

/**
 * 滚动消息区域到底部，确保最新内容可见
 */
const scrollToBottom = async () => {
  await nextTick();
  const area = messageArea.value;
  if (area) area.scrollTop = area.scrollHeight;
}

/**
 * 发送消息并接入后端 SSE 流式返回
 * - 根据当前 tab 构造请求体与终端路径
 * - 使用 ReadableStream 解析 SSE（按 \n\n 分段，行以 data: 开头）
 * - 支持中止上一次请求（AbortController）
 */
const sendMessage = async () => {
  if (!inputText.value.trim()) return;

  // 保存用户消息
  messages.value[tab.value].push({ role: 'user', content: inputText.value });
  await scrollToBottom();
  const userInput = inputText.value;
  inputText.value = '';

  // 添加占位小精灵消息
  messages.value[tab.value].push({ role: 'assistant', content: '' });
  const msgIndex = messages.value[tab.value].length - 1;
  const lockedTab = tab.value;
  await scrollToBottom();

  // 构建 payload
  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
  const endpoint = tab.value === 'story'
    ? `${base}/chat/explanation`
    : tab.value === 'poem'
      ? `${base}/chat/poem`
      : `${base}/chat/qa`;
  const payload = (() => {
    if (tab.value === 'story') {
      // 默认示例字段，使用用户输入补充背景，便于与对话关联
      return {
        route: "长征路线",
        choice: "正面突破",
        real_history_choice: "分兵佯攻",
        history_background: userInput || "历史背景描述",
        tactical_logic: "战术逻辑描述"
      }
    }
    if (tab.value === 'poem') {
      return {
        route: "长征路线",
        poem: "七律·长征",
        creation_background: "创作背景描述",
        poem_analysis: userInput || "诗词解析描述",
        spirit: "精神内涵描述",
        meanings: "当代意义描述"
      }
    }
    // qa：直接将用户输入作为问题
    return { question: userInput }
  })();

  // mock: 前端直接调用 LangChain（流式输出，仅使用用户输入）
  if (USE_MOCK && llmClient) {
    try {
      const stream = llmClient.askStream(lockedTab, userInput);
      for await (const delta of stream) {
        const target = messages.value[lockedTab][msgIndex];
        if (!target) break;
        target.content += delta;
        await scrollToBottom();
      }
      return;
    } catch (e) {
      const target = messages.value[lockedTab][msgIndex];
      if (target) target.content = '前端模型调用失败';
      await scrollToBottom();
      return;
    }
  }

  // 取消上一次请求（若存在）
  if (abortController.value) {
    try { abortController.value.abort(); } catch {}
  }
  abortController.value = new AbortController();

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream'
      },
      body: JSON.stringify(payload),
      signal: abortController.value.signal
    });

    // 非 SSE 错误（例如参数解析失败），尝试读取 JSON 并提示
    const ct = res.headers.get('Content-Type') || '';
    if (!res.ok) {
      try {
        const errJson = await res.json();
        messages.value[tab.value][msgIndex].content = errJson?.error || '请求失败';
      } catch {
        messages.value[tab.value][msgIndex].content = `请求失败(${res.status})`;
      }
      await scrollToBottom();
      return;
    }
    if (!ct.includes('text/event-stream')) {
      messages.value[tab.value][msgIndex].content = '服务未以 SSE 返回';
      await scrollToBottom();
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while(true){
      const { value, done: doneReading } = await reader.read();
      if (doneReading) break;
      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split('\n\n');
      buffer = parts.pop() || '';
      for (const part of parts) {
        const lines = part.split('\n');
        for (const line of lines) {
          if (line.startsWith('data:')) {
            const jsonStr = line.slice(5).trim();
            try {
              const evt = JSON.parse(jsonStr);
              if (evt?.type === 'content' && evt?.content) {
                messages.value[tab.value][msgIndex].content += evt.content;
                await scrollToBottom();
              } else if (evt?.type === 'error') {
                const msg = evt?.meta?.message || evt?.message || '服务错误';
                messages.value[tab.value][msgIndex].content += `\n[错误] ${msg}`;
                await scrollToBottom();
              }
            } catch(_) {
              // ignore malformed chunk
            }
          }
        }
      }
    }
  } catch(err) {
    if (err?.name === 'AbortError') {
      messages.value[tab.value][msgIndex].content += '\n[已取消]';
      await scrollToBottom();
      return;
    }
    messages.value[tab.value][msgIndex].content = '网络错误或服务不可用';
    await scrollToBottom();
  }
}
</script>

<style scoped>
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-thumb { background-color: rgba(0,0,0,0.2); border-radius: 3px; }
</style>