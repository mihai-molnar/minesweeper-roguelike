import { ref, computed } from 'vue'

export function useTimer() {
  const startTime = ref<number | null>(null)
  const elapsedTime = ref(0)
  const timerInterval = ref<number | null>(null)

  const isRunning = computed(() => timerInterval.value !== null)

  function start() {
    if (isRunning.value) return
    
    startTime.value = Date.now() - elapsedTime.value * 1000
    timerInterval.value = window.setInterval(() => {
      if (startTime.value) {
        elapsedTime.value = Math.floor((Date.now() - startTime.value) / 1000)
        if (elapsedTime.value >= 999) {
          stop()
          elapsedTime.value = 999
        }
      }
    }, 1000)
  }

  function stop() {
    if (timerInterval.value) {
      clearInterval(timerInterval.value)
      timerInterval.value = null
    }
  }

  function reset() {
    stop()
    elapsedTime.value = 0
    startTime.value = null
  }

  return {
    elapsedTime,
    isRunning,
    start,
    stop,
    reset
  }
}