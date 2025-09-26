const FactCheck = require('../models/FactCheck');
const Article = require('../models/Article');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { checkAchievements } = require('../utils/achievements');

// 🔹 Submit fact-check
exports.submitFactCheck = async (req, res) => {
  try {
    console.log('🔹 Fact-check submission attempt:', {
      articleId: req.params.articleId,
      userId: req.user?._id,
      body: req.body
    });

    const { articleId } = req.params;
    const { verdict, confidence, evidence, sources, expertise } = req.body;

    // Validate article exists
    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Check if user already fact-checked this article
    const existingFactCheck = await FactCheck.findOne({
      articleId,
      reviewer: req.user._id
    });

    if (existingFactCheck) {
      return res.status(400).json({ 
        message: 'You have already fact-checked this article' 
      });
    }

    // Get user info
    console.log('📱 Getting user info...');
    const user = await User.findById(req.user._id);
    console.log('✅ User found:', user?.username);

    // Create fact-check
    console.log('📝 Creating fact-check with data:', {
      articleId,
      reviewer: req.user._id,
      reviewerUsername: user.username,
      verdict,
      confidence,
      evidence: evidence?.substring(0, 50) + '...',
      sourcesCount: sources?.length || 0,
      expertiseCount: expertise?.length || 0
    });

    const factCheck = await FactCheck.create({
      articleId,
      reviewer: req.user._id,
      reviewerUsername: user.username,
      verdict,
      confidence,
      evidence,
      sources: sources || [],
      expertise: expertise || user.specialties || [],
      reviewerReputationAtTime: user.reputation
    });
    
    console.log('✅ Fact-check created:', factCheck._id);

    // Update article stats
    console.log('📊 Updating article stats...');
    const verificationField = verdict === 'true' || verdict === 'mostly-true' ? 'verifications' : 'disputes';
    await Article.findByIdAndUpdate(articleId, {
      $inc: { 
        factCheckCount: 1,
        [verificationField]: 1
      }
    });
    console.log('✅ Article stats updated');

    // Calculate points for fact-checking
    const pointsEarned = 25; // Base points for fact-checking
    
    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 
        articlesVerified: 1,
        reputation: pointsEarned,
        totalPoints: pointsEarned
      },
      lastActiveAt: new Date()
    });

    // Calculate new credibility score for article
    try {
      await updateArticleCredibilityScore(articleId);
    } catch (credibilityError) {
      console.error('Error updating credibility score:', credibilityError);
      // Continue without failing the fact-check submission
    }

    // Create notification for article submitter
    try {
      if (article.submittedBy.toString() !== req.user._id.toString()) {
        await Notification.createNotification({
          userId: article.submittedBy,
          type: 'fact_check_disputed',
          title: 'New Fact-Check on Your Article',
          message: `${user.username} has fact-checked your article "${article.title}"`,
          relatedArticle: articleId,
          relatedFactCheck: factCheck._id,
          actionable: true,
          actionUrl: `/dashboard/article/${articleId}`,
          actionText: 'View Fact-Check',
          icon: 'Shield',
          color: verdict === 'true' || verdict === 'mostly-true' ? 'green' : 'red',
          category: 'verification'
        });
      }
    } catch (notificationError) {
      console.error('Error creating notification:', notificationError);
      // Continue without failing the fact-check submission
    }

    // Check for achievements
    let achievementResult = { achievements: [], levelUp: false };
    try {
      achievementResult = await checkAchievements(req.user._id);
    } catch (achievementError) {
      console.error('Error checking achievements:', achievementError);
      // Continue without failing the fact-check submission
    }

    // Populate response
    const populatedFactCheck = await FactCheck.findById(factCheck._id)
      .populate('reviewer', 'name username role reputation badges level');

    res.status(201).json({
      message: 'Fact-check submitted successfully',
      factCheck: populatedFactCheck,
      pointsEarned,
      newAchievements: achievementResult.achievements,
      levelUp: achievementResult.levelUp
    });
  } catch (error) {
    console.error('❌ Submit fact-check error:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 🔹 Get fact-checks for article
exports.getFactChecksForArticle = async (req, res) => {
  try {
    const { articleId } = req.params;
    const { sortBy = 'netVotes', order = 'desc' } = req.query;

    const factChecks = await FactCheck.find({ articleId })
      .populate('reviewer', 'name username role reputation badges level expertise')
      .sort({ [sortBy]: order === 'desc' ? -1 : 1, createdAt: -1 });

    // Calculate statistics
    const stats = {
      total: factChecks.length,
      verdicts: {
        true: factChecks.filter(fc => fc.verdict === 'true').length,
        'mostly-true': factChecks.filter(fc => fc.verdict === 'mostly-true').length,
        mixed: factChecks.filter(fc => fc.verdict === 'mixed').length,
        'mostly-false': factChecks.filter(fc => fc.verdict === 'mostly-false').length,
        false: factChecks.filter(fc => fc.verdict === 'false').length,
        unsubstantiated: factChecks.filter(fc => fc.verdict === 'unsubstantiated').length
      },
      averageConfidence: factChecks.reduce((sum, fc) => sum + fc.confidence, 0) / factChecks.length || 0,
      expertEndorsements: factChecks.reduce((sum, fc) => sum + fc.expertEndorsements, 0)
    };

    res.json({
      factChecks,
      stats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Vote on fact-check
exports.voteOnFactCheck = async (req, res) => {
  try {
    const { factCheckId } = req.params;
    const { voteType } = req.body; // 'upvote' or 'downvote'

    if (!['upvote', 'downvote'].includes(voteType)) {
      return res.status(400).json({ message: 'Invalid vote type' });
    }

    const factCheck = await FactCheck.findById(factCheckId);
    if (!factCheck) {
      return res.status(404).json({ message: 'Fact-check not found' });
    }

    // Simplified voting - in production, use Vote model to prevent duplicate votes
    const updateField = voteType === 'upvote' ? 'upvotes' : 'downvotes';
    
    await FactCheck.findByIdAndUpdate(factCheckId, {
      $inc: { [updateField]: 1 }
    });

    // Update reviewer reputation
    const reputationChange = voteType === 'upvote' ? 2 : -1;
    await User.findByIdAndUpdate(factCheck.reviewer, {
      $inc: { reputation: reputationChange }
    });

    res.json({ message: 'Vote recorded successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Get user's fact-checks
exports.getUserFactChecks = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const [factChecks, total] = await Promise.all([
      FactCheck.find({ reviewer: req.user._id })
        .populate('articleId', 'title url sourceName category status')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      FactCheck.countDocuments({ reviewer: req.user._id })
    ]);

    res.json({
      factChecks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Get fact-check by ID
exports.getFactCheckById = async (req, res) => {
  try {
    const factCheck = await FactCheck.findById(req.params.factCheckId)
      .populate('reviewer', 'name username role reputation badges level')
      .populate('articleId', 'title url sourceName category');

    if (!factCheck) {
      return res.status(404).json({ message: 'Fact-check not found' });
    }

    res.json(factCheck);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Update fact-check (by reviewer only)
exports.updateFactCheck = async (req, res) => {
  try {
    const { factCheckId } = req.params;
    const { verdict, confidence, evidence, sources } = req.body;

    const factCheck = await FactCheck.findById(factCheckId);
    if (!factCheck) {
      return res.status(404).json({ message: 'Fact-check not found' });
    }

    // Check if user is the reviewer
    if (factCheck.reviewer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only update your own fact-checks' });
    }

    // Update fact-check
    const updatedFactCheck = await FactCheck.findByIdAndUpdate(
      factCheckId,
      {
        verdict,
        confidence,
        evidence,
        sources
      },
      { new: true, runValidators: true }
    ).populate('reviewer', 'name username role reputation badges level');

    // Recalculate article credibility score
    await updateArticleCredibilityScore(factCheck.articleId);

    res.json({
      message: 'Fact-check updated successfully',
      factCheck: updatedFactCheck
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Get trending fact-checks (high engagement)
exports.getTrendingFactChecks = async (req, res) => {
  try {
    const factChecks = await FactCheck.find({
      netVotes: { $gte: 5 } // Minimum net votes to be considered trending
    })
    .populate('reviewer', 'name username role reputation badges level')
    .populate('articleId', 'title url sourceName category')
    .sort({ netVotes: -1, createdAt: -1 })
    .limit(20);

    res.json(factChecks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to update article credibility score
async function updateArticleCredibilityScore(articleId) {
  try {
    const factChecks = await FactCheck.find({ articleId });
    
    if (factChecks.length === 0) return;

    // Weighted scoring based on verdict and reviewer reputation
    let totalScore = 0;
    let totalWeight = 0;

    const verdictScores = {
      'true': 100,
      'mostly-true': 80,
      'mixed': 50,
      'mostly-false': 20,
      'false': 0,
      'unsubstantiated': 30
    };

    factChecks.forEach(fc => {
      const verdictScore = verdictScores[fc.verdict] || 50;
      const reputationWeight = Math.max(fc.reviewerReputationAtTime / 100, 0.1);
      const confidenceWeight = fc.confidence / 10;
      const voteWeight = Math.max((fc.netVotes + 10) / 10, 0.1);
      
      const weight = reputationWeight * confidenceWeight * voteWeight;
      
      totalScore += verdictScore * weight;
      totalWeight += weight;
    });

    const credibilityScore = Math.round(totalScore / totalWeight);
    
    // Determine consensus verdict
    const verdictCounts = {};
    factChecks.forEach(fc => {
      verdictCounts[fc.verdict] = (verdictCounts[fc.verdict] || 0) + 1;
    });
    
    const consensusVerdict = Object.keys(verdictCounts).reduce((a, b) => 
      verdictCounts[a] > verdictCounts[b] ? a : b
    );

    // Update article
    await Article.findByIdAndUpdate(articleId, {
      credibilityScore,
      consensusVerdict,
      status: credibilityScore >= 70 ? 'verified' : credibilityScore <= 30 ? 'disputed' : 'under-review'
    });

  } catch (error) {
    console.error('Error updating article credibility score:', error);
  }
}