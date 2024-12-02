import { useState, useEffect } from 'react';
import { get, set } from 'idb-keyval';

interface AppShortcut {
  name: string;
  url: string;
}

const SHORTCUTS_STORE_KEY = 'nidam_app_shortcuts';

const DEFAULT_SHORTCUTS: AppShortcut[] = [
  { name: 'Gmail', url: 'https://mail.google.com' },
  { name: 'Calendar', url: 'https://calendar.google.com' },
  { name: 'Drive', url: 'https://drive.google.com' },
];

export function useAppShortcuts() {
  const [shortcuts, setShortcuts] = useState<AppShortcut[]>(DEFAULT_SHORTCUTS);

  useEffect(() => {
    loadShortcuts();
  }, []);

  const loadShortcuts = async () => {
    try {
      const stored = await get(SHORTCUTS_STORE_KEY);
      if (stored) {
        setShortcuts(stored);
      }
    } catch (error) {
      console.error('Failed to load shortcuts:', error);
    }
  };

  const addShortcut = async (shortcut: AppShortcut) => {
    try {
      const updated = [...shortcuts, shortcut];
      await set(SHORTCUTS_STORE_KEY, updated);
      setShortcuts(updated);
    } catch (error) {
      console.error('Failed to add shortcut:', error);
    }
  };

  const removeShortcut = async (name: string) => {
    try {
      const updated = shortcuts.filter(s => s.name !== name);
      await set(SHORTCUTS_STORE_KEY, updated);
      setShortcuts(updated);
    } catch (error) {
      console.error('Failed to remove shortcut:', error);
    }
  };

  return {
    shortcuts,
    addShortcut,
    removeShortcut,
  };
}