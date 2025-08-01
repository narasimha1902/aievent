'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { BackButton } from '@/components/ui/back-button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import DynamicMap from '@/components/map/dynamic-map'
import { 
  MapPin, 
  Navigation, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Phone,
  MessageSquare
} from 'lucide-react'

// Mock assignment data
const mockAssignment = {
  id: 'assignment-1',
  incident: {
    id: '2',
    type: 'fire_smoke' as const,
    location_lat: 40.7150,
    location_lng: -74.0050,
    status: 'dispatched' as const,
    confidence_score: 0.92,
    description: 'Smoke detected in food vendor area',
    created_at: new Date(Date.now() - 300000).toISOString(),
  },
  assigned_at: new Date(Date.now() - 120000).toISOString(),
  eta_minutes: 5,
  status: 'pending' as const // pending, accepted, declined, en_route, arrived, completed
}

export default function ResponderPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [assignment, setAssignment] = useState(mockAssignment)
  const [responderLocation, setResponderLocation] = useState({ lat: 40.7135, lng: -74.0055 })
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }
    
    if (user && user.role !== 'responder') {
      router.push('/dashboard')
      return
    }
  }, [user, loading, router])

  useEffect(() => {
    // Simulate getting current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setResponderLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.error('Error getting location:', error)
        }
      )
    }
  }, [])

  const handleAccept = async () => {
    setIsUpdating(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setAssignment({
        ...assignment,
        status: 'accepted'
      })
      
      alert('Assignment accepted. Navigate to the incident location.')
    } catch (error) {
      alert('Failed to accept assignment')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDecline = async () => {
    setIsUpdating(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setAssignment({
        ...assignment,
        status: 'declined'
      })
      
      alert('Assignment declined.')
    } catch (error) {
      alert('Failed to decline assignment')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleEnRoute = async () => {
    setIsUpdating(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setAssignment({
        ...assignment,
        status: 'en_route'
      })
      
      alert('Status updated: En route to incident')
    } catch (error) {
      alert('Failed to update status')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleArrived = async () => {
    setIsUpdating(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setAssignment({
        ...assignment,
        status: 'arrived'
      })
      
      alert('Status updated: Arrived at scene')
    } catch (error) {
      alert('Failed to update status')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCompleted = async () => {
    setIsUpdating(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setAssignment({
        ...assignment,
        status: 'completed'
      })
      
      alert('Incident resolved successfully')
    } catch (error) {
      alert('Failed to update status')
    } finally {
      setIsUpdating(false)
    }
  }

  const openDirections = () => {
    const { incident } = assignment
    const url = `https://www.google.com/maps/dir/?api=1&destination=${incident.location_lat},${incident.location_lng}&travelmode=driving`
    window.open(url, '_blank')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500'
      case 'accepted':
        return 'bg-blue-500'
      case 'declined':
        return 'bg-red-500'
      case 'en_route':
        return 'bg-orange-500'
      case 'arrived':
        return 'bg-purple-500'
      case 'completed':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading assignment...</p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== 'responder') {
    return null
  }

  return (
    <div className="min-h-screen bg-background p-4 max-w-md mx-auto">
      <BackButton href="/dashboard" className="mb-4" />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold">Incident Assignment</h1>
          <p className="text-muted-foreground">Respond to emergency incident</p>
        </div>

        {/* Status */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Assignment Status</span>
              <Badge className={getStatusColor(assignment.status)}>
                {assignment.status.replace('_', ' ')}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Incident Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Incident Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Type</label>
              <p className="capitalize">{assignment.incident.type.replace('_', ' ')}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Description</label>
              <p>{assignment.incident.description}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Assigned</label>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{new Date(assignment.assigned_at).toLocaleTimeString()}</span>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">ETA</label>
              <p>{assignment.eta_minutes} minutes</p>
            </div>
          </CardContent>
        </Card>

        {/* Map */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Incident Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full mb-4">
              <DynamicMap
                incidents={[assignment.incident]}
                responders={[{
                  id: 'current-responder',
                  user_id: user.id,
                  location_lat: responderLocation.lat,
                  location_lng: responderLocation.lng,
                  status: 'available',
                  zone_id: 'zone1',
                  user: { full_name: user.full_name }
                }]}
                center={[assignment.incident.location_lat, assignment.incident.location_lng]}
                zoom={15}
              />
            </div>
            
            <Button 
              className="w-full"
              onClick={openDirections}
            >
              <Navigation className="mr-2 h-4 w-4" />
              Get Directions
            </Button>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {assignment.status === 'pending' && (
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    onClick={handleAccept}
                    disabled={isUpdating}
                    className="w-full"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Accept
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={handleDecline}
                    disabled={isUpdating}
                    className="w-full"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Decline
                  </Button>
                </div>
              )}
              
              {assignment.status === 'accepted' && (
                <Button 
                  onClick={handleEnRoute}
                  disabled={isUpdating}
                  className="w-full"
                >
                  <Navigation className="mr-2 h-4 w-4" />
                  Mark En Route
                </Button>
              )}
              
              {assignment.status === 'en_route' && (
                <Button 
                  onClick={handleArrived}
                  disabled={isUpdating}
                  className="w-full"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Mark Arrived
                </Button>
              )}
              
              {assignment.status === 'arrived' && (
                <Button 
                  onClick={handleCompleted}
                  disabled={isUpdating}
                  className="w-full"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark Completed
                </Button>
              )}
              
              {assignment.status !== 'declined' && assignment.status !== 'completed' && (
                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                  <Button variant="outline" size="sm" className="w-full">
                    <Phone className="mr-2 h-4 w-4" />
                    Call Dispatch
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Message
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}