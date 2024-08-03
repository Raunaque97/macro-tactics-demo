import type { Team } from "../types";
import { Ship } from "./Ship";
import { BomberWeapon } from "../components/BomberWeapon";
import { BomberAI } from "../components/BomberAI";
import type MainScene from "../scenes/MainScene";

export class Bomber extends Ship {
  weapon: BomberWeapon;
  private ai: BomberAI;

  static readonly MAX_VELOCITY = 40; // pixels per second
  static readonly TURN_RATE = 0.01; // radians per frame

  constructor(public scene: MainScene, x: number, y: number, team: Team) {
    super(
      scene,
      x,
      y,
      team === "player" ? "bomber_p1" : "bomber_p2",
      "bomber",
      team,
      9, // health
      Bomber.MAX_VELOCITY,
      Bomber.TURN_RATE
    );

    this.weapon = new BomberWeapon(this);
    this.ai = new BomberAI(this, scene);
  }

  update(time: number, delta: number) {
    super.update(time, delta);
    this.weapon.update(delta);
    this.ai.update(delta);
  }
}
