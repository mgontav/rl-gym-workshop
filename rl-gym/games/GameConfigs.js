const TestGameConfig = {
  game: "TestGame",
  width: 800,
  height: 400,
};

const FlappyGameConfig = {
  game: "FlappyGame",
  width: 800,
  height: 600,
  controls: "mouse",
};

const PongConfig = {
  game: "Pong",
  width: 800,
  height: 400,
  player1: {
    side: "left",
    color: "blue",
    controls: {
      type: "keyboard",
      keys: [87, 83], // Down and Up keys for player 1
    },
  },
  player2: {
    side: "right",
    color: "red",
    controls: {
      type: "keyboard",
      keys: [38, 40], // Down and Up keys for player 2
    },
  },
};

export { TestGameConfig, FlappyGameConfig, PongConfig };
