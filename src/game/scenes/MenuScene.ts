import Phaser from "phaser";
import { toast } from "@zerodevx/svelte-toast";
import backgroundImage from "../../assets/background.png";
import logo from "../../../public/logo.svg";

export default class MenuScene extends Phaser.Scene {
  private static BUTTON_WIDTH = 350; // Set a fixed width for all buttons

  constructor() {
    super("MenuScene");
  }

  preload() {
    this.load.image("background", backgroundImage);
    this.load.image("logo", logo);
  }

  create() {
    // Add background
    this.add
      .image(0, 0, "background")
      .setOrigin(0, 0)
      .setDisplaySize(
        this.sys.game.config.width as number,
        this.sys.game.config.height as number
      );
    // Add logo
    this.add
      .image(this.cameras.main.centerX, 100, "logo")
      .setOrigin(0.5)
      .setScale(1)
      .setAlpha(0.75);

    // Add title text
    const titleText = this.add
      .text(this.cameras.main.centerX, 100, "Macro Tactics", {
        fontSize: "48px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    // Add menu buttons
    this.createButton(this.cameras.main.centerX, 250, "Play vs CPU", () =>
      this.startGame("cpu")
    );
    this.createButton(
      this.cameras.main.centerX,
      330,
      "Online Multiplayer",
      () => this.startGame("online")
    );
    this.createButton(
      this.cameras.main.centerX,
      410,
      "How to Play / Rules",
      () => this.showRules()
    );
  }

  createButton(x: number, y: number, text: string, callback: () => void) {
    const button = this.add
      .text(x, y, text, {
        fontSize: "24px",
        color: "#ffffff",
        padding: { left: 20, right: 20, top: 10, bottom: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    const buttonWidth = MenuScene.BUTTON_WIDTH;
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

  startGame(mode: "cpu" | "online") {
    if (mode === "cpu") {
      toast.push("Starting game vs CPU...", { duration: 2000 });
      // Start the main game scene
      this.scene.start("MainScene");
    } else {
      toast.push("Online multiplayer coming soon!", { duration: 2000 });
    }
  }

  showRules() {
    // Create a modal-like overlay for rules
    const overlay = this.add
      .rectangle(
        0,
        0,
        this.sys.game.config.width as number,
        this.sys.game.config.height as number,
        0x000000,
        0.7
      )
      .setOrigin(0)
      .setInteractive()
      .on("pointerdown", () => this.hideRules(overlay, modal));

    const modal = this.add.container(
      this.cameras.main.centerX,
      this.cameras.main.centerY
    );

    const modalBg = this.add.rectangle(0, 0, 400, 350, 0xffffff).setOrigin(0.5);

    const rulesText = this.add
      .text(0, -150, "How to Play", {
        fontSize: "24px",
        color: "#000000",
      })
      .setOrigin(0.5);

    const rulesContent = this.add
      .text(
        0,
        0,
        "1. Produce ships with resources you generate over time\n\n" +
          "2. Small Fighter ships are good against slow bomber ships\n\n" +
          "3. Heavy Frigates fire homing missiles which are good against packs of Fighter ships\n\n" +
          "4. Bomber ships with high damage are good against large Frigates\n\n",
        {
          fontSize: "16px",
          color: "#000000",
          align: "left",
          wordWrap: { width: 350 },
        }
      )
      .setOrigin(0.5);

    const closeButton = this.createButton(0, 150, "Close", () =>
      this.hideRules(overlay, modal)
    );
    modal.add([modalBg, rulesText, rulesContent, closeButton]);
  }

  hideRules(
    overlay: Phaser.GameObjects.Rectangle,
    modal: Phaser.GameObjects.Container
  ) {
    overlay.destroy();
    modal.destroy();
  }
}
