import { defineConfig } from 'astro/config';

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
    site: 'https://cats.unknown.sbs',
    output: 'server',
    server: {
        port: 80,
        host: true
    },
    adapter: node({
        mode: "standalone"
    })
});