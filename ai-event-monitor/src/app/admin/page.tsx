'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { BackButton } from '@/components/ui/back-button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  Users, 
  MapPin, 
  Download, 
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Brain,
  ToggleLeft,
  ToggleRight
} from 'lucide-react'

// Mock data
const mockResponders = [
  {
    id: '1',
    user_id: 'user1',
    full_name: 'John Smith',
    email: 'john@example.com',
    phone_number: '+1234567890',
    status: 'available' as const,
    zone_id: 'zone1',
    zone_name: 'Zone A'
  },
  {
    id: '2',
    user_id: 'user2',
    full_name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone_number: '+1234567891',
    status: 'busy' as const,
    zone_id: 'zone2',
    zone_name: 'Zone B'
  }
]

const mockZones = [
  {
    id: 'zone1',
    name: 'Zone A - Main Stage Area',
    description: 'Primary event area with main stage and VIP sections',
    responder_count: 5
  },
  {
    id: 'zone2',
    name: 'Zone B - Food Court',
    description: 'Food vendor area and dining spaces',
    responder_count: 3
  },
  {
    id: 'zone3',
    name: 'Zone C - Parking',
    description: 'Parking areas and transportation hubs',
    responder_count: 2
  }
]

const mockAISettings = {
  crowd_surge_threshold: 0.7,
  fire_smoke_threshold: 0.8,
  medical_threshold: 0.6,
  human_verification_enabled: true,
  auto_dispatch_enabled: false
}

