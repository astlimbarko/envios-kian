import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const config = {
    plugins: [vue()],
    css: {
      postcss: {
        plugins: [
          tailwindcss,
          autoprefixer,
        ],
      },
    },
    optimizeDeps: {
      include: ['tailwindcss', 'autoprefixer'],
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    }
  }

  // Configuración específica para producción (GitHub Pages)
  if (command === 'build') {
    config.base = '/ENVIOS-KIAN/' // Reemplaza con el nombre de tu repositorio
  }

  return config
})
