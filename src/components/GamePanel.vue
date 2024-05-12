<script setup lang="ts">
import useGameStore from '@/composables/store';
import currencyFormat from '../services/format/currency-format';

const gameStore = useGameStore();

const handleTicketPurchase = () => {
  gameStore.purchaseTickets();
};
</script>

<template>
  <div class="panel">
    <div class="balance">Balance: {{ currencyFormat(gameStore.balance) }}</div>
    <button v-if="gameStore.state === 'roundReady'" class="buy-bt" @click="handleTicketPurchase">
      BUY TICKET
    </button>
  </div>
</template>

<style scoped>
.panel {
  position: relative;

  .balance {
    margin-left: 8px;
  }

  .buy-bt {
    position: absolute;
    left: 50%;
    top: 8px;
    transform: translate(-50%, 0);
    font-size: 1.5em;
    z-index: 1;
  }
}
</style>
