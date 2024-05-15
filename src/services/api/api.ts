
// a bit of fake logic pretending the server exists

const getApi = () => {
  let balance = 300;

  return {
    init: () => Promise.resolve({ balance, currency: 'euro', ticketPrice: 100 }),

    startRound: (ticketNumber: number) => {
      const randTicket = (Math.random() * 10 + 1) | 0;
      if (!ticketNumber) {
        return Promise.resolve({ ticketNumber: randTicket, balance, winAmount: 0 });
      }
      // make 50% win rate to make it playable
      const resultNumber = Math.random() > 0.6 ? ticketNumber : randTicket;

      return Promise.resolve(
        resultNumber === ticketNumber
          ? { ticketNumber: resultNumber, balance: (balance += 100), winAmount: 200 }
          : { ticketNumber: resultNumber, balance: (balance -= 100), winAmount: 0 }
      );
    },
  };
};

export default getApi;
