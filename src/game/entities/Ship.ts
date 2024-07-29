import Phaser from "phaser";
import type { IShip, UnitType, Team } from "../types";
import { Vector2 } from "../utils/Vector2";
import type MainScene from "../scenes/MainScene";

export abstract class Ship extends Phaser.GameObjects.Sprite implements IShip {
  type: UnitType;
  team: Team;
  velocity: Vector2;
  facing: Vector2;
  health: number;

  constructor(
    scene: MainScene,
    x: number,
    y: number,
    texture: string,
    type: UnitType,
    team: Team,
    health: number
  ) {
    super(scene, x, y, texture);
    this.type = type;
    this.team = team;
    this.velocity = new Vector2(0, 0);
    this.facing = new Vector2(1, 0);
    this.health = health;

    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  get position(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  set position(pos: Vector2) {
    this.x = pos.x;
    this.y = pos.y;
  }

  update(time: number, delta: number) {
    // Update position based on velocity
    this.x += (this.velocity.x * delta) / 1000;
    this.y += (this.velocity.y * delta) / 1000;

    // Update rotation based on facing direction
    this.rotation = Math.atan2(this.facing.y, this.facing.x);
  }

  takeDamage(amount: number) {
    this.health -= amount;
    if (this.health <= 0) {
      this.destroy();
    }
  }

  thrust(power: number) {
    this.velocity = this.velocity.add(this.facing.multiply(power));
  }

  goTowards(
    target: Vector2,
    acceleration: number,
    allowRotation: boolean = true
  ) {
    const toTarget = target.subtract(this.position);

    if (allowRotation) {
      this.facing = toTarget.normalize();
    }

    this.thrust(acceleration);
  }

  goAway(target: Vector2, acceleration: number, allowRotation: boolean = true) {
    this.goTowards(
      this.position.multiply(2).subtract(target),
      acceleration,
      allowRotation
    );
  }
}
