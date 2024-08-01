import type { Team } from "../types";
import { Ship } from "./Ship";
import { FrigateWeapon } from "../components/FrigateWeapon";
import { FrigateAI } from "../components/FrigateAI";
import type MainScene from "../scenes/MainScene";

export class Frigate extends Ship {
  weapon: FrigateWeapon;
  private ai: FrigateAI;

  static readonly MAX_VELOCITY = 20; // pixels per second
  static readonly TURN_RATE = 0.002;

  constructor(public scene: MainScene, x: number, y: number, team: Team) {
    super(
      scene,
      x,
      y,
      team === "player" ? "frigate_p1" : "frigate_p2",
      "frigate",
      team,
      60, // health
      Frigate.MAX_VELOCITY,
      Frigate.TURN_RATE
    );

    this.weapon = new FrigateWeapon(this);
    this.ai = new FrigateAI(this, scene);
  }

  update(time: number, delta: number) {
    super.update(time, delta);
    this.weapon.update(delta);
    this.ai.update(delta);
  }
}
