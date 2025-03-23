import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Add CSS directly in a separate style block
const mapStyles = `
  .custom-div-icon {
    background: none;
    border: none;
  }
  .custom-popup .leaflet-popup-content-wrapper {
    border-radius: 0.5rem;
    padding: 0.5rem;
  }
  .custom-popup .leaflet-popup-tip {
    display: none;
  }
  .leaflet-control-attribution {
    font-size: 10px;
    background-color: rgba(255, 255, 255, 0.8) !important;
    padding: 2px 5px !important;
    border-radius: 3px !important;
  }
`;

interface MapMarker {
  position: [number, number];
  type: 'user' | 'store';
  label?: string;
  popup?: string;
}

interface MapProps {
  center?: [number, number] | null;
  markers: MapMarker[];
  zoom?: number;
}

const DEFAULT_CENTER: [number, number] = [17.4987155, 78.4290042]; // Hyderabad
const DEFAULT_ZOOM = 13;

export default function Map({ center = DEFAULT_CENTER, markers, zoom = DEFAULT_ZOOM }: MapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Add styles to document head
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = mapStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Cleanup function
  const cleanup = () => {
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }
  };

  useEffect(() => {
    if (!isClient || !mapContainerRef.current) return;

    // Cleanup previous map instance
    cleanup();

    // Initialize map
    mapRef.current = L.map(mapContainerRef.current, {
      attributionControl: false  // Disable default attribution
    }).setView(center || DEFAULT_CENTER, zoom);
    
    // Add custom attribution as plain text
    const attribution = L.control({ position: 'bottomright' });
    attribution.onAdd = () => {
      const div = L.DomUtil.create('div', 'leaflet-control-attribution');
      div.innerHTML = 'Map data © OpenStreetMap contributors';
      return div;
    };
    attribution.addTo(mapRef.current);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: ''  // Empty attribution since we're using custom one
    }).addTo(mapRef.current);

    // Update center and markers
    mapRef.current.setView(center || DEFAULT_CENTER, zoom);
    
    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    const bounds = L.latLngBounds([]);
    
    markers.forEach(marker => {
      const icon = marker.type === 'user' 
        ? L.divIcon({
            html: '<div class="w-4 h-4 rounded-full bg-primary border-2 border-white"></div>',
            className: 'custom-div-icon',
          })
        : L.divIcon({
            html: `<div class="flex items-center justify-center w-6 h-6 rounded-full bg-white shadow-md text-sm font-medium">
                    ${marker.label || ''}
                  </div>`,
            className: 'custom-div-icon',
          });

      const newMarker = L.marker(marker.position, { icon })
        .addTo(mapRef.current!);

      if (marker.popup) {
        newMarker.bindPopup(marker.popup, {
          className: 'custom-popup',
          closeButton: false,
          offset: [0, -10]
        }).openPopup();
      }

      markersRef.current.push(newMarker);
      bounds.extend(marker.position);
    });

    // Fit bounds if there are markers
    if (markers.length > 0) {
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }

    return cleanup;
  }, [center, markers, zoom, isClient]);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-full bg-muted">
        <div className="text-center space-y-2">
          <div className="h-8 w-8 animate-spin mx-auto border-4 border-primary border-t-transparent rounded-full" />
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  return <div ref={mapContainerRef} className="h-full w-full" />;
} 