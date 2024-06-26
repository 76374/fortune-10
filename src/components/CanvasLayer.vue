<script setup lang="ts">
import getParticles from '@/canvas/particles';
import getScene from '@/canvas/scene';
import getTicketResultAnimation from '@/canvas/ticket-result-animation';
import getWinPopup from '@/canvas/win-popup';
import currencyFormat from '@/services/format/currency-format';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

export type CanvasState = 'none' | 'win' | 'lose';

const winDelay = 1000;
const winDuration = 2500;
const loseDuration = 2000;

const props = defineProps<{
  state: CanvasState;
  winAmount: number;
}>();

const emit = defineEmits<{
  (e: 'animation-completed'): void;
}>();

const canvasContainer = ref<HTMLElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);

const scene = getScene();

const particles = getParticles();
particles.attachToScene(scene);

const winPopup = getWinPopup(scene.stage, particles);

const ticketResultAnimation = getTicketResultAnimation(scene.stage, particles);

let timeoutId = 0;

watch(
  () => props.state,
  (state) => {
    if (state === 'win') {
      scene.start();

      ticketResultAnimation.playWin();

      timeoutId = setTimeout(() => {
        winPopup.show(currencyFormat(props.winAmount, false));

        timeoutId = setTimeout(() => emit('animation-completed'), winDuration);
      }, winDelay);
    } else if (state === 'lose') {
      scene.start();
      ticketResultAnimation.playLose();
      timeoutId = setTimeout(() => emit('animation-completed'), loseDuration);
    } else if (state === 'none') {
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
  clearTimeout(timeoutId);
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
