import React, { useState, useEffect } from 'react';
import { Clipboard, Copy, Trash } from 'lucide-react';
import { get, set } from 'idb-keyval';

interface ClipboardItem {
  id: string;
  text: string;
  timestamp: Date;
}

export function ClipboardManager() {
  const [items, setItems] = useState<ClipboardItem[]>([]);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    const stored = await get('clipboard_items') || [];
    setItems(stored);
  };

  const saveItem = async () => {
    if (!newItem.trim()) return;
    
    const item: ClipboardItem = {
      id: `clip_${Date.now()}`,
      text: newItem.trim(),
      timestamp: new Date(),
    };
    
    const updatedItems = [item, ...items].slice(0, 10); // Keep last 10 items
    await set('clipboard_items', updatedItems);
    setItems(updatedItems);
    setNewItem('');
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const deleteItem = async (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    await set('clipboard_items', updatedItems);
    setItems(updatedItems);
  };

  return (
    <div className="h-full p-4">
      <div className="mb-4 pb-2 border-b border-[#00ff9d] flex items-center gap-2">
        <Clipboard className="h-4 w-4" />
        <h2 className="terminal-text text-xs">CLIPBOARD MANAGER</h2>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Enter text to store..."
            className="terminal-input flex-1"
          />
          <button
            onClick={saveItem}
            className="terminal-button px-4"
          >
            STORE
          </button>
        </div>

        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2 p-2 border border-[#00ff9d] rounded"
            >
              <p className="terminal-text text-[10px] flex-1 truncate">
                {item.text}
              </p>
              <button
                onClick={() => copyToClipboard(item.text)}
                className="terminal-button p-1"
                aria-label="Copy to clipboard"
              >
                <Copy className="h-3 w-3" />
              </button>
              <button
                onClick={() => deleteItem(item.id)}
                className="terminal-button p-1"
                aria-label="Delete item"
              >
                <Trash className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}