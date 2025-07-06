import { TestGame } from "./TestGame.js";

const { Bodies, Composite } = Matter;

class Square {
  static colors = ["red", "green", "blue", "yellow"];
  static colliders = {
    red: 0x0001,
    green: 0x0002,
    blue: 0x0004,
    yellow: 0x0008,
  };

  constructor(game, x, y, size) {
    this.game = game;
    this.engine = game.engine;

    this.color = random(Square.colors);
    this.size = size;

    this.body = Bodies.rectangle(x, y, size, size, {
      angle: random(-Math.PI, Math.PI),
      collisionFilter: {
        category: Square.colliders[this.color],
        mask: Square.colliders[this.color] | TestGame.collider,
      },
    });

    Composite.add(this.engine.world, this.body);
  }

  draw() {
    push();

    rectMode(CENTER);
    fill(this.color);
    translate(this.body.position.x, this.body.position.y);
    rotate(this.body.angle);

    square(0, 0, this.size);

    pop();
  }
}

export { Square };
