'use client';

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';

interface MapProps {
  responders: { id: string; name: string; location: LatLngExpression }[];
}

export default function Map({ responders }: MapProps) {
  return (
    <MapContainer center={[37.7749, -122.4194]} zoom={13} className="w-full h-full z-0 rounded">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {responders.map((r) => (
        <Marker key={r.id} position={r.location as LatLngExpression}>
          <Popup>{r.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}