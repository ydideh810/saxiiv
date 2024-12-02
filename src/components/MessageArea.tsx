import React from 'react';
import { Message } from '../hooks/useAIChat';
import { ChatActions } from './ChatActions';

interface MessageAreaProps {
  messages: Message[];
}

export function MessageArea({ messages }: MessageAreaProps) {
  return (
    <div className="space-y-3 md:space-y-4 h-[60vh] overflow-y-auto pr-2">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`rounded border border-[#00ff9d] p-2 md:p-3 ${
            msg.role === 'user' ? 'ml-4 md:ml-12' : 'mr-4 md:mr-12'
          }`}
        >
          <div className="terminal-text text-[8px] md:text-[10px] mb-2 text-[#00ff9d]/70">
            {msg.role.toUpperCase()}
          </div>
          <p className="terminal-text text-[10px] md:text-xs whitespace-pre-wrap">
            {msg.content}
          </p>
          {msg.role === 'assistant' && <ChatActions message={msg} />}
        </div>
      ))}
    </div>
  );
}