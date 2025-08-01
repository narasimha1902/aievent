import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          created_at: string
          email: string
          full_name: string
          phone_number: string
          role: 'mentor' | 'admin' | 'responder'
        }
        Insert: {
          id?: string
          created_at?: string
          email: string
          full_name: string
          phone_number: string
          role: 'mentor' | 'admin' | 'responder'
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          full_name?: string
          phone_number?: string
          role?: 'mentor' | 'admin' | 'responder'
        }
      }
      incidents: {
        Row: {
          id: string
          created_at: string
          type: 'crowd_surge' | 'fire_smoke' | 'medical'
          photo_url: string
          confidence_score: number
          status: 'pending' | 'verified' | 'dispatched' | 'resolved' | 'cancelled'
          location_lat: number
          location_lng: number
          description: string
        }
        Insert: {
          id?: string
          created_at?: string
          type: 'crowd_surge' | 'fire_smoke' | 'medical'
          photo_url: string
          confidence_score: number
          status?: 'pending' | 'verified' | 'dispatched' | 'resolved' | 'cancelled'
          location_lat: number
          location_lng: number
          description: string
        }
        Update: {
          id?: string
          created_at?: string
          type?: 'crowd_surge' | 'fire_smoke' | 'medical'
          photo_url?: string
          confidence_score?: number
          status?: 'pending' | 'verified' | 'dispatched' | 'resolved' | 'cancelled'
          location_lat?: number
          location_lng?: number
          description?: string
        }
      }
      responders: {
        Row: {
          id: string
          created_at: string
          user_id: string
          location_lat: number
          location_lng: number
          status: 'available' | 'busy' | 'offline'
          zone_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          location_lat: number
          location_lng: number
          status?: 'available' | 'busy' | 'offline'
          zone_id: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          location_lat?: number
          location_lng?: number
          status?: 'available' | 'busy' | 'offline'
          zone_id?: string
        }
      }
      zones: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string
          polygon_coordinates: any
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description: string
          polygon_coordinates: any
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string
          polygon_coordinates?: any
        }
      }
    }
  }
}