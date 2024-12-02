import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface CountryFlagProps {
  countryCode: string;
  onSelect?: (code: string) => void;
}

const COUNTRIES = {
  'us': 'United States',
  'uk': 'United Kingdom',
  'jp': 'Japan',
  'de': 'Germany',
  'fr': 'France',
  'ru': 'Russia',
  'cn': 'China',
  'kr': 'South Korea',
};

export function CountryFlag({ countryCode, onSelect }: CountryFlagProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Retro-style flag patterns
  const patterns = {
    'us': `
      repeating-linear-gradient(90deg, 
        var(--theme-color) 0px, var(--theme-color) 20px,
        transparent 20px, transparent 40px
      )
    `,
    'uk': `
      linear-gradient(45deg, 
        var(--theme-color) 25%, 
        transparent 25%, transparent 75%,
        var(--theme-color) 75%
      )
    `,
    'jp': `
      radial-gradient(
        circle at center,
        var(--theme-color) 25%,
        transparent 26%
      )
    `,
    'de': `
      linear-gradient(180deg,
        var(--theme-color) 33%,
        transparent 33%, transparent 66%,
        var(--theme-color) 66%
      )
    `,
    'fr': `
      linear-gradient(90deg,
        var(--theme-color) 33%,
        transparent 33%, transparent 66%,
        var(--theme-color) 66%
      )
    `,
    'ru': `
      linear-gradient(180deg,
        var(--theme-color) 33%,
        transparent 33%, transparent 66%,
        var(--theme-color) 66%
      )
    `,
    'cn': `
      radial-gradient(
        circle at 25% 25%,
        var(--theme-color) 10%,
        transparent 11%
      )
    `,
    'kr': `
      radial-gradient(
        circle at center,
        var(--theme-color) 25%,
        transparent 26%
      ),
      linear-gradient(45deg,
        var(--theme-color) 25%,
        transparent 26%
      )
    `,
  };

  return (
    <div className="relative w-full h-full">
      <div 
        className={`w-full h-full ${onSelect ? 'cursor-pointer' : ''}`}
        onClick={() => onSelect && setIsOpen(!isOpen)}
        style={{
          background: patterns[countryCode as keyof typeof patterns] || patterns['us'],
          backgroundSize: '40px 40px',
          opacity: 0.7,
        }}
      >
        {onSelect && (
          <div className="absolute bottom-2 right-2">
            <ChevronDown className="h-4 w-4" />
          </div>
        )}
      </div>

      {isOpen && onSelect && (
        <div className="absolute top-full left-0 w-full mt-2 bg-black border border-[var(--theme-color)] rounded z-10">
          {Object.entries(COUNTRIES).map(([code, name]) => (
            <button
              key={code}
              className="w-full text-left p-2 hover:bg-[var(--theme-color)]/10 terminal-text text-[10px]"
              onClick={() => {
                onSelect(code);
                setIsOpen(false);
              }}
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}