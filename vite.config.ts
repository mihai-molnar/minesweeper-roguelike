import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: process.env.NODE_ENV === 'production' ? '/minesweeper-roguelike/' : '/',
  server: {
    port: 3000
  },
  build: {
    assetsDir: 'assets',
    outDir: 'dist'
  }
})