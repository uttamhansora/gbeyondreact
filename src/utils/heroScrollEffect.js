const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const easeOutCubic = (t) => 1 - (1 - t) ** 3;
const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;

const SIDE_LEFT_HTML = `
  <div class="wnHeroScroll__sideInner">
    <h2 class="wnHeroScroll__sideHeadline">Pioneering<br>Security</h2>
    <p class="wnHeroScroll__sideFooter">By combining certified offensive testing, executive-ready reporting, and free re-testing on critical findings, WhiteNet sets a higher standard for how teams reduce real-world breach risk.</p>
  </div>
`;

const SIDE_RIGHT_HTML = `
  <div class="wnHeroScroll__sideStack">
    <article class="wnHeroScroll__sideCard">
      <span class="wnHeroScroll__sideNum">01</span>
      <p class="wnHeroScroll__sideCardTitle">Certified experts since day one</p>
      <div class="wnHeroScroll__sideArt" aria-hidden="true"></div>
    </article>
    <article class="wnHeroScroll__sideCard">
      <span class="wnHeroScroll__sideNum">02</span>
      <p class="wnHeroScroll__sideCardTitle">Executive-ready remediation</p>
      <div class="wnHeroScroll__sideArt -plant" aria-hidden="true"></div>
    </article>
    <article class="wnHeroScroll__sideCard">
      <span class="wnHeroScroll__sideNum">03</span>
      <p class="wnHeroScroll__sideCardTitle">Trackable validation cycles</p>
      <div class="wnHeroScroll__sideArt -screen" aria-hidden="true"></div>
    </article>
  </div>
`;

function buildScrollShell() {
  const surround = document.createElement('div');
  surround.className = 'wnHeroScroll__surround';
  surround.setAttribute('aria-hidden', 'true');
  surround.innerHTML = `
    <div class="wnHeroScroll__grid"></div>
    <div class="wnHeroScroll__vignette"></div>
  `;
  return surround;
}

function buildStage(hero) {
  const stage = document.createElement('div');
  stage.className = 'wnHeroScroll__stage';

  const sideLeft = document.createElement('aside');
  sideLeft.className = 'wnHeroScroll__side -left';
  sideLeft.innerHTML = SIDE_LEFT_HTML;

  const center = document.createElement('div');
  center.className = 'wnHeroScroll__center';

  const sideRight = document.createElement('aside');
  sideRight.className = 'wnHeroScroll__side -right';
  sideRight.innerHTML = SIDE_RIGHT_HTML;

  center.appendChild(hero);
  stage.appendChild(sideLeft);
  stage.appendChild(center);
  stage.appendChild(sideRight);

  return stage;
}

function applyProgress(wrap, stage, progress) {
  const scroll = clamp(progress, 0, 1);
  /*
   * The pinned hero has three intentional scroll beats:
   * 1. frame the hero, 2. open the surrounding layout, 3. settle the copy.
   * Keeping the motion within these three equal ranges means the next section
   * starts as soon as the third scroll is complete.
   */
  const frameT = clamp(scroll * 3, 0, 1);
  const frameP = easeInOutCubic(frameT);

  const insetX = frameP * 9.5;
  const insetY = frameP * 7.5;
  const insetTop = frameP * 5.5;
  const radius = frameP * 20;
  const scale = 1 - frameP * 0.045;
  const surround = Math.min(1, easeOutCubic(clamp((frameP - 0.22) / 0.72, 0, 1)));
  const copyFade = clamp((frameP - 0.08) * 0.95, 0, 1);

  const layoutMix = easeOutCubic(clamp((scroll - 1 / 3) * 3, 0, 1));
  const settleMix = easeOutCubic(clamp((scroll - 2 / 3) * 3, 0, 1));
  // Reserve the tail of the final beat for a gentle hand-off to the next section.
  const exitMix = easeInOutCubic(clamp((scroll - 0.82) / 0.18, 0, 1));
  const sideHeadReveal = easeOutCubic(clamp(settleMix / 0.58, 0, 1));
  const sideFootReveal = easeOutCubic(clamp((settleMix - 0.18) / 0.72, 0, 1));
  const sideCardsReveal = easeOutCubic(clamp((settleMix - 0.08) / 0.72, 0, 1));
  const frameCopyReveal = easeOutCubic(clamp((settleMix - 0.1) / 0.7, 0, 1));
  const framedWidthVw = Math.max(36, 100 - insetX * 2.15);
  const framedHeightSvh = Math.max(30, 100 - insetTop - insetY * 0.85);
  const boxW = framedWidthVw * (1 - layoutMix * (2 / 3));
  const boxH = framedHeightSvh * (1 - layoutMix * (2 / 3));

  wrap.style.setProperty('--wn-hero-progress', frameP.toFixed(4));
  wrap.style.setProperty('--wn-hero-inset-x', `${insetX}vmin`);
  wrap.style.setProperty('--wn-hero-inset-y', `${insetY}vmin`);
  wrap.style.setProperty('--wn-hero-inset-top', `${insetTop}vmin`);
  wrap.style.setProperty('--wn-hero-radius', `${radius}px`);
  wrap.style.setProperty('--wn-hero-scale', scale.toFixed(4));
  wrap.style.setProperty('--wn-hero-surround', surround.toFixed(4));
  wrap.style.setProperty('--wn-hero-copy-fade', copyFade.toFixed(4));
  wrap.style.setProperty('--wn-hero-layout', layoutMix.toFixed(4));
  wrap.style.setProperty('--wn-hero-exit', exitMix.toFixed(4));
  wrap.style.setProperty('--wn-hero-side-head', sideHeadReveal.toFixed(4));
  wrap.style.setProperty('--wn-hero-side-foot', sideFootReveal.toFixed(4));
  wrap.style.setProperty('--wn-hero-side-cards', sideCardsReveal.toFixed(4));
  wrap.style.setProperty('--wn-hero-frame-copy', frameCopyReveal.toFixed(4));
  wrap.style.setProperty('--wn-box-w', `${boxW.toFixed(2)}vw`);
  wrap.style.setProperty('--wn-box-h', `${boxH.toFixed(2)}svh`);

  stage?.classList.toggle('is-grid', layoutMix > 0.62);

  document.documentElement.classList.toggle('wn-hero-scroll-active', frameP > 0.02);
  document.documentElement.classList.toggle('wn-hero-scroll-framed', frameP > 0.72);
  document.documentElement.classList.toggle('wn-hero-scroll-triptych', layoutMix > 0.78);
}

