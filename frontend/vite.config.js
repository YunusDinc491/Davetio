import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // OneDrive gibi senkronize klasörlerde dosya değişikliklerini bazen
    // işletim sistemi bildirmiyor; polling bunu garanti altına alır.
    watch: {
      usePolling: true,
      interval: 300,
    },
  },
})
