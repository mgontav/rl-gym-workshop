const { Body, Bodies, Composite } = Matter;

class Bear {
    static SIZE = 20;
    static COLOR = "brown";
    static LABEL = "bear";

    constructor(game, options = {}){
        this.game = game;

        this.controls = options.controls || "random";
        this.size = Bear.SIZE;

        this.createBear();

        if(this.controls == "random"){
            this.startBearMovement();
        }
    }

    createBear() {
        let bearPhysics = {
            inertia: Infinity,
            restitution: 1,
            friction: 0,
            frictionAir: 0,
            frictionStatic: 0,
            density: 0.001,
            label: Bear.LABEL,
        };
        this.body = Bodies.circle(
            random(0, this.game.width),
            random(0, this.game.height),
            Bear.SIZE,
            bearPhysics
        );

        Composite.add(this.game.engine.world, this.body);
    }

    startBearMovement() {
        Body.applyForce(this.body, this.body.position, {
            x: random([-0.01, 0, 0.01]),
            y: random([-0.01, 0, 0.01])
        });
    }

    draw() {
        push();
        fill(Bear.COLOR);
        noStroke();
        circle(this.body.position.x, this.body.position.y, Bear.SIZE * 2);
        pop();
    }

    update() {

    }
}

export { Bear };