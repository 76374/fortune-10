import api from '@/services/api';
import currencyFormat from '@/services/format/currency-format';
import { reactive } from 'vue';

export type GameState =
  | 'none'
  | 'roundReady'
  | 'ticketsPurchase'
  | 'ticketSelected'
  | 'roundStart'
  | 'resultsReady'
  | 'win';

export type GameStore = Readonly<typeof gameStore>;

const gameStore = reactive({
  state: 'none' as GameState,
  balance: 0,
  ticketPrice: 0,
  selectedTicket: 0,
  postRoundBalance: 0,
  winAmount: 0,
  resultTicketNumber: 0,

  init() {
    return api.init().then((result) => {
      currencyFormat.setCurrency(result.currency);

      this.balance = result.balance;
      this.ticketPrice = result.ticketPrice;
      this.state = 'roundReady';

      return result;
    });
  },

  purchaseTickets() {
    this.selectedTicket = 0;
    this.state = 'ticketsPurchase';
  },

  buyTicket(ticketNumber: number) {
    this.selectedTicket = ticketNumber;
    this.postRoundBalance = 0;
    this.winAmount = 0;
    this.resultTicketNumber = 0;
    this.balance -= this.ticketPrice;
    this.state = 'ticketSelected';

    return api.startRound(ticketNumber).then((result) => {
      this.postRoundBalance = result.balance;
      this.winAmount = result.winAmount;
      this.resultTicketNumber = result.ticketNumber;

      return result;
    });
  },

  setRoundStart() {
    this.state = this.resultTicketNumber ? 'resultsReady' : 'roundStart';
  },

  setResult() {
    this.state = this.winAmount ? 'win' : 'roundReady';
    this.balance = this.postRoundBalance;
  },

  setReady() {
    this.state = 'roundReady';
  },
});

export default gameStore;
