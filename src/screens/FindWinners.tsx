import { useState } from 'react';
import { useRaffleStore } from '../hooks/useRaffleStore';
import { useTicketMap } from '../hooks/useTicketMap';
import { padTicket, parseTicket } from '../utils/ticketNumbers';

interface Result {
  ticket: string;
  name: string | null;
  range: string | null;
}

export function FindWinners() {
  const { state } = useRaffleStore();
  const ticketMap = useTicketMap(state.assignments);
  const [input, setInput] = useState('');
  const [results, setResults] = useState<Result[]>([]);

  const handleLookup = () => {
    const tokens = input
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (tokens.length === 0) return;

    const found = tokens.map((token): Result => {
      // Normalize: pad if it looks like a plain number
      const n = parseTicket(token);
      const normalized = n >= 0 ? padTicket(n) : token;
      const assignmentId = ticketMap.get(normalized);
      if (!assignmentId) {
        return { ticket: normalized, name: null, range: null };
      }
      const assignment = state.assignments.find((a) => a.id === assignmentId)!;
      const range =
        assignment.startTicket === assignment.endTicket
          ? assignment.startTicket
          : `${assignment.startTicket} – ${assignment.endTicket}`;
      return { ticket: normalized, name: assignment.participantName, range };
    });

    setResults(found);
  };

  return (
    <div className="flex-1 p-4 pb-24">
      <div className="max-w-md mx-auto space-y-4 mt-2">
        <div className="bg-white rounded-2xl shadow-sm p-5 space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Enter Winning Ticket Number(s)
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={3}
            placeholder="Enter ticket numbers, e.g. 0008156, 0008200"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-kc-blue resize-none"
          />
          <button
            onClick={handleLookup}
            className="w-full min-h-[48px] bg-kc-blue text-white font-semibold rounded-xl"
          >
            Look Up Winner
          </button>
        </div>

        {results.length > 0 && (
          <div className="space-y-3">
            {results.map((r, i) => (
              <div
                key={i}
                className={`rounded-2xl p-4 ${
                  r.name
                    ? 'bg-kc-green-light border border-kc-green/30'
                    : 'bg-amber-50 border border-amber-200'
                }`}
              >
                {r.name ? (
                  <>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-kc-green text-lg">🏆</span>
                      <span className="font-bold text-gray-900 text-lg">{r.name}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Ticket <span className="font-mono font-semibold">{r.ticket}</span>
                      {r.range && r.range !== r.ticket && (
                        <> · Range: <span className="font-mono">{r.range}</span></>
                      )}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-amber-500 text-lg">⚠️</span>
                      <span className="font-semibold text-gray-800">Not Found</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Ticket <span className="font-mono font-semibold">{r.ticket}</span> — not assigned
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {state.assignments.length === 0 && (
          <p className="text-center text-gray-400 text-sm mt-8">
            No tickets assigned yet. Go to the Assign tab to get started.
          </p>
        )}
      </div>
    </div>
  );
}
