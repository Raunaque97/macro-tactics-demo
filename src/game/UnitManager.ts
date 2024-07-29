import Phaser from "phaser";
import { Ship } from "./entities/Ship";
import type { UnitType, Team } from "./types";

export class UnitManager {
  private scene: Phaser.Scene;
  private unitsGroup: Phaser.GameObjects.Group | null = null;
  private unitsByTeamAndType: Map<string, Phaser.GameObjects.Group>;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    // this.units = scene.add.group();
    this.unitsByTeamAndType = new Map();
  }

  get units() {
    if (!this.unitsGroup) this.unitsGroup = this.scene.add.group();
    return this.unitsGroup;
  }

  addUnit(unit: Ship) {
    this.units.add(unit);

    const key = this.getKey(unit.team, unit.type);
    if (!this.unitsByTeamAndType.has(key)) {
      this.unitsByTeamAndType.set(key, this.scene.add.group());
    }
    this.unitsByTeamAndType.get(key)!.add(unit);

    console.log(`Unit added: ${unit.team} ${unit.type}`);
    console.log(`Total units: ${this.units.getLength()}`);
    console.log(
      `${key} units: ${this.unitsByTeamAndType.get(key)?.getLength()}`
    );
  }

  removeUnit(unit: Ship) {
    this.units.remove(unit);
    const key = this.getKey(unit.team, unit.type);
    this.unitsByTeamAndType.get(key)?.remove(unit);
    unit.destroy();
  }

  update(time: number, delta: number) {
    this.units.children.entries.forEach((unit) => unit.update(time, delta));
  }

  getNearestUnit(
    x: number,
    y: number,
    options?: {
      team?: Team;
      unitType?: UnitType;
      maxDistance?: number;
    }
  ): Ship | null {
    let searchGroup: Phaser.GameObjects.Group | null = null;

    if (options?.team && options?.unitType) {
      const key = this.getKey(options.team, options.unitType);
      searchGroup = this.unitsByTeamAndType.get(key) || null;
    } else if (options?.team) {
      searchGroup = this.scene.add.group();
      this.unitsByTeamAndType.forEach((group, key) => {
        if (key.startsWith(options.team!)) {
          group.getChildren().forEach((unit) => searchGroup?.add(unit));
        }
      });
    } else if (options?.unitType) {
      searchGroup = this.scene.add.group();
      this.unitsByTeamAndType.forEach((group, key) => {
        if (key.endsWith(options.unitType!)) {
          group.getChildren().forEach((unit) => searchGroup?.add(unit));
        }
      });
    } else {
      searchGroup = this.unitsGroup;
    }
    if (!searchGroup) return null;

    const nearestUnit = this.scene.physics.closest(
      { x, y },
      searchGroup.getChildren()
    ) as Ship | undefined;

    if (options?.maxDistance && nearestUnit) {
      const distance = Phaser.Math.Distance.Between(
        x,
        y,
        nearestUnit.x,
        nearestUnit.y
      );
      if (distance > options.maxDistance) return null;
    }

    return nearestUnit || null;
  }

  private getKey(team: Team, unitType: UnitType): string {
    return `${team}-${unitType}`;
  }

  //   getUnitsInRange(
  //     x: number,
  //     y: number,
  //     range: number,
  //     options?: {
  //       team?: string;
  //       unitType?: string;
  //     }
  //   ): Ship[] {
  //     let searchGroup = this.units;
  //     if (options?.team) searchGroup = this.unitsByTeam.get(options.team)!;
  //     if (options?.unitType)
  //       searchGroup = this.unitsByType.get(options.unitType)!;

  //     return this.scene.physics.overlapCirc(x, y, range, false, false);
  //   }
}
