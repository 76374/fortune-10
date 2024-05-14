<script setup lang="ts">
import { gsap } from 'gsap';
import CustomEase from 'gsap/CustomEase';
import { ref } from 'vue';

const spinTime = 2;
const spinRotations = 2;
const ticketFlyTime = 0.8;

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
    gsap.to('.drum polygon', { rotation: 360 * spinRotations, duration: spinTime });
    gsap.from(
      '.result-ticket',
      {
        scale: 0,
        duration: ticketFlyTime,
        onComplete: () => emit('complete'),
        ease: 'power1.in',
      },
      '>'
    );
    gsap.from(
      '.result-ticket',
      {
        duration: ticketFlyTime,
        y: -5,
        ease: CustomEase.create('custom', '.3,-80,.51,90'),
        // ease: 'back.inOut',
        onComplete: () => emit('complete'),
      },
      '<'
    );
    ticketVisible.value = true;
  },
});
</script>

<template>
  <svg class="drum" height="140" width="140" xmlns="http://www.w3.org/2000/svg">
    <polygon points="140,70 105,131 35,131 0,70 35,9 105,9" style="fill: #2c3e50" />
  </svg>
  <div v-show="ticketVisible" class="result-ticket">{{ props.ticketNumber }}</div>
</template>

<style scoped>
.drum {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  polygon {
    transform-origin: 70px 61px;
  }
}

.result-ticket {
  /*background-color: #a9d6e5;
  border: 20px solid var(--primary-color);*/
  background-image: url("img/ticket.png");
  background-repeat: no-repeat;
  background-size: contain;

  position: absolute;
  width: 442px;
  height: 228px;
  text-align: center;
  align-content: center;
  font-size: 6em;
  color: #240046;;
  font-weight: bold;
  top: 100px;
  left: 50%;
  transform: translate(-50%, 0);
}
</style>
