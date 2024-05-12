import type { BuyTicketResponse, InitResponse } from '@/dto/api';
import type { ApiClient } from '@/services/api/types';

const getApi = (apiClient: ApiClient) => ({
  init: () => apiClient.call<InitResponse>('/init', 'post'),
  startRound: (ticketNumber: number) =>
    apiClient.call<BuyTicketResponse>('/round', 'post', { ticketNumber }),
});

export default getApi;
