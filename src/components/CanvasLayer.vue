<script setup lang="ts">
import getParticles from '@/canvas/particles';
import { getWinStars } from '@/canvas/particles/win-stars';
import useGameStore from '@/composables/store';
import { onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue';

const containerRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const particles = shallowRef<ReturnType<typeof getParticles> | null>(null);

// const isVisible = ref(false);

const gameStore = useGameStore();

watch(
  () => gameStore.state,
  (state) => {
    if (state === 'win') {
      // isVisible.value = true;
      if (particles.value) {
        particles.value.play('starsTop');
        particles.value.play('starsBottom');
        particles.value.play('starsLeft');
        particles.value.play('starsRight');
      }

      setTimeout(() => gameStore.setReady(), 2000);
    } else if (state === 'ticketsPurchase') {
      // isVisible.value = false;
    }
  }
);

onMounted(async () => {
  const containerEl = containerRef.value;
  const canvasEl = canvasRef.value;
  if (!containerEl || !canvasEl) {
    return;
  }

  // to update canvas size first
  requestAnimationFrame(() => {
    particles.value = getParticles(canvasEl);

    particles.value.addParticles(getWinStars({ x: 360, y: 50, w: 490, h: 0 }, 0), 'starsTop');
    particles.value.addParticles(getWinStars({ x: 360, y: 380, w: 490, h: 0 }, 180), 'starsBottom');
    particles.value.addParticles(getWinStars({ x: 360, y: 50, w: 0, h: 380 }, -90), 'starsLeft');
    particles.value.addParticles(getWinStars({ x: 850, y: 50, w: 0, h: 380 }, 90), 'starsRight');
  });
});

onBeforeUnmount(() => {
  particles.value?.destroy();
});
</script>

<template>
  <div class="canvas-layer" ref="containerRef">
    <canvas
      ref="canvasRef"
      :width="containerRef?.offsetWidth"
      :height="containerRef?.offsetHeight"
    />
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
