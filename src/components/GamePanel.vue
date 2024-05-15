<script setup lang="ts">
import TheTicket from '@/components/TheTicket.vue';
import currencyFormat from '../services/format/currency-format';

const props = defineProps<{
  balance: number;
  selectedTicket: number;
}>();
</script>

<template>
  <div class="panel">
    <div class="balance">Balance: {{ currencyFormat(props.balance) }}</div>
    <div class="ticket-container">
      <Transition name="ticket">
        <TheTicket
          v-if="props.selectedTicket"
          class="ticket"
          :ticket-number="props.selectedTicket"
        />
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.panel {
  align-items: center;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: space-between;
  position: relative;
  height: 74px;

  .balance {
    margin-left: 16px;
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
