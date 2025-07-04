import { Pong } from "./games/Pong/Pong.js";
import { FlappyGame } from "./games/FlappyGame/FlappyGame.js";
import { TestGame } from "./games/TestGame/TestGame.js";

const { Engine } = Matter;
const WIDTH = 800,
  HEIGHT = 400;

let gameFont;
let canvas, engine, game;
let playButton, timeSlider;

/*
  Preload function to load assets before the game starts.
  Is called once before setup and blocks for asynchronous loading.
*/
function preload() {
  gameFont = loadFont("./assets/PressStart2P-Regular.ttf");
}

/*
  P5.js setup function.
  This is called once when the program starts.
*/
function setup() {
  canvas = createCanvas(WIDTH, HEIGHT);
  engine = Engine.create();

  textFont(gameFont);

  /* CHOOSE YOUR GAME HERE */
  // game = new TestGame(engine, {
  //   width: WIDTH,
  //   height: HEIGHT,
  // });

  // game = new FlappyGame(engine, {
  //   controls: "keyboard", // 'keyboard', 'mouse'
  //   width: WIDTH,
  //   height: HEIGHT,
  // });

  game = new Pong(engine, {
    width: WIDTH,
    height: HEIGHT,
  });

  Matter.Events.on(engine, "collisionStart", game.handleCollisions.bind(game));

  createControlPanel();
}

/*
  Create the control panel for the game
  This is where we will add buttons, sliders, etc. to control the game.
*/
function createControlPanel() {
  // Create a button to start the game
  playButton = createButton("⏸︎ Pause");
  playButton.size(80, 40);
  playButton.style("font-size", "12px");
  playButton.mousePressed(() => {
    if (isLooping()) {
      noLoop();
      playButton.html("▶︎ Play");
    } else {
      loop();
      playButton.html("⏸︎ Pause");
    }
  });

  // Create a slider to control the time step of the physics engine
  timeSlider = createSlider(1, 100, 1);
  timeSlider.style("width", "150px");

  canvas.parent("canvas-container");
  playButton.parent("playback-controls");
  timeSlider.parent("speed-controls");
}

/* 
  Main draw/update loop, following p5.js conventions.
*/
function draw() {
  background(220);
  // Draw our current game state
  game.draw();

  for (let i = 0; i < timeSlider.value(); i++) {
    // Tick the game logic
    // (This is where the game logic updates, such as updating scores, making decisions, etc.)
    game.tick();
    // Update our physics engine to reflect changes in the environment
    Engine.update(engine);

    // Post-tick logic, optional
    // This can be used for any additional updates that need to happen after our environment
    // and game logic have been updated.
    game.postTick();
  }
}

/*
  Handlers for user input 
  These functions are called when the user interacts with the game.
*/
function mouseClicked() {
  if (game.handleMouseClick && typeof game.handleMouseClick === "function") {
    game.handleMouseClick(mouseX, mouseY);
  }
}

function keyPressed() {
  if (game.handleKeyPress && typeof game.handleKeyPress === "function") {
    game.handleKeyPress(key);
  }
}

/* 
  Hacks to handle using p5.js as a module.
  Ref: https://forum.processing.org/two/discussion/24662/script-type-module-draw-and-setup-not-working.html
*/
window.preload = preload;
window.setup = setup;
window.draw = draw;
window.mouseClicked = mouseClicked;
window.keyPressed = keyPressed;
