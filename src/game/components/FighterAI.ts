import type { IAI } from "../types";
import { Fighter } from "../entities/Fighter";
import { Vector2 } from "../utils/Vector2";
import type { Ship } from "../entities/Ship";
import type { UnitManager } from "../UnitManager";
import type MainScene from "../scenes/MainScene";

export class FighterAI implements IAI {
  private static readonly SHOT_RANGE = 200;
  private static readonly RUN_DISTANCE = 200;
  private static readonly ACCELERATION = 0.5;

  private fighter: Fighter;
  private scene: MainScene;
  private target: Ship | null = null;
  private running: boolean = false;

  constructor(fighter: Fighter, scene: MainScene) {
    this.fighter = fighter;
    this.scene = scene;
  }

  update(delta: number): void {
    this.retargetIfNeeded();

    if (this.target) {
      const toTarget = this.target.position.subtract(this.fighter.position);
      const distSquared = Vector2.sqrMagnitude(toTarget);

      if (this.running) {
        this.runningBehavior(distSquared);
      } else {
        this.attackingBehavior(toTarget, distSquared);
      }
    }
  }

  private retargetIfNeeded(): void {
    if (!this.target || this.target.health <= 0 || Math.random() < 0.005) {
      this.target = this.findNearestTarget();
    }
  }

  private findNearestTarget(): Ship | null {
    // priority: bomber > fighter > frigate > factory
    // TODO add max range / view distance
    const target =
      this.scene.unitManager.getNearestUnit(this.fighter.x, this.fighter.y, {
        team: this.fighter.team === "player" ? "enemy" : "player",
        unitType: "bomber",
      }) ||
      this.scene.unitManager.getNearestUnit(this.fighter.x, this.fighter.y, {
        team: this.fighter.team === "player" ? "enemy" : "player",
        unitType: "fighter",
      }) ||
      this.scene.unitManager.getNearestUnit(this.fighter.x, this.fighter.y, {
        team: this.fighter.team === "player" ? "enemy" : "player",
        unitType: "frigate",
      }) ||
      this.scene.unitManager.getNearestUnit(this.fighter.x, this.fighter.y, {
        team: this.fighter.team === "player" ? "enemy" : "player",
        unitType: "factory",
      });
    // console.log(
    //   `fighter target: ${target ? target.team : "null"}, type ${target?.type}`
    // );
    return target;
  }

  private runningBehavior(distSquared: number): void {
    const tooClose = distSquared < FighterAI.RUN_DISTANCE ** 2;

    if (tooClose && this.target) {
      this.fighter.goAway(this.target.position, FighterAI.ACCELERATION);
      console.log("too close, running away");
    } else {
      this.fighter.thrust(1);
    }

    if (!this.fighter.weapon.isEmpty() && !tooClose) {
      this.running = false;
      console.log("switching to attacking");
    }
  }

  private attackingBehavior(toTarget: Vector2, distSquared: number): void {
    if (this.target) {
      this.fighter.goTowards(this.target.position, FighterAI.ACCELERATION);
      //   console.log("attacking vel:", this.fighter.velocity);
      if (this.fighter.weapon.isReadyToShoot()) {
        if (
          distSquared <= FighterAI.SHOT_RANGE ** 2 &&
          Vector2.dot(toTarget, this.fighter.facing) > 0 &&
          Vector2.dot(toTarget, this.fighter.facing) ** 2 > 0.97 * distSquared
        ) {
          this.fighter.weapon.shoot();
        }
      }

      //   if (this.fighter.weapon.isEmpty()) {
      //     this.running = true;
      //     console.log("switching to running");
      //   }
    }
  }
}
