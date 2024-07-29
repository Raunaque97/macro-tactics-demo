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
  shoot(): void;
  update(delta: number): void;
  reloaded(): void;
  isReadyToShoot(): boolean;
}

export interface IAI {
  update(delta: number): void;
}
