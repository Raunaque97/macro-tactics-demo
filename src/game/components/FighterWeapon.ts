import type { IWeapon } from "../types";
import { Fighter } from "../entities/Fighter";
import { Laser } from "../entities/Laser";
import { Vector2 } from "../utils/Vector2";

export class FighterWeapon implements IWeapon {
  private static readonly BULLET_SPEED = 400;
  private static readonly SHOT_COOLDOWN_TIME = 160;
  private static readonly SHOT_CAPACITY = 3;
  private static readonly SHOT_RELOAD_RATE = 1 / 1000; // 1 per second

  private shots: number = FighterWeapon.SHOT_CAPACITY;
  private cooldown: number = 0;
  private fighter: Fighter;
  private loaded: boolean = true;

  constructor(fighter: Fighter) {
    this.fighter = fighter;
  }
  reloaded(): void {}

  shoot(): void {
    if (this.isCooledDown() && !this.isEmpty()) {
      this.shots--;
      this.cooldown = FighterWeapon.SHOT_COOLDOWN_TIME;

      const startVel = Vector2.from({
        x:
          FighterWeapon.BULLET_SPEED * this.fighter.facing.x +
          this.fighter.velocity.x,
        y:
          FighterWeapon.BULLET_SPEED * this.fighter.facing.y +
          this.fighter.velocity.y,
      });

      new Laser(
        this.fighter.scene,
        this.fighter.x,
        this.fighter.y,
        this.fighter.team,
        startVel,
        this.fighter.facing
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
        FighterWeapon.SHOT_CAPACITY,
        this.shots + delta * FighterWeapon.SHOT_RELOAD_RATE
      );
      if (this.shots === FighterWeapon.SHOT_CAPACITY) {
        this.loaded = true;
      }
    }
  }

  isEmpty(): boolean {
    return !this.loaded;
  }

  isReloaded(): boolean {
    return this.shots === FighterWeapon.SHOT_CAPACITY;
  }

  private isCooledDown(): boolean {
    return this.cooldown === 0;
  }

  isReadyToShoot(): boolean {
    return this.isCooledDown() && !this.isEmpty();
  }
}
