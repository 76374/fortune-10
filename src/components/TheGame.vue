<script setup lang="ts">
import CanvasLayer from '@/components/CanvasLayer.vue';
import GamePanel from '@/components/GamePanel.vue';
import MachineDrum from '@/components/MachineDrum.vue';
import useGameStore from '@/composables/store';
import currencyFormat from '@/services/format/currency-format';
import TicketsPurchase from '@/components/TicketsPurchase.vue';
import { onMounted, ref, watch } from 'vue';

const gameStore = useGameStore();

const drumRef = ref<InstanceType<typeof MachineDrum> | null>(null);

watch(
  () => gameStore.state,
  (state) => {
    if (state === 'roundStart' && drumRef.value) {
      drumRef.value.spin();
    }
  }
);

const handleRoundAnimationComplete = () => {
  gameStore.setResult();
};

onMounted(() => {
  gameStore.init().then((result) => {
    currencyFormat.setCurrency(result.currency);
  });
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
      <TicketsPurchase v-if="gameStore.state === 'ticketsPurchase'" />
      <CanvasLayer />
    </div>
  </div>
</template>

<style scoped>
.game {
  border: 1px solid var(--primary-color);
  display: flex;
  flex-direction: column;
  height: 500px;
  width: 1200px;

  .game-area {
    position: relative;
    flex-grow: 1;
    text-align: center;
    align-content: center;
  }
}
</style>
