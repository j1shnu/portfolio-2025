import { memo } from 'react';
import { Footer as FooterType } from '../types/portfolio';

interface FooterProps {
  footer: FooterType;
}

function Footer({ footer }: FooterProps) {
  return (
    <footer className="bg-gray-900 py-8 sm:py-12 border-t border-gray-800/50 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto text-center">
        <div className="mb-4 sm:mb-6">
          <p className="text-xl sm:text-2xl font-bold text-blue-400 mb-1 sm:mb-2">{footer.name}</p>
          <p className="text-sm sm:text-base text-gray-400">{footer.title}</p>
        </div>
        <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
          {footer.copyright}
        </p>
      </div>
    </footer>
  );
}

export default memo(Footer);
