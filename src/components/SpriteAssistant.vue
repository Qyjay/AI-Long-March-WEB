<template>
  <div class="fixed left-4 bottom-4 z-50 flex flex-col items-start">
    <!-- 小精灵按钮 -->
    <button v-if="!isOpen" @click="isOpen=true" class="flex items-center gap-2 bg-white shadow-lg rounded-full px-3 py-2">
      <img
    src="/assets/1.png"
    alt="sprite"
    class="w-16 h-16 rounded-full"
  />
      <span class="text-lg font-medium text-gray-800">我是长小征～欢迎向我提问❤️</span>
    </button>

    <!-- 聊天窗口 -->
    <div v-if="isOpen" class="w-[400px] h-[500px] bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden">
      <div class="flex items-center justify-between p-3 border-b">
        <div class="flex items-center gap-2">
         <img
    src="/assets/1.png"
    alt="sprite"
    class="w-16 h-16 rounded-full"
  />
          <span class="font-medium text-gray-800">长小征🚩</span>
        </div>
        <button @click="isOpen=false" class="text-gray-500 hover:text-gray-800">✕</button>
      </div>

      <!-- Tab 选择 -->
      <div class="flex border-b">
        <button :class="tab==='story'?activeTab:inactiveTab" @click="tab='story'">剧情类</button>
        <button :class="tab==='poem'?activeTab:inactiveTab" @click="tab='poem'">诗词类</button>
      </div>

      <!-- 消息区 -->
      <div ref="messageArea" class="flex-1 p-3 overflow-y-auto space-y-2 bg-gray-50">
        <div v-for="(msg, idx) in messages[tab]" :key="idx" class="flex" :class="msg.role==='user'?'justify-end':'justify-start'">
          <div :class="msg.role==='user' ? userClass : assistantClass">{{ msg.content }}</div>
        </div>
      </div>

      <!-- 输入框 -->
      <div class="flex p-2 border-t gap-2">
        <input v-model="inputText" @keydown.enter="sendMessage" type="text" placeholder="请输入问题..."
          class="flex-1 border rounded-full px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"/>
        <button @click="sendMessage" class="bg-blue-600 text-white px-4 py-1 rounded-full hover:bg-blue-700">发送</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';

const isOpen = ref(false);
const tab = ref('story'); // story / poem
const inputText = ref('');
const messages = ref({ story: [], poem: [] });
const messageArea = ref(null);

const activeTab = "flex-1 py-2 text-center font-medium border-b-2 border-blue-500";
const inactiveTab = "flex-1 py-2 text-center font-medium text-gray-500 hover:bg-gray-100";
const userClass = 'inline-block bg-blue-500 text-white px-3 py-1 rounded-lg max-w-[80%] break-words';
const assistantClass = 'inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-lg max-w-[80%] break-words';

const scrollToBottom = async () => {
  await nextTick();
  const area = messageArea.value;
  if (area) area.scrollTop = area.scrollHeight;
}

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
  await scrollToBottom();

  // 构建 payload
  const endpoint = tab.value === 'story'
    ? 'http://localhost:8000/chat/explanation'
    : 'http://localhost:8000/chat/poem';
  const payload = tab.value === 'story'
    ? {
        route: "长征路线",
        choice: "正面突破",
        real_history_choice: "分兵佯攻",
        history_background: "历史背景描述",
        tactical_logic: "战术逻辑描述"
      }
    : {
        route: "长征路线",
        poem: "七律·长征",
        creation_background: "创作背景描述",
        poem_analysis: "诗词解析描述",
        spirit: "精神内涵描述",
        meanings: "当代意义描述"
      };

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while(!done){
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      if (value) {
        messages.value[tab.value][msgIndex].content += decoder.decode(value);
        await scrollToBottom();
      }
    }
  } catch(err) {
  let fakeAnswer = '';

  if(tab.value === 'story'){
    fakeAnswer = `瑞金是中华苏维埃共和国临时中央政府所在地，被称为“红色故都”。在1931年至1934年间，瑞金是中央苏区的政治、军事和经济中心。这里发生了许多重要事件，包括红军的战略部署和苏维埃政府的建立。瑞金的红军和苏维埃政府在中国共产党领导下，由毛泽东、朱德、周恩来等领导核心人物带领，开展了土地革命和抗击国民党军队的斗争，为后续长征奠定了坚实的基础。这一段历史体现了红军的勇敢、智慧和坚韧不拔的精神。`;
  } else if(tab.value === 'poem'){
    fakeAnswer = `长征期间流传的著名诗词有毛泽东的《长征》和《七律·长征》等。《七律·长征》通过生动的描写，展现了红军战士在长征途中跨越雪山草地、攻克敌军封锁线的艰难与壮丽。诗句既有雄壮的气势，也有深厚的历史厚重感，每一句都充满了坚定的意志和革命精神。这些诗词不仅是文学作品，更是红军精神的象征，激励后人铭记历史、坚韧奋进。`;
  }

  // 将回答拆成若干小段
  const chunks = fakeAnswer.match(/(.|[\r\n]){1,20}/g); // 每20个字符一段
  let idx = 0;

  const interval = setInterval(async () => {
    if(idx >= chunks.length){
      clearInterval(interval);
      return;
    }
    messages.value[tab.value][msgIndex].content += chunks[idx];
    idx++;
    await scrollToBottom();
  }, 250); // 每50ms输出一段，效果类似流式输出
}
}
</script>

<style scoped>
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-thumb { background-color: rgba(0,0,0,0.2); border-radius: 3px; }
</style>