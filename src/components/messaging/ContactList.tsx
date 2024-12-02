import React from 'react';
import { Contact } from '../../types/message';
import { User, Trash2, Key } from 'lucide-react';

interface ContactListProps {
  contacts: Contact[];
  onSelectContact: (contact: Contact) => void;
  onDeleteContact: (contactId: string) => void;
  selectedContactId?: string;
}

export function ContactList({ 
  contacts, 
  onSelectContact, 
  onDeleteContact,
  selectedContactId 
}: ContactListProps) {
  const handleDelete = (e: React.MouseEvent, contactId: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this contact? All associated messages will also be deleted.')) {
      onDeleteContact(contactId);
    }
  };

  return (
    <div className="space-y-2">
      {contacts.map((contact) => (
        <div
          key={contact.id}
          onClick={() => onSelectContact(contact)}
          className={`
            flex items-center gap-3 p-2 rounded cursor-pointer
            border border-[#00ff9d] transition-colors duration-200
            ${selectedContactId === contact.id ? 'bg-[#00ff9d]/20' : 'hover:bg-[#00ff9d]/10'}
          `}
        >
          {contact.avatar ? (
            <img
              src={contact.avatar}
              alt={contact.name}
              className="w-8 h-8 rounded-full border border-[#00ff9d]"
            />
          ) : (
            <div className="w-8 h-8 rounded-full border border-[#00ff9d] flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="terminal-text text-[10px] md:text-xs truncate">{contact.name}</p>
            <div className="flex items-center gap-1">
              <Key className="w-3 h-3 text-[#00ff9d]/70" />
              <p className="terminal-text text-[8px] md:text-[10px] text-[#00ff9d]/70 truncate">
                {contact.publicKey ? `${contact.publicKey.substring(0, 8)}...` : 'No key'}
              </p>
            </div>
            {contact.status && (
              <p className={`terminal-text text-[8px] md:text-[10px] ${
                contact.status === 'online' ? 'text-[#00ff9d]' : 
                contact.status === 'typing' ? 'text-[#00ff9d] animate-pulse' : 
                'text-[#00ff9d]/50'
              }`}>
                {contact.status === 'typing' ? 'Typing...' : contact.status.toUpperCase()}
              </p>
            )}
          </div>
          <button
            onClick={(e) => handleDelete(e, contact.id)}
            className="terminal-button p-1.5 hover:bg-red-500/20"
            aria-label="Delete contact"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
}