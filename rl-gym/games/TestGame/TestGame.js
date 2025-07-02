import { Game } from "../Game.js";
import { Square } from "./Square.js";

const { Bodies, Composite } = Matter;

class TestGame extends Game {
  static collider = 0x0010;

  constructor(engine, options = {}) {
    super(engine, options);

    this.PLATFORM_HEIGHT = this.options.height / 10;
    this.PLATFORM_WIDTH = this.options.width * 0.8;

    this.squares = [];
    this.platform = this.createPlatform();

    this.setupInputHandlers();
  }

  createPlatform() {
    let platform = Bodies.rectangle(
      this.options.width / 2,
      this.options.height - 50,
      this.PLATFORM_WIDTH,
      this.PLATFORM_HEIGHT,
      {
        isStatic: true,
        collisionFilter: {
          category: TestGame.collider,
          mask:
            Square.colliders.red |
            Square.colliders.green |
            Square.colliders.blue |
            Square.colliders.yellow,
        },
      }
    );

    Composite.add(this.engine.world, platform);

    return platform;
  }

  drawPlatform() {
    rectMode(CENTER);
    fill(150);
    rect(
      this.platform.position.x,
      this.platform.position.y,
      this.PLATFORM_WIDTH,
      this.PLATFORM_HEIGHT
    );
  }

  draw() {
    this.drawPlatform();

    for (let square of this.squares) {
      square.draw();
    }
  }

  tick() {}

  setupInputHandlers() {
    this.handleMouseClick = (x, y) => {
      // Create a new square at the mouse position
      let size = random(20, 50);
      let square = new Square(this.engine, x, y, size);
      this.squares.push(square);
    };
  }
}

export { TestGame };
