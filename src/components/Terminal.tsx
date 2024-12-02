import React, { useState } from 'react';
import { MessageArea } from './MessageArea';
import { ChatInput } from './ChatInput';
import { MessagingInterface } from './messaging/MessagingInterface';
import { UtilityManager } from './utility/UtilityManager';
import { SettingsManager } from './settings/SettingsManager';
import { BusinessCard } from './business-card/BusinessCard';
import { AIHelper } from './AIHelper';
import { Monitor, Wifi, WifiOff, Menu, X } from 'lucide-react';
import { useAIChat } from '../hooks/useAIChat';

const SYSTEM_PROMPT = `I am SAXIIB, your hyper-intelligent AI assistant. My capabilities include:
- Universal translation across 100+ languages
- Multi-device control and automation
- Instant knowledge access and processing
- Voice command interpretation
- Secure, decentralized data handling

I Respond in a helpful, precise manner while maintaining a slight technical tone.`;

const folders = [
  { id: 'chat', label: 'CHAT' },
  { id: 'messages', label: 'MESSAGES' },
  { id: 'business-card', label: 'BUSINESS CARD' },
  { id: 'utility', label: 'UTILITY' },
  { id: 'settings', label: 'SETTINGS' },
] as const;

export function Terminal() {
  const { messages, sendMessage, isOnline } = useAIChat(SYSTEM_PROMPT);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeFolder, setActiveFolder] = useState('chat');

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const renderContent = () => {
    switch (activeFolder) {
      case 'messages':
        return <MessagingInterface />;
      case 'utility':
        return <UtilityManager />;
      case 'settings':
        return <SettingsManager />;
      case 'business-card':
        return <BusinessCard />;
      case 'chat':
        return (
          <>
            <MessageArea messages={messages} />
            <div className="mt-4">
              <ChatInput onSendMessage={sendMessage} />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black p-2 sm:p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-4 md:mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={toggleSidebar}
              className="md:hidden terminal-button p-1.5"
              aria-label="Toggle menu"
            >
              {isSidebarOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </button>
            <Monitor className="h-4 w-4 md:h-5 md:w-5" />
            <h1 className="terminal-text text-[10px] md:text-xs">
              SAXIIB TERMINAL
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {isOnline ? (
              <Wifi className="h-3 w-3 md:h-4 md:w-4 text-[var(--theme-color)]" />
            ) : (
              <WifiOff className="h-3 w-3 md:h-4 md:w-4 text-red-500" />
            )}
            <span className="terminal-text text-[8px] md:text-[10px]">
              {isOnline ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>
        </header>

        <div className="relative rounded-lg border border-[var(--theme-color)] bg-black/50 p-3 sm:p-4 md:p-6 shadow-[0_0_15px_rgba(var(--theme-color-rgb),0.3)]">
          <div className="flex h-[calc(100vh-12rem)] md:h-[calc(100vh-16rem)]">
            <div
              className={`
              fixed md:relative top-0 left-0 h-full md:h-auto w-64 md:w-48
              bg-black md:bg-transparent border-r border-[var(--theme-color)] md:border-r-0
              transition-transform duration-300 z-50 p-4 md:p-0
              ${
                isSidebarOpen
                  ? 'translate-x-0'
                  : '-translate-x-full md:translate-x-0'
              }
            `}
            >
              <div className="mb-4 border-b border-[var(--theme-color)] pb-2">
                <h2 className="terminal-text text-[10px] md:text-xs">
                  FOLDERS
                </h2>
              </div>
              <div className="space-y-2">
                {folders.map((folder) => (
                  <div
                    key={folder.id}
                    onClick={() => setActiveFolder(folder.id)}
                  >
                    <div
                      className={`
                      cursor-pointer rounded border border-[var(--theme-color)] p-2 
                      hover:bg-[var(--theme-color)]/10 active:bg-[var(--theme-color)]/20 
                      transition-colors duration-200
                      ${
                        activeFolder === folder.id
                          ? 'bg-[var(--theme-color)]/20'
                          : ''
                      }
                    `}
                    >
                      <span className="terminal-text text-[10px] md:text-xs">
                        {folder.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {isSidebarOpen && (
              <div
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}

            <div className="flex-1 md:ml-6 overflow-hidden">
              {renderContent()}
            </div>
          </div>

          <div className="mt-4 border-t border-[var(--theme-color)] pt-2">
            <p className="terminal-text text-[8px] md:text-[10px]">
              {window.innerWidth <= 768
                ? 'TAP folders to navigate | SCROLL to view history'
                : 'UP, DOWN: select folder | LEFT, RIGHT: scroll | q: exit'}
            </p>
          </div>
        </div>
      </div>

      <AIHelper
        currentFolder={activeFolder}
        onNavigateToChat={() => setActiveFolder('chat')}
      />
    </div>
  );
}
