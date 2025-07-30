import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/minesweeper-roguelike/',
  server: {
    port: 3000
  }
})