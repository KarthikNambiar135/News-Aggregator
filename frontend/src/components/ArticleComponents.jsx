import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ThumbsUp, ThumbsDown, MessageSquare, Share2, ExternalLink, 
  User, Calendar, Eye, AlertTriangle, CheckCircle, Clock,
  FileText, Link2, Upload, X, PenTool, Award, Vote, Cpu, Globe,
  Heart, Atom, Users, DollarSign, BookOpen, Shield, Hash, 
  Image as ImageIcon
} from 'lucide-react'

export const ArticleCard = ({ article, onFactCheck, onDiscuss }) => {
  const getCredibilityColor = (score) => {
    if (score >= 85) return 'credibility-high'
    if (score >= 70) return 'credibility-medium'
    if (score >= 50) return 'credibility-low'
    return 'credibility-pending'
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'disputed':
        return <AlertTriangle className="w-5 h-5 text-red-600" />
      case 'under-review':
        return <Clock className="w-5 h-5 text-yellow-600" />
      default:
        return <Clock className="w-5 h-5 text-gray-600" />
    }
  }

  return (
    <div className="bg-white rounded-xl card-shadow hover-lift smooth-transition group">
      <div className="p-6">
        {/* Article Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <span className="bg-secondary px-3 py-1 rounded-full text-sm font-medium text-dark-green">
                {article.category}
              </span>
              <div className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getCredibilityColor(article.credibilityScore)}`}>
                {article.credibilityScore}% Credible
              </div>
              {getStatusIcon(article.status)}
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-dark-green cursor-pointer smooth-transition group-hover:translate-x-1">
              {article.title}
            </h3>
            
            <p className="text-gray-600 mb-4">{article.summary}</p>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>{article.submittedBy}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(article.submittedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{article.source}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Article Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-6">
            <button className="flex items-center space-x-2 text-green-600 hover:text-green-700 smooth-transition hover-lift button-press">
              <ThumbsUp className="w-5 h-5" />
              <span>{article.verifications}</span>
            </button>
            
            <button className="flex items-center space-x-2 text-red-600 hover:text-red-700 smooth-transition hover-lift button-press">
              <ThumbsDown className="w-5 h-5" />
              <span>{article.disputes}</span>
            </button>
            
            <button 
              onClick={() => onDiscuss?.(article)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-700 smooth-transition hover-lift button-press"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Discuss</span>
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <button className="text-gray-600 hover:text-gray-700 smooth-transition hover-lift button-press">
              <Share2 className="w-5 h-5" />
            </button>
            
            <button className="text-gray-600 hover:text-gray-700 smooth-transition hover-lift button-press">
              <ExternalLink className="w-5 h-5" />
            </button>
            
            <button 
              onClick={() => onFactCheck?.(article)}
              className="bg-dark-green text-white px-4 py-2 rounded-lg hover-lift smooth-transition button-press glow-effect text-sm font-medium"
            >
              Fact-Check
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export const FactCheckModal = ({ isOpen, onClose, article }) => {
  const [activeTab, setActiveTab] = useState('verify')
  const [evidence, setEvidence] = useState('')
  const [sources, setSources] = useState([''])
  const [verdict, setVerdict] = useState('')
  const [confidenceLevel, setConfidenceLevel] = useState(5)
  const [expertiseArea, setExpertiseArea] = useState('')
  const [flaggedConcerns, setFlaggedConcerns] = useState([])
  const [peerReviews, setPeerReviews] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock peer reviews data
  const mockPeerReviews = [
    {
      id: 1,
      reviewer: 'DrFactChecker',
      reputation: 2847,
      verdict: 'verified',
      confidence: 8,
      expertise: ['Science', 'Health'],
      evidence: 'The claims in this article are supported by multiple peer-reviewed studies published in Nature and Science journals. I\'ve cross-referenced the data with the original research papers.',
      sources: [
        'https://nature.com/articles/nature12345',
        'https://science.org/doi/10.1126/science.abc123'
      ],
      submittedAt: '2025-01-15T14:30:00Z',
      votes: { up: 23, down: 2 },
      badges: ['Expert', 'Trusted Source'],
      level: 'Expert'
    },
    {
      id: 2,
      reviewer: 'NewsValidator',
      reputation: 2156,
      verdict: 'needs-review',
      confidence: 6,
      expertise: ['Journalism', 'Media Analysis'],
      evidence: 'While the scientific claims appear sound, the article uses sensationalized language that may mislead readers. The headline doesn\'t accurately reflect the study\'s limitations.',
      sources: [
        'https://journalismethics.org/guidelines/headline-accuracy'
      ],
      submittedAt: '2025-01-15T13:45:00Z',
      votes: { up: 15, down: 3 },
      badges: ['Trusted', 'Active'],
      level: 'Advanced'
    },
    {
      id: 3,
      reviewer: 'TruthSeeker99',
      reputation: 1834,
      verdict: 'disputed',
      confidence: 7,
      expertise: ['Research Methods', 'Statistics'],
      evidence: 'The statistical methodology described in the article has several issues. The sample size is too small for the conclusions drawn, and there\'s potential selection bias.',
      sources: [
        'https://stats-methods.org/sample-size-calculator',
        'https://research-ethics.com/bias-detection'
      ],
      submittedAt: '2025-01-15T12:20:00Z',
      votes: { up: 8, down: 12 },
      badges: ['Rising Star'],
      level: 'Intermediate'
    }
  ]

  const concernTypes = [
    { id: 'misleading_headline', name: 'Misleading Headline', description: 'Title doesn\'t match content' },
    { id: 'source_reliability', name: 'Questionable Source', description: 'Source has low credibility' },
    { id: 'bias', name: 'Potential Bias', description: 'Content shows clear bias' },
    { id: 'outdated', name: 'Outdated Information', description: 'Information is no longer current' },
    { id: 'cherry_picking', name: 'Cherry Picking', description: 'Selective use of data' },
    { id: 'false_correlation', name: 'False Correlation', description: 'Implies causation from correlation' },
    { id: 'missing_context', name: 'Missing Context', description: 'Important details omitted' },
    { id: 'unverified_claims', name: 'Unverified Claims', description: 'Claims lack supporting evidence' }
  ]

  const expertiseAreas = [
    'Science & Research', 'Healthcare & Medicine', 'Technology', 'Politics & Government',
    'Economics & Finance', 'Environment & Climate', 'Education', 'Social Issues',
    'Media & Journalism', 'Law & Justice', 'International Affairs', 'Other'
  ]

  if (!isOpen) return null

  const addSourceField = () => {
    setSources([...sources, ''])
  }

  const removeSourceField = (index) => {
    setSources(sources.filter((_, i) => i !== index))
  }

  const updateSource = (index, value) => {
    const newSources = [...sources]
    newSources[index] = value
    setSources(newSources)
  }

  const toggleConcern = (concernId) => {
    setFlaggedConcerns(prev => 
      prev.includes(concernId) 
        ? prev.filter(id => id !== concernId)
        : [...prev, concernId]
    )
  }

  const handleSubmitVerification = async () => {
    setIsSubmitting(true)
    
    // Mock submission process
    setTimeout(() => {
      const newVerification = {
        verdict,
        confidence: confidenceLevel,
        evidence,
        sources: sources.filter(s => s.trim()),
        expertiseArea,
        flaggedConcerns,
        submittedAt: new Date().toISOString()
      }
      
      console.log('Submitted verification:', newVerification)
      setIsSubmitting(false)
      onClose()
    }, 2000)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Fact-Check Article</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Article Summary */}
        <div className="p-6 bg-gray-50 border-b">
          <h3 className="font-semibold text-gray-900 mb-2">{article?.title}</h3>
          <p className="text-gray-600 text-sm mb-3">{article?.summary}</p>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>Source: {article?.source}</span>
            <span>Category: {article?.category}</span>
            <span>Current Score: {article?.credibilityScore}%</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('verify')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'verify'
                ? 'border-b-2 border-dark-green text-dark-green'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Submit Verification
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'reviews'
                ? 'border-b-2 border-dark-green text-dark-green'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Peer Reviews (12)
          </button>
          <button
            onClick={() => setActiveTab('evidence')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'evidence'
                ? 'border-b-2 border-dark-green text-dark-green'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Evidence & Sources
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'verify' && (
            <div className="space-y-6">
              {/* Verdict Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Your Verdict *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setVerdict('verified')}
                    className={`p-4 rounded-lg border-2 text-center transition-all ${
                      verdict === 'verified'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-300 hover:border-green-300'
                    }`}
                  >
                    <CheckCircle className="w-6 h-6 mx-auto mb-2" />
                    <div className="font-medium">Verified</div>
                    <div className="text-sm text-gray-600">Information is accurate</div>
                  </button>
                  
                  <button
                    onClick={() => setVerdict('disputed')}
                    className={`p-4 rounded-lg border-2 text-center transition-all ${
                      verdict === 'disputed'
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-300 hover:border-red-300'
                    }`}
                  >
                    <AlertTriangle className="w-6 h-6 mx-auto mb-2" />
                    <div className="font-medium">Disputed</div>
                    <div className="text-sm text-gray-600">Information is inaccurate</div>
                  </button>
                  
                  <button
                    onClick={() => setVerdict('needs-review')}
                    className={`p-4 rounded-lg border-2 text-center transition-all ${
                      verdict === 'needs-review'
                        ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                        : 'border-gray-300 hover:border-yellow-300'
                    }`}
                  >
                    <Clock className="w-6 h-6 mx-auto mb-2" />
                    <div className="font-medium">Needs Review</div>
                    <div className="text-sm text-gray-600">Requires more evidence</div>
                  </button>
                </div>
              </div>

              {/* Confidence Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confidence Level: {confidenceLevel}/10
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={confidenceLevel}
                    onChange={(e) => setConfidenceLevel(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Low Confidence</span>
                    <span>High Confidence</span>
                  </div>
                </div>
              </div>

              {/* Expertise Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Expertise Area
                </label>
                <select
                  value={expertiseArea}
                  onChange={(e) => setExpertiseArea(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-dark-green focus:border-dark-green outline-none"
                >
                  <option value="">Select your area of expertise</option>
                  {expertiseAreas.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>

              {/* Flagged Concerns */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Flagged Concerns (Optional)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {concernTypes.map(concern => (
                    <button
                      key={concern.id}
                      type="button"
                      onClick={() => toggleConcern(concern.id)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        flaggedConcerns.includes(concern.id)
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="font-medium text-sm">{concern.name}</div>
                      <div className="text-xs text-gray-600">{concern.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Evidence Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Evidence & Reasoning *
                </label>
                <textarea
                  value={evidence}
                  onChange={(e) => setEvidence(e.target.value)}
                  rows={6}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-dark-green focus:border-dark-green outline-none"
                  placeholder="Provide detailed evidence and reasoning for your verdict. Include specific facts, data points, or analysis that support your conclusion..."
                />
                <div className="text-xs text-gray-500 mt-1">
                  {evidence.length}/1000 characters
                </div>
              </div>

              {/* Supporting Sources */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supporting Sources *
                </label>
                {sources.map((source, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <div className="relative flex-1">
                      <Link2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="url"
                        value={source}
                        onChange={(e) => updateSource(index, e.target.value)}
                        placeholder="https://example.com/credible-source"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-green focus:border-dark-green outline-none"
                      />
                    </div>
                    {sources.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSourceField(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSourceField}
                  className="text-dark-green hover:text-opacity-80 transition-colors text-sm font-medium"
                >
                  + Add Another Source
                </button>
              </div>

              {/* Community Guidelines Reminder */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">Verification Guidelines</h4>
                    <ul className="text-blue-800 text-sm space-y-1">
                      <li>• Provide credible, verifiable sources for your claims</li>
                      <li>• Be objective and avoid personal bias in your analysis</li>
                      <li>• Clearly distinguish between facts and interpretations</li>
                      <li>• Consider alternative viewpoints and potential limitations</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitVerification}
                  disabled={!verdict || !evidence.trim() || !sources.some(s => s.trim()) || isSubmitting}
                  className="px-6 py-2 bg-dark-green text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Submitting...
                    </div>
                  ) : (
                    'Submit Verification'
                  )}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Review Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">8</div>
                    <div className="text-sm text-gray-600">Verified</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">3</div>
                    <div className="text-sm text-gray-600">Disputed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">4</div>
                    <div className="text-sm text-gray-600">Needs Review</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-600">7.2</div>
                    <div className="text-sm text-gray-600">Avg. Confidence</div>
                  </div>
                </div>
              </div>

              {/* Peer Reviews List */}
              <div className="space-y-4">
                {mockPeerReviews.map((review) => (
                  <div key={review.id} className="border rounded-lg p-6 space-y-4">
                    {/* Reviewer Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-dark-green rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">{review.reviewer}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              review.level === 'Expert' ? 'bg-purple-100 text-purple-800' :
                              review.level === 'Advanced' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {review.level}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>Rep: {review.reputation.toLocaleString()}</span>
                            <span>Expertise: {review.expertise.join(', ')}</span>
                            <span>Confidence: {review.confidence}/10</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {review.verdict === 'verified' && (
                          <>
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-sm font-medium text-green-600">Verified</span>
                          </>
                        )}
                        {review.verdict === 'disputed' && (
                          <>
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                            <span className="text-sm font-medium text-red-600">Disputed</span>
                          </>
                        )}
                        {review.verdict === 'needs-review' && (
                          <>
                            <Clock className="w-5 h-5 text-yellow-600" />
                            <span className="text-sm font-medium text-yellow-600">Needs Review</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                      {review.badges.map((badge, index) => (
                        <span key={index} className={`px-2 py-1 rounded-full text-xs font-medium ${
                          badge === 'Expert' ? 'bg-purple-100 text-purple-800' :
                          badge === 'Trusted Source' || badge === 'Trusted' ? 'bg-blue-100 text-blue-800' :
                          badge === 'Rising Star' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {badge}
                        </span>
                      ))}
                    </div>

                    {/* Evidence */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Evidence & Analysis:</h4>
                      <p className="text-gray-700 leading-relaxed">{review.evidence}</p>
                    </div>

                    {/* Sources */}
                    {review.sources.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Supporting Sources:</h4>
                        <div className="space-y-1">
                          {review.sources.map((source, index) => (
                            <div key={index} className="flex items-center space-x-2 text-sm">
                              <Link2 className="w-4 h-4 text-gray-400" />
                              <a 
                                href={source} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 hover:underline truncate"
                              >
                                {source}
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Footer with actions and timestamp */}
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="text-sm text-gray-500">
                        {new Date(review.submittedAt).toLocaleString()}
                      </div>
                      <div className="flex items-center space-x-4">
                        <button className="flex items-center space-x-1 text-green-600 hover:text-green-700 transition-colors">
                          <ThumbsUp className="w-4 h-4" />
                          <span>{review.votes.up}</span>
                        </button>
                        <button className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors">
                          <ThumbsDown className="w-4 h-4" />
                          <span>{review.votes.down}</span>
                        </button>
                        <button className="text-gray-600 hover:text-gray-700 transition-colors">
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Reviews */}
              <div className="text-center">
                <button className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                  Load More Reviews
                </button>
              </div>
            </div>
          )}

          {activeTab === 'evidence' && (
            <div className="space-y-6">
              {/* Source Reliability Analysis */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-3 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Source Reliability Analysis
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">High</div>
                    <div className="text-gray-600">Overall Reliability</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">4.2/5</div>
                    <div className="text-gray-600">Expert Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">92%</div>
                    <div className="text-gray-600">Fact-Check Score</div>
                  </div>
                </div>
              </div>

              {/* Original Sources */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Original Sources</h4>
                <div className="space-y-3">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-gray-500" />
                        <div>
                          <div className="font-medium text-gray-900">Climate Science Journal</div>
                          <div className="text-sm text-gray-600">Primary research publication</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          High Reliability
                        </span>
                        <button className="text-blue-600 hover:text-blue-700">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Domain Age:</span>
                        <div className="font-medium">15 years</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Peer Review:</span>
                        <div className="font-medium text-green-600">Yes</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Impact Factor:</span>
                        <div className="font-medium">8.5</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Citations:</span>
                        <div className="font-medium">1,247</div>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Globe className="w-5 h-5 text-gray-500" />
                        <div>
                          <div className="font-medium text-gray-900">TechNews Daily</div>
                          <div className="text-sm text-gray-600">News publication</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                          Medium Reliability
                        </span>
                        <button className="text-blue-600 hover:text-blue-700">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Bias Score:</span>
                        <div className="font-medium">Minimal Left</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Fact-Check Rate:</span>
                        <div className="font-medium text-yellow-600">Mixed</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Transparency:</span>
                        <div className="font-medium">Good</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Corrections:</span>
                        <div className="font-medium">Frequent</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Community Submitted Evidence */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Community Evidence Breakdown</h4>
                <div className="space-y-3">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="font-medium text-green-700">Supporting Evidence</span>
                      </div>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                        15 sources
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">
                      Multiple peer-reviewed studies, government reports, and expert testimonies that support the main claims.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Academic Papers:</span>
                        <span className="font-medium">8 sources</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Government Data:</span>
                        <span className="font-medium">4 sources</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Expert Opinions:</span>
                        <span className="font-medium">3 sources</span>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="font-medium text-red-700">Contradicting Evidence</span>
                      </div>
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                        3 sources
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">
                      Limited sources that question specific methodologies or present alternative interpretations.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Methodology Concerns:</span>
                        <span className="font-medium">2 sources</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Alternative Analysis:</span>
                        <span className="font-medium">1 source</span>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="font-medium text-blue-700">Additional Context</span>
                      </div>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                        7 sources
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">
                      Supplementary information that provides broader context and historical perspective.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Historical Data:</span>
                        <span className="font-medium">4 sources</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Related Studies:</span>
                        <span className="font-medium">3 sources</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Evidence Quality Metrics */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Evidence Quality Analysis</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-700">Source Diversity</span>
                      <span className="font-medium text-green-600">Excellent</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-700">Methodological Rigor</span>
                      <span className="font-medium text-green-600">High</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-700">Recency</span>
                      <span className="font-medium text-yellow-600">Good</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-700">Consensus Level</span>
                      <span className="font-medium text-green-600">Strong</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '82%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const ArticleSubmissionForm = ({ isOpen, onClose, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [submissionType, setSubmissionType] = useState('manual') // 'manual' or 'url'
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    // URL submission fields
    url: '',
    
    // Manual submission fields
    title: '',
    subtitle: '',
    description: '',
    images: [''],
    sources: [''],
    
    // Common fields
    category: '',
    tags: [''],
    sourceType: '',
    language: 'en',
    priority: 'normal'
  })
  const [urlAnalysis, setUrlAnalysis] = useState(null)
  const [errors, setErrors] = useState({})
  const [imagePreview, setImagePreview] = useState('')

  const categories = [
    { id: 'politics', name: 'Politics', icon: Vote },
    { id: 'technology', name: 'Technology', icon: Cpu },
    { id: 'environment', name: 'Environment', icon: Globe },
    { id: 'health', name: 'Health', icon: Heart },
    { id: 'science', name: 'Science', icon: Atom },
    { id: 'social', name: 'Social', icon: Users },
    { id: 'economy', name: 'Economy', icon: DollarSign },
    { id: 'education', name: 'Education', icon: BookOpen }
  ]

  const sourceTypes = [
    { id: 'original', name: 'Original Article', description: 'Self-authored original content' },
    { id: 'news', name: 'News Article', description: 'Traditional news reporting' },
    { id: 'research', name: 'Research Paper', description: 'Academic or scientific research' },
    { id: 'opinion', name: 'Opinion Piece', description: 'Editorial or opinion content' },
    { id: 'government', name: 'Government Source', description: 'Official government communication' },
    { id: 'social_media', name: 'Social Media', description: 'Social media posts or threads' },
    { id: 'blog', name: 'Blog Post', description: 'Personal or corporate blog content' }
  ]

  if (!isOpen) return null

  const handleUrlAnalysis = async () => {
    if (!formData.url.trim()) {
      setErrors({ url: 'Please enter a valid URL' })
      return
    }

    setIsLoading(true)
    setErrors({})

    // Mock URL analysis - In real app, this would call an API
    setTimeout(() => {
      const mockAnalysis = {
        title: "Revolutionary AI Breakthrough Changes Everything We Know",
        subtitle: "New Research Reveals Unprecedented Capabilities",
        description: "Scientists at major tech company announce breakthrough in artificial general intelligence capabilities that could reshape our understanding of machine learning and cognitive computing.",
        domain: "technews.com",
        publishDate: "2025-01-15",
        author: "Dr. Sarah Chen",
        sourceReliability: "medium",
        language: "en",
        suggestedCategory: "technology",
        extractedTags: ["AI", "Technology", "Breakthrough", "Research"],
        potentialBias: "neutral",
        contentType: "news"
      }

      setUrlAnalysis(mockAnalysis)
      setFormData(prev => ({
        ...prev,
        title: mockAnalysis.title,
        subtitle: mockAnalysis.subtitle,
        description: mockAnalysis.description,
        category: mockAnalysis.suggestedCategory,
        sourceType: mockAnalysis.contentType,
        tags: mockAnalysis.extractedTags
      }))
      setCurrentStep(2)
      setIsLoading(false)
    }, 2000)
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleArrayFieldChange = (field, index, value) => {
    const newArray = [...formData[field]]
    newArray[index] = value
    setFormData(prev => ({ ...prev, [field]: newArray }))
  }

  const addArrayField = (field) => {
    const maxLength = field === 'tags' ? 8 : field === 'images' ? 5 : 10
    if (formData[field].length < maxLength) {
      setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }))
    }
  }

  const removeArrayField = (field, index) => {
    if (formData[field].length > 1) {
      const newArray = formData[field].filter((_, i) => i !== index)
      setFormData(prev => ({ ...prev, [field]: newArray }))
    }
  }

  const validateImage = (url) => {
    const img = new Image()
    img.onload = () => setImagePreview(url)
    img.onerror = () => setImagePreview('')
    img.src = url
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (submissionType === 'url') {
      if (!formData.url.trim()) newErrors.url = 'URL is required'
    } else {
      if (!formData.title.trim()) newErrors.title = 'Title is required'
      if (!formData.description.trim()) newErrors.description = 'Description is required'
    }
    
    if (!formData.category) newErrors.category = 'Category is required'
    if (!formData.sourceType) newErrors.sourceType = 'Source type is required'
    
    return newErrors
  }

  const calculatePointsBonus = () => {
    let bonus = 0
    const validSources = formData.sources.filter(s => s.trim()).length
    const validImages = formData.images.filter(img => img.trim()).length
    
    if (validSources > 0) bonus += validSources * 10
    if (validImages > 0) bonus += validImages * 5
    if (formData.subtitle.trim()) bonus += 5
    
    return bonus
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const formErrors = validateForm()
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }

    const basePoints = 50
    const bonusPoints = calculatePointsBonus()

    const submissionData = {
      ...formData,
      submissionType,
      tags: formData.tags.filter(tag => tag.trim()),
      sources: formData.sources.filter(source => source.trim()),
      images: formData.images.filter(img => img.trim()),
      submittedAt: new Date().toISOString(),
      status: 'pending-review',
      pointsEarned: basePoints + bonusPoints,
      analysis: urlAnalysis
    }

    onSubmit?.(submissionData)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Submit News Article</h2>
            <p className="text-gray-600 text-sm mt-1">
              {currentStep === 1 ? 'Choose submission method' : 
               currentStep === 2 ? 'Article details' : 
               'Review & submit'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep 
                    ? 'bg-dark-green text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-20 h-1 mx-2 rounded ${
                    step < currentStep ? 'bg-dark-green' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Choose Submission Type */}
        {currentStep === 1 && (
          <div className="p-6">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How would you like to submit?</h3>
                <p className="text-gray-600">Choose between submitting an existing article URL or creating original content</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Manual Submission Option */}
                <motion.button
                  type="button"
                  onClick={() => {
                    setSubmissionType('manual')
                    setCurrentStep(2)
                  }}
                  className="p-6 border-2 border-gray-300 rounded-xl hover:border-dark-green hover:bg-secondary hover:bg-opacity-20 transition-all text-left group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="bg-dark-green bg-opacity-10 rounded-lg p-3 group-hover:bg-opacity-20 transition-colors">
                      <PenTool className="w-6 h-6 text-dark-green" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">Create Original Article</h4>
                      <p className="text-gray-600 text-sm mb-3">
                        Write your own article with title, subtitle, description, and optional images and sources.
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-green-600">
                        <span className="flex items-center">
                          <Award className="w-3 h-3 mr-1" />
                          Base: 50 points
                        </span>
                        <span>+ Bonus for sources & images</span>
                      </div>
                    </div>
                  </div>
                </motion.button>

                {/* URL Submission Option */}
                <motion.button
                  type="button"
                  onClick={() => setSubmissionType('url')}
                  className="p-6 border-2 border-gray-300 rounded-xl hover:border-dark-green hover:bg-secondary hover:bg-opacity-20 transition-all text-left group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-500 bg-opacity-10 rounded-lg p-3 group-hover:bg-opacity-20 transition-colors">
                      <Link2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">Submit Existing Article</h4>
                      <p className="text-gray-600 text-sm mb-3">
                        Provide a URL to an existing article. We'll automatically extract the content for review.
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-blue-600">
                        <span className="flex items-center">
                          <Award className="w-3 h-3 mr-1" />
                          Base: 30 points
                        </span>
                        <span>+ Auto-analysis</span>
                      </div>
                    </div>
                  </div>
                </motion.button>
              </div>

              {/* URL Analysis Section (shown when URL type is selected) */}
              {submissionType === 'url' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4 border-t pt-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Article URL *
                    </label>
                    <div className="flex space-x-3">
                      <div className="flex-1 relative">
                        <Link2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="url"
                          value={formData.url}
                          onChange={(e) => handleInputChange('url', e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-dark-green focus:border-dark-green outline-none ${
                            errors.url ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="https://example.com/news-article"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleUrlAnalysis}
                        disabled={isLoading || !formData.url.trim()}
                        className="bg-dark-green text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <div className="flex items-center">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Analyzing...
                          </div>
                        ) : (
                          'Analyze'
                        )}
                      </button>
                    </div>
                    {errors.url && <p className="text-red-500 text-sm mt-1">{errors.url}</p>}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900 mb-1">Automatic Content Analysis</h4>
                        <p className="text-blue-800 text-sm">
                          Our system will automatically extract the title, summary, category, and tags from the provided URL. 
                          You'll be able to review and edit all information before submission.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Article Details */}
        {currentStep === 2 && (
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* URL Analysis Results - only show for URL submissions */}
              {submissionType === 'url' && urlAnalysis && (
                <div className="bg-secondary bg-opacity-30 border border-secondary rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-dark-green mb-3 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Analysis Complete
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Domain:</span>
                      <div className="font-medium">{urlAnalysis.domain}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Reliability:</span>
                      <div className={`font-medium capitalize ${
                        urlAnalysis.sourceReliability === 'high' ? 'text-green-600' :
                        urlAnalysis.sourceReliability === 'medium' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {urlAnalysis.sourceReliability}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Author:</span>
                      <div className="font-medium">{urlAnalysis.author}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Date:</span>
                      <div className="font-medium">{urlAnalysis.publishDate}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Points Preview */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-900">Points Preview</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">{50 + calculatePointsBonus()} points</div>
                    <div className="text-xs text-green-700">
                      Base: 50 + Bonus: {calculatePointsBonus()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Title and Subtitle */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-dark-green focus:border-dark-green outline-none ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your article title"
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subtitle <span className="text-green-600 text-xs">(+5 points)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => handleInputChange('subtitle', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-dark-green focus:border-dark-green outline-none"
                    placeholder="Optional subtitle for context"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  rows={6}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-dark-green focus:border-dark-green outline-none ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Write your article content here. Be detailed and informative..."
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                  <div className="text-xs text-gray-500 ml-auto">
                    {formData.description.length}/5000 characters
                  </div>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {categories.map(cat => {
                    const IconComponent = cat.icon
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleInputChange('category', cat.id)}
                        className={`p-3 rounded-lg border-2 text-center transition-all ${
                          formData.category === cat.id
                            ? 'border-dark-green bg-secondary bg-opacity-20 text-dark-green'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <IconComponent className="w-6 h-6 mx-auto mb-1" />
                        <div className="text-sm font-medium">{cat.name}</div>
                      </button>
                    )
                  })}
                </div>
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Images <span className="text-green-600 text-xs">(+5 points each, max 5)</span>
                </label>
                {formData.images.map((image, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <div className="relative flex-1">
                      <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="url"
                        value={image}
                        onChange={(e) => {
                          handleArrayFieldChange('images', index, e.target.value)
                          if (e.target.value && index === 0) validateImage(e.target.value)
                        }}
                        placeholder="https://example.com/image.jpg"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-green focus:border-dark-green outline-none"
                      />
                    </div>
                    {formData.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField('images', index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                {formData.images.length < 5 && (
                  <button
                    type="button"
                    onClick={() => addArrayField('images')}
                    className="text-dark-green hover:text-opacity-80 transition-colors text-sm font-medium"
                  >
                    + Add Another Image
                  </button>
                )}
                {imagePreview && (
                  <div className="mt-3">
                    <img src={imagePreview} alt="Preview" className="w-32 h-20 object-cover rounded-lg border" />
                  </div>
                )}
              </div>

              {/* Sources */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sources <span className="text-green-600 text-xs">(+10 points each, recommended)</span>
                </label>
                <p className="text-sm text-gray-600 mb-3">Add credible sources to support your article and increase points</p>
                {formData.sources.map((source, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <div className="relative flex-1">
                      <Link2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="url"
                        value={source}
                        onChange={(e) => handleArrayFieldChange('sources', index, e.target.value)}
                        placeholder="https://example.com/credible-source"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-green focus:border-dark-green outline-none"
                      />
                    </div>
                    {formData.sources.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField('sources', index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField('sources')}
                  className="text-dark-green hover:text-opacity-80 transition-colors text-sm font-medium"
                >
                  + Add Another Source
                </button>
              </div>

              {/* Source Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source Type *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {sourceTypes.map(type => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => handleInputChange('sourceType', type.id)}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        formData.sourceType === type.id
                          ? 'border-dark-green bg-secondary bg-opacity-20 text-dark-green'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="font-medium">{type.name}</div>
                      <div className="text-sm text-gray-600">{type.description}</div>
                    </button>
                  ))}
                </div>
                {errors.sourceType && <p className="text-red-500 text-sm mt-1">{errors.sourceType}</p>}
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (up to 8)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {formData.tags.map((tag, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="relative flex-1">
                        <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={tag}
                          onChange={(e) => handleArrayFieldChange('tags', index, e.target.value)}
                          placeholder={`Tag ${index + 1}`}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-green focus:border-dark-green outline-none"
                        />
                      </div>
                      {formData.tags.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayField('tags', index)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {formData.tags.length < 8 && (
                  <button
                    type="button"
                    onClick={() => addArrayField('tags')}
                    className="text-dark-green hover:text-opacity-80 transition-colors text-sm font-medium mt-2"
                  >
                    + Add Tag
                  </button>
                )}
              </div>

              {/* Priority and Language */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority Level
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-dark-green focus:border-dark-green outline-none"
                  >
                    <option value="low">Low - Standard review</option>
                    <option value="normal">Normal - Regular priority</option>
                    <option value="high">High - Urgent review needed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) => handleInputChange('language', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-dark-green focus:border-dark-green outline-none"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Guidelines */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">Submission Guidelines</h4>
                    <ul className="text-blue-800 text-sm space-y-1">
                      <li>• Write clear, accurate, and well-researched content</li>
                      <li>• Add credible sources to increase your point score</li>
                      <li>• Use relevant images to enhance your article</li>
                      <li>• Choose appropriate tags for better discoverability</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between pt-6">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <div className="space-x-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="px-6 py-2 bg-dark-green text-white rounded-lg hover:bg-opacity-90 transition-colors"
                  >
                    Review Submission
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Final Review */}
        {currentStep === 3 && (
          <div className="p-6">
            <div className="space-y-6">
              {/* Points Summary */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Final Review</h3>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{50 + calculatePointsBonus()} points</div>
                    <div className="text-sm text-green-700">You'll earn upon approval</div>
                  </div>
                </div>
                
                {/* Points Breakdown */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center p-2 bg-white rounded-lg">
                    <div className="font-semibold text-gray-900">50</div>
                    <div className="text-gray-600">Base Points</div>
                  </div>
                  {formData.subtitle.trim() && (
                    <div className="text-center p-2 bg-white rounded-lg">
                      <div className="font-semibold text-green-600">+5</div>
                      <div className="text-gray-600">Subtitle</div>
                    </div>
                  )}
                  {formData.sources.filter(s => s.trim()).length > 0 && (
                    <div className="text-center p-2 bg-white rounded-lg">
                      <div className="font-semibold text-green-600">+{formData.sources.filter(s => s.trim()).length * 10}</div>
                      <div className="text-gray-600">Sources</div>
                    </div>
                  )}
                  {formData.images.filter(img => img.trim()).length > 0 && (
                    <div className="text-center p-2 bg-white rounded-lg">
                      <div className="font-semibold text-green-600">+{formData.images.filter(img => img.trim()).length * 5}</div>
                      <div className="text-gray-600">Images</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Article Preview */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">{formData.title}</h4>
                    {formData.subtitle && (
                      <p className="text-lg text-gray-600 mt-1">{formData.subtitle}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="capitalize">{formData.category}</span>
                    <span>•</span>
                    <span className="capitalize">{formData.sourceType.replace('_', ' ')}</span>
                    <span>•</span>
                    <span className="capitalize">{formData.priority} Priority</span>
                  </div>
                  
                  <div className="prose max-w-none">
                    <p className="text-gray-700">{formData.description}</p>
                  </div>
                  
                  {/* Images Preview */}
                  {formData.images.filter(img => img.trim()).length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-600 block mb-2">Images:</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {formData.images.filter(img => img.trim()).map((img, index) => (
                          <div key={index} className="relative">
                            <img 
                              src={img} 
                              alt={`Preview ${index + 1}`} 
                              className="w-full h-20 object-cover rounded-lg border"
                              onError={(e) => {
                                e.target.style.display = 'none'
                                e.target.nextSibling.style.display = 'flex'
                              }}
                            />
                            <div className="hidden w-full h-20 bg-gray-100 rounded-lg border items-center justify-center">
                              <ImageIcon className="w-6 h-6 text-gray-400" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Sources */}
                  {formData.sources.filter(s => s.trim()).length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-600 block mb-2">Sources:</label>
                      <div className="space-y-1">
                        {formData.sources.filter(s => s.trim()).map((source, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm">
                            <Link2 className="w-4 h-4 text-gray-400" />
                            <a href={source} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                              {source}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Tags */}
                  {formData.tags.filter(tag => tag.trim()).length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-600 block mb-2">Tags:</label>
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.filter(tag => tag.trim()).map((tag, index) => (
                          <span key={index} className="bg-secondary px-3 py-1 rounded-full text-sm text-dark-green">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* URL for URL submissions */}
                  {submissionType === 'url' && formData.url && (
                    <div>
                      <label className="text-sm font-medium text-gray-600 block mb-1">Original URL:</label>
                      <a href={formData.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm break-all">
                        {formData.url}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900 mb-1">Submission Guidelines</h4>
                    <ul className="text-yellow-800 text-sm space-y-1">
                      <li>• Ensure the article URL is accessible and contains legitimate news content</li>
                      <li>• Double-check that the title and summary accurately represent the article</li>
                      <li>• Your submission will be reviewed by the community for accuracy and relevance</li>
                      <li>• False or misleading submissions may affect your reputation score</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-6">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Edit Submission
                </button>
                <div className="space-x-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-dark-green text-white rounded-lg hover:bg-opacity-90 transition-colors"
                  >
                    Submit Article
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}