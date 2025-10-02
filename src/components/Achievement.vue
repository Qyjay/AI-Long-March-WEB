<template>
  <div v-if="showAchievement" class="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
    <div class="bg-white bg-opacity-90 rounded-3xl shadow-2xl p-6 w-96 text-center animate-fadeIn">
      <img src="/assets/ok.png" alt="完成长征" class="w-full h-auto rounded-lg mb-4" />
      <button type="button" @click="closeAchievement" class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
        我知道了
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showAchievement = ref(false)

const triggerAchievement = () => { showAchievement.value = true }
const closeAchievement = () => { showAchievement.value = false }

defineExpose({ triggerAchievement })
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fadeIn { animation: fadeIn 0.5s ease-out; }
</style>