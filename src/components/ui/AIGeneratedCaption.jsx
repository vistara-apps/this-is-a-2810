import React, { useState } from 'react'
import { Check, Copy, Edit3, Sparkles, RefreshCw } from 'lucide-react'
import Button from './Button'
import Input from './Input'

const AIGeneratedCaption = ({ 
  variant = 'suggestion',
  caption,
  onSelect,
  onEdit,
  onCopy,
  onRegenerate,
  isSelected = false,
  isEditing = false,
  className = ''
}) => {
  const [editedCaption, setEditedCaption] = useState(caption)
  const [copied, setCopied] = useState(false)
  
  const handleSelect = () => {
    if (onSelect) {
      onSelect(caption)
    }
  }
  
  const handleEdit = () => {
    if (onEdit) {
      onEdit(editedCaption)
    }
  }
  
  const handleCopy = async () => {
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(caption)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        if (onCopy) {
          onCopy(caption)
        }
      } catch (err) {
        console.error('Failed to copy caption:', err)
      }
    }
  }
  
  const handleRegenerate = () => {
    if (onRegenerate) {
      onRegenerate()
    }
  }
  
  const baseClasses = 'relative p-4 rounded-lg border transition-all duration-200'
  
  const variantClasses = {
    suggestion: `cursor-pointer hover:shadow-md ${
      isSelected 
        ? 'border-primary bg-primary/5 shadow-md' 
        : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
    }`,
    editable: 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
  }
  
  if (variant === 'suggestion') {
    return (
      <div 
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        onClick={handleSelect}
      >
        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
            <Check className="h-3 w-3 text-white" />
          </div>
        )}
        
        {/* AI indicator */}
        <div className="flex items-center space-x-2 mb-3">
          <div className="flex items-center space-x-1 text-xs text-primary">
            <Sparkles className="h-3 w-3" />
            <span>AI Generated</span>
          </div>
        </div>
        
        {/* Caption text */}
        <p className="text-gray-900 dark:text-white leading-relaxed mb-3">
          {caption}
        </p>
        
        {/* Action buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                handleCopy()
              }}
              className="text-xs"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </>
              )}
            </Button>
            
            {onRegenerate && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRegenerate()
                }}
                className="text-xs"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Regenerate
              </Button>
            )}
          </div>
          
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Click to select
          </div>
        </div>
      </div>
    )
  }
  
  if (variant === 'editable') {
    return (
      <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-xs text-primary">
              <Sparkles className="h-3 w-3" />
              <span>AI Generated Caption</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="text-xs"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </>
              )}
            </Button>
            
            {onRegenerate && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRegenerate}
                className="text-xs"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Regenerate
              </Button>
            )}
          </div>
        </div>
        
        {/* Editable caption */}
        {isEditing ? (
          <div className="space-y-3">
            <Input
              variant="textarea"
              value={editedCaption}
              onChange={(e) => setEditedCaption(e.target.value)}
              placeholder="Edit your caption..."
              rows={3}
              className="resize-none"
            />
            
            <div className="flex items-center space-x-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleEdit}
              >
                <Check className="h-3 w-3 mr-1" />
                Save Changes
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditedCaption(caption)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-gray-900 dark:text-white leading-relaxed">
              {caption}
            </p>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit && onEdit(true)}
            >
              <Edit3 className="h-3 w-3 mr-1" />
              Edit Caption
            </Button>
          </div>
        )}
        
        {/* Character count */}
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Character count: {(isEditing ? editedCaption : caption).length}</span>
            
            {/* Platform recommendations */}
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded ${
                caption.length <= 280 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                Twitter: {caption.length <= 280 ? '✓' : '✗'}
              </span>
              <span className={`px-2 py-1 rounded ${
                caption.length <= 2200 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                Instagram: {caption.length <= 2200 ? '✓' : '✗'}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  return null
}

export default AIGeneratedCaption
