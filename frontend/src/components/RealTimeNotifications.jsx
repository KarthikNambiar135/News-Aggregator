import { useState, useEffect } from 'react'
import { 
  Bell, X, CheckCircle, AlertTriangle, Clock, Users, 
  MessageSquare, TrendingUp, Shield, Award 
} from 'lucide-react'

// Mock real-time notifications
const mockNotifications = [
  {
    id: 1,
    type: 'article_verified',
    title: 'Article Verified',
    message: 'Your submitted article "Climate Research Breakthrough" has been verified by the community.',
    timestamp: '2 minutes ago',
    icon: CheckCircle,
    color: 'green',
    read: false,
    actionable: true,
    link: '/dashboard/article/123'
  },
  {
    id: 2,
    type: 'fact_check_disputed',
    title: 'Fact-Check Disputed',
    message: 'Your fact-check on "AI Technology News" has been disputed by 3 community members.',
    timestamp: '15 minutes ago',
    icon: AlertTriangle,
    color: 'red',
    read: false,
    actionable: true,
    link: '/dashboard/article/456'
  },
  {
    id: 3,
    type: 'reputation_milestone',
    title: 'Reputation Milestone!',
    message: 'Congratulations! You\'ve reached 1000 reputation points.',
    timestamp: '1 hour ago',
    icon: Award,
    color: 'purple',
    read: false,
    actionable: false
  },
  {
    id: 4,
    type: 'new_discussion',
    title: 'New Discussion',
    message: 'DrFactChecker mentioned you in "Best practices for climate data verification"',
    timestamp: '2 hours ago',
    icon: MessageSquare,
    color: 'blue',
    read: true,
    actionable: true,
    link: '/dashboard/community/discussion/789'
  },
  {
    id: 5,
    type: 'trending_article',
    title: 'Trending Article',
    message: 'Article you fact-checked is now trending with 500+ views',
    timestamp: '3 hours ago',
    icon: TrendingUp,
    color: 'orange',
    read: true,
    actionable: true,
    link: '/dashboard/article/321'
  },
  {
    id: 6,
    type: 'expert_endorsement',
    title: 'Expert Endorsement',
    message: 'Your fact-check has been endorsed by 2 domain experts',
    timestamp: '5 hours ago',
    icon: Shield,
    color: 'green',
    read: true,
    actionable: false
  },
  {
    id: 7,
    type: 'community_activity',
    title: 'High Community Activity',
    message: '15 new articles submitted in your expertise area today',
    timestamp: '6 hours ago',
    icon: Users,
    color: 'blue',
    read: true,
    actionable: true,
    link: '/dashboard?filter=expertise'
  }
]

const RealTimeNotifications = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [filter, setFilter] = useState('all')

  // Simulate real-time updates
  useEffect(() => {
    if (!isOpen) return

    const interval = setInterval(() => {
      // Simulate new notification every 30 seconds
      if (Math.random() > 0.7) {
        const newNotification = {
          id: Date.now(),
          type: 'new_submission',
          title: 'New Article Submission',
          message: 'A new article has been submitted in your expertise area',
          timestamp: 'Just now',
          icon: Clock,
          color: 'blue',
          read: false,
          actionable: true,
          link: '/dashboard'
        }
        setNotifications(prev => [newNotification, ...prev])
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [isOpen])

  if (!isOpen) return null

  const getIconColor = (color) => {
    const colors = {
      green: 'text-green-600 bg-green-100',
      red: 'text-red-600 bg-red-100',
      blue: 'text-blue-600 bg-blue-100',
      purple: 'text-purple-600 bg-purple-100',
      orange: 'text-orange-600 bg-orange-100',
      gray: 'text-gray-600 bg-gray-100'
    }
    return colors[color] || colors.gray
  }

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    )
  }

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read
    if (filter === 'actionable') return notif.actionable
    return true
  })

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-16 px-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Bell className="w-6 h-6 text-dark-green" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
              <p className="text-sm text-gray-600">
                {unreadCount} unread • {notifications.length} total
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-dark-green text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === 'unread'
                  ? 'bg-dark-green text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setFilter('actionable')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === 'actionable'
                  ? 'bg-dark-green text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Actionable ({notifications.filter(n => n.actionable).length})
            </button>
          </div>
          
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-dark-green hover:text-opacity-80 text-sm font-medium transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto custom-scrollbar">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No notifications to show</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredNotifications.map((notification) => {
                const IconComponent = notification.icon
                return (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                      !notification.read ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                    onClick={() => {
                      markAsRead(notification.id)
                      if (notification.actionable && notification.link) {
                        // In real app, navigate to the link
                        console.log('Navigate to:', notification.link)
                      }
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getIconColor(notification.color)}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notification.title}
                            </p>
                            <p className={`text-sm mt-1 ${!notification.read ? 'text-gray-700' : 'text-gray-600'}`}>
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              {notification.timestamp}
                            </p>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteNotification(notification.id)
                              }}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        {notification.actionable && (
                          <div className="mt-3">
                            <button className="text-dark-green hover:text-opacity-80 text-sm font-medium transition-colors">
                              Take Action →
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 text-center">
          <button className="text-dark-green hover:text-opacity-80 text-sm font-medium transition-colors">
            View All Notifications
          </button>
        </div>
      </div>
    </div>
  )
}

export default RealTimeNotifications