import Phaser from "phaser";
import { Ship } from "./entities/Ship";
import type { UnitType, Team, Bullet } from "./types";

export class GameEntityManager {
  private scene: Phaser.Scene;
  private unitsGroup: Phaser.GameObjects.Group | null = null;
  private unitsByTeamAndType: Map<string, Phaser.GameObjects.Group>;
  private bulletsByTeam: Map<Team, Phaser.GameObjects.Group>;
  private collisionSetups: Set<string>;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    // this.units = scene.add.group();
    this.unitsByTeamAndType = new Map();
    this.bulletsByTeam = new Map();
    this.collisionSetups = new Set();
  }

  get units() {
    if (!this.unitsGroup) this.unitsGroup = this.scene.add.group();
    return this.unitsGroup;
  }

  setupCollisions() {
    const teams = Array.from(
      new Set([
        ...this.bulletsByTeam.keys(),
        ...[...this.unitsByTeamAndType.keys()].map((key) => key.split("-")[0]),
      ])
    );
    teams.forEach((teamA) => {
      teams.forEach((teamB) => {
        if (teamA !== teamB) {
          this.setupCollisionBtwcBulletAShipB(teamA as Team, teamB as Team);
        }
      });
    });
  }

  private setupCollisionBtwcBulletAShipB(teamA: Team, teamB: Team) {
    const bulletsA = this.bulletsByTeam.get(teamA);
    if (bulletsA) {
      this.unitsByTeamAndType.forEach((group, key) => {
        if (key.startsWith(teamB)) {
          const collisionKey = `${teamA}-${key}`;
          if (this.collisionSetups.has(collisionKey)) return;
          console.log(`adding collisionKey: ${collisionKey}`);

          this.scene.physics.add.overlap(
            bulletsA,
            group,
            this.handleBulletHit,
            undefined,
            this
          );
          this.collisionSetups.add(collisionKey);
        }
      });
    }
  }

  private handleBulletHit(bulletObj: any, targetObj: any) {
    const bullet = bulletObj as Bullet;
    const target = targetObj as Ship;
    bullet.onHit(target);
  }

  addUnit(unit: Ship) {
    this.units.add(unit);
    const key = this.getKey(unit.team, unit.type);
    if (!this.unitsByTeamAndType.has(key)) {
      this.unitsByTeamAndType.set(key, this.scene.add.group());
    }
    this.unitsByTeamAndType.get(key)!.add(unit);
    this.setupCollisions();

    console.log(`Unit added: ${unit.team} ${unit.type}`);
    console.log(`Total units: ${this.units.getLength()}`);
    console.log(
      `${key} units: ${this.unitsByTeamAndType.get(key)?.getLength()}`
    );
  }

  addBullet(team: Team, bullet: Bullet) {
    if (!this.bulletsByTeam.has(team)) {
      this.bulletsByTeam.set(team, this.scene.add.group());
    }
    this.bulletsByTeam.get(team)!.add(bullet);
    this.setupCollisions();
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

  private getFilteredGroup(options?: {
    team?: Team;
    unitType?: UnitType;
  }): Phaser.GameObjects.Group | null {
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

    return searchGroup;
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
    let searchGroup = this.getFilteredGroup(options);
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

  getUnitsInRange(
    x: number,
    y: number,
    range: number,
    options?: {
      team?: Team;
      unitType?: UnitType;
    }
  ): Ship[] {
    const searchGroup = this.getFilteredGroup(options);
    if (!searchGroup) return [];

    const res = [] as Ship[];
    searchGroup.getChildren().forEach((unit) => {
      if (!(unit instanceof Ship)) return;
      const distance = Phaser.Math.Distance.Between(x, y, unit.x, unit.y);
      // TODO: handle rectangular hit box
      if (distance <= range + (unit.body?.width || 0)) {
        res.push(unit as Ship);
      }
    });
    return res;
  }

  private getKey(team: Team, unitType: UnitType): string {
    return `${team}-${unitType}`;
  }
}
