import { globSync } from 'glob'
import { resolve } from 'path'
import kirby from 'vite-plugin-kirby'
import VitePluginBrowserSync from 'vite-plugin-browser-sync'

const input = globSync([
  'src/index.{js,scss}',
  'src/*.{js,scss}'
]).map(path => resolve(process.cwd(), path))

export default ({ mode }) => ({
  root: 'src',
  base: mode === 'development' ? '/' : '/dist/',

  resolve: {
    alias: [{ find: '@', replacement: resolve(__dirname, 'src') }]
  },

  build: {
    outDir: resolve(process.cwd(), 'public/dist'),
    emptyOutDir: true,
    rollupOptions: { input }
  },

  server: {
    // WIP dynamic (use by vite-plugin-kirby dev server for assets)
    host: '192.168.12.120'
  },

  plugins: [
    kirby(),
    VitePluginBrowserSync({
      dev: {
        bs: {
          port: 8080,
          proxy: 'localhost:8888',
          notify: false,
          codeSync: true,
          files: [
            'site/blueprints/**/*.yml'
          ].map(path => resolve(process.cwd(), path))
        }
      }
    })
  ],

  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use '/style/_helpers' as *;
          @use '/style/_devices' as *;
          $env: ${mode};
        `
      }
    }
  }
})
