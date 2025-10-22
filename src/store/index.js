import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // 用户状态
  const user = ref(null)
  const isAuthenticated = ref(false)
  const token = ref(null)

  // 计算属性
  const currentUser = computed(() => user.value)
  const isLoggedIn = computed(() => isAuthenticated.value)

  // 动作方法
  const login = async (credentials) => {
    try {
      // 模拟登录API调用
      const response = await mockLogin(credentials)
      
      user.value = response.user
      token.value = response.token
      isAuthenticated.value = true

      // 保存到localStorage
      localStorage.setItem('auth_token', token.value)
      localStorage.setItem('user_data', JSON.stringify(user.value))

      return { success: true, message: '登录成功' }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  const register = async (userData) => {
    try {
      // 模拟注册API调用
      const response = await mockRegister(userData)
      
      user.value = response.user
      token.value = response.token
      isAuthenticated.value = true

      // 保存到localStorage
      localStorage.setItem('auth_token', token.value)
      localStorage.setItem('user_data', JSON.stringify(user.value))

      return { success: true, message: '注册成功' }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    isAuthenticated.value = false

    // 清除localStorage
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
  }

  const updateProfile = async (profileData) => {
    try {
      // 模拟更新用户信息
      const response = await mockUpdateProfile(profileData)
      user.value = { ...user.value, ...response.user }

      // 更新localStorage
      localStorage.setItem('user_data', JSON.stringify(user.value))

      return { success: true, message: '个人信息更新成功' }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  const checkAuthStatus = () => {
    const savedToken = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('user_data')

    if (savedToken && savedUser) {
      token.value = savedToken
      user.value = JSON.parse(savedUser)
      isAuthenticated.value = true
    }
  }

  // 模拟API函数
  const mockLogin = (credentials) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 模拟验证
        if (credentials.username && credentials.password) {
          resolve({
            user: {
              id: 1,
              username: credentials.username,
              email: `${credentials.username}@example.com`,
              avatar: '👤',
              joinDate: new Date().toISOString(),
              gameStats: {
                completedGames: 0,
                totalPlayTime: 0,
                bestTime: null
              }
            },
            token: 'mock_jwt_token_' + Date.now()
          })
        } else {
          reject(new Error('用户名或密码不能为空'))
        }
      }, 1000)
    })
  }

  const mockRegister = (userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (userData.username && userData.password && userData.email) {
          resolve({
            user: {
              id: Date.now(),
              username: userData.username,
              email: userData.email,
              avatar: '👤',
              joinDate: new Date().toISOString(),
              gameStats: {
                completedGames: 0,
                totalPlayTime: 0,
                bestTime: null
              }
            },
            token: 'mock_jwt_token_' + Date.now()
          })
        } else {
          reject(new Error('请填写完整信息'))
        }
      }, 1000)
    })
  }

  const mockUpdateProfile = (profileData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          user: profileData
        })
      }, 800)
    })
  }

  return {
    // 状态
    user,
    isAuthenticated,
    token,

    // 计算属性
    currentUser,
    isLoggedIn,

    // 动作方法
    login,
    register,
    logout,
    updateProfile,
    checkAuthStatus
  }
})

// 游戏状态管理
export const useGameStore = defineStore('game', () => {
  // 游戏状态
  const currentLocation = ref('')
  const completedLocations = ref([])
  const locationProgress = ref({})
  
  // 音频设置
  const bgmEnabled = ref(true)
  const soundEffectsEnabled = ref(true)
  const locationBgmEnabled = ref(true)
  
  // 用户交互标记（用于音频自动播放）
  const userInteracted = ref(false)

  // 计算属性
  const globalProgress = computed(() => {
    const total = 6 // 总地点数
    return (completedLocations.value.length / total) * 100
  })

  // 方法
  const setCurrentLocation = (locationId) => {
    currentLocation.value = locationId
  }

  const completeLocation = (locationId) => {
    if (!completedLocations.value.includes(locationId)) {
      completedLocations.value.push(locationId)
    }
    locationProgress.value[locationId] = 'completed'
    saveGameState()
  }

  const failLocation = (locationId) => {
    locationProgress.value[locationId] = 'failed'
    saveGameState()
  }

  const resetGame = () => {
    currentLocation.value = ''
    completedLocations.value = []
    locationProgress.value = {}
    saveGameState()
  }

  const saveGameState = () => {
    const state = {
      completedLocations: completedLocations.value,
      locationProgress: locationProgress.value,
      bgmEnabled: bgmEnabled.value,
      soundEffectsEnabled: soundEffectsEnabled.value,
      locationBgmEnabled: locationBgmEnabled.value
    }
    localStorage.setItem('treasure_game_state', JSON.stringify(state))
  }

  const loadGameState = () => {
    const saved = localStorage.getItem('treasure_game_state')
    if (saved) {
      const state = JSON.parse(saved)
      completedLocations.value = state.completedLocations || []
      locationProgress.value = state.locationProgress || {}
      bgmEnabled.value = state.bgmEnabled !== undefined ? state.bgmEnabled : true
      soundEffectsEnabled.value = state.soundEffectsEnabled !== undefined ? state.soundEffectsEnabled : true
      locationBgmEnabled.value = state.locationBgmEnabled !== undefined ? state.locationBgmEnabled : true
    }
  }

  // 修复音频控制方法 - 添加错误处理
  const toggleBgm = () => {
    bgmEnabled.value = !bgmEnabled.value
    saveGameState()
  }

  const toggleSoundEffects = () => {
    soundEffectsEnabled.value = !soundEffectsEnabled.value
    saveGameState()
  }

  const toggleLocationBgm = () => {
    locationBgmEnabled.value = !locationBgmEnabled.value
    saveGameState()
  }

  const playSound = (type) => {
    if (!soundEffectsEnabled.value) return
    try {
      // 这里可以调用 useAudio.js 中的 playSound 方法
      console.log(`Play sound: ${type}`)
    } catch (error) {
      console.warn('Audio play failed:', error)
    }
  }

  const playLocationBgm = (locationId) => {
    if (!locationBgmEnabled.value) return
    try {
      console.log(`Play BGM for: ${locationId}`)
    } catch (error) {
      console.warn('BGM play failed:', error)
    }
  }

  const stopBgm = () => {
    try {
      console.log('Stop BGM')
    } catch (error) {
      console.warn('BGM stop failed:', error)
    }
  }

  const markUserInteracted = () => {
    userInteracted.value = true
  }

  // 与用户关联的方法
  const updateUserGameStats = () => {
    const authStore = useAuthStore()
    if (authStore.isLoggedIn) {
      // 更新用户的游戏统计
      const completedCount = completedLocations.value.length
      // 这里可以添加更多统计逻辑
    }
  }

  return {
    // 状态
    currentLocation,
    completedLocations,
    locationProgress,
    bgmEnabled,
    soundEffectsEnabled,
    locationBgmEnabled,
    userInteracted,
    
    // 计算属性
    globalProgress,
    
    // 方法
    setCurrentLocation,
    completeLocation,
    failLocation,
    resetGame,
    saveGameState,
    loadGameState,
    toggleBgm,
    toggleSoundEffects,
    toggleLocationBgm,
    playSound,
    playLocationBgm,
    stopBgm,
    markUserInteracted,
    updateUserGameStats
  }
})