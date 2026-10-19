const VERT = `#version 300 es
precision highp float;
in vec2 a_position;
in vec2 a_texCoord;
out vec2 v_uv;
void main() {
  v_uv = a_texCoord;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;

const float TAU = 6.2831853;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 34.345);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}

float terrain(vec2 p, float t) {
  vec2 q = p;
  q.x += sin(p.y * 0.22 + t * 0.11) * 0.35;
  float h = 0.0;
  h += sin(q.x * 0.62 + t * 0.17) * 0.42;
  h += sin(q.x * 1.05 - q.y * 0.28 + t * 0.13) * 0.28;
  h += sin(q.x * 1.85 + q.y * 0.45 - t * 0.09) * 0.16;
  h += (fbm(q * 0.38 + vec2(t * 0.025)) - 0.5) * 0.34;
  return h;
}

void main() {
  vec2 uv = v_uv;
  vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
  vec2 p = (uv - vec2(0.5, 0.78)) * aspect;

  float depth = 1.0 / (p.y + 0.72);
  vec2 world = vec2(p.x * depth * 1.05, depth + u_time * 0.055);

  float h = terrain(world, u_time);
  float hx = terrain(world + vec2(0.028, 0.0), u_time);
  float hy = terrain(world + vec2(0.0, 0.028), u_time);

  vec3 n = normalize(vec3(h - hx, 0.11, h - hy));
  vec3 lightDir = normalize(vec3(-0.2, 0.92, -0.42));
  float ndl = max(dot(n, lightDir), 0.0);
  float slope = length(vec2(h - hx, h - hy)) * 18.0;
  float crest = smoothstep(0.08, 0.88, h + 0.22);
  float rim = pow(1.0 - ndl, 2.2) * smoothstep(0.05, 0.82, slope);
  float edge = smoothstep(0.1, 0.62, slope) * crest;

  vec3 ink = vec3(0.006, 0.018, 0.045);
  vec3 glow = vec3(0.12, 0.48, 1.0);
  vec3 hot = vec3(0.55, 0.82, 1.0);

  vec3 col = ink;
  col += glow * rim * 2.05;
  col += hot * edge * 1.35;
  col += glow * crest * rim * 0.42;

  float sky = smoothstep(0.0, 0.52, uv.y);
  col = mix(ink * 0.25, col, sky);

  float mist = smoothstep(0.08, 0.95, uv.y);
  col = mix(col, ink * 0.55, pow(1.0 - mist, 1.1) * 0.35);

  vec2 vig = (uv - vec2(0.5, 0.55)) * vec2(1.08, 0.82);
  col *= 1.0 - dot(vig, vig) * 0.42;

  col = pow(col, vec3(0.88));
  fragColor = vec4(col, 1.0);
}
`;

let activeDestroy = null;

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(log || 'Shader compile failed');
  }
  return shader;
}

function createProgram(gl) {
  const program = gl.createProgram();
  const vert = compile(gl, gl.VERTEX_SHADER, VERT);
  const frag = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.bindAttribLocation(program, 0, 'a_position');
  gl.bindAttribLocation(program, 1, 'a_texCoord');
  gl.linkProgram(program);
  gl.deleteShader(vert);
  gl.deleteShader(frag);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(log || 'Program link failed');
  }
  return program;
}

export function destroyHeroHartmannWaves() {
  if (activeDestroy) {
    activeDestroy();
    activeDestroy = null;
  }
}

export function initHeroHartmannWaves(root) {
  destroyHeroHartmannWaves();
  if (!root) return false;

  root.querySelector('[data-wn-hero-canvas]')?.remove();

  let canvas = root.querySelector('[data-wn-hartmann-canvas]');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.className = 'wnHartmannBackdrop__canvas';
    canvas.setAttribute('data-wn-hartmann-canvas', '');
    canvas.setAttribute('aria-hidden', 'true');
    root.appendChild(canvas);
  }

  const gl = canvas.getContext('webgl2', {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: 'high-performance',
  });
  if (!gl) return false;

  let program;
  try {
    program = createProgram(gl);
  } catch {
    return false;
  }

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      -1, -1, 0, 0,
      1, -1, 1, 0,
      -1, 1, 0, 1,
      -1, 1, 0, 1,
      1, -1, 1, 0,
      1, 1, 1, 1,
    ]),
    gl.STATIC_DRAW,
  );

  gl.useProgram(program);
  gl.enableVertexAttribArray(0);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0);
  gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 16, 8);

  const uTime = gl.getUniformLocation(program, 'u_time');
  const uResolution = gl.getUniformLocation(program, 'u_resolution');

  const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let rafId = 0;
  let visible = true;
  let cssW = 1;
  let cssH = 1;
  const started = performance.now();

  const resize = () => {
    const rect = root.getBoundingClientRect();
    cssW = Math.max(1, rect.width);
    cssH = Math.max(1, rect.height);
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const nextW = Math.max(2, Math.round(cssW * dpr));
    const nextH = Math.max(2, Math.round(cssH * dpr));
    if (canvas.width !== nextW || canvas.height !== nextH) {
      canvas.width = nextW;
      canvas.height = nextH;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
  };

  const draw = (now) => {
    const seconds = reduceQuery.matches ? 18 : (now - started) / 1000;
    gl.uniform1f(uTime, seconds);
    gl.uniform2f(uResolution, cssW, cssH);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };

  const loop = (now) => {
    rafId = requestAnimationFrame(loop);
    if (reduceQuery.matches || !visible || document.hidden) return;
    draw(now);
  };

  const onResize = () => {
    resize();
    draw(performance.now());
  };

  resize();
  draw(performance.now());

  window.addEventListener('resize', onResize);

  const resizeObserver = new ResizeObserver(onResize);
  resizeObserver.observe(root);
  if (root.parentElement) {
    resizeObserver.observe(root.parentElement);
  }

  const intersectionObserver = new IntersectionObserver((entries) => {
    visible = entries.some((entry) => entry.isIntersecting);
    if (visible && !reduceQuery.matches) draw(performance.now());
  });
  intersectionObserver.observe(root);

  const onVisibility = () => {
    if (!document.hidden && !reduceQuery.matches) draw(performance.now());
  };
  document.addEventListener('visibilitychange', onVisibility);
  reduceQuery.addEventListener('change', onResize);

  if (!reduceQuery.matches) {
    rafId = requestAnimationFrame(loop);
  }

  activeDestroy = () => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
    window.removeEventListener('resize', onResize);
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
    reduceQuery.removeEventListener('change', onResize);
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
    canvas.remove();
  };

  return true;
}

export function ensureHartmannBackdrop() {
  if (!document.querySelector('.wnHero')) return null;

  let backdrop = document.querySelector('[data-wn-hartmann-backdrop]');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'wnHartmannBackdrop';
    backdrop.setAttribute('data-wn-hartmann-backdrop', '');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.prepend(backdrop);
  }
  return backdrop;
}
