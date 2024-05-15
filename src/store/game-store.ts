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
  | 'win'
  | 'lose';

export type GameStore = Omit<Readonly<ReturnType<typeof getGameStore>>, 'setState'>;

const getGameStore = () => reactive({
  state: 'none' as GameState,
  prevState: 'none' as GameState,
  balance: 0,
  ticketPrice: 0,
  selectedTicket: 0,
  postRoundBalance: 0,
  winAmount: 0,
  resultTicketNumber: 0,

  setState(value: GameState) {
    this.prevState = this.state;
    this.state = value;
  },

  init() {
    return api.init().then((result) => {
      currencyFormat.setCurrency(result.currency);

      this.balance = result.balance;
      this.ticketPrice = result.ticketPrice;
      this.setState('roundReady');

      return result;
    });
  },

  purchaseTickets() {
    this.selectedTicket = 0;
    this.setState('ticketsPurchase');
  },

  buyTicket(ticketNumber: number) {
    this.selectedTicket = ticketNumber;
    this.postRoundBalance = 0;
    this.winAmount = 0;
    this.resultTicketNumber = 0;
    if (ticketNumber) {
      this.balance -= this.ticketPrice;
    }
    this.setState('ticketSelected');

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
    this.state = this.winAmount ? 'win' : 'lose';
    this.balance = this.postRoundBalance;
  },

  setReady() {
    this.setState('roundReady');
  },
});

export default getGameStore as () => GameStore;
