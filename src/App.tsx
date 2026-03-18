import { useState } from 'react';
import type { Screen } from './types/raffle';
import { BottomNav } from './components/BottomNav';
import { AssignTickets } from './screens/AssignTickets';
import { FindWinners } from './screens/FindWinners';
import { ViewAssignments } from './screens/ViewAssignments';
import { PinGate } from './screens/PinGate';
import { isPinVerified } from './utils/storage';

export default function App() {
  const [pinOk, setPinOk] = useState(isPinVerified);
  const [screen, setScreen] = useState<Screen>('assign');

  if (!pinOk) {
    return <PinGate onSuccess={() => setPinOk(true)} />;
  }

  return (
    <div className="flex flex-col min-h-dvh max-w-lg mx-auto">
      <header className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-3 shadow-sm">
        <img src="/kids-chance-logo.jpg" alt="Kids' Chance" className="h-10 w-auto" />
        <div>
          <p className="text-xs text-gray-500 leading-tight">Cornhole Tournament Raffle</p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        {screen === 'assign' && <AssignTickets />}
        {screen === 'find' && <FindWinners />}
        {screen === 'view' && <ViewAssignments />}
      </main>

      <BottomNav active={screen} onChange={setScreen} />
    </div>
  );
}
