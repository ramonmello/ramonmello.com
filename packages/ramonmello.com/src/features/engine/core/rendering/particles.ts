export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
}

export interface EmitterConfig {
  num: number;
  speed: [number, number];
  size: [number, number];
  duration: number;
}
