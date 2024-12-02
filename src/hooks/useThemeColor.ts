import { useState, useEffect } from 'react';
import { get, set } from 'idb-keyval';

const THEME_COLOR_KEY = 'nidam_theme_color';
const DEFAULT_COLOR = '#00ff9d';

export function useThemeColor() {
  const [themeColor, setThemeColor] = useState(DEFAULT_COLOR);

  useEffect(() => {
    loadThemeColor();
  }, []);

  useEffect(() => {
    updateCSSVariables(themeColor);
  }, [themeColor]);

  const loadThemeColor = async () => {
    const stored = await get(THEME_COLOR_KEY);
    if (stored) {
      setThemeColor(stored);
      updateCSSVariables(stored);
    }
  };

  const updateThemeColor = async (color: string) => {
    await set(THEME_COLOR_KEY, color);
    setThemeColor(color);
  };

  const updateCSSVariables = (color: string) => {
    document.documentElement.style.setProperty('--theme-color', color);
    document.documentElement.style.setProperty(
      '--theme-color-rgb',
      hexToRgb(color).join(', ')
    );
  };

  const hexToRgb = (hex: string): number[] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16),
        ]
      : [0, 255, 157]; // Default green
  };

  return {
    themeColor,
    updateThemeColor,
  };
}