// Platform-specific optimization recommendations
export const platformOptimizations = {
  twitter: {
    name: 'Twitter/X',
    maxTextLength: 280,
    aspectRatio: '16:9',
    imageSize: { width: 1200, height: 675 },
    recommendations: [
      'Keep text under 280 characters',
      'Use trending hashtags (1-2 max)',
      'Post during peak hours (9-10 AM, 7-9 PM)',
      'Include engaging questions to boost replies',
      'Use horizontal images for better visibility'
    ],
    bestPractices: [
      'Thread longer content',
      'Use emojis sparingly',
      'Tag relevant accounts',
      'Include call-to-action'
    ]
  },
  
  instagram: {
    name: 'Instagram',
    maxTextLength: 2200,
    aspectRatio: '1:1',
    imageSize: { width: 1080, height: 1080 },
    recommendations: [
      'Use square format (1:1) for feed posts',
      'Include 5-10 relevant hashtags',
      'Post during lunch (11 AM-1 PM) or evening (7-9 PM)',
      'Use Instagram Stories for behind-the-scenes',
      'Add location tags for discovery'
    ],
    bestPractices: [
      'Use high-quality images',
      'Write engaging captions',
      'Include call-to-action in bio link',
      'Use Instagram Reels for viral content'
    ]
  },
  
  tiktok: {
    name: 'TikTok',
    maxTextLength: 150,
    aspectRatio: '9:16',
    imageSize: { width: 1080, height: 1920 },
    recommendations: [
      'Use vertical format (9:16)',
      'Keep captions short and punchy',
      'Post during peak hours (6-10 AM, 7-9 PM)',
      'Use trending sounds and effects',
      'Include trending hashtags'
    ],
    bestPractices: [
      'Hook viewers in first 3 seconds',
      'Use text overlays for context',
      'Jump on trending challenges',
      'Keep videos under 60 seconds'
    ]
  },
  
  reddit: {
    name: 'Reddit',
    maxTextLength: 40000,
    aspectRatio: '16:9',
    imageSize: { width: 1200, height: 675 },
    recommendations: [
      'Follow subreddit rules strictly',
      'Use descriptive titles',
      'Post during weekday mornings (8-10 AM)',
      'Engage with comments quickly',
      'Provide context in comments'
    ],
    bestPractices: [
      'Be authentic and genuine',
      'Avoid self-promotion',
      'Use proper formatting',
      'Research subreddit culture first'
    ]
  },
  
  facebook: {
    name: 'Facebook',
    maxTextLength: 63206,
    aspectRatio: '16:9',
    imageSize: { width: 1200, height: 630 },
    recommendations: [
      'Use horizontal images',
      'Post during weekday afternoons (1-3 PM)',
      'Ask questions to boost engagement',
      'Use Facebook Groups for niche audiences',
      'Include relevant hashtags (1-2)'
    ],
    bestPractices: [
      'Write conversational captions',
      'Use Facebook Live for real-time engagement',
      'Share to relevant groups',
      'Respond to comments promptly'
    ]
  },
  
  linkedin: {
    name: 'LinkedIn',
    maxTextLength: 3000,
    aspectRatio: '16:9',
    imageSize: { width: 1200, height: 627 },
    recommendations: [
      'Keep professional tone',
      'Post during business hours (8 AM-6 PM)',
      'Use industry-relevant hashtags',
      'Share insights and lessons learned',
      'Tag relevant professionals'
    ],
    bestPractices: [
      'Write thought-provoking content',
      'Share professional achievements',
      'Engage with industry discussions',
      'Use LinkedIn Articles for long-form content'
    ]
  }
}

// Get optimization recommendations for a specific platform
export const getPlatformOptimization = (platform, memeData) => {
  const platformConfig = platformOptimizations[platform.toLowerCase()]
  
  if (!platformConfig) {
    return {
      error: `Platform ${platform} not supported`,
      recommendations: []
    }
  }
  
  const recommendations = []
  const warnings = []
  
  // Check text length
  if (memeData.caption && memeData.caption.length > platformConfig.maxTextLength) {
    warnings.push(`Caption too long for ${platformConfig.name} (${memeData.caption.length}/${platformConfig.maxTextLength} characters)`)
    recommendations.push(`Shorten caption to under ${platformConfig.maxTextLength} characters`)
  }
  
  // Add platform-specific recommendations
  recommendations.push(...platformConfig.recommendations)
  
  return {
    platform: platformConfig.name,
    aspectRatio: platformConfig.aspectRatio,
    imageSize: platformConfig.imageSize,
    maxTextLength: platformConfig.maxTextLength,
    recommendations,
    warnings,
    bestPractices: platformConfig.bestPractices
  }
}

// Get optimizations for all platforms
export const getAllPlatformOptimizations = (memeData) => {
  const platforms = Object.keys(platformOptimizations)
  const optimizations = {}
  
  platforms.forEach(platform => {
    optimizations[platform] = getPlatformOptimization(platform, memeData)
  })
  
  return optimizations
}

