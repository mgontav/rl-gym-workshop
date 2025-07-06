import { Game } from "../Game.js";
import { Pipe } from "./Pipe.js";
import { Bird } from "./Bird.js";

const { Bodies, Composite } = Matter;

class FlappyGame extends Game {
  /* INITIALIZATION */
  static pipeInterval = 120; // Interval for pipe generation

  constructor(engine, options = {}) {
    super(engine, options);
    this.time = 0;

    this.score = 0;
    this.maxScore = 0;

    this.bird = new Bird(this);

    this.pipes = [new Pipe(this)];

    this.createWorldBounds();
    this.setupInputHandlers();
  }

  createWorldBounds() {
    // Create the world bounds to prevent birds from flying out of the screen
    const config = {
      isStatic: true,
      collisionFilter: {
        category: Pipe.collider,
        mask: Bird.collider,
      },
    };

    let topWall = Bodies.rectangle(
      this.options.width / 2,
      -100,
      this.options.width,
      200 - Bird.SIZE,
      config
    );
    topWall.plugin.particle = this;

    let bottomWall = Bodies.rectangle(
      this.options.width / 2,
      this.options.height + 100,
      this.options.width,
      200 - Bird.SIZE,
      config
    );
    bottomWall.plugin.particle = this;

    Composite.add(this.engine.world, [topWall, bottomWall]);
  }

  setupInputHandlers() {
    if (this.options.controls == "mouse") {
      this.handleMouseClick = (x, y) => {
        if (this.bird.alive) {
          this.bird.flap(); // Make the bird flap when mouse is clicked
        }
      };
    } else if (this.options.controls == "keyboard") {
      this.handleKeyPress = (key) => {
        if (key === " ") {
          if (this.bird.alive) {
            this.bird.flap(); // Make the bird flap when space is pressed
          }
        }
      };
    }
  }

  /*                   */
  /* LIFECYCLE METHODS */
  /*                   */

  /* DISPLAY METHODS */

  draw() {
    // Draw bird
    if (this.bird.alive) {
      this.bird.draw();
    }

    // Draw all Pipes
    this.pipes.forEach((pipe) => pipe.draw());

    // Draw game stats
    this.drawStats();
  }

  drawStats() {
    fill(0);
    textSize(8);
    textAlign(LEFT, TOP);
    text(`Score: ${this.score}`, 10, 10);
    text(`Max Score: ${this.maxScore}`, 10, 30);
  }

  /* GAME LOGIC METHODS */

  tick() {
    this.time++;
    this.score++; // Increment score for each tick
    this.maxScore = Math.max(this.maxScore, this.score);

    this.updateBirds();
    this.updatePipes();
  }

  updateBirds() {
    // Update all Birds
    if (this.bird.alive) {
      this.bird.update();
    }
  }

  updatePipes() {
    // Update all Pipes
    for (let pipe of this.pipes) {
      pipe.update();
      if (pipe.isOffScreen()) {
        Composite.remove(this.engine.world, [pipe.topPipe, pipe.bottomPipe]);
        this.pipes.splice(this.pipes.indexOf(pipe), 1); // Remove the pipe from the array
      }
    }

    // Add new pipes at regular intervals
    if (this.time % FlappyGame.pipeInterval === 0) {
      // Every 60 frames
      this.pipes.push(new Pipe(this));
    }
  }

  postTick() {
    if (!this.bird.alive) {
      this.resetGame(); // Reset the game if the bird is not alive
    }
  }

  resetGame() {
    // Reset the game state
    this.bird = new Bird(this);

    // Remove all pipes but the last one and re-initialize
    for (let i = 0; i < this.pipes.length - 1; i++) {
      let pipe = this.pipes[i];
      Composite.remove(this.engine.world, [pipe.topPipe, pipe.bottomPipe]);
    }

    this.pipes = this.pipes.slice(-1); // Keep only the last pipe

    // Reset game stats
    this.score = 0;
  }

  /* COLLISION HANDLING */

  handleCollisions(event) {
    // Handle collisions between the bird and pipes
    for (let pair of event.pairs) {
      const bodyA = pair.bodyA;
      const bodyB = pair.bodyB;

      if (
        Game.pairIsCollisionBetween(bodyA, bodyB, Bird, Pipe) ||
        Game.pairIsCollisionBetween(bodyA, bodyB, Bird, FlappyGame)
      ) {
        this.handleBirdPipeCollision(bodyA, bodyB);
      }
    }
  }

  handleBirdPipeCollision(bodyA, bodyB) {
    console.log("Bird hit a pipe!");
    const bird = Game.getInstanceFromCollision(bodyA, bodyB, Bird);

    bird.alive = false; // Set the bird to not so much alive
    Composite.remove(this.engine.world, bird.body); // Remove the bird from the world}
  }
}

export { FlappyGame };
