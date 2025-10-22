<template>
  <div class="audio-controls">
    <button 
      class="audio-btn"
      :class="{ active: bgmEnabled }"
      @click="toggleBgm"
    >
      {{ bgmEnabled ? '🔊' : '🔇' }} 背景音乐
    </button>
    <button 
      class="audio-btn"
      :class="{ active: sfxEnabled }"
      @click="toggleSfx"
    >
      {{ sfxEnabled ? '🔊' : '🔇' }} 音效
    </button>
    <slot></slot>
  </div>
</template>

<script>
import { useGameStore } from '../../store'

export default {
  name: 'AudioControls',
  setup() {
    const gameStore = useGameStore()
    
    const toggleBgm = () => {
      gameStore.bgmEnabled = !gameStore.bgmEnabled
    }
    
    const toggleSfx = () => {
      gameStore.soundEffectsEnabled = !gameStore.soundEffectsEnabled
    }
    
    return {
      bgmEnabled: gameStore.bgmEnabled,
      sfxEnabled: gameStore.soundEffectsEnabled,
      toggleBgm,
      toggleSfx
    }
  }
}
</script>

<style scoped>
.audio-controls {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin: 1rem 0;
}

.audio-btn {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 5px;
}

.audio-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.audio-btn.active {
  background: #ffcc00;
  color: #000;
}

@media (max-width: 600px) {
  .audio-controls {
    flex-direction: column;
    gap: 10px;
  }
}
</style>