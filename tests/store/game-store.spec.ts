import { beforeEach, describe, expect, it, vi } from "vitest";
import getGameStore, { GameStore } from '../../src/store/game-store';

vi.mock('@/services/api', () => ({
  default: {
    init: () => Promise.resolve({ balance: 300, currency: 'euro', ticketPrice: 100 }),

    startRound: () =>
      Promise.resolve({ ticketNumber: 4, balance: 400, winAmount: 200 }),
  },
}));

describe('game-store', () => {
  let store: GameStore;
  beforeEach(() => {
    store = getGameStore();
  });

  it('should do initialization', async () => {
    expect(store.state).toBe('none');
    await store.init();
    expect(store.state).toBe('roundReady');
    expect(store.balance).toBe(300);
    expect(store.ticketPrice).toBe(100);
  });

  it('should purchase tickets', async () => {
    await store.init();
    store.setPurchaseTickets();
    expect(store.state).toBe('ticketsPurchase');
    await store.buyTicket(4);
    expect(store.state).toBe('ticketSelected');
  })

  it('should have correct win values', async () => {
    await store.init();
    store.setPurchaseTickets();
    await store.buyTicket(4);
    expect(store.winAmount).toBe(200);
    expect(store.balance).toBe(200);
    expect(store.resultTicketNumber).toBe(4);
    store.setResult();
    expect(store.state).toBe('win');
    expect(store.balance).toBe(400);
  })
});
