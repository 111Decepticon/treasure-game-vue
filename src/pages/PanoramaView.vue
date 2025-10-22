<template>
  <div class="panorama-view">
    <div class="container">
      <header>
        <h1>🏴‍☠️ 多地点寻宝游戏 🗺️</h1>
        <p class="subtitle">探索不同地点，收集线索，找到传说中的宝藏！</p>
      </header>
      
      <div class="panorama-map">
        <div 
          v-for="location in locations" 
          :key="location.id"
          class="location"
          :class="{
            'completed': isCompleted(location.id),
            'failed': isFailed(location.id)
          }"
          @click="enterLocation(location.id)"
        >
          <div class="location-icon">{{ location.icon }}</div>
          <div class="location-name">{{ location.name }}</div>
          <div class="location-description">{{ location.description }}</div>
        </div>
      </div>
      
      <div class="progress-bar">
        <div class="progress" :style="{ width: progress + '%' }"></div>
      </div>
      
      <div class="treasure-result">
        探索进度: {{ completedCount }}/{{ totalLocations }} 个地点
      </div>
      
       <div class="audio-controls">
  <button class="audio-btn" :class="{ active: gameStore.bgmEnabled }" @click="handleAudioButtonClick(gameStore.toggleBgm)">
    {{ gameStore.bgmEnabled ? '🔊' : '🔇' }} 背景音乐
  </button>
  <button class="audio-btn" :class="{ active: gameStore.soundEffectsEnabled }" @click="handleAudioButtonClick(gameStore.toggleSoundEffects)">
    {{ gameStore.soundEffectsEnabled ? '🔊' : '🔇' }} 音效
  </button>
  <button class="audio-btn reset-btn" @click="resetGame">
    🔄 重新开始
  </button>
</div>
      
      <footer>
        多地点寻宝游戏 - 使用 localStorage 保存进度
      </footer>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../store'

export default {
  name: 'PanoramaView',
  setup() {
    const router = useRouter()
    const gameStore = useGameStore()
    
    const locations = [
      { id: 'library', name: '古老图书馆', description: '寻找初始线索', icon: '📚' },
      { id: 'temple', name: '失落神庙', description: '解码古代文字', icon: '🏛️' },
      { id: 'cave', name: '神秘洞穴', description: '避开守卫陷阱', icon: '🕳️' },
      { id: 'beach', name: '沉船海滩', description: '寻找藏宝图', icon: '🏖️' },
      { id: 'mountain', name: '远古山脉', description: '解读星象线索', icon: '⛰️' },
      { id: 'treasure', name: '宝藏密室', description: '打开宝藏箱', icon: '💎' }
    ]
    
    // 计算属性
    const completedCount = computed(() => gameStore.completedLocations.length)
    const totalLocations = computed(() => locations.length)
    const progress = computed(() => (completedCount.value / totalLocations.value) * 100)
    
    // 方法
    const enterLocation = (locationId) => {
      gameStore.markUserInteracted() // 标记用户交互
      gameStore.playSound('click')
      gameStore.setCurrentLocation(locationId)
      router.push(`/location/${locationId}`)
    }
    
    const isCompleted = (locationId) => {
      return gameStore.completedLocations.includes(locationId)
    }
    
    const isFailed = (locationId) => {
      return gameStore.locationProgress[locationId] === 'failed'
    }
    
    const resetGame = () => {
      if (confirm('确定要重新开始吗？所有进度将被清空！')) {
        gameStore.markUserInteracted() // 标记用户交互
        gameStore.playSound('click')
        gameStore.resetGame()
      }
    }
    
    // 处理音频按钮点击
    const handleAudioButtonClick = (action) => {
      gameStore.markUserInteracted() // 标记用户交互
      action()
    }
    
    // 生命周期
    onMounted(() => {
      gameStore.loadGameState()
      // 不再自动播放音乐，等待用户交互
    })
    
    onUnmounted(() => {
      gameStore.stopBgm()
    })
    
    return {
      locations,
      gameStore,
      completedCount,
      totalLocations,
      progress,
      enterLocation,
      isCompleted,
      isFailed,
      resetGame,
      handleAudioButtonClick
    }
  }
}
</script>
<style scoped>
.panorama-view {
  background: linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d);
  color: #fff;
  min-height: 100vh;
  padding: 15px;
}

.container {
  max-width: 900px;
  width: 100%;
  text-align: center;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  position: relative;
  margin: 40px auto;
}

header {
  margin-bottom: 20px;
  padding: 15px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}

h1 {
  font-size: 2.2rem;
  margin-bottom: 5px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.subtitle {
  font-size: 1rem;
  opacity: 0.9;
}

.panorama-map {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin: 20px 0;
}

.location {
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

.location:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-5px);
  border-color: #ffcc00;
}

.location.completed {
  border-color: #4CAF50;
  background: rgba(76, 175, 80, 0.2);
}

.location.failed {
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

.progress-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  margin: 15px 0;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: #ffcc00;
  width: 0%;
  transition: width 0.3s ease;
}

.treasure-result {
  font-size: 1.2rem;
  font-weight: bold;
  padding: 15px;
  background: rgba(255, 215, 0, 0.2);
  border-radius: 10px;
  margin-top: 15px;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.audio-controls {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 10px;
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

.audio-btn.reset-btn {
  background: #f44336;
  color: #fff;
}

footer {
  margin-top: 15px;
  padding: 10px;
  font-size: 0.8rem;
  opacity: 0.7;
}

@media (max-width: 768px) {
  .panorama-map {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 600px) {
  .container {
    padding: 10px;
  }
  
  h1 {
    font-size: 1.8rem;
  }
  
  .panorama-map {
    grid-template-columns: 1fr;
  }
  
  .audio-controls {
    flex-direction: column;
    gap: 10px;
  }
}
</style>