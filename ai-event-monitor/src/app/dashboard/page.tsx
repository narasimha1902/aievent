'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import DynamicMap from '@/components/map/dynamic-map'
import { 
  AlertTriangle, 
  Flame, 
  Heart, 
  Users, 
  Clock,
  CheckCircle,
  XCircle,
  Play,
  Moon,
  Sun
} from 'lucide-react'
import { useTheme } from 'next-themes'

// Mock data - in real app this would come from Supabase
const mockIncidents = [
  {
    id: '1',
    type: 'crowd_surge' as const,
    location_lat: 40.7128,
    location_lng: -74.0060,
    status: 'pending' as const,
    confidence_score: 0.85,
    description: 'Large crowd gathering detected near main stage',
    created_at: new Date().toISOString(),
    photo_url: '/incidents/crowd1.jpg'
  },
  {
    id: '2',
    type: 'fire_smoke' as const,
    location_lat: 40.7150,
    location_lng: -74.0050,
    status: 'verified' as const,
    confidence_score: 0.92,
    description: 'Smoke detected in food vendor area',
    created_at: new Date(Date.now() - 300000).toISOString(),
    photo_url: '/incidents/smoke1.jpg'
  },
  {
    id: '3',
    type: 'medical' as const,
    location_lat: 40.7140,
    location_lng: -74.0070,
    status: 'dispatched' as const,
    confidence_score: 0.78,
    description: 'Medical assistance needed',
    created_at: new Date(Date.now() - 600000).toISOString(),
    photo_url: '/incidents/medical1.jpg'
  }
]

const mockResponders = [
  {
    id: '1',
    user_id: 'resp1',
    location_lat: 40.7135,
    location_lng: -74.0055,
    status: 'available' as const,
    zone_id: 'zone1',
    user: { full_name: 'John Smith' }
  },
  {
    id: '2',
    user_id: 'resp2',
    location_lat: 40.7145,
    location_lng: -74.0065,
    status: 'busy' as const,
    zone_id: 'zone1',
    user: { full_name: 'Sarah Johnson' }
  }
]

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [incidents, setIncidents] = useState(mockIncidents)
  const [responders, setResponders] = useState(mockResponders)
  const [aiSummary, setAiSummary] = useState('')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }
  }, [user, loading, router])

  useEffect(() => {
    // Generate AI summary based on incidents
    const generateSummary = () => {
      const totalIncidents = incidents.length
      const pendingIncidents = incidents.filter(i => i.status === 'pending').length
      const highRiskIncidents = incidents.filter(i => i.confidence_score > 0.8).length
      
      return `Current event status: ${totalIncidents} active incidents detected. ${pendingIncidents} incidents require immediate attention. ${highRiskIncidents} high-confidence alerts identified. Crowd density appears elevated in sector A. Recommend increasing responder coverage near main stage area.`
    }
    
    setAiSummary(generateSummary())
  }, [incidents])

  const handleIncidentClick = (incident: any) => {
    router.push(`/incidents/${incident.id}`)
  }

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
        return 'text-yellow-500'
      case 'verified':
        return 'text-orange-500'
      case 'dispatched':
        return 'text-blue-500'
      case 'resolved':
        return 'text-green-500'
      case 'cancelled':
        return 'text-gray-500'
      default:
        return 'text-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <div className="lg:pl-72">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Event Dashboard</h1>
              <p className="text-muted-foreground">
                Real-time monitoring and incident management
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map Section */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5" />
                    Live Event Map
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96 w-full">
                    <DynamicMap
                      responders={responders}
                      incidents={incidents}
                      center={[40.7128, -74.0060]}
                      zoom={14}
                      onIncidentClick={handleIncidentClick}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* AI Summary */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Play className="mr-2 h-5 w-5" />
                    AI-Generated Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm">{aiSummary}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Live Video Feed Preview */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Play className="mr-2 h-5 w-5" />
                    Live Video Feed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-black rounded-lg aspect-video flex items-center justify-center">
                    <p className="text-white">Video feed would be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Alert Cards Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Active Incidents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {incidents.map((incident) => {
                    const Icon = getIncidentIcon(incident.type)
                    return (
                      <div
                        key={incident.id}
                        className="p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => handleIncidentClick(incident)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium capitalize">
                                {incident.type.replace('_', ' ')}
                              </h4>
                              <span className={`text-xs capitalize ${getStatusColor(incident.status)}`}>
                                {incident.status}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {incident.description}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-muted-foreground">
                                Confidence: {Math.round(incident.confidence_score * 100)}%
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(incident.created_at).toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Available</p>
                        <p className="text-xs text-muted-foreground">
                          {responders.filter(r => r.status === 'available').length} responders
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                        <Clock className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Pending</p>
                        <p className="text-xs text-muted-foreground">
                          {incidents.filter(i => i.status === 'pending').length} incidents
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}