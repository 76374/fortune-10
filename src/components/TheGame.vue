<script setup lang="ts">
import CanvasLayer, { CanvasState } from '@/components/CanvasLayer.vue';
import GamePanel from '@/components/GamePanel.vue';
import MachineDrum from '@/components/MachineDrum.vue';
import TicketsPurchase from '@/components/TicketsPurchase.vue';
import getGameStore from '@/store/game-store';
import { computed, onMounted, ref, watch } from 'vue';

const gameStore = getGameStore();

const drumRef = ref<InstanceType<typeof MachineDrum> | null>(null);

const canvasState = computed<CanvasState>(() => {
  console.log(gameStore.state, gameStore.prevState)
  return gameStore.state === 'roundReady' && gameStore.prevState === 'win'
    ? 'win'
    : gameStore.state === 'win' || gameStore.state === 'lose'
      ? gameStore.state
      : 'none'
});

watch(
  () => gameStore.state,
  (state, prevState) => {
    if (state === 'roundStart' || (state === 'resultsReady' && prevState === 'ticketSelected')) {
      drumRef.value?.spin();
    } else if (state === 'ticketsPurchase') {
      drumRef.value?.hideTicket();
    }
  }
);

onMounted(() => {
  gameStore.init();
});
</script>

<template>
  <div class="game">
    <GamePanel
      :balance="gameStore.balance"
      :selected-ticket="gameStore.selectedTicket"
      :show-select-ticket="gameStore.state === 'roundReady'"
      @purchase-clicked="gameStore.purchaseTickets()"
    />
    <div class="game-area">
      <MachineDrum
        ref="drumRef"
        :ticket-number="gameStore.resultTicketNumber"
        @complete="gameStore.setResult()"
      />
      <CanvasLayer
        :state="canvasState"
        :win-amount="gameStore.winAmount"
        @animation-completed="gameStore.setReady()"
      />
      <Transition name="tickets">
        <TicketsPurchase
          v-if="gameStore.state === 'ticketsPurchase' || gameStore.state === 'ticketSelected'"
          :ticket-price="gameStore.ticketPrice"
          @selected="gameStore.buyTicket($event)"
          @completed="gameStore.setRoundStart()"
        />
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.game {
  background: rgb(48, 0, 74);
  background: linear-gradient(
    90deg,
    rgba(48, 0, 74, 1) 0%,
    rgba(192, 76, 197, 1) 45%,
    rgba(48, 0, 74, 1) 100%
  );
  border: 1px solid var(--primary-color);
  display: flex;
  flex-direction: column;
  height: 500px;
  min-width: 342px;
  width: min(99vw, 1200px);

  .game-area {
    align-content: center;
    flex-grow: 1;
    position: relative;
    text-align: center;
  }
}

@media (max-width: 756px) {
  .game {
    height: 99vh;
  }
}

.tickets-enter-active,
.tickets-leave-active {
  transition: opacity 0.3s ease;
}

.tickets-enter-from,
.tickets-leave-to {
  opacity: 0;
}
</style>
