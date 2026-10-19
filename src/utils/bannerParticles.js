let animationId = 0;
let resizeObserver = null;
let hostEl = null;

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );
}

export function destroyBannerParticles() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = 0;
  }
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
  if (hostEl) {
    hostEl.querySelector('canvas')?.remove();
    hostEl = null;
  }
}

export function initBannerParticles() {
  destroyBannerParticles();

  const host = document.querySelector('[data-wn-particles]');
  if (!host) return;

  hostEl = host;
  const banner = host.closest('.bannerCta') || host;
  const canvas = document.createElement('canvas');
  canvas.className = 'bannerCta__particlesCanvas';
  canvas.setAttribute('aria-hidden', 'true');
  host.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const particles = [];
  const mouse = { x: null, y: null, active: false };
  let width = 0;
  let height = 0;
  let dpr = 1;

  const config = {
    density: 14000,
    maxParticles: 90,
    minParticles: 28,
    linkDistance: 140,
    speed: 0.45,
    particleColor: 'rgba(140, 185, 255, 0.9)',
    linkColor: '100, 160, 255',
    sizeMin: 1.2,
    sizeMax: 2.8,
  };

  const resize = () => {
    const rect = host.getBoundingClientRect();
    width = Math.max(1, Math.floor(rect.width));
    height = Math.max(1, Math.floor(rect.height));
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = prefersReducedMotion()
      ? config.minParticles
      : Math.max(
          config.minParticles,
          Math.min(config.maxParticles, Math.floor((width * height) / config.density)),
        );

    particles.length = 0;
    for (let i = 0; i < count; i += 1) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * config.speed,
        vy: (Math.random() - 0.5) * config.speed,
        size: config.sizeMin + Math.random() * (config.sizeMax - config.sizeMin),
      });
    }
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i += 1) {
      const p = particles[i];

      if (!prefersReducedMotion()) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        p.x = Math.max(0, Math.min(width, p.x));
        p.y = Math.max(0, Math.min(height, p.y));
      }

      if (mouse.active) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 120 && dist > 0.01) {
          p.x += (dx / dist) * 0.35;
          p.y += (dy / dist) * 0.35;
        }
      }

      ctx.beginPath();
      ctx.fillStyle = config.particleColor;
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      for (let j = i + 1; j < particles.length; j += 1) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.hypot(dx, dy);
        if (dist < config.linkDistance) {
          const alpha = (1 - dist / config.linkDistance) * 0.45;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${config.linkColor}, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }

      if (mouse.active) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < config.linkDistance) {
          const alpha = (1 - dist / config.linkDistance) * 0.55;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${config.linkColor}, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }

    animationId = requestAnimationFrame(draw);
  };

  const onPointerMove = (event) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
    mouse.active = true;
  };

  const onPointerLeave = () => {
    mouse.active = false;
  };

  resize();
  draw();

  resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  banner.addEventListener('pointermove', onPointerMove);
  banner.addEventListener('pointerleave', onPointerLeave);

  host.__wnParticlesCleanup = () => {
    banner.removeEventListener('pointermove', onPointerMove);
    banner.removeEventListener('pointerleave', onPointerLeave);
  };
}

export function destroyBannerParticlesFully() {
  if (hostEl?.__wnParticlesCleanup) {
    hostEl.__wnParticlesCleanup();
    delete hostEl.__wnParticlesCleanup;
  }
  destroyBannerParticles();
}
