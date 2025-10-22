<template>
  <div class="location-view" v-if="currentLocationData">
    <div class="container">
      <header>
        <h1>{{ currentLocationData.title }}</h1>
        <p class="subtitle">{{ currentLocationData.subtitle }}</p>
      </header>
      
      <div class="progress-bar">
        <div class="progress" :style="{ width: stepProgress + '%' }"></div>
      </div>
      
      <div class="game-area">
        <div
          v-for="(step, index) in currentLocationData.steps"
          :key="index"
          class="step-card"
          :class="{ active: currentStepIndex === index }"
        >
          <div class="step-header">
            <div class="step-number">{{ index + 1 }}</div>
            <h2 class="step-title">{{ step.title }}</h2>
          </div>
          
          <div class="step-content">
            <p>{{ step.content }}</p>
          </div>
          
          <div v-if="step.quiz && currentStepIndex === index" class="quiz-container">
            <div class="quiz-question">{{ step.quiz.question }}</div>
            <div class="quiz-options">
              <button
                v-for="(option, optIndex) in step.quiz.options"
                :key="optIndex"
                class="quiz-option"
                :class="{
                  'correct': showAnswer && option.correct,
                  'incorrect': showAnswer && selectedOption === optIndex && !option.correct
                }"
                @click="handleAnswer(optIndex, option.correct)"
                :disabled="showAnswer"
              >
                {{ option.text }}
              </button>
            </div>
          </div>
          
          <div class="step-animation">
            <div class="animation-icon">{{ step.animation }}</div>
          </div>
        </div>
      </div>
      
      <div class="treasure-result">
        {{ resultMessage }}
      </div>
      
      <div class="controls">
        <button
          @click="startLocationGame"
          :disabled="isCompleted || isInProgress"
        >
          {{ startButtonText }}
        </button>
        <button @click="goBack">
          返回地图
        </button>
      </div>
      
      <div class="audio-controls">
        <button class="audio-btn" :class="{ active: gameStore.locationBgmEnabled }" @click="gameStore.toggleLocationBgm">
          {{ gameStore.locationBgmEnabled ? '🔊' : '🔇' }} 地点音乐
        </button>
      </div>
      
      <footer>
        <div>{{ currentLocationData.title }} - {{ currentLocationData.subtitle }}</div>
      </footer>
    </div>
  </div>
  <div v-else class="loading">
    地点不存在或加载中...
    <button @click="goBack" class="back-btn">返回地图</button>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGameStore } from '../store'

