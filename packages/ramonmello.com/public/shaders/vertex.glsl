attribute vec2 a_position;
uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform float u_rotation;

void main() {
  // Aplica rotação
  vec2 rotatedPosition = vec2(
    a_position.x * cos(u_rotation) - a_position.y * sin(u_rotation),
    a_position.x * sin(u_rotation) + a_position.y * cos(u_rotation)
  );
  
  // Aplica translação
  vec2 position = rotatedPosition + u_translation;
  
  // Converte para coordenadas do clip space
  vec2 clipSpace = (position / u_resolution) * 2.0 - 1.0;
  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
} 