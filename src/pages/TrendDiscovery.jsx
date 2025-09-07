import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  TrendingUp, 
  Clock, 
  ExternalLink,
  Sparkles,
  Search,
  Filter,
  Bookmark,
  Check
} from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { useApp } from '../context/AppContext'
import { formatDistanceToNow } from 'date-fns'

const TrendDiscovery = () => {
  const navigate = useNavigate()
  const { trends, setSelectedTrend } = useApp()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSource, setSelectedSource] = useState('all')
  const [sortBy, setSortBy] = useState('confidence')
  const [savedTrends, setSavedTrends] = useState(new Set())

  const sources = ['all', 'Reddit', 'Twitter', 'Instagram', 'TikTok']

  const filteredTrends = trends
    .filter(trend => {
      const matchesSearch = trend.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           trend.formatName.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesSource = selectedSource === 'all' || trend.source === selectedSource
      return matchesSearch && matchesSource
    })
    .sort((a, b) => {
      if (sortBy === 'confidence') return b.confidenceScore - a.confidenceScore
      if (sortBy === 'recent') return new Date(b.detectedAt) - new Date(a.detectedAt)
      return 0
    })

  const handleUseTrend = (trend) => {
    setSelectedTrend(trend)
    navigate('/create')
  }

  const toggleSavedTrend = (trendId) => {
    const newSaved = new Set(savedTrends)
    if (newSaved.has(trendId)) {
      newSaved.delete(trendId)
    } else {
      newSaved.add(trendId)
    }
    setSavedTrends(newSaved)
  }

  const getConfidenceColor = (score) => {
    if (score >= 0.9) return 'text-green-400'
    if (score >= 0.8) return 'text-yellow-400'
    return 'text-orange-400'
  }

  const getConfidenceLabel = (score) => {
    if (score >= 0.9) return 'Hot'
    if (score >= 0.8) return 'Rising'
    return 'Emerging'
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Trending Meme Formats</h1>
        <p className="mt-2 text-white/70">
          Discover emerging meme formats before they become oversaturated
        </p>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search trends..."
                className="pl-10"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white mb-2">Source</label>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="block w-full rounded-md border-0 py-2 px-3 bg-white/10 text-white border border-white/20 focus:ring-2 focus:ring-accent sm:text-sm"
            >
              {sources.map(source => (
                <option key={source} value={source} className="bg-gray-800">
                  {source === 'all' ? 'All Sources' : source}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white mb-2">Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="block w-full rounded-md border-0 py-2 px-3 bg-white/10 text-white border border-white/20 focus:ring-2 focus:ring-accent sm:text-sm"
            >
              <option value="confidence" className="bg-gray-800">Confidence Score</option>
              <option value="recent" className="bg-gray-800">Most Recent</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <Button variant="secondary" className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Trends Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrends.map((trend) => (
          <Card key={trend.trendId} variant="elevated" className="overflow-hidden">
            <div className="relative">
              <img
                src={trend.imageUrl}
                alt={trend.formatName}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4 flex space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full bg-black/50 ${getConfidenceColor(trend.confidenceScore)}`}>
                  {getConfidenceLabel(trend.confidenceScore)}
                </span>
                <button
                  onClick={() => toggleSavedTrend(trend.trendId)}
                  className="p-1.5 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                >
                  {savedTrends.has(trend.trendId) ? (
                    <Check className="h-4 w-4 text-accent" />
                  ) : (
                    <Bookmark className="h-4 w-4 text-white" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-white">{trend.formatName}</h3>
                  <p className="text-sm text-white/70 mt-1">{trend.topic}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-white/60 mb-4">
                <div className="flex items-center">
                  <span className="font-medium">{trend.source}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDistanceToNow(trend.detectedAt, { addSuffix: true })}
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <TrendingUp className={`h-4 w-4 mr-2 ${getConfidenceColor(trend.confidenceScore)}`} />
                  <span className="text-sm text-white">
                    {Math.round(trend.confidenceScore * 100)}% confidence
                  </span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  onClick={() => handleUseTrend(trend)}
                  variant="primary" 
                  size="sm" 
                  className="flex-1"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Use Template
                </Button>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredTrends.length === 0 && (
        <Card className="p-12 text-center">
          <TrendingUp className="h-12 w-12 text-white/40 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No trends found</h3>
          <p className="text-white/60">
            Try adjusting your search terms or filters to discover more trends.
          </p>
        </Card>
      )}
    </div>
  )
}

export default TrendDiscovery
