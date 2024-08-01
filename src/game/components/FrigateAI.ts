import type { IAI } from "../types";
import { Frigate } from "../entities/Frigate";
import { Vector2 } from "../utils/Vector2";
import type { Ship } from "../entities/Ship";
import type MainScene from "../scenes/MainScene";

export class FrigateAI implements IAI {
  private static readonly TARGET_DISTANCE = 250;
  private static readonly FUZZY_FACTOR = 100;

  private frigate: Frigate;
  private scene: MainScene;
  private target: Ship | null = null;
  private state: "moving" | "standing" = "moving";

  constructor(frigate: Frigate, scene: MainScene) {
    this.frigate = frigate;
    this.scene = scene;
  }

  update(delta: number): void {
    this.retargetIfNeeded();

    if (this.frigate.weapon.isReadyToShoot()) {
      this.frigate.weapon.shoot();
    }

    if (this.target) {
      const targetFuzzyPos = this.target.position.add(
        new Vector2(
          (Math.random() - 0.5) * FrigateAI.FUZZY_FACTOR,
          (Math.random() - 0.5) * FrigateAI.FUZZY_FACTOR
        )
      );
      const targetDistance = Vector2.distance(
        targetFuzzyPos,
        this.frigate.position
      );

      if (this.state == "moving") {
        this.frigate.goTowards(targetFuzzyPos, 1);
      } else {
        if (this.frigate.velocity.magnitude() > 5) {
          this.frigate.goTowards(targetFuzzyPos, -0.1);
        }
      }
    }
  }

  private retargetIfNeeded(): void {
    if (!this.target || this.target.health <= 0 || Math.random() < 0.01) {
      this.state = Math.random() < 0.5 ? "moving" : "standing";
      this.target =
        this.scene.entityManager.getNearestUnit(
          this.frigate.x,
          this.frigate.y,
          {
            team: this.frigate.team === "player" ? "enemy" : "player",
            unitType: "fighter",
          }
        ) ||
        this.scene.entityManager.getNearestUnit(
          this.frigate.x,
          this.frigate.y,
          {
            team: this.frigate.team === "player" ? "enemy" : "player",
            unitType: "frigate",
          }
        ) ||
        this.scene.entityManager.getNearestUnit(
          this.frigate.x,
          this.frigate.y,
          {
            team: this.frigate.team === "player" ? "enemy" : "player",
            unitType: "factory",
          }
        );
    }
  }
}
