/* eslint-disable import/no-extraneous-dependencies */
/** @type {import('vite').UserConfig} */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
  },
  define: {
    'global.TYPED_ARRAY_SUPPORT': JSON.stringify(true),
  },
});
