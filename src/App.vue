<template>
  <div id="app">
    <SakuraMenu />
    <main class="main-content">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { useAuthStore } from './store'
import SakuraMenu from './components/layout/SakuraMenu.vue'
import Footer from './components/layout/Footer.vue'

export default {
  name: 'App',
  components: {
    SakuraMenu,
    Footer
  },
  setup() {
    const authStore = useAuthStore()
    
    onMounted(() => {
      // 初始化时检查认证状态
      authStore.checkAuthStatus()
    })
  }
}
</script>

<!-- 样式保持不变 -->

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
  background: #1a1a1a;
  color: white;
  min-height: 100vh;
}

.main-content {
  min-height: calc(100vh - 120px);
}

#app {
  min-height: 100vh;
}
</style>