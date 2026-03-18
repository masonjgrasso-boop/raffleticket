import type { RaffleState } from '../types/raffle';

const KEY = 'kc_raffle_state';

export function loadState(): RaffleState | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Rehydrate timestamps
    parsed.assignments = parsed.assignments.map((a: any) => ({
      ...a,
      timestamp: new Date(a.timestamp),
    }));
    return parsed as RaffleState;
  } catch {
    return null;
  }
}

export function saveState(state: RaffleState): void {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function clearState(): void {
  localStorage.removeItem(KEY);
}
