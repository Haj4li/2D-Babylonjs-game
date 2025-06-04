// game.js

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("renderCanvas");
  const engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
  const scene = new BABYLON.Scene(engine);

  // Camera: Dynamic Orthographic 2D
  const camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 0, -10), scene);
  camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, false);

  // Light (required)
  new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

  // Sprite Manager
  const spriteManager = new BABYLON.SpriteManager(
    "playerManager",
    "assets/player.png",
    1,
    { width: GameConfig.SPRITE_SIZE, height: GameConfig.SPRITE_SIZE },
    scene
  );
  spriteManager.texture.hasAlpha = true;
  spriteManager.texture.updateSamplingMode(BABYLON.Texture.NEAREST_NEAREST_MIPNEAREST);

  // Create player sprite
  const player = new BABYLON.Sprite("player", spriteManager);
  player.position = new BABYLON.Vector3(0, 0, 0);
  player.width = GameConfig.SPRITE_SIZE;
  player.height = GameConfig.SPRITE_SIZE;

  // Resize camera based on screen
  function resizeCamera() {
    const aspect = canvas.clientWidth / canvas.clientHeight;
    const viewHeight = GameConfig.DESIGN_HEIGHT;
    const viewWidth = viewHeight * aspect;

    camera.orthoTop = viewHeight / 2;
    camera.orthoBottom = -viewHeight / 2;
    camera.orthoLeft = -viewWidth / 2;
    camera.orthoRight = viewWidth / 2;
  }

  // Input handling
  const keys = {};
  window.addEventListener("keydown", (e) => keys[e.key] = true);
  window.addEventListener("keyup", (e) => keys[e.key] = false);

  scene.onBeforeRenderObservable.add(() => {
    // Snap player to integer positions to avoid subpixel artifacts
    player.position.x = Math.round(player.position.x);
    player.position.y = Math.round(player.position.y);

    if (keys["ArrowUp"] || keys["w"]) player.position.y += GameConfig.PLAYER_SPEED;
    if (keys["ArrowDown"] || keys["s"]) player.position.y -= GameConfig.PLAYER_SPEED;
    if (keys["ArrowLeft"] || keys["a"]) player.position.x -= GameConfig.PLAYER_SPEED;
    if (keys["ArrowRight"] || keys["d"]) player.position.x += GameConfig.PLAYER_SPEED;
  });

  resizeCamera();
  engine.runRenderLoop(() => scene.render());
  window.addEventListener("resize", () => {
    engine.resize();
    resizeCamera();
  });
});
