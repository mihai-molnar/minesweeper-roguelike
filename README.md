# Vue Minesweeper

A modern, fully functional Minesweeper game built with Vue 3, TypeScript, and Pinia.

## Features

### Core Gameplay
- **Classic Minesweeper gameplay** with three difficulty levels
- **Responsive design** that works on desktop and mobile devices
- **Touch support** with long-press for flagging on mobile
- **Timer functionality** tracks your game time
- **Mine counter** shows remaining mines
- **Clean, retro-styled UI** reminiscent of classic Windows Minesweeper
- **Type-safe** implementation with TypeScript

### 🛒 Shop & Upgrade System
- **Post-game shop** appears after completing a game
- **Upgrade cards** with different rarities (Common, Rare, Epic, Legendary)
- **Score system** with multipliers and time bonuses
- **Extensible card system** for easy addition of new upgrades

### Available Upgrades
- **💖 Extra Life** - Survive one mine explosion
- **🎯 Score Multiplier** - 2x or 3x score multipliers
- **💥 Area Explosion** - Clear a 3x3 area, destroying mines inside
- **🔍 Safe Reveal** - Reveal 3 random safe cells
- **📡 Mine Detector** - Highlight all mines for 10 seconds
- **⏸️ Time Freeze** - Stop the timer for 30 seconds

## Difficulty Levels

- **Beginner**: 9×9 grid with 10 mines
- **Intermediate**: 16×16 grid with 40 mines  
- **Expert**: 16×30 grid with 99 mines

## How to Play

### Basic Controls
1. **Left-click** or **tap** to reveal a cell
2. **Right-click** or **long-press** (mobile) to flag/unflag a cell
3. Numbers indicate how many mines are adjacent to that cell
4. Find all cells without mines to win
5. Click the smiley face to restart the game

### Upgrade System
1. **Complete a game** (win or lose) to access the shop
2. **Choose one upgrade card** from three randomly selected options
3. **Use upgrades** in your next game:
   - Click upgrade buttons during gameplay for active abilities
   - Passive upgrades (Extra Life, Score Multiplier) work automatically
   - Area Explosion: Click the 💥 indicator, then click any cell to explode a 3x3 area

### Scoring
- **Base Score**: Points for revealed cells + time bonus
- **Difficulty Multiplier**: Higher for more challenging boards
- **Upgrade Multipliers**: 2x or 3x score boosts from upgrade cards

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone or download this project
2. Navigate to the project directory:
   ```bash
   cd vue-minesweeper
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```

The game will be available at `http://localhost:3000`

### Building for Production

Create a production build:
```bash
npm run build
```

The built files will be in the `dist` directory.

### Type Checking

Run TypeScript type checking:
```bash
npm run type-check
```

## Project Structure

```
src/
├── components/          # Vue components
│   ├── GameBoard.vue   # Main game board container
│   ├── GameCell.vue    # Individual cell component
│   └── GameHeader.vue  # Header with timer and controls
├── composables/        # Vue composables
│   └── useTimer.ts     # Timer functionality
├── stores/             # Pinia stores
│   └── gameStore.ts    # Game state management
├── utils/              # Utility functions
│   └── gameLogic.ts    # Core game logic
├── types.ts            # TypeScript type definitions
├── style.css           # Global styles
├── App.vue             # Main application component
└── main.ts             # Application entry point
```

## Technologies Used

- **Vue 3** with Composition API
- **TypeScript** for type safety
- **Pinia** for state management
- **Vite** for fast development and building
- **CSS3** for styling and animations

## Game Logic

The game implements classic Minesweeper rules:

- **Safe first click**: The first cell clicked is guaranteed to be safe
- **Auto-reveal**: Clicking on a cell with no adjacent mines automatically reveals surrounding cells
- **Mine placement**: Mines are randomly distributed, avoiding the first clicked cell and its neighbors
- **Win condition**: All non-mine cells must be revealed
- **Lose condition**: Any mine cell is revealed

## Mobile Support

The game includes full mobile support:

- **Responsive layout** adapts to different screen sizes
- **Touch-friendly** cell sizes and interactions
- **Long-press flagging** for mobile devices
- **Prevents context menu** on long press

## License

This project is open source and available under the MIT License.