import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Markdown from 'vite-plugin-md'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), Markdown()],
  optimizeDeps: {
    include: ['color', 'mersenne-twister']
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        pure_funcs: ['console.log'],
        drop_debugger: true,
      }
    }
  }
})
