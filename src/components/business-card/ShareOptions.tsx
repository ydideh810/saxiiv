import React from 'react';
import { Mail, Smartphone, Download, X } from 'lucide-react';
import { BusinessCardData } from '../../types/business-card';

interface ShareOptionsProps {
  cardData: BusinessCardData;
  onClose: () => void;
}

export function ShareOptions({ cardData, onClose }: ShareOptionsProps) {
  const handleEmailShare = () => {
    const subject = `Business Card - ${cardData.name}`;
    const body = `
Name: ${cardData.name}
Title: ${cardData.title}
Company: ${cardData.company}
Email: ${cardData.email}
Phone: ${cardData.phone}
Website: ${cardData.website}
    `.trim();

    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleSMSShare = () => {
    const text = `${cardData.name} - ${cardData.title} at ${cardData.company}\n${cardData.phone}\n${cardData.email}`;
    window.location.href = `sms:?body=${encodeURIComponent(text)}`;
  };

  const handleDownload = () => {
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${cardData.name}
TITLE:${cardData.title}
ORG:${cardData.company}
TEL:${cardData.phone}
EMAIL:${cardData.email}
URL:${cardData.website}
END:VCARD`;

    const blob = new Blob([vCardData], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${cardData.name.replace(/\s+/g, '_')}_card.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-black border border-[var(--theme-color)] rounded-lg p-4 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 terminal-button p-1"
          aria-label="Close sharing options"
        >
          <X className="h-4 w-4" />
        </button>

        <h2 className="terminal-text text-xs mb-4">SHARE BUSINESS CARD</h2>

        <div className="space-y-2">
          <button
            onClick={handleEmailShare}
            className="terminal-button w-full flex items-center gap-2 p-2"
          >
            <Mail className="h-4 w-4" />
            <span className="terminal-text text-[10px]">SHARE VIA EMAIL</span>
          </button>

          <button
            onClick={handleSMSShare}
            className="terminal-button w-full flex items-center gap-2 p-2"
          >
            <Smartphone className="h-4 w-4" />
            <span className="terminal-text text-[10px]">SHARE VIA SMS</span>
          </button>

          <button
            onClick={handleDownload}
            className="terminal-button w-full flex items-center gap-2 p-2"
          >
            <Download className="h-4 w-4" />
            <span className="terminal-text text-[10px]">DOWNLOAD VCARD</span>
          </button>
        </div>
      </div>
    </div>
  );
}