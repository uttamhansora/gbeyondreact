import { replaceCanonicalSiteUrls } from './siteUrl.js';
import {
  destroyBannerParticlesFully,
  initBannerParticles,
} from './bannerParticles.js';
import { destroyHeroHartmannWaves } from './heroHartmannWaves.js';
import { destroyApproachScrollEffect, initApproachScrollEffect } from './approachScrollEffect.js';
import { destroyFeaturesEvolution, initFeaturesEvolution } from './featuresEvolution.js';
import { destroyHeroBitnomial, initHeroBitnomial } from './heroBitnomial.js';
import { destroyHeroScrollEffect, initHeroScrollEffect } from './heroScrollEffect.js';
import { initFooterWordmark } from './footerWordmark.js';

let mainScriptPromise = null;
let fetchSiteUrlPatchApplied = false;

const SITE_JSON_PATH = /\/(blogs|resources|blogTopics|resourceTypes|resourceTopics)\.json(?:\?.*)?$/;

function patchFetchForSiteUrls() {
  if (fetchSiteUrlPatchApplied || typeof window === 'undefined' || !window.fetch) {
    return;
  }

  fetchSiteUrlPatchApplied = true;
  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input, init) => {
    const response = await originalFetch(input, init);
    const requestUrl = new URL(
      typeof input === 'string' ? input : input.url,
      window.location.origin,
    );

    if (!SITE_JSON_PATH.test(requestUrl.pathname)) {
      return response;
    }

    const rewritten = replaceCanonicalSiteUrls(await response.text());
    return new Response(rewritten, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  };
}

function loadMainScript() {
  if (mainScriptPromise) {
    return mainScriptPromise;
  }

  mainScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-site-main="true"]');
    if (existing) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.type = 'module';
    script.src = '/dist/main.d82f623b.js';
    script.crossOrigin = 'anonymous';
    script.dataset.siteMain = 'true';
    script.onload = () => {
      document.dispatchEvent(
        new CustomEvent('vite-script-loaded', {
          detail: { path: 'resources/js/main.js' },
        })
      );
      resolve();
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });

  return mainScriptPromise;
}

function destroySiteApp() {
  destroyHeroScrollEffect();
  destroyHeroBitnomial();
  destroyApproachScrollEffect();
  destroyFeaturesEvolution();
  destroyHeroHartmannWaves();
  document.querySelector('[data-wn-hartmann-backdrop]')?.remove();
  destroyBannerParticlesFully();

  const root = document.getElementById('root');
  if (!root) return;

  if (root.__vue__) {
    root.__vue__.$destroy();
  }

  root.innerHTML = '';
  root.removeAttribute('data-v-app');
}

function animateTrustStats() {
  const section = document.querySelector('.trustStats');
  if (!section || section.dataset.trustAnimated === 'true') {
    return;
  }

  const values = section.querySelectorAll('[data-trust-count]');
  if (!values.length) {
    return;
  }

  const run = () => {
    if (section.dataset.trustAnimated === 'true') {
      return;
    }
    section.dataset.trustAnimated = 'true';

    values.forEach((el) => {
      const target = Number(el.getAttribute('data-trust-count')) || 0;
      const ring = el.closest('[data-trust-ring]');
      const duration = 1400;
      const start = performance.now();

      if (ring) {
        ring.style.setProperty('--current-percentage', '0');
      }

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(target * eased);
        el.textContent = String(current);
        if (ring) {
          ring.style.setProperty('--current-percentage', String(target * eased));
        }
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else if (ring) {
          ring.style.setProperty('--current-percentage', String(target));
        }
      };

      requestAnimationFrame(tick);
    });
  };

  if (!('IntersectionObserver' in window)) {
    run();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        run();
        observer.disconnect();
      }
    },
    { threshold: 0.35 },
  );

  observer.observe(section);
}

function initWnHeroBg() {
  document.querySelector('[data-wn-hartmann-backdrop]')?.remove();

  const bg = document.querySelector('[data-wn-hero-bg]');
  if (!bg || bg.dataset.wnReady === 'true') {
    return;
  }

  bg.dataset.wnReady = 'true';
}

