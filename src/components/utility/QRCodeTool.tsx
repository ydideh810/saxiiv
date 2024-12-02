import React, { useState, useRef, useEffect } from 'react';
import { QrCode, Camera, Copy, Download, X } from 'lucide-react';
import QRCode from 'qrcode';
import { get, set } from 'idb-keyval';

interface QRHistory {
  id: string;
  content: string;
  type: 'generated' | 'scanned';
  timestamp: Date;
}

export function QRCodeTool() {
  const [mode, setMode] = useState<'generate' | 'scan'>('generate');
  const [content, setContent] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [history, setHistory] = useState<QRHistory[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    loadHistory();
    return () => {
      stopScanning();
    };
  }, []);

  const loadHistory = async () => {
    const stored = await get('qr_history') || [];
    setHistory(stored.map((item: QRHistory) => ({
      ...item,
      timestamp: new Date(item.timestamp)
    })));
  };

  const saveToHistory = async (content: string, type: 'generated' | 'scanned') => {
    const item: QRHistory = {
      id: `qr_${Date.now()}`,
      content,
      type,
      timestamp: new Date(),
    };
    const updated = [item, ...history].slice(0, 10);
    await set('qr_history', updated);
    setHistory(updated);
  };

  const generateQR = async () => {
    if (!content.trim()) return;
    
    try {
      const url = await QRCode.toDataURL(content, {
        width: 300,
        margin: 2,
        color: {
          dark: '#00ff9d',
          light: '#000000',
        },
      });
      setQrDataUrl(url);
      await saveToHistory(content, 'generated');
      setError(null);
    } catch (err) {
      setError('Failed to generate QR code');
      console.error(err);
    }
  };

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsScanning(true);
        scanQRCode();
      }
    } catch (err) {
      setError('Failed to access camera');
      console.error(err);
    }
  };

  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const scanQRCode = async () => {
    if (!videoRef.current || !canvasRef.current || !isScanning) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Wait for video to be ready
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      try {
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        // Here you would typically use a QR code detection library
        // For now, we'll simulate a scan after 3 seconds
        setTimeout(async () => {
          if (isScanning) {
            const scannedContent = 'Example scanned content';
            await saveToHistory(scannedContent, 'scanned');
            stopScanning();
            setContent(scannedContent);
          }
        }, 3000);
      } catch (err) {
        console.error('QR scan error:', err);
      }
    }

    if (isScanning) {
      requestAnimationFrame(scanQRCode);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      setError('Failed to copy to clipboard');
      console.error(err);
    }
  };

  const downloadQR = () => {
    if (!qrDataUrl) return;
    
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = 'qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-full p-4">
      <div className="mb-4 pb-2 border-b border-[#00ff9d] flex items-center gap-2">
        <QrCode className="h-4 w-4" />
        <h2 className="terminal-text text-xs">QR CODE TOOL</h2>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => setMode('generate')}
            className={`terminal-button px-4 py-2 ${
              mode === 'generate' ? 'bg-[#00ff9d]/20' : ''
            }`}
          >
            GENERATE
          </button>
          <button
            onClick={() => setMode('scan')}
            className={`terminal-button px-4 py-2 ${
              mode === 'scan' ? 'bg-[#00ff9d]/20' : ''
            }`}
          >
            SCAN
          </button>
        </div>

        {mode === 'generate' ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter text or URL..."
                className="terminal-input w-full"
              />
              <button
                onClick={generateQR}
                className="terminal-button w-full"
              >
                GENERATE QR CODE
              </button>
            </div>

            {qrDataUrl && (
              <div className="flex flex-col items-center gap-4 p-4 border border-[#00ff9d] rounded">
                <img
                  src={qrDataUrl}
                  alt="Generated QR Code"
                  className="max-w-[200px]"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(content)}
                    className="terminal-button p-2"
                    aria-label="Copy content"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={downloadQR}
                    className="terminal-button p-2"
                    aria-label="Download QR code"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative aspect-video border border-[#00ff9d] rounded overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <canvas
                ref={canvasRef}
                className="hidden"
              />
              {!isScanning && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                  <button
                    onClick={startScanning}
                    className="terminal-button p-4"
                  >
                    <Camera className="h-6 w-6" />
                  </button>
                </div>
              )}
            </div>

            {isScanning && (
              <button
                onClick={stopScanning}
                className="terminal-button w-full"
              >
                STOP SCANNING
              </button>
            )}
          </div>
        )}

        {error && (
          <p className="text-red-500 terminal-text text-[10px]">{error}</p>
        )}

        {history.length > 0 && (
          <div className="space-y-2">
            <h3 className="terminal-text text-[10px] text-[#00ff9d]/70">
              HISTORY:
            </h3>
            {history.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 p-2 border border-[#00ff9d] rounded"
              >
                <div className="flex-1">
                  <p className="terminal-text text-[10px] truncate">
                    {item.content}
                  </p>
                  <p className="terminal-text text-[8px] text-[#00ff9d]/70">
                    {item.type.toUpperCase()} • {item.timestamp.toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(item.content)}
                  className="terminal-button p-1"
                  aria-label="Copy to clipboard"
                >
                  <Copy className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}