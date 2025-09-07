import { extractTrendingTopics, getFallbackTrends } from './farcaster'
import { getOnchainMemeTrends, getFallbackOnchainTrends } from './airstack'
import { saveTrend, getTrends } from './supabase'

// Main trend aggregation service
export class TrendService {
  constructor() {
    this.enableFarcaster = import.meta.env.VITE_ENABLE_FARCASTER_TRENDS === 'true'
    this.enableOnchain = import.meta.env.VITE_ENABLE_ONCHAIN_TRENDS === 'true'
    this.mockResponses = import.meta.env.VITE_MOCK_API_RESPONSES === 'true'
    this.debugMode = import.meta.env.VITE_DEBUG_MODE === 'true'
  }

  // Get all trending topics from multiple sources
  async getAllTrends() {
    try {
      const trendSources = []

      // Get Farcaster trends
      if (this.enableFarcaster) {
        trendSources.push(this.getFarcasterTrends())
      }

      // Get onchain trends
      if (this.enableOnchain) {
        trendSources.push(this.getOnchainTrends())
      }

      // Get cached trends from database
      trendSources.push(this.getCachedTrends())

      // Execute all trend fetching in parallel
      const results = await Promise.allSettled(trendSources)
      
      // Combine all successful results
      const allTrends = []
      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value.data) {
          allTrends.push(...result.value.data)
        } else if (this.debugMode) {
          console.warn(`Trend source ${index} failed:`, result.reason)
        }
      })

      // Remove duplicates and sort by confidence score
      const uniqueTrends = this.deduplicateTrends(allTrends)
      const sortedTrends = uniqueTrends.sort((a, b) => b.confidenceScore - a.confidenceScore)

      // Cache new trends
      await this.cacheNewTrends(sortedTrends)

      return {
        data: sortedTrends.slice(0, 20), // Return top 20 trends
        error: null,
        sources: {
          farcaster: this.enableFarcaster,
          onchain: this.enableOnchain,
          cached: true
        }
      }
    } catch (error) {
      console.error('Error fetching all trends:', error)
      return {
        data: this.getFallbackTrends(),
        error: error.message,
        sources: { fallback: true }
      }
    }
  }

  // Get Farcaster trends with fallback
  async getFarcasterTrends() {
    try {
      if (this.mockResponses) {
        return getFallbackTrends()
      }
      
      const result = await extractTrendingTopics()
      return result.data ? result : getFallbackTrends()
    } catch (error) {
      console.error('Farcaster trends error:', error)
      return getFallbackTrends()
    }
  }

  // Get onchain trends with fallback
  async getOnchainTrends() {
    try {
      if (this.mockResponses) {
        return getFallbackOnchainTrends()
      }
      
      const result = await getOnchainMemeTrends()
      return result.data ? result : getFallbackOnchainTrends()
    } catch (error) {
      console.error('Onchain trends error:', error)
      return getFallbackOnchainTrends()
    }
  }

  // Get cached trends from database
  async getCachedTrends() {
    try {
      const result = await getTrends()
      return result
    } catch (error) {
      console.error('Cached trends error:', error)
      return { data: [], error: error.message }
    }
  }

  // Remove duplicate trends based on topic similarity
  deduplicateTrends(trends) {
    const unique = []
    const seenTopics = new Set()

    trends.forEach(trend => {
      const normalizedTopic = trend.topic.toLowerCase().trim()
      
      // Check for exact matches
      if (seenTopics.has(normalizedTopic)) {
        return
      }

      // Check for similar topics (simple similarity check)
      const isSimilar = Array.from(seenTopics).some(existingTopic => {
        return this.calculateSimilarity(normalizedTopic, existingTopic) > 0.8
      })

      if (!isSimilar) {
        seenTopics.add(normalizedTopic)
        unique.push(trend)
      }
    })

    return unique
  }

  // Calculate similarity between two strings (simple Jaccard similarity)
  calculateSimilarity(str1, str2) {
    const set1 = new Set(str1.split(' '))
    const set2 = new Set(str2.split(' '))
    
    const intersection = new Set([...set1].filter(x => set2.has(x)))
    const union = new Set([...set1, ...set2])
    
    return intersection.size / union.size
  }

  // Cache new trends to database
  async cacheNewTrends(trends) {
    try {
      const recentTrends = trends.filter(trend => {
        const trendAge = Date.now() - new Date(trend.detectedAt).getTime()
        return trendAge < 24 * 60 * 60 * 1000 // Only cache trends from last 24 hours
      })

      // Save each trend (Supabase will handle duplicates)
      const savePromises = recentTrends.map(trend => saveTrend(trend))
      await Promise.allSettled(savePromises)
      
      if (this.debugMode) {
        console.log(`Cached ${recentTrends.length} new trends`)
      }
    } catch (error) {
      console.error('Error caching trends:', error)
    }
  }

  // Get fallback trends when all sources fail
  getFallbackTrends() {
    return [
      {
        trendId: 'fallback_1',
        topic: 'AI vs Humans',
        formatName: 'Distracted Boyfriend',
        imageUrl: 'https://i.imgflip.com/1ur9b0.jpg',
        source: 'Fallback',
        detectedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        confidenceScore: 0.85
      },
      {
        trendId: 'fallback_2',
        topic: 'Monday Motivation',
        formatName: 'Drake Pointing',
        imageUrl: 'https://i.imgflip.com/30b1gx.jpg',
        source: 'Fallback',
        detectedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        confidenceScore: 0.80
      },
      {
        trendId: 'fallback_3',
        topic: 'Coffee Addiction',
        formatName: 'Expanding Brain',
        imageUrl: 'https://i.imgflip.com/1jwhww.jpg',
        source: 'Fallback',
        detectedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        confidenceScore: 0.75
      }
    ]
  }

  // Search trends by keyword
  async searchTrends(keyword, limit = 10) {
    try {
      const { data: allTrends } = await this.getAllTrends()
      
      const filtered = allTrends.filter(trend => 
        trend.topic.toLowerCase().includes(keyword.toLowerCase()) ||
        trend.formatName.toLowerCase().includes(keyword.toLowerCase())
      )

      return {
        data: filtered.slice(0, limit),
        error: null
      }
    } catch (error) {
      console.error('Error searching trends:', error)
      return {
        data: [],
        error: error.message
      }
    }
  }

  // Get trending topics by category
  async getTrendsByCategory(category) {
    try {
      const { data: allTrends } = await this.getAllTrends()
      
      const categoryKeywords = {
        tech: ['ai', 'crypto', 'blockchain', 'nft', 'web3', 'tech', 'coding'],
        lifestyle: ['coffee', 'monday', 'weekend', 'work', 'life', 'mood'],
        entertainment: ['movie', 'tv', 'celebrity', 'music', 'game', 'meme'],
        sports: ['football', 'basketball', 'soccer', 'sports', 'game', 'team'],
        politics: ['election', 'politics', 'government', 'news', 'debate']
      }

      const keywords = categoryKeywords[category.toLowerCase()] || []
      
      const filtered = allTrends.filter(trend => {
        const text = `${trend.topic} ${trend.formatName}`.toLowerCase()
        return keywords.some(keyword => text.includes(keyword))
      })

      return {
        data: filtered,
        error: null
      }
    } catch (error) {
      console.error('Error getting trends by category:', error)
      return {
        data: [],
        error: error.message
      }
    }
  }

  // Get trend analytics
  async getTrendAnalytics(trendId) {
    try {
      const { data: allTrends } = await this.getAllTrends()
      const trend = allTrends.find(t => t.trendId === trendId)
      
      if (!trend) {
        return {
          data: null,
          error: 'Trend not found'
        }
      }

      // Calculate trend metrics
      const analytics = {
        trend,
        metrics: {
          confidenceScore: trend.confidenceScore,
          ageInHours: Math.floor((Date.now() - new Date(trend.detectedAt).getTime()) / (1000 * 60 * 60)),
          source: trend.source,
          category: this.categorizeTrend(trend),
          viralPotential: this.calculateViralPotential(trend),
          platformSuitability: this.analyzePlatformSuitability(trend)
        },
        recommendations: this.generateTrendRecommendations(trend)
      }

      return {
        data: analytics,
        error: null
      }
    } catch (error) {
      console.error('Error getting trend analytics:', error)
      return {
        data: null,
        error: error.message
      }
    }
  }

  // Categorize trend based on content
  categorizeTrend(trend) {
    const text = `${trend.topic} ${trend.formatName}`.toLowerCase()
    
    if (text.match(/ai|crypto|blockchain|nft|web3|tech/)) return 'tech'
    if (text.match(/coffee|monday|weekend|work|life|mood/)) return 'lifestyle'
    if (text.match(/movie|tv|celebrity|music|game/)) return 'entertainment'
    if (text.match(/football|basketball|soccer|sports/)) return 'sports'
    if (text.match(/election|politics|government|news/)) return 'politics'
    
    return 'general'
  }

  // Calculate viral potential score
  calculateViralPotential(trend) {
    let score = trend.confidenceScore

    // Boost score for recent trends
    const ageInHours = (Date.now() - new Date(trend.detectedAt).getTime()) / (1000 * 60 * 60)
    if (ageInHours < 6) score += 0.1
    else if (ageInHours < 12) score += 0.05

    // Boost score for certain sources
    if (trend.source === 'Farcaster') score += 0.05
    if (trend.source === 'Onchain (Airstack)') score += 0.03

    // Boost score for popular formats
    const popularFormats = ['Distracted Boyfriend', 'Drake Pointing', 'Expanding Brain']
    if (popularFormats.includes(trend.formatName)) score += 0.05

    return Math.min(1.0, score)
  }

  // Analyze platform suitability
  analyzePlatformSuitability(trend) {
    const suitability = {
      twitter: 0.8,
      instagram: 0.7,
      tiktok: 0.6,
      reddit: 0.9,
      facebook: 0.5
    }

    // Adjust based on trend characteristics
    if (trend.source === 'Farcaster') {
      suitability.twitter += 0.1
      suitability.reddit += 0.1
    }

    if (trend.metadata?.type === 'nft_collection') {
      suitability.twitter += 0.2
      suitability.instagram += 0.1
    }

    // Normalize scores
    Object.keys(suitability).forEach(platform => {
      suitability[platform] = Math.min(1.0, suitability[platform])
    })

    return suitability
  }

  // Generate recommendations for using a trend
  generateTrendRecommendations(trend) {
    const recommendations = []

    // Age-based recommendations
    const ageInHours = (Date.now() - new Date(trend.detectedAt).getTime()) / (1000 * 60 * 60)
    if (ageInHours < 6) {
      recommendations.push('🔥 This trend is very fresh - act quickly for maximum impact!')
    } else if (ageInHours < 24) {
      recommendations.push('⚡ This trend is still hot - good timing to create content')
    } else {
      recommendations.push('📈 This trend is established - focus on unique angles')
    }

    // Source-based recommendations
    if (trend.source === 'Farcaster') {
      recommendations.push('🟣 Popular on Farcaster - consider crypto/web3 angle')
    }
    if (trend.source === 'Onchain (Airstack)') {
      recommendations.push('⛓️ Trending onchain - NFT/DeFi communities might engage')
    }

    // Format-based recommendations
    if (trend.formatName.includes('Comparison') || trend.formatName.includes('vs')) {
      recommendations.push('⚖️ Great for before/after or comparison content')
    }
    if (trend.formatName.includes('Reaction')) {
      recommendations.push('😱 Perfect for reaction-based humor')
    }

    return recommendations
  }
}

// Create singleton instance
export const trendService = new TrendService()

// Export convenience functions
export const getAllTrends = () => trendService.getAllTrends()
export const searchTrends = (keyword, limit) => trendService.searchTrends(keyword, limit)
export const getTrendsByCategory = (category) => trendService.getTrendsByCategory(category)
export const getTrendAnalytics = (trendId) => trendService.getTrendAnalytics(trendId)
