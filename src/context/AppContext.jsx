import React, { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext()

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

// Mock data
const mockTrends = [
  {
    trendId: '1',
    topic: 'Distracted Boyfriend',
    formatName: 'Choice Meme',
    imageUrl: 'https://i.imgflip.com/1ur9b0.jpg',
    source: 'Reddit',
    detectedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    confidenceScore: 0.92
  },
  {
    trendId: '2',
    topic: 'Drake Pointing',
    formatName: 'Preference Meme',
    imageUrl: 'https://i.imgflip.com/30b1gx.jpg',
    source: 'Twitter',
    detectedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    confidenceScore: 0.88
  },
  {
    trendId: '3',
    topic: 'Expanding Brain',
    formatName: 'Intelligence Levels',
    imageUrl: 'https://i.imgflip.com/1jwhww.jpg',
    source: 'Instagram',
    detectedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    confidenceScore: 0.85
  },
  {
    trendId: '4',
    topic: 'Woman Yelling at Cat',
    formatName: 'Argument Meme',
    imageUrl: 'https://i.imgflip.com/345v97.jpg',
    source: 'TikTok',
    detectedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    confidenceScore: 0.91
  }
]

const mockMemes = [
  {
    memeId: '1',
    templateUrl: 'https://i.imgflip.com/1ur9b0.jpg',
    generatedCaption: 'Me choosing between Netflix and productivity',
    finalCaption: 'Me choosing between Netflix and productivity',
    platformOptimizations: { twitter: 'Short text', instagram: 'Square format' },
    performanceAnalytics: { views: 15420, likes: 892, shares: 156, comments: 43 },
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
  },
  {
    memeId: '2',
    templateUrl: 'https://i.imgflip.com/30b1gx.jpg',
    generatedCaption: 'Coffee in the morning vs Coffee at night',
    finalCaption: 'Coffee in the morning vs Coffee at night',
    platformOptimizations: { reddit: 'Add context', tiktok: 'Vertical format' },
    performanceAnalytics: { views: 8650, likes: 421, shares: 89, comments: 32 },
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000)
  }
]

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState({
    userId: '1',
    email: 'user@example.com',
    subscriptionTier: 'premium',
    createdAt: new Date(),
    updatedAt: new Date()
  })

  const [memes, setMemes] = useState(mockMemes)
  const [trends, setTrends] = useState(mockTrends)
  const [selectedTrend, setSelectedTrend] = useState(null)

  const addMeme = (meme) => {
    const newMeme = {
      ...meme,
      memeId: Date.now().toString(),
      userId: user.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      performanceAnalytics: { views: 0, likes: 0, shares: 0, comments: 0 }
    }
    setMemes(prev => [newMeme, ...prev])
    return newMeme
  }

  const updateMemePerformance = (memeId, analytics) => {
    setMemes(prev => prev.map(meme => 
      meme.memeId === memeId 
        ? { ...meme, performanceAnalytics: { ...meme.performanceAnalytics, ...analytics } }
        : meme
    ))
  }

  const value = {
    user,
    memes,
    trends,
    selectedTrend,
    setSelectedTrend,
    addMeme,
    updateMemePerformance
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}