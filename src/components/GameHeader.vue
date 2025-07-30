<template>
  <div class="game-header">
    <div class="info-panel">
      <div class="mine-counter">
        <span class="label">Mines:</span>
        <span class="count">{{ remainingMines.toString().padStart(3, '0') }}</span>
      </div>
      
      <button 
        class="reset-button"
        @click="resetGame"
        :class="{ 
          'won': gameStatus === 'won',
          'lost': gameStatus === 'lost'
        }"
      >
        {{ getResetButtonEmoji }}
      </button>
      
      <div class="timer">
        <span class="label">Time:</span>
        <span class="count">{{ formattedTime }}</span>
      </div>
    </div>
    
    <div class="secondary-panel">
      <div class="score-display">
        <span class="label">Score:</span>
        <span class="count">{{ score }}</span>
      </div>
      
      <div v-if="extraLives > 0" class="upgrade-indicator lives">
        💖 {{ extraLives }}
      </div>
      
      <div v-if="areaExplosionsLeft > 0" class="upgrade-indicator explosions" @click="$emit('useAreaExplosion')">
        💥 {{ areaExplosionsLeft }}
      </div>
      
      <div v-if="timeFreezeActive" class="upgrade-indicator freeze-active">
        ⏸️ {{ timeFreezeRemaining }}s
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  remainingMines: number
  gameStatus: 'idle' | 'playing' | 'won' | 'lost' | 'shop'
  timeElapsed: number
  score: number
  extraLives: number
  areaExplosionsLeft: number
  timeFreezeActive: boolean
  timeFreezeRemaining: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  reset: []
  useAreaExplosion: []
}>()

const getResetButtonEmoji = computed(() => {
  switch (props.gameStatus) {
    case 'won': return '😎'
    case 'lost': return '😵'
    default: return '🙂'
  }
})

const formattedTime = computed(() => {
  return props.timeElapsed.toString().padStart(3, '0')
})

function resetGame() {
  emit('reset')
}
</script>

<style scoped>
.game-header {
  background-color: #c0c0c0;
  border: 2px outset #c0c0c0;
  padding: 10px;
  margin-bottom: 10px;
}

.info-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 300px;
  margin: 0 auto;
}

.mine-counter, .timer {
  background-color: #000;
  color: #ff0000;
  font-family: 'Courier New', monospace;
  font-size: 20px;
  font-weight: bold;
  padding: 4px 8px;
  border: 1px inset #c0c0c0;
  min-width: 60px;
  text-align: center;
}

.label {
  display: none;
}

.count {
  display: block;
}

.reset-button {
  background-color: #c0c0c0;
  border: 2px outset #c0c0c0;
  font-size: 24px;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.reset-button:hover {
  background-color: #d0d0d0;
}

.reset-button:active {
  border: 2px inset #c0c0c0;
}

.reset-button.won {
  background-color: #90EE90;
}

.reset-button.lost {
  background-color: #FFB6C1;
}

.secondary-panel {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 10px;
  flex-wrap: wrap;
}

.score-display {
  background-color: #000;
  color: #00ff00;
  font-family: 'Courier New', monospace;
  font-size: 16px;
  font-weight: bold;
  padding: 4px 8px;
  border: 1px inset #c0c0c0;
  min-width: 80px;
  text-align: center;
}

.upgrade-indicator {
  background-color: #f0f0f0;
  border: 2px outset #c0c0c0;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 4px;
}

.upgrade-indicator.explosions {
  cursor: pointer;
  transition: all 0.2s ease;
}

.upgrade-indicator.explosions:hover {
  background-color: #e0e0e0;
  transform: scale(1.05);
}

.upgrade-indicator.lives {
  color: #e91e63;
}

.upgrade-indicator.freeze-active {
  color: #2196f3;
  animation: freeze-pulse 1s infinite;
}

@keyframes freeze-pulse {
  0% { opacity: 1; }
  50% { opacity: 0.7; }
  100% { opacity: 1; }
}
</style>