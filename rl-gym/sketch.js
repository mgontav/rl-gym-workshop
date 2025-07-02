import { FlappyGame } from "./games/FlappyGame/FlappyGame.js";
import { TestGame } from "./games/TestGame/TestGame.js";

const { Engine } = Matter;
const WIDTH = 800,
  HEIGHT = 400;

let engine, game;

function setup() {
  createCanvas(WIDTH, HEIGHT);
  engine = Engine.create();

  /* CHOOSE YOUR GAME HERE */

  // game = new FlappyGame(engine, {
  //   controls: "keyboard", // 'keyboard', 'mouse'
  //   width: WIDTH,
  //   height: HEIGHT,
  // });

  game = new TestGame(engine, {
    width: WIDTH,
    height: HEIGHT,
  });

  Matter.Events.on(engine, "collisionStart", game.handleCollisions.bind(game));
}

function draw() {
  background(220);
  // Draw our current game state
  game.draw();

  // Tick the game logic
  // (This is where the game logic updates, such as updating scores, making decisions, etc.)
  game.tick();
  // Update our physics engine to reflect changes in the environment
  Engine.update(engine);
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
window.setup = setup;
window.draw = draw;
window.mouseClicked = mouseClicked;
window.keyPressed = keyPressed;
