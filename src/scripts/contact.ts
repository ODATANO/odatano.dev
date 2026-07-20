/**
 * Contact form submit handler (Web3Forms).
 *
 * Progressive enhancement: the form works without JS (a normal POST lands on
 * the Web3Forms success page). With JS we intercept, POST via fetch, and show
 * an inline status so the visitor stays on the page.
 */
const form = document.getElementById("contactForm") as HTMLFormElement | null;

if (form) {
  const status = form.querySelector<HTMLParagraphElement>(".contact__status");
  const button = form.querySelector<HTMLButtonElement>("button[type=submit]");

  const setStatus = (text: string, kind?: "ok" | "err") => {
    if (!status) return;
    status.textContent = text;
    status.className = "contact__status" + (kind ? ` contact__status--${kind}` : "");
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const key = (form.elements.namedItem("access_key") as HTMLInputElement | null)?.value;
    if (!key || key === "YOUR_WEB3FORMS_ACCESS_KEY") {
      setStatus("Contact form is not configured yet.", "err");
      return;
    }

    if (button) button.disabled = true;
    setStatus("Sending…");

    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        form.reset();
        setStatus("Thanks! Your message was sent.", "ok");
      } else {
        setStatus(data.message || "Something went wrong. Please try again.", "err");
      }
    } catch {
      setStatus("Network error. Please try again.", "err");
    } finally {
      if (button) button.disabled = false;
    }
  });
}
