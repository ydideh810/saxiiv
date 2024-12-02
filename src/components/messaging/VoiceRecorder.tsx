import React, { useState } from 'react';
import { Mic, Square, Send } from 'lucide-react';
import { useVoiceRecorder } from '../../hooks/useVoiceRecorder';

interface VoiceRecorderProps {
  onSendVoiceNote: (audioBlob: Blob) => void;
}

export function VoiceRecorder({ onSendVoiceNote }: VoiceRecorderProps) {
  const [recordingTime, setRecordingTime] = useState(0);
  const { isRecording, audioChunks, startRecording, stopRecording, clearRecording } = useVoiceRecorder();

  React.useEffect(() => {
    let interval: number;
    if (isRecording) {
      interval = window.setInterval(() => {
        setRecordingTime(time => time + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  const handleStartRecording = () => {
    setRecordingTime(0);
    startRecording();
  };

  const handleStopRecording = async () => {
    stopRecording();
    if (audioChunks.length > 0) {
      onSendVoiceNote(audioChunks[0]);
      clearRecording();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <button
      onClick={isRecording ? handleStopRecording : handleStartRecording}
      className={`terminal-button p-2 ${isRecording ? 'bg-red-500/20' : ''}`}
      aria-label={isRecording ? 'Stop recording' : 'Start recording'}
    >
      <Mic className={`h-5 w-5 ${isRecording ? 'animate-pulse' : ''}`} />
    </button>
  );
}