import React, { useState } from 'react';
import { Send, Camera, Video, Mic, Image, Film, Paperclip } from 'lucide-react';
import { VoiceRecorder } from './VoiceRecorder';
import { MediaUpload } from './MediaUpload';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';

interface MessageComposerProps {
  onSendMessage: (content: string) => void;
  onSendMedia: (file: File, type: 'image' | 'video') => void;
  onSendVoiceNote: (audioBlob: Blob) => void;
  recipientName: string;
}

export function MessageComposer({
  onSendMessage,
  onSendMedia,
  onSendVoiceNote,
  recipientName
}: MessageComposerProps) {
  const [message, setMessage] = useState('');
  const [showMediaButtons, setShowMediaButtons] = useState(false);
  const { isListening, transcript, startListening, stopListening } = useSpeechRecognition();

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Media Buttons */}
      <div className="flex items-center gap-2 px-2">
        <MediaUpload
          onFileSelect={(file) => onSendMedia(file, 'image')}
          type="image"
        />
        <MediaUpload
          onFileSelect={(file) => onSendMedia(file, 'video')}
          type="video"
        />
        <VoiceRecorder onSendVoiceNote={onSendVoiceNote} />
      </div>

      {/* Message Input */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Message"
          className="flex-1 bg-[#1a1a1a] text-white rounded-full px-4 py-2 text-[14px] focus:outline-none focus:ring-1 focus:ring-[#00ff9d]"
        />
        <button
          onClick={handleSend}
          className="terminal-button p-2"
          aria-label="Send message"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}