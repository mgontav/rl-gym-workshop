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
      // Implement other control types here
    }
  }

  reset() {
    // Reset the player position to the center of the screen
    Body.setPosition(this.body, {
      x: this.xPosition,
      y: this.game.height / 2,
    });
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
}

export { PongPlayer };
