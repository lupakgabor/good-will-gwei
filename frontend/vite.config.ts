/// <reference types="vitest" />
import {defineConfig} from 'vite'
import {resolve} from 'path';
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },
    define: {
        // By default, Vite doesn't include but necessary for alchemy-web lib to work
        global: {},
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './vitest.setup.ts',
        cache: false,
    }
})
