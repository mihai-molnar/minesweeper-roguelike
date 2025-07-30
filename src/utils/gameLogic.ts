import type { Cell } from '../types'

export function generateBoard(rows: number, cols: number): Cell[][] {
  const board: Cell[][] = []
  
  for (let row = 0; row < rows; row++) {
    board[row] = []
    for (let col = 0; col < cols; col++) {
      board[row][col] = {
        id: `${row}-${col}`,
        row,
        col,
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0
      }
    }
  }
  
  return board
}

export function placeMines(board: Cell[][], mineCount: number, safeRow: number, safeCol: number): void {
  const rows = board.length
  const cols = board[0].length
  const totalCells = rows * cols
  const safeCells = new Set<string>()
  
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const nr = safeRow + dr
      const nc = safeCol + dc
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        safeCells.add(`${nr}-${nc}`)
      }
    }
  }

  const availablePositions: Array<[number, number]> = []
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!safeCells.has(`${row}-${col}`)) {
        availablePositions.push([row, col])
      }
    }
  }

  const shuffled = availablePositions.sort(() => Math.random() - 0.5)
  
  for (let i = 0; i < Math.min(mineCount, shuffled.length); i++) {
    const [row, col] = shuffled[i]
    board[row][col].isMine = true
  }

  calculateNeighborMines(board)
}

export function calculateNeighborMines(board: Cell[][]): void {
  const rows = board.length
  const cols = board[0].length

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!board[row][col].isMine) {
        let count = 0
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = row + dr
            const nc = col + dc
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].isMine) {
              count++
            }
          }
        }
        board[row][col].neighborMines = count
      }
    }
  }
}

export function revealCell(
  board: Cell[][], 
  row: number, 
  col: number, 
  rows: number, 
  cols: number, 
  mineCount: number, 
  isFirstClick: boolean
): boolean {
  if (isFirstClick) {
    placeMines(board, mineCount, row, col)
  }

  const cell = board[row][col]
  
  if (cell.isMine && !isFirstClick) {
    return true
  }

  if (cell.isRevealed) return false

  cell.isRevealed = true

  if (cell.neighborMines === 0 && !cell.isMine) {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = row + dr
        const nc = col + dc
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !board[nr][nc].isRevealed) {
          revealCell(board, nr, nc, rows, cols, mineCount, false)
        }
      }
    }
  }

  return false
}

export function toggleFlag(board: Cell[][], row: number, col: number): void {
  const cell = board[row][col]
  if (!cell.isRevealed) {
    cell.isFlagged = !cell.isFlagged
  }
}

export function revealAreaExplosion(
  board: Cell[][],
  centerRow: number,
  centerCol: number,
  rows: number,
  cols: number
): void {
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const nr = centerRow + dr
      const nc = centerCol + dc
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        const cell = board[nr][nc]
        if (cell.isMine) {
          cell.isMine = false // Remove mine
        }
        if (!cell.isRevealed) {
          cell.isRevealed = true
          cell.isFlagged = false
        }
      }
    }
  }
}

export function revealRandomSafeCells(
  board: Cell[][],
  rows: number,
  cols: number,
  count: number
): number {
  const safeCells: Array<[number, number]> = []
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = board[row][col]
      if (!cell.isMine && !cell.isRevealed && !cell.isFlagged) {
        safeCells.push([row, col])
      }
    }
  }
  
  const shuffled = safeCells.sort(() => Math.random() - 0.5)
  const toReveal = shuffled.slice(0, Math.min(count, shuffled.length))
  
  toReveal.forEach(([row, col]) => {
    const cell = board[row][col]
    cell.isRevealed = true
    
    // If it's a zero cell, trigger flood fill
    if (cell.neighborMines === 0) {
      revealCell(board, row, col, rows, cols, 0, false)
    }
  })
  
  return toReveal.length
}