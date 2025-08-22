'use client'

import dynamic from 'next/dynamic'

// Dynamically import the map component to avoid SSR issues with Leaflet
const Map = dynamic(() => import('./event-map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    </div>
  ),
})

export default Map