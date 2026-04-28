import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Change 'realtime-object-detection' to your actual GitHub repo name
export default defineConfig({
  plugins: [react()],
  base: '/realtime-object-detection/',
})
