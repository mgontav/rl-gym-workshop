class RLBrain {
  static DEFAULT_OPTIONS = {
    update: "qlearn",
    gamma: 0.9, // discount factor, [0, 1)
    epsilon: 0.2, // initial epsilon for epsilon-greedy policy, [0, 1)
    alpha: 0.01, // value function learning rate
    experience_add_every: 10, // number of time steps before we add another experience to replay memory
    experience_size: 5000, // size of experience replay memory
    learning_steps_per_iteration: 20,
    tderror_clamp: 1.0,
    num_hidden_units: 100, // number of neurons in hidden layer
  };

  constructor(nInputs, actions, options = RLBrain.DEFAULT_OPTIONS) {
    this.env = {
      getNumStates: () => nInputs,
      getMaxNumActions: () => actions.length,
    };

    this.spec = options;

    this.actions = actions;
    this.agent = new RL.DQNAgent(this.env, this.spec);
  }

  act(inputs) {
    const action = this.agent.act(inputs);
    return this.actions[action];
  }

  learn(reward) {
    this.agent.learn(reward);
  }

  reset() {
    this.agent.clearEpisode();
  }
}

export { RLBrain };
