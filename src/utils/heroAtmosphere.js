const REF_W = 2259;
const REF_H = 1701;

const COLORS = new Float32Array([
  0, 0.0274509806, 0.1137254909, 1,
  0.0117647061, 0.2901960909, 0.8470588326, 1,
  0.470588237, 0.7882353067, 1, 1,
  0, 0, 0, 0,
  0, 0, 0, 0,
  0, 0, 0, 0,
  0, 0, 0, 0,
  0, 0, 0, 0,
]);

const VERT = `#version 300 es
precision highp float;
in vec2 a_position;
in vec2 a_texCoord;
uniform vec4 u_uvRect;
out vec2 v_uv;
void main() {
  v_uv = mix(u_uvRect.xy, u_uvRect.zw, a_texCoord);
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

#define NUM_COLORS 8

uniform vec4 u_colors[NUM_COLORS];
uniform int u_colors_length;
uniform float u_seed;
uniform float u_speed;
uniform float u_loop;
uniform float u_scale;
uniform float u_turbAmp;
uniform float u_turbFreq;
uniform float u_turbIter;
uniform float u_waveFreq;
uniform float u_distBias;
uniform float u_jellify;
uniform float u_mousePush;
uniform float u_mouseRadius;
uniform float u_mouseStretch;
uniform float u_mousePersist;
uniform float u_ditherMode;
uniform float u_dither;
uniform float u_exposure;
uniform float u_contrast;
uniform float u_saturation;

uniform sampler2D u_push_buffer;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_deltaTime;
uniform float u_pixelRatio;
uniform vec4 u_mousePosition;
uniform float u_mousePointerDown;
uniform float u_mouseHover;

const float GOLDEN_ANGLE = 2.3999632;
const float TAU = 6.28318530;

uvec3 hash3(uvec3 v) {
    v = v * 1664525u + 1013904223u;
    v.x += v.y * v.z;
    v.y += v.z * v.x;
    v.z += v.x * v.y;
    v ^= v >> 16u;
    v.x += v.y * v.z;
    v.y += v.z * v.x;
    v.z += v.x * v.y;
    return v;
}

vec3 seedRandom(float seedVal) {
    uvec3 s = uvec3(
        floatBitsToUint(seedVal),
        floatBitsToUint(seedVal * 1.5 + 7.31),
        floatBitsToUint(seedVal * 2.7 + 13.37)
    );
    s = hash3(s);
    return vec3(s) / float(0xFFFFFFFFu);
}

vec3 toLinear(vec3 c) {
    return pow(c, vec3(2.2));
}

vec3 toSrgb(vec3 c) {
    return pow(clamp(c, 0.0, 1.0), vec3(0.4545));
}

vec3 linearToOklab(vec3 c) {
    float l = 0.4122214708 * c.r + 0.5363325363 * c.g + 0.0514459929 * c.b;
    float m = 0.2119034982 * c.r + 0.6806995451 * c.g + 0.1073969566 * c.b;
    float s = 0.0883024619 * c.r + 0.2817188376 * c.g + 0.6299787005 * c.b;

    l = pow(max(l, 0.0), 1.0/3.0);
    m = pow(max(m, 0.0), 1.0/3.0);
    s = pow(max(s, 0.0), 1.0/3.0);

    return vec3(
        0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
        1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
        0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s
    );
}

vec3 oklabToLinear(vec3 c) {
    float l = c.x + 0.3963377774 * c.y + 0.2158037573 * c.z;
    float m = c.x - 0.1055613458 * c.y - 0.0638541728 * c.z;
    float s = c.x - 0.0894841775 * c.y - 1.2914855480 * c.z;

    l = l * l * l;
    m = m * m * m;
    s = s * s * s;

    return vec3(
        +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
        -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
        -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
    );
}

vec3 oklabToLch(vec3 lab) {
    return vec3(lab.x, length(lab.yz), atan(lab.z, lab.y));
}

vec3 lchToOklab(vec3 lch) {
    return vec3(lch.x, lch.y * cos(lch.z), lch.y * sin(lch.z));
}

vec3 mixLch(vec3 lab0, vec3 lab1, float t) {
    vec3 lch0 = oklabToLch(lab0);
    vec3 lch1 = oklabToLch(lab1);

    if (lch0.y < 0.05) lch0.z = lch1.z;
    if (lch1.y < 0.05) lch1.z = lch0.z;

    float dh = lch1.z - lch0.z;
    if (dh > 3.14159265) dh -= 6.28318530;
    if (dh < -3.14159265) dh += 6.28318530;

    return lchToOklab(vec3(
        mix(lch0.x, lch1.x, t),
        mix(lch0.y, lch1.y, t),
        lch0.z + dh * t
    ));
}

vec3 getColor(int idx) {
    if (u_colors_length < 1) return vec3(0.0);
    int safeIdx = clamp(idx, 0, u_colors_length - 1);
    return u_colors[safeIdx].rgb;
}

vec3 paletteN(float t, int count) {
    if (count < 1) return vec3(0.0);
    if (count < 2) return toLinear(getColor(0));

    float segmentSize = 1.0 / float(count - 1);
    t = clamp(t, 0.0, 1.0);
    int idx = min(int(floor(t / segmentSize)), count - 2);
    float localT = clamp((t - float(idx) * segmentSize) / segmentSize, 0.0, 1.0);

    vec3 lab0 = linearToOklab(toLinear(getColor(idx)));
    vec3 lab1 = linearToOklab(toLinear(getColor(idx + 1)));

    return oklabToLinear(mixLch(lab0, lab1, localT));
}

float IGN(vec2 uv) {
    return fract(52.9829189 * fract(dot(uv, vec2(0.06711056, 0.00583715))));
}

float quickNoise(vec2 I) {
    return fract(sin(dot(I, vec2(12.9898, 78.233))) * 43758.5453);
}

float getDither(vec2 I, float mode) {
    if (mode < 0.5) return 0.5;
    if (mode < 1.5) return IGN(I);
    return quickNoise(I);
}

vec3 softGamutMap(vec3 linearRgb) {
    float maxC = max(linearRgb.r, max(linearRgb.g, linearRgb.b));
    float minC = min(linearRgb.r, min(linearRgb.g, linearRgb.b));

    if (minC >= 0.0 && maxC <= 1.0) return linearRgb;

    vec3 lab = linearToOklab(max(linearRgb, 0.0));
    float L = clamp(lab.x, 0.0, 1.0);
    float C = length(lab.yz);
    float h = atan(lab.z, lab.y);

    float maxChroma = 0.4 * (1.0 - pow(abs(2.0 * L - 1.0), 2.0));

    if (C > maxChroma * 0.7) {
        float knee = maxChroma * 0.7;
        C = knee + (maxChroma - knee) * tanh((C - knee) / (maxChroma - knee + 0.001));
    }

    return clamp(oklabToLinear(vec3(L, C * cos(h), C * sin(h))), 0.0, 1.0);
}

vec3 applyContrastSaturation(vec3 linearRgb, float contrast, float saturation) {
    vec3 lab = linearToOklab(linearRgb);
    float C = length(lab.yz);
    float h = atan(lab.z, lab.y);

    lab.x = clamp((lab.x - 0.5) * contrast + 0.5, 0.0, 1.0);
    C *= saturation;
    lab.y = C * cos(h);
    lab.z = C * sin(h);

    return oklabToLinear(lab);
}

void main() {
    vec2 fragCoord = v_uv * u_resolution;
    vec2 r = u_resolution;
    vec2 p = (fragCoord * 2.0 - r) / r.y;

    int colorCount = u_colors_length;

    if (colorCount < 1) {
        fragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
    }

    float t = u_time * 0.3;

    float looping = step(0.5, u_loop);
    float phase = TAU * u_time / max(u_loop, 0.01);
    float radius = u_loop * u_speed * 0.3 / TAU;
    float tA = sin(phase) * radius;
    float tB = (1.0 - cos(phase)) * radius;

    vec3 seedOffset = seedRandom(u_seed);
    vec3 seedOffset2 = seedRandom(u_seed + 100.0);

    float seedAngle = u_seed * GOLDEN_ANGLE;
    vec2 seedPhase = (seedOffset2.xy - 0.5) * TAU;

    float cs = cos(seedAngle);
    float sn = sin(seedAngle);
    mat2 rot = mat2(cs, -sn, sn, cs);
    p = rot * p;

    vec2 pushField = texture(u_push_buffer, v_uv).xy;
    p -= rot * pushField * 2.0;

    float dither = getDither(floor(fragCoord / u_pixelRatio), u_ditherMode);

    float totalVal = 0.0;
    float totalWeight = 0.0;
    int turbIter = int(u_turbIter);

    float freq = 1.0 / max(u_turbFreq, 0.01);

    for (float i = 0.0; i < 4.0; i++) {
        float eph = i / 4.0;

        vec2 q = p * u_scale;
        float sq = eph * eph;

        if (u_jellify > 0.5) {
            q.yx *= mix(1.0, 0.5, 1.0 - exp(-sq));
        }

        float a = seedPhase.x;
        float d = seedPhase.y;

        for (int j = 2; j < 13; j++) {
            if (j >= turbIter) break;
            float fj = float(j);
            float t1 = mix(t * u_speed, tA, looping);
            float t2 = mix(t * u_speed, tB, looping);
            q += u_turbAmp * sin(q.yx / freq * fj + t1 + vec2(a, d) + seedOffset.xy * fj) / fj;
            a += cos(fj + d * 1.2 + q.x * 2.0 - t1 + seedOffset2.z + t2 * 0.3 * looping);
            d += sin(fj * q.y + a + seedOffset.z + t1 + seedOffset2.y + t2 * 0.3 * looping);
        }

        float v = 0.5 + 0.5 * sin(length(q.yx + vec2(a, d) * 0.2) * u_waveFreq + i * i + seedOffset.x);
        float weight = smoothstep(0.0, 0.5, eph) * smoothstep(1.0, 0.5, eph);
        totalVal += v * weight;
        totalWeight += weight;
    }

    float val = totalVal / totalWeight;
    val = clamp((val - 0.3) / 0.4, 0.0, 1.0);
    val = pow(val, exp(-u_distBias));
    val = clamp(val + (dither - 0.5) * u_dither, 0.0, 1.0);

    vec3 col = paletteN(val, colorCount);
    col *= u_exposure;
    col = applyContrastSaturation(col, u_contrast, u_saturation);
    col = softGamutMap(col);
    col = toSrgb(col);

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

export function destroyHeroAtmosphere() {
  if (activeDestroy) {
    activeDestroy();
    activeDestroy = null;
  }
}

export function initHeroAtmosphere(root) {
  destroyHeroAtmosphere();
  if (!root) return false;

  root.querySelectorAll('.wnHero__bgOrb').forEach((node) => node.remove());

  let canvas = root.querySelector('[data-wn-hero-canvas]');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.className = 'wnHero__canvas';
    canvas.setAttribute('data-wn-hero-canvas', '');
    canvas.setAttribute('aria-hidden', 'true');
    root.appendChild(canvas);
  }

  const gl = canvas.getContext('webgl2', {
    alpha: true,
    premultipliedAlpha: false,
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

  const pushTex = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, pushTex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4));

  gl.useProgram(program);
  gl.enableVertexAttribArray(0);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0);
  gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 16, 8);

  const loc = (name) => gl.getUniformLocation(program, name);
  const uTime = loc('u_time');
  const uResolution = loc('u_resolution');
  const uUvRect = loc('u_uvRect');
  const uPush = loc('u_push_buffer');

  gl.uniform1i(loc('u_colors_length'), 3);
  gl.uniform4fv(loc('u_colors[0]'), COLORS);
  gl.uniform1f(loc('u_seed'), 281);
  gl.uniform1f(loc('u_speed'), 0.59);
  gl.uniform1f(loc('u_loop'), 0);
  gl.uniform1f(loc('u_scale'), 0.75);
  gl.uniform1f(loc('u_turbAmp'), 0.5);
  gl.uniform1f(loc('u_turbFreq'), 0.4);
  gl.uniform1f(loc('u_turbIter'), 8);
  gl.uniform1f(loc('u_waveFreq'), 1.2);
  gl.uniform1f(loc('u_distBias'), 0);
  gl.uniform1f(loc('u_jellify'), 0);
  gl.uniform1f(loc('u_ditherMode'), 1);
  gl.uniform1f(loc('u_dither'), 0.05);
  gl.uniform1f(loc('u_exposure'), 1.1);
  gl.uniform1f(loc('u_contrast'), 1.1);
  gl.uniform1f(loc('u_saturation'), 1);
  gl.uniform1f(loc('u_pixelRatio'), 1);
  if (uPush) gl.uniform1i(uPush, 0);

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
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const nextW = Math.max(2, Math.round(cssW * dpr));
    const nextH = Math.max(2, Math.round(cssH * dpr));
    if (canvas.width !== nextW || canvas.height !== nextH) {
      canvas.width = nextW;
      canvas.height = nextH;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
  };

  const fieldRect = () => {
    const virtualH = Math.max(cssH, cssW * (REF_H / REF_W));
    const frac = Math.min(1, cssH / virtualH);
    return {
      resolution: [cssW, virtualH],
      uv: [1, 1 - frac, 0, 1],
    };
  };

  const draw = (now) => {
    const seconds = reduceQuery.matches ? 24 : (now - started) / 1000;
    const field = fieldRect();
    gl.uniform1f(uTime, seconds);
    gl.uniform2f(uResolution, field.resolution[0], field.resolution[1]);
    gl.uniform4f(uUvRect, field.uv[0], field.uv[1], field.uv[2], field.uv[3]);
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

  const resizeObserver = new ResizeObserver(onResize);
  resizeObserver.observe(root);

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
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
    reduceQuery.removeEventListener('change', onResize);
    gl.deleteTexture(pushTex);
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
  };

  return true;
}
