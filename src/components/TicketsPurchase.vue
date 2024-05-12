<script setup lang="ts">
import useGameStore from '@/composables/store';
import currencyFormat from '../services/format/currency-format';

const gameStore = useGameStore();
</script>

<template>
  <div class="tickets-purchase">
    <div class="title">
      <div>Select a ticket</div>
      <div>Ticket cost: {{ currencyFormat(gameStore.ticketPrice) }}</div>
    </div>
    <div class="container">
      <div
        v-for="i in 10"
        :key="`ticket-${i}`"
        class="ticket"
        @click="() => gameStore.buyTicket(i)"
      >
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
    grid-template-rows: repeat(2, 1fr);
    padding: 32px;
    column-gap: 10px;
    row-gap: 15px;

    .ticket {
      background-color: var(--primary-color);
      color: #f2f2f2;
      text-align: center;
      font-size: 2em;
      cursor: pointer;
    }
  }
}
</style>
