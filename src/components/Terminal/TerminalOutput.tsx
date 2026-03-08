import { useEffect, useRef } from 'react';
import { TerminalLine } from './types';
import { PROMPT } from './constants';

interface TerminalOutputProps {
  readonly lines: readonly TerminalLine[];
}

function LineContent({ line }: { readonly line: TerminalLine }) {
  switch (line.type) {
    case 'input':
      return (
        <div className="flex">
          <span className="text-emerald-400 shrink-0 whitespace-pre">{PROMPT}</span>
          <span className="text-gray-200">{line.content}</span>
        </div>
      );
    case 'error':
      return <div className="text-red-400">{line.content}</div>;
    case 'system':
      return <div className="text-amber-400">{line.content}</div>;
    case 'output':
      return (
        <div className="text-gray-300 whitespace-pre-wrap break-words">
          {line.content}
        </div>
      );
  }
}

export default function TerminalOutput({ lines }: TerminalOutputProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  return (
    <div className="flex-1 overflow-y-auto p-4 font-mono text-sm leading-relaxed" aria-live="polite" aria-atomic="false">
      {lines.map((line) => (
        <LineContent key={line.id} line={line} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
