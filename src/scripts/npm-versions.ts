/** Replaces the text of every `[data-npm-pkg]` with the package's `latest`
 *  version from the npm registry; the built version stays on any failure. */
const els = document.querySelectorAll<HTMLElement>("[data-npm-pkg]");

const packages = new Set<string>();
els.forEach((el) => {
  const pkg = el.dataset.npmPkg;
  if (pkg) packages.add(pkg);
});

packages.forEach(async (pkg) => {
  try {
    const res = await fetch(
      `https://registry.npmjs.org/${encodeURIComponent(pkg)}/latest`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) return;
    const { version } = (await res.json()) as { version?: string };
    if (!version) return;
    els.forEach((el) => {
      if (el.dataset.npmPkg === pkg) el.textContent = `v${version}`;
    });
  } catch {
    /* keep the server-rendered fallback */
  }
});
