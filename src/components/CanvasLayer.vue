<script setup lang="ts">
import getParticles from '@/canvas/particles';
import getScene from '@/canvas/scene';
import getTicketResultAnimation from '@/canvas/ticket-result-animation';
import getWinPopup from '@/canvas/win-popup';
import useGameStore from '@/composables/store';
import currencyFormat from '@/services/format/currency-format';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

const canvasContainer = ref<HTMLElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);

const scene = getScene();

const particles = getParticles();
particles.attachToScene(scene);

const winPopup = getWinPopup(scene.stage, particles);

const ticketResultAnimation = getTicketResultAnimation(scene.stage, particles);

const gameStore = useGameStore();

watch(
  () => gameStore.state,
  (state, prevState) => {
    if (state === 'win') {
      scene.start();

      ticketResultAnimation.playWin();

      setTimeout(() => winPopup.show(currencyFormat(gameStore.winAmount, false)), 1000);

      setTimeout(() => gameStore.setReady(), 3000);
    } else if (state === 'roundReady' && prevState === 'resultsReady') {
      scene.start();
      ticketResultAnimation.playLose();
    } else if (state === 'ticketsPurchase') {
      winPopup.hide();
      // keep one frame to hide stuff
      requestAnimationFrame(scene.stop);
    }
  }
);

const getResizer = (canvasEl: HTMLCanvasElement) => {
  let timeoutId = 0;
  return (width: number, height: number) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      canvasEl.width = width;
      canvasEl.height = height;
      scene.resize(width, height);
      winPopup.setRenderSize(width, height);
      ticketResultAnimation.setRenderSize(width, height);
    }, 200);
  };
};

onMounted(async () => {
  const canvasEl = canvas.value;
  if (!canvasEl) {
    return;
  }

  const containerEl = canvasContainer.value;
  if (containerEl) {
    const resize = getResizer(canvasEl);
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      resize(entry.contentRect.width - 4, entry.contentRect.height - 4);
    });
    resizeObserver.observe(containerEl);
  }

  scene.setCanvas(canvasEl);
});

onBeforeUnmount(() => {
  particles.destroy();
  scene.destroy();
});
</script>

<template>
  <div class="canvas-layer" ref="canvasContainer">
    <canvas ref="canvas" />
  </div>
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
