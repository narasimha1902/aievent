import { supabase } from './supabase'

export interface AuthUser {
  id: string
  email: string
  full_name: string
  phone_number: string
  role: 'mentor' | 'admin' | 'responder'
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) throw error
  
  return data
}

export const signUp = async (
  email: string,
  password: string,
  full_name: string,
  phone_number: string,
  role: 'mentor' | 'admin' | 'responder'
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  
  if (error) throw error
  
  if (data.user) {
    // Create user profile
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: data.user.id,
        email,
        full_name,
        phone_number,
        role,
      })
    
    if (profileError) throw profileError
  }
  
  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email)
  if (error) throw error
}

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null
  
  const { data: profile, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()
  
  if (error || !profile) return null
  
  return {
    id: profile.id,
    email: profile.email,
    full_name: profile.full_name,
    phone_number: profile.phone_number,
    role: profile.role,
  }
}