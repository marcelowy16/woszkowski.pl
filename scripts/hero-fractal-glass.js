(() => {
  const heroSection = document.querySelector(".hero");
  const heroBackground = document.querySelector(".hero-background");
  const glassGrid = heroBackground?.querySelector(".hero-fractal-glass-panels");

  if (
    !(heroSection instanceof HTMLElement) ||
    !(heroBackground instanceof HTMLElement) ||
    !(glassGrid instanceof HTMLElement)
  ) {
    return;
  }

  if (glassGrid.dataset.fractalGlassReady === "true") {
    return;
  }

  const cellCount = 33;
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
  const fragment = document.createDocumentFragment();
  const cells = [];
  const lerpFactor = 0.05;
  const parallaxStrength = 1;
  const baseBackgroundPositionX = 100;
  const baseBackgroundPositionY = 50;
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const state = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    active: false,
    frameId: 0,
    heroInView: true,
  };

  const formatPercent = (value) => `${value.toFixed(3)}%`;

  for (let index = 0; index < cellCount; index += 1) {
    const cell = document.createElement("span");
    const cellPosition = 1.5 + index * 3;
    const reflectionPosition = index === 9 ? 30.5 : 3 + index * 3;

    cell.className = "hero-fractal-glass-cell";
    cell.setAttribute("aria-hidden", "true");
    cell.style.setProperty("--cell-bg-position", formatPercent(cellPosition));
    cell.style.setProperty("--cell-reflection-position", formatPercent(reflectionPosition));
    fragment.appendChild(cell);
    cells.push({ element: cell, cellPosition, reflectionPosition });
  }

  glassGrid.replaceChildren(fragment);
  glassGrid.dataset.fractalGlassReady = "true";
  heroBackground.dataset.heroFractalGlassReady = "true";

  const applyParallax = () => {
    const offsetX = state.x * parallaxStrength * 5;
    const offsetY = state.y * parallaxStrength * -2.2;
    const reflectionOffsetX = state.x * parallaxStrength * 3.6;

    heroBackground.style.setProperty("--hero-glass-base-position-x", formatPercent(baseBackgroundPositionX + offsetX * 0.45));
    heroBackground.style.setProperty("--hero-glass-base-position-y", formatPercent(baseBackgroundPositionY + offsetY * 0.45));
    heroBackground.style.setProperty("--hero-glass-panel-position-x", formatPercent(baseBackgroundPositionX + offsetX * 0.3));
    heroBackground.style.setProperty("--hero-glass-panel-position-y", formatPercent(baseBackgroundPositionY + offsetY * 0.3));

    for (const cell of cells) {
      cell.element.style.setProperty("--cell-bg-position", formatPercent(cell.cellPosition + offsetX));
      cell.element.style.setProperty(
        "--cell-reflection-position",
        formatPercent(cell.reflectionPosition + reflectionOffsetX)
      );
    }
  };

  const shouldAnimate = () => state.heroInView && !document.hidden && !reducedMotionQuery.matches && finePointerQuery.matches;

  const stopAnimation = () => {
    if (!state.frameId) {
      return;
    }

    window.cancelAnimationFrame(state.frameId);
    state.frameId = 0;
  };

  const animate = () => {
    state.frameId = 0;

    if (!shouldAnimate()) {
      return;
    }

    state.x += (state.targetX - state.x) * lerpFactor;
    state.y += (state.targetY - state.y) * lerpFactor;
    applyParallax();

    const stillMoving = Math.abs(state.targetX - state.x) > 0.001 || Math.abs(state.targetY - state.y) > 0.001;
    if (state.active || stillMoving) {
      state.frameId = window.requestAnimationFrame(animate);
    }
  };

  const startAnimation = () => {
    if (!shouldAnimate() || state.frameId) {
      return;
    }

    state.frameId = window.requestAnimationFrame(animate);
  };

  const onPointerMove = (event) => {
    if (event.pointerType === "touch" || reducedMotionQuery.matches || !finePointerQuery.matches) {
      return;
    }

    const rect = heroBackground.getBoundingClientRect();
    state.targetX = clamp(((event.clientX - rect.left) / Math.max(rect.width, 1) - 0.5) * 2, -1, 1);
    state.targetY = clamp((1 - (event.clientY - rect.top) / Math.max(rect.height, 1) - 0.5) * 2, -1, 1);
    state.active = true;
    startAnimation();
  };

  const onPointerLeave = () => {
    state.targetX = 0;
    state.targetY = 0;
    state.active = false;
    startAnimation();
  };

  const resetParallax = () => {
    stopAnimation();
    state.x = 0;
    state.y = 0;
    state.targetX = 0;
    state.targetY = 0;
    state.active = false;
    applyParallax();
  };

  heroSection.addEventListener("pointermove", onPointerMove, { passive: true });
  heroSection.addEventListener("pointerleave", onPointerLeave);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAnimation();
      return;
    }

    startAnimation();
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        state.heroInView = entries.some((entry) => entry.isIntersecting);

        if (state.heroInView) {
          startAnimation();
          return;
        }

        stopAnimation();
      },
      { threshold: 0.08 }
    );

    observer.observe(heroSection);
  }

  if (typeof reducedMotionQuery.addEventListener === "function") {
    reducedMotionQuery.addEventListener("change", resetParallax);
    finePointerQuery.addEventListener("change", resetParallax);
  } else if (typeof reducedMotionQuery.addListener === "function") {
    reducedMotionQuery.addListener(resetParallax);
    finePointerQuery.addListener(resetParallax);
  }
})();
