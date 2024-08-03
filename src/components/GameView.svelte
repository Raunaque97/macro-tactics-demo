<script lang="ts">
  import { onMount } from "svelte";
  import { SvelteToast, toast } from "@zerodevx/svelte-toast";
  import game from "../game";

  let gameContainer: HTMLElement;

  onMount(() => {
    if (gameContainer) {
      gameContainer.appendChild(game.canvas);
    }

    return () => {
      game.destroy(true);
    };
  });
</script>

<SvelteToast />

<main>
  <div bind:this={gameContainer} id="game-container"></div>
</main>

<style>
  main {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #000;
  }

  #game-container {
    width: 1200px;
    height: 800px;
    max-width: 100vw;
    max-height: 100vh;
  }

  :global(canvas) {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
</style>
