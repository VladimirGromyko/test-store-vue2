import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
// const { createVuePlugin } = require('vite-plugin-vue2');

// https://vitejs.dev/config/
export default defineConfig({
  base: "/test-store-vue2",
  plugins: [vue()],
  server: {
    port: 8080
  },
})
