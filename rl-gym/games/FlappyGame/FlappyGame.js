import { Game } from "../Game.js";
import { Pipe } from "./Pipe.js";
import { Bird } from "./Bird.js";
import { Brain } from "./Brain.js";

const { Bodies, Composite } = Matter;

class FlappyGame extends Game {
  /* INITIALIZATION */

  constructor(engine, options = {}) {
    super(engine, options);
    this.time = 0;
    this.pipeInterval = 100; // Interval for pipe generation

    ml5.setBackend("cpu"); // Set the backend for ml5.js
    this.populationSize = options.populationSize || 200;

    this.birds = [];
    for (let i = 0; i < this.populationSize; i++) {
      this.birds.push(new Bird(engine, { evolution: true }));
    }

    this.pipes = [new Pipe(engine, options.width, options.height)];

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
      200,
      config
    );
    topWall.plugin.particle = this;

    let bottomWall = Bodies.rectangle(
      this.options.width / 2,
      this.options.height + 100,
      this.options.width,
      200,
      config
    );
    bottomWall.plugin.particle = this;

    Composite.add(this.engine.world, [topWall, bottomWall]);
  }

  setupInputHandlers() {
    if (this.options.controls == "mouse") {
      this.handleMouseClick = (x, y) => {
        this.birds.forEach((bird) => {
          if (bird.alive) {
            bird.flap(); // Make the bird flap when mouse is clicked
          }
        });
      };
    } else if (this.options.controls == "keyboard") {
      this.handleKeyPress = (key) => {
        if (key === " ") {
          this.birds.forEach((bird) => {
            if (bird.alive) {
              bird.flap(); // Make the bird flap when space is pressed
            }
          });
        }
      };
    }
  }

  /* LIFECYCLE METHODS */

  draw() {
    // Draw all birds
    this.birds.forEach((bird) => {
      if (bird.alive) {
        bird.draw();
      }
    });

    // Draw all Pipes
    this.pipes.forEach((pipe) => pipe.draw());
  }

  tick() {
    this.time++;
    this.updateBirds();
    this.updatePipes();

    if (this.birds.every((bird) => !bird.alive)) {
      // If all birds are dead, reset the game
      this.resetGame();
    }
  }

  updateBirds() {
    // Update all Birds
    for (let bird of this.birds) {
      if (bird.alive) {
        bird.update({
          pipes: this.pipes,
          width: this.options.width,
          height: this.options.height,
        });
      }
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
    if (frameCount % this.pipeInterval === 0) {
      // Every 60 frames
      this.pipes.push(
        new Pipe(this.engine, this.options.width, this.options.height)
      );
    }
  }

  resetGame() {
    // Reset the game state

    // Create a new bird population
    let newBirds = [];
    Brain.normalizeScore(this.birds);

    for (let i = 0; i < this.populationSize; i++) {
      let brainA = Brain.weighedSelection(this.birds);
      let brainB = Brain.weighedSelection(this.birds);

      let childBrain = Brain.createChild(brainA, brainB);

      newBirds.push(
        new Bird(this.engine, { evolution: true, brain: childBrain })
      );
    }

    this.birds = newBirds;

    // Remove all pipes but the last one and re-initialize
    for (let i = 0; i < this.pipes.length - 1; i++) {
      let pipe = this.pipes[i];
      Composite.remove(this.engine.world, [pipe.topPipe, pipe.bottomPipe]);
    }

    this.pipes = this.pipes.slice(-1); // Keep only the last pipe

    this.time = 0; // Reset the time counter
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
