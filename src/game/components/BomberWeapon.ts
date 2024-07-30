import type { IWeapon } from "../types";
import { Bomber } from "../entities/Bomber";
import { Bomb } from "../entities/Bomb";
import { Vector2 } from "../utils/Vector2";

export class BomberWeapon implements IWeapon {
  private static readonly BULLET_SPEED = 40;
  private bomber: Bomber;

  constructor(bomber: Bomber) {
    this.bomber = bomber;
  }

  shoot(facing: Vector2): void {
    const startVel = facing.normalize().multiply(BomberWeapon.BULLET_SPEED);

    new Bomb(
      this.bomber.scene,
      this.bomber.x,
      this.bomber.y,
      this.bomber.team,
      startVel
    );
  }

  update(delta: number): void {
    // No update logic needed for this weapon
  }

  reloaded(): void {
    // No reload logic needed for this weapon
  }

  isReadyToShoot(): boolean {
    // The BomberAI handles the shooting logic, so this always returns true
    return true;
  }
}
