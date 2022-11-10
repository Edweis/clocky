/* eslint-disable import/no-extraneous-dependencies */
/** @type {import('vite').UserConfig} */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';
import GlobalsPolyfills from '@esbuild-plugins/node-globals-polyfill';
import nodePolyfills from 'rollup-plugin-polyfill-node';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills()],
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      // plugins: [
      //   GlobalsPolyfills({
      //     process: true,
      //     buffer: true,
      //   }),
      // ],
    },
  },
  test: {
    environment: 'jsdom',
  },
  // define: { },
  resolve: {
    alias: {
      // process: 'process/browser',
      // stream: 'stream-browserify',
      process: 'rollup-plugin-node-polyfills/polyfills/process-es6',
      buffer: 'rollup-plugin-node-polyfills/polyfills/buffer-es6',
      stream: 'rollup-plugin-node-polyfills/polyfills/stream',
      util: 'rollup-plugin-node-polyfills/polyfills/util',
      './runtimeConfig': './runtimeConfig.browser',
    },
  },
});
