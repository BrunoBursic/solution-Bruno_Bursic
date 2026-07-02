import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'node',
      env: {
        VITE_API_BASE_URL: 'https://dummyjson.com',
      },
    },
  }),
)
