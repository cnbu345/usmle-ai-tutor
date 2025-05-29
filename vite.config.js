import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  base: '/',
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "primevue/resources/themes/lara-light-blue/theme.css";`
      }
    }
  }
});