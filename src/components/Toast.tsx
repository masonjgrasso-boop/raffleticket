import { useEffect } from 'react';

interface Props {
  message: string;
  type: 'success' | 'error';
  onDismiss: () => void;
}

export function Toast({ message, type, onDismiss }: Props) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div
      className={`fixed top-4 left-4 right-4 z-50 rounded-xl px-4 py-3 shadow-lg text-white text-sm font-medium flex items-center gap-2 ${
        type === 'success' ? 'bg-kc-green' : 'bg-red-500'
      }`}
    >
      <span>{type === 'success' ? '✓' : '✕'}</span>
      <span>{message}</span>
    </div>
  );
}
