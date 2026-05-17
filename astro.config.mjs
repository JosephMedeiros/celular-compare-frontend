import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://JosephMedeiros.github.io',
  base: '/celular-compare-frontend', 
  integrations: [],
  vite: {
    plugins: [tailwindcss()],
  },
  output: 'static'
});
