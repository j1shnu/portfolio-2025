import { Terminal } from 'lucide-react';

interface TerminalButtonProps {
  readonly onClick: () => void;
}

export default function TerminalButton({ onClick }: TerminalButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-4 lg:bottom-6 lg:right-6 z-40 bg-gray-800 hover:bg-gray-700 text-emerald-400 p-3 rounded-full shadow-lg border border-gray-700 hover:border-emerald-400/50 transition-all duration-300 group"
      aria-label="Open terminal"
      title="Open Terminal"
    >
      <Terminal size={22} className="group-hover:scale-110 transition-transform" />
    </button>
  );
}
