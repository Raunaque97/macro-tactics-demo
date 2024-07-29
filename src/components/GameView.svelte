<script lang="ts">
  import { onMount } from "svelte";
  import Phaser from "phaser";
  import MainScene from "../game/scenes/MainScene";

  let gameContainer: HTMLElement;

  onMount(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: gameContainer,
      scene: [MainScene],
      physics: {
        default: "arcade",
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false,
        },
      },
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  });
</script>

<div bind:this={gameContainer} class="game-container"></div>

<style>
  .game-container {
    width: 800px;
    height: 600px;
    margin: 0 auto;
  }
</style>
