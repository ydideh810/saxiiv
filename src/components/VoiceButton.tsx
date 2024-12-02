import React from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceButtonProps {
  isListening: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function VoiceButton({ isListening, onClick, disabled }: VoiceButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`terminal-button h-9 md:h-10 px-2 md:px-3 ${isListening ? 'bg-[#00ff9d]/20' : ''} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      disabled={disabled}
      aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
      title={disabled ? 'Speech recognition not supported' : ''}
    >
      {isListening ? (
        <MicOff className="h-3 w-3 md:h-4 md:w-4 animate-pulse" />
      ) : (
        <Mic className="h-3 w-3 md:h-4 md:w-4" />
      )}
    </button>
  );
}