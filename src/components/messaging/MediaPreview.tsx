import React from 'react';

interface MediaPreviewProps {
  type: 'image' | 'video';
  url: string;
}

export function MediaPreview({ type, url }: MediaPreviewProps) {
  return (
    <div className="max-w-sm rounded overflow-hidden border border-[#00ff9d]">
      {type === 'image' ? (
        <img
          src={url}
          alt="Shared media"
          className="w-full h-auto"
          loading="lazy"
        />
      ) : (
        <video
          src={url}
          controls
          className="w-full h-auto"
          preload="metadata"
        />
      )}
    </div>
  );
}