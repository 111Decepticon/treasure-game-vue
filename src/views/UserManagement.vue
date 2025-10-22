<template>
  <div class="user-management">
    <div class="container">
      <!-- 未登录状态 -->
      <div v-if="!authStore.isLoggedIn" class="not-logged-in">
        <div class="login-prompt">
          <div class="prompt-icon">🔐</div>
          <h2>请先登录</h2>
          <p>登录后可以查看和管理您的游戏数据</p>
          <button @click="$router.push('/login')" class="login-btn">
            立即登录
          </button>
        </div>
      </div>

      <!-- 已登录状态 -->
      <div v-else class="user-content">
        <header class="user-header">
          <div class="user-avatar">
            <span class="avatar-icon">{{ authStore.user.avatar }}</span>
          </div>
          <div class="user-info">
            <h1>{{ authStore.user.username }}</h1>
            <p class="user-email">{{ authStore.user.email }}</p>
            <p class="join-date">加入时间：{{ formatDate(authStore.user.joinDate) }}</p>
          </div>
          <button @click="handleLogout" class="logout-btn">
            退出登录
          </button>
        </header>

        <div class="content-grid">
          <!-- 游戏统计 -->
          <div class="stats-section">
            <h2>🎮 游戏统计</h2>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-icon">🏆</div>
                <div class="stat-info">
                  <div class="stat-value">{{ gameStats.completedGames }}</div>
                  <div class="stat-label">完成游戏</div>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">⏱️</div>
                <div class="stat-info">
                  <div class="stat-value">{{ gameStats.totalPlayTime }}h</div>
                  <div class="stat-label">总游戏时间</div>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">⚡</div>
                <div class="stat-info">
                  <div class="stat-value">{{ gameStats.bestTime || '--:--' }}</div>
                  <div class="stat-label">最佳时间</div>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">🌟</div>
                <div class="stat-info">
                  <div class="stat-value">{{ gameStats.successRate }}%</div>
                  <div class="stat-label">成功率</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 个人信息编辑 -->
          <div class="profile-section">
            <h2>👤 个人信息</h2>
            <div class="profile-card">
              <form @submit.prevent="handleUpdateProfile" class="profile-form">
                <div class="form-row">
                  <div class="form-group">
                    <label>用户名</label>
                    <input
                      v-model="profileForm.username"
                      type="text"
                      placeholder="请输入用户名"
                    >
                  </div>
                  <div class="form-group">
                    <label>邮箱</label>
                    <input
                      v-model="profileForm.email"
                      type="email"
                      placeholder="请输入邮箱"
                    >
                  </div>
                </div>
                
                <div class="form-group">
                  <label>头像</label>
                  <div class="avatar-options">
                    <div
                      v-for="avatar in avatarOptions"
                      :key="avatar"
                      class="avatar-option"
                      :class="{ selected: profileForm.avatar === avatar }"
                      @click="profileForm.avatar = avatar"
                    >
                      {{ avatar }}
                    </div>
                  </div>
                </div>

                <div class="form-actions">
                  <button type="submit" class="save-btn" :disabled="updating">
                    {{ updating ? '保存中...' : '保存更改' }}
                  </button>
                  <button type="button" @click="resetForm" class="cancel-btn">
                    重置
                  </button>
                </div>

                <div v-if="updateMessage" class="message" :class="{ error: !updateMessage.success }">
                  {{ updateMessage.text }}
                </div>
              </form>
            </div>
          </div>

          <!-- 游戏进度 -->
          <div class="progress-section">
            <h2>📊 游戏进度</h2>
            <div class="progress-card">
              <div class="progress-header">
                <span>总体进度</span>
                <span>{{ gameStore.globalProgress.toFixed(1) }}%</span>
              </div>
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{ width: gameStore.globalProgress + '%' }"
                ></div>
              </div>
              
              <div class="locations-progress">
                <div 
                  v-for="location in locations" 
                  :key="location.id"
                  class="location-progress-item"
                >
                  <span class="location-name">{{ location.name }}</span>
                  <span class="location-status" :class="getLocationStatus(location.id)">
                    {{ getLocationStatusText(location.id) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store'
import { useGameStore } from '../store'

export default {
  name: 'UserManagement',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const gameStore = useGameStore()

    const updating = ref(false)
    const updateMessage = ref(null)

    const avatarOptions = ['👤', '👨', '👩', '🧙', '🦸', '🐱', '🐼', '🌟']

    const profileForm = reactive({
      username: '',
      email: '',
      avatar: '👤'
    })

    const locations = [
      { id: 'library', name: '古老图书馆' },
      { id: 'temple', name: '失落神庙' },
      { id: 'cave', name: '神秘洞穴' },
      { id: 'beach', name: '沉船海滩' },
      { id: 'mountain', name: '远古山脉' },
      { id: 'treasure', name: '宝藏密室' }
    ]

    // 计算游戏统计
    const gameStats = computed(() => {
      const completedCount = gameStore.completedLocations.length
      const totalLocations = locations.length
      
      return {
        completedGames: completedCount,
        totalPlayTime: Math.round(completedCount * 0.5), // 模拟游戏时间
        bestTime: completedCount > 0 ? '15:23' : null,
        successRate: completedCount > 0 ? Math.round((completedCount / totalLocations) * 100) : 0
      }
    })

    const handleUpdateProfile = async () => {
      updating.value = true
      updateMessage.value = null

      try {
        const result = await authStore.updateProfile(profileForm)
        updateMessage.value = { text: result.message, success: result.success }
      } catch (error) {
        updateMessage.value = { text: '更新失败，请重试', success: false }
      } finally {
        updating.value = false
      }
    }

    const handleLogout = () => {
      authStore.logout()
      router.push('/')
    }

    const resetForm = () => {
      if (authStore.user) {
        profileForm.username = authStore.user.username
        profileForm.email = authStore.user.email
        profileForm.avatar = authStore.user.avatar
      }
      updateMessage.value = null
    }

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('zh-CN')
    }

    const getLocationStatus = (locationId) => {
      if (gameStore.completedLocations.includes(locationId)) {
        return 'completed'
      } else if (gameStore.locationProgress[locationId] === 'failed') {
        return 'failed'
      } else {
        return 'pending'
      }
    }

    const getLocationStatusText = (locationId) => {
      const status = getLocationStatus(locationId)
      const statusMap = {
        completed: '已完成',
        failed: '失败',
        pending: '未开始'
      }
      return statusMap[status]
    }

    onMounted(() => {
      // 初始化表单数据
      if (authStore.user) {
        profileForm.username = authStore.user.username
        profileForm.email = authStore.user.email
        profileForm.avatar = authStore.user.avatar
      }
    })

    return {
      authStore,
      gameStore,
      updating,
      updateMessage,
      profileForm,
      avatarOptions,
      locations,
      gameStats,
      handleUpdateProfile,
      handleLogout,
      resetForm,
      formatDate,
      getLocationStatus,
      getLocationStatusText
    }
  }
}
</script>

