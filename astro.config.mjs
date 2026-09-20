// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

/**
 * Wrap every markdown table in <div class="table-wrap"> so the docs can
 * scroll a wide table sideways while it stays a real table (columns line up
 * in every viewport width). Styled in src/styles/global.css.
 */
function rehypeTableWrap() {
	return (tree) => {
		const visit = (node) => {
			if (!node.children) return;
			node.children = node.children.map((child) => {
				if (child.type === 'element' && child.tagName === 'table') {
					return { type: 'element', tagName: 'div', properties: { className: ['table-wrap'] }, children: [child] };
				}
				visit(child);
				return child;
			});
		};
		visit(tree);
	};
}

export default defineConfig({
	site: 'https://odatano.dev',
	integrations: [mdx(), sitemap()],
	markdown: {
		shikiConfig: {
			theme: 'css-variables',
		},
		rehypePlugins: [rehypeTableWrap],
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
