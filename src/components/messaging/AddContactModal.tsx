import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AddContactModalProps {
  onClose: () => void;
  onSave: (contact: { name: string; publicKey: string; avatar?: string }) => void;
}

export function AddContactModal({ onClose, onSave }: AddContactModalProps) {
  const [name, setName] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [avatar, setAvatar] = useState('');
  const [error, setError] = useState('');

  const handlePublicKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPublicKey(value);
    if (value && !/^[A-Za-z0-9+/=]{43,44}$/.test(value)) {
      setError('Invalid public key format');
    } else {
      setError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    if (!publicKey || !/^[A-Za-z0-9+/=]{43,44}$/.test(publicKey)) {
      setError('Valid public key is required');
      return;
    }

    onSave({ 
      name: name.trim(),
      publicKey: publicKey.trim(),
      avatar: avatar.trim() || undefined
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-black border border-[#00ff9d] rounded-lg p-4 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 terminal-button p-1"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        <h2 className="terminal-text text-xs mb-4">ADD NEW CONTACT</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="terminal-text text-[10px] block mb-2">
              NAME
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="terminal-input w-full"
              placeholder="Enter contact name"
            />
          </div>

          <div>
            <label htmlFor="publicKey" className="terminal-text text-[10px] block mb-2">
              PUBLIC KEY
            </label>
            <input
              id="publicKey"
              type="text"
              value={publicKey}
              onChange={handlePublicKeyChange}
              className="terminal-input w-full"
              placeholder="Enter public key"
            />
          </div>

          <div>
            <label htmlFor="avatar" className="terminal-text text-[10px] block mb-2">
              AVATAR URL (OPTIONAL)
            </label>
            <input
              id="avatar"
              type="url"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="terminal-input w-full"
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          {error && (
            <p className="text-red-500 terminal-text text-[10px]">{error}</p>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="terminal-button px-4 py-2"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="terminal-button px-4 py-2 bg-[#00ff9d]/10 hover:bg-[#00ff9d]/20"
            >
              SAVE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}