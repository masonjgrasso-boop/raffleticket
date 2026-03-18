import { useState } from 'react';
import type { RaffleState, TicketAssignment } from '../types/raffle';
import { padTicket, parseTicket } from '../utils/ticketNumbers';
import { loadState, saveState, clearState } from '../utils/storage';

const DEFAULT_STATE: RaffleState = {
  assignments: [],
  nextTicketNumber: '',
  totalTicketsSold: 0,
};

// Shared state module (singleton pattern without context)
let _state: RaffleState = loadState() ?? { ...DEFAULT_STATE };
const _listeners: Array<() => void> = [];

function notify() {
  _listeners.forEach((fn) => fn());
}

export function useRaffleStore() {
  const [, rerender] = useState(0);

  // Subscribe on mount, unsubscribe on unmount
  useState(() => {
    const fn = () => rerender((n) => n + 1);
    _listeners.push(fn);
    return () => {
      const idx = _listeners.indexOf(fn);
      if (idx >= 0) _listeners.splice(idx, 1);
    };
  });

  function setStartingTicket(ticket: string) {
    if (_state.assignments.length > 0) return;
    _state = { ..._state, nextTicketNumber: ticket };
    saveState(_state);
    notify();
  }

  function addAssignment(name: string, quantity: number) {
    const startNum = parseTicket(_state.nextTicketNumber);
    if (startNum < 0) return;
    const endNum = startNum + quantity - 1;
    const assignment: TicketAssignment = {
      id: crypto.randomUUID(),
      participantName: name.trim(),
      startTicket: padTicket(startNum),
      endTicket: padTicket(endNum),
      quantity,
      timestamp: new Date(),
    };
    _state = {
      assignments: [..._state.assignments, assignment],
      nextTicketNumber: padTicket(endNum + 1),
      totalTicketsSold: _state.totalTicketsSold + quantity,
    };
    saveState(_state);
    notify();
  }

  function clearRaffle() {
    _state = { ...DEFAULT_STATE };
    clearState();
    notify();
  }

  return {
    state: _state,
    setStartingTicket,
    addAssignment,
    clearRaffle,
  };
}
