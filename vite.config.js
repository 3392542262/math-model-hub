import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// base: './' 让构建产物使用相对路径，可部署到 GitHub Pages 子路径
export default defineConfig({
  plugins: [vue()],
  base: './',
})
