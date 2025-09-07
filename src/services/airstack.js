import axios from 'axios'

const AIRSTACK_API_KEY = import.meta.env.VITE_AIRSTACK_API_KEY || 'demo-key'
const AIRSTACK_ENDPOINT = 'https://api.airstack.xyz/gql'

// Create axios instance for GraphQL requests
const airstackApi = axios.create({
  baseURL: AIRSTACK_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': AIRSTACK_API_KEY,
  },
})

// GraphQL query to get trending social data
const TRENDING_SOCIAL_QUERY = `
  query GetTrendingSocial($limit: Int!) {
    Socials(
      input: {
        filter: {
          dappName: {_in: [farcaster, lens]}
        },
        blockchain: ethereum,
        limit: $limit,
        order: {followerCount: DESC}
      }
    ) {
      Social {
        id
        dappName
        profileName
        profileDisplayName
        profileImage
        profileBio
        followerCount
        followingCount
        userAddress
        userAssociatedAddresses
      }
    }
  }
`

// GraphQL query to get NFT collections that might be meme-related
const MEME_NFT_QUERY = `
  query GetMemeNFTs($limit: Int!) {
    TokenNfts(
      input: {
        filter: {
          name: {_regex: "(?i)(meme|pepe|doge|wojak|chad|karen)"}
        },
        blockchain: ethereum,
        limit: $limit,
        order: {totalSupply: DESC}
      }
    ) {
      TokenNft {
        id
        address
        tokenId
        name
        symbol
        totalSupply
        blockchain
        metaData {
          name
          description
          image
          attributes {
            trait_type
            value
          }
        }
      }
    }
  }
`

// GraphQL query to get token transfers for viral content analysis
const VIRAL_TOKENS_QUERY = `
  query GetViralTokens($limit: Int!) {
    TokenTransfers(
      input: {
        filter: {
          tokenType: {_in: [ERC721, ERC1155]}
        },
        blockchain: ethereum,
        limit: $limit,
        order: {blockTimestamp: DESC}
      }
    ) {
      TokenTransfer {
        id
        tokenAddress
        tokenId
        tokenType
        amount
        from {
          addresses
          socials {
            dappName
            profileName
            followerCount
          }
        }
        to {
          addresses
          socials {
            dappName
            profileName
            followerCount
          }
        }
        token {
          name
          symbol
          totalSupply
        }
        blockTimestamp
      }
    }
  }
`

// Execute GraphQL query
const executeQuery = async (query, variables = {}) => {
  try {
    const response = await airstackApi.post('', {
      query,
      variables,
    })

    if (response.data.errors) {
      throw new Error(response.data.errors[0].message)
    }

    return {
      data: response.data.data,
      error: null
    }
  } catch (error) {
    console.error('Airstack GraphQL error:', error)
    return {
      data: null,
      error: error.response?.data?.message || error.message
    }
  }
}

// Get trending social profiles for meme analysis
export const getTrendingSocialProfiles = async (limit = 20) => {
  try {
    const { data, error } = await executeQuery(TRENDING_SOCIAL_QUERY, { limit })
    
    if (error) throw new Error(error)
    
    const profiles = data?.Socials?.Social || []
    
    // Filter for potential meme creators based on bio keywords
    const memeCreators = profiles.filter(profile => {
      const bio = profile.profileBio?.toLowerCase() || ''
      const name = profile.profileDisplayName?.toLowerCase() || ''
      
      const memeKeywords = [
        'meme', 'funny', 'comedy', 'humor', 'viral', 'content creator',
        'shitpost', 'based', 'degen', 'nft', 'crypto', 'web3'
      ]
      
      return memeKeywords.some(keyword => 
        bio.includes(keyword) || name.includes(keyword)
      )
    })
    
    return {
      data: memeCreators,
      error: null
    }
  } catch (error) {
    console.error('Error fetching trending social profiles:', error)
    return {
      data: [],
      error: error.message
    }
  }
}

