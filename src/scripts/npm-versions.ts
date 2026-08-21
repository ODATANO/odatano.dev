/**
 * Live npm version badges.
 *
 * Every element carrying `data-npm-pkg="<package>"` gets its text replaced
 * with the package's current `latest` version from the npm registry
 * (registry.npmjs.org sends `Access-Control-Allow-Origin: *`, so this works
 * from the browser). The server-rendered version stays as the fallback —
 * no JS, a network error, or a slow registry all leave the page as built.
 */
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