function initWnChrome() {
  const nav = document.querySelector('[data-wn-nav]');
  const chrome = document.querySelector('[data-wn-chrome]');
  if (!nav || !chrome || chrome.dataset.wnReady === 'true') {
    return;
  }

  chrome.dataset.wnReady = 'true';

  const bar = nav.querySelector('.wnLgNav__bar');
  const toggle = nav.querySelector('[data-wn-nav-toggle]');
  const panel = nav.querySelector('.wnLgNav__bottom');
  const bg = nav.querySelector('[data-wn-nav-close]');
  const acc = nav.querySelector('[data-wn-services-acc]');
  const accHead = nav.querySelector('[data-wn-acc-head]');
  let lastFocus = null;

  // Mobile: Services column collapses into a single accordion row.
  accHead?.addEventListener('click', () => {
    if (!nav || !window.matchMedia('(max-width: 1023px)').matches) return;
    const open = nav.dataset.accOpen === 'true';
    nav.dataset.accOpen = open ? 'false' : 'true';
    acc?.setAttribute('aria-expanded', open ? 'false' : 'true');
  });
  acc?.setAttribute('aria-expanded', 'false');

  const isOpen = () => bar?.dataset.navStatus === 'active';

  const setNav = (open) => {
    if (!bar || !toggle || !panel) return;
    if (open && !isOpen()) lastFocus = document.activeElement;
    bar.dataset.navStatus = open ? 'active' : 'not-active';
    nav.dataset.navStatus = open ? 'active' : 'not-active';
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    panel.inert = !open;
    document.documentElement.classList.toggle('wn-menu-lock', open);
    if (!open && lastFocus && nav.contains(lastFocus)) {
      lastFocus.focus?.();
      lastFocus = null;
    }
  };

  toggle?.addEventListener('click', () => setNav(!isOpen()));

  bg?.addEventListener('click', () => setNav(false));

  // Close after selecting a navigation link (touch + mouse friendly).
  panel?.addEventListener('click', (event) => {
    if (event.target.closest('a[href]')) setNav(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) {
      event.preventDefault();
      setNav(false);
      toggle?.focus();
    }
  });

  // Keep the menu usable when the viewport grows past the mobile breakpoint.
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024 && isOpen() && !nav.contains(document.activeElement)) {
      setNav(false);
    }
  });

  const onScroll = () => {
    chrome.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

function initQuoteSlider() {
  const root = document.querySelector('[data-wn-quote-slider]');
  if (!root || root.dataset.wnReady === 'true') {
    return;
  }

  const slides = Array.from(root.querySelectorAll('.wnQuoteSlider__slide'));
  const prev = root.querySelector('[data-wn-quote-prev]');
  const next = root.querySelector('[data-wn-quote-next]');
  if (!slides.length || !prev || !next) {
    return;
  }

  root.dataset.wnReady = 'true';
  let index = Math.max(
    0,
    slides.findIndex((slide) => slide.classList.contains('is-active')),
  );

  const show = (nextIndex) => {
    index = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === index);
    });
  };

  prev.addEventListener('click', () => show(index - 1));
  next.addEventListener('click', () => show(index + 1));
  show(index);
}

const serviceIllustrations = {
  web: '<svg class="expandableCards__graphic wnServiceGraphic" viewBox="0 0 220 220" aria-hidden="true"><rect x="30" y="42" width="160" height="112" rx="10"/><path d="M82 88l-28 18 28 18M138 88l28 18-28 18M124 76l-28 72"/><path d="M82 178h56"/></svg>',
  mobile: '<svg class="expandableCards__graphic wnServiceGraphic" viewBox="0 0 220 220" aria-hidden="true"><rect x="70" y="30" width="80" height="160" rx="14"/><path d="M97 54h26M102 166h16"/><path d="M110 80l30 12v29c0 23-17 37-30 42-13-5-30-19-30-42V92l30-12z"/><path d="M99 121l8 8 16-19"/></svg>',
  api: '<svg class="expandableCards__graphic wnServiceGraphic" viewBox="0 0 220 220" aria-hidden="true"><path d="M82 57L42 110l40 53M138 57l40 53-40 53M124 45l-28 130"/><circle cx="110" cy="110" r="24"/><path d="M98 110h24M110 98v24"/></svg>',
  cloud: '<svg class="expandableCards__graphic wnServiceGraphic" viewBox="0 0 220 220" aria-hidden="true"><path d="M61 155h99a31 31 0 0 0 1-62 51 51 0 0 0-97-8 35 35 0 0 0-3 70z"/><path d="M110 88l27 11v25c0 22-15 34-27 39-12-5-27-17-27-39V99l27-11z"/><path d="M99 124l8 8 16-20"/></svg>',
  network: '<svg class="expandableCards__graphic wnServiceGraphic" viewBox="0 0 220 220" aria-hidden="true"><circle cx="110" cy="110" r="24"/><circle cx="55" cy="66" r="16"/><circle cx="165" cy="66" r="16"/><circle cx="55" cy="154" r="16"/><circle cx="165" cy="154" r="16"/><path d="M73 76l20 17M147 76l-20 17M73 144l20-17M147 144l-20-17"/></svg>',
  red: '<svg class="expandableCards__graphic wnServiceGraphic" viewBox="0 0 220 220" aria-hidden="true"><path d="M110 31l64 24v46c0 43-28 70-64 88-36-18-64-45-64-88V55l64-24z"/><path d="M78 115l20 20 45-50"/><path d="M75 72h70"/></svg>',
};

