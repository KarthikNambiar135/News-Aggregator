const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const authRoutes = require("./routes/authRoutes");
const articleRoutes = require('./routes/articleRoutes');
const factCheckRoutes = require('./routes/factCheckRoutes');
const sourceRoutes = require('./routes/sourceRoutes');
const communityRoutes = require('./routes/communityRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const voteRoutes = require("./routes/voteRoutes");
const annotationRoutes = require("./routes/annotationRoutes");
const healthRoutes = require("./routes/healthRoutes");
const { errorHandler } = require("./middlewares/errorMiddleware");

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(morgan("dev"));

// Root route for wake-up pings
app.get('/', (req, res) => {
  res.json({ 
    message: 'News Aggregator Backend is running!',
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Routes
app.use('/api/health', healthRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/factchecks', factCheckRoutes);
app.use('/api/sources', sourceRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/notifications', notificationRoutes);
app.use("/api/votes", voteRoutes);
app.use("/api/annotations", annotationRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    availableRoutes: [
      'GET /api/health',
      'POST /api/auth/login',
      'POST /api/auth/register',
      'GET /api/articles',
      'GET /api/community/leaderboard',
      'GET /api/sources'
    ]
  });
});

// Error Handler
app.use(errorHandler);

module.exports = app;
