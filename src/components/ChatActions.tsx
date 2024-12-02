import React from 'react';
import { Copy, Share2, Check } from 'lucide-react';
import { Message } from '../hooks/useAIChat';

interface ChatActionsProps {
  message: Message;
}

export function ChatActions({ message }: ChatActionsProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'SAXIIB Chat Response',
          text: message.content,
        });
      } else {
        throw new Error('Share API not supported');
      }
    } catch (error) {
      console.error('Failed to share:', error);
      // Fallback to copy
      handleCopy();
    }
  };

  return (
    <div className="flex items-center gap-1 mt-2">
      <button
        onClick={handleCopy}
        className="terminal-button p-1 flex items-center gap-1"
        aria-label="Copy message"
      >
        {copied ? (
          <>
            <Check className="h-3 w-3" />
            <span className="terminal-text text-[8px]">COPIED</span>
          </>
        ) : (
          <>
            <Copy className="h-3 w-3" />
            <span className="terminal-text text-[8px]">COPY</span>
          </>
        )}
      </button>
      <button
        onClick={handleShare}
        className="terminal-button p-1 flex items-center gap-1"
        aria-label="Share message"
      >
        <Share2 className="h-3 w-3" />
        <span className="terminal-text text-[8px]">SHARE</span>
      </button>
    </div>
  );
}
