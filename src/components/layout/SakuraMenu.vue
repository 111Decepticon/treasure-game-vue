<template>
  <nav class="sakura-menu">
    <div class="menu-container">
      <router-link to="/" class="logo">
        🏴‍☠️ 寻宝游戏
      </router-link>
      <div class="nav-links">
        <router-link to="/">地图</router-link>
        <router-link to="/ranking">排行榜</router-link>
        
        <!-- 根据登录状态显示不同菜单 -->
        <router-link v-if="authStore.isLoggedIn" to="/users">
          👤 {{ authStore.user.username }}
        </router-link>
        <router-link v-else to="/login">登录</router-link>
      </div>
    </div>
  </nav>
</template>

<script>
import { useAuthStore } from '../../store'

export default {
  name: 'SakuraMenu',
  setup() {
    const authStore = useAuthStore()
    
    return {
      authStore
    }
  }
}
</script>

<!-- 样式保持不变 -->
<style scoped>
.sakura-menu {
  background: rgba(0, 0, 0, 0.8);
  padding: 1rem 0;
  backdrop-filter: blur(10px);
}

.menu-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffcc00;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  transition: background 0.3s;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  background: rgba(255, 204, 0, 0.2);
}
</style>