import { Bullet, type Team } from "../types";
import { Vector2 } from "../utils/Vector2";
import type MainScene from "../scenes/MainScene";
import type { Ship } from "./Ship";

export class Missile extends Bullet {
  private static readonly MAX_LIFETIME = 8000; // 9 seconds in milliseconds
  private static readonly TURN_SPEED = 1;
  private static readonly ACCELERATION = 20;
  private static readonly MAX_SPEED = 200;
  private static readonly TARGET_RANGE = 600;
  private static readonly DAMAGE = 2;

  private velocity: Vector2;
  private facing: Vector2;
  private target: Ship | null = null;
  private time2target: number = Infinity;

  constructor(
    public scene: MainScene,
    x: number,
    y: number,
    public team: Team,
    velocity: Vector2,
    facing: Vector2
  ) {
    super(scene, x, y, "missile", team);
    this.velocity = velocity;
    this.facing = facing;
    this.scene.add.existing(this);
    this.target = this.retarget();

    scene.time.delayedCall(Missile.MAX_LIFETIME, () => this.selfDestruct());
    this.setOrigin(0.5, 0.5);
    this.setSize(2, 2);
  }

  preUpdate(time: number, delta: number) {
    if (!this.active) return;

    const newTarget = this.retarget();
    if (this.target && this.target.health <= 0) {
      this.target = newTarget;
    }
    // if new target's time2target is better substantially, use it
    if (newTarget && newTarget !== this.target) {
      const predicted = this.predict(newTarget);
      if (predicted.timeToTarget < this.time2target * 0.8) {
        this.target = newTarget;
      }
    }

    if (this.target) {
      const predicted = this.predict(this.target);
      this.time2target = predicted.timeToTarget;
      this.goTowards(predicted.pos);
    }

    // Move the missile
    this.x += (this.velocity.x * delta) / 1000;
    this.y += (this.velocity.y * delta) / 1000;
    this.facing = this.velocity.normalize();
    this.setRotation(Math.atan2(this.facing.y, this.facing.x));

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

  onHit(target: Ship) {
    target.takeDamage(Missile.DAMAGE);
    this.destroy();
  }

  private retarget(): Ship | null {
    return (
      this.scene.entityManager.getNearestUnit(this.x, this.y, {
        team: this.team === "player" ? "enemy" : "player",
        unitType: "fighter",
        maxDistance: Missile.TARGET_RANGE,
      }) ||
      this.scene.entityManager.getNearestUnit(this.x, this.y, {
        team: this.team === "player" ? "enemy" : "player",
        unitType: "bomber",
        maxDistance: Missile.TARGET_RANGE,
      }) ||
      this.scene.entityManager.getNearestUnit(this.x, this.y, {
        team: this.team === "player" ? "enemy" : "player",
        unitType: "frigate",
        maxDistance: Missile.TARGET_RANGE,
      }) ||
      this.scene.entityManager.getNearestUnit(this.x, this.y, {
        team: this.team === "player" ? "enemy" : "player",
        unitType: "factory",
      })
    );
  }

  private predict(target: Ship): { pos: Vector2; timeToTarget: number } {
    const relativeVel = this.velocity.subtract(target.velocity);
    const toTarget = target.position.subtract(Vector2.from(this));
    const dot = Vector2.dot(this.velocity, toTarget);
    if (dot !== 0) {
      const timeToTarget =
        Vector2.sqrMagnitude(toTarget) / Vector2.dot(relativeVel, toTarget);
      return {
        pos: target.position.subtract(
          relativeVel.multiply(Math.max(0, timeToTarget))
        ),
        timeToTarget,
      };
    } else {
      return { pos: target.position, timeToTarget: Infinity };
    }
  }

  private goTowards(targetPos: Vector2) {
    const toTarget = targetPos.subtract(new Vector2(this.x, this.y));
    const targetAngle = Math.atan2(toTarget.y, toTarget.x);
    const currentAngle = Math.atan2(this.facing.y, this.facing.x);
    const angleDiff = Phaser.Math.Angle.ShortestBetween(
      (currentAngle * 180.0) / Math.PI,
      (targetAngle * 180.0) / Math.PI
    );

    // Turn towards the target
    const turnAmount = Math.sign(angleDiff) * Missile.TURN_SPEED;
    this.facing = this.facing.rotate(turnAmount);

    // Accelerate in the facing direction
    this.velocity = this.velocity.add(
      this.facing.multiply(Missile.ACCELERATION)
    );
    // clip velocity to max
    if (this.velocity.magnitude() > Missile.MAX_SPEED) {
      this.velocity = this.velocity.normalize().multiply(Missile.MAX_SPEED);
    }
  }

  private selfDestruct() {
    // TODO: Implement explosion effect
    this.destroy();
  }
}
