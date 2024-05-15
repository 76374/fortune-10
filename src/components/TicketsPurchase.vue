<script setup lang="ts">
import TheTicket from '@/components/TheTicket.vue';
import { gsap } from 'gsap';
import { ref } from 'vue';
import currencyFormat from '../services/format/currency-format';

const props = defineProps<{ ticketPrice: number }>();

const emit = defineEmits<{
  (e: 'completed'): void;
  (e: 'selected', ticketNumber: number): void;
}>();

const timeLeft = ref(15);

const intervalId = setInterval(() => {
  timeLeft.value--;

  if (timeLeft.value < 0) {
    clearInterval(intervalId);
    timeLeft.value = 0;

    emit('selected', 0);
    emit('completed');
  }
}, 1000);

const handleTicketClick = (ticketNumber: number) => {
  clearInterval(intervalId);

  emit('selected', ticketNumber);

  gsap.to(`.ticket:nth-child(${ticketNumber})`, {
    scale: 0,
    alpha: 0,
    duration: 0.4,
    onComplete: () => {
      emit('completed');
    },
  });
};
</script>

<template>
  <div class="tickets-purchase">
    <div class="title">
      <div>Select a ticket</div>
      <div>Ticket cost: {{ currencyFormat(props.ticketPrice) }}</div>
      <div class="timer">{{ timeLeft }}</div>
    </div>
    <div class="container">
      <TheTicket
        v-for="i in 10"
        :key="`ticket-${i}`"
        class="ticket"
        :ticket-number="i"
        @click="handleTicketClick(i)"
      />
    </div>
  </div>
</template>

<style scoped>
.tickets-purchase {
  background-color: rgba(0, 0, 0, 0.2);
  position: absolute;
  top: 0;
  width: 100%;

  .title {
    position: relative;
    text-align: center;

    div:first-child {
      font-size: 2em;
      font-weight: bold;
    }

    .timer {
      font-size: 2em;
      font-weight: bold;
      position: absolute;
      right: 16px;
      top: 48px;
    }
  }

  .container {
    column-gap: 10px;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(2, 1fr);
    padding: 32px;
    row-gap: 15px;
  }

  .ticket {
    cursor: pointer;
    font-size: 2em;
  }

  @media (orientation: portrait) {
    .container {
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(4, 1fr);
      padding: 32px;
    }
  }

  @media (max-height: 420px) and (orientation: landscape) {
    .container {
      padding: 0 32px;
      .ticket {
        font-size: 1.5em;
      }
    }
  }

  @media (max-width: 560px) and (orientation: portrait) {
    .container {
      grid-template-rows: repeat(5, 1fr);
      grid-template-columns: repeat(2, 1fr);
    }
  }
}
</style>
