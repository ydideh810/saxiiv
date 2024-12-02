import React, { useState } from 'react';
import { Copy, Check, Key } from 'lucide-react';

interface PublicKeyDisplayProps {
  publicKey: string;
}

export function PublicKeyDisplay({ publicKey }: PublicKeyDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy public key:', error);
    }
  };

  return (
    <div className="flex items-center gap-2 p-2 border border-[#00ff9d] rounded bg-black/30">
      <Key className="h-4 w-4 text-[#00ff9d]" />
      <div className="flex-1">
        <p className="terminal-text text-[8px] text-[#00ff9d]/70">YOUR PUBLIC KEY</p>
        <p className="terminal-text text-[10px] truncate">
          {publicKey.substring(0, 12)}...
        </p>
      </div>
      <button
        onClick={handleCopy}
        className="terminal-button p-1.5"
        aria-label={copied ? 'Copied!' : 'Copy public key'}
      >
        {copied ? (
          <Check className="h-3 w-3" />
        ) : (
          <Copy className="h-3 w-3" />
        )}
      </button>
    </div>
  );
}