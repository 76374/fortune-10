export type InitResponse = {
  currency: string;
  balance: number;
  ticketPrice: number;
}

export type BuyTicketRequest = {
  ticketNumber: number;
}

export type BuyTicketResponse = {
  ticketNumber: number;
  balance: number;
  winAmount: number;
}
