import React from 'react';
import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff } from 'lucide-react';

interface CallControlsProps {
  isInCall: boolean;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  onToggleVideo: () => void;
  onToggleAudio: () => void;
  onStartCall: () => void;
  onEndCall: () => void;
}

export function CallControls({
  isInCall,
  isVideoEnabled,
  isAudioEnabled,
  onToggleVideo,
  onToggleAudio,
  onStartCall,
  onEndCall,
}: CallControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={isInCall ? onEndCall : onStartCall}
        className={`terminal-button p-2 ${
          isInCall ? 'bg-red-500/20 hover:bg-red-500/30' : 'bg-[#00ff9d]/20 hover:bg-[#00ff9d]/30'
        }`}
        aria-label={isInCall ? 'End call' : 'Start call'}
      >
        {isInCall ? (
          <PhoneOff className="h-4 w-4" />
        ) : (
          <Phone className="h-4 w-4" />
        )}
      </button>

      {isInCall && (
        <>
          <button
            onClick={onToggleVideo}
            className="terminal-button p-2"
            aria-label={isVideoEnabled ? 'Disable video' : 'Enable video'}
          >
            {isVideoEnabled ? (
              <Video className="h-4 w-4" />
            ) : (
              <VideoOff className="h-4 w-4" />
            )}
          </button>

          <button
            onClick={onToggleAudio}
            className="terminal-button p-2"
            aria-label={isAudioEnabled ? 'Mute audio' : 'Unmute audio'}
          >
            {isAudioEnabled ? (
              <Mic className="h-4 w-4" />
            ) : (
              <MicOff className="h-4 w-4" />
            )}
          </button>
        </>
      )}
    </div>
  );
}