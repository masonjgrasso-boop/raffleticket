import type { TicketAssignment } from '../types/raffle';

export function exportCSV(assignments: TicketAssignment[]): void {
  const header = 'Name,Start Ticket,End Ticket,Quantity,Timestamp';
  const rows = assignments.map((a) =>
    [
      `"${a.participantName.replace(/"/g, '""')}"`,
      a.startTicket,
      a.endTicket,
      a.quantity,
      a.timestamp.toISOString(),
    ].join(',')
  );
  const csv = [header, ...rows].join('\n');

  const date = new Date().toISOString().slice(0, 10);
  const filename = `raffle-assignments-${date}.csv`;

  // Use data URI — more reliable in iOS PWA standalone than Blob URLs
  const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  const link = document.createElement('a');
  link.setAttribute('href', dataUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
