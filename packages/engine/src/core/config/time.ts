export const TARGET_FPS = 60;

export const FRAME_TIME = 1 / TARGET_FPS; // ≈ 0.016667 s

/**
 * Ceiling for the elapsed time a single animation frame may hand the
 * simulation. A backgrounded tab comes back owing whole seconds; simulating
 * all of them at once would freeze the page catching up and shoot bodies
 * through every collider on the way, so the surplus is written off and the
 * world simply runs late.
 */
export const MAX_FRAME_TIME = 0.25; // 15 fixed steps
