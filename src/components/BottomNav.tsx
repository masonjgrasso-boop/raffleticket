import type { Screen } from '../types/raffle';

interface Props {
  active: Screen;
  onChange: (screen: Screen) => void;
}

const tabs: { id: Screen; label: string; icon: string }[] = [
  { id: 'assign', label: 'Assign', icon: '🎟️' },
  { id: 'find', label: 'Find Winner', icon: '🔍' },
  { id: 'view', label: 'All Tickets', icon: '📋' },
];

export function BottomNav({ active, onChange }: Props) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex-1 flex flex-col items-center justify-center min-h-[56px] gap-0.5 text-xs font-medium transition-colors ${
            active === tab.id
              ? 'text-kc-blue border-t-2 border-kc-blue -mt-px'
              : 'text-gray-500'
          }`}
        >
          <span className="text-lg leading-none">{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
