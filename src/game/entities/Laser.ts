import Phaser from "phaser";
import { Bullet, type Team } from "../types";
import type { Vector2 } from "../utils/Vector2";
import type MainScene from "../scenes/MainScene";
import type { Ship } from "./Ship";

export class Laser extends Bullet {
  private velocity: Vector2;
  private static readonly DAMAGE = 1;
  private spark: Phaser.GameObjects.Image;

  constructor(
    public scene: MainScene,
    x: number,
    y: number,
    team: Team,
    velocity: Vector2,
    facing: Vector2
  ) {
    super(scene, x, y, "laser", team);
    this.velocity = velocity;

    this.setRotation(Math.atan2(facing.y, facing.x));
    this.setTint(team === "player" ? 0x8888ff : 0xff0000);

    // Set up collision detection and destruction after a certain time
    (this.body as Phaser.Physics.Arcade.Body).setVelocity(
      velocity.x,
      velocity.y
    );
    scene.time.delayedCall(5000, () => this.destroy());
    this.setOrigin(0.5, 0.5);
    this.setSize(2, 2);

    // Create the spark effect
    this.spark = scene.add.image(0, 0, "spark");
    this.spark.setVisible(false);
  }

  onHit(target: Ship) {
    target.takeDamage(Laser.DAMAGE);
    this.showSparkEffect();
    this.destroy();
  }

  private showSparkEffect() {
    this.spark
      .setPosition(this.x, this.y)
      .setVisible(true)
      .setAlpha(1)
      .setScale(3);

    this.scene.tweens.add({
      targets: this.spark,
      scale: 0.1,
      duration: 100,
      onComplete: () => {
        this.spark.destroy();
      },
    });
  }

  update(time: number, delta: number) {
    // Existing update logic...
  }

  destroy(fromScene?: boolean) {
    super.destroy(fromScene);
  }
}
