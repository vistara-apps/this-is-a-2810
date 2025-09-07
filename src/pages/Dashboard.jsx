import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Sparkles, 
  TrendingUp, 
  BarChart3, 
  Users,
  Heart,
  Share,
  Eye,
  ArrowUpRight
} from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useApp } from '../context/AppContext'
import { formatDistanceToNow } from 'date-fns'

const Dashboard = () => {
  const { user, memes, trends } = useApp()

  const totalViews = memes.reduce((acc, meme) => acc + meme.performanceAnalytics.views, 0)
  const totalLikes = memes.reduce((acc, meme) => acc + meme.performanceAnalytics.likes, 0)
  const totalShares = memes.reduce((acc, meme) => acc + meme.performanceAnalytics.shares, 0)

  const stats = [
    { name: 'Total Views', value: totalViews.toLocaleString(), icon: Eye, color: 'text-blue-400' },
    { name: 'Total Likes', value: totalLikes.toLocaleString(), icon: Heart, color: 'text-red-400' },
    { name: 'Total Shares', value: totalShares.toLocaleString(), icon: Share, color: 'text-green-400' },
    { name: 'Memes Created', value: memes.length.toString(), icon: Sparkles, color: 'text-purple-400' }
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Welcome back!</h1>
          <p className="mt-2 text-white/70">
            Ready to create some viral content?
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Link to="/create">
            <Button variant="primary">
              <Sparkles className="h-4 w-4 mr-2" />
              Create Meme
            </Button>
          </Link>
          <Link to="/trends">
            <Button variant="secondary">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Trends
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} variant="elevated" className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-white/70">{stat.name}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Memes */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Recent Memes</h2>
            <Link to="/analytics">
              <Button variant="outline" size="sm">
                View All
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="space-y-4">
            {memes.slice(0, 3).map((meme) => (
              <div key={meme.memeId} className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg">
                <img 
                  src={meme.templateUrl} 
                  alt="Meme template"
                  className="h-12 w-12 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {meme.finalCaption}
                  </p>
                  <p className="text-xs text-white/60">
                    {formatDistanceToNow(meme.createdAt, { addSuffix: true })}
                  </p>
                </div>
                <div className="flex items-center space-x-4 text-xs text-white/70">
                  <span className="flex items-center">
                    <Eye className="h-3 w-3 mr-1" />
                    {meme.performanceAnalytics.views}
                  </span>
                  <span className="flex items-center">
                    <Heart className="h-3 w-3 mr-1" />
                    {meme.performanceAnalytics.likes}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Trending Now */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Trending Now</h2>
            <Link to="/trends">
              <Button variant="outline" size="sm">
                View All
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="space-y-4">
            {trends.slice(0, 3).map((trend) => (
              <div key={trend.trendId} className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg">
                <img 
                  src={trend.imageUrl} 
                  alt={trend.formatName}
                  className="h-12 w-12 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">
                    {trend.formatName}
                  </p>
                  <p className="text-xs text-white/60">
                    {trend.source} • {formatDistanceToNow(trend.detectedAt, { addSuffix: true })}
                  </p>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center text-xs text-green-400">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {Math.round(trend.confidenceScore * 100)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard