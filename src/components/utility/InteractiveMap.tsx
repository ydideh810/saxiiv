import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Map as MapIcon, Compass, Navigation, Crosshair } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icon with theme color
const customIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${getComputedStyle(document.documentElement).getPropertyValue('--theme-color')}">
      <circle cx="12" cy="12" r="10"/>
    </svg>
  `),
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

function LocationMarker() {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const map = useMap();

  useEffect(() => {
    map.locate().on("locationfound", function (e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    });
  }, [map]);

  return position === null ? null : (
    <Marker position={position} icon={customIcon}>
      <Popup>You are here</Popup>
    </Marker>
  );
}

export function InteractiveMap() {
  const [center, setCenter] = useState<[number, number]>([51.505, -0.09]);
  const [isLocating, setIsLocating] = useState(false);

  const handleLocateMe = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter([position.coords.latitude, position.coords.longitude]);
          setIsLocating(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLocating(false);
        }
      );
    }
  };

  return (
    <div className="h-full p-4">
      <div className="mb-4 pb-2 border-b border-[var(--theme-color)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapIcon className="h-4 w-4" />
          <h2 className="terminal-text text-xs">INTERACTIVE MAP</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleLocateMe}
            className={`terminal-button p-2 ${isLocating ? 'animate-pulse' : ''}`}
            disabled={isLocating}
          >
            {isLocating ? (
              <Compass className="h-4 w-4 animate-spin" />
            ) : (
              <Navigation className="h-4 w-4" />
            )}
          </button>
          <button className="terminal-button p-2">
            <Crosshair className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="h-[calc(100%-4rem)] border border-[var(--theme-color)] rounded overflow-hidden">
        <MapContainer
          center={center}
          zoom={13}
          className="h-full w-full"
          style={{ background: '#000' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker />
        </MapContainer>
      </div>
    </div>
  );
}