'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
})

// Custom icons
const responderIcon = new L.Icon({
  iconUrl: '/icons/responder-marker.png',
  iconRetinaUrl: '/icons/responder-marker-2x.png',
  shadowUrl: '/leaflet/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'responder-marker'
})

const incidentIcon = new L.Icon({
  iconUrl: '/icons/incident-marker.png',
  iconRetinaUrl: '/icons/incident-marker-2x.png',
  shadowUrl: '/leaflet/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'incident-marker'
})

interface Responder {
  id: string
  user_id: string
  location_lat: number
  location_lng: number
  status: 'available' | 'busy' | 'offline'
  user?: {
    full_name: string
  }
}

interface Incident {
  id: string
  type: 'crowd_surge' | 'fire_smoke' | 'medical'
  location_lat: number
  location_lng: number
  status: 'pending' | 'verified' | 'dispatched' | 'resolved' | 'cancelled'
  confidence_score: number
  description: string
}

interface EventMapProps {
  responders?: Responder[]
  incidents?: Incident[]
  center?: [number, number]
  zoom?: number
  onIncidentClick?: (incident: Incident) => void
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap()
  
  useEffect(() => {
    map.setView(center)
  }, [center, map])
  
  return null
}

export default function EventMap({ 
  responders = [], 
  incidents = [], 
  center = [40.7128, -74.0060], // Default to NYC
  zoom = 13,
  onIncidentClick 
}: EventMapProps) {
  const [mapReady, setMapReady] = useState(false)

  const getIncidentColor = (type: string) => {
    switch (type) {
      case 'crowd_surge':
        return '#ff6b6b'
      case 'fire_smoke':
        return '#ff8c42'
      case 'medical':
        return '#4ecdc4'
      default:
        return '#95a5a6'
    }
  }

  const getResponderColor = (status: string) => {
    switch (status) {
      case 'available':
        return '#2ecc71'
      case 'busy':
        return '#f39c12'
      case 'offline':
        return '#95a5a6'
      default:
        return '#95a5a6'
    }
  }

  return (
    <div className="w-full h-full rounded-lg overflow-hidden">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        whenReady={() => setMapReady(true)}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater center={center} />
        
        {/* Render responders */}
        {responders.map((responder) => (
          <Marker
            key={responder.id}
            position={[responder.location_lat, responder.location_lng]}
            icon={L.divIcon({
              className: 'responder-marker',
              html: `<div style="background-color: ${getResponderColor(responder.status)}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            })}
          >
            <Popup>
              <div className="text-sm">
                <h3 className="font-semibold">
                  {responder.user?.full_name || 'Responder'}
                </h3>
                <p className="capitalize">Status: {responder.status}</p>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Render incidents */}
        {incidents.map((incident) => (
          <Marker
            key={incident.id}
            position={[incident.location_lat, incident.location_lng]}
            icon={L.divIcon({
              className: 'incident-marker',
              html: `<div style="background-color: ${getIncidentColor(incident.type)}; width: 24px; height: 24px; border-radius: 4px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 10px;">!</div>`,
              iconSize: [24, 24],
              iconAnchor: [12, 12]
            })}
            eventHandlers={{
              click: () => onIncidentClick?.(incident)
            }}
          >
            <Popup>
              <div className="text-sm">
                <h3 className="font-semibold capitalize">
                  {incident.type.replace('_', ' ')}
                </h3>
                <p>Confidence: {Math.round(incident.confidence_score * 100)}%</p>
                <p className="capitalize">Status: {incident.status}</p>
                <p>{incident.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}