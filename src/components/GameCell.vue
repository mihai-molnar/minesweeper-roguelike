<template>
  <button
    class="game-cell"
    :class="{
      'revealed': cell.isRevealed,
      'flagged': cell.isFlagged,
      'mine': cell.isRevealed && cell.isMine,
      'mine-detected': !cell.isRevealed && cell.isMine && mineDetectorActive,
      'mine-exploded': cell.isRevealed && cell.isMine && gameStatus === 'lost',
      [`neighbors-${cell.neighborMines}`]: cell.isRevealed && !cell.isMine && cell.neighborMines > 0
    }"
    @click="handleClick"
    @contextmenu.prevent="handleRightClick"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
  >
    <span v-if="cell.isFlagged && !cell.isRevealed">🚩</span>
    <span v-else-if="cell.isRevealed && cell.isMine">💣</span>
    <span v-else-if="cell.isRevealed && cell.neighborMines > 0">{{ cell.neighborMines }}</span>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Cell } from '../types'

interface Props {
  cell: Cell
  gameStatus: 'idle' | 'playing' | 'won' | 'lost' | 'shop'
  mineDetectorActive?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  click: [row: number, col: number]
  rightClick: [row: number, col: number]
}>()

const touchTimer = ref<number | null>(null)
const longPressTriggered = ref(false)

function handleClick() {
  if (longPressTriggered.value) {
    longPressTriggered.value = false
    return
  }
  emit('click', props.cell.row, props.cell.col)
}

function handleRightClick() {
  emit('rightClick', props.cell.row, props.cell.col)
}

function handleTouchStart() {
  longPressTriggered.value = false
  touchTimer.value = window.setTimeout(() => {
    longPressTriggered.value = true
    emit('rightClick', props.cell.row, props.cell.col)
  }, 500)
}

function handleTouchEnd() {
  if (touchTimer.value) {
    clearTimeout(touchTimer.value)
    touchTimer.value = null
  }
}
</script>

<style scoped>
.game-cell {
  width: 30px;
  height: 30px;
  border: 2px outset #c0c0c0;
  background-color: #c0c0c0;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
}

.game-cell:hover:not(.revealed) {
  background-color: #d0d0d0;
}

.game-cell:active:not(.revealed) {
  border: 2px inset #c0c0c0;
}

.game-cell.revealed {
  border: 1px solid #808080;
  background-color: #f0f0f0;
  cursor: default;
}

.game-cell.flagged {
  background-color: #c0c0c0;
}

.game-cell.mine {
  background-color: #ff0000;
}

.game-cell.mine-detected {
  background-color: #ffcccc;
  animation: pulse 2s infinite;
}

.game-cell.mine-exploded {
  background-color: #ff0000;
  animation: explode 0.3s ease-in-out;
}

@keyframes explode {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

@keyframes pulse {
  0% { background-color: #ffcccc; }
  50% { background-color: #ff9999; }
  100% { background-color: #ffcccc; }
}

.game-cell.neighbors-1 { color: #0000ff; }
.game-cell.neighbors-2 { color: #008000; }
.game-cell.neighbors-3 { color: #ff0000; }
.game-cell.neighbors-4 { color: #800080; }
.game-cell.neighbors-5 { color: #800000; }
.game-cell.neighbors-6 { color: #008080; }
.game-cell.neighbors-7 { color: #000000; }
.game-cell.neighbors-8 { color: #808080; }
</style>