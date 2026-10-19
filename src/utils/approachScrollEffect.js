const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;

let activeTeardown = null;

export function destroyApproachScrollEffect() {
  if (activeTeardown) {
    activeTeardown();
    activeTeardown = null;
  }
}

export function initApproachScrollEffect() {
  destroyApproachScrollEffect();

  const root = document.querySelector('[data-wn-approach-scroll]');
  if (!root || root.dataset.wnApproachReady === 'true') {
    return;
  }

  const scrollEl = root.querySelector('.wnApproach__scroll');
  const stepsEl = root.querySelector('.wnApproach__steps');
  const stepsWrap = root.querySelector('.wnApproach__stepsWrap');
  const lineFill = root.querySelector('.wnApproach__lineFill');

  if (!scrollEl || !stepsEl || !stepsWrap) {
    return;
  }

  const steps = Array.from(stepsEl.querySelectorAll('.wnApproach__step'));
  if (!steps.length) {
    return;
  }

  root.dataset.wnApproachReady = 'true';

  const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktopQuery = window.matchMedia('(min-width: 901px)');

  let targetProgress = 0;
  let smoothProgress = 0;
  let smoothRaf = 0;
  let scrollRaf = 0;

  const setScrollHeight = () => {
    if (!desktopQuery.matches || reduceQuery.matches) {
      scrollEl.style.removeProperty('height');
      root.classList.remove('wnApproach--scroll');
      return;
    }
    const perStep = Math.min(38, Math.max(28, window.innerHeight * 0.32));
    scrollEl.style.height = `calc(100svh + ${Math.round(perStep * steps.length)}vh)`;
    root.classList.add('wnApproach--scroll');
  };

  const apply = (progress) => {
    const p = easeInOutCubic(progress);

    if (!desktopQuery.matches || reduceQuery.matches) {
      stepsEl.style.transform = '';
      root.style.removeProperty('--wn-approach-line');
      steps.forEach((step) => {
        step.classList.remove('is-active', 'is-past');
      });
      return;
    }

    const maxShift = Math.max(0, stepsEl.offsetHeight - stepsWrap.clientHeight);
    stepsEl.style.transform = `translate3d(0, ${(-p * maxShift).toFixed(2)}px, 0)`;

    const linePct = clamp(p * 100, 0, 100);
    root.style.setProperty('--wn-approach-line', linePct.toFixed(2));
    if (lineFill) {
      lineFill.style.height = `${linePct}%`;
    }

    const activeIndex = clamp(Math.round(p * (steps.length - 1)), 0, steps.length - 1);
    steps.forEach((step, index) => {
      step.classList.toggle('is-past', index < activeIndex);
      step.classList.toggle('is-active', index === activeIndex);
    });
  };

  const render = () => {
    apply(reduceQuery.matches ? targetProgress : smoothProgress);
  };

  const tickSmooth = () => {
    const delta = targetProgress - smoothProgress;
    smoothProgress += delta * 0.1;
    if (Math.abs(delta) < 0.0005) {
      smoothProgress = targetProgress;
    }
    render();
    if (Math.abs(targetProgress - smoothProgress) > 0.0005) {
      smoothRaf = requestAnimationFrame(tickSmooth);
    } else {
      smoothRaf = 0;
    }
  };

  const measure = () => {
    setScrollHeight();
    if (!desktopQuery.matches || reduceQuery.matches) {
      targetProgress = 0;
      smoothProgress = 0;
      render();
      return;
    }

    const scrollable = Math.max(1, scrollEl.offsetHeight - window.innerHeight);
    targetProgress = clamp(-scrollEl.getBoundingClientRect().top / scrollable, 0, 1);

    if (reduceQuery.matches) {
      smoothProgress = targetProgress;
      render();
      return;
    }
    if (!smoothRaf) {
      smoothRaf = requestAnimationFrame(tickSmooth);
    }
  };

  const onScroll = () => {
    if (scrollRaf) return;
    scrollRaf = requestAnimationFrame(() => {
      scrollRaf = 0;
      measure();
    });
  };

  const onResize = () => measure();

  setScrollHeight();
  smoothProgress = 0;
  targetProgress = 0;
  render();
  measure();

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
  reduceQuery.addEventListener('change', onResize);
  desktopQuery.addEventListener('change', onResize);

  activeTeardown = () => {
    if (scrollRaf) cancelAnimationFrame(scrollRaf);
    if (smoothRaf) cancelAnimationFrame(smoothRaf);
    scrollRaf = 0;
    smoothRaf = 0;
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    reduceQuery.removeEventListener('change', onResize);
    desktopQuery.removeEventListener('change', onResize);
    root.classList.remove('wnApproach--scroll');
    root.style.removeProperty('--wn-approach-line');
    root.dataset.wnApproachReady = 'false';
    stepsEl.style.transform = '';
    steps.forEach((step) => step.classList.remove('is-active', 'is-past'));
    scrollEl.style.removeProperty('height');
  };
}
