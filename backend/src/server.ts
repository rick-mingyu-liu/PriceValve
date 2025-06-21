import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from './auth/steamAuth';
import { steamRoutes } from './routes/steam';
import { authRoutes } from './routes/auth';
import { errorHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

// Debug: Check if environment variables are loaded
console.log('🔧 Environment variables loaded:');
console.log('   PORT:', process.env.PORT);
console.log('   STEAM_API_KEY:', process.env.STEAM_API_KEY ? '✅ Found' : '❌ Not found');
console.log('   MONGODB_URI:', process.env.MONGODB_URI ? '✅ Found' : '❌ Not found');
console.log('');

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
connectDatabase().catch(console.error);

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-this',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/pricevalve',
    collectionName: 'sessions'
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const userAgent = req.get('User-Agent') || 'Unknown';
  
  console.log(`📊 ${timestamp} - ${method} ${url} - ${userAgent}`);
  next();
});

// API routes
app.use('/api/steam', steamRoutes);
app.use('/api', gameRoutes);
app.use('/api/data', dataRoutes);

// Authentication routes
app.use('/auth', authRoutes);

// Error handler
app.use(errorHandler);

// 404 fallback route - use correct Express wildcard syntax
app.use((req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    success: false,
    error: 'Route not found',
    message: 'Check the API documentation for available endpoints',
    path: req.originalUrl,
    method: req.method
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 PriceValve API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🎮 Game analysis: http://localhost:${PORT}/api/analyze/:appId`);
  console.log(`📈 Data fetching: http://localhost:${PORT}/api/data/game/:appId`);
  console.log(`📈 Database stats: http://localhost:${PORT}/api/stats`);
  console.log(`🔐 Auth endpoints: http://localhost:${PORT}/auth/steam`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('');
  console.log('📋 Available endpoints:');
  console.log('   POST /api/fetch - Fetch game data (single, multiple, trending, search)');
  console.log('   GET  /api/health - Health check and system status');
  console.log('   DELETE /api/cache - Clear cache');
  console.log('');

  if (!process.env.MONGODB_URI) {
    console.warn('⚠️  MONGODB_URI not found - using default local MongoDB');
  }

  if (!process.env.SESSION_SECRET) {
    console.warn('⚠️  SESSION_SECRET not found - using default secret (not recommended for production)');
  }
});

export default app;