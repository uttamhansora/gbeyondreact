import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

const MARK_H = 226;
const FULL_W = 874;
const LOADER_SEEN_KEY = 'wn:loader-seen';

function hasSeenLoader() {
  if (typeof window === 'undefined') return true;
  try {
    return sessionStorage.getItem(LOADER_SEEN_KEY) === '1';
  } catch {
    return false;
  }
}

function markLoaderSeen() {
  try {
    sessionStorage.setItem(LOADER_SEEN_KEY, '1');
  } catch {
    /* ignore quota / private mode */
  }
}

function shouldRunLoader() {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  return !hasSeenLoader();
}

function buildTiles() {
  const size = window.innerWidth < 720 ? 64 : 96;
  const cols = Math.ceil(window.innerWidth / size);
  const rows = Math.ceil(window.innerHeight / size);
  const tiles = [];
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const fromBottom = (rows - 1 - row) / Math.max(1, rows - 1);
      tiles.push({
        id: `${col}-${row}`,
        col,
        row,
        inDelay: Math.random() * 0.42,
        outDelay: fromBottom * 0.34 + Math.random() * 0.14,
      });
    }
  }
  return { tiles, size };
}

export default function SiteLoader() {
  const [alive, setAlive] = useState(() => shouldRunLoader());
  const [phase, setPhase] = useState('enter');
  const pctRef = useRef(null);
  const barRef = useRef(null);
  const grid = useMemo(() => buildTiles(), []);

  useLayoutEffect(() => {
    document.getElementById('wn-boot')?.remove();
    if (!alive) {
      document.documentElement.classList.remove('wn-loading', 'wn-reveal');
      return undefined;
    }
    document.documentElement.classList.add('wn-loading');
    const frame = requestAnimationFrame(() => setPhase('count'));
    return () => {
      cancelAnimationFrame(frame);
      document.documentElement.classList.remove('wn-loading');
    };
  }, [alive]);

  useEffect(() => {
    if (!alive) return undefined;

    const paint = (value) => {
      if (pctRef.current) pctRef.current.textContent = `${value}%`;
      if (barRef.current) barRef.current.style.transform = `scaleX(${value / 100})`;
    };

    let value = 0;
    let wordTimer = 0;
    let outTimer = 0;
    let finishTimer = 0;
    paint(0);

    const timer = window.setInterval(() => {
      value += 1;
      if (value > 100) value = 100;
      paint(value);
      if (value < 100) return;

      window.clearInterval(timer);
      wordTimer = window.setTimeout(() => setPhase('word'), 220);
      outTimer = window.setTimeout(() => {
        const loader = document.querySelector('.wnLoader');
        const veil = document.querySelector('.wnLoader__veil');
        const stage = document.querySelector('.wnStage');
        loader?.classList.add('is-out', 'is-word');
        if (veil) {
          veil.style.transition = 'opacity 1.15s ease 0.12s';
          veil.style.opacity = '1';
        }
        if (stage) {
          stage.style.transition = 'filter 1.4s cubic-bezier(0.22, 1, 0.36, 1), transform 1.4s cubic-bezier(0.22, 1, 0.36, 1)';
          stage.style.filter = 'blur(22px)';
          stage.style.transform = 'scale(1.045)';
        }
        requestAnimationFrame(() => {
          if (veil) veil.style.opacity = '0';
          if (stage) {
            stage.style.filter = 'blur(0px)';
            stage.style.transform = 'scale(1)';
          }
        });
        setPhase('out');
        finishTimer = window.setTimeout(() => {
          if (stage) {
            stage.style.transition = '';
            stage.style.filter = '';
            stage.style.transform = '';
          }
          document.documentElement.classList.remove('wn-loading', 'wn-reveal');
          markLoaderSeen();
          setAlive(false);
        }, 1550);
      }, 980);
    }, 32);

    return () => {
      window.clearInterval(timer);
      window.clearTimeout(wordTimer);
      window.clearTimeout(outTimer);
      window.clearTimeout(finishTimer);
    };
  }, [alive]);

  if (!alive) return null;

  const leaving = phase === 'out';
  const named = phase === 'word' || phase === 'out';

  return (
    <div
      className={`wnLoader${named ? ' is-word' : ''}${leaving ? ' is-out' : ''}${phase === 'count' ? ' is-count' : ''}`}
      role="status"
      aria-label="Loading WhiteNet"
    >
      <div className="wnLoader__veil" aria-hidden="true" />
      <div className="wnLoader__tiles" aria-hidden="true">
        {grid.tiles.map((tile) => (
          <span
            key={tile.id}
            className="wnLoader__tile"
            style={{
              left: tile.col * grid.size,
              top: tile.row * grid.size,
              width: grid.size + 1,
              height: grid.size + 1,
              '--in': `${tile.inDelay}s`,
              '--out': `${tile.outDelay}s`,
            }}
          />
        ))}
      </div>

      <div className="wnLoader__center">
        <div className={`wnLoader__lockup${named ? ' is-open' : ''}`}>
          <img src="/assets/whitenet-logo-white.png" alt="" width={FULL_W} height={MARK_H} />
        </div>
        <div className="wnLoader__bar" aria-hidden="true">
          <span ref={barRef} />
        </div>
      </div>

      <div className="wnLoader__pct" ref={pctRef} aria-hidden="true">
        0%
      </div>
    </div>
  );
}
