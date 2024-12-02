import React, { useState } from 'react';
import { ClipboardManager } from './ClipboardManager';
import { OfflineTranslator } from './OfflineTranslator';
import { ExpenseTracker } from './ExpenseTracker';
import { QRCodeTool } from './QRCodeTool';
import { InteractiveMap } from './InteractiveMap';

const UTILITIES = [
  { id: 'clipboard', name: 'CLIPBOARD MANAGER' },
  { id: 'translator', name: 'OFFLINE TRANSLATOR' },
  { id: 'expenses', name: 'EXPENSE TRACKER' },
  { id: 'qrcode', name: 'QR CODE TOOL' },
  { id: 'map', name: 'INTERACTIVE MAP' },
] as const;

export function UtilityManager() {
  const [activeUtil, setActiveUtil] = useState<typeof UTILITIES[number]['id']>('clipboard');

  const renderUtility = () => {
    switch (activeUtil) {
      case 'clipboard':
        return <ClipboardManager />;
      case 'translator':
        return <OfflineTranslator />;
      case 'expenses':
        return <ExpenseTracker />;
      case 'qrcode':
        return <QRCodeTool />;
      case 'map':
        return <InteractiveMap />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col max-h-screen overflow-hidden">
      {/* Horizontally scrollable utility buttons */}
      <div className="flex-shrink-0 overflow-x-auto scrollbar-thin -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex flex-nowrap gap-2 pb-4">
          {UTILITIES.map((util) => (
            <button
              key={util.id}
              onClick={() => setActiveUtil(util.id)}
              className={`
                terminal-button px-3 py-1 text-[8px] md:text-[10px] whitespace-nowrap
                flex-shrink-0
                ${activeUtil === util.id ? 'bg-[var(--theme-color)]/20' : ''}
              `}
            >
              {util.name}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable content area with padding */}
      <div className="flex-1 min-h-0 overflow-y-auto -mx-4 px-4 md:mx-0 md:px-0">
        {renderUtility()}
      </div>
    </div>
  );
}