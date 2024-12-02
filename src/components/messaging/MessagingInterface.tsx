import React, { useState, useEffect } from 'react';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { ContactList } from './ContactList';
import { MessageThread } from './MessageThread';
import { MessageComposer } from './MessageComposer';
import { AddContactModal } from './AddContactModal';
import { VideoCall } from './VideoCall';
import { CallControls } from './CallControls';
import { PublicKeyDisplay } from './PublicKeyDisplay';
import { Contact, Message } from '../../types/message';
import { useContacts } from '../../hooks/useContacts';
import { useP2PMessaging } from '../../hooks/useP2PMessaging';
import { useWebRTC } from '../../hooks/useWebRTC';
import { convertFileToBase64, validateMediaFile } from '../../utils/mediaUtils';

export function MessagingInterface() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showAddContact, setShowAddContact] = useState(false);
  const [showMobileContacts, setShowMobileContacts] = useState(true);
  const [isInCall, setIsInCall] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  const { contacts, loadContacts, saveContact, deleteContact, updateContactStatus } = useContacts();
  const { keyPair, messages, sendMessage, sendMediaMessage } = useP2PMessaging();
  const webRTC = useWebRTC(keyPair?.publicKey || '');

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const handleSendMessage = async (content: string) => {
    if (selectedContact && keyPair) {
      await sendMessage(content, selectedContact.publicKey);
      updateContactStatus(selectedContact.id, 'sent');
    }
  };

  const handleSendMedia = async (file: File, type: 'image' | 'video') => {
    if (!selectedContact || !keyPair) return;

    try {
      validateMediaFile(file, type);
      const base64Data = await convertFileToBase64(file);
      await sendMediaMessage(base64Data, type, selectedContact.publicKey);
      updateContactStatus(selectedContact.id, 'sent');
    } catch (error) {
      console.error('Failed to send media:', error);
      alert(error instanceof Error ? error.message : 'Failed to send media');
    }
  };

  const handleSendVoiceNote = async (audioBlob: Blob) => {
    if (!selectedContact || !keyPair) return;

    try {
      const base64Data = await convertFileToBase64(new File([audioBlob], 'voice.webm'));
      await sendMediaMessage(base64Data, 'voice', selectedContact.publicKey);
      updateContactStatus(selectedContact.id, 'sent');
    } catch (error) {
      console.error('Failed to send voice note:', error);
    }
  };

  const handleAddContact = async (contact: Omit<Contact, 'id'>) => {
    try {
      await saveContact(contact);
      setShowAddContact(false);
    } catch (error) {
      console.error('Failed to add contact:', error);
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    try {
      await deleteContact(contactId);
      if (selectedContact?.id === contactId) {
        setSelectedContact(null);
      }
    } catch (error) {
      console.error('Failed to delete contact:', error);
    }
  };

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
    setShowMobileContacts(false);
  };

  const handleBackToContacts = () => {
    setShowMobileContacts(true);
  };

  const handleStartCall = async () => {
    if (selectedContact) {
      await webRTC.startCall(selectedContact.publicKey, isVideoEnabled);
      setIsInCall(true);
    }
  };

  const handleEndCall = () => {
    webRTC.endCall();
    setIsInCall(false);
  };

  const handleToggleVideo = () => {
    webRTC.toggleVideo();
    setIsVideoEnabled(!isVideoEnabled);
  };

  const handleToggleAudio = () => {
    webRTC.toggleAudio();
    setIsAudioEnabled(!isAudioEnabled);
  };

  const filteredMessages = messages.filter(msg => 
    (msg.senderId === keyPair?.publicKey && msg.receiverId === selectedContact?.publicKey) ||
    (msg.receiverId === keyPair?.publicKey && msg.senderId === selectedContact?.publicKey)
  );

  return (
    <div className="h-full flex flex-col md:flex-row gap-4">
      {/* Contacts Panel */}
      <div className={`
        w-full md:w-64 
        ${showMobileContacts ? 'block' : 'hidden md:block'}
      `}>
        <div className="mb-4 pb-2 border-b border-[#00ff9d] flex justify-between items-center">
          <h2 className="terminal-text text-[10px] md:text-xs">CONTACTS</h2>
          <button
            onClick={() => setShowAddContact(true)}
            className="terminal-button p-1"
            aria-label="Add contact"
          >
            <UserPlus className="h-3 w-3 md:h-4 md:w-4" />
          </button>
        </div>

        {keyPair && <PublicKeyDisplay publicKey={keyPair.publicKey} />}
        
        <div className="mt-4">
          <ContactList
            contacts={contacts}
            onSelectContact={handleSelectContact}
            onDeleteContact={handleDeleteContact}
            selectedContactId={selectedContact?.id}
          />
        </div>
      </div>
      
      {/* Messages Panel */}
      <div className={`
        flex-1 flex flex-col h-full
        ${!showMobileContacts ? 'block' : 'hidden md:block'}
      `}>
        {selectedContact ? (
          <>
            <div className="mb-4 pb-2 border-b border-[#00ff9d]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {!showMobileContacts && (
                    <button
                      onClick={handleBackToContacts}
                      className="terminal-button p-1 md:hidden"
                      aria-label="Back to contacts"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                  )}
                  <h2 className="terminal-text text-[10px] md:text-xs">
                    CHAT WITH {selectedContact.name.toUpperCase()}
                  </h2>
                </div>
                <CallControls
                  isInCall={isInCall}
                  isVideoEnabled={isVideoEnabled}
                  isAudioEnabled={isAudioEnabled}
                  onToggleVideo={handleToggleVideo}
                  onToggleAudio={handleToggleAudio}
                  onStartCall={handleStartCall}
                  onEndCall={handleEndCall}
                />
              </div>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col">
              {isInCall ? (
                <VideoCall
                  localStream={webRTC.localStream}
                  remoteStream={webRTC.remoteStream}
                />
              ) : (
                <>
                  <MessageThread
                    messages={filteredMessages}
                    currentUserId={keyPair?.publicKey || ''}
                  />
                  <div className="mt-4 sticky bottom-0 bg-black p-2">
                    <MessageComposer
                      onSendMessage={handleSendMessage}
                      onSendMedia={handleSendMedia}
                      onSendVoiceNote={handleSendVoiceNote}
                      recipientName={selectedContact.name}
                    />
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="terminal-text text-[10px] md:text-xs text-[#00ff9d]/70">
              Select a contact to start messaging
            </p>
          </div>
        )}
      </div>

      {showAddContact && (
        <AddContactModal
          onClose={() => setShowAddContact(false)}
          onSave={handleAddContact}
        />
      )}
    </div>
  );
}