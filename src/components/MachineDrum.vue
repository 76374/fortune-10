<script setup lang="ts">
import TheTicket from '@/components/TheTicket.vue';
import useGameStore from '@/composables/store';
import { gsap } from 'gsap';
// import CustomEase from 'gsap/CustomEase';
import { computed, ref, watch } from 'vue';

const spinTime = 2;
const spinRotations = 2;
const ticketFlyTime = 0.8;

const props = defineProps<{
  ticketNumber: number;
}>();

const emit = defineEmits<{
  (e: 'complete'): void;
}>();

const gameStore = useGameStore();

const ticketVisible = computed(
  () => gameStore.state !== 'ticketsPurchase' && gameStore.state !== 'ticketSelected'
);

defineExpose({
  spin: () => {
    gsap.set('.drum polygon', { rotation: 0 });
    gsap.to('.drum polygon', { rotation: 360 * spinRotations, duration: spinTime });
    gsap.from(
      '.result-ticket',
      {
        scale: 0,
        rotation: 360 * 3,

        y: -200,
        alpha: 0,
        duration: ticketFlyTime,
        // ease: 'power1.in',

        onComplete: () => emit('complete'),
      },
      '>'
    );
    // gsap.from(
    //   '.result-ticket',
    //   {
    //     duration: ticketFlyTime,
    //     // y: -5,
    //     // ease: CustomEase.create('custom', '.3,-80,.51,90'),
    //     // ease: 'back.inOut',
    //
    //     onComplete: () => emit('complete'),
    //   },
    //   '<'
    // );
    ticketVisible.value = true;
  },
});
</script>

<template>
  <svg class="drum" height="200" width="160" xmlns="http://www.w3.org/2000/svg">
    <polygon
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
  <TheTicket v-show="ticketVisible" class="result-ticket" :ticket-number="props.ticketNumber" />
</template>

<style scoped>
.drum {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(1.4);

  polygon {
    transform-origin: 70px 61px;
  }
}

.result-ticket {
  position: absolute;
  width: min(442px, calc(100vw - 16px));
  height: min(228px, calc((100vw - 16px) * 0.516));
  font-size: 6em;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
