class Brain {
  constructor(
    options = {
      inputs: 4,
      outputs: ["flap", "noFlap"],
      task: "classification",

      neuroEvolution: true,
    }
  ) {
    this.options = options;

    if (options.brain) {
      this.network = options.brain; // Use the provided brain
    } else {
      // Initialize the neural network with the provided options
      this.network = ml5.neuralNetwork(this.options);
    }
  }

  getAction(inputs) {
    let results = this.network.classifySync(inputs);
    return results[0].label; // Return the action with the highest confidence
  }

  static createChild(brainA, brainB) {
    let childBrain = brainA.network.crossover(brainB.network);

    childBrain.mutate(0.01); // Mutate the child brain with a small mutation rate
    return childBrain;
  }

  static weighedSelection(population) {
    let index = 0;
    let start = random(1);
    while (start > 0) {
      start = start - population[index].score;
      index++;
    }
    index--;

    return population[index].birdBrain;
  }

  static normalizeScore(population) {
    let sum = 0;
    for (let agent of population) {
      sum += agent.score;
    }

    for (let agent of population) {
      agent.score = agent.score / sum;
    }
  }
}

export { Brain };
