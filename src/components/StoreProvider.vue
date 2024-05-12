<script setup lang="ts">
import gameState from '@/store/game-state';
import { provide } from 'vue';

provide('gameStore', gameState);
</script>

<template>
  <slot />
</template>

<style scoped></style>
