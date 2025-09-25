const express = require('express');
const {
  submitArticle,
  getArticles,
  getArticleById,
  voteArticle,
  getRankedArticles,
  getTrendingArticles,
  getArticlesByCategory,
  getUserArticles
} = require('../controllers/articleController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', getArticles); // Get all articles with filtering
router.get('/ranked', getRankedArticles); // Get ranked articles
router.get('/trending', getTrendingArticles); // Get trending articles
router.get('/category/:category', getArticlesByCategory); // Get articles by category
router.get('/:id', getArticleById); // Get single article by ID

// Protected routes
router.post('/', protect, submitArticle); // Submit new article
router.post('/:id/vote', protect, voteArticle); // Vote on article
router.get('/user/my-articles', protect, getUserArticles); // Get user's articles

module.exports = router;
