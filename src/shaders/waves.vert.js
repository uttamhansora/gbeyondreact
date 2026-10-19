const wavesVert = `#version 300 es
in vec2 aPosition;
out vec2 vUv;

void main() {
  // Fullscreen triangle. The visible clip region maps vUv to 0..1.
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

export default wavesVert;
