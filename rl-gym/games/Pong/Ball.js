const { Body, Bodies, Composite } = Matter;

class Ball {
  static SIZE = 15; // Size of the ball

  constructor(engine, width, height) {
    this.engine = engine;
    this.width = width;
    this.height = height;

    this.body = Bodies.circle(
      width / 2,
      height / 2,
      Ball.SIZE / 2, // Radius is half the size
      {
        restitution: 1, // Bouncy
        inertia: Infinity, // Infinite inertia to prevent rotation
        friction: 0, // No friction
        frictionAir: 0, // No air friction
        frictionStatic: 0, // No static friction
        density: 0.001, // Low density for easy movement
      }
    );

    this.body.plugin.particle = this;

    Composite.add(this.engine.world, this.body);

    // Initial push
    this.push();
  }

  draw() {
    push();
    fill("yellow");
    circle(this.body.position.x, this.body.position.y, Ball.SIZE);
    pop();
  }

  reset() {
    // Reset the ball to the center of the screen
    Body.setPosition(this.body, {
      x: this.width / 2,
      y: this.height / 2,
    });

    // Reset velocity
    this.push();
  }

  push() {
    Body.setVelocity(this.body, {
      x: 5 * (Math.random() < 0.5 ? 1 : -1), // Random initial direction
      y: 5 * (Math.random() < 0.5 ? 1 : -1), // Random initial direction
    });
  }
}

export { Ball };
