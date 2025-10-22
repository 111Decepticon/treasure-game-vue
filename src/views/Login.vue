<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <h2>用户登录</h2>
        <p>登录功能开发中...</p>
        <button @click="$router.push('/')" style="margin-top: 20px; padding: 10px 20px; background: #ffcc00; border: none; border-radius: 5px; cursor: pointer;">
          返回首页
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login'
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
  max-width: 400px;
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
}
</style>