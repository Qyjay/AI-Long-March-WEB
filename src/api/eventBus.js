import { reactive } from 'vue'

export const eventBus = reactive({
  events: {},
  emit(event, payload) {
    if (this.events[event]) {
      this.events[event].forEach(cb => cb(payload))
    }
  },
  on(event, cb) {
    if (!this.events[event]) this.events[event] = []
    this.events[event].push(cb)
  },
  off(event, cb) {
    if (!this.events[event]) return
    this.events[event] = this.events[event].filter(f => f !== cb)
  }
})