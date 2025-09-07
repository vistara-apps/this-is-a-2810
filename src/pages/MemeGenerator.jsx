import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Sparkles, 
  Download, 
  Share2, 
  RefreshCw,
  Wand2,
  Image as ImageIcon
} from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { useApp } from '../context/AppContext'
import { generateMemeCaption } from '../services/openai'

const popularTemplates = [
  {
    id: '1',
    name: 'Distracted Boyfriend',
    url: 'https://i.imgflip.com/1ur9b0.jpg',
    description: 'Perfect for choice/preference memes'
  },
  {
    id: '2',
    name: 'Drake Pointing',
    url: 'https://i.imgflip.com/30b1gx.jpg',
    description: 'Great for showing preferences'
  },
  {
    id: '3',
    name: 'Expanding Brain',
    url: 'https://i.imgflip.com/1jwhww.jpg',
    description: 'Ideal for showing levels of intelligence'
  },
  {
    id: '4',
    name: 'Woman Yelling at Cat',
    url: 'https://i.imgflip.com/345v97.jpg',
    description: 'Perfect for argument/reaction memes'
  },
  {
    id: '5',
    name: 'This Is Fine',
    url: 'https://i.imgflip.com/26am.jpg',
    description: 'Great for showing calm in chaos'
  },
  {
    id: '6',
    name: 'Two Buttons',
    url: 'https://i.imgflip.com/1g8my4.jpg',
    description: 'Perfect for difficult choices'
  }
]

const platformOptimizations = {
  twitter: {
    name: 'Twitter',
    tips: ['Keep text concise', 'Use trending hashtags', 'Post during peak hours'],
    aspectRatio: '16:9 or square'
  },
  instagram: {
    name: 'Instagram',
    tips: ['Use square format', 'Add relevant hashtags', 'Include call-to-action'],
    aspectRatio: '1:1 square'
  },
  tiktok: {
    name: 'TikTok',
    tips: ['Use vertical format', 'Add trending sounds', 'Keep it short and snappy'],
    aspectRatio: '9:16 vertical'
  },
  reddit: {
    name: 'Reddit',
    tips: ['Follow subreddit rules', 'Add context in comments', 'Engage with community'],
    aspectRatio: 'Any, but 16:9 preferred'
  }
}

const MemeGenerator = () => {
  const navigate = useNavigate()
  const { addMeme } = useApp()
  
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [keyword, setKeyword] = useState('')
  const [generatedCaptions, setGeneratedCaptions] = useState([])
  const [selectedCaption, setSelectedCaption] = useState('')
  const [customCaption, setCustomCaption] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState('templates')

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template)
    setGeneratedCaptions([])
    setSelectedCaption('')
    setCustomCaption('')
  }

  const handleGenerateCaptions = async () => {
    if (!selectedTemplate || !keyword.trim()) return

    setIsGenerating(true)
    try {
      const captions = await generateMemeCaption(selectedTemplate.name, keyword)
      setGeneratedCaptions(captions)
    } catch (error) {
      console.error('Error generating captions:', error)
      // Fallback to mock captions
      const mockCaptions = [
        `When ${keyword} meets reality`,
        `${keyword}: Expectation vs Reality`,
        `Me trying to understand ${keyword}`,
        `${keyword} be like...`,
        `POV: You're dealing with ${keyword}`
      ]
      setGeneratedCaptions(mockCaptions)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCreateMeme = () => {
    const finalCaption = selectedCaption || customCaption
    if (!selectedTemplate || !finalCaption.trim()) return

    const newMeme = {
      templateUrl: selectedTemplate.url,
      generatedCaption: selectedCaption,
      finalCaption: finalCaption,
      platformOptimizations: platformOptimizations
    }

    addMeme(newMeme)
    navigate('/analytics')
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Create Your Meme</h1>
        <p className="mt-2 text-white/70">
          Choose a template, add your twist, and let AI help you craft the perfect caption
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Template Selection & Generation */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-white/10 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('templates')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === 'templates'
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <ImageIcon className="h-4 w-4 inline mr-2" />
              Templates
            </button>
            <button
              onClick={() => setActiveTab('generate')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === 'generate'
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Wand2 className="h-4 w-4 inline mr-2" />
              Generate
            </button>
          </div>

          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Popular Templates</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {popularTemplates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className={`cursor-pointer rounded-lg border-2 transition-all ${
                      selectedTemplate?.id === template.id
                        ? 'border-accent shadow-lg'
                        : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    <img
                      src={template.url}
                      alt={template.name}
                      className="w-full h-32 object-cover rounded-t-lg"
                    />
                    <div className="p-3 bg-white/5 rounded-b-lg">
                      <h3 className="text-sm font-medium text-white">{template.name}</h3>
                      <p className="text-xs text-white/60 mt-1">{template.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Generate Tab */}
          {activeTab === 'generate' && selectedTemplate && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Generate Caption</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Keyword or Topic
                  </label>
                  <Input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="e.g., work from home, Monday mornings, coding..."
                    className="w-full"
                  />
                </div>
                
                <Button 
                  onClick={handleGenerateCaptions}
                  disabled={!keyword.trim() || isGenerating}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Captions
                    </>
                  )}
                </Button>

                {generatedCaptions.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-white">AI Generated Captions:</h3>
                    {generatedCaptions.map((caption, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedCaption(caption)}
                        className={`p-3 rounded-lg cursor-pointer transition-all ${
                          selectedCaption === caption
                            ? 'bg-accent/20 border border-accent'
                            : 'bg-white/5 hover:bg-white/10 border border-white/20'
                        }`}
                      >
                        <p className="text-white text-sm">{caption}</p>
                      </div>
                    ))}
                    
                    <div className="pt-4 border-t border-white/20">
                      <label className="block text-sm font-medium text-white mb-2">
                        Or write your own:
                      </label>
                      <Input
                        variant="textarea"
                        value={customCaption}
                        onChange={(e) => setCustomCaption(e.target.value)}
                        placeholder="Write your custom caption..."
                        rows={3}
                      />
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Preview & Platform Tips */}
        <div className="space-y-6">
          {/* Preview */}
          {selectedTemplate && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Preview</h3>
              <div className="space-y-4">
                <img
                  src={selectedTemplate.url}
                  alt={selectedTemplate.name}
                  className="w-full rounded-lg"
                />
                {(selectedCaption || customCaption) && (
                  <div className="p-3 bg-white/10 rounded-lg">
                    <p className="text-white text-sm font-medium">
                      {selectedCaption || customCaption}
                    </p>
                  </div>
                )}
                
                {(selectedCaption || customCaption) && (
                  <div className="flex space-x-2">
                    <Button onClick={handleCreateMeme} className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Save Meme
                    </Button>
                    <Button variant="secondary">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Platform Optimization Tips */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Platform Tips</h3>
            <div className="space-y-4">
              {Object.entries(platformOptimizations).map(([key, platform]) => (
                <div key={key} className="border-b border-white/10 pb-4 last:border-b-0 last:pb-0">
                  <h4 className="font-medium text-white mb-2">{platform.name}</h4>
                  <p className="text-xs text-white/60 mb-2">Format: {platform.aspectRatio}</p>
                  <ul className="space-y-1">
                    {platform.tips.map((tip, index) => (
                      <li key={index} className="text-xs text-white/70 flex items-center">
                        <span className="w-1 h-1 bg-accent rounded-full mr-2"></span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default MemeGenerator