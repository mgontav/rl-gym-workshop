const { Body, Bodies, Composite } = Matter;

class Ball {
  static SIZE = 15; // Size of the ball
  static BALL_PHYSICS = {
    restitution: 1.01, // Bouncy and gains a bit of speed on each bounce
    inertia: Infinity, // Infinite inertia to prevent rotation
    friction: 0, // No frictionw
    frictionAir: 0, // No air friction
    frictionStatic: 0, // No static friction
    density: 0.001, // Low density for easy movement
  };

  constructor(engine, width, height) {
    this.engine = engine;
    this.width = width;
    this.height = height;

    this.spawnBall();
  }

  spawnBall() {
    this.body = Bodies.circle(
      this.width / 2,
      this.height / 2 + random(-50, 50), // Random vertical offset for initial position
      Ball.SIZE / 2, // Radius is half the size
      Ball.BALL_PHYSICS
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
    Composite.remove(this.engine.world, this.body);

    this.spawnBall();
  }

  push() {
    const xSpeed = 5 * random([-1, 1]); // Random initial x velocity
    const ySpeed = 5 * random([-1, 1]); // Random initial y velocity

    Body.setVelocity(this.body, {
      x: xSpeed, // Random initial direction
      y: ySpeed, // Random initial direction
    });
  }
}

export { Ball };
