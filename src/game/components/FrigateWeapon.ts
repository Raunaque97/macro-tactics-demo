import type { IWeapon } from "../types";
import { Frigate } from "../entities/Frigate";
import { Missile } from "../entities/Missiles";
import { Vector2 } from "../utils/Vector2";

export class FrigateWeapon implements IWeapon {
  private static readonly MISSILE_SPEED = 10;
  private static readonly SHOT_COOLDOWN_TIME = 100; // 6 frames in 60 FPS
  private static readonly SHOT_CAPACITY = 10;
  private static readonly SHOT_RELOAD_RATE = 0.5 / 1000; // 1 per second

  private shots: number = 1;
  private cooldown: number = 0;
  private frigate: Frigate;
  private loaded: boolean = false;

  constructor(frigate: Frigate) {
    this.frigate = frigate;
  }
  reloaded(): void {}

  shoot(): void {
    if (this.isCooledDown() && !this.isEmpty()) {
      this.shots--;
      this.cooldown = FrigateWeapon.SHOT_COOLDOWN_TIME;

      const startVel = this.frigate.facing.multiply(
        FrigateWeapon.MISSILE_SPEED
      );

      new Missile(
        this.frigate.scene,
        this.frigate.x + this.frigate.facing.x * 30,
        this.frigate.y + this.frigate.facing.y * 30,
        this.frigate.team,
        startVel,
        this.frigate.facing
      );

      if (this.shots === 0) {
        this.loaded = false;
      }
    }
  }

  update(delta: number): void {
    this.cooldown = Math.max(0, this.cooldown - delta);
    if (!this.loaded) {
      this.shots = Math.min(
        FrigateWeapon.SHOT_CAPACITY,
        this.shots + delta * FrigateWeapon.SHOT_RELOAD_RATE
      );
      if (this.shots === FrigateWeapon.SHOT_CAPACITY) {
        this.loaded = true;
      }
    }
  }

  isEmpty(): boolean {
    return this.shots < 1;
  }

  private isCooledDown(): boolean {
    return this.cooldown === 0;
  }

  isReadyToShoot(): boolean {
    return this.loaded;
  }
}
