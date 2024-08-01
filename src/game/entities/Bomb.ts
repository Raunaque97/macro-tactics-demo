import { Bullet, type Team } from "../types";
import type { Vector2 } from "../utils/Vector2";
import type MainScene from "../scenes/MainScene";
import type { Ship } from "./Ship";

export class Bomb extends Bullet {
  private velocity: Vector2;
  private static readonly DAMAGE = 10;
  private static readonly MAX_LIFETIME = 2000; // 3 seconds in milliseconds
  private static readonly BLINK_INTERVAL = 100; // milliseconds
  private static readonly EXPLOSION_DURATION = 60; // milliseconds
  public static readonly DETONATION_RANGE = 10; // pixels

  private detonationTimer: Phaser.Time.TimerEvent;
  private blinkTimer: Phaser.Time.TimerEvent | null = null;
  private isBlinking: boolean = false;
  private detonating: boolean = false;

  constructor(
    public scene: MainScene,
    x: number,
    y: number,
    public team: Team,
    velocity: Vector2
  ) {
    super(scene, x, y, "bomb", team);
    this.velocity = velocity;
    (this.body as Phaser.Physics.Arcade.Body).setVelocity(
      velocity.x,
      velocity.y
    );
    this.setOrigin(0.5, 0.5);

    // Set up detonation timer
    this.detonationTimer = scene.time.delayedCall(Bomb.MAX_LIFETIME, () => {
      this.startDetonating();
    });
  }

  onHit(target: Ship) {
    if (this.detonating) return;

    this.startDetonating();
  }

  private startDetonating() {
    this.detonating = true;
    this.detonationTimer.remove();
    const delay = 1000 + Math.random() * 500;
    this.scene.time.delayedCall(delay, () => {
      this.detonate();
    });
    this.blinkTimer = this.scene.time.addEvent({
      delay: Bomb.BLINK_INTERVAL,
      callback: this.blink,
      callbackScope: this,
      loop: true,
    });
  }

  private blink() {
    this.isBlinking = !this.isBlinking;
    this.setAlpha(this.isBlinking ? 0.1 : 1);
  }

  private detonate() {
    // Stop timers
    this.blinkTimer?.remove();
    this.setAlpha(1);
    // change texture to explosion
    this.setTexture("explosion");

    // Damage nearby units
    const nearbyUnits = this.scene.entityManager.getUnitsInRange(
      this.x,
      this.y,
      Bomb.DETONATION_RANGE,
      {
        team: this.team === "player" ? "enemy" : "player",
      }
    );
    nearbyUnits.forEach((unit) => unit.takeDamage(Bomb.DAMAGE));

    // Remove the bomb after a short delay
    this.scene.time.delayedCall(Bomb.EXPLOSION_DURATION, () => {
      this.destroy();
    });
  }
}
