<script setup lang="ts">
import getParticles from '@/canvas/particles';
import { getWinStars } from '@/canvas/particles/win-stars';
import getScene from '@/canvas/scene';
import getWinPopup from '@/canvas/win-popup';
import useGameStore from '@/composables/store';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

const containerRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);

const scene = getScene();
const particles = getParticles();
particles.attachToScene(scene);
const winPopup = getWinPopup();
winPopup.attachToScene(scene);

const gameStore = useGameStore();

watch(
  () => gameStore.state,
  (state) => {
    if (state === 'win') {
      scene.start();

      particles.play('starsTop');
      particles.play('starsBottom');
      particles.play('starsLeft');
      particles.play('starsRight');

      setTimeout(winPopup.show, 1000);

      setTimeout(() => gameStore.setReady(), 2000);
    } else if (state === 'ticketsPurchase') {
      winPopup.hide();
      scene.stop();
    }
  }
);

const handleClick = () => {
  scene.start();

  particles.play('starsTop');
  particles.play('starsBottom');
  particles.play('starsLeft');
  particles.play('starsRight');
  // winPopup.show();
};

onMounted(async () => {
  // to update canvas size first
  requestAnimationFrame(() => {
    const canvasEl = canvasRef.value;
    if (!canvasEl) {
      return;
    }

    scene.setCanvas(canvasEl);
    winPopup.setRenderWidth(canvasEl.width);
    winPopup.setParticles(particles);

    const addWinStars = (rect: Parameters<typeof getWinStars>[0], angle: number, id: string) =>
      particles.addParticles(getWinStars(rect, angle, 0.2), id, scene.stage);

    const rect = { x: 380, y: 100, w: 440, h: 330 };
    addWinStars({ x: rect.x, y: rect.y, w: 490, h: 0 }, 0, 'starsTop');
    addWinStars({ x: rect.x, y: rect.h, w: 490, h: 0 }, 180, 'starsBottom');
    addWinStars({ x: rect.x, y: rect.y, w: 0, h: rect.h }, -90, 'starsLeft');
    addWinStars({ x: rect.x + rect.w, y: rect.y, w: 0, h: rect.h }, 90, 'starsRight');
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
