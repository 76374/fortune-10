import type { GameStore } from '@/store/game-store';
import { inject } from 'vue';

const useGameStore = () => {
  const store = inject<GameStore>('gameStore');
  if (!store) {
    throw new Error('Stores are supposed to be used within StoreProvider');
  }
  return store;
};

export default useGameStore;
