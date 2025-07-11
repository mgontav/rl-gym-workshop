const { Bodies, Composite, Constraint } = Matter;
import { Sensor } from "./Sensor.js";

class Hunter {
  static SIZE = 15;
  static COLOR = "blue";
  static N_SENSORS = 64;

  constructor(game) {
    this.game = game;
    this.controls = "mouse"; // Default control type

    this.size = Hunter.SIZE;

    this.createHunter();
    this.createSensors();
  }

  createHunter() {
    this.body = Bodies.circle(
      this.game.width / 2,
      this.game.height / 2,
      Hunter.SIZE,
      {
        inertia: Infinity,
      }
    );

    Composite.add(this.game.engine.world, this.body);

    if (this.controls === "mouse") {
      this.mouseConstraint = Constraint.create({
        bodyA: this.body,
        pointB: { x: this.game.width / 2, y: this.game.height / 2 },
        stiffness: 0.1,
      });

      Composite.add(this.game.engine.world, this.mouseConstraint);
    }
  }

  createSensors() {
    this.sensors = [];
    const angleStep = (2 * Math.PI) / Hunter.N_SENSORS;
    for (let i = 0; i < Hunter.N_SENSORS; i++) {
      const angle = i * angleStep;
      this.sensors.push(new Sensor(this, angle, this.game.agentClasses));
    }
  }

  draw() {
    push();
    fill(Hunter.COLOR);
    noStroke();
    ellipse(this.body.position.x, this.body.position.y, Hunter.SIZE * 2);
    pop();

    this.sensors.forEach((sensor) => {
      sensor.draw();
    });
  }

  update() {
    if (this.controls === "mouse") {
      let xTarget = Math.min(Math.max(mouseX, 0), this.game.width);
      let yTarget = Math.min(Math.max(mouseY, 0), this.game.height);
      this.mouseConstraint.pointB = { x: xTarget, y: yTarget };
    }

    this.sensors.forEach((sensor) => {
      // console.log(sensor.detect(this.game.engine.world.bodies));
      sensor.detect(this.game.engine.world.bodies);
    });
  }
}

export { Hunter };