export default {
  name: 'LocationView',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const gameStore = useGameStore()
    
    // 响应式数据
    const currentStepIndex = ref(0)
    const isInProgress = ref(false)
    const showAnswer = ref(false)
    const selectedOption = ref(null)
    const resultMessage = ref('任务尚未开始...')
    
    // 地点配置 - 修复为完整的配置对象
    const locationsConfig = {
      library: {
        title: "古老图书馆",
        subtitle: "寻找初始线索",
        steps: [
          {
            title: "寻找古籍",
            content: "在古老的图书馆里寻找关于宝藏的第一个线索...",
            animation: "📚",
            quiz: null
          },
          {
            title: "解读古籍",
            content: "你找到了一本古籍，但需要解开书中的谜题...",
            animation: "🔍",
            quiz: {
              question: "古籍中哪个符号代表'宝藏'？",
              options: [
                { text: "⚡", correct: false },
                { text: "💎", correct: true },
                { text: "🌙", correct: false },
                { text: "🔥", correct: false }
              ]
            }
          }
        ],
        resultSuccess: "成功找到线索: '当太阳与月亮相遇，宝石将指引方向'",
        resultFailure: "未能找到线索，需要再次尝试"
      },
      temple: {
        title: "失落神庙",
        subtitle: "解码古代文字",
        steps: [
          {
            title: "进入神庙",
            content: "根据线索，你来到了失落的神庙，寻找古代文字...",
            animation: "🏛️",
            quiz: null
          },
          {
            title: "解读文字",
            content: "你发现了刻在墙上的古代文字，需要正确解读...",
            animation: "🔍",
            quiz: {
              question: "古代文字中哪个图案代表'入口'？",
              options: [
                { text: "🚪", correct: true },
                { text: "🔑", correct: false },
                { text: "🗝️", correct: false },
                { text: "🔒", correct: false }
              ]
            }
          }
        ],
        resultSuccess: "成功解码! 线索指向神秘洞穴",
        resultFailure: "解码失败，需要重新尝试"
      },
      cave: {
        title: "神秘洞穴",
        subtitle: "避开守卫陷阱",
        steps: [
          {
            title: "进入洞穴",
            content: "你来到了神秘洞穴，需要小心避开守卫...",
            animation: "🕳️",
            quiz: null
          },
          {
            title: "避开陷阱",
            content: "洞穴中有古老的守卫机制，需要巧妙避开...",
            animation: "⚔️",
            quiz: {
              question: "如何避开洞穴中的陷阱？",
              options: [
                { text: "快速冲过去", correct: false },
                { text: "沿着墙边行走", correct: true },
                { text: "大声喊叫", correct: false },
                { text: "闭上眼睛", correct: false }
              ]
            }
          }
        ],
        resultSuccess: "成功避开守卫! 找到了一个神秘箱子",
        resultFailure: "被守卫发现，需要重新尝试"
      },
      beach: {
        title: "沉船海滩",
        subtitle: "寻找藏宝图",
        steps: [
          {
            title: "搜索海滩",
            content: "在沉船海滩上寻找可能的藏宝图...",
            animation: "🏖️",
            quiz: null
          },
          {
            title: "解读地图",
            content: "你找到了一张古老的地图，需要正确解读...",
            animation: "🗺️",
            quiz: {
              question: "地图上的X标记在哪里？",
              options: [
                { text: "棕榈树下", correct: false },
                { text: "大石头下", correct: true },
                { text: "沙滩中央", correct: false },
                { text: "海浪边", correct: false }
              ]
            }
          }
        ],
        resultSuccess: "成功找到藏宝图! 标记指向远古山脉",
        resultFailure: "未能找到藏宝图，需要再次搜索"
      },
      mountain: {
        title: "远古山脉",
        subtitle: "解读星象线索",
        steps: [
          {
            title: "攀登山脉",
            content: "你来到了远古山脉，寻找星象线索...",
            animation: "⛰️",
            quiz: null
          },
          {
            title: "观察星象",
            content: "在山顶观察星象，寻找宝藏的最终位置...",
            animation: "🔭",
            quiz: {
              question: "哪颗星星指向宝藏位置？",
              options: [
                { text: "北极星", correct: false },
                { text: "北斗七星", correct: true },
                { text: "天狼星", correct: false },
                { text: "金星", correct: false }
              ]
            }
          }
        ],
        resultSuccess: "成功解读星象! 宝藏就在前方的密室中",
        resultFailure: "星象解读错误，需要重新观察"
      },
      treasure: {
        title: "宝藏密室",
        subtitle: "打开宝藏箱",
        steps: [
          {
            title: "进入密室",
            content: "你终于来到了宝藏密室，找到了神秘的宝藏箱...",
            animation: "💎",
            quiz: null
          },
          {
            title: "打开宝箱",
            content: "宝藏箱上有最后的谜题，需要解开才能打开...",
            animation: "🎁",
            quiz: {
              question: "宝藏箱上的谜题：什么东西越洗越脏？",
              options: [
                { text: "衣服", correct: false },
                { text: "水", correct: true },
                { text: "肥皂", correct: false },
                { text: "手", correct: false }
              ]
            }
          }
        ],
        resultSuccess: "恭喜!你找到了传说中的宝藏——一颗发光的远古宝石!",
        resultFailure: "未能打开宝藏箱，需要重新尝试"
      }
    }
    
    // 计算属性 - 添加null检查
    const currentLocationData = computed(() => {
      const locationId = route.params.id
      return locationsConfig[locationId] || null
    })
    
    const isCompleted = computed(() => {
      const locationId = route.params.id
      return gameStore.completedLocations.includes(locationId)
    })
    
    const stepProgress = computed(() => {
      if (!currentLocationData.value || !currentLocationData.value.steps) return 0
      return ((currentStepIndex.value + 1) / currentLocationData.value.steps.length) * 100
    })
    
    const startButtonText = computed(() => {
      if (isCompleted.value) return '任务已完成'
      if (isInProgress.value) return '任务进行中...'
      return '开始任务'
    })
    
    // 方法 - 添加错误处理
    const startLocationGame = () => {
      if (isCompleted.value || isInProgress.value || !currentLocationData.value) return
      
      try {
        gameStore.playSound('click')
      } catch (e) {
        console.warn('Sound play failed:', e)
      }
      
      isInProgress.value = true
      currentStepIndex.value = 0
      resultMessage.value = "任务进行中..."
      showAnswer.value = false
      selectedOption.value = null
      
      // 自动进行无答题的步骤
      proceedToNextStep()
    }
    
    const proceedToNextStep = () => {
      if (!currentLocationData.value || !currentLocationData.value.steps) return
      
      const currentStep = currentLocationData.value.steps[currentStepIndex.value]
      
      // 如果当前步骤没有quiz，自动进入下一步
      if (!currentStep.quiz) {
        setTimeout(() => {
          currentStepIndex.value++
          if (currentStepIndex.value < currentLocationData.value.steps.length) {
            proceedToNextStep()
          } else {
            completeLocation()
          }
        }, 1500)
      }
    }
    
    const handleAnswer = (optionIndex, isCorrect) => {
      if (showAnswer.value) return
      
      try {
        gameStore.playSound('click')
      } catch (e) {
        console.warn('Sound play failed:', e)
      }
      
      showAnswer.value = true
      selectedOption.value = optionIndex
      
      setTimeout(() => {
        if (isCorrect) {
          try {
            gameStore.playSound('success')
          } catch (e) {
            console.warn('Sound play failed:', e)
          }
          currentStepIndex.value++
          if (currentStepIndex.value < currentLocationData.value.steps.length) {
            showAnswer.value = false
            selectedOption.value = null
            proceedToNextStep()
          } else {
            completeLocation()
          }
        } else {
          try {
            gameStore.playSound('failure')
          } catch (e) {
            console.warn('Sound play failed:', e)
          }
          failLocation()
        }
      }, 1200)
    }
    
    const completeLocation = () => {
      const locationId = route.params.id
      gameStore.completeLocation(locationId)
      resultMessage.value = currentLocationData.value.resultSuccess
      isInProgress.value = false
    }
    
    const failLocation = () => {
      const locationId = route.params.id
      gameStore.failLocation(locationId)
      resultMessage.value = currentLocationData.value.resultFailure
      isInProgress.value = false
    }
    
    const goBack = () => {
      try {
        gameStore.playSound('click')
      } catch (e) {
        console.warn('Sound play failed:', e)
      }
      router.push('/')
    }
    
    // 生命周期
    onMounted(() => {
      if (!currentLocationData.value) {
        console.warn('Location not found:', route.params.id)
        return
      }
      
      // 播放地点背景音乐
      if (gameStore.locationBgmEnabled) {
        try {
          gameStore.playLocationBgm(route.params.id)
        } catch (e) {
          console.warn('BGM play failed:', e)
        }
      }
      
      // 如果地点已完成，显示成功信息
      if (isCompleted.value) {
        resultMessage.value = currentLocationData.value.resultSuccess
      }
    })
    
    onUnmounted(() => {
      // 停止地点音乐，返回全景时会自动播放全景音乐
      try {
        gameStore.stopBgm()
      } catch (e) {
        console.warn('BGM stop failed:', e)
      }
    })
    
    return {
      currentLocationData,
      currentStepIndex,
      isInProgress,
      showAnswer,
      selectedOption,
      resultMessage,
      gameStore,
      isCompleted,
      stepProgress,
      startButtonText,
      startLocationGame,
      handleAnswer,
      goBack
    }
  }
}
</script>

