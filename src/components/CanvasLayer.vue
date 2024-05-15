<script setup lang="ts">
import getParticles from '@/canvas/particles';
import { getWinStars } from '@/canvas/particles/win-stars';
import getScene from '@/canvas/scene';
import getTicketResultAnimation from "@/canvas/ticket-result-animation";
import getWinPopup from '@/canvas/win-popup';
import useGameStore from '@/composables/store';
import currencyFormat from '@/services/format/currency-format';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

const containerRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);

const scene = getScene();

const particles = getParticles();
particles.attachToScene(scene);

const winPopup = getWinPopup();
winPopup.attachToScene(scene);

const ticketResultAnimation = getTicketResultAnimation();
ticketResultAnimation.attachToScene(scene);

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

const handleClick = () => {
  scene.start();
  ticketResultAnimation.playLose();
};

const getResize = (canvasEl: HTMLCanvasElement) => {
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
  // init after canvas size is updated
  requestAnimationFrame(() => {
    const canvasEl = canvasRef.value;
    if (!canvasEl) {
      return;
    }

    const containerEl = containerRef.value;
    if (containerEl) {
      const resize = getResize(canvasEl);
      const resizeObserver = new ResizeObserver((entries) => {
        const entry = entries[0];
        resize(entry.contentRect.width - 4, entry.contentRect.height - 4);
      });
      resizeObserver.observe(containerEl);
    }

    scene.setCanvas(canvasEl);
    winPopup.setParticles(particles);
    ticketResultAnimation.setParticles(particles);
  });
});

onBeforeUnmount(() => {
  particles.destroy();
  scene.destroy();
});
</script>

<template>
  <div class="canvas-layer" ref="containerRef">
    <canvas
      ref="canvasRef"
      :width="containerRef?.offsetWidth"
      :height="containerRef?.offsetHeight"
      @click="handleClick"
    />
  </div>
</template>

<style scoped>
.canvas-layer {
  /*pointer-events: none;*/
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
}
</style>
