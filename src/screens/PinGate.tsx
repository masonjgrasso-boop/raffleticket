import { useState, useRef, useEffect } from 'react';
import { RAFFLE_PIN } from '../utils/pin';
import { setPinVerified } from '../utils/storage';

interface PinGateProps {
  onSuccess: () => void;
}

export function PinGate({ onSuccess }: PinGateProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleUnlock() {
    if (pin === RAFFLE_PIN) {
      setPinVerified();
      onSuccess();
    } else {
      setError(true);
      setShake(true);
      setPin('');
      setTimeout(() => setShake(false), 500);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleUnlock();
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-gray-50 px-4">
      <div
        className={`w-full max-w-sm bg-white rounded-2xl shadow-lg overflow-hidden ${shake ? 'animate-shake' : ''}`}
      >
        <div className="bg-white border-b border-gray-200 px-6 py-5 text-center flex flex-col items-center gap-2">
          <img src="/kids-chance-logo.jpg" alt="Kids' Chance" className="h-14 w-auto rounded-xl" />
          <p className="text-sm text-gray-500">Volunteer Access</p>
        </div>

        <div className="px-6 py-8 flex flex-col gap-4">
          <label className="text-sm font-medium text-gray-700 text-center">Enter PIN to continue</label>

          <input
            ref={inputRef}
            type="password"
            inputMode="numeric"
            maxLength={6}
            value={pin}
            onChange={e => {
              setError(false);
              setPin(e.target.value.replace(/\D/g, ''));
            }}
            onKeyDown={handleKeyDown}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-kc-blue"
            placeholder="••••"
          />

          {error && (
            <p className="text-red-500 text-sm text-center">Incorrect PIN. Please try again.</p>
          )}

          <button
            onClick={handleUnlock}
            className="w-full bg-kc-blue text-white font-semibold py-3 rounded-xl hover:bg-blue-700 active:scale-95 transition"
          >
            Unlock
          </button>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
        .animate-shake { animation: shake 0.5s ease; }
      `}</style>
    </div>
  );
}
