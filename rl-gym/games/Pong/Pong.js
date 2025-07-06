import { Game } from "../Game.js";
import { PongPlayer } from "./PongPlayer.js";
import { Ball } from "./Ball.js";

const { Bodies, Composite } = Matter;

class Pong extends Game {
  static WALL_WIDTH = 10;

  constructor(engine, options = {}) {
    super(engine, options);
    this.engine.world.gravity.y = 0; // No gravity in Pong

    this.score = [0, 0];
    this.restart = false; // Flag to indicate if the game should be restarted

    this.wallWidth = Pong.WALL_WIDTH;

    // Initialize the two players
    this.players = [
      new PongPlayer(this, options.player1),
      new PongPlayer(this, options.player2),
    ];

    // Initialize the ball
    this.ball = new Ball(this);

    this.createBounds(options.width, options.height);
  }

  // Create the game bounds
  createBounds(width, height) {
    this.walls = [
      Bodies.rectangle(width / 2, 0, width, Pong.WALL_WIDTH, {
        isStatic: true,
        plugin: {
          particle: this,
        },
      }), // Top
      Bodies.rectangle(width / 2, height, width, Pong.WALL_WIDTH, {
        isStatic: true,
        plugin: {
          particle: this,
        },
      }), // Bottom
    ];

    this.goals = [
      Bodies.rectangle(0, height / 2, Pong.WALL_WIDTH, height, {
        isStatic: true,
        plugin: {
          particle: this,
        },
        label: "leftGoal",
      }), // Left goal
      Bodies.rectangle(width, height / 2, Pong.WALL_WIDTH, height, {
        isStatic: true,
        plugin: {
          particle: this,
        },
        label: "rightGoal",
      }), // Right goal
    ];

    // Add the bounds and goals to the world
    Composite.add(this.engine.world, [...this.walls, ...this.goals]);
  }

  draw() {
    this.drawBounds();

    this.players.forEach((player) => player.draw());
    this.ball.draw();

    this.drawScore();
  }

  drawBounds() {
    push();

    noStroke();
    rectMode(CENTER);

    fill(128);
    this.walls.forEach((wall) => {
      rect(
        wall.position.x,
        wall.position.y,
        this.options.width,
        Pong.WALL_WIDTH
      );
    });

    fill(125, 50);
    this.goals.forEach((goal) => {
      rect(
        goal.position.x,
        goal.position.y,
        Pong.WALL_WIDTH,
        this.options.height
      );
    });

    pop();
  }

  drawScore() {
    push();
    textAlign(CENTER, CENTER);
    fill("black");
    textStyle(BOLD);
    textSize(64);
    text(`${this.score[0]} - ${this.score[1]}`, width / 2, 50);
    pop();
  }

  tick() {
    this.players.forEach((player) => player.update());
  }

  postTick() {
    if (this.restart) {
      this.reset();
      this.restart = false; // Reset the restart flag
    }
  }

  reset() {
    // Reset the ball and players
    this.ball.reset();
    this.players.forEach((player) => player.reset());
  }

  handleCollisions(event) {
    // Handle collisions between the bird and pipes
    for (let pair of event.pairs) {
      const bodyA = pair.bodyA;
      const bodyB = pair.bodyB;

      if (
        Game.pairIsCollisionBetween(bodyA, bodyB, Ball, Pong) ||
        Game.pairIsCollisionBetween(bodyA, bodyB, Pong, Ball)
      ) {
        this.handleWallCollision(bodyA, bodyB);
      }
    }
  }

  handleWallCollision(bodyA, bodyB) {
    if (bodyA.label === "leftGoal" || bodyB.label === "leftGoal") {
      // Right player scores
      this.score[1]++;
      this.restart = true;
    } else if (bodyA.label === "rightGoal" || bodyB.label === "rightGoal") {
      // Left player scores
      this.score[0]++;
      this.restart = true;
    }
  }
}

export { Pong };
