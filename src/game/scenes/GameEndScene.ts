import Phaser from "phaser";
import { toast } from "@zerodevx/svelte-toast";
import type MainScene from "./MainScene";

export default class GameEndScene extends Phaser.Scene {
  private result: "win" | "lose" = "win";
  private static BUTTON_WIDTH = 250; // Set a fixed width for all buttons

  constructor() {
    super("GameEndScene");
  }

  init(data: { result: "win" | "lose" }) {
    this.result = data.result;
  }

  create() {
    const { width, height } = this.scale;

    // Add semi-transparent overlay
    this.add.rectangle(0, 0, width, height, 0x000000, 0.7).setOrigin(0);

    // Add result text
    const resultText = this.result === "win" ? "Victory!" : "Defeat!";
    const resultColor = this.result === "win" ? "#FFD700" : "#FF4136";
    this.add
      .text(width / 2, height / 3, resultText, {
        fontSize: "64px",
        color: resultColor,
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Add play again button
    this.createButton(width / 2, height / 2, "Play Again", () =>
      this.playAgain()
    );

    // Add main menu button
    this.createButton(width / 2, height / 2 + 80, "Main Menu", () =>
      this.returnToMainMenu()
    );
  }

  createButton(x: number, y: number, text: string, callback: () => void) {
    const button = this.add
      .text(x, y, text, {
        fontSize: "32px",
        color: "#ffffff",
        padding: { left: 20, right: 20, top: 10, bottom: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    // Use the fixed BUTTON_WIDTH instead of calculating based on text width
    const buttonWidth = GameEndScene.BUTTON_WIDTH;
    const buttonHeight = button.height + 20; // Add some padding

    const buttonBackground = this.add
      .rectangle(x, y, buttonWidth, buttonHeight, 0xffffff, 0.1)
      .setStrokeStyle(2, 0x808080) // Grey border
      .setOrigin(0.5);

    // Center the text within the button
    button.setPosition(x, y);

    button.on("pointerover", () => {
      buttonBackground.setStrokeStyle(2, 0xffffff); // White border on hover
    });
    button.on("pointerout", () => {
      buttonBackground.setStrokeStyle(2, 0x808080); // Grey border when not hovering
    });
    button.on("pointerdown", callback);

    return button;
  }

  playAgain() {
    this.scene.start("MainScene");
  }

  returnToMainMenu() {
    this.scene.start("MenuScene");
  }
}
