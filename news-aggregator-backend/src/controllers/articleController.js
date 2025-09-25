const Article = require('../models/Article');
const User = require('../models/User');
const Source = require('../models/Source');
const FactCheck = require('../models/FactCheck');
const Notification = require('../models/Notification');
const { parseUrlContent } = require('../utils/parser');

// 🔹 Submit new article
exports.submitArticle = async (req, res) => {
  try {
    const { url, title, summary, category, tags, sourceName } = req.body;

    // Check if article with this URL already exists
    const existingArticle = await Article.findOne({ url });
    if (existingArticle) {
      return res.status(400).json({ message: 'Article with this URL already exists' });
    }

    // Auto-parse content from URL
    const parsed = await parseUrlContent(url);
    
    // Extract domain from URL
    const domain = new URL(url).hostname;
    
    // Find or create source
    let source = await Source.findOne({ domain });
    if (!source && sourceName) {
      source = await Source.create({
        name: sourceName,
        domain,
        type: 'news-publication',
        reliabilityScore: 50, // Default
        totalArticles: 1
      });
    }

    // Get user info for denormalization
    const user = await User.findById(req.user._id);

    const article = await Article.create({
      url,
      title: title || parsed.title || 'Untitled',
      summary: summary || parsed.summary,
      fullContent: parsed.fullContent,
      category: category || 'other',
      tags: tags?.length ? tags : parsed.tags || [],
      submittedBy: req.user._id,
      submittedByUsername: user.username,
      sourceName: sourceName || source?.name || domain,
      sourceDomain: domain,
      sourceReliability: source?.trustLevel || 'unknown',
      author: parsed.author,
      publishedAt: parsed.publishedAt,
      imageUrl: parsed.image,
      thumbnailUrl: parsed.image
    });

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { articlesSubmitted: 1 },
      lastActiveAt: new Date()
    });

    // Update source stats
    if (source) {
      await Source.findByIdAndUpdate(source._id, {
        $inc: { totalArticles: 1 }
      });
    }

    // Populate the response
    const populatedArticle = await Article.findById(article._id)
      .populate('submittedBy', 'name username role reputation badges');

    res.status(201).json({
      message: 'Article submitted successfully',
      article: populatedArticle
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Get all articles with filtering and search
exports.getArticles = async (req, res) => {
  try {
    const {
      category,
      status,
      sourceReliability,
      search,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      minCredibility,
      maxCredibility
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (category && category !== 'all') filter.category = category;
    if (status && status !== 'all') filter.status = status;
    if (sourceReliability && sourceReliability !== 'all') filter.sourceReliability = sourceReliability;
    
    if (minCredibility || maxCredibility) {
      filter.credibilityScore = {};
      if (minCredibility) filter.credibilityScore.$gte = parseInt(minCredibility);
      if (maxCredibility) filter.credibilityScore.$lte = parseInt(maxCredibility);
    }

    // Search functionality
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
        { sourceName: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (page - 1) * limit;

    const [articles, total] = await Promise.all([
      Article.find(filter)
        .populate('submittedBy', 'name username role reputation badges level')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      Article.countDocuments(filter)
    ]);

    res.json({
      articles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      filters: {
        category,
        status,
        sourceReliability,
        search
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Get single article with fact-checks
exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate('submittedBy', 'name username role reputation badges level');
      
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Get fact-checks for this article
    const factChecks = await FactCheck.find({ articleId: req.params.id })
      .populate('reviewer', 'name username role reputation badges level')
      .sort({ netVotes: -1, createdAt: -1 });

    // Increment view count
    await Article.findByIdAndUpdate(req.params.id, {
      $inc: { viewCount: 1 }
    });

    res.json({
      article,
      factChecks
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Get ranked articles
exports.getRankedArticles = async (req, res) => {
  try {
    const { timeframe = 'week' } = req.query;
    
    // Calculate date filter based on timeframe
    const now = new Date();
    let dateFilter = {};
    
    switch (timeframe) {
      case 'day':
        dateFilter.createdAt = { $gte: new Date(now - 24 * 60 * 60 * 1000) };
        break;
      case 'week':
        dateFilter.createdAt = { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) };
        break;
      case 'month':
        dateFilter.createdAt = { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) };
        break;
      default:
        // All time - no date filter
        break;
    }

    const articles = await Article.find(dateFilter)
      .populate('submittedBy', 'name username role reputation badges')
      .sort({ 
        credibilityScore: -1, 
        verifications: -1, 
        upvotes: -1, 
        viewCount: -1,
        createdAt: -1 
      })
      .limit(50);

    res.json({
      articles,
      timeframe
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch ranked articles." });
  }
};

// 🔹 Vote on article
exports.voteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { voteType } = req.body; // 'upvote' or 'downvote'
    
    if (!['upvote', 'downvote'].includes(voteType)) {
      return res.status(400).json({ message: 'Invalid vote type' });
    }

    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Check if user already voted (simplified - in production use Vote model)
    // For now, just increment/decrement
    const updateField = voteType === 'upvote' ? 'upvotes' : 'downvotes';
    
    await Article.findByIdAndUpdate(id, {
      $inc: { 
        [updateField]: 1,
        totalVotes: 1
      }
    });

    // Update user activity
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { totalVotes: 1 },
      lastActiveAt: new Date()
    });

    res.json({ message: 'Vote recorded successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Get trending articles
exports.getTrendingArticles = async (req, res) => {
  try {
    const articles = await Article.find({
      isTrending: true
    })
    .populate('submittedBy', 'name username role reputation badges')
    .sort({ viewCount: -1, createdAt: -1 })
    .limit(20);

    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Get articles by category
exports.getArticlesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const filter = category === 'all' ? {} : { category };
    const skip = (page - 1) * limit;

    const [articles, total] = await Promise.all([
      Article.find(filter)
        .populate('submittedBy', 'name username role reputation badges')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Article.countDocuments(filter)
    ]);

    res.json({
      articles,
      category,
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

// 🔹 Get user's submitted articles
exports.getUserArticles = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const [articles, total] = await Promise.all([
      Article.find({ submittedBy: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Article.countDocuments({ submittedBy: req.user._id })
    ]);

    res.json({
      articles,
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
