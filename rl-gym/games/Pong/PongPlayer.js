const { Body, Bodies, Composite } = Matter;

class PongPlayer {
  static PLAYER_WIDTH = 5; // Width of the player paddle
  static PLAYER_HEIGHT = 60; // Height of the player paddle
  static MOVE_SPEED = 5; // Speed of the player paddle movement

  constructor(game, engine, width, height, wallWidth, playerOptions) {
    this.game = game;
    this.engine = engine;

    this.side = playerOptions.side; // "left" or "right"
    this.color = playerOptions.color;
    this.controls = playerOptions.controls;

    this.wallWidth = wallWidth;

    this.xPosition =
      this.side === "left"
        ? wallWidth / 2 + PongPlayer.PLAYER_WIDTH / 2
        : width - wallWidth / 2 - PongPlayer.PLAYER_WIDTH / 2;

    this.body = Bodies.rectangle(
      this.xPosition,
      height / 2,
      PongPlayer.PLAYER_WIDTH,
      PongPlayer.PLAYER_HEIGHT,
      {
        isStatic: true,
      }
    );
    this.body.plugin.particle = this;

    Composite.add(this.engine.world, this.body);

    // Setup AI controls if they are specified
    if (this.controls.type === "ai") {
      if (this.controls.model === "followBall") {
        this.brain = {
          act: this.moveWithBall.bind(this),
        };
      } else {
        // Add other AI models here
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
      PongPlayer.PLAYER_HEIGHT
    );
    pop();
  }

  update() {
    if (this.controls.type === "keyboard") {
      this.moveWithKeyboard();
    } else {
      this.brain.act();
    }
  }

  reset() {
    // Reset the player position to the center of the screen
    Body.setPosition(this.body, {
      x: this.xPosition,
      y: height / 2,
    });
  }

  move(direction) {
    const maxY = height - PongPlayer.PLAYER_HEIGHT / 2 - this.wallWidth / 2;
    const minY = PongPlayer.PLAYER_HEIGHT / 2 + this.wallWidth / 2;
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
      this.move("down");
    } else if (deltaY < 0) {
      this.move("up");
    }
  }
}

export { PongPlayer };
