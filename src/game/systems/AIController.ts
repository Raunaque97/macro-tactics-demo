import type { GameEntityManager } from "../GameEntityManager";
import type { FactoryShip } from "../entities/FactoryShip";
import type { CombatUnitType, Team } from "../types";

export class AIController {
  private unitCounts: Record<Team, Record<CombatUnitType, number>> = {
    player: { fighter: 0, bomber: 0, frigate: 0 },
    enemy: { fighter: 0, bomber: 0, frigate: 0 },
  };

  constructor(private factoryShip: FactoryShip) {}

  update(delta: number) {
    if (!this.factoryShip.active) return;
    this.updateUnitCounts();
    this.makeDecision();
  }

  private updateUnitCounts() {
    for (const team of ["player", "enemy"] as Team[]) {
      for (const unitType of [
        "fighter",
        "bomber",
        "frigate",
      ] as CombatUnitType[]) {
        this.unitCounts[team][unitType] =
          this.factoryShip.scene.entityManager.getUnitCount(team, unitType);
      }
    }
  }

  private makeDecision() {
    if (this.factoryShip.isProducing()) return;

    const enemyUnits = this.unitCounts.player;
    const ownUnits = this.unitCounts.enemy;

    let unitToProduct: CombatUnitType = "fighter";

    // Simple decision-making logic
    if (enemyUnits.fighter > ownUnits.fighter * 2 + 5) {
      unitToProduct = "frigate";
    } else if (
      enemyUnits.bomber >= ownUnits.bomber &&
      enemyUnits.fighter * 1.2 + 5 > ownUnits.fighter
    ) {
      unitToProduct = "fighter";
    } else if (enemyUnits.frigate + 1 > ownUnits.bomber / 3) {
      unitToProduct = "bomber";
    } else if (ownUnits.fighter + 3 * ownUnits.bomber > 20) {
      unitToProduct = "frigate";
    }
    if (this.factoryShip.canProduceUnit(unitToProduct)) {
      console.log(unitToProduct, enemyUnits, ownUnits);
      this.factoryShip.startProduction(unitToProduct);
    }
  }
}
