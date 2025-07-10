export const WORLD_EVENTS = {
  STARTED: "worldStarted",
  STOPPED: "worldStopped",
  CLEARED: "worldCleared",
  DESTROYED: "worldDestroyed",
  PRE_UPDATE: "preUpdate",
  POST_UPDATE: "postUpdate",
  ENTITY_ADDED: "entityAdded",
  ENTITY_REMOVED: "entityRemoved",
};

export const PLAYER_EVENTS = {
  MOVE: "playerMove",
  FIRE: "playerFire",
  BOOST: "playerBoost",
  HIT: "playerHit",
  DIE: "playerDie",
  RESPAWN: "playerRespawn",
};

export const COLLISION_EVENTS = {
  DETECT: "collision.detect",

  RESOLVE: "collision.resolve",

  ENTER: "collision.trigger.enter",
  STAY: "collision.trigger.stay",
  EXIT: "collision.trigger.exit",
};

export const GAME_EVENTS = {
  SCORE_CHANGED: "scoreChanged",
  LEVEL_CHANGED: "levelChanged",
  GAME_OVER: "gameOver",
  GAME_WIN: "gameWin",
  GAME_PAUSE: "gamePause",
  GAME_RESUME: "gameResume",

  INITIALIZED: "gameInitialized",
  STARTED: "gameStarted",
  PAUSED: "gamePaused",
  RESUMED: "gameResumed",
  STOPPED: "gameStopped",
  RESTARTED: "gameRestarted",
};

export const PROJECTILE_EVENTS = {
  FIRE: "projectileFire",
  HIT: "projectileHit",
  EXPIRE: "projectileExpire",
};

export const ENTITY_EVENTS = {
  CREATED: "entityCreated",
  DESTROYED: "entityDestroyed",
  UPDATED: "entityUpdated",
  COMPONENT_ADDED: "componentAdded",
  COMPONENT_REMOVED: "componentRemoved",
  STATE_CHANGED: "entityStateChanged",
};

export const MESSAGE_TYPES = {
  ECS: {
    ENTITY_CREATED: "entity.created",
    ENTITY_DESTROYED: "entity.destroyed",
    COMPONENT_ADDED: "component.added",
    COMPONENT_REMOVED: "component.removed",
  },

  INPUT: {
    KEY_DOWN: "input.key.down",
    KEY_UP: "input.key.up",
    MOUSE_DOWN: "input.mouse.down",
    MOUSE_UP: "input.mouse.up",
    MOUSE_MOVE: "input.mouse.move",
  },

  GAME: {
    INIT: "game.init",
    START: "game.start",
    PAUSE: "game.pause",
    RESUME: "game.resume",
    END: "game.end",
  },
};
