import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: './', // 重要：设置为相对路径，确保GitHub Pages能正确加载资源
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})