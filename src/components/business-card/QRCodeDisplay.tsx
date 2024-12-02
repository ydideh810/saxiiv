import React from 'react';
import QRCode from 'qrcode';
import { BusinessCardData } from '../../types/business-card';

interface QRCodeDisplayProps {
  data: BusinessCardData;
}

export function QRCodeDisplay({ data }: QRCodeDisplayProps) {
  const [qrUrl, setQrUrl] = React.useState<string>('');

  React.useEffect(() => {
    generateQR();
  }, [data]);

  const generateQR = async () => {
    try {
      const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${data.name}
TITLE:${data.title}
ORG:${data.company}
TEL:${data.phone}
EMAIL:${data.email}
URL:${data.website}
END:VCARD`;

      const url = await QRCode.toDataURL(vCardData, {
        width: 128,
        margin: 1,
        color: {
          dark: '#00ff9d',
          light: '#000000',
        },
      });
      setQrUrl(url);
    } catch (err) {
      console.error('QR generation error:', err);
    }
  };

  return (
    <div className="flex justify-center p-4 border border-[var(--theme-color)] rounded">
      {qrUrl && (
        <img
          src={qrUrl}
          alt="Business Card QR Code"
          className="w-32 h-32"
        />
      )}
    </div>
  );
}