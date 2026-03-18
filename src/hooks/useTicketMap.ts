import { useMemo } from 'react';
import type { TicketAssignment } from '../types/raffle';
import { buildTicketRange } from '../utils/ticketNumbers';

export function useTicketMap(assignments: TicketAssignment[]): Map<string, string> {
  return useMemo(() => {
    const map = new Map<string, string>();
    for (const assignment of assignments) {
      const tickets = buildTicketRange(assignment.startTicket, assignment.endTicket);
      for (const ticket of tickets) {
        map.set(ticket, assignment.id);
      }
    }
    return map;
  }, [assignments]);
}
