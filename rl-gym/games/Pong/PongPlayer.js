const { Body, Bodies, Composite } = Matter;

class PongPlayer {
  static PLAYER_WIDTH = 5; // Width of the player paddle
  static PLAYER_HEIGHT = 60; // Height of the player paddle
  static MOVE_SPEED = 5; // Speed of the player paddle movement

  constructor(engine, width, height, wallWidth, playerOptions) {
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
    }
  }

  reset() {
    // Reset the player position to the center of the screen
    Body.setPosition(this.body, {
      x: this.xPosition,
      y: height / 2,
    });
  }

  moveWithKeyboard() {
    const maxY = height - PongPlayer.PLAYER_HEIGHT / 2 - this.wallWidth / 2;
    const minY = PongPlayer.PLAYER_HEIGHT / 2 + this.wallWidth / 2;
    let yMove = 0;

    if (keyIsDown(this.controls.keys[0]) && this.body.position.y > minY) {
      yMove = -1; // Move up
    } else if (
      keyIsDown(this.controls.keys[1]) &&
      this.body.position.y < maxY
    ) {
      yMove = 1; // Move down
    }

    Body.setPosition(this.body, {
      x: this.body.position.x,
      y: this.body.position.y + yMove * PongPlayer.MOVE_SPEED,
    });
  }
}

export { PongPlayer };
