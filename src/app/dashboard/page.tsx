'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { createSupabaseClient } from '@/lib/supabaseClient';
import type { LatLngExpression } from 'leaflet';
import BackButton from '@/components/BackButton';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

interface Responder {
  id: string;
  name: string;
  location: LatLngExpression;
}

export default function DashboardPage() {
  const supabase = createSupabaseClient();
  const [responders, setResponders] = useState<Responder[]>([]);

  useEffect(() => {
    // TODO: subscribe to realtime responder locations
    // For now static example
    setResponders([
      { id: '1', name: 'Responder 1', location: [37.7749, -122.4194] },
      { id: '2', name: 'Responder 2', location: [37.7849, -122.4094] },
    ]);
  }, []);

  return (
    <div className="space-y-6">
      <BackButton hidden />
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-96">
          <Map responders={responders} />
        </div>
        <div className="space-y-4">
          <section className="bg-white dark:bg-gray-800 p-4 rounded shadow">
            <h2 className="font-semibold mb-2">Live Video Feed</h2>
            <div className="w-full h-48 bg-black flex items-center justify-center text-gray-400">
              Video Placeholder
            </div>
          </section>
          <section className="bg-white dark:bg-gray-800 p-4 rounded shadow">
            <h2 className="font-semibold mb-2">AI Summaries</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">No incidents yet.</p>
          </section>
          <section className="bg-white dark:bg-gray-800 p-4 rounded shadow">
            <h2 className="font-semibold mb-2">Alerts</h2>
            <ul className="space-y-2">
              {['Crowd Surge', 'Fire/Smoke', 'Medical'].map((alert) => (
                <li
                  key={alert}
                  className="px-3 py-2 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm font-medium"
                >
                  {alert}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}