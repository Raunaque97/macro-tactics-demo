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
import bomberP1Image from "../../assets/bomber_p1.png";
import bomberP2Image from "../../assets/bomber_p2.png";
import frigateP1Image from "../../assets/frigate_p1.png";
import frigateP2Image from "../../assets/frigate_p2.png";
import missileImage from "../../assets/missile.png";
import laserImage from "../../assets/laser.png";
import { GameEntityManager } from "../GameEntityManager";
import { Bomb } from "../entities/Bomb";
import { AIController } from "../systems/AIController";

export default class MainScene extends Phaser.Scene {
  private playerShip!: FactoryShip;
  private enemyShip!: FactoryShip;
  private gameUI!: GameUI;
  private aiController!: AIController;

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
    this.load.image("bomber_p1", bomberP1Image);
    this.load.image("bomber_p2", bomberP2Image);
    this.load.image("frigate_p1", frigateP1Image);
    this.load.image("frigate_p2", frigateP2Image);
    this.load.image("missile", missileImage);
    this.load.image("laser", laserImage);
    // create a red circle for the bomb using graphics

    const graphics = this.make.graphics();
    graphics.clear();
    graphics.fillStyle(0xff0000);
    graphics.fillCircle(3, 3, 3);
    graphics.generateTexture("bomb", 6, 6);

    graphics.clear();
    graphics.fillStyle(0xffffff, 0.8);
    graphics.fillCircle(
      Bomb.DETONATION_RANGE,
      Bomb.DETONATION_RANGE,
      Bomb.DETONATION_RANGE
    );
    graphics.generateTexture(
      "explosion",
      Bomb.DETONATION_RANGE * 2,
      Bomb.DETONATION_RANGE * 2
    );

    graphics.destroy();
  }

  create() {
    this.add.image(600, 400, "background").setScale(1.2);

    this.playerShip = new FactoryShip(this, 400, 400, "player");
    this.enemyShip = new FactoryShip(this, 800, 400, "enemy");

    this.aiController = new AIController(this.enemyShip);

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
    this.entityManager?.update(time, delta);
    this.aiController?.update(delta);

    // Update UI
    this.gameUI.update();
  }
}
