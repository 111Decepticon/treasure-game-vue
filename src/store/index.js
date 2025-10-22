import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useGameStore = defineStore('game', () => {
  // 状态
  const currentLocation = ref(null)
  const completedLocations = ref([])
  const locationProgress = ref({})
  
  // 音频状态
  const bgmEnabled = ref(true)
  const locationBgmEnabled = ref(true)
  const soundEffectsEnabled = ref(true)
  const userInteracted = ref(false) // 新增：跟踪用户是否已交互
  
  // 音频对象
  const currentBgm = ref(null)

  // 计算属性
  const globalProgress = computed(() => {
    const total = 6 // 总共6个地点
    const done = completedLocations.value.length
    return (done / total) * 100
  })

  // 音频方法
  const initAudio = () => {
    if (!audioContext.value) {
      audioContext.value = new (window.AudioContext || window.webkitAudioContext)()
    }
  }

  const playSound = (type) => {
    if (!soundEffectsEnabled.value || !userInteracted.value) return
    
    initAudio()
    
    const context = audioContext.value
    let oscillator = context.createOscillator()
    let gainNode = context.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(context.destination)
    
    switch(type) {
      case 'success':
        oscillator.frequency.setValueAtTime(523.25, context.currentTime)
        oscillator.frequency.setValueAtTime(659.25, context.currentTime + 0.1)
        oscillator.frequency.setValueAtTime(783.99, context.currentTime + 0.2)
        gainNode.gain.setValueAtTime(0.3, context.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5)
        oscillator.start(context.currentTime)
        oscillator.stop(context.currentTime + 0.5)
        break
      case 'failure':
        oscillator.frequency.setValueAtTime(392, context.currentTime)
        oscillator.frequency.setValueAtTime(349.23, context.currentTime + 0.1)
        oscillator.frequency.setValueAtTime(329.63, context.currentTime + 0.2)
        gainNode.gain.setValueAtTime(0.3, context.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5)
        oscillator.start(context.currentTime)
        oscillator.stop(context.currentTime + 0.5)
        break
      case 'click':
        oscillator.frequency.setValueAtTime(800, context.currentTime)
        gainNode.gain.setValueAtTime(0.2, context.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1)
        oscillator.start(context.currentTime)
        oscillator.stop(context.currentTime + 0.1)
        break
      case 'complete':
        const notes = [523.25, 659.25, 783.99, 1046.50]
        notes.forEach((freq, i) => {
          setTimeout(() => {
            let osc = context.createOscillator()
            let gain = context.createGain()
            osc.connect(gain)
            gain.connect(context.destination)
            osc.frequency.setValueAtTime(freq, context.currentTime)
            gain.gain.setValueAtTime(0.3, context.currentTime)
            gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.3)
            osc.start(context.currentTime)
            osc.stop(context.currentTime + 0.3)
          }, i * 200)
        })
        break
    }
  }

  const playBgm = (bgmPath) => {
    if (!bgmEnabled.value || currentBgm.value || !userInteracted.value) return
    
    try {
      currentBgm.value = new Audio(bgmPath)
      currentBgm.value.loop = true
      currentBgm.value.volume = 0.3
      
      // 处理音频加载错误
      currentBgm.value.addEventListener('error', (e) => {
        console.log('BGM加载失败:', bgmPath, e)
        currentBgm.value = null
      })
      
      const playPromise = currentBgm.value.play()
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          console.log('BGM播放失败:', e)
          currentBgm.value = null
        })
      }
    } catch (error) {
      console.log('BGM错误:', error)
      currentBgm.value = null
    }
  }

  const stopBgm = () => {
    if (currentBgm.value) {
      currentBgm.value.pause()
      currentBgm.value.currentTime = 0
      currentBgm.value = null
    }
  }

  const playLocationBgm = (locationId) => {
    if (!locationBgmEnabled.value || !userInteracted.value) return
    
    stopBgm()
    
    const bgmMap = {
      library: '/audio/library-bgm.mp3',
      temple: '/audio/temple-bgm.mp3',
      cave: '/audio/cave-bgm.mp3',
      beach: '/audio/beach-bgm.mp3',
      mountain: '/audio/mountain-bgm.mp3',
      treasure: '/audio/treasure-bgm.mp3'
    }
    
    const bgmPath = bgmMap[locationId]
    if (bgmPath) {
      playBgm(bgmPath)
    }
  }

  // 标记用户已交互（解决自动播放策略）
  const markUserInteracted = () => {
    if (!userInteracted.value) {
      userInteracted.value = true
      // 重新初始化音频上下文
      initAudio()
    }
  }

  // 游戏方法
  const setCurrentLocation = (locationId) => {
    currentLocation.value = locationId
  }

  const completeLocation = (locationId) => {
    if (!completedLocations.value.includes(locationId)) {
      completedLocations.value.push(locationId)
      playSound('success')
    }
    locationProgress.value[locationId] = 'completed'
    saveGameState()
    
    // 如果完成所有地点，播放完成音效
    if (completedLocations.value.length === 6) {
      playSound('complete')
    }
  }

  const failLocation = (locationId) => {
    locationProgress.value[locationId] = 'failed'
    playSound('failure')
    saveGameState()
  }

  const resetGame = () => {
    currentLocation.value = null
    completedLocations.value = []
    locationProgress.value = {}
    stopBgm()
    localStorage.removeItem('treasureGameState')
  }

  const saveGameState = () => {
    const state = {
      currentLocation: currentLocation.value,
      completedLocations: completedLocations.value,
      locationProgress: locationProgress.value,
      bgmEnabled: bgmEnabled.value,
      locationBgmEnabled: locationBgmEnabled.value,
      soundEffectsEnabled: soundEffectsEnabled.value
    }
    localStorage.setItem('treasureGameState', JSON.stringify(state))
  }

  const loadGameState = () => {
    const savedState = localStorage.getItem('treasureGameState')
    if (savedState) {
      const parsedState = JSON.parse(savedState)
      currentLocation.value = parsedState.currentLocation
      completedLocations.value = parsedState.completedLocations || []
      locationProgress.value = parsedState.locationProgress || {}
      bgmEnabled.value = parsedState.bgmEnabled !== undefined ? parsedState.bgmEnabled : true
      locationBgmEnabled.value = parsedState.locationBgmEnabled !== undefined ? parsedState.locationBgmEnabled : true
      soundEffectsEnabled.value = parsedState.soundEffectsEnabled !== undefined ? parsedState.soundEffectsEnabled : true
    }
  }

  // 音频控制方法
  const toggleBgm = () => {
    markUserInteracted()
    bgmEnabled.value = !bgmEnabled.value
    if (!bgmEnabled.value) {
      stopBgm()
    } else if (currentLocation.value) {
      playLocationBgm(currentLocation.value)
    } else {
      playBgm('/audio/panorama-bgm.mp3')
    }
    saveGameState()
  }

  const toggleLocationBgm = () => {
    markUserInteracted()
    locationBgmEnabled.value = !locationBgmEnabled.value
    if (!locationBgmEnabled.value) {
      stopBgm()
    } else if (currentLocation.value) {
      playLocationBgm(currentLocation.value)
    }
    saveGameState()
  }

  const toggleSoundEffects = () => {
    markUserInteracted()
    soundEffectsEnabled.value = !soundEffectsEnabled.value
    saveGameState()
  }

  // 音频上下文
  const audioContext = ref(null)

  return {
    // 状态
    currentLocation,
    completedLocations,
    locationProgress,
    bgmEnabled,
    locationBgmEnabled,
    soundEffectsEnabled,
    
    // 计算属性
    globalProgress,
    
    // 游戏方法
    setCurrentLocation,
    completeLocation,
    failLocation,
    resetGame,
    saveGameState,
    loadGameState,
    
    // 音频方法
    playSound,
    playBgm,
    stopBgm,
    playLocationBgm,
    toggleBgm,
    toggleLocationBgm,
    toggleSoundEffects,
    markUserInteracted
  }
})