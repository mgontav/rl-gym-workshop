import { RLBrain } from "./RLBrain.js";

const { Body, Bodies, Composite } = Matter;

class PongPlayer {
  static PLAYER_WIDTH = 5; // Width of the player paddle
  static PLAYER_HEIGHT = 60; // Height of the player paddle
  static MOVE_SPEED = 5; // Speed of the player paddle movement

  constructor(game, playerOptions) {
    this.game = game;
    this.engine = game.engine;

    this.side = playerOptions.side; // "left" or "right"
    this.color = playerOptions.color;
    this.controls = playerOptions.controls;

    this.paddleHeight = playerOptions.height || PongPlayer.PLAYER_HEIGHT;

    this.xPosition =
      this.side === "left"
        ? game.wallWidth / 2 + PongPlayer.PLAYER_WIDTH / 2
        : game.width - game.wallWidth / 2 - PongPlayer.PLAYER_WIDTH / 2;

    this.body = Bodies.rectangle(
      this.xPosition,
      game.height / 2,
      PongPlayer.PLAYER_WIDTH,
      this.paddleHeight,
      {
        isStatic: true,
      }
    );
    this.body.plugin.particle = this;

    Composite.add(this.engine.world, this.body);

    /* Initialize the player with AI controls if specified. */
    this.nSensors = 5;
    this.actions = ["up", "down", "stay"]; // Possible actions for the player

    // Setup AI controls if they are specified
    if (this.controls.type === "ai") {
      if (this.controls.model === "followBall") {
        this.brain = {
          act: this.moveWithBall.bind(this),
          reset: () => {}, // No reset needed for this simple model
        };
      } else if (this.controls.model === "rl") {
        // Add other AI models here
        this.brain = new RLBrain(this.nSensors, this.actions);
      }
    }
  }

  draw() {
    push();
    fill(this.color);
    rectMode(CENTER);
    rect(
      this.body.position.x,
      this.body.position.y,
      PongPlayer.PLAYER_WIDTH,
      this.paddleHeight
    );
    pop();
  }

  update() {
    if (this.controls.type === "keyboard") {
      this.moveWithKeyboard();
    } else {
      let inputs = this.sense();

      let action = this.brain.act(inputs);
      this.move(action);
    }
  }

  // Sense the environment
  sense() {
    // For simplicity, we can return the position of the player and the ball
    // We normalize the values to be between 0 and 1 based on the game dimensions
    // and a normalized ball velocity
    const ball = this.game.ball.body;
    return [
      this.body.position.y / this.game.height, // Player Y position
      ball.position.x / this.game.width, // Ball X position
      ball.position.y / this.game.height, // Ball Y position
      ball.velocity.y / 10,
      ball.velocity.x / 10,
    ];
  }

  getReward(reward) {
    if (this.controls.type === "ai" && this.controls.model === "rl") {
      // If using RL, we can pass the reward to the brain
      this.brain.learn(reward);
    }
  }

  getPseudoReward() {
    // If the ball is moving towards the player and the player is in the right position,
    // we can give a positive reward, otherwise a negative one.
    const ball = this.game.ball.body;

    const ballY = ball.position.y;
    const playerY = this.body.position.y;

    const deltaY = Math.abs(ballY - playerY);
    const positionError =
      deltaY <= this.paddleHeight / 2 ? 0 : deltaY / this.game.height;

    const ballX = ball.position.x;
    const playerX = this.body.position.x;

    const deltaX = Math.pow(Math.abs(ballX - playerX) / this.game.width, 2);

    const ballVelocityX = ball.velocity.x;
    const isBallMovingTowardsPlayer =
      (this.side === "left" && ballVelocityX < 0) ||
      (this.side === "right" && ballVelocityX > 0);

    return (
      (1 - positionError) * (1 - deltaX) * (isBallMovingTowardsPlayer ? 1 : 0)
    );
  }

  reset() {
    // Reset the player position to the center of the screen
    Body.setPosition(this.body, {
      x: this.xPosition,
      y: this.game.height / 2,
    });

    if (this.brain) {
      this.brain.reset();
    }
  }

  move(direction) {
    const maxY =
      this.game.height - this.paddleHeight / 2 - this.game.wallWidth / 2;
    const minY = this.paddleHeight / 2 + this.game.wallWidth / 2;
    let yMove = 0;

    if (direction === "up" && this.body.position.y > minY) {
      yMove = -1; // Move up
    } else if (direction === "down" && this.body.position.y < maxY) {
      yMove = 1; // Move down
    }

    Body.setPosition(this.body, {
      x: this.body.position.x,
      y: this.body.position.y + yMove * PongPlayer.MOVE_SPEED,
    });
  }

  moveWithKeyboard() {
    if (keyIsDown(this.controls.keys[0])) {
      this.move("up");
    } else if (keyIsDown(this.controls.keys[1])) {
      this.move("down");
    }
  }

  moveWithBall() {
    const ball = this.game.ball.body;

    const targetY = ball.position.y;

    // Calculate the new position for the player
    let deltaY = targetY - this.body.position.y;

    if (deltaY > 0) {
      return "down";
    } else if (deltaY < 0) {
      return "up";
    } else {
      return "stay"; // No movement needed
    }
  }
}

export { PongPlayer };
