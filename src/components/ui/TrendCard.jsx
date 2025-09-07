import React from 'react'
import { TrendingUp, Clock, ExternalLink, Sparkles } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import Button from './Button'
import Card from './Card'

const TrendCard = ({ 
  trend, 
  onSelect, 
  onExplore,
  className = '' 
}) => {
  const handleSelect = () => {
    if (onSelect) {
      onSelect(trend)
    }
  }
  
  const handleExplore = (e) => {
    e.stopPropagation()
    if (onExplore) {
      onExplore(trend)
    }
  }
  
  const getConfidenceColor = (score) => {
    if (score >= 0.8) return 'text-green-400 bg-green-400/10'
    if (score >= 0.6) return 'text-yellow-400 bg-yellow-400/10'
    return 'text-red-400 bg-red-400/10'
  }
  
  const getSourceIcon = (source) => {
    switch (source.toLowerCase()) {
      case 'farcaster':
        return '🟣'
      case 'onchain (airstack)':
        return '⛓️'
      case 'reddit':
        return '🔴'
      case 'twitter':
        return '🐦'
      case 'instagram':
        return '📸'
      case 'tiktok':
        return '🎵'
      default:
        return '🌐'
    }
  }
  
  return (
    <Card 
      className={`cursor-pointer hover:shadow-lg transition-all duration-200 group ${className}`}
      onClick={handleSelect}
    >
      <div className="relative">
        {/* Trend Image */}
        <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-4">
          <img
            src={trend.imageUrl}
            alt={trend.topic}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            loading="lazy"
          />
          
          {/* Overlay with confidence score */}
          <div className="absolute top-2 right-2 flex items-center space-x-2">
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(trend.confidenceScore)}`}>
              {Math.round(trend.confidenceScore * 100)}%
            </div>
          </div>
          
          {/* Source badge */}
          <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
            <span>{getSourceIcon(trend.source)}</span>
            <span>{trend.source}</span>
          </div>
        </div>
        
        {/* Trend Info */}
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-primary transition-colors">
              {trend.topic}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {trend.formatName}
            </p>
          </div>
          
          {/* Metadata */}
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{formatDistanceToNow(new Date(trend.detectedAt), { addSuffix: true })}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <TrendingUp className="h-4 w-4" />
              <span>Trending</span>
            </div>
          </div>
          
          {/* Additional metadata for onchain trends */}
          {trend.metadata && (
            <div className="text-xs text-gray-400 space-y-1">
              {trend.metadata.type === 'nft_collection' && (
                <div className="flex items-center justify-between">
                  <span>Supply:</span>
                  <span>{trend.metadata.totalSupply?.toLocaleString()}</span>
                </div>
              )}
              {trend.metadata.type === 'viral_token' && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Transfers:</span>
                    <span>{trend.metadata.transferCount?.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Holders:</span>
                    <span>{trend.metadata.uniqueHolders?.toLocaleString()}</span>
                  </div>
                </div>
              )}
              {trend.metadata.blockchain && (
                <div className="flex items-center justify-between">
                  <span>Chain:</span>
                  <span className="capitalize">{trend.metadata.blockchain}</span>
                </div>
              )}
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-2 pt-2">
            <Button
              variant="primary"
              size="sm"
              className="flex-1"
              onClick={handleSelect}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Use Template
            </Button>
            
            {onExplore && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleExplore}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

export default TrendCard