<style scoped>
.location-view {
  background: linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d);
  color: #fff;
  min-height: 100vh;
  padding: 15px;
}

.loading {
  background: linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d);
  color: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  gap: 20px;
}

.back-btn {
  background: #ffcc00;
  color: #000;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover {
  background: #ffd700;
  transform: translateY(-2px);
}

.container {
  max-width: 900px;
  width: 100%;
  text-align: center;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
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

.game-area {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
  max-height: 400px;
  overflow-y: auto;
  padding: 10px;
}

.step-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  opacity: 0.5;
  transform: scale(0.95);
  transition: all 0.3s ease;
}

.step-card.active {
  opacity: 1;
  transform: scale(1);
}

.step-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.step-number {
  background: #ffcc00;
  color: #000;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 10px;
  box-shadow: 0 0 8px rgba(255, 204, 0, 0.5);
  font-size: 0.9rem;
}

.step-title {
  font-size: 1.2rem;
  font-weight: 600;
}

.step-content {
  text-align: left;
  line-height: 1.4;
  font-size: 0.95rem;
  margin-bottom: 10px;
}

.step-animation {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px 0;
}

.animation-icon {
  font-size: 2rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.quiz-container {
  background: rgba(0, 0, 0, 0.2);
  padding: 10px;
  border-radius: 8px;
  margin: 10px 0;
}

.quiz-question {
  font-size: 1rem;
  margin-bottom: 8px;
}

.quiz-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.quiz-option {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.quiz-option:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
}

.quiz-option.correct {
  background: #4CAF50;
}

.quiz-option.incorrect {
  background: #f44336;
}

.quiz-option:disabled {
  cursor: not-allowed;
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

.controls {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 15px;
}

button {
  background: #ffcc00;
  color: #000;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
}

button:hover:not(:disabled) {
  background: #ffd700;
  transform: translateY(-2px);
}

button:active {
  transform: translateY(1px);
}

button:disabled {
  background: #666;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
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

footer {
  margin-top: 15px;
  padding: 10px;
  font-size: 0.8rem;
  opacity: 0.7;
}

@media (max-width: 600px) {
  .container {
    padding: 10px;
  }

  h1 {
    font-size: 1.8rem;
  }

  .game-area {
    max-height: 350px;
  }

  .step-card {
    padding: 10px;
  }

  .quiz-options {
    grid-template-columns: 1fr;
  }

  .controls {
    flex-direction: column;
  }

  .audio-controls {
    flex-direction: column;
    gap: 10px;
  }
}
</style>