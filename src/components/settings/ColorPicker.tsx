import React, { useState } from 'react';
import { Palette, RotateCcw } from 'lucide-react';
import { useThemeColor } from '../../hooks/useThemeColor';

const PRESET_COLORS = [
  { name: 'MATRIX GREEN', value: '#00ff9d' },
  { name: 'CYBER BLUE', value: '#00ffff' },
  { name: 'NEON PINK', value: '#ff00ff' },
  { name: 'PLASMA PURPLE', value: '#9d00ff' },
  { name: 'AMBER', value: '#ffb000' },
  { name: 'RED ALERT', value: '#ff0000' },
];

export function ColorPicker() {
  const { themeColor, updateThemeColor } = useThemeColor();
  const [customColor, setCustomColor] = useState(themeColor);

  const handleColorChange = (color: string) => {
    updateThemeColor(color);
    setCustomColor(color);
  };

  const resetToDefault = () => {
    handleColorChange(PRESET_COLORS[0].value);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Palette className="h-4 w-4" />
        <h3 className="terminal-text text-xs">THEME COLOR</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {PRESET_COLORS.map((color) => (
          <button
            key={color.value}
            onClick={() => handleColorChange(color.value)}
            className={`
              terminal-button p-2 flex items-center gap-2
              ${themeColor === color.value ? 'bg-[var(--theme-color)]/20' : ''}
            `}
          >
            <div
              className="w-4 h-4 rounded-full border border-[var(--theme-color)]"
              style={{ backgroundColor: color.value }}
            />
            <span className="terminal-text text-[8px] md:text-[10px]">
              {color.name}
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <label className="terminal-text text-[10px]">
          CUSTOM COLOR:
        </label>
        <div className="flex gap-2">
          <input
            type="color"
            value={customColor}
            onChange={(e) => handleColorChange(e.target.value)}
            className="terminal-input w-12 h-9 p-1 cursor-pointer"
          />
          <input
            type="text"
            value={customColor}
            onChange={(e) => handleColorChange(e.target.value)}
            placeholder="#00ff9d"
            pattern="^#[0-9A-Fa-f]{6}$"
            className="terminal-input flex-1"
          />
          <button
            onClick={resetToDefault}
            className="terminal-button px-2"
            aria-label="Reset to default color"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="border border-[var(--theme-color)] rounded p-4">
        <h4 className="terminal-text text-[10px] mb-2">PREVIEW:</h4>
        <div className="space-y-2">
          <div className="terminal-button p-2">
            BUTTON EXAMPLE
          </div>
          <div className="terminal-input p-2">
            INPUT EXAMPLE
          </div>
          <div className="border border-[var(--theme-color)] rounded p-2">
            BORDER EXAMPLE
          </div>
        </div>
      </div>
    </div>
  );
}