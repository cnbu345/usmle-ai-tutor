export default defineConfig({
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "primevue/resources/themes/lara-light-blue/theme.css";`
      }
    }
  }
})
