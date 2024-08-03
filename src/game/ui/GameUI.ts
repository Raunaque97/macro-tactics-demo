import Phaser from "phaser";
import { FactoryShip } from "../entities/FactoryShip";
import type { CombatUnitType } from "../types";

export class GameUI extends Phaser.GameObjects.Container {
  private playerShip: FactoryShip;
  private enemyShip: FactoryShip;
  private resourceText: Phaser.GameObjects.Text;
  private playerHealthBar: Phaser.GameObjects.Rectangle;
  private enemyHealthBar: Phaser.GameObjects.Rectangle;
  private unitButtons: Record<CombatUnitType, Phaser.GameObjects.Container>;
  private productionBar: Phaser.GameObjects.Rectangle | null = null;

  constructor(
    scene: Phaser.Scene,
    playerShip: FactoryShip,
    enemyShip: FactoryShip
  ) {
    super(scene);
    this.playerShip = playerShip;
    this.enemyShip = enemyShip;

    this.playerHealthBar = this.createHealthBar(10, 10, 0x00ff00);
    this.enemyHealthBar = this.createHealthBar(
      (this.scene.game.config.width as number) - 210,
      10,
      0xff0000
    );
    this.resourceText = this.createResourceCounter();
    this.unitButtons = this.createUnitButtons();

    scene.add.existing(this);
  }

  private createHealthBar(
    x: number,
    y: number,
    color: number
  ): Phaser.GameObjects.Rectangle {
    const bar = this.scene.add.rectangle(x, y, 200, 20, color);
    bar.setOrigin(0, 0);
    this.add(bar);
    return bar;
  }

  private createResourceCounter(): Phaser.GameObjects.Text {
    const text = this.scene.add.text(10, 40, "Resources: 0", {
      fontSize: "16px",
      color: "#ffffff",
    });
    this.add(text);
    return text;
  }

  private createUnitButtons(): Record<
    CombatUnitType,
    Phaser.GameObjects.Container
  > {
    const buttonWidth = 120;
    const buttonHeight = 70;
    const buttonSpacing = 20;
    const startX =
      ((this.scene.game.config.width as number) -
        (buttonWidth * 3 + buttonSpacing * 2)) /
      2;
    const startY =
      (this.scene.game.config.height as number) - buttonHeight - 10;

    return {
      fighter: this.createButton(startX, startY, "fighter_p1", "fighter"),
      bomber: this.createButton(
        startX + buttonWidth + buttonSpacing,
        startY,
        "bomber_p1",
        "bomber"
      ),
      frigate: this.createButton(
        startX + (buttonWidth + buttonSpacing) * 2,
        startY,
        "frigate_p1",
        "frigate"
      ),
    };
  }

  private createButton(
    x: number,
    y: number,
    imageKey: string,
    unitType: CombatUnitType
  ): Phaser.GameObjects.Container {
    const button = this.scene.add.container(x, y);
    const background = this.scene.add
      .rectangle(0, 0, 120, 70, 0xffffff, 0.1)
      .setStrokeStyle(2, 0x808080)
      .setOrigin(0.5);

    const scale =
      unitType === "frigate" ? 0.5 : unitType === "bomber" ? 1 : 1.5;

    const unitImage = this.scene.add.image(0, -15, imageKey).setScale(scale);
    const costText = this.scene.add
      .text(0, 10, `Cost: ${FactoryShip.UNIT_INFO[unitType].cost}`, {
        fontSize: "14px",
        color: "#ffffff",
      })
      .setOrigin(0.5);
    const timeText = this.scene.add
      .text(0, 25, `Time: ${FactoryShip.UNIT_INFO[unitType].productionTime}s`, {
        fontSize: "14px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    button.add([background, unitImage, costText, timeText]);

    background
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => {
        if (this.isButtonEnabled(unitType)) {
          background.setFillStyle(0x4a4a4a);
        }
      })
      .on("pointerout", () => {
        background.setFillStyle(0x2a2a2a);
      })
      .on("pointerdown", () => this.onUnitButtonClick(unitType));

    this.add(button);
    return button;
  }

  private isButtonEnabled(unitType: CombatUnitType): boolean {
    return (
      this.playerShip.canProduceUnit(unitType) && !this.playerShip.isProducing()
    );
  }

  private onUnitButtonClick(unitType: CombatUnitType) {
    if (this.isButtonEnabled(unitType)) {
      this.playerShip.startProduction(unitType);
      this.createProductionBar(unitType);
    }
  }

  private createProductionBar(unitType: CombatUnitType) {
    if (this.productionBar) {
      this.productionBar.destroy();
    }
    const button = this.unitButtons[unitType];
    this.productionBar = this.scene.add.rectangle(-60, 35, 120, 5, 0x00ff00);
    this.productionBar.setOrigin(0, 0.5);
    this.productionBar.setScale(0, 1);
    button.add(this.productionBar);
  }

  update() {
    // Update health bars
    const playerHealthPercent = this.playerShip.health / FactoryShip.maxHealth;
    const enemyHealthPercent = this.enemyShip.health / FactoryShip.maxHealth;
    this.playerHealthBar.setScale(playerHealthPercent, 1);
    this.enemyHealthBar.setScale(enemyHealthPercent, 1);

    // Update resource counter
    this.resourceText.setText(
      `Resources: ${Math.floor(this.playerShip.getResources())}`
    );

    // Update production progress
    const productionProgress = this.playerShip.getProductionProgress();
    if (productionProgress) {
      const { unitType, progress } = productionProgress;
      if (this.productionBar) {
        this.productionBar.setScale(progress, 1);
      }
    } else if (this.productionBar) {
      this.productionBar.destroy();
      this.productionBar = null;
    }

    // Update button interactivity and border color
    Object.entries(this.unitButtons).forEach(([unitType, button]) => {
      const background = button.getAt(0) as Phaser.GameObjects.Rectangle;
      const isEnabled = this.isButtonEnabled(unitType as CombatUnitType);
      // background.setFillStyle(isEnabled ? 0x4a4a4a : 0x2a2a2a);
      background.setStrokeStyle(2, isEnabled ? 0xffffff : 0x808080);
      (background as any).input.enabled = isEnabled;
    });
  }
}
