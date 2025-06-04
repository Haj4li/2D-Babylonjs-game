window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('renderCanvas');
  const engine = new BABYLON.Engine(canvas, true);
  const scene = new BABYLON.Scene(engine);

  // Ortho 2D Camera Setup
  const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 0, -10), scene);
  camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
  camera.orthoLeft = -400;
  camera.orthoRight = 400;
  camera.orthoTop = 300;
  camera.orthoBottom = -300;
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, true);

  // Create dummy light (Babylon requires one)
  new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

  // SpriteManager Setup
  const spriteSize = 64; // Your sprite size in px
  const spriteManager = new BABYLON.SpriteManager(
    "playerManager",
    "assets/player.png",
    1,
    { width: spriteSize, height: spriteSize },
    scene
  );

  // Player Sprite
  const player = new BABYLON.Sprite("player", spriteManager);
  player.position = new BABYLON.Vector3(0, 0, 0);
  player.width = spriteSize;
  player.height = spriteSize;

  // Fix Transparency Issue
  spriteManager.texture.hasAlpha = true;

  // Fix Subpixel White Line — Set sampling mode to NEAREST
  spriteManager.texture.updateSamplingMode(BABYLON.Texture.NEAREST_NEAREST_MIPNEAREST);

  // Movement keys
  const keys = {};
  window.addEventListener("keydown", (e) => keys[e.key] = true);
  window.addEventListener("keyup", (e) => keys[e.key] = false);

  scene.onBeforeRenderObservable.add(() => {
    const speed = 5;
    if (keys["ArrowUp"] || keys["w"]) player.position.y += speed;
    if (keys["ArrowDown"] || keys["s"]) player.position.y -= speed;
    if (keys["ArrowLeft"] || keys["a"]) player.position.x -= speed;
    if (keys["ArrowRight"] || keys["d"]) player.position.x += speed;
  });

  engine.runRenderLoop(() => scene.render());
  window.addEventListener("resize", () => engine.resize());
});
