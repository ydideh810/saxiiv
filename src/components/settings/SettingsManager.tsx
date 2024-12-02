import React from 'react';
import { Settings } from 'lucide-react';
import { ColorPicker } from './ColorPicker';
import { LanguageSelector } from './LanguageSelector';
import { AppShortcuts } from './AppShortcuts';

export function SettingsManager() {
  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="mb-4 pb-2 border-b border-[var(--theme-color)] flex items-center gap-2">
        <Settings className="h-4 w-4" />
        <h2 className="terminal-text text-xs">SETTINGS</h2>
      </div>

      <div className="space-y-8 max-w-2xl mx-auto">
        <ColorPicker />
        <LanguageSelector />
        <AppShortcuts />
      </div>
    </div>
  );
}