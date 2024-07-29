import { Ship } from "./Ship";
import type { Team, CombatUnitType } from "../types";
import { Vector2 } from "../utils/Vector2";
import { Fighter } from "./Fighter";
import type { UnitManager } from "../UnitManager";
import type MainScene from "../scenes/MainScene";

export class FactoryShip extends Ship {
  public static readonly RESOURCE_GENERATION_RATE = 1; // Resource per second
  public static readonly FIGHTER_COST = 1;
  public static readonly BOMBER_COST = 5;
  public static readonly FRIGATE_COST = 20;
  public static readonly ROTATION_SPEED = 0.025; // Radians per second
  public static readonly MOVE_SPEED = 5;
  public maxHealth: number = 1000;

  private resources: number = 0;
  private currentProduction: {
    unitType: CombatUnitType;
    timeLeft: number;
  } | null = null;
  // production time in seconds
  private static readonly PRODUCTION_TIMES: Record<CombatUnitType, number> = {
    fighter: 1,
    bomber: 4,
    frigate: 16,
  };

  constructor(public scene: MainScene, x: number, y: number, team: Team) {
    super(
      scene,
      x,
      y,
      team === "player" ? "factory_p1" : "factory_p2",
      "factory",
      team,
      1000
    );
    // Set up circular movement
    if (team === "player") {
      this.velocity = new Vector2(0, -FactoryShip.MOVE_SPEED);
      this.facing = new Vector2(0, -1);
    } else {
      this.velocity = new Vector2(0, FactoryShip.MOVE_SPEED);
      this.facing = new Vector2(0, 1);
    }
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
      timeLeft: FactoryShip.PRODUCTION_TIMES[unitType],
    };
  }

  private getUnitCost(unitType: CombatUnitType): number {
    switch (unitType) {
      case "fighter":
        return FactoryShip.FIGHTER_COST;
      case "bomber":
        return FactoryShip.BOMBER_COST;
      case "frigate":
        return FactoryShip.FRIGATE_COST;
      default:
        return Infinity;
    }
  }

  private finishProduction(unitType: CombatUnitType) {
    switch (unitType) {
      case "fighter":
        this.spawnFighter();
        break;
      // Add cases for other unit types here
    }
  }

  private spawnFighter() {
    const spawnOffset = this.facing.multiply(60); // Spawn 60 pixels in front of the factory
    const spawnPosition = this.position.add(spawnOffset);
    const ship = new Fighter(
      this.scene,
      spawnPosition.x,
      spawnPosition.y,
      this.team
    );
    ship.velocity = this.velocity;
    ship.facing = this.facing;
    this.scene.unitManager.addUnit(ship);
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
        FactoryShip.PRODUCTION_TIMES[this.currentProduction.unitType];
      const progress = 1 - this.currentProduction.timeLeft / totalTime;
      return { unitType: this.currentProduction.unitType, progress };
    }
    return null;
  }

  isProducing(): boolean {
    return this.currentProduction !== null;
  }
}
