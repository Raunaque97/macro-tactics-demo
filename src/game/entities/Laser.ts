import Phaser from "phaser";
import type { Team } from "../types";
import type { Vector2 } from "../utils/Vector2";
import type MainScene from "../scenes/MainScene";

export class Laser extends Phaser.GameObjects.Sprite {
  private velocity: Vector2;

  constructor(
    public scene: MainScene,
    x: number,
    y: number,
    team: Team,
    velocity: Vector2,
    facing: Vector2
  ) {
    super(scene, x, y, "laser");
    this.velocity = velocity;
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setRotation(Math.atan2(facing.y, facing.x));
    this.setTint(team === "player" ? 0x00ff00 : 0xff0000);

    // Set up collision detection and destruction after a certain time
    (this.body as Phaser.Physics.Arcade.Body).setVelocity(
      velocity.x,
      velocity.y
    );
    scene.time.delayedCall(2000, () => this.destroy());
  }

  update(time: number, delta: number) {
    // Move the laser
    this.x += (this.velocity.x * delta) / 1000;
    this.y += (this.velocity.y * delta) / 1000;

    // Destroy if out of bounds
    if (
      this.x < 0 ||
      this.x > Number(this.scene.game.config.width) ||
      this.y < 0 ||
      this.y > Number(this.scene.game.config.height)
    ) {
      this.destroy();
    }
  }
}