// Get meme-related NFT collections
export const getMemeNFTCollections = async (limit = 10) => {
  try {
    const { data, error } = await executeQuery(MEME_NFT_QUERY, { limit })
    
    if (error) throw new Error(error)
    
    const nfts = data?.TokenNfts?.TokenNft || []
    
    // Transform NFT data for meme trend analysis
    const memeCollections = nfts.map(nft => ({
      id: nft.id,
      name: nft.name,
      symbol: nft.symbol,
      address: nft.address,
      totalSupply: nft.totalSupply,
      image: nft.metaData?.image,
      description: nft.metaData?.description,
      blockchain: nft.blockchain,
      // Calculate trend score based on supply and metadata
      trendScore: calculateNFTTrendScore(nft)
    }))
    
    return {
      data: memeCollections.sort((a, b) => b.trendScore - a.trendScore),
      error: null
    }
  } catch (error) {
    console.error('Error fetching meme NFT collections:', error)
    return {
      data: [],
      error: error.message
    }
  }
}

// Analyze viral token activity
export const getViralTokenActivity = async (limit = 50) => {
  try {
    const { data, error } = await executeQuery(VIRAL_TOKENS_QUERY, { limit })
    
    if (error) throw new Error(error)
    
    const transfers = data?.TokenTransfers?.TokenTransfer || []
    
    // Analyze transfers for viral patterns
    const viralActivity = analyzeViralPatterns(transfers)
    
    return {
      data: viralActivity,
      error: null
    }
  } catch (error) {
    console.error('Error fetching viral token activity:', error)
    return {
      data: [],
      error: error.message
    }
  }
}

// Helper function to calculate NFT trend score
const calculateNFTTrendScore = (nft) => {
  let score = 0
  
  // Base score from supply (more supply = more viral potential)
  const supply = parseInt(nft.totalSupply) || 0
  if (supply > 10000) score += 0.3
  else if (supply > 1000) score += 0.2
  else if (supply > 100) score += 0.1
  
  // Score from metadata
  const name = nft.name?.toLowerCase() || ''
  const description = nft.metaData?.description?.toLowerCase() || ''
  
  const viralKeywords = ['meme', 'viral', 'trending', 'popular', 'funny', 'based']
  const hasViralKeywords = viralKeywords.some(keyword => 
    name.includes(keyword) || description.includes(keyword)
  )
  
  if (hasViralKeywords) score += 0.4
  
  // Score from having image
  if (nft.metaData?.image) score += 0.3
  
  return Math.min(score, 1.0)
}

// Analyze viral patterns in token transfers
const analyzeViralPatterns = (transfers) => {
  const tokenActivity = {}
  
  transfers.forEach(transfer => {
    const tokenKey = `${transfer.tokenAddress}_${transfer.tokenId}`
    
    if (!tokenActivity[tokenKey]) {
      tokenActivity[tokenKey] = {
        tokenAddress: transfer.tokenAddress,
        tokenId: transfer.tokenId,
        tokenName: transfer.token?.name,
        tokenSymbol: transfer.token?.symbol,
        transferCount: 0,
        uniqueHolders: new Set(),
        socialInfluence: 0,
        lastActivity: transfer.blockTimestamp
      }
    }
    
    const activity = tokenActivity[tokenKey]
    activity.transferCount++
    
    // Track unique holders
    if (transfer.from?.addresses) {
      transfer.from.addresses.forEach(addr => activity.uniqueHolders.add(addr))
    }
    if (transfer.to?.addresses) {
      transfer.to.addresses.forEach(addr => activity.uniqueHolders.add(addr))
    }
    
    // Calculate social influence
    const fromFollowers = transfer.from?.socials?.[0]?.followerCount || 0
    const toFollowers = transfer.to?.socials?.[0]?.followerCount || 0
    activity.socialInfluence += fromFollowers + toFollowers
  })
  
  // Convert to array and calculate viral scores
  const viralTokens = Object.values(tokenActivity).map(activity => ({
    ...activity,
    uniqueHolders: activity.uniqueHolders.size,
    viralScore: calculateViralScore(activity)
  }))
  
  return viralTokens
    .sort((a, b) => b.viralScore - a.viralScore)
    .slice(0, 10)
}

