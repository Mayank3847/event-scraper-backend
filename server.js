const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');
const connectDB = require('./config/database');
const { startScheduler } = require('./utils/scrapeScheduler');

// Load environment variables
dotenv.config();

// Initialize express
const app = express();

// Connect to database
connectDB();

// Passport config
require('./config/passport');

// Middleware
// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL?.replace(/\/$/, '') // Remove trailing slash if exists
].filter(Boolean);

// CORS configuration - allow frontend to access backend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

console.log('CORS enabled for:', process.env.FRONTEND_URL || 'http://localhost:3000');

// Log allowed origins for debugging
console.log('Allowed CORS origins:', allowedOrigins);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));

// Health check
// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Sydney Events API - Backend Server',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      events: '/api/events',
      auth: '/api/auth/google',
      documentation: 'See README for full API documentation'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start scraper scheduler
// startScheduler();
// Only run scrapers in development
if (process.env.NODE_ENV !== 'production') {
  startScheduler();
} else {
  console.log('Scraping disabled in production. Run locally to populate database.');
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});