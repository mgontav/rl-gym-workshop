import { Bird } from "./Bird.js";

const { Bodies, Body, Composite } = Matter;

class Pipe {
  static collider = 0x001; // Unique identifier for the pipe collider

  constructor(game) {
    this.game = game;
    this.engine = game.engine;

    this.spacing = 200;
    this.pipeWidth = 35;
    this.velocity = 3;

    this.holeCenter = random(this.spacing / 2, game.height - this.spacing / 2);
    this.topHeight = game.height - (this.holeCenter + this.spacing / 2);
    this.bottomHeight = game.height - (this.topHeight + this.spacing);

    this.topPipe = Bodies.rectangle(
      game.width + this.pipeWidth / 2,
      0 + this.topHeight / 2,
      this.pipeWidth,
      this.topHeight,
      {
        isStatic: true,
        collisionFilter: {
          category: Pipe.collider, // Use the unique identifier for the pipe collider
          mask: Bird.collider, // Collide with other objects (e.g., birds)
        },
      }
    );

    this.bottomPipe = Bodies.rectangle(
      game.width + this.pipeWidth / 2,
      game.height - this.bottomHeight / 2,
      this.pipeWidth,
      this.bottomHeight,
      { isStatic: true }
    );

    // Add our pipe components to the physics engine
    Composite.add(this.engine.world, [this.topPipe, this.bottomPipe]);
    this.topPipe.plugin.particle = this; // For collision detection
    this.bottomPipe.plugin.particle = this; // For collision detection
  }

  draw() {
    rectMode(CENTER);
    fill(0, 255, 0);
    rect(
      this.topPipe.position.x,
      this.topPipe.position.y,
      this.pipeWidth,
      this.topHeight
    );
    rect(
      this.bottomPipe.position.x,
      this.bottomPipe.position.y,
      this.pipeWidth,
      this.bottomHeight
    );
  }

  update() {
    // Move the pipes to the left
    Body.setPosition(this.topPipe, {
      x: this.topPipe.position.x - this.velocity,
      y: this.topPipe.position.y,
    });
    Body.setPosition(this.bottomPipe, {
      x: this.bottomPipe.position.x - this.velocity,
      y: this.bottomPipe.position.y,
    });
  }

  isOffScreen() {
    return this.topPipe.position.x < -this.pipeWidth / 2;
  }
}

export { Pipe };
