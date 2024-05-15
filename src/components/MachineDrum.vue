<script setup lang="ts">
import TheTicket from '@/components/TheTicket.vue';
import { gsap } from 'gsap';
import CustomEase from 'gsap/CustomEase';
import { ref } from "vue";

const spinTime = 2;
const spinRotations = 2;
const ticketFlyTime = 0.7;

const props = defineProps<{
  ticketNumber: number;
}>();

const emit = defineEmits<{
  (e: 'complete'): void;
}>();

const ticketVisible = ref(false);

defineExpose({
  spin: () => {
    gsap.set('.drum polygon', { rotation: 0 });
    gsap.to('.drum polygon', {
      rotation: 360 * spinRotations,
      duration: spinTime,
    });
    gsap.from('.result-ticket', {
      scale: 0,
      alpha: 0,
      duration: ticketFlyTime,
      rotateX: 180,
      ease: 'power1.in',
      delay: spinTime,

      onStart() {
        ticketVisible.value = true;
      },
      onComplete() {
        emit('complete')
      },
    });
    gsap.from('.result-ticket-container', {
      y: -80,
      duration: ticketFlyTime,
      delay: spinTime,
      ease: CustomEase.create(
        'custom',
        'M0,0 C0.059,-0.255 0.23,-0.85 0.5,-0.822 0.761,-0.794 0.95,0.388 1,1'
      ),
    });
  },

  hideTicket: () => {
    ticketVisible.value = false;
  }
});
</script>

<template>
  <svg class="drum" height="200" width="160" xmlns="http://www.w3.org/2000/svg">
    <polygon
      data-id="drum"
      points="140,70 105,131 35,131 0,70 35,9 105,9"
      transform="translate(20)"
      fill="#3c096c"
      stroke="#faa275"
    />
    <rect
      width="120"
      height="20"
      x="90"
      y="65"
      transform="rotate(120,90,75)"
      fill="#3c096c"
      stroke="#faa275"
    />
    <rect width="110" height="20" x="30" y="170" fill="#3c096c" stroke="#faa275" />
    <circle r="14" fill="#3c096c" cx="90" cy="72" stroke="#faa275" />
    <circle r="12" fill="#3c096c" cx="32" cy="179" stroke="#faa275" />
    <circle r="12" fill="#3c096c" cx="142" cy="179" stroke="#faa275" />
  </svg>
  <div class="result-ticket-container">
    <TheTicket
      v-show="ticketVisible"
      class="result-ticket"
      :ticket-number="props.ticketNumber"
    />
  </div>
</template>

<style scoped>
.drum {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(1.4);

  [data-id='drum'] {
    transform-origin: 70px 61px;
  }
}

.result-ticket-container {
  perspective: 400px;

  position: absolute;
  min-height: 170px;
  min-width: 340px;
  width: min(442px, calc(100vw - 16px));
  height: min(228px, calc((100vw - 16px) * 0.516));
  font-size: 6em;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .result-ticket {
    height: 100%;
    width: 100%;
  }
}
</style>
