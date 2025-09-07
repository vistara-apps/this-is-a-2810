# MemePulse API Documentation

This document provides comprehensive documentation for all the APIs and services integrated into MemePulse.

## Table of Contents

1. [OpenAI Integration](#openai-integration)
2. [Supabase Backend](#supabase-backend)
3. [Farcaster/Neynar API](#farcasterneynar-api)
4. [Airstack API](#airstack-api)
5. [Trend Service](#trend-service)
6. [Platform Optimization](#platform-optimization)
7. [Error Handling](#error-handling)
8. [Rate Limits](#rate-limits)

## OpenAI Integration

### Overview
The OpenAI service handles AI-powered meme caption generation using GPT models.

### Configuration
```javascript
const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
})
```

### Functions

#### `generateMemeCaption(templateName, keyword)`
Generates 5 different styles of meme captions for a given template and keyword.

**Parameters:**
- `templateName` (string): Name of the meme template
- `keyword` (string): Topic or keyword for the meme

**Returns:**
```javascript
Promise<string[]> // Array of generated captions
```

**Example:**
```javascript
const captions = await generateMemeCaption("Distracted Boyfriend", "AI")
// Returns: [
//   "Me looking at AI instead of my responsibilities",
//   "AI: Expectation vs Reality",
//   "When AI hits different",
//   "Choosing AI over everything else",
//   "AI got me acting up"
// ]
```

**Caption Styles:**
1. Relatable everyday situation
2. Self-deprecating humor
3. Current trend reference
4. Exaggerated reaction
5. Ironic observation

## Supabase Backend

### Overview
Supabase provides backend-as-a-service functionality including authentication, database operations, and real-time subscriptions.

### Database Schema

#### Users Table
```sql
CREATE TABLE users (
  userId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  subscriptionTier TEXT DEFAULT 'free',
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Memes Table
```sql
CREATE TABLE memes (
  memeId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID REFERENCES users(userId),
  templateUrl TEXT,
  generatedCaption TEXT,
  finalCaption TEXT,
  platformOptimizations JSONB DEFAULT '{}',
  performanceAnalytics JSONB DEFAULT '{}',
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Trends Table
```sql
CREATE TABLE trends (
  trendId TEXT PRIMARY KEY,
  topic TEXT NOT NULL,
  formatName TEXT,
  imageUrl TEXT,
  source TEXT,
  detectedAt TIMESTAMP WITH TIME ZONE,
  confidenceScore DECIMAL(3,2),
  metadata JSONB DEFAULT '{}'
);
```

### Authentication Functions

#### `signUp(email, password)`
Creates a new user account.

**Parameters:**
- `email` (string): User's email address
- `password` (string): User's password

**Returns:**
```javascript
Promise<{
  user: User | null,
  error: string | null
}>
```

#### `signIn(email, password)`
Authenticates an existing user.

#### `signOut()`
Signs out the current user.

#### `getCurrentUser()`
Gets the currently authenticated user.

### Data Operations

#### `saveMeme(meme)`
Saves a new meme to the database.

**Parameters:**
- `meme` (object): Meme data object

**Returns:**
```javascript
Promise<{
  data: Meme | null,
  error: string | null
}>
```

#### `getMemes(userId)`
Retrieves all memes for a specific user.

#### `updateMemePerformance(memeId, analytics)`
Updates performance analytics for a meme.

#### `getTrends()`
Retrieves trending topics from the database.

#### `saveTrend(trend)`
Saves a new trend to the database.

## Farcaster/Neynar API

### Overview
The Farcaster service analyzes social media trends from the Farcaster decentralized social network using the Neynar API.

### Configuration
```javascript
const neynarApi = axios.create({
  baseURL: 'https://api.neynar.com/v2',
  headers: {
    'Accept': 'application/json',
    'api_key': NEYNAR_API_KEY,
  },
})
```

### Functions

#### `getTrendingCasts(limit, timeWindow)`
Fetches trending casts from Farcaster.

**Parameters:**
- `limit` (number): Number of casts to retrieve (default: 25)
- `timeWindow` (string): Time window for trends (default: '24h')

**Returns:**
```javascript
Promise<{
  data: Cast[],
  error: string | null
}>
```

#### `searchMemeCasts(query, limit)`
Searches for meme-related content on Farcaster.

**Parameters:**
- `query` (string): Search query
- `limit` (number): Maximum results (default: 20)

#### `getMemeChannels()`
Retrieves information about meme-related channels.

#### `getChannelCasts(channelId, limit)`
Gets casts from a specific channel.

#### `extractTrendingTopics()`
Analyzes casts to extract trending meme topics.

**Returns:**
```javascript
Promise<{
  data: Trend[],
  error: string | null
}>
```

**Trend Object:**
```javascript
{
  trendId: string,
  topic: string,
  formatName: string,
  imageUrl: string,
  source: 'Farcaster',
  detectedAt: Date,
  confidenceScore: number,
  originalCast: Cast
}
```

### Content Analysis

#### `analyzeMemeContent(cast)`
Analyzes a cast for meme potential.

**Returns:**
```javascript
{
  hasMemeContent: boolean,
  confidenceScore: number,
  indicators: {
    hasImages: boolean,
    hasMemeLang: boolean,
    hasReactions: boolean,
    isRecent: boolean
  }
}
```

**Meme Indicators:**
- Images from popular platforms (Imgur, Giphy)
- Meme language keywords
- High engagement (likes, recasts)
- Recent timestamp

## Airstack API

### Overview
The Airstack service analyzes onchain data and social graphs to identify viral trends in the web3 space.

### Configuration
```javascript
const airstackApi = axios.create({
  baseURL: 'https://api.airstack.xyz/gql',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': AIRSTACK_API_KEY,
  },
})
```

### GraphQL Queries

#### Trending Social Profiles
```graphql
query GetTrendingSocial($limit: Int!) {
  Socials(
    input: {
      filter: { dappName: {_in: [farcaster, lens]} },
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
    }
  }
}
```

#### Meme NFT Collections
```graphql
query GetMemeNFTs($limit: Int!) {
  TokenNfts(
    input: {
      filter: { name: {_regex: "(?i)(meme|pepe|doge|wojak|chad|karen)"} },
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
      }
    }
  }
}
```

### Functions

#### `getTrendingSocialProfiles(limit)`
Gets trending social profiles that might be meme creators.

#### `getMemeNFTCollections(limit)`
Retrieves NFT collections related to memes.

#### `getViralTokenActivity(limit)`
Analyzes token transfers for viral patterns.

#### `getOnchainMemeTrends()`
Combines all onchain data to generate trend insights.

**Returns:**
```javascript
Promise<{
  data: Trend[],
  error: string | null
}>
```

**Onchain Trend Object:**
```javascript
{
  trendId: string,
  topic: string,
  formatName: string,
  imageUrl: string,
  source: 'Onchain (Airstack)',
  detectedAt: Date,
  confidenceScore: number,
  metadata: {
    type: 'nft_collection' | 'viral_token',
    address?: string,
    totalSupply?: number,
    transferCount?: number,
    uniqueHolders?: number,
    blockchain: string
  }
}
```

## Trend Service

### Overview
The Trend Service aggregates data from multiple sources (Farcaster, Airstack, cached trends) to provide comprehensive trend analysis.

### Class: TrendService

#### Constructor
```javascript
const trendService = new TrendService()
```

**Configuration from Environment:**
- `VITE_ENABLE_FARCASTER_TRENDS` - Enable Farcaster trends
- `VITE_ENABLE_ONCHAIN_TRENDS` - Enable onchain trends
- `VITE_MOCK_API_RESPONSES` - Use mock data
- `VITE_DEBUG_MODE` - Enable debug logging

### Methods

#### `getAllTrends()`
Aggregates trends from all enabled sources.

**Returns:**
```javascript
Promise<{
  data: Trend[],
  error: string | null,
  sources: {
    farcaster: boolean,
    onchain: boolean,
    cached: boolean
  }
}>
```

**Process:**
1. Fetch trends from enabled sources in parallel
2. Deduplicate similar trends
3. Sort by confidence score
4. Cache new trends to database
5. Return top 20 trends

#### `searchTrends(keyword, limit)`
Searches trends by keyword.

#### `getTrendsByCategory(category)`
Filters trends by category.

**Categories:**
- `tech` - AI, crypto, blockchain, NFT, web3
- `lifestyle` - Coffee, Monday, weekend, work, life
- `entertainment` - Movies, TV, celebrity, music, games
- `sports` - Football, basketball, soccer, sports
- `politics` - Election, politics, government, news

#### `getTrendAnalytics(trendId)`
Provides detailed analytics for a specific trend.

**Returns:**
```javascript
Promise<{
  data: {
    trend: Trend,
    metrics: {
      confidenceScore: number,
      ageInHours: number,
      source: string,
      category: string,
      viralPotential: number,
      platformSuitability: {
        twitter: number,
        instagram: number,
        tiktok: number,
        reddit: number,
        facebook: number
      }
    },
    recommendations: string[]
  },
  error: string | null
}>
```

### Deduplication Algorithm

The service uses Jaccard similarity to identify and remove duplicate trends:

```javascript
calculateSimilarity(str1, str2) {
  const set1 = new Set(str1.split(' '))
  const set2 = new Set(str2.split(' '))
  
  const intersection = new Set([...set1].filter(x => set2.has(x)))
  const union = new Set([...set1, ...set2])
  
  return intersection.size / union.size
}
```

Trends with >80% similarity are considered duplicates.

## Platform Optimization

### Overview
The Platform Optimization service provides platform-specific recommendations for meme content.

### Supported Platforms

#### Twitter/X
- **Max Text Length:** 280 characters
- **Aspect Ratio:** 16:9
- **Image Size:** 1200x675px
- **Best Times:** 9-10 AM, 7-9 PM
- **Hashtags:** 1-2 max

#### Instagram
- **Max Text Length:** 2200 characters
- **Aspect Ratio:** 1:1
- **Image Size:** 1080x1080px
- **Best Times:** 11 AM-1 PM, 7-9 PM
- **Hashtags:** 5-10 recommended

#### TikTok
- **Max Text Length:** 150 characters
- **Aspect Ratio:** 9:16
- **Image Size:** 1080x1920px
- **Best Times:** 6-10 AM, 7-9 PM
- **Focus:** Vertical format, trending sounds

#### Reddit
- **Max Text Length:** 40,000 characters
- **Aspect Ratio:** 16:9
- **Image Size:** 1200x675px
- **Best Times:** 8-10 AM weekdays
- **Focus:** Subreddit rules, authentic content

### Functions

#### `getPlatformOptimization(platform, memeData)`
Gets optimization recommendations for a specific platform.

**Parameters:**
- `platform` (string): Platform name
- `memeData` (object): Meme data including caption

**Returns:**
```javascript
{
  platform: string,
  aspectRatio: string,
  imageSize: { width: number, height: number },
  maxTextLength: number,
  recommendations: string[],
  warnings: string[],
  bestPractices: string[]
}
```

#### `getAllPlatformOptimizations(memeData)`
Gets optimizations for all supported platforms.

#### `generateHashtags(platform, topic, memeFormat)`
Generates platform-specific hashtags.

#### `optimizeMemeForPlatform(meme, platform)`
Optimizes a meme for a specific platform.

**Returns:**
```javascript
{
  ...meme,
  platformOptimizations: {
    [platform]: {
      caption: string,
      hashtags: string[],
      aspectRatio: string,
      imageSize: { width: number, height: number },
      recommendations: string[],
      warnings: string[],
      bestPractices: string[]
    }
  }
}
```

#### `getPostingTimeRecommendations(platform, timezone)`
Gets optimal posting times for a platform.

## Error Handling

### Standard Error Response
All API functions return errors in a consistent format:

```javascript
{
  data: null,
  error: string
}
```

### Error Types

#### API Errors
- **Authentication Failed:** Invalid API keys
- **Rate Limited:** Too many requests
- **Service Unavailable:** External API down
- **Invalid Request:** Malformed parameters

#### Database Errors
- **Connection Failed:** Database unavailable
- **Query Failed:** Invalid SQL or constraints
- **Permission Denied:** Insufficient privileges

#### Validation Errors
- **Missing Parameters:** Required fields not provided
- **Invalid Format:** Data doesn't match expected format
- **Length Exceeded:** Content too long for platform

### Fallback Strategies

#### Trend Service Fallbacks
1. **Primary:** Live API data
2. **Secondary:** Cached database data
3. **Tertiary:** Static fallback data

#### Caption Generation Fallbacks
1. **Primary:** OpenAI API
2. **Secondary:** Template-based generation
3. **Tertiary:** Default captions

## Rate Limits

### OpenAI API
- **Requests:** 3,500 requests per minute
- **Tokens:** 90,000 tokens per minute
- **Strategy:** Queue requests, implement backoff

### Neynar API
- **Free Tier:** 1,000 requests per day
- **Paid Tier:** 10,000+ requests per day
- **Strategy:** Cache results, batch requests

### Airstack API
- **Free Tier:** 1,000 requests per day
- **Paid Tier:** 10,000+ requests per day
- **Strategy:** Cache results, optimize queries

### Supabase
- **Free Tier:** 50,000 monthly active users
- **Database:** 500MB storage
- **Strategy:** Optimize queries, implement pagination

## Best Practices

### API Usage
1. **Cache Results:** Store frequently accessed data
2. **Implement Retries:** Handle temporary failures
3. **Use Fallbacks:** Provide alternative data sources
4. **Monitor Limits:** Track API usage and quotas
5. **Optimize Queries:** Minimize API calls

### Error Handling
1. **Graceful Degradation:** App works with limited functionality
2. **User Feedback:** Clear error messages
3. **Logging:** Track errors for debugging
4. **Recovery:** Automatic retry mechanisms

### Performance
1. **Parallel Requests:** Fetch data concurrently
2. **Pagination:** Load data in chunks
3. **Debouncing:** Limit search requests
4. **Lazy Loading:** Load content on demand

---

This documentation covers all the major APIs and services in MemePulse. For specific implementation details, refer to the source code in the `src/services/` directory.
