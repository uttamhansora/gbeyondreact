const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

let activeTeardown = null;

export function destroyFeaturesEvolution() {
  if (activeTeardown) {
    activeTeardown();
    activeTeardown = null;
  }
}

export function initFeaturesEvolution() {
  destroyFeaturesEvolution();

  const root = document.querySelector('[data-wn-features-evolution]');
  if (!root || root.dataset.wnReady === 'true') {
    return;
  }

  const stepButtons = Array.from(root.querySelectorAll('[data-wn-feature-step]'));
  const stackItems = Array.from(root.querySelectorAll('[data-wn-feature-stack]'));
  const detailEl = root.querySelector('[data-wn-feature-detail]');
  const lineFill = root.querySelector('.wnFeaturesEvolution__lineFill');
  const prevBtn = root.querySelector('[data-wn-feature-prev]');
  const nextBtn = root.querySelector('[data-wn-feature-next]');

  if (!stepButtons.length || !detailEl) {
    return;
  }

  root.dataset.wnReady = 'true';
  let index = clamp(
    stepButtons.findIndex((btn) => btn.getAttribute('aria-selected') === 'true'),
    0,
    stepButtons.length - 1,
  );
  if (index < 0) index = 0;

  const setIndex = (nextIndex) => {
    index = (nextIndex + stepButtons.length) % stepButtons.length;
    const last = Math.max(1, stepButtons.length - 1);
    const progress = index / last;

    stepButtons.forEach((btn, i) => {
      const active = i === index;
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
      btn.classList.toggle('is-active', active);
      btn.classList.toggle('is-past', i < index);
    });

    stackItems.forEach((item, i) => {
      item.classList.toggle('is-active', i === index);
      item.classList.toggle('is-near', Math.abs(i - index) === 1);
    });

    const body = stepButtons[index].dataset.body || '';
    detailEl.textContent = body;

    if (lineFill) {
      lineFill.style.width = `${(progress * 100).toFixed(2)}%`;
    }

    const stack = root.querySelector('.wnFeaturesEvolution__stackList');
    const activeItem = stackItems[index];
    if (stack && activeItem) {
      const offset =
        activeItem.offsetTop - stack.clientHeight / 2 + activeItem.offsetHeight / 2;
      stack.style.transform = `translate3d(0, ${(-offset).toFixed(2)}px, 0)`;
    }
  };

  const onStepClick = (event) => {
    const btn = event.currentTarget;
    const stepIndex = Number(btn.dataset.wnFeatureStep);
    if (Number.isNaN(stepIndex)) return;
    setIndex(stepIndex);
  };

  stepButtons.forEach((btn) => {
    btn.addEventListener('click', onStepClick);
  });

  const onPrev = () => setIndex(index - 1);
  const onNext = () => setIndex(index + 1);
  prevBtn?.addEventListener('click', onPrev);
  nextBtn?.addEventListener('click', onNext);

  const onKeyDown = (event) => {
    if (!root.contains(document.activeElement)) return;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      setIndex(index - 1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      setIndex(index + 1);
    }
  };

  root.addEventListener('keydown', onKeyDown);

  setIndex(index);

  activeTeardown = () => {
    stepButtons.forEach((btn) => btn.removeEventListener('click', onStepClick));
    prevBtn?.removeEventListener('click', onPrev);
    nextBtn?.removeEventListener('click', onNext);
    root.removeEventListener('keydown', onKeyDown);
    root.dataset.wnReady = 'false';
  };
}
