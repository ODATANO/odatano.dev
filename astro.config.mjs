// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
	site: 'https://odatano.dev',
	integrations: [mdx(), sitemap()],
	markdown: {
		shikiConfig: {
			theme: 'css-variables',
		},
	},
	// Pre-bundle animejs up front so Vite's dev server does not re-discover and
	// re-optimize it on the fly, which caused repeated "504 Outdated Optimize
	// Dep" reloads (the page appeared to hang on first render). Dev-only; the
	// production build is unaffected.
	vite: {
		optimizeDeps: {
			include: ['animejs'],
		},
	},
});
