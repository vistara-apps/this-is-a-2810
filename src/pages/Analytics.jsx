import React, { useState } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  Heart, 
  Share2, 
  MessageSquare,
  Calendar,
  Download,
  ExternalLink
} from 'lucide-react'
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useApp } from '../context/AppContext'
import { formatDistanceToNow } from 'date-fns'

const Analytics = () => {
  const { memes } = useApp()
  const [timeRange, setTimeRange] = useState('7d')

  // Mock data for charts
  const performanceData = [
    { name: 'Mon', views: 1200, likes: 45, shares: 12 },
    { name: 'Tue', views: 1900, likes: 78, shares: 23 },
    { name: 'Wed', views: 3000, likes: 120, shares: 45 },
    { name: 'Thu', views: 2800, likes: 98, shares: 34 },
    { name: 'Fri', views: 3900, likes: 156, shares: 67 },
    { name: 'Sat', views: 4800, likes: 189, shares: 89 },
    { name: 'Sun', views: 3200, likes: 134, shares: 56 }
  ]

  const engagementData = [
    { name: 'Views', value: 24000, color: '#3B82F6' },
    { name: 'Likes', value: 1200, color: '#EF4444' },
    { name: 'Shares', value: 326, color: '#10B981' },
    { name: 'Comments', value: 98, color: '#F59E0B' }
  ]

  const topMemes = [...memes].sort((a, b) => 
    b.performanceAnalytics.views - a.performanceAnalytics.views
  ).slice(0, 5)

  const totalViews = memes.reduce((acc, meme) => acc + meme.performanceAnalytics.views, 0)
  const totalLikes = memes.reduce((acc, meme) => acc + meme.performanceAnalytics.likes, 0)
  const totalShares = memes.reduce((acc, meme) => acc + meme.performanceAnalytics.shares, 0)
  const totalComments = memes.reduce((acc, meme) => acc + meme.performanceAnalytics.comments, 0)

  const avgEngagementRate = memes.length > 0 ? 
    ((totalLikes + totalShares + totalComments) / totalViews * 100).toFixed(2) : 0

  const stats = [
    { 
      name: 'Total Views', 
      value: totalViews.toLocaleString(), 
      change: '+12%', 
      changeType: 'positive',
      icon: Eye 
    },
    { 
      name: 'Engagement Rate', 
      value: `${avgEngagementRate}%`, 
      change: '+0.5%', 
      changeType: 'positive',
      icon: Heart 
    },
    { 
      name: 'Total Shares', 
      value: totalShares.toLocaleString(), 
      change: '+8%', 
      changeType: 'positive',
      icon: Share2 
    },
    { 
      name: 'Viral Score', 
      value: '7.2/10', 
      change: '+0.3', 
      changeType: 'positive',
      icon: TrendingUp 
    }
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
          <p className="mt-2 text-white/70">
            Track your meme performance and understand what resonates with your audience
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="rounded-md border-0 py-2 px-3 bg-white/10 text-white border border-white/20 focus:ring-2 focus:ring-accent text-sm"
          >
            <option value="7d" className="bg-gray-800">Last 7 days</option>
            <option value="30d" className="bg-gray-800">Last 30 days</option>
            <option value="90d" className="bg-gray-800">Last 90 days</option>
          </select>
          <Button variant="secondary">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} variant="elevated" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/70">{stat.name}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-white/60 ml-1">vs last period</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <stat.icon className="h-8 w-8 text-accent" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Over Time */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Performance Over Time</h2>
            <div className="flex space-x-2 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                <span className="text-white/70">Views</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                <span className="text-white/70">Likes</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                <span className="text-white/70">Shares</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.7)" />
              <YAxis stroke="rgba(255,255,255,0.7)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px'
                }}
              />
              <Line type="monotone" dataKey="views" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="likes" stroke="#EF4444" strokeWidth={2} />
              <Line type="monotone" dataKey="shares" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Engagement Breakdown */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Engagement Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={engagementData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {engagementData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {engagementData.map((item) => (
              <div key={item.name} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-white/70">{item.name}</span>
                <span className="text-sm font-medium text-white ml-auto">
                  {item.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Top Performing Memes */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Top Performing Memes</h2>
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            View All
          </Button>
        </div>
        <div className="space-y-4">
          {topMemes.map((meme, index) => (
            <div key={meme.memeId} className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg">
              <div className="flex-shrink-0">
                <span className="flex items-center justify-center w-8 h-8 bg-accent/20 text-accent rounded-full text-sm font-bold">
                  #{index + 1}
                </span>
              </div>
              <img 
                src={meme.templateUrl} 
                alt="Meme template"
                className="h-16 w-16 rounded object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {meme.finalCaption}
                </p>
                <p className="text-xs text-white/60">
                  Created {formatDistanceToNow(meme.createdAt, { addSuffix: true })}
                </p>
              </div>
              <div className="flex items-center space-x-6 text-sm text-white/70">
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  {meme.performanceAnalytics.views.toLocaleString()}
                </div>
                <div className="flex items-center">
                  <Heart className="h-4 w-4 mr-1" />
                  {meme.performanceAnalytics.likes}
                </div>
                <div className="flex items-center">
                  <Share2 className="h-4 w-4 mr-1" />
                  {meme.performanceAnalytics.shares}
                </div>
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  {meme.performanceAnalytics.comments}
                </div>
              </div>
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Insights */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Key Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex items-center mb-3">
              <TrendingUp className="h-5 w-5 text-green-400 mr-2" />
              <h3 className="font-medium text-white">Best Performing Format</h3>
            </div>
            <p className="text-sm text-white/70">
              "Distracted Boyfriend" memes get 40% more engagement than average
            </p>
          </div>
          
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex items-center mb-3">
              <Calendar className="h-5 w-5 text-blue-400 mr-2" />
              <h3 className="font-medium text-white">Optimal Posting Time</h3>
            </div>
            <p className="text-sm text-white/70">
              Friday evenings (6-8 PM) show 60% higher engagement rates
            </p>
          </div>
          
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex items-center mb-3">
              <Heart className="h-5 w-5 text-red-400 mr-2" />
              <h3 className="font-medium text-white">Engagement Pattern</h3>
            </div>
            <p className="text-sm text-white/70">
              Memes with relatable work/life content get 3x more shares
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Analytics