export interface Cell {
  id: string
  row: number
  col: number
  isMine: boolean
  isRevealed: boolean
  isFlagged: boolean
  neighborMines: number
}

export interface GameState {
  board: Cell[][]
  gameStatus: 'idle' | 'playing' | 'won' | 'lost' | 'shop'
  mineCount: number
  flagCount: number
  timeElapsed: number
  isFirstClick: boolean
  score: number
  extraLives: number
  areaExplosionsLeft: number
}

export interface GameConfig {
  rows: number
  cols: number
  mines: number
}

export interface UpgradeCard {
  id: string
  name: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  effect: UpgradeEffect
}

export interface UpgradeEffect {
  type: 'score_multiplier' | 'extra_life' | 'area_explosion' | 'reveal_safe' | 'mine_detector' | 'time_freeze'
  value?: number
  duration?: number
}

export interface ActiveUpgrade {
  cardId: string
  effect: UpgradeEffect
  remainingUses?: number
}