import { useState } from 'react';
import { useRaffleStore } from '../hooks/useRaffleStore';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { exportCSV } from '../utils/csvExport';

export function ViewAssignments() {
  const { state, clearRaffle } = useRaffleStore();
  const [showConfirm, setShowConfirm] = useState(false);

  const sorted = [...state.assignments].reverse();

  return (
    <div className="flex-1 p-4 pb-24">
      <ConfirmDialog
        isOpen={showConfirm}
        title="Start New Raffle?"
        message="This will permanently delete all current ticket assignments. This cannot be undone."
        onConfirm={() => { clearRaffle(); setShowConfirm(false); }}
        onCancel={() => setShowConfirm(false)}
      />

      <div className="max-w-md mx-auto mt-2 space-y-4">
        {/* Header bar */}
        <div className="flex items-center justify-between">
          <div className="bg-kc-blue text-white rounded-full px-4 py-1.5 text-sm font-semibold">
            {state.totalTicketsSold} tickets sold
          </div>
          {state.assignments.length > 0 && (
            <button
              onClick={() => exportCSV(state.assignments)}
              className="bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-full px-4 py-1.5 flex items-center gap-1.5"
            >
              <span>⬇️</span> Export CSV
            </button>
          )}
        </div>

        {/* Assignment list */}
        {sorted.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <img src="/kids-chance-logo.jpg" alt="Kids' Chance" className="h-16 w-auto mx-auto mb-3 rounded-xl" />
            <p className="text-sm">No tickets assigned yet.</p>
            <p className="text-sm">Go to the Assign tab to get started.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sorted.map((a) => (
              <div key={a.id} className="bg-white rounded-2xl shadow-sm p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{a.participantName}</p>
                    <p className="text-sm text-gray-500 font-mono mt-0.5">
                      {a.startTicket === a.endTicket
                        ? a.startTicket
                        : `${a.startTicket} – ${a.endTicket}`}
                    </p>
                  </div>
                  <span className="bg-kc-blue-light text-kc-blue text-xs font-bold rounded-full px-2.5 py-1 ml-2 whitespace-nowrap">
                    ×{a.quantity}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1.5">
                  {a.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            ))}
          </div>
        )}

        {state.assignments.length > 0 && (
          <button
            onClick={() => setShowConfirm(true)}
            className="w-full min-h-[44px] text-red-500 text-sm font-medium mt-2"
          >
            Start New Raffle
          </button>
        )}
      </div>
    </div>
  );
}
