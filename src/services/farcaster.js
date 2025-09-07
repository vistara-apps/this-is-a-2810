import axios from 'axios'

const NEYNAR_API_KEY = import.meta.env.VITE_NEYNAR_API_KEY || 'demo-key'
const NEYNAR_BASE_URL = 'https://api.neynar.com/v2'

// Create axios instance with default config
const neynarApi = axios.create({
  baseURL: NEYNAR_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'api_key': NEYNAR_API_KEY,
  },
})

// Fetch trending casts from Farcaster
export const getTrendingCasts = async (limit = 25, timeWindow = '24h') => {
  try {
    const response = await neynarApi.get('/farcaster/feed/trending', {
      params: {
        limit,
        time_window: timeWindow,
        viewer_fid: 1, // Default viewer
      },
    })

    return {
      data: response.data.casts || [],
      error: null
    }
  } catch (error) {
    console.error('Error fetching trending casts:', error)
    return {
      data: [],
      error: error.response?.data?.message || error.message
    }
  }
}

// Search for meme-related content
export const searchMemeCasts = async (query, limit = 20) => {
  try {
    const response = await neynarApi.get('/farcaster/cast/search', {
      params: {
        q: query,
        limit,
      },
    })

    return {
      data: response.data.result?.casts || [],
      error: null
    }
  } catch (error) {
    console.error('Error searching meme casts:', error)
    return {
      data: [],
      error: error.response?.data?.message || error.message
    }
  }
}

// Get channel information for meme-related channels
export const getMemeChannels = async () => {
  const memeChannelIds = ['memes', 'funny', 'viral', 'comedy']
  const channels = []

  try {
    for (const channelId of memeChannelIds) {
      try {
        const response = await neynarApi.get(`/farcaster/channel`, {
          params: { id: channelId }
        })
        
        if (response.data.channel) {
          channels.push(response.data.channel)
        }
      } catch (channelError) {
        console.warn(`Error fetching channel ${channelId}:`, channelError)
      }
    }

    return {
      data: channels,
      error: null
    }
  } catch (error) {
    console.error('Error fetching meme channels:', error)
    return {
      data: [],
      error: error.message
    }
  }
}

// Get casts from specific channels
export const getChannelCasts = async (channelId, limit = 25) => {
  try {
    const response = await neynarApi.get('/farcaster/feed/channels', {
      params: {
        channel_ids: channelId,
        limit,
        with_recasts: false,
      },
    })

    return {
      data: response.data.casts || [],
      error: null
    }
  } catch (error) {
    console.error(`Error fetching casts from channel ${channelId}:`, error)
    return {
      data: [],
      error: error.response?.data?.message || error.message
    }
  }
}

// Analyze cast content for meme potential
export const analyzeMemeContent = (cast) => {
  const text = cast.text?.toLowerCase() || ''
  const hasImages = cast.embeds?.some(embed => embed.url && 
    (embed.url.includes('imgur') || embed.url.includes('giphy') || 
     embed.url.match(/\.(jpg|jpeg|png|gif|webp)$/i)))
  
  // Meme indicators
  const memeKeywords = [
    'meme', 'lol', 'lmao', 'rofl', 'funny', 'hilarious', 'viral',
    'when you', 'me when', 'pov:', 'that moment when', 'be like',
    'mood', 'relatable', 'fr fr', 'no cap', 'based', 'cringe'
  ]
  
  const hasMemeLang = memeKeywords.some(keyword => text.includes(keyword))
  const hasReactions = cast.reactions?.likes_count > 10 || cast.reactions?.recasts_count > 5
  const isRecent = new Date(cast.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
  
  // Calculate confidence score
  let confidenceScore = 0
  if (hasImages) confidenceScore += 0.3
  if (hasMemeLang) confidenceScore += 0.3
  if (hasReactions) confidenceScore += 0.2
  if (isRecent) confidenceScore += 0.2
  
  return {
    hasMemeContent: confidenceScore > 0.4,
    confidenceScore: Math.min(confidenceScore, 1.0),
    indicators: {
      hasImages,
      hasMemeLang,
      hasReactions,
      isRecent
    }
  }
}

// Extract trending topics from casts
export const extractTrendingTopics = async () => {
  try {
    // Get trending casts
    const { data: trendingCasts } = await getTrendingCasts(50)
    
    // Get meme channel casts
    const memeChannels = ['memes', 'funny']
    const channelCasts = []
    
    for (const channelId of memeChannels) {
      const { data: casts } = await getChannelCasts(channelId, 25)
      channelCasts.push(...casts)
    }
    
    // Combine and analyze all casts
    const allCasts = [...trendingCasts, ...channelCasts]
    const memeContent = allCasts
      .map(cast => ({
        ...cast,
        analysis: analyzeMemeContent(cast)
      }))
      .filter(cast => cast.analysis.hasMemeContent)
      .sort((a, b) => b.analysis.confidenceScore - a.analysis.confidenceScore)
    
    // Extract topics and formats
    const topics = memeContent.slice(0, 10).map((cast, index) => ({
      trendId: `fc_${cast.hash || index}`,
      topic: extractTopicFromText(cast.text),
      formatName: identifyMemeFormat(cast.text),
      imageUrl: extractImageUrl(cast.embeds) || 'https://via.placeholder.com/400x300?text=Meme',
      source: 'Farcaster',
      detectedAt: new Date(cast.timestamp),
      confidenceScore: cast.analysis.confidenceScore,
      originalCast: cast
    }))
    
    return {
      data: topics,
      error: null
    }
  } catch (error) {
    console.error('Error extracting trending topics:', error)
    return {
      data: [],
      error: error.message
    }
  }
}

// Helper functions
const extractTopicFromText = (text) => {
  if (!text) return 'Trending Meme'
  
  // Extract first few words or hashtags
  const words = text.split(' ').slice(0, 3).join(' ')
  const hashtags = text.match(/#\w+/g)
  
  if (hashtags && hashtags.length > 0) {
    return hashtags[0].replace('#', '')
  }
  
  return words.length > 30 ? words.substring(0, 30) + '...' : words
}

const identifyMemeFormat = (text) => {
  const formats = {
    'when you': 'Reaction Meme',
    'me when': 'Personal Reaction',
    'pov:': 'POV Meme',
    'that moment when': 'Relatable Moment',
    'be like': 'Character Meme',
    'vs': 'Comparison Meme',
    'expectation vs reality': 'Expectation vs Reality'
  }
  
  const lowerText = text?.toLowerCase() || ''
  
  for (const [pattern, format] of Object.entries(formats)) {
    if (lowerText.includes(pattern)) {
      return format
    }
  }
  
  return 'General Meme'
}

const extractImageUrl = (embeds) => {
  if (!embeds || embeds.length === 0) return null
  
  for (const embed of embeds) {
    if (embed.url && embed.url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return embed.url
    }
  }
  
  return null
}

// Fallback data when API is not available
export const getFallbackTrends = () => {
  return {
    data: [
      {
        trendId: 'fallback_1',
        topic: 'AI Taking Over',
        formatName: 'Distracted Boyfriend',
        imageUrl: 'https://i.imgflip.com/1ur9b0.jpg',
        source: 'Farcaster',
        detectedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        confidenceScore: 0.89
      },
      {
        trendId: 'fallback_2',
        topic: 'Monday Motivation',
        formatName: 'Drake Pointing',
        imageUrl: 'https://i.imgflip.com/30b1gx.jpg',
        source: 'Farcaster',
        detectedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        confidenceScore: 0.85
      }
    ],
    error: null
  }
}
