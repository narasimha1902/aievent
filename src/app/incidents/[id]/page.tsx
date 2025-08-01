'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createSupabaseClient } from '@/lib/supabaseClient';
import BackButton from '@/components/BackButton';
import Image from 'next/image';

interface Incident {
  id: string;
  type: string;
  time: string;
  confidence: number;
  photo_url: string;
}

export default function IncidentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const supabase = createSupabaseClient();
  const router = useRouter();
  const [incident, setIncident] = useState<Incident | null>(null);

  useEffect(() => {
    // Fetch incident by id
    async function fetchIncident() {
      // Placeholder fetch
      setIncident({
        id,
        type: 'Crowd Surge',
        time: new Date().toISOString(),
        confidence: 0.92,
        photo_url: 'https://placehold.co/600x400',
      });
    }
    fetchIncident();
  }, [id]);

  if (!incident) return <p>Loading...</p>;

  return (
    <div className="space-y-4">
      <BackButton />
      <h1 className="text-2xl font-bold">Incident Detail</h1>
      <Image src={incident.photo_url} alt="Incident Photo" width={600} height={400} className="rounded" />
      <p>Type: {incident.type}</p>
      <p>Time: {new Date(incident.time).toLocaleString()}</p>
      <p>Confidence: {(incident.confidence * 100).toFixed(1)}%</p>
      <div className="space-x-2 mt-4">
        <button className="px-4 py-2 bg-green-600 text-white rounded">Dispatch</button>
        <button className="px-4 py-2 bg-yellow-500 text-white rounded">Verify</button>
        <button className="px-4 py-2 bg-gray-600 text-white rounded">Cancel</button>
      </div>
    </div>
  );
}