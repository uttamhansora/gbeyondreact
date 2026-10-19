const WORD = 'whitenet';

const SCHEMATICS = [
  `<svg viewBox="0 0 80 80" fill="none" aria-hidden="true"><rect x="8" y="12" width="64" height="56" stroke="rgba(255,255,255,0.85)" stroke-width="1" stroke-dasharray="3 4"/><circle cx="40" cy="40" r="18" stroke="rgba(255,255,255,0.7)" stroke-width="1" stroke-dasharray="2 5"/><text x="12" y="26" fill="rgba(255,255,255,0.9)" font-size="9" font-family="Archivo,sans-serif">11, 20</text></svg>`,
  `<svg viewBox="0 0 80 80" fill="none" aria-hidden="true"><rect x="14" y="8" width="52" height="64" stroke="rgba(255,255,255,0.85)" stroke-width="1" stroke-dasharray="4 3"/><path d="M14 40 H66" stroke="rgba(255,255,255,0.65)" stroke-dasharray="2 4"/><text x="18" y="72" fill="rgba(255,255,255,0.9)" font-size="9" font-family="Archivo,sans-serif">40, 22</text></svg>`,
  `<svg viewBox="0 0 80 80" fill="none" aria-hidden="true"><circle cx="40" cy="38" r="26" stroke="rgba(255,255,255,0.8)" stroke-width="1" stroke-dasharray="5 6" class="wnFooterWordmark__spin"/><path d="M40 12 V64" stroke="rgba(255,255,255,0.55)" stroke-dasharray="2 4"/><text x="44" y="18" fill="rgba(255,255,255,0.9)" font-size="9" font-family="Archivo,sans-serif">47, 7</text></svg>`,
];

const BLUEPRINT_SVG = `
<svg class="wnFooterWordmark__svg" viewBox="0 0 1400 260" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <g fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="1">
    <circle cx="120" cy="130" r="78" stroke-dasharray="4 7" class="wnFooterWordmark__spin"/>
    <circle cx="120" cy="130" r="52" stroke-dasharray="2 5" opacity="0.75"/>
    <path d="M42 130 H198" stroke-dasharray="3 6"/>
    <path d="M120 52 V208" stroke-dasharray="3 6"/>
    <circle cx="380" cy="140" r="62" stroke-dasharray="5 8" class="wnFooterWordmark__spin -rev"/>
    <path d="M318 140 H442" stroke-dasharray="2 5"/>
    <rect x="620" y="48" width="132" height="132" rx="4" stroke-dasharray="6 5" transform="rotate(-6 686 114)"/>
    <path d="M860 70 Q980 130 860 190" stroke-dasharray="4 6"/>
    <path d="M920 92 Q1040 130 920 168" stroke-dasharray="3 5" opacity="0.65"/>
    <circle cx="1120" cy="132" r="44" stroke-dasharray="3 6"/>
    <path d="M1080 132 H1160" stroke-dasharray="2 4"/>
  </g>
  <g fill="rgba(255,255,255,0.8)" font-family="Archivo, sans-serif" font-size="11" letter-spacing="0.04em">
    <text x="64" y="118">11, 38</text>
    <text x="188" y="152">46.13</text>
    <text x="328" y="98">28.04</text>
    <text x="452" y="168">14, 21</text>
    <text x="636" y="64">0°</text>
    <text x="900" y="108">62.8</text>
    <text x="1090" y="124">47, 23</text>
  </g>
</svg>`;

function buildChars(includeSchematics) {
  return WORD.split('')
    .map((ch, index) => {
      const face = `<span class="wnFooterWordmark__charFace">${ch}</span>`;
      const schem = includeSchematics
        ? `<span class="wnFooterWordmark__schem">${SCHEMATICS[index % SCHEMATICS.length]}</span>`
        : '';
      return `<span class="wnFooterWordmark__char">${face}${schem}</span>`;
    })
    .join('');
}

function buildWordmarkSection() {
  const section = document.createElement('section');
  section.className = 'wnFooterWordmark';
  section.setAttribute('data-wn-footer-wordmark', '');
  section.innerHTML = `
    <a class="wnFooterWordmark__link" href="/" aria-label="WhiteNet home">
      <div class="wnFooterWordmark__stage">
        <div class="wnFooterWordmark__blueprint">${BLUEPRINT_SVG}</div>
        <p class="wnFooterWordmark__text wnFooterWordmark__text--base">${buildChars(true)}</p>
        <p class="wnFooterWordmark__text wnFooterWordmark__text--spotlight" aria-hidden="true">${buildChars(false)}</p>
      </div>
    </a>
  `;
  return section;
}

function fitWordmarkStage(stage) {
  const probe = stage.querySelector('.wnFooterWordmark__text--base');
  const run = () => {
    const width = stage.clientWidth;
    if (!width || !probe) return;

    stage.style.setProperty('--wn-footer-fs', '16px');
    const measured = probe.getBoundingClientRect().width;
    if (measured <= 0) return;

    const px = (width * 0.996) / measured * 16;
    stage.style.setProperty('--wn-footer-fs', `${px}px`);
  };

  run();
  if (typeof ResizeObserver !== 'undefined') {
    const ro = new ResizeObserver(run);
    ro.observe(stage);
  } else {
    window.addEventListener('resize', run);
  }
}

function bindWordmarkStage(stage) {
  const chars = [...stage.querySelectorAll('.wnFooterWordmark__char')];

  const setSpot = (clientX, clientY) => {
    const rect = stage.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    stage.style.setProperty('--mx', `${Math.max(0, Math.min(100, x))}%`);
    stage.style.setProperty('--my', `${Math.max(0, Math.min(100, y))}%`);

    chars.forEach((char) => {
      const charRect = char.getBoundingClientRect();
      const cx = charRect.left + charRect.width / 2;
      const cy = charRect.top + charRect.height * 0.55;
      const reach = Math.max(charRect.width * 2.1, 140);
      const dist = Math.hypot(clientX - cx, clientY - cy);
      const prox = Math.max(0, Math.min(1, 1 - dist / reach));
      char.style.setProperty('--prox', prox.toFixed(3));
    });
  };

  const clearSpot = () => {
    stage.classList.remove('is-active');
    chars.forEach((char) => char.style.setProperty('--prox', '0'));
  };

  stage.addEventListener('pointerenter', (event) => {
    stage.classList.add('is-active');
    setSpot(event.clientX, event.clientY);
  });
  stage.addEventListener('pointermove', (event) => setSpot(event.clientX, event.clientY));
  stage.addEventListener('pointerleave', clearSpot);
}

export function initFooterWordmark() {
  document.querySelectorAll('.siteFooter').forEach((footer) => {
    if (footer.querySelector('[data-wn-footer-wordmark]')) return;

    const section = buildWordmarkSection();
    footer.appendChild(section);

    const stage = section.querySelector('.wnFooterWordmark__stage');
    if (!stage) return;

    fitWordmarkStage(stage);
    bindWordmarkStage(stage);
  });
}
