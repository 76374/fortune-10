<script setup lang="ts">
import useGameStore from '@/composables/store';
import { gsap } from 'gsap';
import currencyFormat from '../services/format/currency-format';

const gameStore = useGameStore();

const handleTicketClick = (ticketNumber: number) => {
  gameStore.buyTicket(ticketNumber);
  gsap.to(`.ticket:nth-child(${ticketNumber})`, {
    scale: 0,
    alpha: 0,
    duration: 0.4,
    onComplete: () => {
      gameStore.setRoundStart();
    },
  });
};
</script>

<template>
  <div class="tickets-purchase">
    <div class="title">
      <div>Select a ticket</div>
      <div>Ticket cost: {{ currencyFormat(gameStore.ticketPrice) }}</div>
    </div>
    <div class="container">
      <div v-for="i in 10" :key="`ticket-${i}`" class="ticket" @click="handleTicketClick(i)">
        {{ i }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.tickets-purchase {
  background-color: #f2f2f2;
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;

  .title {
    text-align: center;

    div:first-child {
      font-size: 2em;
      font-weight: bold;
    }
  }

  .container {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(2, 110px);
    padding: 32px;
    column-gap: 10px;
    row-gap: 15px;

    .ticket {
      /* background-color: var(--primary-color); */
      background-image: url('img/ticket.png');
      background-size: contain;
      background-repeat: no-repeat;
      color: #240046;
      text-align: center;
      font-size: 2em;
      font-weight: bold;
      cursor: pointer;
      align-content: center;
    }
  }
}
</style>
