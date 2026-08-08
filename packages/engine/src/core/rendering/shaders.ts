/**
 * Built-in shaders, embedded in the bundle.
 *
 * They are strings rather than `.glsl` files fetched over HTTP so the engine
 * does not depend on a server exposing them at a fixed route: it works under a
 * subpath, in tests, and outside this site. To change the render pipeline, pass
 * your own GLSL to `initWebGLContext(canvas, { vertexShader, fragmentShader })`
 * instead of editing this file.
 *
 * The render systems (`RenderSystem`, `EmitterRenderSystem`) expect the
 * `a_position` attribute and the `u_resolution`, `u_translation`, `u_rotation`
 * and `u_color` uniforms. Custom shaders that rename any of them need custom
 * render systems as well.
 */

export const DEFAULT_VERTEX_SHADER = `attribute vec2 a_position;
uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform float u_rotation;

void main() {
  vec2 rotatedPosition = vec2(
    a_position.x * cos(u_rotation) - a_position.y * sin(u_rotation),
    a_position.x * sin(u_rotation) + a_position.y * cos(u_rotation)
  );

  vec2 position = rotatedPosition + u_translation;

  vec2 clipSpace = (position / u_resolution) * 2.0 - 1.0;
  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
}
`;

export const DEFAULT_FRAGMENT_SHADER = `precision mediump float;
uniform vec4 u_color;

void main() {
  gl_FragColor = u_color;
}
`;
