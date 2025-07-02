class Game {
  constructor(engine, options = {}) {
    this.engine = engine;
    this.options = options;
  }

  draw() {
    // This method should be overridden by subclasses to draw the game state
    throw new Error("Method 'draw()' must be implemented.");
  }

  tick() {
    // This method should be overridden by subclasses to update the game logic
    throw new Error("Method 'tick()' must be implemented.");
  }

  handleCollisions(event) {
    // This method can be overridden by subclasses to handle collisions
    // event.pairs contains the pairs of colliding bodies
    // You can implement custom collision handling logic here
    console.log("Collision detected:", event.pairs);
    for (let pair of event.pairs) {
      const bodyA = pair.bodyA;
      const bodyB = pair.bodyB;

      // Example: Log the bodies involved in the collision
      console.log(`Collision between ${bodyA.plugin.particle} and ${bodyB.plugin.particle}`);
    }
  }

  static pairIsCollisionBetween(bodyA, bodyB, typeA, typeB) {
    return (bodyA.plugin.particle instanceof typeA && bodyB.plugin.particle instanceof typeB) ||
           (bodyB.plugin.particle instanceof typeA && bodyA.plugin.particle instanceof typeB);
  }

  static getInstanceFromCollision(bodyA, bodyB, type) {
    if (bodyA.plugin.particle instanceof type) {
      return bodyA.plugin.particle;
    } else if (bodyB.plugin.particle instanceof type) {
      return bodyB.plugin.particle;
    }
    return null; // No instance found
  }

}

export { Game };