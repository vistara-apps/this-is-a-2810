import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

// User Management
export const signUp = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) throw error
    return { user: data.user, error: null }
  } catch (error) {
    return { user: null, error: error.message }
  }
}

export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return { user: data.user, error: null }
  } catch (error) {
    return { user: null, error: error.message }
  }
}

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { error: null }
  } catch (error) {
    return { error: error.message }
  }
}

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return { user, error: null }
  } catch (error) {
    return { user: null, error: error.message }
  }
}

// Meme Operations
export const saveMeme = async (meme) => {
  try {
    const { data, error } = await supabase
      .from('memes')
      .insert([meme])
      .select()
      .single()
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error saving meme:', error)
    return { data: null, error: error.message }
  }
}

export const getMemes = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('memes')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false })
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching memes:', error)
    return { data: [], error: error.message }
  }
}

export const updateMemePerformance = async (memeId, analytics) => {
  try {
    const { data, error } = await supabase
      .from('memes')
      .update({ performanceAnalytics: analytics })
      .eq('memeId', memeId)
      .select()
      .single()
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error updating meme performance:', error)
    return { data: null, error: error.message }
  }
}

// Trend Operations
export const getTrends = async () => {
  try {
    const { data, error } = await supabase
      .from('trends')
      .select('*')
      .order('detectedAt', { ascending: false })
      .limit(20)
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching trends:', error)
    return { data: [], error: error.message }
  }
}

export const saveTrend = async (trend) => {
  try {
    const { data, error } = await supabase
      .from('trends')
      .insert([trend])
      .select()
      .single()
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error saving trend:', error)
    return { data: null, error: error.message }
  }
}

// User Profile Operations
export const updateUserProfile = async (userId, updates) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('userId', userId)
      .select()
      .single()
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error updating user profile:', error)
    return { data: null, error: error.message }
  }
}

export const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('userId', userId)
      .single()
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return { data: null, error: error.message }
  }
}
