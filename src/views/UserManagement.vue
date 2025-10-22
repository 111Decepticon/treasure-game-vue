<template>
  <div class="user-management">
    <div class="container">
      <h1>👤 用户管理</h1>
      
      <div class="user-stats">
        <div class="stat-card">
          <h3>游戏统计</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">5</div>
              <div class="stat-label">完成次数</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">83%</div>
              <div class="stat-label">成功率</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">12:34</div>
              <div class="stat-label">最佳时间</div>
            </div>
          </div>
        </div>
      </div>

      <div class="profile-card">
        <h2>个人信息</h2>
        <div class="profile-form">
          <div class="form-group">
            <label>用户名</label>
            <input type="text" v-model="userForm.username" class="form-input">
          </div>
          <div class="form-group">
            <label>邮箱</label>
            <input type="email" v-model="userForm.email" class="form-input">
          </div>
          <div class="form-group">
            <label>密码</label>
            <input type="password" v-model="userForm.password" class="form-input">
          </div>
          <button class="save-btn" @click="updateProfile">保存更改</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'UserManagement',
  setup() {
    const userForm = ref({
      username: '宝藏猎人',
      email: 'treasure@example.com',
      password: ''
    })
    
    const updateProfile = () => {
      alert('个人信息已更新！')
    }
    
    return {
      userForm,
      updateProfile
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
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  color: white;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2.5rem;
}

.user-stats {
  margin-bottom: 2rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.9);
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 1rem;
}

.stat-card h3 {
  margin-bottom: 1rem;
  color: #333;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.stat-item {
  text-align: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffcc00;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
}

.profile-card {
  background: rgba(255, 255, 255, 0.9);
  padding: 2rem;
  border-radius: 10px;
}

.profile-card h2 {
  margin-bottom: 1.5rem;
  color: #333;
}

.profile-form {
  max-width: 400px;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

.save-btn {
  background: #ffcc00;
  color: #000;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  margin-top: 1rem;
}

.save-btn:hover {
  background: #ffd700;
}

@media (max-width: 600px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>