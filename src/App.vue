<script setup lang="ts">
import StoreProvider from "@/components/StoreProvider.vue";
import TheGame from "@/components/TheGame.vue";
</script>

<template>
  <main>
    <StoreProvider>
      <TheGame />
    </StoreProvider>
  </main>
</template>

<style scoped>
</style>