function initServiceIllustrations() {
  const panels = document.querySelectorAll('.expandableCards__panel');
  if (!panels.length) return;

  const typeByTitle = {
    'web app penetration testing': 'web',
    'mobile app security testing': 'mobile',
    'api security testing': 'api',
    'cloud security assessment': 'cloud',
    'network penetration testing': 'network',
    'red team assessment': 'red',
  };

  panels.forEach((panel) => {
    const title = panel.querySelector('.expandableCards__panelTitle')?.textContent
      ?.trim()
      .toLowerCase();
    const media = panel.querySelector('.expandableCards__panelMedia');
    const illustration = typeByTitle[title];
    if (media && illustration) media.innerHTML = serviceIllustrations[illustration];
  });
}

function initContactLearnMoreLinks() {
  document.querySelectorAll('a').forEach((link) => {
    const label = link.textContent.trim().toLowerCase();
    if (label === 'learn more' || label === 'get in touch' || label === 'know more') {
      link.setAttribute('href', '/contact-us');
      link.removeAttribute('target');
      link.removeAttribute('rel');
    }
  });
}

function initDummyClients() {
  const slider = document.querySelector('.logoTestimonialSlider__logoSlider');
  if (!slider || slider.querySelector('.wnDummyClients')) return;

  slider.dataset.wnClientLogosReady = 'true';
  const clients = [
    ['Formbricks', '/assets/client-logos/formbricks.png'], ['TrenDemon', '/assets/client-logos/trendemon.png'],
    ['Shippit', '/assets/client-logos/shippit.png'], ['Indeed', '/assets/client-logos/indeed.png'],
    ['Kavanu', '/assets/client-logos/kavanu.png'], ['Eclincher', '/assets/client-logos/eclincher.png'],
  ];
  const items = clients.map(([name, src]) => `<span class="wnClientLogoItem"><img class="wnDummyClients__logo" src="${src}" alt="${name}" /></span>`).join('') + '<span class="wnClientLogoItem"><span class="wnDummyClients__wordmark">FIS</span></span>';
  slider.innerHTML = `<div class="wnDummyClients" aria-label="Client logos"><div class="wnClientLogoTrack"><div class="wnClientLogoSet">${items}</div><div class="wnClientLogoSet" aria-hidden="true">${items.replaceAll(' alt=', ' data-alt=')}</div></div></div>`;
}

function insightsPerView() {
  const width = window.innerWidth;
  if (width >= 1024) return 3;
  if (width >= 768) return 2;
  return 1;
}

