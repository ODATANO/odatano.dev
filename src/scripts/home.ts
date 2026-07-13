/**
 * Homepage animations (anime.js v4).
 *
 * Everything runs inside a Scope with a reduced-motion media query: when
 * `prefers-reduced-motion: reduce` matches, nothing is registered and the
 * static day→dusk→night section backgrounds remain. Initial hidden states
 * live in CSS behind `html.reveal-ready` / `html.sky-active`, which are only
 * added here — no JS means everything is visible.
 *
 * Animates transform / opacity / SVG-draw only — no layout properties.
 */
import {
  animate,
  createTimeline,
  createScope,
  onScroll,
  stagger,
  svg,
  utils,
} from "animejs";

if (document.querySelector(".hero")) {
  createScope({
    mediaQueries: { reduceMotion: "(prefers-reduced-motion: reduce)" },
  }).add((scope) => {
    if (!scope || scope.matches.reduceMotion) return;

    const root = document.documentElement;
    root.classList.add("reveal-ready");
    root.classList.add("sky-active");

    /* ── Sky — the page scrolls from day into night ─────────────
       The night overlay's opacity is synced to overall scroll
       progress. Keyframe proportions keep the hero in daylight, start
       dusk around the Services section, and ramp fully into night from
       the Ecosystem section onward. */
    animate(".sky__night", {
      opacity: [
        { to: 0.08, duration: 15 },
        { to: 0.35, duration: 25 },
        { to: 0.9, duration: 30 },
        { to: 1, duration: 30 },
      ],
      ease: "linear",
      autoplay: onScroll({
        target: "main",
        enter: "top top",
        leave: "bottom bottom",
        sync: 0.35,
      }),
    });
    animate(".sky__stars", {
      opacity: [
        { to: 0, duration: 42 },
        { to: 0.95, duration: 58 },
      ],
      ease: "linear",
      autoplay: onScroll({
        target: "main",
        enter: "top top",
        leave: "bottom bottom",
        sync: 0.35,
      }),
    });

    /* ── Hero — headline mask reveal, then the terminal types in ── */
    createTimeline({ defaults: { ease: "outExpo" } })
      .add(".hl-word", {
        opacity: [0, 1],
        translateY: ["110%", "0%"],
        duration: 900,
        delay: stagger(120),
      })
      .add(
        ".hero__sub",
        { opacity: [0, 1], translateY: [12, 0], duration: 600 },
        "-=550"
      )
      .add(
        ".hero__actions",
        { opacity: [0, 1], translateY: [12, 0], duration: 600 },
        "-=450"
      )
      .add(
        ".hero__code-box",
        { opacity: [0, 1], translateY: [18, 0], duration: 700 },
        "-=500"
      )
      .add(
        ".hero__code-box .code-line",
        { opacity: [0, 1], translateX: [-8, 0], duration: 400, delay: stagger(70) },
        "-=400"
      );

    /* ── Stats — numbers count up when the bar scrolls in ─────── */
    document
      .querySelectorAll<HTMLElement>(".stats-bar__value[data-count-to]")
      .forEach((el) => {
        const target = Number(el.dataset.countTo);
        const suffix = el.dataset.countSuffix ?? "";
        if (!Number.isFinite(target)) return;
        const counter = { n: 0 };
        animate(counter, {
          n: target,
          duration: 1600,
          ease: "outExpo",
          modifier: utils.round(0),
          onUpdate: () => {
            el.textContent = counter.n + suffix;
          },
          autoplay: onScroll({ target: el, enter: "bottom top" }),
        });
      });

    /* ── Duality — the moon rises, the sun turns, night glows ─── */
    animate(".duality__night-glow", {
      opacity: [0, 1],
      ease: "linear",
      autoplay: onScroll({
        target: ".duality__grid",
        enter: "bottom top",
        leave: "center center",
        sync: 0.3,
      }),
    });
    animate(".duality__sun svg", {
      rotate: [-90, 0],
      scale: [0.6, 1],
      duration: 900,
      ease: "outBack",
      autoplay: onScroll({ target: ".duality__panel--day", enter: "bottom-=10% top" }),
    });
    animate(".duality__moon svg", {
      translateY: [14, 0],
      rotate: [-25, 0],
      scale: [0.6, 1],
      duration: 900,
      ease: "outBack",
      autoplay: onScroll({ target: ".duality__panel--night", enter: "bottom-=10% top" }),
    });

    /* ── Architecture — flow lines draw in, packets travel ────── */
    document
      .querySelectorAll<SVGSVGElement>(".arch__flow")
      .forEach((flow, i) => {
        const path = flow.querySelector<SVGPathElement>(".arch__flow-path");
        const heads = flow.querySelectorAll<SVGElement>(".arch__flow-head");
        if (!path) return;

        const tl = createTimeline({
          autoplay: onScroll({ target: ".arch", enter: "bottom-=10% top" }),
        });
        tl.add(svg.createDrawable(path), {
          draw: ["0 0", "0 1"],
          duration: 900,
          delay: i * 150,
          ease: "inOutQuad",
        });
        if (heads.length) {
          tl.add(heads, { opacity: [0, 0.75], duration: 300 }, "-=250");
        }
      });

    // One packet per ROW: it travels app → plugin, reappears on the
    // plugin → chain segment, then returns the same way. The two flow
    // SVGs of a row share a single shuttling dot.
    const rowFlows: SVGSVGElement[][] = [
      Array.from(
        document.querySelectorAll<SVGSVGElement>(
          ".arch__flow:not(.arch__flow--night)"
        )
      ),
      Array.from(
        document.querySelectorAll<SVGSVGElement>(".arch__flow--night")
      ),
    ];
    rowFlows.forEach((flows, row) => {
      const p1 = flows[0]?.querySelector<SVGElement>(".arch__packet");
      const p2 = flows[1]?.querySelector<SVGElement>(".arch__packet");
      if (!p1 || !p2) return;
      const seg = 1100;
      const fade = () => [
        { to: 0.85, duration: 130 },
        { to: 0.85, duration: seg - 260 },
        { to: 0, duration: 130 },
      ];
      createTimeline({
        loop: true,
        loopDelay: 500 + row * 350,
        defaults: { ease: "inOutSine", duration: seg },
        autoplay: onScroll({ target: ".arch", enter: "bottom-=10% top" }),
      })
        .add(p1, { cx: [20, 80], opacity: fade() })
        .add(p2, { cx: [20, 80], opacity: fade() })
        .add(p2, { cx: [80, 20], opacity: fade() })
        .add(p1, { cx: [80, 20], opacity: fade() });
    });

    /* ── Ecosystem — the twins meet in the middle ─────────────── */
    createTimeline({
      defaults: { ease: "outExpo", duration: 700 },
      autoplay: onScroll({ target: ".ecosystem__twins", enter: "bottom-=10% top" }),
    })
      .add(".ecosystem__twin--day", { opacity: [0, 1], translateX: [-36, 0] })
      .add(".ecosystem__twin--night", { opacity: [0, 1], translateX: [36, 0] }, "<<")
      .add(
        ".ecosystem__twins-label",
        { opacity: [0, 1], scale: [0.75, 1], duration: 450, ease: "outBack" },
        "-=250"
      );

    return () => {
      root.classList.remove("sky-active");
    };
  });
}
