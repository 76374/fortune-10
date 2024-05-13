<script setup lang="ts">
import useGameStore from '@/composables/store';
import gameState, { GameState } from "@/store/game-state";
import { watch } from "vue";
import currencyFormat from '../services/format/currency-format';

const gameStore = useGameStore();

// watch(
//   () => gameStore.state,
//   (state) => {
//   }
// );

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
    <Transition name="ticket">
      <div v-if="gameStore.selectedTicket" class="ticket" >
        {{ gameStore.selectedTicket }}
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.panel {
  position: relative;
  display: flex;
  justify-content: space-between;
  height: 74px;

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

  .ticket {
    margin: 8px;
    background-image: url('img/ticket.png');
    background-size: contain;
    background-repeat: no-repeat;
    color: #240046;
    text-align: center;
    font-size: 1.5em;
    font-weight: bold;
    align-content: center;
    width: 110px;
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