export default function AdminPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('responders')
  const [responders, setResponders] = useState(mockResponders)
  const [zones, setZones] = useState(mockZones)
  const [aiSettings, setAISettings] = useState(mockAISettings)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }
    
    if (user && user.role !== 'admin') {
      router.push('/dashboard')
      return
    }
  }, [user, loading, router])

  const handleEditResponder = (responder: any) => {
    setEditingItem({ ...responder, type: 'responder' })
  }

  const handleEditZone = (zone: any) => {
    setEditingItem({ ...zone, type: 'zone' })
  }

  const handleSaveEdit = () => {
    if (editingItem.type === 'responder') {
      setResponders(responders.map(r => 
        r.id === editingItem.id ? { ...editingItem } : r
      ))
    } else if (editingItem.type === 'zone') {
      setZones(zones.map(z => 
        z.id === editingItem.id ? { ...editingItem } : z
      ))
    }
    setEditingItem(null)
  }

  const handleDeleteResponder = (id: string) => {
    if (confirm('Are you sure you want to remove this responder?')) {
      setResponders(responders.filter(r => r.id !== id))
    }
  }

  const handleDeleteZone = (id: string) => {
    if (confirm('Are you sure you want to delete this zone?')) {
      setZones(zones.filter(z => z.id !== id))
    }
  }

  const handleCreateNew = () => {
    if (activeTab === 'responders') {
      setEditingItem({
        type: 'responder',
        id: `new-${Date.now()}`,
        full_name: '',
        email: '',
        phone_number: '',
        status: 'available',
        zone_id: zones[0]?.id || '',
        zone_name: zones[0]?.name || ''
      })
    } else if (activeTab === 'zones') {
      setEditingItem({
        type: 'zone',
        id: `new-${Date.now()}`,
        name: '',
        description: '',
        responder_count: 0
      })
    }
    setIsCreating(true)
  }

  const handleSaveNew = () => {
    if (editingItem.type === 'responder') {
      const zone = zones.find(z => z.id === editingItem.zone_id)
      setResponders([...responders, {
        ...editingItem,
        zone_name: zone?.name || ''
      }])
    } else if (editingItem.type === 'zone') {
      setZones([...zones, editingItem])
    }
    setEditingItem(null)
    setIsCreating(false)
  }

  const exportReport = () => {
    const reportData = {
      responders,
      zones,
      aiSettings,
      exportedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `event-monitor-report-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <div className="lg:pl-72">
        <div className="p-6">
          <BackButton href="/dashboard" className="mb-6" />
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Admin Panel</h1>
              <p className="text-muted-foreground">
                Manage responders, zones, and system settings
              </p>
            </div>
            <Button onClick={exportReport}>
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 mb-6">
            <Button
              variant={activeTab === 'responders' ? 'default' : 'outline'}
              onClick={() => setActiveTab('responders')}
            >
              <Users className="mr-2 h-4 w-4" />
              Responders
            </Button>
            <Button
              variant={activeTab === 'zones' ? 'default' : 'outline'}
              onClick={() => setActiveTab('zones')}
            >
              <MapPin className="mr-2 h-4 w-4" />
              Zones
            </Button>
            <Button
              variant={activeTab === 'ai-settings' ? 'default' : 'outline'}
              onClick={() => setActiveTab('ai-settings')}
            >
              <Brain className="mr-2 h-4 w-4" />
              AI Settings
            </Button>
          </div>

          {/* Responders Tab */}
          {activeTab === 'responders' && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Responders Management</CardTitle>
                  <Button onClick={handleCreateNew}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Responder
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {responders.map((responder) => (
                    <div key={responder.id} className="p-4 border rounded-lg">
                      {editingItem?.id === responder.id ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">Full Name</label>
                              <Input
                                value={editingItem.full_name}
                                onChange={(e) => setEditingItem({...editingItem, full_name: e.target.value})}
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Email</label>
                              <Input
                                type="email"
                                value={editingItem.email}
                                onChange={(e) => setEditingItem({...editingItem, email: e.target.value})}
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Phone</label>
                              <Input
                                value={editingItem.phone_number}
                                onChange={(e) => setEditingItem({...editingItem, phone_number: e.target.value})}
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Status</label>
                              <Select
                                value={editingItem.status}
                                onChange={(e) => setEditingItem({...editingItem, status: e.target.value})}
                              >
                                <option value="available">Available</option>
                                <option value="busy">Busy</option>
                                <option value="offline">Offline</option>
                              </Select>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Zone</label>
                              <Select
                                value={editingItem.zone_id}
                                onChange={(e) => {
                                  const zone = zones.find(z => z.id === e.target.value)
                                  setEditingItem({
                                    ...editingItem, 
                                    zone_id: e.target.value,
                                    zone_name: zone?.name || ''
                                  })
                                }}
                              >
                                {zones.map(zone => (
                                  <option key={zone.id} value={zone.id}>{zone.name}</option>
                                ))}
                              </Select>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button onClick={isCreating ? handleSaveNew : handleSaveEdit}>
                              <Save className="mr-2 h-4 w-4" />
                              Save
                            </Button>
                            <Button variant="outline" onClick={() => {
                              setEditingItem(null)
                              setIsCreating(false)
                            }}>
                              <X className="mr-2 h-4 w-4" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{responder.full_name}</h3>
                            <p className="text-sm text-muted-foreground">{responder.email}</p>
                            <p className="text-sm text-muted-foreground">{responder.phone_number}</p>
                            <p className="text-sm text-muted-foreground">{responder.zone_name}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={responder.status === 'available' ? 'default' : 'secondary'}>
                              {responder.status}
                            </Badge>
                            <Button size="sm" variant="outline" onClick={() => handleEditResponder(responder)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteResponder(responder.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Zones Tab */}
          {activeTab === 'zones' && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Zones Management</CardTitle>
                  <Button onClick={handleCreateNew}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Zone
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {zones.map((zone) => (
                    <div key={zone.id} className="p-4 border rounded-lg">
                      {editingItem?.id === zone.id ? (
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium">Zone Name</label>
                            <Input
                              value={editingItem.name}
                              onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Description</label>
                            <Input
                              value={editingItem.description}
                              onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                            />
                          </div>
                          <div className="flex space-x-2">
                            <Button onClick={isCreating ? handleSaveNew : handleSaveEdit}>
                              <Save className="mr-2 h-4 w-4" />
                              Save
                            </Button>
                            <Button variant="outline" onClick={() => {
                              setEditingItem(null)
                              setIsCreating(false)
                            }}>
                              <X className="mr-2 h-4 w-4" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{zone.name}</h3>
                            <p className="text-sm text-muted-foreground">{zone.description}</p>
                            <p className="text-sm text-muted-foreground">{zone.responder_count} responders assigned</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline" onClick={() => handleEditZone(zone)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteZone(zone.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Settings Tab */}
          {activeTab === 'ai-settings' && (
            <Card>
              <CardHeader>
                <CardTitle>AI Model Thresholds</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Crowd Surge Detection Threshold</label>
                    <div className="flex items-center space-x-4 mt-2">
                      <Input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={aiSettings.crowd_surge_threshold}
                        onChange={(e) => setAISettings({...aiSettings, crowd_surge_threshold: parseFloat(e.target.value)})}
                        className="flex-1"
                      />
                      <span className="text-sm font-medium w-12">
                        {Math.round(aiSettings.crowd_surge_threshold * 100)}%
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Fire/Smoke Detection Threshold</label>
                    <div className="flex items-center space-x-4 mt-2">
                      <Input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={aiSettings.fire_smoke_threshold}
                        onChange={(e) => setAISettings({...aiSettings, fire_smoke_threshold: parseFloat(e.target.value)})}
                        className="flex-1"
                      />
                      <span className="text-sm font-medium w-12">
                        {Math.round(aiSettings.fire_smoke_threshold * 100)}%
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Medical Emergency Detection Threshold</label>
                    <div className="flex items-center space-x-4 mt-2">
                      <Input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={aiSettings.medical_threshold}
                        onChange={(e) => setAISettings({...aiSettings, medical_threshold: parseFloat(e.target.value)})}
                        className="flex-1"
                      />
                      <span className="text-sm font-medium w-12">
                        {Math.round(aiSettings.medical_threshold * 100)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Human Verification Required</h4>
                      <p className="text-sm text-muted-foreground">
                        Require human verification before dispatching responders
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAISettings({...aiSettings, human_verification_enabled: !aiSettings.human_verification_enabled})}
                    >
                      {aiSettings.human_verification_enabled ? (
                        <ToggleRight className="h-6 w-6 text-primary" />
                      ) : (
                        <ToggleLeft className="h-6 w-6 text-muted-foreground" />
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Auto-Dispatch</h4>
                      <p className="text-sm text-muted-foreground">
                        Automatically dispatch responders for high-confidence incidents
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAISettings({...aiSettings, auto_dispatch_enabled: !aiSettings.auto_dispatch_enabled})}
                    >
                      {aiSettings.auto_dispatch_enabled ? (
                        <ToggleRight className="h-6 w-6 text-primary" />
                      ) : (
                        <ToggleLeft className="h-6 w-6 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Save AI Settings
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}