import React from 'react'
import { Download, Share2, Heart, Eye } from 'lucide-react'
import Button from './Button'

const MemeTemplate = ({ 
  variant = 'gallery-item', 
  template, 
  onSelect, 
  onDownload, 
  onShare,
  className = '' 
}) => {
  const baseClasses = 'relative overflow-hidden rounded-lg transition-all duration-200'
  
  const variantClasses = {
    'gallery-item': 'cursor-pointer hover:scale-105 hover:shadow-lg group',
    'editor-preview': 'border-2 border-dashed border-gray-300 hover:border-primary'
  }
  
  const handleClick = () => {
    if (variant === 'gallery-item' && onSelect) {
      onSelect(template)
    }
  }
  
  const handleDownload = (e) => {
    e.stopPropagation()
    if (onDownload) {
      onDownload(template)
    }
  }
  
  const handleShare = (e) => {
    e.stopPropagation()
    if (onShare) {
      onShare(template)
    }
  }
  
  if (variant === 'gallery-item') {
    return (
      <div 
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        onClick={handleClick}
      >
        <div className="aspect-square bg-gray-100 dark:bg-gray-800">
          <img
            src={template.url || template.imageUrl}
            alt={template.name || template.topic}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        
        {/* Overlay with template info */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-semibold text-sm mb-1">
              {template.name || template.topic}
            </h3>
            {template.description && (
              <p className="text-white/80 text-xs line-clamp-2">
                {template.description}
              </p>
            )}
            
            {/* Action buttons */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-2 text-white/80 text-xs">
                {template.views && (
                  <div className="flex items-center space-x-1">
                    <Eye className="h-3 w-3" />
                    <span>{template.views.toLocaleString()}</span>
                  </div>
                )}
                {template.likes && (
                  <div className="flex items-center space-x-1">
                    <Heart className="h-3 w-3" />
                    <span>{template.likes.toLocaleString()}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-1">
                {onDownload && (
                  <Button
                    variant="icon"
                    size="sm"
                    onClick={handleDownload}
                    className="bg-white/20 hover:bg-white/30 text-white border-0"
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                )}
                {onShare && (
                  <Button
                    variant="icon"
                    size="sm"
                    onClick={handleShare}
                    className="bg-white/20 hover:bg-white/30 text-white border-0"
                  >
                    <Share2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Confidence score badge */}
        {template.confidenceScore && (
          <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
            {Math.round(template.confidenceScore * 100)}%
          </div>
        )}
      </div>
    )
  }
  
  if (variant === 'editor-preview') {
    return (
      <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
        <div className="aspect-square bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          {template ? (
            <img
              src={template.url || template.imageUrl}
              alt={template.name || template.topic}
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <div className="text-center text-gray-400">
              <div className="w-16 h-16 mx-auto mb-2 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm">Select a template</p>
            </div>
          )}
        </div>
        
        {template && (
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <h4 className="font-medium text-sm text-gray-900 dark:text-white">
              {template.name || template.topic}
            </h4>
            {template.description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {template.description}
              </p>
            )}
          </div>
        )}
      </div>
    )
  }
  
  return null
}

export default MemeTemplate
