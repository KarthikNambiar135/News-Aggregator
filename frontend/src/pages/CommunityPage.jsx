import { useState, useEffect } from 'react'
import { 
  User, Star, Award, TrendingUp, MessageSquare, Shield, 
  Calendar, CheckCircle, AlertTriangle, Clock, Trophy,
  Users, BookOpen, Search, Filter
} from 'lucide-react'
import { authAPI } from '../utils/api'

const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState('leaderboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setLoading(true)
        const response = await authAPI.getLeaderboard({ limit: 20, sortBy: 'reputation' })
        setLeaderboard(response.data)
      } catch (error) {
        console.error('Failed to load leaderboard:', error)
        // Fallback to mock data
        setLeaderboard(topFactCheckers)
      } finally {
        setLoading(false)
      }
    }

    loadLeaderboard()
  }, [])

  const topFactCheckers = [
    {
      id: 1,
      username: 'DrFactChecker',
      reputation: 2847,
      verificationsCount: 342,
      accuracy: 96,
      specialties: ['Science', 'Health'],
      joinDate: '2024-03-15',
      badges: ['Expert', 'Trusted', 'Top Contributor'],
      level: 'Expert'
    },
    {
      id: 2,
      username: 'NewsValidator',
      reputation: 2156,
      verificationsCount: 278,
      accuracy: 94,
      specialties: ['Politics', 'Economy'],
      joinDate: '2024-02-20',
      badges: ['Trusted', 'Active'],
      level: 'Expert'
    },
    {
      id: 3,
      username: 'TruthSeeker99',
      reputation: 1834,
      verificationsCount: 201,
      accuracy: 92,
      specialties: ['Technology', 'Environment'],
      joinDate: '2024-04-10',
      badges: ['Rising Star', 'Active'],
      level: 'Advanced'
    }
  ]

  const recentDiscussions = [
    {
      id: 1,
      title: 'Best practices for verifying climate data sources',
      author: 'ClimateExpert',
      replies: 23,
      lastActivity: '2 hours ago',
      category: 'Methodology',
      tags: ['Climate', 'Data Verification']
    },
    {
      id: 2,
      title: 'How to handle conflicting expert opinions?',
      author: 'NewFactChecker',
      replies: 15,
      lastActivity: '4 hours ago',
      category: 'Discussion',
      tags: ['Guidelines', 'Conflict Resolution']
    },
    {
      id: 3,
      title: 'Proposed changes to credibility scoring algorithm',
      author: 'TechModerator',
      replies: 41,
      lastActivity: '6 hours ago',
      category: 'Platform Updates',
      tags: ['Algorithm', 'Scoring']
    }
  ]

  const communityStats = [
    { label: 'Active Fact-Checkers', value: '2,847', icon: Users, color: 'blue' },
    { label: 'Articles Verified', value: '15,632', icon: CheckCircle, color: 'green' },
    { label: 'Community Discussions', value: '1,247', icon: MessageSquare, color: 'purple' },
    { label: 'Expert Contributors', value: '158', icon: Award, color: 'orange' }
  ]

  const getBadgeColor = (badge) => {
    const colors = {
      'Expert': 'bg-purple-100 text-purple-800',
      'Trusted': 'bg-blue-100 text-blue-800',
      'Top Contributor': 'bg-green-100 text-green-800',
      'Rising Star': 'bg-yellow-100 text-yellow-800',
      'Active': 'bg-gray-100 text-gray-800'
    }
    return colors[badge] || 'bg-gray-100 text-gray-800'
  }

  const getLevelColor = (level) => {
    const colors = {
      'Expert': 'text-purple-600 bg-purple-100',
      'Advanced': 'text-blue-600 bg-blue-100',
      'Intermediate': 'text-green-600 bg-green-100',
      'Beginner': 'text-gray-600 bg-gray-100'
    }
    return colors[level] || 'text-gray-600 bg-gray-100'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center animate-fade-in-up">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              <span className="green-highlight animate-scale-in">Community</span> Hub
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Connect with fellow fact-checkers, share expertise, and build a more trustworthy news ecosystem together.
            </p>
          </div>
        </div>
      </div>

      {/* Community Stats */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {communityStats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div 
                key={index} 
                className="bg-white rounded-xl p-6 card-shadow hover-lift smooth-transition animate-fade-in-up opacity-0"
                style={{ 
                  animationDelay: `${0.3 + index * 0.1}s`, 
                  animationFillMode: 'forwards' 
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-900 pulse-glow">{stat.value}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                  <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center glow-effect`}>
                    <IconComponent className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl card-shadow mb-8 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('leaderboard')}
                className={`py-4 px-2 border-b-2 font-medium text-sm smooth-transition hover-lift button-press ${
                  activeTab === 'leaderboard'
                    ? 'border-dark-green text-dark-green glow-effect'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4" />
                  <span>Leaderboard</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('discussions')}
                className={`py-4 px-2 border-b-2 font-medium text-sm smooth-transition hover-lift button-press ${
                  activeTab === 'discussions'
                    ? 'border-dark-green text-dark-green glow-effect'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>Discussions</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('guidelines')}
                className={`py-4 px-2 border-b-2 font-medium text-sm smooth-transition hover-lift button-press ${
                  activeTab === 'guidelines'
                    ? 'border-dark-green text-dark-green glow-effect'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Guidelines</span>
                </div>
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'leaderboard' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Top Fact-Checkers</h2>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search contributors..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-green focus:border-dark-green outline-none"
                      />
                    </div>
                    <select className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-dark-green focus:border-dark-green outline-none">
                      <option>All Time</option>
                      <option>This Month</option>
                      <option>This Week</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dark-green"></div>
                    </div>
                  ) : (
                    (leaderboard.length > 0 ? leaderboard : topFactCheckers).map((factChecker, index) => (
                    <div key={factChecker.id} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-4">
                        {/* Rank */}
                        <div className="flex-shrink-0">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                            index === 0 ? 'bg-yellow-100 text-yellow-800' :
                            index === 1 ? 'bg-gray-100 text-gray-800' :
                            index === 2 ? 'bg-orange-100 text-orange-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {index + 1}
                          </div>
                        </div>

                        {/* User Info */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{factChecker.username}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(factChecker.level)}`}>
                              {factChecker.level}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4" />
                              <span>{factChecker.reputation} reputation</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <CheckCircle className="w-4 h-4" />
                              <span>{factChecker.articlesVerified || factChecker.verificationsCount || 0} verifications</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <TrendingUp className="w-4 h-4" />
                              <span>{factChecker.articlesSubmitted || 0} submissions</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-2">
                              {(factChecker.badges || []).map((badge) => (
                                <span key={badge} className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(badge)}`}>
                                  {badge}
                                </span>
                              ))}
                            </div>
                            
                            <div className="text-sm text-gray-500">
                              Specialties: {factChecker.specialties?.join(', ') || 'General'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )))
                }
                </div>
              </div>
            )}

            {activeTab === 'discussions' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Community Discussions</h2>
                  <button className="bg-dark-green text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors">
                    Start Discussion
                  </button>
                </div>

                <div className="space-y-4">
                  {recentDiscussions.map((discussion) => (
                    <div key={discussion.id} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="bg-secondary px-2 py-1 rounded-full text-xs font-medium text-dark-green">
                              {discussion.category}
                            </span>
                            <h3 className="text-lg font-semibold text-gray-900 hover:text-dark-green">
                              {discussion.title}
                            </h3>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                            <div className="flex items-center space-x-1">
                              <User className="w-4 h-4" />
                              <span>by {discussion.author}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MessageSquare className="w-4 h-4" />
                              <span>{discussion.replies} replies</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{discussion.lastActivity}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {discussion.tags.map((tag) => (
                              <span key={tag} className="bg-white px-2 py-1 rounded text-xs text-gray-600">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'guidelines' && (
              <div className="max-w-4xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Community Guidelines</h2>
                
                <div className="space-y-8">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Shield className="w-6 h-6 text-blue-600" />
                      <h3 className="text-lg font-semibold text-blue-900">Core Principles</h3>
                    </div>
                    <ul className="space-y-2 text-blue-800">
                      <li>• Maintain objectivity and neutrality in all fact-checking activities</li>
                      <li>• Base conclusions on verifiable evidence and credible sources</li>
                      <li>• Respect different perspectives while prioritizing factual accuracy</li>
                      <li>• Engage constructively with community members</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <h3 className="text-lg font-semibold text-green-900">Verification Standards</h3>
                    </div>
                    <ul className="space-y-2 text-green-800">
                      <li>• Always provide multiple credible sources when possible</li>
                      <li>• Clearly distinguish between facts, opinions, and interpretations</li>
                      <li>• Acknowledge limitations and uncertainties in your analysis</li>
                      <li>• Update or correct information when new evidence emerges</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <AlertTriangle className="w-6 h-6 text-yellow-600" />
                      <h3 className="text-lg font-semibold text-yellow-900">Community Conduct</h3>
                    </div>
                    <ul className="space-y-2 text-yellow-800">
                      <li>• Treat all community members with respect and professionalism</li>
                      <li>• Focus on content and evidence, not personal attacks</li>
                      <li>• Report suspicious or coordinated inauthentic behavior</li>
                      <li>• Avoid conflicts of interest and disclose relevant affiliations</li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Award className="w-6 h-6 text-purple-600" />
                      <h3 className="text-lg font-semibold text-purple-900">Recognition System</h3>
                    </div>
                    <ul className="space-y-2 text-purple-800">
                      <li>• Reputation points are earned through quality contributions</li>
                      <li>• Badges recognize expertise, activity, and community impact</li>
                      <li>• Expert status requires demonstrated knowledge and accuracy</li>
                      <li>• Community voting helps identify valuable contributors</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommunityPage