// game.js

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("renderCanvas");
  const engine = new BABYLON.Engine(canvas, true);
  const scene = new BABYLON.Scene(engine);

  // Disable right-click context menu
  canvas.addEventListener("contextmenu", e => e.preventDefault());

  // 1. ORTHO 2D CAMERA
  const camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 0, -10), scene);
  camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
  camera.setTarget(BABYLON.Vector3.Zero());

  // 🔒 Disable Babylon's default camera input behavior
  camera.inputs.clear(); // NO zoom, drag, orbit, rotate, pan — all disabled

  // 2. LIGHT
  new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

  // 3. BACKGROUND SPRITE (Optional sky, sea, tiles, etc.)
  const bgManager = new BABYLON.SpriteManager("bg", "assets/bg.png", 1, { width: 1024, height: 768 }, scene);
  const background = new BABYLON.Sprite("background", bgManager);
  background.position = new BABYLON.Vector3(0, 0, 1); // Behind player (z > player)
  background.width = 1024;
  background.height = 768;

  // 4. PLAYER SPRITE
  const playerManager = new BABYLON.SpriteManager(
    "playerManager",
    "assets/player.png",
    1,
    { width: GameConfig.SPRITE_SIZE, height: GameConfig.SPRITE_SIZE },
    scene
  );
  playerManager.texture.hasAlpha = true;
  playerManager.texture.updateSamplingMode(BABYLON.Texture.NEAREST_NEAREST_MIPNEAREST);

  const player = new BABYLON.Sprite("player", playerManager);
  player.position = new BABYLON.Vector3(0, 0, 0);
  player.width = GameConfig.SPRITE_SIZE;
  player.height = GameConfig.SPRITE_SIZE;

  // 5. RESIZE LOGIC
  function resizeCamera() {
    const aspect = canvas.clientWidth / canvas.clientHeight;
    const viewHeight = GameConfig.DESIGN_HEIGHT;
    const viewWidth = viewHeight * aspect;

    camera.orthoTop = viewHeight / 2;
    camera.orthoBottom = -viewHeight / 2;
    camera.orthoLeft = -viewWidth / 2;
    camera.orthoRight = viewWidth / 2;

    // Update background scale
    background.width = viewWidth;
    background.height = viewHeight;
  }

  // 6. INPUT
  const keys = {};
  window.addEventListener("keydown", e => keys[e.key] = true);
  window.addEventListener("keyup", e => keys[e.key] = false);

  // 7. TOUCH AND MOUSE HANDLING
  canvas.addEventListener("touchstart", handleClick);
  canvas.addEventListener("mousedown", handleClick);

  function handleClick(e) {
    // Map screen to world
    const pickResult = scene.pick(scene.pointerX, scene.pointerY);
    if (pickResult && pickResult.pickedPoint) {
      const point = pickResult.pickedPoint;
      player.position.x = Math.round(point.x);
      player.position.y = Math.round(point.y);
    }
  }

  // 8. MOVEMENT LOOP
  scene.onBeforeRenderObservable.add(() => {
    if (keys["ArrowUp"] || keys["w"]) player.position.y += GameConfig.PLAYER_SPEED;
    if (keys["ArrowDown"] || keys["s"]) player.position.y -= GameConfig.PLAYER_SPEED;
    if (keys["ArrowLeft"] || keys["a"]) player.position.x -= GameConfig.PLAYER_SPEED;
    if (keys["ArrowRight"] || keys["d"]) player.position.x += GameConfig.PLAYER_SPEED;

    // Snap to pixel
    player.position.x = Math.round(player.position.x);
    player.position.y = Math.round(player.position.y);
  });

  resizeCamera();
  engine.runRenderLoop(() => scene.render());
  window.addEventListener("resize", () => {
    engine.resize();
    resizeCamera();
  });
});
