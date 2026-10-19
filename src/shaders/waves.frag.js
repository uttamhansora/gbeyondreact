export default `#version 300 es
precision highp float;

/*
  Silk folds matched to the Hartmann Spline backdrop.
  Four broad sheets, not a stack of thin wires.
  Each crest is a soft cyan lip. The slope below it is a wide cobalt face
  that falls off into a near-black valley.

  RIDGE_SPEED    drift of the cloth
  RIM_STRENGTH   hot lip on the crest
  HALO_STRENGTH  bloom around the lip
  BODY_STRENGTH  deep-blue face under the crest
*/

#define RIDGE_SPEED 0.14
#define RIM_STRENGTH 1.35
#define HALO_STRENGTH 0.34
#define BODY_STRENGTH 0.7

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uScroll;

in vec2 vUv;
out vec4 fragColor;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  float t = uTime;
  float x = uv.x + uMouse.x * 0.03 + uScroll * 0.015;

  vec3 col = vec3(0.0, 0.01, 0.035);

  for (int i = 0; i < __LAYER_COUNT__; i++) {
    float fi = float(i);
    float near = fi / 3.0;
    float phase = t * RIDGE_SPEED + uScroll * (0.45 + near) + fi * 1.7;
    float breathe = sin(phase) * 0.012;

    float crest;
    float faceK;
    float lipK;
    float bloomK;
    float energy;

    if (i == 0) {
      crest = 0.96
        - sin(x * 3.14159) * 0.09
        + smoothstep(0.46, 0.8, x) * 0.16
        + sin(x * 2.2 + phase * 0.65) * 0.01
        + breathe;
      faceK = 4.2;
      lipK = 1400.0;
      bloomK = 220.0;
      energy = 0.58;
    } else if (i == 1) {
      crest = 0.4
        + x * 0.22
        - exp(-pow((x - 0.18) / 0.18, 2.0)) * 0.08
        + sin(x * 1.8 + phase) * 0.014
        + breathe;
      faceK = 2.6;
      lipK = 1500.0;
      bloomK = 240.0;
      energy = 0.62 * mix(0.15, 1.0, smoothstep(0.28, 0.88, x));
    } else if (i == 2) {
      crest = 0.16
        + smoothstep(0.22, 0.98, x) * 0.26
        + sin(x * 2.4 + phase * 1.1) * 0.012
        + breathe;
      faceK = 3.1;
      lipK = 2000.0;
      bloomK = 300.0;
      energy = 0.9 * smoothstep(0.28, 0.7, x);
    } else {
      crest = -0.02
        + pow(max(x - 0.22, 0.0), 1.15) * 0.22
        + sin(x * 3.0 + phase * 0.75) * 0.008
        + breathe;
      faceK = 3.6;
      lipK = 2400.0;
      bloomK = 360.0;
      energy = 1.15 * smoothstep(0.48, 0.82, x);
    }

    crest += uMouse.y * mix(0.01, 0.03, near) - uScroll * near * 0.02;

    float d = crest - uv.y;
    float face = exp(-max(d, 0.0) * faceK) * smoothstep(-0.008, 0.03, d);
    float bloom = exp(-d * d * bloomK);
    float lip = exp(-d * d * lipK);

    float right = smoothstep(0.0, 0.9, x);
    vec3 cobalt = vec3(0.0, 0.06, 0.32);
    vec3 azure = vec3(0.0, 0.28, 0.95);
    vec3 cyan = vec3(0.2, 0.9, 1.0);
    vec3 faceCol = mix(cobalt, vec3(0.0, 0.16, 0.62), near * right);
    vec3 lipCol = mix(azure, cyan, clamp(near * right, 0.0, 1.0));

    vec3 rgb = (faceCol * face * BODY_STRENGTH
      + lipCol * bloom * HALO_STRENGTH
      + lipCol * lip * RIM_STRENGTH) * energy;

    float alpha = clamp((face * 0.8 + bloom * 0.28 + lip * 0.9) * energy, 0.0, 1.0);

    float text = smoothstep(0.62, 0.14, uv.x)
      * smoothstep(0.2, 0.46, uv.y)
      * smoothstep(0.84, 0.58, uv.y);
    float keep = mix(1.0, 0.22, text);
    rgb *= keep;
    alpha *= keep;

    col = col * (1.0 - alpha) + rgb;
  }

  float vig = smoothstep(1.25, 0.2, length((uv - vec2(0.5, 0.46)) * vec2(aspect * 0.55, 1.0)));
  col *= mix(0.72, 1.0, vig);

  float grain = hash(uv * uResolution.xy + fract(t) * 13.0) - 0.5;
  col += grain * 0.01;

  fragColor = vec4(col, 1.0);
}
`;
