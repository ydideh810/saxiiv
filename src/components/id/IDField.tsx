import React from 'react';

interface IDFieldProps {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  editable?: boolean;
  type?: 'text' | 'date' | 'email' | 'tel';
  readOnly?: boolean;
}

export function IDField({ 
  label, 
  value, 
  onChange, 
  editable = false,
  type = 'text',
  readOnly = false
}: IDFieldProps) {
  return (
    <div className="space-y-1">
      <p className="terminal-text text-[8px] text-[var(--theme-color)]/70">
        {label}
      </p>
      {editable && !readOnly ? (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="terminal-input w-full text-[10px] md:text-xs h-7 bg-black/50"
        />
      ) : (
        <p className="terminal-text text-[10px] md:text-xs">
          {value}
        </p>
      )}
    </div>
  );
}