// Generate platform-specific hashtags
export const generateHashtags = (platform, topic, memeFormat) => {
  const baseHashtags = ['meme', 'funny', 'viral', 'humor']
  const topicHashtags = topic.toLowerCase().split(' ').map(word => word.replace(/[^a-zA-Z0-9]/g, ''))
  
  const platformHashtags = {
    twitter: ['memes', 'funny', 'viral', 'lol'],
    instagram: ['meme', 'funny', 'viral', 'comedy', 'humor', 'lol', 'relatable', 'mood'],
    tiktok: ['fyp', 'viral', 'funny', 'meme', 'comedy'],
    reddit: [], // Reddit doesn't use hashtags much
    facebook: ['funny', 'meme', 'viral'],
    linkedin: ['humor', 'workplace', 'professional'] // More professional hashtags
  }
  
  const suggested = [
    ...baseHashtags,
    ...topicHashtags.filter(tag => tag.length > 2),
    ...(platformHashtags[platform.toLowerCase()] || [])
  ]
  
  // Remove duplicates and limit based on platform
  const unique = [...new Set(suggested)]
  const limits = {
    twitter: 2,
    instagram: 10,
    tiktok: 5,
    reddit: 0,
    facebook: 3,
    linkedin: 3
  }
  
  return unique.slice(0, limits[platform.toLowerCase()] || 5)
}

// Optimize meme for specific platform
export const optimizeMemeForPlatform = (meme, platform) => {
  const optimization = getPlatformOptimization(platform, meme)
  const hashtags = generateHashtags(platform, meme.topic || '', meme.formatName || '')
  
  let optimizedCaption = meme.finalCaption || meme.generatedCaption || ''
  
  // Truncate caption if too long
  if (optimizedCaption.length > optimization.maxTextLength) {
    optimizedCaption = optimizedCaption.substring(0, optimization.maxTextLength - 3) + '...'
  }
  
  // Add hashtags for platforms that use them
  if (hashtags.length > 0 && platform.toLowerCase() !== 'reddit') {
    const hashtagString = hashtags.map(tag => `#${tag}`).join(' ')
    const availableSpace = optimization.maxTextLength - optimizedCaption.length - 1
    
    if (hashtagString.length <= availableSpace) {
      optimizedCaption += ' ' + hashtagString
    }
  }
  
  return {
    ...meme,
    platformOptimizations: {
      ...meme.platformOptimizations,
      [platform]: {
        caption: optimizedCaption,
        hashtags,
        aspectRatio: optimization.aspectRatio,
        imageSize: optimization.imageSize,
        recommendations: optimization.recommendations,
        warnings: optimization.warnings,
        bestPractices: optimization.bestPractices
      }
    }
  }
}

// Get posting time recommendations
export const getPostingTimeRecommendations = (platform, timezone = 'UTC') => {
  const recommendations = {
    twitter: [
      { time: '9:00 AM', reason: 'Morning commute engagement' },
      { time: '12:00 PM', reason: 'Lunch break browsing' },
      { time: '7:00 PM', reason: 'Evening social media time' }
    ],
    instagram: [
      { time: '11:00 AM', reason: 'Pre-lunch engagement' },
      { time: '1:00 PM', reason: 'Lunch break scrolling' },
      { time: '8:00 PM', reason: 'Evening relaxation time' }
    ],
    tiktok: [
      { time: '6:00 AM', reason: 'Early morning scrollers' },
      { time: '10:00 AM', reason: 'Mid-morning break' },
      { time: '7:00 PM', reason: 'Prime entertainment time' }
    ],
    reddit: [
      { time: '8:00 AM', reason: 'Morning Reddit browsing' },
      { time: '12:00 PM', reason: 'Lunch break reading' },
      { time: '9:00 PM', reason: 'Evening discussion time' }
    ],
    facebook: [
      { time: '1:00 PM', reason: 'Afternoon social check' },
      { time: '3:00 PM', reason: 'Mid-afternoon break' },
      { time: '8:00 PM', reason: 'Evening family time' }
    ],
    linkedin: [
      { time: '8:00 AM', reason: 'Professional morning routine' },
      { time: '12:00 PM', reason: 'Business lunch break' },
      { time: '5:00 PM', reason: 'End of workday networking' }
    ]
  }
  
  return recommendations[platform.toLowerCase()] || []
}

// Analyze meme performance across platforms
export const analyzeCrossPlatformPerformance = (meme) => {
  const platforms = Object.keys(meme.platformOptimizations || {})
  const analysis = {}
  
  platforms.forEach(platform => {
    const platformData = meme.platformOptimizations[platform]
    const analytics = meme.performanceAnalytics || {}
    
    analysis[platform] = {
      engagement: analytics[`${platform}_engagement`] || 0,
      reach: analytics[`${platform}_reach`] || 0,
      shares: analytics[`${platform}_shares`] || 0,
      optimizationScore: calculateOptimizationScore(platformData),
      recommendations: platformData.recommendations || []
    }
  })
  
  return analysis
}

// Calculate optimization score for a platform
const calculateOptimizationScore = (platformData) => {
  let score = 100
  
  // Deduct points for warnings
  if (platformData.warnings && platformData.warnings.length > 0) {
    score -= platformData.warnings.length * 20
  }
  
  // Add points for following best practices
  if (platformData.hashtags && platformData.hashtags.length > 0) {
    score += 10
  }
  
  if (platformData.caption && platformData.caption.length > 0) {
    score += 10
  }
  
  return Math.max(0, Math.min(100, score))
}
