import { useState } from 'react';
import type { Screen } from './types/raffle';
import { BottomNav } from './components/BottomNav';
import { AssignTickets } from './screens/AssignTickets';
import { FindWinners } from './screens/FindWinners';
import { ViewAssignments } from './screens/ViewAssignments';

export default function App() {
  const [screen, setScreen] = useState<Screen>('assign');

  return (
    <div className="flex flex-col min-h-dvh max-w-lg mx-auto">
      <header className="bg-kc-blue text-white px-4 py-3 flex items-center gap-3 shadow-sm">
        <span className="text-2xl">🎟️</span>
        <div>
          <h1 className="font-bold text-base leading-tight">Kids' Chance Raffle</h1>
          <p className="text-xs text-blue-200 leading-tight">Cornhole Tournament</p>
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
