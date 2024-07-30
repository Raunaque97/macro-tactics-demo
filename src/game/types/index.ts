import type { Ship } from "../entities/Ship";
import type MainScene from "../scenes/MainScene";
import { Vector2 } from "../utils/Vector2";

export type CombatUnitType = "fighter" | "bomber" | "frigate";

export type UnitType = CombatUnitType | "factory";

export type Team = "player" | "enemy";

export interface IShip {
  type: UnitType;
  team: Team;
  position: Vector2;
  velocity: Vector2;
  facing: Vector2;
  health: number;
  update(time: number, delta: number): void;
  takeDamage(amount: number): void;
}

export interface IWeapon {
  shoot(...args: any[]): void;
  update(delta: number): void;
  reloaded(): void;
  isReadyToShoot(): boolean;
}

export interface IAI {
  update(delta: number): void;
}

export abstract class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(
    public scene: MainScene,
    x: number,
    y: number,
    texture: string,
    team: Team
  ) {
    super(scene, x, y, texture);
    scene.entityManager.addBullet(team, this);
  }

  abstract onHit(target: Ship): void;
}
