<script setup lang="ts">
import TheTicket from '@/components/TheTicket.vue';
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
    <div class="ticket-container">
      <Transition name="ticket">
        <TheTicket
          v-if="gameStore.selectedTicket"
          class="ticket"
          :ticket-number="gameStore.selectedTicket"
        />
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.panel {
  align-items: center;
  display: flex;
  justify-content: space-between;
  position: relative;
  height: 74px;

  .balance {
    margin-left: 16px;
  }

  .buy-bt {
    margin: 4px;
    font-size: 1.4em;
    padding: 4px 32px;
  }

  .ticket-container {
    min-width: 170px;
    height: 100%;

    .ticket {
      font-size: 1.5em;
      margin: 8px 8px 8px auto;
      width: 110px;
    }
  }
}

@media (max-width: 764px) {
  .panel {
    .buy-bt {
      left: 50%;
      position: absolute;
      top: 78px;
      transform: translate(-50%, 0);
      z-index: 1;
    }
  }
}

.ticket-enter-active,
.ticket-leave-active {
  transition: all 0.4s ease;
  transform: scale(1);
}

.ticket-enter-from,
.ticket-leave-to {
  transform: scale(0);
}
</style>
