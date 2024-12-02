import React, { useRef } from 'react';
import { Image, Film } from 'lucide-react';

interface MediaUploadProps {
  onFileSelect: (file: File) => void;
  onClear: () => void;
  selectedFile: File | null;
  type: 'image' | 'video';
}

export function MediaUpload({ onFileSelect, type }: MediaUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'image' && !file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      if (type === 'video' && !file.type.startsWith('video/')) {
        alert('Please select a video file');
        return;
      }
      onFileSelect(file);
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={type === 'image' ? 'image/*' : 'video/*'}
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        onClick={handleClick}
        className="terminal-button p-2"
        aria-label={type === 'image' ? 'Send image' : 'Send video'}
      >
        {type === 'image' ? (
          <Image className="h-5 w-5" />
        ) : (
          <Film className="h-5 w-5" />
        )}
      </button>
    </>
  );
}