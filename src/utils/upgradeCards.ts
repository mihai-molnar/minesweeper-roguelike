import type { UpgradeCard } from '../types'

export const upgradeCards: UpgradeCard[] = [
  {
    id: 'score_multiplier_2x',
    name: 'Score Booster',
    description: 'Double your score for this game',
    icon: '🎯',
    rarity: 'common',
    effect: {
      type: 'score_multiplier',
      value: 2
    }
  },
  {
    id: 'extra_life',
    name: 'Second Chance',
    description: 'Survive one mine explosion',
    icon: '💖',
    rarity: 'rare',
    effect: {
      type: 'extra_life',
      value: 1
    }
  },
  {
    id: 'area_explosion',
    name: 'Big Bang',
    description: 'Clear a 3x3 area, destroying mines',
    icon: '💥',
    rarity: 'epic',
    effect: {
      type: 'area_explosion',
      value: 1
    }
  },
  {
    id: 'reveal_safe',
    name: 'Safe Reveal',
    description: 'Reveal 3 random safe cells',
    icon: '🔍',
    rarity: 'common',
    effect: {
      type: 'reveal_safe',
      value: 3
    }
  },
  {
    id: 'mine_detector',
    name: 'Mine Detector',
    description: 'Highlight mines for 10 seconds',
    icon: '📡',
    rarity: 'rare',
    effect: {
      type: 'mine_detector',
      duration: 10
    }
  },
  {
    id: 'time_freeze',
    name: 'Time Freeze',
    description: 'Stop the timer for 30 seconds',
    icon: '⏸️',
    rarity: 'epic',
    effect: {
      type: 'time_freeze',
      duration: 30
    }
  },
  {
    id: 'score_multiplier_3x',
    name: 'Super Booster',
    description: 'Triple your score for this game',
    icon: '🌟',
    rarity: 'legendary',
    effect: {
      type: 'score_multiplier',
      value: 3
    }
  }
]

export function getRandomUpgradeCards(count: number = 3): UpgradeCard[] {
  const availableCards = [...upgradeCards]
  const selectedCards: UpgradeCard[] = []
  
  // Weighted selection based on rarity
  const rarityWeights = {
    common: 0.5,
    rare: 0.3,
    epic: 0.15,
    legendary: 0.05
  }
  
  for (let i = 0; i < count && availableCards.length > 0; i++) {
    const randomValue = Math.random()
    let cumulativeWeight = 0
    let selectedCard: UpgradeCard | null = null
    
    // First, filter cards by rarity based on random chance
    for (const [rarity, weight] of Object.entries(rarityWeights)) {
      cumulativeWeight += weight
      if (randomValue <= cumulativeWeight) {
        const cardsOfRarity = availableCards.filter(card => card.rarity === rarity)
        if (cardsOfRarity.length > 0) {
          const randomIndex = Math.floor(Math.random() * cardsOfRarity.length)
          selectedCard = cardsOfRarity[randomIndex]
          break
        }
      }
    }
    
    // Fallback to any available card if no card of selected rarity is found
    if (!selectedCard && availableCards.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableCards.length)
      selectedCard = availableCards[randomIndex]
    }
    
    if (selectedCard) {
      selectedCards.push(selectedCard)
      // Remove selected card to avoid duplicates
      const cardIndex = availableCards.findIndex(card => card.id === selectedCard!.id)
      availableCards.splice(cardIndex, 1)
    }
  }
  
  return selectedCards
}