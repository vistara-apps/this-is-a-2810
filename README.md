# MemePulse 🚀

**Craft viral memes, discover trending formats, and track your impact.**

MemePulse is a comprehensive meme creation and trend analysis platform that helps content creators identify viral opportunities, generate AI-powered captions, and optimize their content for different social media platforms.

## ✨ Features

### 🔥 Core Features
- **Meme Trend Identification** - Discover emerging meme formats before they become oversaturated
- **AI-Powered Meme Generator** - Generate creative captions using OpenAI's GPT models
- **Platform-Specific Optimization** - Get tailored advice for Twitter, Instagram, TikTok, Reddit, and more
- **Performance Analytics** - Track engagement metrics and understand what drives virality

### 🛠 Technical Features
- **Multi-Source Trend Aggregation** - Combines data from Farcaster, onchain activity (Airstack), and cached trends
- **Real-time Analytics Dashboard** - Monitor meme performance across platforms
- **Responsive Design** - Optimized for desktop and mobile devices
- **Modern UI Components** - Built with React and Tailwind CSS

## 🏗 Architecture

### Frontend
- **React 18** with Vite for fast development
- **Tailwind CSS** for styling with custom design system
- **React Router** for navigation
- **Lucide React** for icons
- **React Hot Toast** for notifications

### Backend Services
- **Supabase** - Backend-as-a-Service for data storage and user management
- **OpenAI API** - AI-powered caption generation
- **Farcaster (Neynar)** - Social media trend analysis
- **Airstack** - Onchain data and social graph analysis

