const { Query } = Matter;
import { raycast } from "./helpers/raycast.js";

class Sensor {
  static RANGE = 100; // Sensor range
  static COLOR = "gray"; // Default color for sensors

  constructor(agent, angle) {
    this.agent = agent;
    this.angle = angle;
    this.range = Sensor.RANGE;

    this.currentDetection = null;
  }

  detect(bodies) {
    const { start, end } = this.getSensorRay();

    let collisions = raycast(bodies, start, end, true);

    collisions.forEach((collision) => {
      push();
      fill("red");
      circle(collision.point.x, collision.point.y, 5); // Draw detection point
      pop();
    });
  }

  draw() {
    const { start, end } = this.getSensorRay();

    push();
    stroke(Sensor.COLOR);
    line(start.x, start.y, end.x, end.y);
    pop();
  }

  getSensorRay() {
    const start = {
      x: this.agent.body.position.x + this.agent.size * Math.cos(this.angle),
      y: this.agent.body.position.y + this.agent.size * Math.sin(this.angle),
    };
    const end = {
      x: start.x + this.range * Math.cos(this.angle),
      y: start.y + this.range * Math.sin(this.angle),
    };
    return { start, end };
  }
}

export { Sensor };
//
