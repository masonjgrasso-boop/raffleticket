import { useState, useRef, useCallback } from 'react';
import { useRaffleStore } from '../hooks/useRaffleStore';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Toast } from '../components/Toast';
import { padTicket, parseTicket } from '../utils/ticketNumbers';

export function AssignTickets() {
  const { state, setStartingTicket, addAssignment, clearRaffle } = useRaffleStore();

  const [startInput, setStartInput] = useState('');
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [showConfirm, setShowConfirm] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  const isSetup = state.assignments.length === 0 && !state.nextTicketNumber;

  const handleSetStart = () => {
    const n = parseTicket(startInput.trim());
    if (n < 0) {
      setToast({ message: 'Please enter a valid ticket number', type: 'error' });
      return;
    }
    setStartingTicket(padTicket(n));
    setStartInput('');
  };

  const previewStart = state.nextTicketNumber;
  const qty = parseInt(quantity, 10) || 1;
  const previewEnd = previewStart
    ? padTicket(parseTicket(previewStart) + qty - 1)
    : '';

  const handleAssign = () => {
    if (!name.trim()) {
      setToast({ message: 'Please enter a participant name', type: 'error' });
      return;
    }
    if (qty < 1) {
      setToast({ message: 'Quantity must be at least 1', type: 'error' });
      return;
    }
    addAssignment(name, qty);
    setToast({ message: `Assigned ${qty} ticket${qty > 1 ? 's' : ''} to ${name.trim()}`, type: 'success' });
    setName('');
    setQuantity('1');
    setTimeout(() => nameRef.current?.focus(), 50);
  };

  const dismissToast = useCallback(() => setToast(null), []);

  if (isSetup) {
    return (
      <div className="flex-1 p-4 pb-24">
        {toast && <Toast {...toast} onDismiss={dismissToast} />}
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-sm p-6 mt-4">
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">🎟️</div>
              <h1 className="text-xl font-bold text-kc-blue">Kids' Chance Raffle</h1>
              <p className="text-gray-500 text-sm mt-1">Set the starting ticket number to begin</p>
            </div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Starting Ticket Number
            </label>
            <input
              type="number"
              inputMode="numeric"
              value={startInput}
              onChange={(e) => setStartInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSetStart()}
              placeholder="e.g. 1000000"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-kc-blue mb-4"
            />
            <button
              onClick={handleSetStart}
              className="w-full min-h-[48px] bg-kc-blue text-white font-semibold rounded-xl"
            >
              Start Raffle
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 pb-24">
      {toast && <Toast {...toast} onDismiss={dismissToast} />}
      <ConfirmDialog
        isOpen={showConfirm}
        title="Start New Raffle?"
        message="This will permanently delete all current ticket assignments. This cannot be undone."
        onConfirm={() => { clearRaffle(); setShowConfirm(false); }}
        onCancel={() => setShowConfirm(false)}
      />

      <div className="max-w-md mx-auto space-y-4 mt-2">
        {/* Next ticket preview */}
        <div className="bg-kc-blue-light rounded-2xl p-4 text-center">
          <p className="text-xs text-kc-blue font-medium uppercase tracking-wide">Next ticket starts at</p>
          <p className="text-3xl font-bold text-kc-blue mt-1">{state.nextTicketNumber}</p>
        </div>

        {/* Assign form */}
        <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Participant Name</label>
            <input
              ref={nameRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAssign()}
              placeholder="Full name"
              autoComplete="off"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-kc-blue"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Tickets</label>
            <input
              type="number"
              inputMode="numeric"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-kc-blue"
            />
          </div>

          {/* Range preview */}
          {previewStart && (
            <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-600">
              Tickets: <span className="font-mono font-semibold text-gray-900">{previewStart}</span>
              {qty > 1 && (
                <> — <span className="font-mono font-semibold text-gray-900">{previewEnd}</span></>
              )}
            </div>
          )}

          <button
            onClick={handleAssign}
            className="w-full min-h-[48px] bg-kc-green text-white font-semibold rounded-xl"
          >
            Assign Tickets
          </button>
        </div>

        <button
          onClick={() => setShowConfirm(true)}
          className="w-full min-h-[44px] text-red-500 text-sm font-medium"
        >
          Start New Raffle
        </button>
      </div>
    </div>
  );
}
