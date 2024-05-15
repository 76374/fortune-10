<script setup lang="ts">
const props = defineProps<{ ticketNumber: number }>()
</script>

<template>
  <div class="ticket">{{ props.ticketNumber }}</div>
</template>

<style scoped>
.ticket {
  align-content: center;
  aspect-ratio: 442 / 228;
  background-image: url('/assets/img/ticket.png');
  background-repeat: no-repeat;
  background-size: contain;
  text-align: center;
  color: #240046;;
  font-weight: bold;
}
</style>
