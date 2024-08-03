import Phaser from "phaser";
import MainScene from "./scenes/MainScene";
import MenuScene from "./scenes/MenuScene";
import GameEndScene from "./scenes/GameEndScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1200,
  height: 800,
  parent: "game-container",
  scene: [MenuScene, MainScene, GameEndScene],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
};

const game = new Phaser.Game(config);

export default game;