let activeTeardown = null;

export function destroyHeroScrollEffect() {
  if (activeTeardown) {
    activeTeardown();
    activeTeardown = null;
  }
}

export function initHeroScrollEffect() {
  destroyHeroScrollEffect();

  const hero = document.querySelector('.wnHero');
  if (!hero || hero.closest('[data-wn-hero-scroll]') || hero.classList.contains('wnHero--bitnomial')) {
    return;
  }

  const mobileLayoutQuery = window.matchMedia('(max-width: 960px)');
  if (mobileLayoutQuery.matches) {
    return;
  }

  const wrap = document.createElement('div');
  wrap.className = 'wnHeroScroll';
  wrap.setAttribute('data-wn-hero-scroll', '');

  const pin = document.createElement('div');
  pin.className = 'wnHeroScroll__pin';

  const parent = hero.parentNode;
  if (!parent) return;

  parent.insertBefore(wrap, hero);
  pin.appendChild(buildScrollShell());
  const stage = buildStage(hero);
  pin.appendChild(stage);
  wrap.appendChild(pin);

  const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  let targetProgress = 0;
  let smoothProgress = 0;
  let smoothRaf = 0;

  const render = () => {
    applyProgress(wrap, stage, reduceQuery.matches ? targetProgress : smoothProgress);
  };

  const tickSmooth = () => {
    const delta = targetProgress - smoothProgress;
    // Follow normal wheel and trackpad input without the previous long lag.
    smoothProgress += delta * 0.12;
    if (Math.abs(delta) < 0.0004) {
      smoothProgress = targetProgress;
    }
    render();
    if (Math.abs(targetProgress - smoothProgress) > 0.0004) {
      smoothRaf = requestAnimationFrame(tickSmooth);
    } else {
      smoothRaf = 0;
    }
  };

  const measure = () => {
    wrap.style.height = reduceQuery.matches ? 'auto' : '280svh';
    const scrollable = Math.max(1, wrap.offsetHeight - window.innerHeight);
    targetProgress = clamp(-wrap.getBoundingClientRect().top / scrollable, 0, 1);
    if (reduceQuery.matches) {
      smoothProgress = targetProgress;
      render();
      return;
    }
    if (!smoothRaf) {
      smoothRaf = requestAnimationFrame(tickSmooth);
    }
  };

  let scrollRaf = 0;
  const onScroll = () => {
    if (scrollRaf) return;
    scrollRaf = requestAnimationFrame(() => {
      scrollRaf = 0;
      measure();
    });
  };

  const onResize = () => measure();

  smoothProgress = 0;
  targetProgress = 0;
  // A compact pin keeps the three beats responsive without delaying the page.
  wrap.style.height = reduceQuery.matches ? 'auto' : '280svh';
  render();
  measure();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
  reduceQuery.addEventListener('change', onResize);

  activeTeardown = () => {
    if (scrollRaf) cancelAnimationFrame(scrollRaf);
    if (smoothRaf) cancelAnimationFrame(smoothRaf);
    scrollRaf = 0;
    smoothRaf = 0;
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    reduceQuery.removeEventListener('change', onResize);
    wrap.style.removeProperty('height');
    document.documentElement.classList.remove(
      'wn-hero-scroll-active',
      'wn-hero-scroll-framed',
      'wn-hero-scroll-triptych',
    );
    wrap.style.removeProperty('--wn-hero-exit');

    if (wrap.parentNode && hero.parentNode?.classList?.contains('wnHeroScroll__center')) {
      wrap.parentNode.insertBefore(hero, wrap);
      stage?.remove();
      wrap.remove();
    }
  };
}
