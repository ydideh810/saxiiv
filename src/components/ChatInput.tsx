import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { VoiceButton } from './VoiceButton';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const [input, setInput] = useState('');
  const { isListening, transcript, startListening, stopListening, error } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceButton = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="terminal-input flex-1 text-[10px] md:text-xs h-9 md:h-10"
        />
        <VoiceButton
          isListening={isListening}
          onClick={handleVoiceButton}
          disabled={!!error}
        />
        <button
          onClick={handleSend}
          className="terminal-button h-9 md:h-10 px-2 md:px-3"
          aria-label="Send message"
        >
          <Send className="h-3 w-3 md:h-4 md:w-4" />
        </button>
      </div>
      {error && (
        <p className="text-red-500 terminal-text text-[8px] md:text-[10px]">{error}</p>
      )}
      {isListening && (
        <p className="text-[#00ff9d] terminal-text text-[8px] md:text-[10px] animate-pulse">
          Listening...
        </p>
      )}
    </div>
  );
}