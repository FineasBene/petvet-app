import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const keyFile  = path.join(__dirname, 'certs', 'server.key')
const certFile = path.join(__dirname, 'certs', 'server.crt')
const hasCert  = fs.existsSync(keyFile) && fs.existsSync(certFile)

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    // HTTPS cu certificatul generat (npm run gen-cert)
    https: hasCert
      ? { key: fs.readFileSync(keyFile), cert: fs.readFileSync(certFile) }
      : false,
    proxy: {
      '/api': {
        target: 'https://localhost:3443',
        changeOrigin: true,
        secure: false, // acceptă certificate self-signed
      },
      '/socket.io': {
        target: 'https://localhost:3443',
        ws: true,
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
