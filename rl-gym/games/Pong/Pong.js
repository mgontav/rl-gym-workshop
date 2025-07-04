import { Game } from "../Game.js";
import { PongPlayer } from "./PongPlayer.js";
import { Ball } from "./Ball.js";

const { Bodies, Composite } = Matter;

class Pong extends Game {
  static P1_OPTIONS = {
    side: "left",
    color: "blue",
    controls: {
      type: "ai",
      model: "rl",
    },
  };

  static P2_OPTIONS = {
    side: "right",
    color: "red",
    controls: {
      type: "ai",
      model: "rl",
    },
  };

  static WALL_WIDTH = 10;

  constructor(engine, options = {}) {
    super(engine, options);
    this.engine.world.gravity.y = 0; // No gravity in Pong

    this.score = [0, 0];
    this.rewards = [0, 0];
    this.restart = false; // Flag to indicate if the game should be restarted

    // Initialize the two players
    this.players = [
      new PongPlayer(
        this,
        engine,
        options.width,
        options.height,
        Pong.WALL_WIDTH,
        options.player1 || Pong.P1_OPTIONS
      ),
      new PongPlayer(
        this,
        engine,
        options.width,
        options.height,
        Pong.WALL_WIDTH,
        options.player2 || Pong.P2_OPTIONS
      ),
    ];

    // Initialize the ball
    this.ball = new Ball(engine, options.width, options.height);

    this.createBounds(options.width, options.height);
  }

  // Create the game bounds
  createBounds(width, height) {
    console.log("Creating bounds");
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
    this.rewards = [0, 0]; // Reset rewards for each tick
    this.players.forEach((player) => player.update());
  }

  // We use the postTick method to pass on rewards to the
  // players after the game logic has been updated.
  postTick() {
    this.players.forEach((player, index) => {
      this.rewards[index] += 0.5 * player.getPseudoReward();
      player.getReward(this.rewards[index]);
    });

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

      if (
        Game.pairIsCollisionBetween(bodyA, bodyB, Ball, PongPlayer) ||
        Game.pairIsCollisionBetween(bodyA, bodyB, PongPlayer, Ball)
      ) {
        this.handlePlayerCollision(bodyA, bodyB);
      }
    }
  }

  handleWallCollision(bodyA, bodyB) {
    if (bodyA.label === "leftGoal" || bodyB.label === "leftGoal") {
      // Right player scores
      this.score[1]++;
      this.rewards[1] += 10; // Reward for right player
      this.rewards[0] -= 10; // Penalty for left player
      this.restart = true;
    } else if (bodyA.label === "rightGoal" || bodyB.label === "rightGoal") {
      // Left player scores
      this.score[0]++;
      this.rewards[0] += 10; // Reward for left player
      this.rewards[1] -= 10; // Penalty for right player
      this.restart = true;
    }
  }

  handlePlayerCollision(bodyA, bodyB) {
    const player = Game.getInstanceFromCollision(bodyA, bodyB, PongPlayer);

    if (player.side === "left") {
      // Left player hits the ball
      this.rewards[0] += 1; // Reward for left player
    } else if (player.side === "right") {
      // Right player hits the ball
      this.rewards[1] += 1; // Reward for right player
    }
  }
}

export { Pong };
