import { defineConfig } from 'astro/config';

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  site: 'http://localhost',
  output: 'server',
  server: {
    port: 80,
    host: true
  },
  adapter: node({
    mode: "standalone"
  })
});