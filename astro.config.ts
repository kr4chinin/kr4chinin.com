import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	server: {
		port: 3000,
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
