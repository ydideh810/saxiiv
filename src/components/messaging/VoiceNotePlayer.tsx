import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause } from 'lucide-react';
import WaveSurfer from 'wavesurfer.js';

interface VoiceNotePlayerProps {
  audioUrl: string;
}

export function VoiceNotePlayer({ audioUrl }: VoiceNotePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (waveformRef.current) {
      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#00ff9d',
        progressColor: '#00cc7d',
        cursorColor: '#00ff9d',
        barWidth: 2,
        barGap: 1,
        height: 30,
        normalize: true,
      });

      wavesurferRef.current.load(audioUrl);

      wavesurferRef.current.on('ready', () => {
        setDuration(wavesurferRef.current?.getDuration() || 0);
      });

      wavesurferRef.current.on('audioprocess', () => {
        setCurrentTime(wavesurferRef.current?.getCurrentTime() || 0);
      });

      wavesurferRef.current.on('finish', () => {
        setIsPlaying(false);
      });

      return () => {
        wavesurferRef.current?.destroy();
      };
    }
  }, [audioUrl]);

  const togglePlayPause = () => {
    if (wavesurferRef.current) {
      if (isPlaying) {
        wavesurferRef.current.pause();
      } else {
        wavesurferRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col gap-2 w-full max-w-xs">
      <div className="flex items-center gap-2">
        <button
          onClick={togglePlayPause}
          className="terminal-button p-1.5"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="h-3 w-3" />
          ) : (
            <Play className="h-3 w-3" />
          )}
        </button>
        <div className="text-[8px] md:text-[10px] terminal-text">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>
      <div ref={waveformRef} className="w-full" />
    </div>
  );
}