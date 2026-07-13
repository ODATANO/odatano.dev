/**
 * Sitewide scroll-reveal, driven by anime.js.
 *
 * Contract (unchanged from the previous IntersectionObserver version):
 * - `.reveal-ready` on <html> gates the hidden initial state in CSS, and is
 *   only added here after the reduced-motion check — without JS or with
 *   reduced motion, content is always fully visible.
 * - Elements are grouped by parent; siblings stagger by 70 ms.
 *
 * Elements inside `.ecosystem__twins` are skipped: home.ts animates the twin
 * cards with a dedicated timeline (opposing x-slides).
 */
import { animate, onScroll } from "animejs";

const SELECTOR = [
  ".section__header",
  ".feature-card",
  ".arch__col",
  ".stack__item",
  ".step",
  ".example-card",
  ".code-demo__panel",
  ".stats-bar__item",
  ".duality__panel",
  ".services__group-title",
  ".closing-cta__inner",
].join(", ");

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Signal the inline head-script that the animation module booted —
// without this marker it lifts the reveal gate again after 2 s.
document.documentElement.classList.add("anim-booted");

if (!reduce) {
  const els = Array.from(
    document.querySelectorAll<HTMLElement>(SELECTOR)
  ).filter((el) => !el.closest(".ecosystem__twins"));

  if (els.length > 0) {
    document.documentElement.classList.add("reveal-ready");

    const groups = new Map<Element | null, HTMLElement[]>();
    els.forEach((el) => {
      el.setAttribute("data-reveal", "");
      const arr = groups.get(el.parentElement) ?? [];
      arr.push(el);
      groups.set(el.parentElement, arr);
    });

    groups.forEach((group) => {
      group.forEach((el, i) => {
        animate(el, {
          opacity: [0, 1],
          translateY: [20, 0],
          duration: 700,
          delay: i * 70,
          ease: "outExpo",
          autoplay: onScroll({ target: el, enter: "bottom-=8% top" }),
        });
      });
    });
  }
}
