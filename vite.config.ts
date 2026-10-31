import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    // Agent worktrees live under .claude/ and would run their own stale copies of the tests.
    exclude: [...configDefaults.exclude, '.claude/**'],
    // Chile's offset is what makes UTC-based date code go wrong after 21:00.
    env: { TZ: 'America/Santiago' },
    // Node 25+ ships its own localStorage, which hides jsdom's and breaks zustand persist.
    execArgv: ['--no-experimental-webstorage'],
  },
})
