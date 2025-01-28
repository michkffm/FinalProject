import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
<<<<<<< HEAD
    host: `0.0.0.0`
  }
=======
    host: '0.0.0.0',
  },
>>>>>>> 8f0bd0f302c3b38c90e1a01d920181255afca643
})
