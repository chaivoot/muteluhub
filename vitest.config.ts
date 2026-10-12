import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  // JSX แบบ React 17+ (ไม่ต้อง import React) สำหรับเทสต์ที่ render component
  esbuild: { jsx: 'automatic' },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@data': path.resolve(__dirname, 'data'),
    },
  },
});
