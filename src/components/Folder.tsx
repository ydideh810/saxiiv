import React from 'react';

interface FolderProps {
  label: string;
  id: string;
}

export function Folder({ label }: FolderProps) {
  return (
    <div className="cursor-pointer rounded border border-[#00ff9d] p-2 hover:bg-[#00ff9d]/10 active:bg-[#00ff9d]/20 transition-colors duration-200">
      <span className="terminal-text text-[10px] md:text-xs">{label}</span>
    </div>
  );
}