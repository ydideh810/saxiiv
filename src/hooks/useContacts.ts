import { useState, useCallback } from 'react';
import { get, set } from 'idb-keyval';
import { Contact } from '../types/message';

const CONTACTS_STORE_KEY = 'nidam_contacts';

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);

  const loadContacts = useCallback(async () => {
    try {
      const storedContacts = await get(CONTACTS_STORE_KEY);
      if (storedContacts) {
        setContacts(storedContacts);
      }
    } catch (error) {
      console.error('Failed to load contacts:', error);
    }
  }, []);

  const saveContact = useCallback(async (contact: Omit<Contact, 'id'>) => {
    try {
      const newContact: Contact = {
        ...contact,
        id: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        lastSeen: new Date(),
      };
      
      const updatedContacts = [...contacts, newContact];
      await set(CONTACTS_STORE_KEY, updatedContacts);
      setContacts(updatedContacts);
      return newContact;
    } catch (error) {
      console.error('Failed to save contact:', error);
      throw new Error('Failed to save contact');
    }
  }, [contacts]);

  const deleteContact = useCallback(async (contactId: string) => {
    try {
      const updatedContacts = contacts.filter(contact => contact.id !== contactId);
      await set(CONTACTS_STORE_KEY, updatedContacts);
      setContacts(updatedContacts);
      
      // Also delete associated messages
      const messagesKey = `messages_${contactId}`;
      await set(messagesKey, []);
    } catch (error) {
      console.error('Failed to delete contact:', error);
      throw new Error('Failed to delete contact');
    }
  }, [contacts]);

  const updateContactStatus = useCallback(async (contactId: string, status: Contact['status']) => {
    try {
      const updatedContacts = contacts.map(contact => 
        contact.id === contactId ? { ...contact, status } : contact
      );
      await set(CONTACTS_STORE_KEY, updatedContacts);
      setContacts(updatedContacts);
    } catch (error) {
      console.error('Failed to update contact status:', error);
    }
  }, [contacts]);

  return {
    contacts,
    loadContacts,
    saveContact,
    deleteContact,
    updateContactStatus,
  };
}