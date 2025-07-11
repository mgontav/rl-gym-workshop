import { Game } from "../Game.js";
import { Hunter } from "./Hunter.js";
import { Bear } from "./Bear.js";
import { Rabbit } from "./Rabbit.js";
const { Bodies, Composite } = Matter;

class CircleWorld extends Game {
  static AGENT_CLASSES = {
    "hunter": Hunter,
    "bear": Bear,
    "rabbit": Rabbit,
    "wall": null
  };

  constructor(engine, gameConfig) {
    super(engine, gameConfig);
    this.engine.world.gravity.y = 0; // No gravity in top-down world

    this.nBears = gameConfig.nBears || 10;
    this.nRabbits = gameConfig.nRabbits || 5;

    this.hunter = null;
    this.bears = [];
    this.rabbits = [];

    this.agentClasses = CircleWorld.AGENT_CLASSES;

    this.setupGame();
    this.createAgents();
  }

  setupGame() {
    const wallOptions = {
      isStatic: true,
      plugin: { particle: this },
      label: "wall"
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
    // Create hunter
    this.hunter = new Hunter(this);

    for (let i = 0; i < this.nBears; i++) {
      const bear = new Bear(this);
      this.bears.push(bear);
    }

    for (let i = 0; i < this.nRabbits; i++) {
      const rabbit = new Rabbit(this);
      this.rabbits.push(rabbit);
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

    this.hunter.draw();

    this.bears.forEach((bear) => {
      bear.draw();
    });

    this.rabbits.forEach((rabbit) => {
      rabbit.draw();
    });
  }

  tick() {
    // Update game logic here
    this.hunter.update();

    this.bears.forEach((bear) => {
      bear.update();
    });

    this.rabbits.forEach((rabbit) => {
      rabbit.update();
    });
  }
}

export { CircleWorld };
