import { useEffect, useRef } from 'react';
import wavesFrag from '../shaders/waves.frag.js';
import wavesVert from '../shaders/waves.vert.js';

const MAX_DPR = 1.75;
const DESKTOP_LAYERS = 4;
const MOBILE_LAYERS = 4;
const MOBILE_QUERY = '(max-width: 760px)';
const REDUCE_QUERY = '(prefers-reduced-motion: reduce)';

function layerCountFor(mobileQuery) {
  return mobileQuery.matches ? MOBILE_LAYERS : DESKTOP_LAYERS;
}

function toWebGL1(source, kind) {
  const body = source.replace(/#version 300 es\s*/, '');
  if (kind === 'vert') {
    return body
      .replace('in vec2 aPosition;', 'attribute vec2 aPosition;')
      .replace('out vec2 vUv;', 'varying vec2 vUv;');
  }
  return body
    .replace('in vec2 vUv;', 'varying vec2 vUv;')
    .replace(/out vec4 fragColor;\s*/, '')
    .replace(/\bfragColor\b/g, 'gl_FragColor');
}

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader) || 'shader compile failed';
    gl.deleteShader(shader);
    const error = new Error(log);
    error.shaderLog = log;
    throw error;
  }
  return shader;
}

function createProgram(gl, vertSource, fragSource) {
  const vert = compileShader(gl, gl.VERTEX_SHADER, vertSource);
  const frag = compileShader(gl, gl.FRAGMENT_SHADER, fragSource);

  const program = gl.createProgram();
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.bindAttribLocation(program, 0, 'aPosition');
  gl.linkProgram(program);
  gl.deleteShader(vert);
  gl.deleteShader(frag);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

export default function WaveBackground() {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return undefined;

    const attrs = {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
    };

    let isWebGL2 = true;
    let gl = canvas.getContext('webgl2', attrs);
    if (!gl) {
      isWebGL2 = false;
      gl = canvas.getContext('webgl', attrs) || canvas.getContext('experimental-webgl', attrs);
    }

    if (!gl || gl.isContextLost()) {
      root.classList.add('is-fallback');
      return undefined;
    }

    const mobileQuery = window.matchMedia(MOBILE_QUERY);
    const reduceQuery = window.matchMedia(REDUCE_QUERY);
    let layers = layerCountFor(mobileQuery);

    const sourceFor = (count) => {
      const frag = wavesFrag.replaceAll('__LAYER_COUNT__', String(count));
      if (isWebGL2) return { vert: wavesVert, frag };
      return { vert: toWebGL1(wavesVert, 'vert'), frag: toWebGL1(frag, 'frag') };
    };

    let sources = sourceFor(layers);
    let program;
    try {
      program = createProgram(gl, sources.vert, sources.frag);
      if (!program) throw new Error('program link failed');
    } catch (error) {
      root.dataset.shaderError = error.shaderLog || error.message;
      const ext = gl.getExtension('WEBGL_lose_context');
      ext?.loseContext();
      root.classList.add('is-fallback');
      return undefined;
    }

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // One oversized triangle covers the clip-space quad.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    const bindMesh = () => {
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    };

    const uniforms = () => ({
      uTime: gl.getUniformLocation(program, 'uTime'),
      uResolution: gl.getUniformLocation(program, 'uResolution'),
      uMouse: gl.getUniformLocation(program, 'uMouse'),
      uScroll: gl.getUniformLocation(program, 'uScroll'),
    });

    gl.useProgram(program);
    bindMesh();
    let locs = uniforms();

    let raf = 0;
    let disposed = false;
    let onScreen = true;
    const mouse = { x: 0, y: 0 };
    const mouseTarget = { x: 0, y: 0 };

    const resize = () => {
      const rect = root.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const width = Math.max(2, Math.round(rect.width * dpr));
      const height = Math.max(2, Math.round(rect.height * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);

      const nextLayers = layerCountFor(mobileQuery);
      if (nextLayers !== layers) {
        const nextSources = sourceFor(nextLayers);
        let nextProgram;
        try {
          nextProgram = createProgram(gl, nextSources.vert, nextSources.frag);
        } catch {
          nextProgram = null;
        }
        if (nextProgram) {
          gl.deleteProgram(program);
          program = nextProgram;
          layers = nextLayers;
          gl.useProgram(program);
          bindMesh();
          locs = uniforms();
        }
      }
    };

    const draw = (now) => {
      const reduced = reduceQuery.matches;
      mouse.x += (mouseTarget.x - mouse.x) * 0.075;
      mouse.y += (mouseTarget.y - mouse.y) * 0.075;
      const scroll = window.scrollY / Math.max(window.innerHeight, 1);

      gl.useProgram(program);
      gl.uniform1f(locs.uTime, reduced ? 4.2 : now * 0.001);
      gl.uniform2f(locs.uResolution, canvas.width, canvas.height);
      gl.uniform2f(locs.uMouse, reduced ? 0 : mouse.x, reduced ? 0 : mouse.y);
      gl.uniform1f(locs.uScroll, reduced ? 0 : scroll);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const frame = (now) => {
      raf = 0;
      if (disposed) return;
      draw(now);
      if (!reduceQuery.matches && onScreen && !document.hidden) {
        raf = requestAnimationFrame(frame);
      }
    };

    const start = () => {
      if (disposed || raf || reduceQuery.matches || !onScreen || document.hidden) return;
      raf = requestAnimationFrame(frame);
    };

    resize();
    draw(performance.now());
    start();

    const onResize = () => {
      resize();
      draw(performance.now());
    };

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(root);

    const intersectionObserver = new IntersectionObserver((entries) => {
      onScreen = entries.some((entry) => entry.isIntersecting);
      if (onScreen) start();
      else stop();
    });
    intersectionObserver.observe(root);

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    const onMouseMove = (event) => {
      const w = Math.max(window.innerWidth, 1);
      const h = Math.max(window.innerHeight, 1);
      mouseTarget.x = (event.clientX / w) * 2 - 1;
      mouseTarget.y = -((event.clientY / h) * 2 - 1);
    };

    const onMotionChange = () => {
      if (reduceQuery.matches) {
        stop();
        mouse.x = 0;
        mouse.y = 0;
        draw(performance.now());
      } else {
        start();
      }
    };

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    mobileQuery.addEventListener('change', onResize);
    reduceQuery.addEventListener('change', onMotionChange);

    const onContextLost = (event) => {
      event.preventDefault();
      stop();
    };
    canvas.addEventListener('webglcontextlost', onContextLost);

    return () => {
      disposed = true;
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('mousemove', onMouseMove);
      mobileQuery.removeEventListener('change', onResize);
      reduceQuery.removeEventListener('change', onMotionChange);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      const lose = gl.getExtension('WEBGL_lose_context');
      lose?.loseContext();
    };
  }, []);

  return (
    <div ref={rootRef} className="hcWave" aria-hidden="true">
      <canvas ref={canvasRef} className="hcWave__canvas" />
    </div>
  );
}
