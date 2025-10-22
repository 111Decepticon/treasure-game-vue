<template>
  <footer class="app-footer">
    <div class="footer-content">
      <p>多地点寻宝游戏 - 使用 Vue 3 + Pinia 构建</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped>
.app-footer {
  background: rgba(0, 0, 0, 0.8);
  color: white;
  text-align: center;
  padding: 1rem;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}
</style>