<style scoped>
.user-management {
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* 未登录状态样式 */
.not-logged-in {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.login-prompt {
  background: rgba(255, 255, 255, 0.95);
  padding: 3rem;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.prompt-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.login-prompt h2 {
  color: #333;
  margin-bottom: 0.5rem;
}

.login-prompt p {
  color: #666;
  margin-bottom: 2rem;
}

.login-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

/* 已登录状态样式 */
.user-header {
  background: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.user-avatar .avatar-icon {
  font-size: 3rem;
  display: block;
}

.user-info {
  flex: 1;
}

.user-info h1 {
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.8rem;
}

.user-email {
  color: #666;
  margin-bottom: 0.25rem;
}

.join-date {
  color: #888;
  font-size: 0.9rem;
}

.logout-btn {
  background: #f8f9fa;
  color: #666;
  border: 2px solid #e9ecef;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: #dc3545;
  color: white;
  border-color: #dc3545;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.stats-section {
  grid-column: 1 / -1;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-top: 1rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.95);
  padding: 1.5rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 2rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #667eea;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
}

.profile-section,
.progress-section {
  background: rgba(255, 255, 255, 0.95);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.profile-section h2,
.progress-section h2 {
  color: #333;
  margin-bottom: 1rem;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
}

.form-group input {
  padding: 10px 12px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.avatar-options {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}

.avatar-option {
  padding: 0.5rem;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.2rem;
}

.avatar-option:hover {
  border-color: #667eea;
}

.avatar-option.selected {
  border-color: #667eea;
  background: #f0f4ff;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.save-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-1px);
}

.save-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.cancel-btn {
  background: #f8f9fa;
  color: #666;
  border: 2px solid #e9ecef;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
}

.cancel-btn:hover {
  background: #e9ecef;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.progress-bar {
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.locations-progress {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.location-progress-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.location-name {
  color: #333;
}

.location-status {
  font-size: 0.9rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.location-status.completed {
  background: #d4edda;
  color: #155724;
}

.location-status.failed {
  background: #f8d7da;
  color: #721c24;
}

.location-status.pending {
  background: #fff3cd;
  color: #856404;
}

.message {
  padding: 0.75rem;
  border-radius: 6px;
  text-align: center;
  font-weight: 500;
}

.message:not(.error) {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .user-header {
    flex-direction: column;
    text-align: center;
  }
  
  .avatar-options {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 480px) {
  .user-management {
    padding: 1rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>