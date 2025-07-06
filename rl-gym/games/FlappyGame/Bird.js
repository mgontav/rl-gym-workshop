import { Pipe } from "./Pipe.js";

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

    this.body = Bodies.circle(100, 100 + random(-25, 25), Bird.SIZE, {
      collisionFilter: {
        category: Bird.collider, // Unique identifier for the bird collider
        mask: Pipe.collider, // Collide with pipes
      },
    });
    this.body.plugin.particle = this; // For collision detection

    Composite.add(this.engine.world, this.body);
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

  update() {
    if (this.alive) {
      this.score++;
    }
  }

  /* ACTIONS */

  flap(force = 0.025) {
    Body.applyForce(this.body, this.body.position, { x: 0, y: -force });
  }
}

export { Bird };
