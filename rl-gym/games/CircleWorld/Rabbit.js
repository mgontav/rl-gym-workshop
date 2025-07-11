const { Body,  Bodies, Composite } = Matter;

class Rabbit {
    static SIZE = 10;
    static COLOR = "green";
    static LABEL = "rabbit";
    static MAX_SPEED = 5;

    constructor(game, options = {}) {
        this.game = game;
        this.size = Rabbit.SIZE;
        this.controls = options.controls || "random";

        this.createRabbit();

        if(this.controls == "random"){
            this.startRabbitMovement();
        }
    }

    createRabbit() {
        let rabbitPhysics = {
            inertia: Infinity,
            restitution: 1,
            friction: 0,
            frictionAir: 0,
            frictionStatic: 0,
            density: 0.001,
            label: Rabbit.LABEL,
        };

        this.body = Bodies.circle(
            random(0, this.game.width),
            random(0, this.game.height),
            this.size,
            rabbitPhysics
        );

        Composite.add(this.game.engine.world, this.body);
    }

    startRabbitMovement() {
        Body.applyForce(this.body, this.body.position, {
            x: random(-0.005, 0.005),
            y: random(-0.005, 0.005)
        });
    }

    draw() {
        push();
        fill(Rabbit.COLOR);
        noStroke();
        circle(this.body.position.x, this.body.position.y, Rabbit.SIZE * 2);
        pop();
    }

    update() {
        if (this.controls === "random") {
            Body.setSpeed(this.body, Rabbit.MAX_SPEED);
        }
    }
}

export { Rabbit };