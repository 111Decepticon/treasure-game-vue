<template>
  <div 
    class="location-card"
    :class="{
      'completed': isCompleted,
      'failed': isFailed
    }"
    @click="$emit('click')"
  >
    <div class="location-icon">{{ locationData.icon || '📍' }}</div>
    <div class="location-name">{{ locationData.title }}</div>
    <div class="location-description">{{ locationData.subtitle }}</div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useGameStore } from '../../store'

export default {
  name: 'LocationCard',
  props: {
    locationId: {
      type: String,
      required: true
    },
    locationData: {
      type: Object,
      required: true
    }
  },
  emits: ['click'],
  setup(props) {
    const gameStore = useGameStore()
    
    const isCompleted = computed(() => 
      gameStore.completedLocations.includes(props.locationId)
    )
    
    const isFailed = computed(() => 
      gameStore.locationProgress[props.locationId] === 'failed'
    )
    
    return {
      isCompleted,
      isFailed
    }
  }
}
</script>

<style scoped>
.location-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 150px;
  border: 2px solid transparent;
}

.location-card:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-5px);
  border-color: #ffcc00;
}

.location-card.completed {
  border-color: #4CAF50;
  background: rgba(76, 175, 80, 0.2);
}

.location-card.failed {
  border-color: #f44336;
  background: rgba(244, 67, 54, 0.2);
}

.location-icon {
  font-size: 3rem;
  margin-bottom: 10px;
}

.location-name {
  font-size: 1.2rem;
  font-weight: 600;
}

.location-description {
  font-size: 0.9rem;
  margin-top: 5px;
  opacity: 0.8;
}
</style>