const { Query } = Matter;
import { raycast } from "./helpers/raycast.js";

class Sensor {
  static RANGE = 100; // Sensor range
  static COLOR = "gray"; // Default color for sensors

  constructor(agent, angle, classes) {
    this.agent = agent;
    this.angle = angle;
    this.range = Sensor.RANGE;
    this.color = Sensor.COLOR; // Default color for the sensor

    this.classes = classes;

    this.currentDetection = null;
  }

  detect(bodies) {
    const { start, end } = this.getSensorRay();
    this.color = Sensor.COLOR; // Reset color to default gray

    let collisions = raycast(bodies, start, end, true);

    if(collisions[0]){
      
    }

    collisions.forEach((collision) => {
      if(collision.body === this.agent.body)
        return;

      this.color = this.classes[collision.body.label]?.COLOR || Sensor.COLOR; // Use class color or default gray

      push();
      fill(this.color); // Use default gray
      circle(collision.point.x, collision.point.y, 5); // Draw detection point
      pop();
    });
  }

  draw() {
    const { start, end } = this.getSensorRay();

    console.log(this.color);

    push();
    stroke(this.color);
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
