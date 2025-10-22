<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <div class="card-header">
          <h1>🔐 用户登录</h1>
          <p>登录以保存您的游戏进度和成就</p>
        </div>

        <div class="tab-container">
          <button 
            class="tab-button" 
            :class="{ active: activeTab === 'login' }"
            @click="activeTab = 'login'"
          >
            登录
          </button>
          <button 
            class="tab-button" 
            :class="{ active: activeTab === 'register' }"
            @click="activeTab = 'register'"
          >
            注册
          </button>
        </div>

        <!-- 登录表单 -->
        <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="auth-form">
          <div class="form-group">
            <label for="username">用户名</label>
            <input
              id="username"
              v-model="loginForm.username"
              type="text"
              placeholder="请输入用户名"
              required
            >
          </div>

          <div class="form-group">
            <label for="password">密码</label>
            <input
              id="password"
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              required
            >
          </div>

          <button type="submit" class="submit-btn" :disabled="loading">
            {{ loading ? '登录中...' : '登录' }}
          </button>

          <div v-if="message" class="message" :class="{ error: !message.success }">
            {{ message.text }}
          </div>
        </form>

        <!-- 注册表单 -->
        <form v-if="activeTab === 'register'" @submit.prevent="handleRegister" class="auth-form">
          <div class="form-group">
            <label for="reg-username">用户名</label>
            <input
              id="reg-username"
              v-model="registerForm.username"
              type="text"
              placeholder="请输入用户名"
              required
            >
          </div>

          <div class="form-group">
            <label for="reg-email">邮箱</label>
            <input
              id="reg-email"
              v-model="registerForm.email"
              type="email"
              placeholder="请输入邮箱"
              required
            >
          </div>

          <div class="form-group">
            <label for="reg-password">密码</label>
            <input
              id="reg-password"
              v-model="registerForm.password"
              type="password"
              placeholder="请输入密码（至少6位）"
              required
              minlength="6"
            >
          </div>

          <div class="form-group">
            <label for="reg-confirm-password">确认密码</label>
            <input
              id="reg-confirm-password"
              v-model="registerForm.confirmPassword"
              type="password"
              placeholder="请再次输入密码"
              required
            >
          </div>

          <button type="submit" class="submit-btn" :disabled="loading">
            {{ loading ? '注册中...' : '注册' }}
          </button>

          <div v-if="message" class="message" :class="{ error: !message.success }">
            {{ message.text }}
          </div>
        </form>

        <div class="card-footer">
          <button @click="$router.push('/')" class="back-btn">
            ← 返回首页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()

    const activeTab = ref('login')
    const loading = ref(false)
    const message = ref(null)

    const loginForm = ref({
      username: '',
      password: ''
    })

    const registerForm = ref({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    })

    const handleLogin = async () => {
      loading.value = true
      message.value = null

      try {
        const result = await authStore.login(loginForm.value)
        
        if (result.success) {
          message.value = { text: result.message, success: true }
          setTimeout(() => {
            router.push('/users')
          }, 1000)
        } else {
          message.value = { text: result.message, success: false }
        }
      } catch (error) {
        message.value = { text: '登录失败，请重试', success: false }
      } finally {
        loading.value = false
      }
    }

    const handleRegister = async () => {
      // 验证密码匹配
      if (registerForm.value.password !== registerForm.value.confirmPassword) {
        message.value = { text: '两次输入的密码不一致', success: false }
        return
      }

      // 验证密码长度
      if (registerForm.value.password.length < 6) {
        message.value = { text: '密码长度至少6位', success: false }
        return
      }

      loading.value = true
      message.value = null

      try {
        const result = await authStore.register(registerForm.value)
        
        if (result.success) {
          message.value = { text: result.message, success: true }
          setTimeout(() => {
            router.push('/users')
          }, 1000)
        } else {
          message.value = { text: result.message, success: false }
        }
      } catch (error) {
        message.value = { text: '注册失败，请重试', success: false }
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      // 如果已经登录，跳转到用户管理页面
      if (authStore.isLoggedIn) {
        router.push('/users')
      }
    })

    return {
      activeTab,
      loading,
      message,
      loginForm,
      registerForm,
      handleLogin,
      handleRegister
    }
  }
}
</script>

<style scoped>
.login-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-container {
  width: 100%;
  max-width: 450px;
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.card-header {
  text-align: center;
  margin-bottom: 2rem;
}

.card-header h1 {
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.8rem;
}

.card-header p {
  color: #666;
  margin: 0;
}

.tab-container {
  display: flex;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 2rem;
}

.tab-button {
  flex: 1;
  padding: 12px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.tab-button.active {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.submit-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.message {
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
  margin-top: 1rem;
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

.card-footer {
  margin-top: 2rem;
  text-align: center;
}

.back-btn {
  background: transparent;
  color: #666;
  border: 2px solid #e9ecef;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: #f8f9fa;
  border-color: #667eea;
  color: #667eea;
}

@media (max-width: 480px) {
  .login-card {
    padding: 2rem 1.5rem;
  }
  
  .card-header h1 {
    font-size: 1.5rem;
  }
}
</style>