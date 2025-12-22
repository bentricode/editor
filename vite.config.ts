import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import dts from 'vite-plugin-dts'
import { fileURLToPath, URL } from 'node:url'
export default defineConfig({
  plugins: [
    vue(),
    dts({
      rollupTypes: true,
      outDir: 'dist',
      tsconfigPath: './tsconfig.app.json',
    }) 
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    lib: {
      // Múltiplos pontos de entrada
      entry: {
        index: path.resolve(__dirname, 'src/index.ts'),
      },
      name: 'bentricodeEditor',
      formats: ['es'] // 'es' (ES Module) é o mais importante para Vite
    },
    rollupOptions: {
      external: ['vue', '@tabler/icons-vue', 'vuedraggable', 'v-required', 'pinia', 'vue-toastification'],
      output: {
        // Garante que os arquivos de saída mantenham a estrutura de pastas
        entryFileNames: '[name].js',
        // Para o formato UMD, se você usar
        globals: {
          vue: 'Vue',
        }
      }
    }
  }
})