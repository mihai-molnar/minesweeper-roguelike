import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Cell, GameState, GameConfig, UpgradeCard, ActiveUpgrade } from '../types'
import { generateBoard, revealCell, toggleFlag, revealAreaExplosion, revealRandomSafeCells } from '../utils/gameLogic'

export const useGameStore = defineStore('game', () => {
  const board = ref<Cell[][]>([])
  const gameStatus = ref<'idle' | 'playing' | 'won' | 'lost' | 'shop'>('idle')
  const mineCount = ref(0)
  const flagCount = ref(0)
  const timeElapsed = ref(0)
  const isFirstClick = ref(true)
  const config = ref<GameConfig>({ rows: 9, cols: 9, mines: 10 })
  
  // Score and upgrade system
  const score = ref(0)
  const baseScore = ref(0)
  const scoreMultiplier = ref(1)
  const extraLives = ref(0)
  const areaExplosionsLeft = ref(0)
  const activeUpgrades = ref<ActiveUpgrade[]>([])
  const mineDetectorActive = ref(false)
  const timeFreezeActive = ref(false)
  const timeFreezeRemaining = ref(0)

  const remainingMines = computed(() => mineCount.value - flagCount.value)
  
  const totalCells = computed(() => config.value.rows * config.value.cols)
  const revealedCells = computed(() => {
    return board.value.flat().filter(cell => cell.isRevealed && !cell.isMine).length
  })
  
  const isGameWon = computed(() => {
    return revealedCells.value === totalCells.value - mineCount.value
  })

  const finalScore = computed(() => {
    return Math.floor(baseScore.value * scoreMultiplier.value)
  })

  function initializeGame(newConfig?: Partial<GameConfig>) {
    if (newConfig) {
      config.value = { ...config.value, ...newConfig }
    }
    
    board.value = generateBoard(config.value.rows, config.value.cols)
    gameStatus.value = 'idle'
    mineCount.value = config.value.mines
    flagCount.value = 0
    timeElapsed.value = 0
    isFirstClick.value = true
    
    // Reset score
    baseScore.value = 0
    score.value = 0
    
    // Apply upgrades from previous game
    applyActiveUpgrades()
  }

  function applyActiveUpgrades() {
    scoreMultiplier.value = 1
    extraLives.value = 0
    areaExplosionsLeft.value = 0
    mineDetectorActive.value = false
    timeFreezeActive.value = false
    timeFreezeRemaining.value = 0

    activeUpgrades.value.forEach(upgrade => {
      switch (upgrade.effect.type) {
        case 'score_multiplier':
          scoreMultiplier.value = upgrade.effect.value || 1
          break
        case 'extra_life':
          extraLives.value += upgrade.effect.value || 1
          break
        case 'area_explosion':
          areaExplosionsLeft.value += upgrade.effect.value || 1
          break
      }
    })
  }

  function calculateScore() {
    const difficultyMultiplier = config.value.mines / 10 // Base multiplier based on mine count
    const timeBonus = Math.max(0, 999 - timeElapsed.value) // Bonus for faster completion
    const revealBonus = revealedCells.value * 10 // Points per revealed cell
    
    baseScore.value = Math.floor((revealBonus + timeBonus) * difficultyMultiplier)
    score.value = finalScore.value
  }

  function handleCellClick(row: number, col: number) {
    if (gameStatus.value === 'won' || gameStatus.value === 'lost' || gameStatus.value === 'shop') return
    
    const cell = board.value[row][col]
    if (cell.isRevealed || cell.isFlagged) return

    if (isFirstClick.value) {
      gameStatus.value = 'playing'
      isFirstClick.value = false
      
      revealCell(board.value, row, col, config.value.rows, config.value.cols, config.value.mines, true)
    } else {
      const hitMine = revealCell(board.value, row, col, config.value.rows, config.value.cols, config.value.mines, false)
      
      if (hitMine) {
        if (extraLives.value > 0) {
          // Use extra life
          extraLives.value--
          cell.isMine = false
          cell.isRevealed = true
          // Recalculate neighbor mines for surrounding cells
          recalculateNeighborMines()
        } else {
          calculateScore()
          gameStatus.value = 'lost'
          revealAllMines()
          return
        }
      }
    }

    if (isGameWon.value) {
      calculateScore()
      gameStatus.value = 'won'
      // Show shop after a brief delay
      setTimeout(() => {
        gameStatus.value = 'shop'
      }, 1500)
    }
  }

  function handleCellRightClick(row: number, col: number) {
    if (gameStatus.value === 'won' || gameStatus.value === 'lost' || gameStatus.value === 'shop') return
    
    const cell = board.value[row][col]
    if (cell.isRevealed) return

    const wasRemoving = cell.isFlagged
    toggleFlag(board.value, row, col)
    
    flagCount.value += wasRemoving ? -1 : 1
  }

  function handleAreaExplosion(row: number, col: number) {
    if (areaExplosionsLeft.value <= 0) return false
    
    areaExplosionsLeft.value--
    revealAreaExplosion(board.value, row, col, config.value.rows, config.value.cols)
    recalculateNeighborMines()
    
    if (isGameWon.value) {
      calculateScore()
      gameStatus.value = 'won'
      setTimeout(() => {
        gameStatus.value = 'shop'
      }, 1500)
    }
    
    return true
  }

  function useRevealSafe() {
    const upgrade = activeUpgrades.value.find(u => u.effect.type === 'reveal_safe')
    if (!upgrade) return false
    
    const revealed = revealRandomSafeCells(board.value, config.value.rows, config.value.cols, upgrade.effect.value || 3)
    
    if (revealed > 0 && isGameWon.value) {
      calculateScore()
      gameStatus.value = 'won'
      setTimeout(() => {
        gameStatus.value = 'shop'
      }, 1500)
    }
    
    // Remove the upgrade after use
    activeUpgrades.value = activeUpgrades.value.filter(u => u.cardId !== upgrade.cardId)
    return true
  }

  function activateMineDetector() {
    const upgrade = activeUpgrades.value.find(u => u.effect.type === 'mine_detector')
    if (!upgrade) return false
    
    mineDetectorActive.value = true
    setTimeout(() => {
      mineDetectorActive.value = false
    }, (upgrade.effect.duration || 10) * 1000)
    
    // Remove the upgrade after use
    activeUpgrades.value = activeUpgrades.value.filter(u => u.cardId !== upgrade.cardId)
    return true
  }

  function activateTimeFreeze() {
    const upgrade = activeUpgrades.value.find(u => u.effect.type === 'time_freeze')
    if (!upgrade) return false
    
    timeFreezeActive.value = true
    timeFreezeRemaining.value = upgrade.effect.duration || 30
    
    const interval = setInterval(() => {
      timeFreezeRemaining.value--
      if (timeFreezeRemaining.value <= 0) {
        timeFreezeActive.value = false
        clearInterval(interval)
      }
    }, 1000)
    
    // Remove the upgrade after use
    activeUpgrades.value = activeUpgrades.value.filter(u => u.cardId !== upgrade.cardId)
    return true
  }

  function recalculateNeighborMines() {
    const rows = board.value.length
    const cols = board.value[0].length

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (!board.value[row][col].isMine) {
          let count = 0
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = row + dr
              const nc = col + dc
              if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board.value[nr][nc].isMine) {
                count++
              }
            }
          }
          board.value[row][col].neighborMines = count
        }
      }
    }
  }

  function revealAllMines() {
    board.value.forEach(row => {
      row.forEach(cell => {
        if (cell.isMine) {
          cell.isRevealed = true
        }
      })
    })
  }

  function resetGame() {
    // Clear active upgrades when manually resetting
    activeUpgrades.value = []
    initializeGame()
  }

  function selectUpgrade(card: UpgradeCard | null) {
    if (card) {
      activeUpgrades.value = [{
        cardId: card.id,
        effect: card.effect,
        remainingUses: card.effect.value
      }]
    } else {
      activeUpgrades.value = []
    }
    
    // Start new game
    initializeGame()
  }

  return {
    board,
    gameStatus,
    mineCount,
    flagCount,
    timeElapsed,
    remainingMines,
    config,
    score,
    finalScore,
    extraLives,
    areaExplosionsLeft,
    mineDetectorActive,
    timeFreezeActive,
    activeUpgrades,
    initializeGame,
    handleCellClick,
    handleCellRightClick,
    handleAreaExplosion,
    useRevealSafe,
    activateMineDetector,
    activateTimeFreeze,
    resetGame,
    selectUpgrade
  }
})