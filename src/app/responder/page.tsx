'use client';

import BackButton from '@/components/BackButton';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import type { LatLngExpression } from 'leaflet';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function ResponderView() {
  const [destination] = useState<LatLngExpression>([37.7749, -122.4194]);
  return (
    <div className="space-y-4">
      <BackButton />
      <h1 className="text-2xl font-bold mb-4">Responder Route</h1>
      <div className="h-96">
        <Map responders={[{ id: 'dest', name: 'Incident', location: destination }]} />
      </div>
      <div className="space-x-2 mt-4">
        <button className="px-4 py-2 bg-green-600 text-white rounded">Accept</button>
        <button className="px-4 py-2 bg-gray-600 text-white rounded">Decline</button>
      </div>
    </div>
  );
}