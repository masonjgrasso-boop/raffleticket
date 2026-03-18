export interface TicketAssignment {
  id: string;
  participantName: string;
  startTicket: string;
  endTicket: string;
  quantity: number;
  timestamp: Date;
}

export interface RaffleState {
  assignments: TicketAssignment[];
  nextTicketNumber: string; // empty string = not yet set
  totalTicketsSold: number;
}

export type Screen = 'assign' | 'find' | 'view';