function initLatestInsightsCarousel() {
  const section = document.querySelector('.relatedEntries');
  const root = section?.querySelector('[data-wn-insights]');
  if (!root || root.dataset.wnReady === 'true') return;
  root.dataset.wnReady = 'true';

  const viewport = root.querySelector('.wnInsights__viewport');
  const track = root.querySelector('.wnInsights__track');
  const dots = root.querySelector('[data-wn-insights-dots]');
  const slides = [...track.children];
  if (!viewport || !track || slides.length < 2) return;

  let start = 0;
  let busy = false;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'wnInsightsDots__dot';
    dot.setAttribute('aria-label', `Show insight ${index + 1} of ${slides.length}`);
    dot.addEventListener('click', () => goTo(index));
    dots.appendChild(dot);
  });

  const metrics = () => {
    const perView = Math.min(insightsPerView(), slides.length);
    const gap = perView === 1 ? 16 : 24;
    const slideWidth = (viewport.clientWidth - gap * (perView - 1)) / perView;
    return { perView, gap, slideWidth, step: slideWidth + gap };
  };

  const paint = () => {
    const { perView, gap, slideWidth } = metrics();
    section.classList.toggle('wn-insights-mobile', perView === 1);
    track.style.gap = `${gap}px`;
    slides.forEach((slide) => {
      slide.style.flex = `0 0 ${slideWidth}px`;
      slide.style.width = `${slideWidth}px`;
    });
    dots.querySelectorAll('.wnInsightsDots__dot').forEach((dot, index) => {
      const active = index === start;
      dot.classList.toggle('is-active', active);
      if (active) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  };

  const release = (nextStart) => {
    start = nextStart;
    busy = false;
    paint();
  };

  const makeClone = (slide) => {
    const clone = slide.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.style.pointerEvents = 'none';
    return clone;
  };

  const shift = (direction) => {
    if (busy) return;
    const { step, perView } = metrics();
    if (!step) return;
    busy = true;
    const count = slides.length;
    const fill = perView >= count;

    if (reduceMotion) {
      if (direction > 0) track.appendChild(track.firstElementChild);
      else track.insertBefore(track.lastElementChild, track.firstElementChild);
      track.style.transition = 'none';
      track.style.transform = 'translate3d(0,0,0)';
      release((start + direction + count) % count);
      return;
    }

    if (direction > 0) {
      const clone = fill ? makeClone(track.firstElementChild) : null;
      if (clone) track.appendChild(clone);
      track.style.transition = 'transform 0.45s ease';
      track.style.transform = `translate3d(${-step}px,0,0)`;
      let settled = false;
      const done = (event) => {
        if (settled || (event && event.target !== track)) return;
        settled = true;
        track.removeEventListener('transitionend', done);
        window.clearTimeout(fallback);
        track.style.transition = 'none';
        clone?.remove();
        track.appendChild(track.firstElementChild);
        track.style.transform = 'translate3d(0,0,0)';
        release((start + 1) % count);
      };
      const fallback = window.setTimeout(done, 520);
      track.addEventListener('transitionend', done);
      return;
    }

    const clone = fill ? makeClone(track.lastElementChild) : null;
    track.style.transition = 'none';
    track.insertBefore(clone || track.lastElementChild, track.firstElementChild);
    track.style.transform = `translate3d(${-step}px,0,0)`;
    window.requestAnimationFrame(() => {
      track.style.transition = 'transform 0.45s ease';
      track.style.transform = 'translate3d(0,0,0)';
      let settled = false;
      const done = (event) => {
        if (settled || (event && event.target !== track)) return;
        settled = true;
        track.removeEventListener('transitionend', done);
        window.clearTimeout(fallback);
        if (clone) {
          clone.remove();
          track.insertBefore(track.lastElementChild, track.firstElementChild);
        }
        release((start - 1 + count) % count);
      };
      const fallback = window.setTimeout(done, 520);
      track.addEventListener('transitionend', done);
    });
  };

  const goTo = (index) => {
    if (busy || index === start) return;
    const count = slides.length;
    const steps = (index - start + count) % count;
    track.style.transition = 'none';
    track.style.transform = 'translate3d(0,0,0)';
    for (let i = 0; i < steps; i += 1) track.appendChild(track.firstElementChild);
    start = index;
    paint();
  };

  section.querySelector('[data-slider-prev]')?.addEventListener('click', () => shift(-1));
  section.querySelector('[data-slider-next]')?.addEventListener('click', () => shift(1));

  let originX = 0;
  let originY = 0;
  let tracking = false;
  viewport.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse') return;
    tracking = true;
    originX = event.clientX;
    originY = event.clientY;
  });
  viewport.addEventListener('pointerup', (event) => {
    if (!tracking) return;
    tracking = false;
    const dx = event.clientX - originX;
    const dy = event.clientY - originY;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
    shift(dx < 0 ? 1 : -1);
  });
  viewport.addEventListener('pointercancel', () => {
    tracking = false;
  });

  paint();
  window.addEventListener('resize', () => {
    track.style.transition = 'none';
    track.style.transform = 'translate3d(0,0,0)';
    paint();
  }, { passive: true });
  if (typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver(() => {
      track.style.transition = 'none';
      track.style.transform = 'translate3d(0,0,0)';
      paint();
    });
    observer.observe(viewport);
  }
}

function initWnFaq() {
  const root = document.querySelector('[data-wn-faq]');
  if (!root || root.dataset.wnReady === 'true') {
    return;
  }

  root.dataset.wnReady = 'true';
  const items = Array.from(root.querySelectorAll('.wnFaq__item'));

  items.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      items.forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });
}

export async function mountSiteHtml(html) {
  patchFetchForSiteUrls();

  const root = document.getElementById('root');
  if (!root) {
    throw new Error('Missing #root container for site scripts');
  }

  const hadVueApp = Boolean(root.__vue__);
  destroySiteApp();
  root.innerHTML = html;

  await loadMainScript();
  initWnChrome();
  initWnHeroBg();
  initHeroBitnomial();
  initHeroScrollEffect();
  initApproachScrollEffect();
  initFeaturesEvolution();
  initWnFaq();
  animateTrustStats();
  initQuoteSlider();
  initServiceIllustrations();
  initContactLearnMoreLinks();
  initDummyClients();
  initLatestInsightsCarousel();
  initBannerParticles();
  initFooterWordmark();

  if (hadVueApp) {
    window.location.reload();
  }
}
