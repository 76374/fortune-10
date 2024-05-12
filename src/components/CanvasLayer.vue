<script setup lang="ts">
import useGameStore from '@/composables/store';
import { Application, Assets, Sprite } from 'pixi.js';
import { onMounted, ref, watch } from 'vue';

const containerRef = ref<HTMLElement | null>(null);

const isVisible = ref(false);

const gameStore = useGameStore();

watch(
  () => gameStore.state,
  (state) => {
    if (state === "win") {
      isVisible.value = true;
      setTimeout(() => gameStore.setReady(), 2000);
    } else if (state === "ticketsPurchase") {
      isVisible.value = false;
    }
  }
);

onMounted(async () => {
  const containerEl = containerRef.value;
  if (!containerEl) {
    return;
  }
  const app = new Application();

  await app.init({ backgroundAlpha: 0, resizeTo: containerEl });

  containerEl.appendChild(app.canvas);

  const texture = await Assets.load('https://pixijs.com/assets/bunny.png');
  const bunny = new Sprite(texture);

  bunny.anchor.set(0.5);

  bunny.x = app.screen.width / 2;
  bunny.y = app.screen.height / 2;

  app.stage.addChild(bunny);

  app.ticker.add((time) => {
    bunny.rotation += 0.1 * time.deltaTime;
  });
});
</script>

<template>
  <div v-show="isVisible" class="canvas-layer" ref="containerRef" />
</template>

<style scoped>
.canvas-layer {
  pointer-events: none;
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
}
</style>
