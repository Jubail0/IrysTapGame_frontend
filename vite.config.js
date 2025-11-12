// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// You typically do NOT need to import 'tailwindcss/vite'.
// Tailwind CSS usually works via PostCSS config.

// https://vitejs.dev/config/
export default defineConfig({
  // 💡 SOLUTION: Set base to relative path for deployment
  base: './', 

  plugins: [react()],
  
  server: {
    port: 5173,
    host: true,
  },
  
  build: {
    outDir: "dist",
  },
  
  // You might need a PostCSS setup if Tailwind isn't working
  // if you don't have postcss.config.js, but often it works out of the box.
  // Check your project root for 'postcss.config.js'
});
