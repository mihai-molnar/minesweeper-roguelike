<template>
  <div class="shop-page">
    <div class="shop-header">
      <h2>🛒 Upgrade Shop</h2>
      <p class="shop-subtitle">Choose one upgrade for your next game!</p>
      <div class="score-display">
        <span class="score-label">Final Score:</span>
        <span class="score-value">{{ finalScore }}</span>
      </div>
    </div>

    <div class="upgrade-cards">
      <div
        v-for="card in availableCards"
        :key="card.id"
        class="upgrade-card"
        :class="[`rarity-${card.rarity}`, { selected: selectedCard?.id === card.id }]"
        @click="selectCard(card)"
      >
        <div class="card-header">
          <div class="card-icon">{{ card.icon }}</div>
          <div class="card-rarity">{{ card.rarity.toUpperCase() }}</div>
        </div>
        
        <div class="card-content">
          <h3 class="card-name">{{ card.name }}</h3>
          <p class="card-description">{{ card.description }}</p>
        </div>
        
        <div class="card-effect">
          <span class="effect-text">{{ getEffectText(card) }}</span>
        </div>
      </div>
    </div>

    <div class="shop-actions">
      <button
        class="confirm-button"
        :disabled="!selectedCard"
        @click="confirmSelection"
      >
        {{ selectedCard ? `Choose ${selectedCard.name}` : 'Select an Upgrade' }}
      </button>
      
      <button class="skip-button" @click="skipUpgrade">
        Skip Upgrade
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { UpgradeCard } from '../types'
import { getRandomUpgradeCards } from '../utils/upgradeCards'

interface Props {
  finalScore: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  upgradeSelected: [card: UpgradeCard | null]
}>()

const availableCards = ref<UpgradeCard[]>([])
const selectedCard = ref<UpgradeCard | null>(null)

function selectCard(card: UpgradeCard) {
  selectedCard.value = selectedCard.value?.id === card.id ? null : card
}

function confirmSelection() {
  if (selectedCard.value) {
    emit('upgradeSelected', selectedCard.value)
  }
}

function skipUpgrade() {
  emit('upgradeSelected', null)
}

function getEffectText(card: UpgradeCard): string {
  const effect = card.effect
  switch (effect.type) {
    case 'score_multiplier':
      return `${effect.value}x Score Multiplier`
    case 'extra_life':
      return `+${effect.value} Extra Life`
    case 'area_explosion':
      return `${effect.value} Area Blast`
    case 'reveal_safe':
      return `Reveal ${effect.value} Safe Cells`
    case 'mine_detector':
      return `${effect.duration}s Mine Detection`
    case 'time_freeze':
      return `${effect.duration}s Time Freeze`
    default:
      return 'Special Effect'
  }
}

onMounted(() => {
  availableCards.value = getRandomUpgradeCards(3)
})
</script>

<style scoped>
.shop-page {
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
}

.shop-header {
  margin-bottom: 30px;
}

.shop-header h2 {
  color: #333;
  margin-bottom: 10px;
  font-size: 2.5rem;
}

.shop-subtitle {
  color: #666;
  font-size: 1.2rem;
  margin-bottom: 15px;
}

.score-display {
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  border: 3px solid #daa520;
  border-radius: 10px;
  padding: 10px 20px;
  display: inline-block;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.score-label {
  font-weight: bold;
  color: #8b6914;
  margin-right: 10px;
}

.score-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #8b6914;
}

.upgrade-cards {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.upgrade-card {
  width: 250px;
  background: white;
  border-radius: 15px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border: 3px solid transparent;
  position: relative;
  overflow: hidden;
}

.upgrade-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--rarity-color);
}

.upgrade-card.rarity-common {
  --rarity-color: #9e9e9e;
}

.upgrade-card.rarity-rare {
  --rarity-color: #2196f3;
}

.upgrade-card.rarity-epic {
  --rarity-color: #9c27b0;
}

.upgrade-card.rarity-legendary {
  --rarity-color: #ff9800;
  background: linear-gradient(135deg, #fff8e1, #ffffff);
}

.upgrade-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.2);
}

.upgrade-card.selected {
  border-color: #4caf50;
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 8px 25px rgba(76, 175, 80, 0.3);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.card-icon {
  font-size: 2.5rem;
}

.card-rarity {
  font-size: 0.8rem;
  font-weight: bold;
  color: var(--rarity-color);
  background: rgba(0,0,0,0.1);
  padding: 4px 8px;
  border-radius: 12px;
}

.card-content {
  margin-bottom: 15px;
}

.card-name {
  font-size: 1.3rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.card-description {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.4;
}

.card-effect {
  background: rgba(0,0,0,0.05);
  padding: 10px;
  border-radius: 8px;
  border-left: 4px solid var(--rarity-color);
}

.effect-text {
  font-weight: bold;
  color: #333;
  font-size: 0.9rem;
}

.shop-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.confirm-button {
  background: linear-gradient(135deg, #4caf50, #66bb6a);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.confirm-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #43a047, #5cb85c);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(76, 175, 80, 0.4);
}

.confirm-button:disabled {
  background: #cccccc;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.skip-button {
  background: #f5f5f5;
  color: #666;
  border: 2px solid #ddd;
  padding: 15px 30px;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.skip-button:hover {
  background: #eeeeee;
  border-color: #bbb;
}

@media (max-width: 768px) {
  .upgrade-cards {
    flex-direction: column;
    align-items: center;
  }
  
  .upgrade-card {
    width: 100%;
    max-width: 300px;
  }
  
  .shop-actions {
    flex-direction: column;
    align-items: center;
  }
}
</style>