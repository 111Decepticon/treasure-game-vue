import { ref, computed } from 'vue'
import { useGameStore } from '../store'

export const useGameState = () => {
  const gameStore = useGameStore()
  
  const locations = {
    library: {
      title: "古老图书馆",
      subtitle: "寻找初始线索",
      steps: [
        { title: "寻找古籍", content: "在古老的图书馆里寻找关于宝藏的第一个线索...", animation: "📚", quiz: null },
        { title: "解读古籍", content: "你找到了一本古籍，但需要解开书中的谜题...", animation: "🔍", quiz: {
          question: "古籍中哪个符号代表'宝藏'？",
          options: [
            { text: "⚡", correct: false },
            { text: "💎", correct: true },
            { text: "🌙", correct: false },
            { text: "🔥", correct: false }
          ]
        }}
      ],
      bgm: "library-bgm",
      resultSuccess: "成功找到线索: '当太阳与月亮相遇，宝石将指引方向'",
      resultFailure: "未能找到线索，需要再次尝试"
    },
    // ... 其他地点配置（与原始代码相同）
  }

  const currentStepIndex = ref(0)
  
  const currentLocationData = computed(() => {
    return locations[gameStore.currentLocation] || null
  })

  const isLocationCompleted = (locationId) => {
    return gameStore.completedLocations.includes(locationId)
  }

  return {
    locations,
    currentStepIndex,
    currentLocationData,
    isLocationCompleted,
    gameStore
  }
}