<template>
  <div
    v-if="show"
    class="fixed inset-0 flex items-center justify-center z-[300] bg-black/50"
    @click.self="close"
  >
    <div class="bg-white rounded-2xl shadow-xl w-[600px] max-h-[80vh] flex flex-col overflow-hidden relative">
      <img
        src="/assets/ok.png"
        alt="achievement"
        class="w-full object-cover rounded-t-2xl"
      />
      <div class="p-4 text-center">
        <h2 class="text-xl font-bold">你已完成长征！</h2>
        <p class="text-gray-600 mt-2">恭喜你达成成就 🎉</p>
        <button
          @click="close"
          class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          关闭
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const show = ref(true)

const close = () => {
  show.value = false
}
</script>

<style scoped>
</style>