// Calculate viral score for token activity
const calculateViralScore = (activity) => {
  let score = 0
  
  // Transfer frequency
  if (activity.transferCount > 100) score += 0.3
  else if (activity.transferCount > 50) score += 0.2
  else if (activity.transferCount > 10) score += 0.1
  
  // Unique holders
  if (activity.uniqueHolders > 100) score += 0.3
  else if (activity.uniqueHolders > 50) score += 0.2
  else if (activity.uniqueHolders > 10) score += 0.1
  
  // Social influence
  if (activity.socialInfluence > 10000) score += 0.4
  else if (activity.socialInfluence > 1000) score += 0.2
  
  return Math.min(score, 1.0)
}

// Get comprehensive meme trend data from onchain activity
export const getOnchainMemeTrends = async () => {
  try {
    const [socialProfiles, nftCollections, viralActivity] = await Promise.all([
      getTrendingSocialProfiles(10),
      getMemeNFTCollections(5),
      getViralTokenActivity(30)
    ])
    
    // Combine data to create trend insights
    const trends = []
    
    // Add NFT-based trends
    nftCollections.data.forEach((nft, index) => {
      trends.push({
        trendId: `onchain_nft_${nft.id}`,
        topic: nft.name || 'NFT Meme Collection',
        formatName: 'NFT Collection',
        imageUrl: nft.image || 'https://via.placeholder.com/400x300?text=NFT+Meme',
        source: 'Onchain (Airstack)',
        detectedAt: new Date(),
        confidenceScore: nft.trendScore,
        metadata: {
          type: 'nft_collection',
          address: nft.address,
          totalSupply: nft.totalSupply,
          blockchain: nft.blockchain
        }
      })
    })
    
    // Add viral token trends
    viralActivity.data.slice(0, 3).forEach((token, index) => {
      trends.push({
        trendId: `onchain_viral_${token.tokenAddress}_${token.tokenId}`,
        topic: token.tokenName || 'Viral Token',
        formatName: 'Viral NFT',
        imageUrl: 'https://via.placeholder.com/400x300?text=Viral+Token',
        source: 'Onchain (Airstack)',
        detectedAt: new Date(token.lastActivity),
        confidenceScore: token.viralScore,
        metadata: {
          type: 'viral_token',
          address: token.tokenAddress,
          tokenId: token.tokenId,
          transferCount: token.transferCount,
          uniqueHolders: token.uniqueHolders,
          socialInfluence: token.socialInfluence
        }
      })
    })
    
    return {
      data: trends.sort((a, b) => b.confidenceScore - a.confidenceScore),
      error: null
    }
  } catch (error) {
    console.error('Error getting onchain meme trends:', error)
    return {
      data: [],
      error: error.message
    }
  }
}

// Fallback data when API is not available
export const getFallbackOnchainTrends = () => {
  return {
    data: [
      {
        trendId: 'onchain_fallback_1',
        topic: 'Crypto Punks Memes',
        formatName: 'NFT Collection',
        imageUrl: 'https://via.placeholder.com/400x300?text=Crypto+Punks',
        source: 'Onchain (Airstack)',
        detectedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        confidenceScore: 0.87,
        metadata: {
          type: 'nft_collection',
          blockchain: 'ethereum'
        }
      },
      {
        trendId: 'onchain_fallback_2',
        topic: 'BAYC Derivatives',
        formatName: 'Viral NFT',
        imageUrl: 'https://via.placeholder.com/400x300?text=BAYC+Memes',
        source: 'Onchain (Airstack)',
        detectedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        confidenceScore: 0.82,
        metadata: {
          type: 'viral_token',
          blockchain: 'ethereum'
        }
      }
    ],
    error: null
  }
}