### Data Model
```
User {
  userId: string
  email: string
  subscriptionTier: string
  createdAt: Date
  updatedAt: Date
}

Meme {
  memeId: string
  userId: string
  templateUrl: string
  generatedCaption: string
  finalCaption: string
  platformOptimizations: object
  performanceAnalytics: object
  createdAt: Date
  updatedAt: Date
}

Trend {
  trendId: string
  topic: string
  formatName: string
  imageUrl: string
  source: string
  detectedAt: Date
  confidenceScore: number
}
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account and project
- OpenAI API key
- Neynar API key (for Farcaster data)
- Airstack API key (for onchain data)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vistara-apps/this-is-a-2810.git
   cd this-is-a-2810
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your API keys in the `.env` file:
   ```env
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_NEYNAR_API_KEY=your_neynar_api_key_here
   VITE_AIRSTACK_API_KEY=your_airstack_api_key_here
   ```

4. **Set up Supabase database**
   
   Create the following tables in your Supabase project:
   
   ```sql
   -- Users table
   CREATE TABLE users (
     userId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     email TEXT UNIQUE NOT NULL,
     subscriptionTier TEXT DEFAULT 'free',
     createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Memes table
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

   -- Trends table
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

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_OPENAI_API_KEY` | OpenAI API key for caption generation | Yes |
| `VITE_SUPABASE_URL` | Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `VITE_NEYNAR_API_KEY` | Neynar API key for Farcaster data | Optional |
| `VITE_AIRSTACK_API_KEY` | Airstack API key for onchain data | Optional |
| `VITE_ENABLE_FARCASTER_TRENDS` | Enable Farcaster trend analysis | Optional |
| `VITE_ENABLE_ONCHAIN_TRENDS` | Enable onchain trend analysis | Optional |
| `VITE_DEBUG_MODE` | Enable debug logging | Optional |
| `VITE_MOCK_API_RESPONSES` | Use mock data instead of real APIs | Optional |

### Feature Flags

You can enable/disable features using environment variables:

- `VITE_ENABLE_FARCASTER_TRENDS=true` - Enable Farcaster trend analysis
- `VITE_ENABLE_ONCHAIN_TRENDS=true` - Enable onchain trend analysis
- `VITE_ENABLE_REAL_TIME_ANALYTICS=true` - Enable real-time analytics
- `VITE_ENABLE_SUBSCRIPTION_FEATURES=true` - Enable subscription features

## 📱 Usage

### Creating Memes

1. **Browse Trending Templates** - Visit the Trends page to see emerging meme formats
2. **Select a Template** - Click on any trend to use it as a template
3. **Generate Captions** - Enter a keyword and let AI generate multiple caption options
4. **Customize** - Edit captions to match your style
5. **Optimize for Platforms** - Get platform-specific recommendations
6. **Download & Share** - Export your meme and share across platforms

### Analyzing Performance

1. **Visit Analytics Dashboard** - See overview of your meme performance
2. **Track Metrics** - Monitor views, likes, shares, and comments
3. **Identify Patterns** - Understand what content resonates with your audience
4. **Optimize Strategy** - Use insights to improve future content

### Platform Optimization

The app provides specific recommendations for:

- **Twitter/X** - Character limits, hashtag usage, optimal posting times
- **Instagram** - Image ratios, caption length, hashtag strategies
- **TikTok** - Vertical format, trending sounds, caption optimization
- **Reddit** - Subreddit rules, community guidelines, engagement tips
- **Facebook** - Image formats, posting schedules, group strategies
- **LinkedIn** - Professional tone, business hours, industry hashtags

## 🏢 Business Model

### Subscription Tiers

- **Free Tier** - Limited AI generations, basic analytics
- **Basic ($5/month)** - Unlimited AI generations, advanced analytics
- **Premium ($15/month)** - Priority trend access, custom templates, API access

### Revenue Streams

1. **Subscription Revenue** - Monthly recurring revenue from users
2. **API Access** - Enterprise customers accessing trend data
3. **Custom Templates** - Premium template marketplace
4. **Analytics Insights** - Advanced analytics for agencies

## 🛠 Development

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Card, etc.)
│   └── AppShell.jsx    # Main app layout
├── pages/              # Page components
│   ├── Dashboard.jsx   # Main dashboard
│   ├── MemeGenerator.jsx # Meme creation interface
│   ├── TrendDiscovery.jsx # Trend browsing
│   └── Analytics.jsx   # Performance analytics
├── services/           # API and external service integrations
│   ├── openai.js      # OpenAI API integration
│   ├── supabase.js    # Supabase backend
│   ├── farcaster.js   # Farcaster/Neynar API
│   ├── airstack.js    # Airstack API
│   ├── trendService.js # Trend aggregation service
│   └── platformOptimization.js # Platform-specific optimizations
├── context/           # React context providers
│   └── AppContext.jsx # Global app state
└── main.jsx          # App entry point
```

### Design System

The app uses a custom design system built with Tailwind CSS:

- **Colors** - Primary (blue), Accent (teal), Surface (white), Text (gray)
- **Typography** - Display, H1-H2, Body, Caption styles
- **Spacing** - 8px base unit with sm/md/lg/xl variants
- **Shadows** - Card and modal shadow styles
- **Radius** - Consistent border radius (6px, 10px, 16px)

### Adding New Features

1. **Create Components** - Add new UI components in `src/components/`
2. **Add Services** - Integrate new APIs in `src/services/`
3. **Update Context** - Add state management in `src/context/`
4. **Add Routes** - Register new pages in `src/App.jsx`
5. **Update Types** - Add TypeScript types if using TypeScript

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Deploy to Netlify

1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify
3. Set environment variables in Netlify dashboard

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow React best practices
- Use TypeScript for type safety
- Write tests for new features
- Follow the existing code style
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for GPT-powered caption generation
- **Supabase** for backend infrastructure
- **Farcaster/Neynar** for social media trend data
- **Airstack** for onchain data analysis
- **Tailwind CSS** for styling framework
- **React** ecosystem for frontend development

## 📞 Support

- **Documentation** - Check this README and inline code comments
- **Issues** - Report bugs and request features via GitHub Issues
- **Community** - Join our Discord server for discussions
- **Email** - Contact support@memepulse.app for enterprise inquiries

---

**Built with ❤️ for the meme community**

*MemePulse - Where trends meet creativity* 🚀
