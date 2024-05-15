<script setup lang="ts">
import CanvasLayer from '@/components/CanvasLayer.vue';
import GamePanel from '@/components/GamePanel.vue';
import MachineDrum from '@/components/MachineDrum.vue';
import TicketsPurchase from '@/components/TicketsPurchase.vue';
import useGameStore from '@/composables/store';
import { onMounted, ref, watch } from 'vue';

const gameStore = useGameStore();

const drumRef = ref<InstanceType<typeof MachineDrum> | null>(null);

watch(
  () => gameStore.state,
  (state, prevState) => {
    if (
      drumRef.value &&
      (state === 'roundStart' || (state === 'resultsReady' && prevState === 'ticketSelected'))
    ) {
      drumRef.value.spin();
    }
  }
);

const handleRoundAnimationComplete = () => {
  gameStore.setResult();
};

onMounted(() => {
  gameStore.init();
});
</script>

<template>
  <div class="game">
    <GamePanel />
    <div class="game-area">
      <MachineDrum
        ref="drumRef"
        :ticket-number="gameStore.resultTicketNumber"
        @complete="handleRoundAnimationComplete"
      />
      <CanvasLayer />
      <Transition name="tickets">
        <TicketsPurchase v-if="gameStore.state === 'ticketsPurchase' || gameStore.state === 'ticketSelected'" />
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.game {
  background: rgb(48,0,74);
  background: linear-gradient(90deg, rgba(48,0,74,1) 0%, rgba(192,76,197,1) 45%, rgba(48,0,74,1) 100%);
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
