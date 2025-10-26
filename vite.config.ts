import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
  },
  // Esta opción fuerza un slash al final de todas las rutas
  // útil para React Router en Vercel
  server: { fs: { strict: false } }
})
