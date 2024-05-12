// as there is no backend, a bit of fake logic pretending it exists

import type { BuyTicketRequest } from '@/dto/api';

const getApiClient = () => {
  let balance = 300;

  const endpoints: Record<string, Record<string, (data?: unknown) => Promise<unknown>>> = {
    '/init': {
      post: () => Promise.resolve({ balance, currency: 'euro', ticketPrice: 100 }),
    },
    '/round': {
      post: (data) => {
        const request = data as BuyTicketRequest;
        const ticketNumber =
          Math.random() > 0.6 ? request.ticketNumber : (Math.random() * 10 + 1) | 0;

        return Promise.resolve(
          ticketNumber === request.ticketNumber
            ? { ticketNumber, balance: (balance += 100), winAmount: 200 }
            : { ticketNumber,  balance: (balance -= 100), winAmount: 0 }
        );
      },
    },
  };

  return {
    call: <T>(path: string, method: string, data?: unknown) =>
      (endpoints[path]?.[method]?.(data) as Promise<T>) ?? Promise.reject('Not found'),
  };
};

export default getApiClient;
