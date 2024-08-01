import Phaser from "phaser";
import { Bullet, type Team } from "../types";
import type { Vector2 } from "../utils/Vector2";
import type MainScene from "../scenes/MainScene";
import type { Ship } from "./Ship";

export class Laser extends Bullet {
  private velocity: Vector2;
  private static readonly DAMAGE = 1;

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
  }

  onHit(target: Ship) {
    // console.log("hit", target);
    target.takeDamage(Laser.DAMAGE);
    this.destroy();
  }

  update(time: number, delta: number) {
    // Move the laser
    this.x += (this.velocity.x * delta) / 1000;
    this.y += (this.velocity.y * delta) / 1000;

    // Destroy if out of bounds
    if (
      this.x < -Number(this.scene.game.config.width) ||
      this.x > 2 * Number(this.scene.game.config.width) ||
      this.y < -Number(this.scene.game.config.height) ||
      this.y > 2 * Number(this.scene.game.config.height)
    ) {
      this.destroy();
    }
  }
}
