'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Sidebar } from '@/components/layout/sidebar'
import { BackButton } from '@/components/ui/back-button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import DynamicMap from '@/components/map/dynamic-map'
import { 
  AlertTriangle, 
  Flame, 
  Heart, 
  Users, 
  Clock,
  CheckCircle,
  XCircle,
  Send,
  MapPin,
  Camera,
  TrendingUp
} from 'lucide-react'

// Mock incident data
const mockIncidents = {
  '1': {
    id: '1',
    type: 'crowd_surge' as const,
    location_lat: 40.7128,
    location_lng: -74.0060,
    status: 'pending' as const,
    confidence_score: 0.85,
    description: 'Large crowd gathering detected near main stage',
    created_at: new Date().toISOString(),
    photo_url: '/api/placeholder/400/300'
  },
  '2': {
    id: '2',
    type: 'fire_smoke' as const,
    location_lat: 40.7150,
    location_lng: -74.0050,
    status: 'verified' as const,
    confidence_score: 0.92,
    description: 'Smoke detected in food vendor area',
    created_at: new Date(Date.now() - 300000).toISOString(),
    photo_url: '/api/placeholder/400/300'
  },
  '3': {
    id: '3',
    type: 'medical' as const,
    location_lat: 40.7140,
    location_lng: -74.0070,
    status: 'dispatched' as const,
    confidence_score: 0.78,
    description: 'Medical assistance needed',
    created_at: new Date(Date.now() - 600000).toISOString(),
    photo_url: '/api/placeholder/400/300'
  }
}

export default function IncidentDetailPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [incident, setIncident] = useState<any>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const incidentId = params.id as string

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }
    
    // Load incident data
    const incidentData = mockIncidents[incidentId as keyof typeof mockIncidents]
    if (incidentData) {
      setIncident(incidentData)
    } else {
      router.push('/dashboard')
    }
  }, [user, loading, router, incidentId])

  const getIncidentIcon = (type: string) => {
    switch (type) {
      case 'crowd_surge':
        return Users
      case 'fire_smoke':
        return Flame
      case 'medical':
        return Heart
      default:
        return AlertTriangle
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500'
      case 'verified':
        return 'bg-orange-500'
      case 'dispatched':
        return 'bg-blue-500'
      case 'resolved':
        return 'bg-green-500'
      case 'cancelled':
        return 'bg-gray-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'crowd_surge':
        return 'bg-red-500'
      case 'fire_smoke':
        return 'bg-orange-500'
      case 'medical':
        return 'bg-blue-500'
      default:
        return 'bg-gray-500'
    }
  }

  const handleDispatch = async () => {
    setIsUpdating(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setIncident({
        ...incident,
        status: 'dispatched'
      })
      
      // Show success message
      alert('Responders have been dispatched to the incident location')
    } catch (error) {
      alert('Failed to dispatch responders')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleVerify = async () => {
    setIsUpdating(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setIncident({
        ...incident,
        status: 'verified'
      })
      
      alert('Incident has been verified')
    } catch (error) {
      alert('Failed to verify incident')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCancel = async () => {
    setIsUpdating(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setIncident({
        ...incident,
        status: 'cancelled'
      })
      
      alert('Incident has been cancelled')
    } catch (error) {
      alert('Failed to cancel incident')
    } finally {
      setIsUpdating(false)
    }
  }

  if (loading || !incident) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading incident details...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const Icon = getIncidentIcon(incident.type)

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <div className="lg:pl-72">
        <div className="p-6">
          <BackButton href="/dashboard" className="mb-6" />
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-lg ${getTypeColor(incident.type)}`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold capitalize">
                  {incident.type.replace('_', ' ')} Incident
                </h1>
                <p className="text-muted-foreground">
                  Incident ID: {incident.id}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(incident.status)}>
                {incident.status}
              </Badge>
              <Badge variant="outline">
                {Math.round(incident.confidence_score * 100)}% confidence
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Incident Details */}
            <div className="space-y-6">
              {/* Photo */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Camera className="mr-2 h-5 w-5" />
                    Incident Photo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted rounded-lg aspect-video flex items-center justify-center">
                    <p className="text-muted-foreground">Incident photo would be displayed here</p>
                  </div>
                </CardContent>
              </Card>

              {/* Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Incident Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Type</label>
                    <p className="capitalize">{incident.type.replace('_', ' ')}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Description</label>
                    <p>{incident.description}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Detected At</label>
                    <p>{new Date(incident.created_at).toLocaleString()}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">AI Confidence Score</label>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${incident.confidence_score * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {Math.round(incident.confidence_score * 100)}%
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Location</label>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{incident.location_lat.toFixed(6)}, {incident.location_lng.toFixed(6)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-3">
                    {incident.status === 'pending' && (
                      <>
                        <Button 
                          onClick={handleVerify}
                          disabled={isUpdating}
                          className="flex-1"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Verify
                        </Button>
                        <Button 
                          onClick={handleDispatch}
                          disabled={isUpdating}
                          className="flex-1"
                        >
                          <Send className="mr-2 h-4 w-4" />
                          Dispatch
                        </Button>
                      </>
                    )}
                    
                    {incident.status === 'verified' && (
                      <Button 
                        onClick={handleDispatch}
                        disabled={isUpdating}
                        className="flex-1"
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Dispatch
                      </Button>
                    )}
                    
                    {incident.status !== 'cancelled' && incident.status !== 'resolved' && (
                      <Button 
                        variant="destructive"
                        onClick={handleCancel}
                        disabled={isUpdating}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Map */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="mr-2 h-5 w-5" />
                    Incident Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96 w-full">
                    <DynamicMap
                      incidents={[incident]}
                      center={[incident.location_lat, incident.location_lng]}
                      zoom={16}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}