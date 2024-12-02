import React, { useState, useEffect } from 'react';
import { HelpCircle, X, MessageSquare } from 'lucide-react';
import { useAIChat } from '../hooks/useAIChat';

interface AIHelperProps {
  currentFolder: string;
  onNavigateToChat: () => void;
}

export function AIHelper({ currentFolder, onNavigateToChat }: AIHelperProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tip, setTip] = useState('');
  const { messages, sendMessage } =
    useAIChat(`You are SAXIIB's context-aware helper. 
    Provide concise, relevant tips based on the current folder: ${currentFolder}`);

  useEffect(() => {
    if (currentFolder !== 'chat') {
      getTipForFolder(currentFolder);
    }
  }, [currentFolder]);

  const getTipForFolder = async (folder: string) => {
    const tips = {
      messages: [
        "Template: 'Hi [Name], I hope this message finds you well. [Context]. Best regards.'",
        'Quick tip: Use voice messages for longer communications.',
        'Remember to check message status indicators for delivery confirmation.',
      ],
      utility: [
        'The translator works offline for basic phrases.',
        'Save frequently used clipboard items for quick access.',
        'QR codes can be saved and shared across devices.',
      ],
      settings: [
        'Customize theme colors to match your preference.',
        'Language settings persist across sessions.',
        'Your settings are stored locally for privacy.',
      ],
      'business-card': [
        'Keep your digital business card information up to date.',
        'Use the QR code for quick information sharing.',
        'Your business card data is stored securely offline.',
      ],
    };

    const folderTips = tips[folder as keyof typeof tips] || [];
    if (folderTips.length > 0) {
      setTip(folderTips[Math.floor(Math.random() * folderTips.length)]);
    }
  };

  if (currentFolder === 'chat') return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-black border border-[var(--theme-color)] rounded-lg p-4 max-w-xs animate-fade-in">
          <div className="flex justify-between items-start mb-2">
            <h3 className="terminal-text text-xs">SAXIIB TIPS</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="terminal-button p-1"
              aria-label="Close tips"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
          <p className="terminal-text text-[10px] mb-4">{tip}</p>
          <button
            onClick={onNavigateToChat}
            className="terminal-button w-full flex items-center justify-center gap-2 p-2"
          >
            <MessageSquare className="h-4 w-4" />
            <span className="terminal-text text-[10px]">ASK SAXIIB</span>
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="terminal-button p-2 animate-pulse"
          aria-label="Show AI helper"
        >
          <HelpCircle className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
