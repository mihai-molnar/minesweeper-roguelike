<template>
  <div 
    class="game-board" 
    :style="{ 
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gridTemplateRows: `repeat(${rows}, 1fr)`
    }"
  >
    <GameCell
      v-for="cell in flatBoard"
      :key="cell.id"
      :cell="cell"
      :game-status="gameStatus"
      :mine-detector-active="mineDetectorActive"
      @click="handleCellClick"
      @right-click="handleCellRightClick"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Cell } from '../types'
import GameCell from './GameCell.vue'

interface Props {
  board: Cell[][]
  gameStatus: 'idle' | 'playing' | 'won' | 'lost' | 'shop'
  mineDetectorActive?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  cellClick: [row: number, col: number]
  cellRightClick: [row: number, col: number]
}>()

const flatBoard = computed(() => props.board.flat())
const rows = computed(() => props.board.length)
const cols = computed(() => props.board[0]?.length || 0)

function handleCellClick(row: number, col: number) {
  emit('cellClick', row, col)
}

function handleCellRightClick(row: number, col: number) {
  emit('cellRightClick', row, col)
}
</script>

<style scoped>
.game-board {
  display: grid;
  gap: 1px;
  background-color: #808080;
  border: 3px inset #c0c0c0;
  padding: 3px;
  max-width: fit-content;
  margin: 0 auto;
}
</style>