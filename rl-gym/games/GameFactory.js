import { Pong } from "./Pong/Pong.js";
import { FlappyGame } from "./FlappyGame/FlappyGame.js";
import { TestGame } from "./TestGame/TestGame.js";

class GameFactory {
  static createGame(engine, gameConfig) {
    switch (gameConfig.game) {
      case "Pong":
        return new Pong(engine, gameConfig);
      case "FlappyGame":
        return new FlappyGame(engine, gameConfig);
      case "TestGame":
        return new TestGame(engine, gameConfig);
      default:
        throw new Error(`Unknown game: ${gameConfig.game}`);
    }
  }
}

export { GameFactory };
