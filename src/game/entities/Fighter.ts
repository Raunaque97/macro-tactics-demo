import type { Team } from "../types";
import { Ship } from "./Ship";
import { FighterWeapon } from "../components/FighterWeapon";
import { FighterAI } from "../components/FighterAI";
import type MainScene from "../scenes/MainScene";

export class Fighter extends Ship {
  weapon: FighterWeapon;
  private ai: FighterAI;

  constructor(public scene: MainScene, x: number, y: number, team: Team) {
    super(
      scene,
      x,
      y,
      team === "player" ? "fighter_p1" : "fighter_p2",
      "fighter",
      team,
      50
    );

    this.weapon = new FighterWeapon(this);
    this.ai = new FighterAI(this, scene);
  }

  update(time: number, delta: number) {
    super.update(time, delta);
    // console.log("Fighter updating", this.velocity, this.facing);
    this.weapon.update(delta);
    this.ai.update(delta);
  }
}
