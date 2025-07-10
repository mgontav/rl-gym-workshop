import { Game } from "../Game.js";
import { Runner } from "./Runner.js";
const { Bodies, Composite } = Matter;

class CircleWorld extends Game {
  constructor(engine, gameConfig) {
    super(engine, gameConfig);
    this.engine.world.gravity.y = 0; // No gravity in top-down world

    this.nRunners = gameConfig.nRunners || 1;
    this.nHunters = gameConfig.nHunters || 10;
    this.nFood = gameConfig.nFood || 5;

    this.runners = [];
    this.hunters = [];
    this.food = [];

    this.setupGame();
    this.createAgents();
  }

  setupGame() {
    const wallOptions = {
      isStatic: true,
      plugin: { particle: this },
    };

    // Create world boundaries
    Composite.add(this.engine.world, [
      Bodies.rectangle(this.width / 2, 0, this.width - 20, 20, wallOptions), // Top
      Bodies.rectangle(
        this.width / 2,
        this.height,
        this.width - 20,
        20,
        wallOptions
      ), // Bottom
      Bodies.rectangle(0, this.height / 2, 20, this.height, wallOptions), // Left
      Bodies.rectangle(
        this.width,
        this.height / 2,
        20,
        this.height,
        wallOptions
      ), // Right
    ]);
  }

  createAgents() {
    // Create runners
    for (let i = 0; i < this.nRunners; i++) {
      const runner = new Runner(this);
      this.runners.push(runner);
    }
  }

  drawWorldBounds() {
    push();
    fill("gray");
    rectMode(CENTER);
    rect(this.width / 2, 0, this.width - 20, 20); // Top
    rect(this.width / 2, this.height, this.width - 20, 20); // Bottom
    rect(0, this.height / 2, 20, this.height); // Left
    rect(this.width, this.height / 2, 20, this.height); // Right
    pop();
  }

  draw() {
    this.drawWorldBounds();

    this.runners.forEach((runner) => {
      runner.draw();
    });
    this.hunters.forEach((hunter) => {
      hunter.draw();
    });
    this.food.forEach((foodItem) => {
      foodItem.draw();
    });
  }

  tick() {
    // Update game logic here
    this.runners.forEach((runner) => {
      runner.update();
    });
    this.hunters.forEach((hunter) => {
      hunter.update();
    });
    this.food.forEach((foodItem) => {
      foodItem.update();
    });
  }
}

export { CircleWorld };
