import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {resolve} from 'node:path';
// Duas páginas: o portfólio (index.html) e a experiência de console (console/index.html)
export default defineConfig({
 plugins: [react()],
 base: './',
 build: {outDir: 'docs', emptyOutDir: true, rollupOptions: {input: {main: resolve(__dirname, 'index.html'), console: resolve(__dirname, 'console/index.html')}}},
});
