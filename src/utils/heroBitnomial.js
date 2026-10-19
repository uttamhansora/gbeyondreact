const SCRAMBLE_CHARS = '0123456789!@#$%^&*()[]{}<>?|\\/+=-_~'.split('');

let activeTeardown = null;

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function wrapScrambleLines(el) {
  const range = document.createRange();
  const text = (el.dataset.text || el.textContent).trim();
  el.innerHTML = '';

  const wordMatches = text.match(/\S+|\s/g) || [];
  const wordSpans = [];

  wordMatches.forEach((word) => {
    const wordSpan = document.createElement('span');
    wordSpan.className = 'word';

    word.split('').forEach((char) => {
      const charSpan = document.createElement('span');
      charSpan.className = 'char';
      charSpan.textContent = char;
      wordSpan.appendChild(charSpan);
    });

    el.appendChild(wordSpan);
    wordSpans.push(wordSpan);
  });

  const lines = [];
  let currentLine = [];
  let lastTop = null;

  wordSpans.forEach((word) => {
    range.selectNode(word);
    const top = range.getBoundingClientRect().top.toFixed(2);

    if (lastTop !== null && top !== lastTop) {
      lines.push(currentLine);
      currentLine = [];
    }

    currentLine.push(word);
    lastTop = top;
  });

  if (currentLine.length) lines.push(currentLine);

  el.innerHTML = '';
  lines.forEach((lineWords) => {
    const lineSpan = document.createElement('span');
    lineSpan.className = 'line';
    lineWords.forEach((w) => lineSpan.appendChild(w));
    el.appendChild(lineSpan);
  });
}

function scrambleLineByLine(el, finalText, speed = 18, reverse = false) {
  wrapScrambleLines(el);

  const lineSpans = el.querySelectorAll('.line');
  const lineDelay = 150;
  let globalCharIndex = 0;

  lineSpans.forEach((line, lineIndex) => {
    const chars = line.querySelectorAll('.char');
    const indices = [];

    for (let i = 0; i < chars.length; i++) {
      indices.push(globalCharIndex++);
    }

    window.setTimeout(() => {
      let iteration = 0;
      const interval = window.setInterval(() => {
        chars.forEach((charSpan, i) => {
          const idx = indices[i];
          const targetChar = finalText[idx];

          if (reverse) {
            charSpan.textContent =
              i >= chars.length - iteration
                ? targetChar
                : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          } else {
            charSpan.textContent =
              i < iteration
                ? targetChar
                : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          }
        });

        if (iteration >= chars.length) {
          window.clearInterval(interval);
          chars.forEach((charSpan, i) => {
            charSpan.textContent = finalText[indices[i]];
          });
        }

        iteration += 0.5;
      }, speed);
    }, lineIndex * lineDelay);
  });
}

function initReveal(root) {
  const elements = root.querySelectorAll('.wn-reveal');
  if (!elements.length) return () => {};

  const defaultDistance = window.innerWidth < 769 ? 24 : 36;

  const setup = (element) => {
    const distance = element.dataset.revealDistance || defaultDistance;
    element.style.opacity = '0';
    element.style.transition = 'transform ease-out, opacity ease-out';
    element.style.transform = `translateY(${distance}px)`;
  };

  elements.forEach(setup);

  const reveal = (element) => {
    const duration = element.dataset.revealDuration || 400;
    const delay = element.dataset.revealDelay || 0;
    element.style.transitionDuration = `${duration}ms`;
    element.style.transitionDelay = `${delay}ms`;
    element.style.opacity = '1';
    element.style.transform = 'translate(0)';
  };

  if (prefersReducedMotion()) {
    elements.forEach(reveal);
    return () => {};
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        reveal(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0, rootMargin: '0px' },
  );

  elements.forEach((el) => {
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
      reveal(el);
    } else {
      observer.observe(el);
    }
  });

  return () => observer.disconnect();
}

function initTag(root) {
  const tag = root.querySelector('[data-wn-hero-tag]');
  if (!tag) return () => {};

  const text = tag.querySelector('.wnHero__tagText');
  if (!text) return () => {};

  const run = () => {
    text.style.width = 'auto';
    const targetWidth = text.scrollWidth;
    text.style.width = '0';
    tag.classList.add('is-animated');
    requestAnimationFrame(() => {
      text.style.width = `${targetWidth}px`;
    });
  };

  if (prefersReducedMotion()) {
    run();
    return () => {};
  }

  const timer = window.setTimeout(run, 120);
  return () => window.clearTimeout(timer);
}

function initScrambleButtons(root) {
  const buttons = root.querySelectorAll('.scramble-text');
  const cleanups = [];

  buttons.forEach((el) => {
    const originalText = (el.dataset.text || el.textContent).trim();
    if (!originalText) return;

    const onEnter = () => scrambleLineByLine(el, originalText, 18, false);
    const onLeave = () => scrambleLineByLine(el, originalText, 18, true);

    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('focus', onEnter);
    el.addEventListener('mouseleave', onLeave);
    el.addEventListener('blur', onLeave);

    cleanups.push(() => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('focus', onEnter);
      el.removeEventListener('mouseleave', onLeave);
      el.removeEventListener('blur', onLeave);
    });
  });

  return () => cleanups.forEach((fn) => fn());
}

function initHeroVideo(root) {
  const video = root.querySelector('[data-wn-hero-video]');
  if (!video) return () => {};

  const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  const syncMotion = () => {
    if (reduceQuery.matches || document.hidden) {
      video.pause();
      return;
    }
    const playPromise = video.play();
    if (playPromise) {
      playPromise.catch(() => {});
    }
  };

  const intersectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries.some((entry) => entry.isIntersecting);
      if (!visible) {
        video.pause();
        return;
      }
      syncMotion();
    },
    { threshold: 0.12 },
  );

  intersectionObserver.observe(video);
  video.addEventListener('canplay', syncMotion);
  document.addEventListener('visibilitychange', syncMotion);
  reduceQuery.addEventListener('change', syncMotion);
  syncMotion();

  return () => {
    intersectionObserver.disconnect();
    video.removeEventListener('canplay', syncMotion);
    document.removeEventListener('visibilitychange', syncMotion);
    reduceQuery.removeEventListener('change', syncMotion);
    video.pause();
  };
}

export function destroyHeroBitnomial() {
  if (activeTeardown) {
    activeTeardown();
    activeTeardown = null;
  }
}

export function initHeroBitnomial() {
  destroyHeroBitnomial();

  const hero = document.querySelector('.wnHero--bitnomial');
  if (!hero) return;

  const cleanups = [
    initReveal(hero),
    initTag(hero),
    initScrambleButtons(hero),
    initHeroVideo(hero),
  ];

  activeTeardown = () => {
    cleanups.forEach((fn) => fn());
  };
}
