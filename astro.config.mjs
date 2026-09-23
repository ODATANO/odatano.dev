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
	// Old docs URLs. The docs were regrouped in September 2026 (one guide per
	// product, operations and internals live on GitHub); these keep the old
	// links alive as static redirect pages.
	redirects: {
		'/docs/quick-start': '/docs/get-started/',
		'/docs/configuration': '/docs/odatano/',
		'/docs/user-guide': '/docs/odatano/',
		'/docs/transaction-workflow': '/docs/odatano/',
		'/docs/plutus': '/docs/odatano/',
		'/docs/reference': '/docs/odatano/',
		'/docs/security': 'https://github.com/ODATANO/ODATANO/blob/main/docs/guides/SECURITY_GUIDE.md',
		'/docs/developer-guide': 'https://github.com/ODATANO/ODATANO/blob/main/docs/guides/DEVELOPER_GUIDE.md',
		'/docs/backend-configuration': 'https://github.com/ODATANO/ODATANO/blob/main/docs/guides/BACKEND_CONFIGURATION.md',
		'/docs/error-handling': 'https://github.com/ODATANO/ODATANO/blob/main/docs/concepts%20%26%20architecture/ERROR_HANDLING.md',
		'/docs/docker-deployment': 'https://github.com/ODATANO/ODATANO/blob/main/docs/guides/DOCKER_DEPLOYMENT.md',
		'/docs/production-deployment': 'https://github.com/ODATANO/ODATANO/blob/main/docs/guides/PRODUCTION_DEPLOYMENT.md',
		'/docs/odatano-mcp': '/docs/mcp/',
		'/docs/nightgate-mcp': '/docs/mcp/',
	},
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
