import React, { useState } from 'react';
import { AppWindow, Plus, Trash2, ExternalLink } from 'lucide-react';
import { useAppShortcuts } from '../../hooks/useAppShortcuts';

export function AppShortcuts() {
  const { shortcuts, addShortcut, removeShortcut } = useAppShortcuts();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newApp, setNewApp] = useState({ name: '', url: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newApp.name && newApp.url) {
      addShortcut(newApp);
      setNewApp({ name: '', url: '' });
      setShowAddForm(false);
    }
  };

  const handleOpenApp = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <AppWindow className="h-4 w-4" />
        <h3 className="terminal-text text-xs">EXTERNAL APP SHORTCUTS</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {shortcuts.map((app) => (
          <div
            key={app.name}
            className="border border-[var(--theme-color)] rounded p-2 flex flex-col"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="terminal-text text-[10px] truncate">
                {app.name}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => handleOpenApp(app.url)}
                  className="terminal-button p-1"
                  aria-label={`Open ${app.name}`}
                >
                  <ExternalLink className="h-3 w-3" />
                </button>
                <button
                  onClick={() => removeShortcut(app.name)}
                  className="terminal-button p-1"
                  aria-label={`Remove ${app.name}`}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
            <p className="terminal-text text-[8px] text-[var(--theme-color)]/70 truncate">
              {app.url}
            </p>
          </div>
        ))}

        <button
          onClick={() => setShowAddForm(true)}
          className="border border-dashed border-[var(--theme-color)] rounded p-2 flex items-center justify-center gap-2 hover:bg-[var(--theme-color)]/10"
        >
          <Plus className="h-4 w-4" />
          <span className="terminal-text text-[10px]">ADD APP</span>
        </button>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-black border border-[var(--theme-color)] rounded-lg p-4 w-full max-w-md space-y-4"
          >
            <h4 className="terminal-text text-xs mb-4">ADD NEW APP SHORTCUT</h4>
            
            <div className="space-y-2">
              <label className="terminal-text text-[10px]">APP NAME:</label>
              <input
                type="text"
                value={newApp.name}
                onChange={(e) => setNewApp({ ...newApp, name: e.target.value })}
                className="terminal-input w-full"
                placeholder="e.g., Gmail"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="terminal-text text-[10px]">APP URL:</label>
              <input
                type="url"
                value={newApp.url}
                onChange={(e) => setNewApp({ ...newApp, url: e.target.value })}
                className="terminal-input w-full"
                placeholder="https://..."
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="terminal-button px-4 py-2"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="terminal-button px-4 py-2 bg-[var(--theme-color)]/10"
              >
                SAVE
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}