import { Ship } from "./Ship";
import type { Team, CombatUnitType } from "../types";
import { Vector2 } from "../utils/Vector2";
import { Fighter } from "./Fighter";
import type { GameEntityManager } from "../GameEntityManager";
import type MainScene from "../scenes/MainScene";
import { Bomber } from "./Bomber";
import { Frigate } from "./Frigate";

type ShipConstructor = new (
  scene: MainScene,
  x: number,
  y: number,
  team: Team
) => Ship;

interface UnitInfo {
  class: ShipConstructor;
  productionTime: number;
  cost: number;
}

export class FactoryShip extends Ship {
  public static readonly RESOURCE_GENERATION_RATE = 0.5; // Resource per second
  public static readonly ROTATION_SPEED = 0.025; // Radians per second
  public static readonly MOVE_SPEED = 5;
  public static readonly maxHealth: number = 1000;

  private resources: number = 0;
  private currentProduction: {
    unitType: CombatUnitType;
    timeLeft: number;
  } | null = null;
  // production time in seconds
  public static readonly UNIT_INFO: Record<CombatUnitType, UnitInfo> = {
    // TODO balance cost, production time later
    fighter: {
      class: Fighter,
      productionTime: 0.5,
      cost: 1,
    },
    bomber: {
      class: Bomber,
      productionTime: 1.5,
      cost: 3,
    },
    frigate: {
      class: Frigate, // Placeholder, replace with actual Frigate class when implemented
      productionTime: 4,
      cost: 9,
    },
  };

  constructor(public scene: MainScene, x: number, y: number, team: Team) {
    super(
      scene,
      x,
      y,
      team === "player" ? "factory_p1" : "factory_p2",
      "factory",
      team,
      FactoryShip.maxHealth,
      Infinity,
      0
    );
    // Set up circular movement
    if (team === "player") {
      this.velocity = new Vector2(0, -FactoryShip.MOVE_SPEED);
      this.facing = new Vector2(0, -1);
    } else {
      this.velocity = new Vector2(0, FactoryShip.MOVE_SPEED);
      this.facing = new Vector2(0, 1);
    }
    this.resources = 3;
    // set hit box to a circle
    this.setOrigin(0.5, 0.5);
    // this.setOffset(-this.width / 2, -this.height / 2);
    this.setCircle(this.width / 3, this.height / 3);
  }

  update(time: number, delta: number) {
    super.update(time, delta);

    // Generate resources
    this.resources += FactoryShip.RESOURCE_GENERATION_RATE * (delta / 1000);

    // Rotate the ship
    this.rotation += FactoryShip.ROTATION_SPEED * (delta / 1000);

    // Update velocity for circular motion
    const angle = this.rotation;
    this.facing = new Vector2(Math.cos(angle), Math.sin(angle));
    this.velocity = this.facing.multiply(FactoryShip.MOVE_SPEED);

    // Process production
    this.processProduction(delta);
  }

  private processProduction(delta: number) {
    if (this.currentProduction) {
      this.currentProduction.timeLeft -= delta / 1000;
      if (this.currentProduction.timeLeft <= 0) {
        this.finishProduction(this.currentProduction.unitType);
        this.currentProduction = null;
      }
    }
  }

  public canProduceUnit(unitType: CombatUnitType): boolean {
    return this.resources >= this.getUnitCost(unitType);
  }

  public startProduction(unitType: CombatUnitType) {
    this.resources -= this.getUnitCost(unitType);
    this.currentProduction = {
      unitType,
      timeLeft: FactoryShip.UNIT_INFO[unitType].productionTime,
    };
  }

  private getUnitCost(unitType: CombatUnitType): number {
    return FactoryShip.UNIT_INFO[unitType].cost;
  }

  private finishProduction(unitType: CombatUnitType) {
    // spawn unit
    const spawnOffset = this.facing.multiply(60); // Spawn 60 pixels in front of the factory
    const spawnPosition = this.position.add(spawnOffset);
    const ship = new FactoryShip.UNIT_INFO[unitType].class(
      this.scene,
      spawnPosition.x,
      spawnPosition.y,
      this.team
    );
    ship.velocity = this.velocity;
    ship.facing = this.facing;
  }

  getResources(): number {
    return this.resources;
  }

  getProductionProgress(): {
    unitType: CombatUnitType;
    progress: number;
  } | null {
    if (this.currentProduction) {
      const totalTime =
        FactoryShip.UNIT_INFO[this.currentProduction.unitType].productionTime;
      const progress = 1 - this.currentProduction.timeLeft / totalTime;
      return { unitType: this.currentProduction.unitType, progress };
    }
    return null;
  }

  isProducing(): boolean {
    return this.currentProduction !== null;
  }
}
