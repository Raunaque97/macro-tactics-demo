import type { IAI } from "../types";
import { Bomber } from "../entities/Bomber";
import { Vector2 } from "../utils/Vector2";
import type { Ship } from "../entities/Ship";
import type MainScene from "../scenes/MainScene";

export class BomberAI implements IAI {
  private static readonly APPROACH_DISTANCE = 240;
  private static readonly COOLDOWN_DURATION = 650;
  private static readonly MAX_SHOTS = 3;

  private bomber: Bomber;
  private scene: MainScene;
  private target: Ship | null = null;
  private state: "approach" | "turn" | "shoot" | "move_away" = "approach";
  private cooldownTimer: number = BomberAI.COOLDOWN_DURATION;
  private shotsCounter: number = BomberAI.MAX_SHOTS;
  private approachSign: number = 1;

  constructor(bomber: Bomber, scene: MainScene) {
    this.bomber = bomber;
    this.scene = scene;
  }

  update(delta: number): void {
    this.retargetIfNeeded();

    if (this.target) {
      const targetPosition = this.target.position;
      const targetDistance = Vector2.distance(
        targetPosition,
        this.bomber.position
      );
      const targetDirection = targetPosition
        .subtract(this.bomber.position)
        .normalize();

      const unitFactor = this.target.type === "frigate" ? 0.6 : 1;

      if (targetDistance > (BomberAI.APPROACH_DISTANCE + 50) * unitFactor) {
        this.state = "approach";
      }

      switch (this.state) {
        case "approach":
          this.approachBehavior(targetPosition, targetDistance, unitFactor);
          break;
        case "turn":
          this.turnBehavior(targetDirection, unitFactor);
          break;
        case "shoot":
          this.shootBehavior(delta, unitFactor);
          break;
        case "move_away":
          this.moveAwayBehavior(targetPosition);
          break;
      }
    }
  }

  private retargetIfNeeded(): void {
    if (!this.target || this.target.health <= 0 || Math.random() < 0.005) {
      const oldTarget = this.target;
      this.target = this.findTarget();
      if (oldTarget !== this.target) {
        this.reviseApproach();
      }
    }
  }

  private findTarget(): Ship | null {
    return (
      this.scene.entityManager.getNearestUnit(this.bomber.x, this.bomber.y, {
        team: this.bomber.team === "player" ? "enemy" : "player",
        unitType: "frigate",
      }) ||
      this.scene.entityManager.getNearestUnit(this.bomber.x, this.bomber.y, {
        team: this.bomber.team === "player" ? "enemy" : "player",
        unitType: "factory",
      })
    );
  }

  private reviseApproach(): void {
    this.approachSign = Math.random() < 0.5 ? 1 : -1;
  }

  private approachBehavior(
    targetPosition: Vector2,
    targetDistance: number,
    unitFactor: number
  ): void {
    this.bomber.goTowards(targetPosition, 1);
    if (targetDistance < BomberAI.APPROACH_DISTANCE * unitFactor) {
      this.reviseApproach();
      this.state = "turn";
    }
  }

  private turnBehavior(targetDirection: Vector2, unitFactor: number): void {
    this.bomber.turn(-this.approachSign);
    this.bomber.thrust(unitFactor * 0.75);
    if (Vector2.dot(targetDirection, this.bomber.facing) < 0.5) {
      this.state = "shoot";
    }
  }

  private shootBehavior(delta: number, unitFactor: number): void {
    this.bomber.turn(this.approachSign * 0.05);
    this.bomber.thrust(unitFactor * 0.75);

    this.cooldownTimer -= delta;
    if (this.cooldownTimer <= 0) {
      // shoot in the direction of the target
      const shootDirection = this.target
        ? this.target.position.subtract(this.bomber.position)
        : this.bomber.facing;
      this.bomber.weapon.shoot(shootDirection);
      this.cooldownTimer = BomberAI.COOLDOWN_DURATION;
      this.shotsCounter--;

      if (this.shotsCounter === 0) {
        this.shotsCounter = BomberAI.MAX_SHOTS;
        this.state = "move_away";
      }
    }
  }

  private moveAwayBehavior(targetPosition: Vector2): void {
    this.bomber.goAway(targetPosition, 1);
  }
}
