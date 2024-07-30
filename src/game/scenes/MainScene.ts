import Phaser from "phaser";
import { FactoryShip } from "../entities/FactoryShip";
import { Fighter } from "../entities/Fighter";
import type { Team } from "../types";
import { GameUI } from "../ui/GameUI";

// Import assets
import factoryP1Image from "../../assets/factory_p1.png";
import factoryP2Image from "../../assets/factory_p2.png";
import backgroundImage from "../../assets/background.png";
import fighterP1Image from "../../assets/fighter_p1.png";
import fighterP2Image from "../../assets/fighter_p2.png";
import laserImage from "../../assets/laser.png";
import { GameEntityManager } from "../GameEntityManager";

export default class MainScene extends Phaser.Scene {
  private playerShip!: FactoryShip;
  private enemyShip!: FactoryShip;
  private gameUI!: GameUI;

  public entityManager: GameEntityManager;

  constructor() {
    super("MainScene");
    this.entityManager = new GameEntityManager(this);
  }

  preload() {
    this.load.image("factory_p1", factoryP1Image);
    this.load.image("factory_p2", factoryP2Image);
    this.load.image("background", backgroundImage);
    this.load.image("fighter_p1", fighterP1Image);
    this.load.image("fighter_p2", fighterP2Image);
    this.load.image("laser", laserImage);
  }

  create() {
    this.add.image(600, 400, "background").setScale(1.2);

    this.playerShip = new FactoryShip(this, 400, 400, "player");
    this.enemyShip = new FactoryShip(this, 800, 400, "enemy");
    this.entityManager.addUnit(this.playerShip);
    this.entityManager.addUnit(this.enemyShip);

    // Create UI
    this.gameUI = new GameUI(this, this.playerShip, this.enemyShip);
    this.scale.on("resize", this.resize, this);
    this.resize();
  }

  resize() {
    const { width, height } = this.scale;
    console.log("resize", width, height);
  }

  update(time: number, delta: number) {
    this.playerShip.update(time, delta);
    this.enemyShip.update(time, delta);
    this.entityManager.update(time, delta);

    // Update UI
    this.gameUI.update();
  }
}
