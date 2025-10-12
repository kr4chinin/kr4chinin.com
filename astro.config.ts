import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://kr4chinin.com',
	server: {
		port: 3000,
	},
	integrations: [mdx()],
	vite: {
		plugins: [tailwindcss()],
	},
});
