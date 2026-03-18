import type { RaffleState } from '../types/raffle';

const PIN_KEY = 'kc_pin_ok';
export function isPinVerified(): boolean {
  return localStorage.getItem(PIN_KEY) === '1';
}
export function setPinVerified(): void {
  localStorage.setItem(PIN_KEY, '1');
}
export function clearPin(): void {
  localStorage.removeItem(PIN_KEY);
}

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
