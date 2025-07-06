import { Pipe } from "./Pipe.js";
import { Brain } from "./Brain.js";

const { Bodies, Body, Composite } = Matter;

class Bird {
  static collider = 0x002; // Unique identifier for the bird collider
  static COOLDOWN = 2;
  static SIZE = 15;
  static img = new p5().loadImage("../../assets/bird.png"); // Load bird image

  constructor(game, options = {}) {
    this.game = game;
    this.engine = game.engine;

    this.alive = true; // Flag to check if the bird is alive
    this.score = 0;
    this.actionCooldown = 0;

    this.body = Bodies.circle(100, 100 + random(-25, 25), Bird.SIZE, {
      collisionFilter: {
        category: Bird.collider, // Unique identifier for the bird collider
        mask: Pipe.collider, // Collide with pipes
      },
    });
    this.body.plugin.particle = this; // For collision detection

    Composite.add(this.engine.world, this.body);

    // If we're using evolution, we need to set up the neural network
    if (options.evolution) {
      if (options.brain) {
        this.birdBrain = new Brain({ brain: options.brain }); // Use the provided brain
      } else {
        this.birdBrain = new Brain();
      }
    }
  }

  draw() {
    push();

    imageMode(CENTER);
    image(
      Bird.img,
      this.body.position.x,
      this.body.position.y,
      Bird.SIZE * 2,
      Bird.SIZE * 2
    );

    pop();
  }

  update(context) {
    if (this.alive) {
      this.score++;

      if (this.actionCooldown <= 0) {
        const nextPipe = this.findNextPipe(context.pipes);
        let inputs = [
          this.body.position.y / this.game.height,
          this.body.velocity.y / this.game.height,
          nextPipe.topHeight / this.game.height,
          (nextPipe.topPipe.position.x - this.body.position.x) /
            this.game.width,
        ];

        let action = this.birdBrain.getAction(inputs);
        if (action === "flap") {
          this.flap();
        }

        this.actionCooldown = Bird.COOLDOWN; // Reset cooldown
      } else {
        this.actionCooldown--;
      }
    }
  }

  findNextPipe(pipes) {
    // Find the next pipe that is ahead of the bird
    return pipes.find(
      (pipe) =>
        pipe.topPipe.position.x + pipe.pipeWidth / 2 > this.body.position.x
    );
  }

  /* ACTIONS */

  flap(force = 0.01) {
    Body.applyForce(this.body, this.body.position, { x: 0, y: -force });
  }
}

export { Bird };
