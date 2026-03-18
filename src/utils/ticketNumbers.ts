export function padTicket(n: number): string {
  return String(n).padStart(7, '0');
}

export function parseTicket(s: string): number {
  const n = parseInt(s, 10);
  if (isNaN(n)) return -1;
  return n;
}

export function buildTicketRange(start: string, end: string): string[] {
  const s = parseTicket(start);
  const e = parseTicket(end);
  if (s < 0 || e < 0 || e < s) return [];
  const result: string[] = [];
  for (let i = s; i <= e; i++) {
    result.push(padTicket(i));
  }
  return result;
}
