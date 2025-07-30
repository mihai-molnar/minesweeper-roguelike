<template>
  <div class="app">
    <div class="game-container">
      <h1 class="game-title">Vue Minesweeper</h1>
      
      <!-- Game View -->
      <div v-if="gameStore.gameStatus !== 'shop'">
        <div class="difficulty-selector">
          <button 
            v-for="difficulty in difficulties" 
            :key="difficulty.name"
            :class="{ active: selectedDifficulty === difficulty.name }"
            @click="changeDifficulty(difficulty)"
          >
            {{ difficulty.name }}
          </button>
        </div>

        <GameHeader
          :remaining-mines="gameStore.remainingMines"
          :game-status="gameStore.gameStatus"
          :time-elapsed="timer.elapsedTime.value"
          :score="gameStore.score"
          :extra-lives="gameStore.extraLives"
          :area-explosions-left="gameStore.areaExplosionsLeft"
          :time-freeze-active="gameStore.timeFreezeActive"
          :time-freeze-remaining="timeFreezeRemaining"
          @reset="handleReset"
          @use-area-explosion="handleAreaExplosionRequest"
        />

        <GameBoard
          :board="gameStore.board"
          :game-status="gameStore.gameStatus"
          :mine-detector-active="gameStore.mineDetectorActive"
          @cell-click="handleCellClick"
          @cell-right-click="handleCellRightClick"
        />

        <div v-if="gameStore.gameStatus === 'won'" class="game-message won">
          🎉 Congratulations! You won! 🎉<br>
          <small>Score: {{ gameStore.finalScore }}</small>
        </div>
        
        <div v-if="gameStore.gameStatus === 'lost'" class="game-message lost">
          💥 Game Over! Try again! 💥<br>
          <small>Score: {{ gameStore.finalScore }}</small>
        </div>

        <!-- Upgrade Action Buttons -->
        <div v-if="gameStore.gameStatus === 'playing'" class="upgrade-actions">
          <button 
            v-if="hasRevealSafeUpgrade"
            @click="gameStore.useRevealSafe()"
            class="upgrade-action-btn"
            title="Reveal 3 safe cells"
          >
            🔍 Reveal Safe
          </button>
          
          <button 
            v-if="hasMineDetectorUpgrade"
            @click="gameStore.activateMineDetector()"
            class="upgrade-action-btn"
            title="Highlight mines for 10 seconds"
          >
            📡 Mine Detector
          </button>
          
          <button 
            v-if="hasTimeFreezeUpgrade"
            @click="gameStore.activateTimeFreeze()"
            class="upgrade-action-btn"
            title="Freeze timer for 30 seconds"
          >
            ⏸️ Time Freeze
          </button>
        </div>
      </div>

      <!-- Shop View -->
      <ShopPage
        v-if="gameStore.gameStatus === 'shop'"
        :final-score="gameStore.finalScore"
        @upgrade-selected="handleUpgradeSelected"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useGameStore } from './stores/gameStore'
import { useTimer } from './composables/useTimer'
import GameHeader from './components/GameHeader.vue'
import GameBoard from './components/GameBoard.vue'
import ShopPage from './components/ShopPage.vue'
import type { GameConfig, UpgradeCard } from './types'

const gameStore = useGameStore()
const timer = useTimer()

const selectedDifficulty = ref('Beginner')
const areaExplosionMode = ref(false)
const timeFreezeRemaining = ref(0)

const difficulties = [
  { name: 'Beginner', rows: 9, cols: 9, mines: 10 },
  { name: 'Intermediate', rows: 16, cols: 16, mines: 40 },
  { name: 'Expert', rows: 16, cols: 30, mines: 99 }
]

const hasRevealSafeUpgrade = computed(() => 
  gameStore.activeUpgrades.some(u => u.effect.type === 'reveal_safe')
)

const hasMineDetectorUpgrade = computed(() => 
  gameStore.activeUpgrades.some(u => u.effect.type === 'mine_detector')
)

const hasTimeFreezeUpgrade = computed(() => 
  gameStore.activeUpgrades.some(u => u.effect.type === 'time_freeze')
)

function changeDifficulty(difficulty: GameConfig & { name: string }) {
  selectedDifficulty.value = difficulty.name
  gameStore.initializeGame({
    rows: difficulty.rows,
    cols: difficulty.cols,
    mines: difficulty.mines
  })
  timer.reset()
}

function handleCellClick(row: number, col: number) {
  if (areaExplosionMode.value) {
    gameStore.handleAreaExplosion(row, col)
    areaExplosionMode.value = false
  } else {
    gameStore.handleCellClick(row, col)
  }
}

function handleCellRightClick(row: number, col: number) {
  gameStore.handleCellRightClick(row, col)
}

function handleReset() {
  gameStore.resetGame()
  timer.reset()
}

function handleAreaExplosionRequest() {
  areaExplosionMode.value = true
}

function handleUpgradeSelected(card: UpgradeCard | null) {
  gameStore.selectUpgrade(card)
  timer.reset()
}

watch(() => gameStore.gameStatus, (newStatus, oldStatus) => {
  if (newStatus === 'playing' && oldStatus !== 'playing') {
    timer.start()
  } else if (newStatus === 'won' || newStatus === 'lost' || newStatus === 'shop') {
    timer.stop()
  }
})

watch(() => gameStore.timeFreezeActive, (isActive) => {
  if (isActive) {
    timer.stop()
    // Track remaining freeze time locally
    timeFreezeRemaining.value = 30
    const interval = setInterval(() => {
      timeFreezeRemaining.value--
      if (timeFreezeRemaining.value <= 0 || !gameStore.timeFreezeActive) {
        clearInterval(interval)
        if (gameStore.gameStatus === 'playing') {
          timer.start()
        }
      }
    }, 1000)
  }
})

onMounted(() => {
  gameStore.initializeGame()
})

onUnmounted(() => {
  timer.stop()
})
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.game-container {
  text-align: center;
}

.game-title {
  color: #333;
  margin-bottom: 20px;
  font-size: 2.5rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.difficulty-selector {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.difficulty-selector button {
  padding: 8px 16px;
  border: 2px outset #c0c0c0;
  background-color: #c0c0c0;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
}

.difficulty-selector button:hover {
  background-color: #d0d0d0;
}

.difficulty-selector button:active {
  border: 2px inset #c0c0c0;
}

.difficulty-selector button.active {
  background-color: #90EE90;
  border: 2px inset #90EE90;
}

.game-message {
  margin-top: 20px;
  padding: 15px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1.2rem;
}

.game-message.won {
  background-color: #90EE90;
  color: #006400;
  border: 2px solid #006400;
}

.game-message.lost {
  background-color: #FFB6C1;
  color: #8B0000;
  border: 2px solid #8B0000;
}

.upgrade-actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.upgrade-action-btn {
  background: linear-gradient(135deg, #6c5ce7, #a29bfe);
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(108, 92, 231, 0.3);
}

.upgrade-action-btn:hover {
  background: linear-gradient(135deg, #5a4fcf, #8b83ff);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(108, 92, 231, 0.4);
}

.upgrade-action-btn:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .game-title {
    font-size: 2rem;
  }
  
  .difficulty-selector {
    flex-direction: column;
    align-items: center;
  }
  
  .difficulty-selector button {
    width: 120px;
  }
  
  .upgrade-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .upgrade-action-btn {
    width: 150px;
  }
}
</style>